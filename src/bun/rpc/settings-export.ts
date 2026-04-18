/**
 * Settings export/import RPC handlers.
 *
 * Exports / imports the full app configuration bundle:
 *   - All settings rows (general, user, notifications, mcp, git, …)
 *   - All AI providers (including API keys — stored locally, user's responsibility)
 *   - All channel configs (Discord, Email, WhatsApp config, NOT WhatsApp session keys)
 *   - Global notification preferences
 */
import { sqlite } from "../db/connection";
import { logAudit } from "../db/audit";

const SETTINGS_EXPORT_VERSION = 1;

export interface SettingsBundle {
	version: number;
	exportedAt: string;
	type: "autodesk-settings";
	settings: Array<{ key: string; value: string; category: string }>;
	aiProviders: Array<{
		name: string;
		providerType: string;
		apiKey: string;
		baseUrl: string | null;
		defaultModel: string | null;
		isDefault: boolean;
	}>;
	channels: Array<{
		platform: string;
		config: string;
		enabled: boolean;
	}>;
	notificationPreferences: Array<{
		platform: string;
		soundEnabled: boolean;
		badgeEnabled: boolean;
		bannerEnabled: boolean;
		muteUntil: string | null;
	}>;
}

export function exportSettings(): { data: string } {
	// Exclude:
	//   - project-specific settings (tied to project UUIDs, not portable)
	//   - internal system markers (keys starting with '_')
	//   - derived/computed status keys that become stale on a new machine
	const EXCLUDED_KEYS = ["github_status"];
	const settings = sqlite.prepare(
		`SELECT key, value, category FROM settings
		 WHERE category != 'project'
		   AND key NOT LIKE '\\_%' ESCAPE '\\'
		   AND key NOT IN (${EXCLUDED_KEYS.map(() => "?").join(",")})`
	).all(...EXCLUDED_KEYS) as Array<{
		key: string; value: string; category: string;
	}>;

	const providers = sqlite.prepare(
		"SELECT name, provider_type, api_key, base_url, default_model, is_default FROM ai_providers ORDER BY is_default DESC, name ASC"
	).all() as Array<{
		name: string; provider_type: string; api_key: string;
		base_url: string | null; default_model: string | null; is_default: number;
	}>;

	// Export channel configs but NOT whatsapp_sessions (device-specific pairing data)
	const channels = sqlite.prepare(
		"SELECT platform, config, enabled FROM channels ORDER BY platform ASC"
	).all() as Array<{ platform: string; config: string; enabled: number }>;

	// Export only global notification prefs (project_id IS NULL)
	const notifPrefs = sqlite.prepare(
		"SELECT platform, sound_enabled, badge_enabled, banner_enabled, mute_until FROM notification_preferences WHERE project_id IS NULL"
	).all() as Array<{
		platform: string; sound_enabled: number; badge_enabled: number;
		banner_enabled: number; mute_until: string | null;
	}>;

	const bundle: SettingsBundle = {
		version: SETTINGS_EXPORT_VERSION,
		exportedAt: new Date().toISOString(),
		type: "autodesk-settings",
		settings,
		aiProviders: providers.map((p) => ({
			name: p.name,
			providerType: p.provider_type,
			apiKey: p.api_key,
			baseUrl: p.base_url ?? null,
			defaultModel: p.default_model ?? null,
			isDefault: p.is_default === 1,
		})),
		channels: channels.map((c) => ({
			platform: c.platform,
			config: c.config,
			enabled: c.enabled === 1,
		})),
		notificationPreferences: notifPrefs.map((n) => ({
			platform: n.platform,
			soundEnabled: n.sound_enabled === 1,
			badgeEnabled: n.badge_enabled === 1,
			bannerEnabled: n.banner_enabled === 1,
			muteUntil: n.mute_until ?? null,
		})),
	};

	logAudit({ action: "settings.export", entityType: "settings", entityId: "all", details: {} });

	return { data: JSON.stringify(bundle, null, 2) };
}

export function importSettings(data: string): { success: boolean; error?: string } {
	let bundle: SettingsBundle;
	try {
		bundle = JSON.parse(data);
	} catch {
		return { success: false, error: "Invalid JSON file." };
	}

	if (bundle.type !== "autodesk-settings") {
		return { success: false, error: "Not a valid AutoDesk settings export file." };
	}
	if (bundle.version !== SETTINGS_EXPORT_VERSION) {
		return { success: false, error: `Unsupported version: ${bundle.version}` };
	}

	const tx = sqlite.transaction(() => {
		// Settings: upsert each row, skipping project-specific and internal keys
		// (guards against older exports that may have included them)
		const upsertSetting = sqlite.prepare(
			"INSERT INTO settings (id, key, value, category, created_at, updated_at) VALUES (lower(hex(randomblob(16))), ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, category = excluded.category, updated_at = CURRENT_TIMESTAMP"
		);
		const SKIP_KEYS = new Set(["github_status"]);
		for (const row of bundle.settings ?? []) {
			if (row.category === "project" || row.key.startsWith("_") || SKIP_KEYS.has(row.key)) continue;
			upsertSetting.run(row.key, row.value, row.category ?? "general");
		}

		// AI providers: full replace (clear existing, insert all from bundle)
		sqlite.prepare("DELETE FROM ai_providers").run();
		const insertProvider = sqlite.prepare(
			"INSERT INTO ai_providers (id, name, provider_type, api_key, base_url, default_model, is_default, is_valid, created_at, updated_at) VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
		);
		for (const p of bundle.aiProviders ?? []) {
			insertProvider.run(p.name, p.providerType, p.apiKey, p.baseUrl ?? null, p.defaultModel ?? null, p.isDefault ? 1 : 0);
		}

		// Channels: full replace (clear existing, insert all from bundle)
		sqlite.prepare("DELETE FROM channels").run();
		const insertChannel = sqlite.prepare(
			"INSERT INTO channels (id, platform, config, enabled, created_at, updated_at) VALUES (lower(hex(randomblob(16))), ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
		);
		for (const c of bundle.channels ?? []) {
			insertChannel.run(c.platform, c.config, c.enabled ? 1 : 0);
		}

		// Notification preferences (global only): full replace
		sqlite.prepare("DELETE FROM notification_preferences WHERE project_id IS NULL").run();
		const insertPref = sqlite.prepare(
			"INSERT INTO notification_preferences (id, platform, project_id, sound_enabled, badge_enabled, banner_enabled, mute_until, created_at) VALUES (lower(hex(randomblob(16))), ?, NULL, ?, ?, ?, ?, CURRENT_TIMESTAMP)"
		);
		for (const n of bundle.notificationPreferences ?? []) {
			insertPref.run(n.platform, n.soundEnabled ? 1 : 0, n.badgeEnabled ? 1 : 0, n.bannerEnabled ? 1 : 0, n.muteUntil ?? null);
		}
	});

	tx();

	logAudit({ action: "settings.import", entityType: "settings", entityId: "all", details: {} });

	return { success: true };
}

import { sqlite } from "./connection";
import { createBackup } from "../rpc/backup";
import * as v1 from "./migrations/v1_initial-schema";
import * as v2 from "./migrations/v2_plugin-prompt";
import * as v3 from "./migrations/v3_agent-sessions";
import * as v4 from "./migrations/v4_inline-agents";
import * as v5 from "./migrations/v5_message-parts-agent-name";
import * as v6 from "./migrations/v6_verification-status";
import * as v7 from "./migrations/v7_reviewer-tools";
import * as v8 from "./migrations/v8_perf-indexes";

// ---------------------------------------------------------------------------
// Versioned Database Migration System
//
// Uses SQLite's PRAGMA user_version to track which migrations have been applied.
// Each migration lives in its own file under ./migrations/v<N>_<name>.ts and
// exports `name: string` and `run(): void`.
//
// To add a new migration:
//   1. Create src/bun/db/migrations/v<N>_<description>.ts
//   2. Export `name` and `run()` from that file
//   3. Add an entry to the `migrations` array below
//
// The runner auto-backs up before any migration that runs on an existing DB
// (i.e. when user_version > 0) using the VACUUM INTO backup system.
// ---------------------------------------------------------------------------

interface Migration {
	version: number;
	name: string;
	run: () => void;
}

const migrations: Migration[] = [
	{ version: 1, name: v1.name, run: v1.run },
	{ version: 2, name: v2.name, run: v2.run },
	{ version: 3, name: v3.name, run: v3.run },
	{ version: 4, name: v4.name, run: v4.run },
	{ version: 5, name: v5.name, run: v5.run },
	{ version: 6, name: v6.name, run: v6.run },
	{ version: 7, name: v7.name, run: v7.run },
	{ version: 8, name: v8.name, run: v8.run },
];

const LATEST_VERSION = migrations[migrations.length - 1].version;

export function runMigrations(): void {
	const currentVersion: number =
		(sqlite.prepare("PRAGMA user_version").get() as { user_version: number } | null)
			?.user_version ?? 0;

	if (currentVersion >= LATEST_VERSION) {
		console.log(`[migrate] Schema is up-to-date (v${currentVersion}).`);
		return;
	}

	const pending = migrations.filter((m) => m.version > currentVersion);
	let backedUp = false;

	for (const migration of pending) {
		// Auto-backup before applying to an existing database, once per session
		if (currentVersion > 0 && !backedUp) {
			console.log("[migrate] Creating backup before schema upgrade...");
			try {
				const result = createBackup();
				console.log(`[migrate] Backup created: ${result.filename}`);
				backedUp = true;
			} catch (err) {
				throw new Error(`[migrate] Backup failed — aborting migration. ${err}`, { cause: err });
			}
		}

		console.log(`[migrate] Running migration v${migration.version}: ${migration.name}...`);

		sqlite.exec("BEGIN");
		try {
			migration.run();
			sqlite.exec("COMMIT");
		} catch (err) {
			sqlite.exec("ROLLBACK");
			throw new Error(
				`[migrate] Migration v${migration.version} (${migration.name}) failed: ${err}`,
				{ cause: err },
			);
		}

		// PRAGMA user_version must be set outside a transaction
		sqlite.exec(`PRAGMA user_version = ${migration.version}`);
		console.log(`[migrate] Completed v${migration.version}.`);
	}

	console.log("[migrate] All migrations applied.");
}

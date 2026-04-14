import { getSettings, saveSetting } from "./settings";
import { reloadMcpClients, getMcpStatus, reconnectMcpServer, disconnectMcpServer } from "../mcp/client";

export interface McpServerConfig {
	command: string;
	args?: string[];
	env?: Record<string, string>;
	disabled?: boolean;
}

/** Return the raw MCP config JSON string plus a parsed servers map. */
export async function getMcpConfig(): Promise<{
	raw: string;
	servers: Record<string, McpServerConfig>;
}> {
	const s = await getSettings("mcp");
	const raw = (s["mcp_config"] as string | undefined) ?? "{}";

	let servers: Record<string, McpServerConfig> = {};
	try {
		const parsed = JSON.parse(raw);
		// Support both { mcpServers: {...} } (Claude Desktop format) and flat { name: {...} }
		servers = parsed.mcpServers ?? parsed ?? {};
	} catch {
		// malformed JSON — return empty
	}

	return { raw, servers };
}

/** Return live connection status for all MCP servers. */
export function getMcpStatusRpc(): Record<string, "connected" | "connecting" | "failed" | "disabled"> {
	return getMcpStatus();
}

/** Reconnect a specific server by name, or all failed servers if name omitted. */
export async function reconnectMcpServerRpc(name?: string): Promise<{ success: boolean }> {
	await reconnectMcpServer(name).catch((err) => console.error("[mcp] Reconnect error:", err));
	return { success: true };
}

/** Disconnect a specific server by name. */
export async function disconnectMcpServerRpc(name: string): Promise<{ success: boolean }> {
	await disconnectMcpServer(name).catch((err) => console.error("[mcp] Disconnect error:", err));
	return { success: true };
}

/** Save (overwrite) the entire MCP config as a JSON string. Validates JSON first. */
export async function saveMcpConfig(configJson: string): Promise<{ success: boolean; error?: string }> {
	try {
		JSON.parse(configJson); // validate
	} catch (e) {
		return { success: false, error: `Invalid JSON: ${String(e)}` };
	}
	await saveSetting("mcp_config", configJson, "mcp");

	// Reload live connections with the new config (fire-and-forget)
	reloadMcpClients().catch((err) => console.error("[mcp] Reload error:", err));

	return { success: true };
}

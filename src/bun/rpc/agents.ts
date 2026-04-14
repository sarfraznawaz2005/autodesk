import { eq } from "drizzle-orm";
import { db } from "../db";
import { agents, agentTools } from "../db/schema";
import { logAudit } from "../db/audit";
import { getToolDefinitions, clearToolCache } from "../agents/tools/index";

export interface AgentListItem {
	id: string;
	name: string;
	displayName: string;
	color: string;
	isBuiltin: boolean;
	systemPrompt: string;
	providerId: string | null;
	modelId: string | null;
	temperature: string | null;
	maxTokens: number | null;
	isEnabled: boolean;
	thinkingBudget: string | null;
}

/**
 * Return all agents, mapping the integer isBuiltin column to a boolean.
 * Sorted alphabetically by displayName.
 */
export async function getAgentsList(): Promise<AgentListItem[]> {
	const rows = await db.select().from(agents);
	const mapped = rows.map((row) => ({
		id: row.id,
		name: row.name,
		displayName: row.displayName,
		color: row.color,
		isBuiltin: row.isBuiltin === 1,
		systemPrompt: row.systemPrompt,
		providerId: row.providerId ?? null,
		modelId: row.modelId ?? null,
		temperature: row.temperature ?? null,
		maxTokens: row.maxTokens ?? null,
		isEnabled: row.isEnabled === 1,
		thinkingBudget: row.thinkingBudget ?? null,
	}));
	return mapped.sort((a, b) => a.displayName.localeCompare(b.displayName));
}

/**
 * Update mutable fields on an agent by id.
 */
export async function updateAgent(params: {
	id: string;
	displayName?: string;
	color?: string;
	systemPrompt?: string;
	providerId?: string;
	modelId?: string;
	temperature?: string;
	maxTokens?: number;
	isEnabled?: boolean;
	thinkingBudget?: string | null;
}): Promise<{ success: boolean }> {
	const updates: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(params)) {
		if (key !== "id" && value !== undefined) updates[key] = value;
	}
	await db.update(agents).set(updates).where(eq(agents.id, params.id));
	logAudit({ action: "agent.update", entityType: "agent", entityId: params.id });
	return { success: true };
}

/**
 * Reset a built-in agent's overrides back to defaults.
 * Only works for agents where isBuiltin = 1.
 */
export async function resetAgent(id: string): Promise<{ success: boolean; error?: string }> {
	const agent = await db.select().from(agents).where(eq(agents.id, id));
	if (!agent[0] || !agent[0].isBuiltin) {
		return { success: false, error: "Not a built-in agent" };
	}
	await db
		.update(agents)
		.set({
			systemPrompt: "",
			providerId: null,
			modelId: null,
			temperature: null,
			maxTokens: null,
			isEnabled: 1,
			thinkingBudget: null,
		})
		.where(eq(agents.id, id));
	return { success: true };
}

/**
 * Create a new custom agent.
 */
export async function createAgent(params: {
	name: string;
	displayName: string;
	color: string;
	systemPrompt: string;
	providerId?: string;
	modelId?: string;
}): Promise<{ success: boolean; id?: string }> {
	const id = crypto.randomUUID();
	await db.insert(agents).values({
		id,
		name: params.name,
		displayName: params.displayName,
		color: params.color,
		systemPrompt: params.systemPrompt,
		isBuiltin: 0,
		providerId: params.providerId ?? null,
		modelId: params.modelId ?? null,
	});
	logAudit({ action: "agent.create", entityType: "agent", entityId: id, details: { name: params.name, displayName: params.displayName } });
	return { success: true, id };
}

/**
 * Delete a custom (non-built-in) agent by id.
 */
export async function deleteAgent(id: string): Promise<{ success: boolean; error?: string }> {
	const agent = await db.select().from(agents).where(eq(agents.id, id));
	if (!agent[0] || agent[0].isBuiltin === 1) {
		return { success: false, error: "Cannot delete built-in agents" };
	}
	await db.delete(agentTools).where(eq(agentTools.agentId, id));
	await db.delete(agents).where(eq(agents.id, id));
	logAudit({ action: "agent.delete", entityType: "agent", entityId: id });
	return { success: true };
}

// ---------------------------------------------------------------------------
// Agent Tools CRUD
// ---------------------------------------------------------------------------

/**
 * Get tool assignments for an agent.
 */
export async function getAgentToolsList(agentId: string): Promise<Array<{ toolName: string; isEnabled: boolean }>> {
	const rows = await db
		.select({ toolName: agentTools.toolName, isEnabled: agentTools.isEnabled })
		.from(agentTools)
		.where(eq(agentTools.agentId, agentId));
	return rows.map((r) => ({ toolName: r.toolName, isEnabled: r.isEnabled === 1 }));
}

/**
 * Replace all tool assignments for an agent.
 * Clears the tool config cache so the next getToolsForAgent() picks up changes.
 */
export async function setAgentToolsList(
	agentId: string,
	tools: Array<{ toolName: string; isEnabled: boolean }>,
): Promise<{ success: boolean }> {
	// Look up agent name for cache invalidation
	const agentRows = await db.select({ name: agents.name }).from(agents).where(eq(agents.id, agentId)).limit(1);
	const agentName = agentRows[0]?.name;

	// Delete existing rows and insert new ones
	await db.delete(agentTools).where(eq(agentTools.agentId, agentId));
	if (tools.length > 0) {
		const rows = tools.map((t) => ({
			id: crypto.randomUUID(),
			agentId,
			toolName: t.toolName,
			isEnabled: t.isEnabled ? (1 as const) : (0 as const),
		}));
		await db.insert(agentTools).values(rows);
	}

	// Invalidate cache
	if (agentName) clearToolCache(agentName);

	logAudit({ action: "agent.tools.update", entityType: "agent", entityId: agentId });
	return { success: true };
}

/**
 * Return all registered tool definitions for UI display.
 */
export function getAllToolDefinitions(): Array<{ name: string; category: string; description: string }> {
	return getToolDefinitions();
}

/**
 * Reset agent tools to defaults (re-seed from defaultAgentTools).
 */
export async function resetAgentToolsToDefaults(agentId: string): Promise<{ success: boolean }> {
	const agentRows = await db.select({ name: agents.name }).from(agents).where(eq(agents.id, agentId)).limit(1);
	const agentName = agentRows[0]?.name;
	if (!agentName) return { success: false };

	// Import default tool mapping from seed
	const { getDefaultAgentTools } = await import("../db/seed");
	const defaultTools = getDefaultAgentTools(agentName);

	await db.delete(agentTools).where(eq(agentTools.agentId, agentId));
	if (defaultTools.length > 0) {
		const rows = defaultTools.map((toolName) => ({
			id: crypto.randomUUID(),
			agentId,
			toolName,
			isEnabled: 1 as const,
		}));
		await db.insert(agentTools).values(rows);
	}

	clearToolCache(agentName);
	logAudit({ action: "agent.tools.reset", entityType: "agent", entityId: agentId });
	return { success: true };
}

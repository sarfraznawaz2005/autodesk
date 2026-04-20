// src/bun/scheduler/task-executor.ts
import { writeInboxMessage, updateAgentResponse } from "../rpc/inbox";
import { sendDesktopNotification } from "../notifications/desktop";
import { createConversation } from "../rpc/conversations";
import { db } from "../db";
import { aiProviders, agents as agentsTable, projects } from "../db/schema";
import { eq } from "drizzle-orm";
import { getDefaultModel } from "../providers/models";
import { createProviderAdapter } from "../providers";

export type TaskType = "pm_prompt" | "reminder" | "shell" | "webhook" | "agent_task" | "agent_task_simple" | "send_channel_message";

export interface TaskResult {
	success: boolean;
	output?: string;
	error?: string;
	durationMs: number;
}

type GetOrCreateEngine = (projectId: string) => { sendMessage: (conversationId: string, content: string) => Promise<unknown> };

let engineResolver: GetOrCreateEngine | null = null;

export function setTaskExecutorEngine(resolver: GetOrCreateEngine): void {
	engineResolver = resolver;
}

export async function executeTask(
	taskType: TaskType,
	config: Record<string, unknown>,
): Promise<TaskResult> {
	const start = Date.now();

	try {
		let output = "";

		switch (taskType) {
			case "pm_prompt": {
				// Legacy: treat as agent_task with project-manager
				const projectId = config.projectId as string;
				const prompt = (config.prompt ?? config.instructions) as string;
				if (!projectId || !prompt) throw new Error("pm_prompt requires projectId and prompt");
				if (!engineResolver) throw new Error("Engine not initialized");
				const { id: conversationId } = await createConversation(projectId, "Scheduled prompt");
				await engineResolver(projectId).sendMessage(conversationId, prompt);
				output = "Agent task dispatched";
				break;
			}

			case "reminder": {
				const message = config.message as string;
				if (!message) throw new Error("reminder requires message");
				await writeInboxMessage({
					projectId: config.projectId as string | undefined,
					channelId: "cron",
					sender: "Scheduler",
					content: message,
					platform: "scheduler",
				});
				await sendDesktopNotification("Reminder", message.slice(0, 100));
				output = "Reminder sent to inbox";
				break;
			}

			case "shell": {
				const command = config.command as string;
				if (!command) throw new Error("shell requires command");
				const timeout = (config.timeout as number) ?? 60_000;
				const cwd = config.cwd as string | undefined;

				const proc = Bun.spawn(["sh", "-c", command], {
					cwd: cwd || undefined,
					stdout: "pipe",
					stderr: "pipe",
				});

				const timeoutId = setTimeout(() => proc.kill(), timeout);
				const [stdout, stderr] = await Promise.all([
					new Response(proc.stdout).text(),
					new Response(proc.stderr).text(),
				]);
				clearTimeout(timeoutId);
				const exitCode = await proc.exited;

				output = stdout || stderr;
				if (exitCode !== 0) {
					throw new Error(`Shell command exited with code ${exitCode}: ${stderr || stdout}`);
				}
				break;
			}

			case "webhook": {
				const url = config.url as string;
				if (!url) throw new Error("webhook requires url");
				const method = (config.method as string) ?? "POST";
				const headers = (config.headers as Record<string, string>) ?? {};
				const body = config.body as string | undefined;
				const timeout = (config.timeout as number) ?? 30_000;

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), timeout);

				const response = await fetch(url, {
					method,
					headers,
					body: body || undefined,
					signal: controller.signal,
				});
				clearTimeout(timeoutId);

				output = `HTTP ${response.status} ${response.statusText}`;
				if (!response.ok) {
					throw new Error(`Webhook returned ${response.status}: ${await response.text()}`);
				}
				break;
			}

			case "agent_task": {
				const projectId = config.projectId as string;
				const instructions = config.instructions as string;
				const agentId = (config.agentId as string | undefined) || "project-manager";
				if (!projectId || !instructions) throw new Error("agent_task requires projectId and instructions");

				if (agentId === "project-manager") {
					// Route through the PM engine (existing behavior)
					if (!engineResolver) throw new Error("Engine not initialized");
					const { id: convId } = await createConversation(projectId, "Scheduled agent task");
					await engineResolver(projectId).sendMessage(convId, instructions);
				} else {
					// Run the specified agent directly via runInlineAgent
					const { runInlineAgent, READ_ONLY_AGENTS } = await import("../agents/agent-loop");

					// Resolve provider config
					let providerRows = await db.select().from(aiProviders)
						.where(eq(aiProviders.isDefault, 1)).limit(1);
					if (providerRows.length === 0) {
						providerRows = await db.select().from(aiProviders).limit(1);
					}
					if (providerRows.length === 0) throw new Error("No AI providers configured");
					const providerRow = providerRows[0];
					const providerConfig = {
						id: providerRow.id,
						name: providerRow.name,
						providerType: providerRow.providerType,
						apiKey: providerRow.apiKey,
						baseUrl: providerRow.baseUrl,
						defaultModel: providerRow.defaultModel,
					};
					const modelId = providerRow.defaultModel ?? getDefaultModel(providerRow.providerType);

					// Resolve agent display name
					const agentRows = await db.select({ displayName: agentsTable.displayName })
						.from(agentsTable).where(eq(agentsTable.name, agentId)).limit(1);
					const agentDisplayName = agentRows[0]?.displayName ?? agentId;

					// Resolve project workspace path
					const projectRows = await db.select({ workspacePath: projects.workspacePath })
						.from(projects).where(eq(projects.id, projectId)).limit(1);
					const workspacePath = projectRows[0]?.workspacePath ?? undefined;

					const { id: convId } = await createConversation(projectId, `Scheduled: ${agentDisplayName}`);
					const projectContext = [
						workspacePath ? `Workspace: ${workspacePath}` : "",
						`Project ID: ${projectId}`,
					].filter(Boolean).join("\n");

					// No-op callbacks — scheduled runs have no live UI to update
					const callbacks = {
						onPartCreated: () => {},
						onPartUpdated: () => {},
						onTextDelta: () => {},
						onAgentStart: () => {},
						onAgentComplete: () => {},
					};

					const result = await runInlineAgent({
						conversationId: convId,
						agentName: agentId,
						agentDisplayName,
						task: instructions,
						projectContext,
						providerConfig,
						modelId,
						readOnly: READ_ONLY_AGENTS.has(agentId),
						workspacePath: workspacePath ?? undefined,
						projectId,
						callbacks,
					});
					output = `Agent task completed: ${result.status}`;
				}
				output = output || "Agent task dispatched";
				break;
			}

			case "agent_task_simple": {
				const instructions = config.instructions as string;
				const agentId = (config.agentId as string | undefined) || "project-manager";
				const jobName = (config._jobName as string | undefined) || "Agent Task";
				if (!instructions) throw new Error("agent_task_simple requires instructions");

				// Resolve provider
				let providerRows = await db.select().from(aiProviders)
					.where(eq(aiProviders.isDefault, 1)).limit(1);
				if (providerRows.length === 0) {
					providerRows = await db.select().from(aiProviders).limit(1);
				}
				if (providerRows.length === 0) throw new Error("No AI providers configured");
				const providerRow = providerRows[0];
				const modelId = providerRow.defaultModel ?? getDefaultModel(providerRow.providerType);

				// Resolve agent system prompt, then append skills + MCP context
				// so the agent knows what skills are available (same as project agents)
				const agentRows = await db.select({ systemPrompt: agentsTable.systemPrompt })
					.from(agentsTable).where(eq(agentsTable.name, agentId)).limit(1);
				const baseSystemPrompt = agentRows[0]?.systemPrompt ?? "";
				const { buildSkillsDescriptionSection, buildAgentMcpSection } = await import("../agents/prompts");
				const skillsSection = buildSkillsDescriptionSection();
				const mcpSection = await buildAgentMcpSection();
				const systemPrompt = [baseSystemPrompt, skillsSection, mcpSection].filter(Boolean).join("\n\n---\n\n");

				// Write user instruction to inbox
				const threadId = crypto.randomUUID();
				const { id: msgId } = await writeInboxMessage({
					channelId: "cron",
					sender: jobName,
					content: instructions,
					platform: "scheduler",
					threadId,
				});

				// Run agent with full tool set (skills, MCP, plugins, web) — no project/conversation needed
				let responseText = "";
				try {
					const { generateText } = await import("ai");
					const { getToolsForAgent } = await import("../agents/tools/index");
					const { getPluginTools } = await import("../agents/engine-types");
					const { getMcpTools } = await import("../mcp/client");

					const adapter = createProviderAdapter({
						id: providerRow.id,
						name: providerRow.name,
						providerType: providerRow.providerType,
						apiKey: providerRow.apiKey,
						baseUrl: providerRow.baseUrl,
						defaultModel: providerRow.defaultModel,
					});

					// Assemble the same tool set runInlineAgent uses: agent-specific tools +
					// plugin tools + MCP tools. Skills (read_skill, find_skills) are included
					// in getToolsForAgent so the agent can call skills like it would in a project.
					const baseTools = await getToolsForAgent(agentId);
					const pluginTools = await getPluginTools();
					const mcpTools = getMcpTools();
					const allTools = { ...baseTools, ...pluginTools, ...mcpTools };

					const result = await generateText({
						model: adapter.createModel(modelId),
						system: systemPrompt,
						prompt: instructions,
						tools: allTools,
						// Stop when the model produces a final text response with no tool calls
						stopWhen: [
							({ steps }) => {
								if (steps.length === 0) return false;
								const last = steps[steps.length - 1];
								return !last.toolCalls || last.toolCalls.length === 0;
							},
						],
					});
					responseText = result.text.trim();
				} catch (err) {
					responseText = `Error: ${err instanceof Error ? err.message : String(err)}`;
				}

				// Update inbox message with agent response (shows "Replied" badge)
				if (responseText) {
					await updateAgentResponse(msgId, responseText);
				}

				// Desktop notification
				const notifSuccess = !responseText.startsWith("Error:");
				await sendDesktopNotification(
					notifSuccess ? `✓ ${jobName}` : `✗ ${jobName} failed`,
					notifSuccess ? "Task executed successfully" : responseText.slice(0, 120),
				).catch(() => {});

				// Broadcast result to all connected channels
				if (notifSuccess && responseText) {
					const { broadcastSchedulerResult } = await import("../channels/manager");
					await broadcastSchedulerResult(jobName, responseText).catch(() => {});
				}

				output = notifSuccess ? `Executed successfully` : responseText;
				if (!notifSuccess) throw new Error(responseText);
				break;
			}

			case "send_channel_message": {
				const { sendChannelMessage } = await import("../channels/manager");
				const channelId = config.channelId as string;
				const content = config.content as string;
				if (!channelId || !content) throw new Error("send_channel_message requires channelId and content");
				await sendChannelMessage(channelId, content);
				output = `Message sent to channel ${channelId}`;
				break;
			}

			default:
				throw new Error(`Unknown task type: ${taskType}`);
		}

		return { success: true, output, durationMs: Date.now() - start };
	} catch (err) {
		return {
			success: false,
			error: err instanceof Error ? err.message : String(err),
			durationMs: Date.now() - start,
		};
	}
}

// src/bun/scheduler/task-executor.ts
import { writeInboxMessage } from "../rpc/inbox";
import { sendDesktopNotification } from "../notifications/desktop";
import { createConversation } from "../rpc/conversations";

export type TaskType = "pm_prompt" | "reminder" | "shell" | "webhook" | "agent_task" | "send_channel_message";

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
				const projectId = config.projectId as string;
				const prompt = config.prompt as string;
				if (!projectId || !prompt) throw new Error("pm_prompt requires projectId and prompt");
				if (!engineResolver) throw new Error("Engine not initialized");
				const { id: conversationId } = await createConversation(projectId, "Scheduled prompt");
				await engineResolver(projectId).sendMessage(conversationId, prompt);
				output = "PM prompt sent";
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
				if (!projectId || !instructions) throw new Error("agent_task requires projectId and instructions");
				if (!engineResolver) throw new Error("Engine not initialized");
				const { id: agentConversationId } = await createConversation(projectId, "Scheduled agent task");
				await engineResolver(projectId).sendMessage(agentConversationId, instructions);
				output = "Agent task dispatched";
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

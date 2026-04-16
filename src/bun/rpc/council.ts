/**
 * Council RPC — runs a multi-agent discussion session where the PM picks
 * relevant agents, facilitates up to 4 discussion rounds, and synthesizes
 * a final answer for the user.
 *
 * Events are broadcast via broadcastToWebview("council-event", {...}).
 * The frontend listens on the `autodesk:council-event` window event.
 */

import { generateText, streamText } from "ai";
import type { LanguageModel } from "ai";
import { db } from "../db";
import { aiProviders } from "../db/schema";
import { eq } from "drizzle-orm";
import { createProviderAdapter, getDefaultModel } from "../providers";
import { broadcastToWebview } from "../engine-manager";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_TURNS_PER_AGENT = 10;
const TURNS_WARNING_THRESHOLD = 3;
const MAX_ROUNDS = 4;

const COUNCIL_AGENTS = [
  { name: "software-architect", displayName: "Software Architect", color: "#8b5cf6" },
  { name: "backend-engineer", displayName: "Backend Engineer", color: "#3b82f6" },
  { name: "frontend_engineer", displayName: "Frontend Engineer", color: "#06b6d4" },
  { name: "database-expert", displayName: "Database Expert", color: "#f59e0b" },
  { name: "security-expert", displayName: "Security Expert", color: "#ef4444" },
  { name: "api-designer", displayName: "API Designer", color: "#10b981" },
  { name: "ui-ux-designer", displayName: "UI/UX Designer", color: "#ec4899" },
  { name: "performance-expert", displayName: "Performance Expert", color: "#f97316" },
  { name: "devops-engineer", displayName: "DevOps Engineer", color: "#6366f1" },
  { name: "ml-engineer", displayName: "ML Engineer", color: "#14b8a6" },
] as const;

// ---------------------------------------------------------------------------
// Session state
// ---------------------------------------------------------------------------

interface CouncilSession {
  sessionId: string;
  abortController: AbortController;
  questionResolvers: Map<string, (answer: string) => void>;
}

const activeSessions = new Map<string, CouncilSession>();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emit(sessionId: string, payload: Record<string, unknown>): void {
  broadcastToWebview("councilEvent", { sessionId, ...payload });
}

async function resolveProvider(): Promise<{
  model: LanguageModel;
  modelId: string;
}> {
  const rows = await db.select().from(aiProviders).where(eq(aiProviders.isDefault, 1)).limit(1);
  const providerRow = rows[0] ?? (await db.select().from(aiProviders).limit(1))[0];
  if (!providerRow) throw new Error("No AI provider configured");

  const modelId = providerRow.defaultModel || getDefaultModel(providerRow.providerType);
  const adapter = createProviderAdapter({
    id: providerRow.id,
    name: providerRow.name,
    providerType: providerRow.providerType,
    apiKey: providerRow.apiKey ?? "",
    baseUrl: providerRow.baseUrl ?? null,
    defaultModel: providerRow.defaultModel ?? null,
  });

  return { model: adapter.createModel(modelId), modelId };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function startCouncilSession(query: string): Promise<{ sessionId: string }> {
  const sessionId = `council-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const abortController = new AbortController();
  const session: CouncilSession = {
    sessionId,
    abortController,
    questionResolvers: new Map(),
  };
  activeSessions.set(sessionId, session);

  // Run the session asynchronously — return the sessionId immediately
  runSession(session, query).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    if (message !== "AbortError" && !message.includes("aborted")) {
      emit(sessionId, { type: "error", message });
    }
    emit(sessionId, { type: "session-ended" });
    activeSessions.delete(sessionId);
  });

  return { sessionId };
}

export function stopCouncilSession(sessionId: string): void {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.abortController.abort();
    activeSessions.delete(sessionId);
  }
}

export function answerCouncilQuestion(
  sessionId: string,
  questionId: string,
  answer: string,
): void {
  const session = activeSessions.get(sessionId);
  if (!session) return;
  const resolve = session.questionResolvers.get(questionId);
  if (resolve) {
    resolve(answer);
    session.questionResolvers.delete(questionId);
  }
}

// ---------------------------------------------------------------------------
// Core session logic
// ---------------------------------------------------------------------------

async function runSession(session: CouncilSession, query: string): Promise<void> {
  const { sessionId, abortController } = session;
  const signal = abortController.signal;

  emit(sessionId, { type: "session-started", query });
  emit(sessionId, { type: "pm-status", message: "PM is assembling the council..." });

  const { model } = await resolveProvider();

  // ── Step 1: PM selects 2–5 relevant agents ─────────────────────────────
  const agentListStr = COUNCIL_AGENTS.map((a) => a.name).join(", ");

  const selectionResult = await generateText({
    model,
    abortSignal: signal,
    system: `You are the Project Manager for a council of AI experts. Your job is to select the most relevant experts from the available roster to answer the user's question. Always select between 2 and 5 agents. Respond with ONLY a valid JSON array of agent names, e.g.: ["backend-engineer","security-expert"]. No markdown, no explanation.`,
    messages: [
      {
        role: "user",
        content: `Available agents: ${agentListStr}\n\nUser question: ${query}\n\nWhich 2-5 agents should participate in this council?`,
      },
    ],
  });

  let selectedNames: string[] = [];
  try {
    const raw = selectionResult.text.trim();
    // Extract JSON array even if wrapped in markdown
    const match = raw.match(/\[[\s\S]*\]/);
    selectedNames = JSON.parse(match ? match[0] : raw) as string[];
  } catch {
    // Fallback: pick first 3
    selectedNames = [COUNCIL_AGENTS[0].name, COUNCIL_AGENTS[1].name, COUNCIL_AGENTS[2].name];
  }

  // Validate names against roster
  const selectedAgents = selectedNames
    .map((name) => COUNCIL_AGENTS.find((a) => a.name === name))
    .filter((a): a is (typeof COUNCIL_AGENTS)[number] => a !== undefined)
    .slice(0, 5);

  if (selectedAgents.length < 2) {
    selectedAgents.push(...COUNCIL_AGENTS.slice(0, 2 - selectedAgents.length));
  }

  emit(sessionId, {
    type: "agents-selected",
    agents: selectedAgents.map((a) => ({ name: a.name, displayName: a.displayName, color: a.color })),
  });
  emit(sessionId, { type: "pm-status", message: "PM is reviewing your question..." });

  // ── Step 2: PM checks if clarification is needed ───────────────────────
  const clarificationResult = await generateText({
    model,
    abortSignal: signal,
    system: `You are the Project Manager facilitating an expert council discussion. Determine if the user's question needs clarification before proceeding. If yes, respond with "QUESTION: <your question>" (one concise question only). If the question is clear enough, respond with "PROCEED".`,
    messages: [
      { role: "user", content: `User question: ${query}` },
    ],
  });

  const clarificationText = clarificationResult.text.trim();

  if (clarificationText.startsWith("QUESTION:")) {
    const questionText = clarificationText.replace(/^QUESTION:\s*/, "").trim();
    const questionId = `q-${Date.now()}`;

    emit(sessionId, { type: "question", questionId, question: questionText });

    // Await the user's answer via a Promise resolved by answerCouncilQuestion
    const userAnswer = await new Promise<string>((resolve, reject) => {
      session.questionResolvers.set(questionId, resolve);
      signal.addEventListener("abort", () => reject(new Error("AbortError")), { once: true });
    });

    // Incorporate the answer into the query context
    query = `${query}\n\nAdditional context from user: ${userAnswer}`;
  }

  // ── Step 3: Discussion rounds ──────────────────────────────────────────
  emit(sessionId, { type: "pm-status", message: `Council assembled: ${selectedAgents.map((a) => a.displayName).join(", ")}. Starting discussion...` });

  const turnsUsed = new Map<string, number>(selectedAgents.map((a) => [a.name, 0]));
  const discussionHistory: Array<{ agentName: string; displayName: string; content: string }> = [];

  for (let round = 0; round < MAX_ROUNDS; round++) {
    if (signal.aborted) break;

    for (const agent of selectedAgents) {
      if (signal.aborted) break;

      const used = turnsUsed.get(agent.name) ?? 0;
      const turnsLeft = MAX_TURNS_PER_AGENT - used;
      if (turnsLeft <= 0) continue;

      emit(sessionId, { type: "agent-thinking", agentName: agent.name });

      // Build the system prompt for this agent
      const warningNote =
        turnsLeft <= TURNS_WARNING_THRESHOLD
          ? `\n\n⚠️ You have only ${turnsLeft} turn(s) remaining. Be concise and focus on your most important points.`
          : "";

      const systemPrompt = `You are the ${agent.displayName} in an expert council. You are discussing the following question with your peers: "${query}"

You have NO access to tools. Your role is to share expertise, provide technical insights, and engage with what the other experts have said.${warningNote}

Keep your response focused and concise (2-4 paragraphs maximum). Engage with points made by other experts when relevant.`;

      // Build messages from discussion history
      const priorDiscussion =
        discussionHistory.length > 0
          ? discussionHistory
              .map((h) => `[${h.displayName}]: ${h.content}`)
              .join("\n\n")
          : "No prior discussion yet.";

      let agentResponse = "";

      const stream = streamText({
        model,
        abortSignal: signal,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `User question: ${query}\n\nDiscussion so far:\n${priorDiscussion}\n\nPlease share your perspective as ${agent.displayName}.`,
          },
        ],
      });

      for await (const chunk of stream.textStream) {
        if (signal.aborted) break;
        agentResponse += chunk;
        emit(sessionId, { type: "agent-token", agentName: agent.name, token: chunk });
      }

      const newUsed = used + 1;
      turnsUsed.set(agent.name, newUsed);
      const newTurnsLeft = MAX_TURNS_PER_AGENT - newUsed;

      emit(sessionId, {
        type: "agent-response-complete",
        agentName: agent.name,
        turnsLeft: newTurnsLeft,
      });

      if (agentResponse.trim()) {
        discussionHistory.push({
          agentName: agent.name,
          displayName: agent.displayName,
          content: agentResponse.trim(),
        });
      }
    }

    if (signal.aborted) break;

    // ── PM consensus check ───────────────────────────────────────────────
    const discussionSummary = discussionHistory
      .map((h) => `[${h.displayName}]: ${h.content}`)
      .join("\n\n");

    const consensusResult = await generateText({
      model,
      abortSignal: signal,
      system: `You are the Project Manager reviewing a council discussion. Determine if the experts have covered the topic sufficiently to provide a final answer. Respond with only "CONSENSUS" if enough ground has been covered, or "CONTINUE" if more discussion is needed.`,
      messages: [
        {
          role: "user",
          content: `User question: ${query}\n\nDiscussion:\n${discussionSummary}`,
        },
      ],
    });

    if (consensusResult.text.trim().toUpperCase().includes("CONSENSUS")) {
      break;
    }
  }

  if (signal.aborted) return;

  // ── Step 4: PM synthesizes the final answer ────────────────────────────
  emit(sessionId, { type: "pm-synthesizing" });

  const discussionSummary = discussionHistory
    .map((h) => `[${h.displayName}]: ${h.content}`)
    .join("\n\n");

  const finalStream = streamText({
    model,
    abortSignal: signal,
    system: `You are the Project Manager synthesizing the council's discussion into a clear, comprehensive final answer. Integrate the key insights from all experts. Be thorough but structured. Use markdown formatting where appropriate (headers, bullet points, code blocks).`,
    messages: [
      {
        role: "user",
        content: `User question: ${query}\n\nExpert discussion:\n${discussionSummary}\n\nPlease provide the final council decision and recommendation.`,
      },
    ],
  });

  for await (const chunk of finalStream.textStream) {
    if (signal.aborted) break;
    emit(sessionId, { type: "final-answer-token", token: chunk });
  }

  emit(sessionId, { type: "final-answer-complete" });
  emit(sessionId, { type: "session-ended" });

  activeSessions.delete(sessionId);
}

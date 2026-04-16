import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { rpc } from "@/lib/rpc";
import { Users, Send, Loader2 } from "lucide-react";
import { MermaidDiagram } from "@/components/ui/mermaid-diagram";
import { CodeBlock } from "@/components/chat/code-block";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SessionState = "idle" | "running" | "waiting-for-answer" | "done" | "error";
type AgentState = "idle" | "thinking" | "speaking" | "done";

interface AgentInfo {
  name: string;
  displayName: string;
  color: string;
}

interface Message {
  id: string;
  type: "user-query" | "agent" | "final-answer" | "question" | "pm-thinking";
  agentName?: string;
  agentDisplayName?: string;
  agentColor?: string;
  content: string;
  streaming?: boolean;
  questionId?: string;
}

// ---------------------------------------------------------------------------
// Council event payload shapes
// ---------------------------------------------------------------------------

interface CouncilEvent {
  sessionId: string;
  type: string;
  query?: string;
  agents?: AgentInfo[];
  agentName?: string;
  token?: string;
  turnsLeft?: number;
  questionId?: string;
  question?: string;
  message?: string;
}

// ---------------------------------------------------------------------------
// Inline keyframe styles
// ---------------------------------------------------------------------------

const KEYFRAME_CSS = `
@keyframes council-float {
  from { transform: translateY(-3px); }
  to   { transform: translateY(3px); }
}
@keyframes council-pulse {
  0%   { transform: scale(0.95); opacity: 0.7; }
  100% { transform: scale(1.05); opacity: 1.0; }
}
@keyframes council-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}
@keyframes council-dot-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-6px); opacity: 1; }
}
@keyframes council-live-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
`;

// Positions for up to 10 agent avatars in the right panel (relative, %)
const AVATAR_POSITIONS = [
  { top: "15%", left: "50%" },
  { top: "32%", left: "20%" },
  { top: "32%", left: "80%" },
  { top: "50%", left: "50%" },
  { top: "68%", left: "20%" },
  { top: "68%", left: "80%" },
  { top: "85%", left: "35%" },
  { top: "85%", left: "65%" },
  { top: "50%", left: "10%" },
  { top: "50%", left: "90%" },
];

// ---------------------------------------------------------------------------
// Markdown components (shared, hoisted to avoid re-creation per render)
// ---------------------------------------------------------------------------

const MD_COMPONENTS = {
  code({ className, children, ref: _ref, ...props }: Record<string, unknown>) {
    const match = /language-(\w+)/.exec((className as string) ?? "");
    if (match?.[1] === "mermaid") {
      return (
        <MermaidDiagram
          code={String(children).trim()}
          fallbackClassName="text-[13px] font-mono whitespace-pre-wrap text-gray-700 my-2"
        />
      );
    }
    const isInline = !match;
    if (isInline) {
      return (
        <code className="text-[13px] font-mono text-rose-600 bg-rose-50 px-1 rounded" {...props}>
          {children as React.ReactNode}
        </code>
      );
    }
    return <CodeBlock language={match[1]} code={String(children).replace(/\n$/, "")} />;
  },
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 text-[13.5px] text-gray-800 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc pl-4 mb-2 text-[13.5px] text-gray-800">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal pl-4 mb-2 text-[13.5px] text-gray-800">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1 text-gray-800">{children}</li>
  ),
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-xl font-semibold mb-2 mt-4 text-gray-800">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-lg font-semibold mb-2 mt-3 text-gray-800">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-base font-semibold mb-1 mt-3 text-gray-800">{children}</h3>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-gray-800">{children}</strong>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-3 my-2 text-gray-600 italic text-[13.5px]">
      {children}
    </blockquote>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-2 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="px-3 py-1.5 text-left font-semibold text-gray-700">{children}</th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="px-3 py-1.5 text-gray-700 border-t border-gray-100">{children}</td>
  ),
};

// ---------------------------------------------------------------------------
// AgentAvatar component
// ---------------------------------------------------------------------------

function AgentAvatar({
  agent,
  state,
}: {
  agent: AgentInfo;
  state: AgentState;
}) {
  const initials = agent.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  let animation = "";
  let boxShadow = "none";
  let outline = "none";

  if (state === "idle") {
    animation = "council-float 3s ease-in-out infinite alternate";
  } else if (state === "thinking") {
    animation = "council-pulse 1s ease-in-out infinite alternate";
  } else if (state === "speaking") {
    animation = "council-bounce 0.6s ease-in-out infinite";
    boxShadow = `0 0 16px 4px ${agent.color}99`;
    outline = `3px solid ${agent.color}`;
  } else if (state === "done") {
    animation = "council-float 3s ease-in-out infinite alternate";
    boxShadow = `0 0 8px 2px ${agent.color}55`;
  }

  return (
    <div
      title={agent.displayName}
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        backgroundColor: agent.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: 14,
        animation,
        boxShadow,
        outline,
        outlineOffset: 2,
        cursor: "default",
        userSelect: "none",
        transition: "box-shadow 0.3s, outline 0.3s",
      }}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ThinkingDots
// ---------------------------------------------------------------------------

function ThinkingDots({ color }: { color: string }) {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: color,
            animation: `council-dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// QuestionCard
// ---------------------------------------------------------------------------

function QuestionCard({
  message,
  onAnswer,
  disabled,
}: {
  message: Message;
  onAnswer: (questionId: string, answer: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (!value.trim() || !message.questionId) return;
    onAnswer(message.questionId, value.trim());
    setValue("");
  }

  return (
    <div
      style={{
        border: "1.5px solid #f59e0b",
        borderRadius: 8,
        padding: "12px 16px",
        backgroundColor: "#fffbeb",
        marginBottom: 12,
      }}
    >
      <div style={{ fontWeight: 600, color: "#b45309", marginBottom: 8, fontSize: 13 }}>
        PM needs clarification
      </div>
      <div style={{ color: "#1f2937", marginBottom: 10, whiteSpace: "pre-wrap", fontSize: 14 }}>
        {message.content}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Your answer..."
          disabled={disabled}
          style={{
            flex: 1,
            border: "1px solid #d1d5db",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 13,
            outline: "none",
            backgroundColor: disabled ? "#f9fafb" : "#fff",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          style={{
            backgroundColor: "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
            opacity: disabled || !value.trim() ? 0.6 : 1,
          }}
        >
          Answer
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MessageBubble
// ---------------------------------------------------------------------------

function MessageBubble({
  message,
  onAnswer,
  sessionState,
}: {
  message: Message;
  onAnswer: (questionId: string, answer: string) => void;
  sessionState: SessionState;
}) {
  // Memoize markdown so it doesn't re-render on every parent state change
  const mdContent = useMemo(
    () =>
      message.content ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={MD_COMPONENTS as never}
        >
          {message.content}
        </ReactMarkdown>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message.content, message.streaming],
  );

  // ── user query ────────────────────────────────────────────────────────────
  if (message.type === "user-query") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            backgroundColor: "#22c55e",
            color: "#fff",
            borderRadius: "16px 16px 4px 16px",
            padding: "10px 16px",
            fontSize: 14,
            maxWidth: "80%",
            lineHeight: 1.5,
            boxShadow: "0 1px 4px rgba(34,197,94,0.25)",
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  // ── question card ─────────────────────────────────────────────────────────
  if (message.type === "question") {
    return (
      <QuestionCard
        message={message}
        onAnswer={onAnswer}
        disabled={sessionState !== "waiting-for-answer"}
      />
    );
  }

  // ── pm-thinking ───────────────────────────────────────────────────────────
  if (message.type === "pm-thinking") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#6b7280",
          fontSize: 13,
          padding: "8px 0",
          marginBottom: 4,
        }}
      >
        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
        <span>{message.content}</span>
      </div>
    );
  }

  // ── final answer ──────────────────────────────────────────────────────────
  if (message.type === "final-answer") {
    return (
      <div
        style={{
          border: "2px solid #22c55e",
          borderRadius: 10,
          padding: "14px 18px",
          backgroundColor: "#f0fdf4",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "#16a34a",
            marginBottom: 10,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Users size={15} />
          Council Decision
          {message.streaming && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                display: "inline-block",
                animation: "council-live-blink 1s ease-in-out infinite",
                marginLeft: 4,
              }}
            />
          )}
        </div>
        <div style={{ fontSize: 14, color: "#1f2937", lineHeight: 1.6 }}>
          {mdContent}
          {message.streaming && !message.content && (
            <ThinkingDots color="#22c55e" />
          )}
        </div>
      </div>
    );
  }

  // ── agent message ─────────────────────────────────────────────────────────
  const color = message.agentColor ?? "#6b7280";
  return (
    <div
      style={{
        borderLeft: `3px solid ${color}`,
        paddingLeft: 12,
        marginBottom: 14,
      }}
    >
      {/* Agent header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
        }}
      >
        <span style={{ fontWeight: 700, color, fontSize: 12 }}>
          {message.agentDisplayName ?? message.agentName}
        </span>
        {message.streaming && (
          <>
            {message.content ? (
              // Has content → show "live" blinking dot
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 10,
                  color: color,
                  fontWeight: 600,
                  opacity: 0.85,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: color,
                    display: "inline-block",
                    animation: "council-live-blink 0.9s ease-in-out infinite",
                  }}
                />
                live
              </span>
            ) : null}
          </>
        )}
      </div>

      {/* Content */}
      <div style={{ fontSize: 14, color: "#1f2937", lineHeight: 1.6 }}>
        {!message.content && message.streaming ? (
          <ThinkingDots color={color} />
        ) : (
          mdContent
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main CouncilPage
// ---------------------------------------------------------------------------

export function CouncilPage() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [agentStates, setAgentStates] = useState<Map<string, AgentState>>(new Map());
  const [query, setQuery] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Keep a ref to agents so event handler callbacks don't capture stale closure
  const agentsRef = useRef<AgentInfo[]>([]);
  agentsRef.current = agents;

  // Auto-scroll feed to bottom
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  // Council event handler
  const handleCouncilEvent = useCallback((event: Event) => {
    const { detail } = event as CustomEvent<CouncilEvent>;
    if (!detail) return;

    const { type } = detail;

    switch (type) {
      case "session-started": {
        // Keep user-query message at the top, clear everything else
        setMessages((prev) => prev.filter((m) => m.type === "user-query"));
        setAgents([]);
        setAgentStates(new Map());
        break;
      }

      case "pm-status": {
        // Replace any existing pm-status message (don't accumulate)
        setMessages((prev) => {
          const withoutStatus = prev.filter((m) => m.id !== "pm-status");
          return [
            ...withoutStatus,
            {
              id: "pm-status",
              type: "pm-thinking" as const,
              content: detail.message ?? "",
            },
          ];
        });
        break;
      }

      case "agents-selected": {
        const incoming = detail.agents ?? [];
        setAgents(incoming);
        agentsRef.current = incoming;
        setAgentStates(new Map(incoming.map((a) => [a.name, "idle"])));
        break;
      }

      case "agent-thinking": {
        const name = detail.agentName!;
        // Remove pm-status once actual agent content starts
        setMessages((prev) => prev.filter((m) => m.id !== "pm-status"));
        // If this agent isn't in the known list, add them with a fallback color
        setAgents((prev) => {
          if (prev.some((a) => a.name === name)) return prev;
          const fallback: AgentInfo = {
            name,
            displayName: name
              .split(/[-_]/)
              .map((w) => w[0].toUpperCase() + w.slice(1))
              .join(" "),
            color: "#9ca3af",
          };
          const updated = [...prev, fallback];
          agentsRef.current = updated;
          return updated;
        });
        setAgentStates((prev) => {
          const next = new Map(prev);
          next.set(name, "thinking");
          return next;
        });
        setMessages((prev) => {
          if (prev.some((m) => m.agentName === name && m.streaming)) return prev;
          const agentInfo = agentsRef.current.find((a) => a.name === name);
          return [
            ...prev,
            {
              id: `${name}-${Date.now()}`,
              type: "agent",
              agentName: name,
              agentDisplayName: agentInfo?.displayName ?? name,
              agentColor: agentInfo?.color,
              content: "",
              streaming: true,
            },
          ];
        });
        break;
      }

      case "agent-token": {
        const name = detail.agentName!;
        const token = detail.token ?? "";
        setAgentStates((prev) => {
          const next = new Map(prev);
          next.set(name, "speaking");
          return next;
        });
        setMessages((prev) =>
          prev.map((m) =>
            m.agentName === name && m.streaming
              ? { ...m, content: m.content + token }
              : m,
          ),
        );
        break;
      }

      case "agent-response-complete": {
        const name = detail.agentName!;
        setAgentStates((prev) => {
          const next = new Map(prev);
          next.set(name, "done");
          return next;
        });
        setMessages((prev) =>
          prev.map((m) =>
            m.agentName === name && m.streaming ? { ...m, streaming: false } : m,
          ),
        );
        break;
      }

      case "question": {
        setSessionState("waiting-for-answer");
        setMessages((prev) => [
          ...prev,
          {
            id: `question-${detail.questionId}`,
            type: "question",
            content: detail.question ?? "",
            questionId: detail.questionId,
          },
        ]);
        break;
      }

      case "pm-synthesizing": {
        setMessages((prev) => [
          ...prev,
          {
            id: `pm-synth-${Date.now()}`,
            type: "pm-thinking",
            content: "PM is synthesizing the council's final decision...",
          },
        ]);
        break;
      }

      case "final-answer-token": {
        const token = detail.token ?? "";
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          const base = last?.type === "pm-thinking" ? prev.slice(0, -1) : prev;
          const existing = base.findIndex((m) => m.type === "final-answer" && m.streaming);
          if (existing >= 0) {
            return base.map((m, i) =>
              i === existing ? { ...m, content: m.content + token } : m,
            );
          }
          return [
            ...base,
            {
              id: `final-${Date.now()}`,
              type: "final-answer",
              content: token,
              streaming: true,
            },
          ];
        });
        break;
      }

      case "final-answer-complete": {
        setMessages((prev) =>
          prev
            .filter((m) => m.type !== "pm-thinking")
            .map((m) =>
              m.type === "final-answer" && m.streaming ? { ...m, streaming: false } : m,
            ),
        );
        break;
      }

      case "session-ended": {
        setSessionState("done");
        // Clear any lingering status/thinking messages
        setMessages((prev) => prev.filter((m) => m.type !== "pm-thinking"));
        setAgentStates((prev) => {
          const next = new Map(prev);
          for (const key of next.keys()) next.set(key, "done");
          return next;
        });
        break;
      }

      case "error": {
        setSessionState("error");
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            type: "pm-thinking",
            content: `Error: ${detail.message ?? "Unknown error"}`,
          },
        ]);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("autodesk:council-event", handleCouncilEvent);
    return () => {
      window.removeEventListener("autodesk:council-event", handleCouncilEvent);
    };
  }, [handleCouncilEvent]);

  // Stop session on unmount if still running
  useEffect(() => {
    return () => {
      if (sessionId) {
        rpc.stopCouncil(sessionId).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function handleSend() {
    const trimmed = query.trim();
    if (!trimmed || sessionState === "running") return;

    setQuery("");
    setSessionState("running");

    // Show the user's query immediately at the top of the feed
    setMessages([
      {
        id: "user-query",
        type: "user-query",
        content: trimmed,
      },
    ]);
    setAgents([]);
    setAgentStates(new Map());

    try {
      const result = (await rpc.startCouncil(trimmed)) as { sessionId: string };
      setSessionId(result.sessionId);
    } catch (err) {
      setSessionState("error");
      const msg = err instanceof Error ? err.message : String(err);
      setMessages([
        {
          id: "user-query",
          type: "user-query",
          content: trimmed,
        },
        {
          id: "err-start",
          type: "pm-thinking",
          content: `Failed to start council: ${msg}`,
        },
      ]);
    }
  }

  function handleAnswer(questionId: string, answer: string) {
    if (!sessionId) return;
    setSessionState("running");
    setMessages((prev) => prev.filter((m) => m.questionId !== questionId));
    rpc.answerCouncilQuestion(sessionId, questionId, answer).catch(() => {});
  }

  async function handleStop() {
    if (!sessionId) return;
    try {
      await rpc.stopCouncil(sessionId);
    } catch {
      // ignore
    }
    setSessionState("idle");
    setSessionId(null);
  }

  const isRunning = sessionState === "running";
  const isWaiting = sessionState === "waiting-for-answer";
  const inputDisabled = isRunning;
  const placeholder = isRunning
    ? "Council is in session..."
    : isWaiting
      ? "Answer the PM's question above..."
      : "Ask the council...";

  return (
    <>
      <style>{KEYFRAME_CSS}</style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#f9fafb",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <Users size={18} color="#22c55e" />
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Council</span>
          {isRunning && (
            <span
              style={{
                fontSize: 12,
                color: "#22c55e",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  display: "inline-block",
                  animation: "council-live-blink 1s ease-in-out infinite",
                }}
              />
              In session
            </span>
          )}
          {(isRunning || isWaiting) && (
            <button
              onClick={handleStop}
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: "#ef4444",
                background: "none",
                border: "1px solid #ef4444",
                borderRadius: 5,
                padding: "3px 10px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Stop
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Discussion feed */}
          <div
            ref={feedRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 20px",
            }}
          >
            {messages.length === 0 && !isRunning && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 12,
                  color: "#9ca3af",
                }}
              >
                <Users size={40} color="#d1fae5" />
                <p style={{ fontSize: 14, textAlign: "center", maxWidth: 320 }}>
                  Ask a technical question and the council of AI experts will
                  discuss it and present a unified answer.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onAnswer={handleAnswer}
                sessionState={sessionState}
              />
            ))}
          </div>

          {/* Agent avatar panel */}
          {agents.length > 0 && (
            <div
              style={{
                width: 200,
                borderLeft: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  padding: "10px 12px 4px",
                  textAlign: "center",
                }}
              >
                Participants
              </div>
              <div style={{ position: "relative", height: "calc(100% - 32px)" }}>
                {agents.slice(0, AVATAR_POSITIONS.length).map((agent, idx) => {
                  const pos = AVATAR_POSITIONS[idx];
                  const state = agentStates.get(agent.name) ?? "idle";
                  return (
                    <div
                      key={agent.name}
                      style={{
                        position: "absolute",
                        top: pos.top,
                        left: pos.left,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <AgentAvatar agent={agent} state={state} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#fff",
            flexShrink: 0,
            display: "flex",
            gap: 8,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !inputDisabled) handleSend();
            }}
            placeholder={placeholder}
            disabled={inputDisabled}
            style={{
              flex: 1,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "9px 14px",
              fontSize: 14,
              outline: "none",
              backgroundColor: inputDisabled ? "#f9fafb" : "#fff",
              color: "#111827",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              if (!inputDisabled) e.currentTarget.style.borderColor = "#22c55e";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
          />
          <button
            onClick={handleSend}
            disabled={inputDisabled || !query.trim()}
            style={{
              backgroundColor: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "9px 16px",
              fontSize: 14,
              fontWeight: 600,
              cursor: inputDisabled || !query.trim() ? "not-allowed" : "pointer",
              opacity: inputDisabled || !query.trim() ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "opacity 0.15s, background-color 0.15s",
            }}
          >
            {isRunning ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Send size={16} />
            )}
            Send
          </button>
        </div>
      </div>
    </>
  );
}

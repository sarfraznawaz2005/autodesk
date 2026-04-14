import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { MessageSquare, X, Send, Trash2, Loader2, Wrench, Sparkles, Info } from "lucide-react";
import { rpc } from "@/lib/rpc";
import { cn } from "@/lib/utils";
import { Tip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

// ---------------------------------------------------------------------------
// Markdown components for assistant bubbles
// ---------------------------------------------------------------------------

const MD_COMPONENTS = {
   
  code({ className, children, ref: _ref, ...props }: Record<string, unknown>) {
    const isBlock = /language-/.test((className as string) ?? "");
    if (isBlock) {
      return (
        // overflow-x-auto on the pre so long code lines scroll horizontally
        // without pushing the bubble wider
        <pre className="my-1.5 max-w-full overflow-x-auto rounded-md bg-muted/80 px-3 py-2 text-xs font-mono">
          <code {...props}>{children as React.ReactNode}</code>
        </pre>
      );
    }
    return (
      <code className="break-all rounded bg-muted/80 px-1 py-0.5 text-xs font-mono" {...props}>
        {children as React.ReactNode}
      </code>
    );
  },
  p: ({ children }: { children: React.ReactNode }) => <p className="mb-1.5 break-words last:mb-0">{children}</p>,
  ul: ({ children }: { children: React.ReactNode }) => <ul className="mb-1.5 list-disc pl-4">{children}</ul>,
  ol: ({ children }: { children: React.ReactNode }) => <ol className="mb-1.5 list-decimal pl-4">{children}</ol>,
  li: ({ children }: { children: React.ReactNode }) => <li className="mb-0.5 break-words">{children}</li>,
  h1: ({ children }: { children: React.ReactNode }) => <p className="mb-1 font-bold">{children}</p>,
  h2: ({ children }: { children: React.ReactNode }) => <p className="mb-1 font-semibold">{children}</p>,
  h3: ({ children }: { children: React.ReactNode }) => <p className="mb-1 font-semibold">{children}</p>,
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a href={href} className="break-all underline hover:opacity-80" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground">{children}</blockquote>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-1.5 overflow-x-auto">
      <table className="min-w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="border border-border bg-muted/50 px-2 py-1 text-left font-medium">{children}</th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="border border-border px-2 py-1">{children}</td>
  ),
};

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

const LS_SESSION_KEY = "dashboard-pm-sessionId-v1";
const LS_MESSAGES_KEY = "dashboard-pm-messages-v1";

function loadPersistedSession(): { sessionId: string; messages: ChatMessage[] } {
  try {
    const sid = localStorage.getItem(LS_SESSION_KEY) ?? `dashboard-pm-${crypto.randomUUID()}`;
    const raw = localStorage.getItem(LS_MESSAGES_KEY);
    const messages: ChatMessage[] = raw
      ? (JSON.parse(raw) as ChatMessage[]).map((m) => ({ ...m, streaming: false }))
      : [];
    return { sessionId: sid, messages };
  } catch {
    return { sessionId: `dashboard-pm-${crypto.randomUUID()}`, messages: [] };
  }
}

function persistMessages(messages: ChatMessage[]) {
  try {
    localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    // Quota exceeded or private browsing — ignore
  }
}

function persistSessionId(sessionId: string) {
  try {
    localStorage.setItem(LS_SESSION_KEY, sessionId);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// PmChatWidget
// ---------------------------------------------------------------------------

export function PmChatWidget() {
  const [open, setOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [input, setInput] = useState("");
  const [lastSent, setLastSent] = useState("");
  const [toolCalls, setToolCalls] = useState<Array<{ id: string; toolName: string; isSkill: boolean }>>([]);

  // Initialise from localStorage once on mount
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const sessionId = useRef("");
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const { sessionId: sid, messages: msgs } = loadPersistedSession();
    sessionId.current = sid;
    setMessages(msgs);
  }, []);

  // Persist messages to localStorage whenever they change (skip while streaming to reduce writes)
  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages; // eslint-disable-line react-hooks/refs

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the widget
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  // Auto-scroll to latest message, and when panel opens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Listen for streaming events
  useEffect(() => {
    const onChunk = (e: Event) => {
      const { sessionId: sid, messageId, token } = (e as CustomEvent<{ sessionId: string; messageId: string; token: string }>).detail;
      if (sid !== sessionId.current) return;
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === messageId);
        if (existing) {
          return prev.map((m) => m.id === messageId ? { ...m, content: m.content + token } : m);
        }
        return [...prev, { id: messageId, role: "assistant", content: token, streaming: true }];
      });
    };

    const onToolCall = (e: Event) => {
      const { sessionId: sid, toolName } = (e as CustomEvent<{ sessionId: string; toolName: string; args: Record<string, unknown> }>).detail;
      if (sid !== sessionId.current) return;
      const isSkill = toolName === "read_skill" || toolName === "find_skills";
      setToolCalls((prev) => [...prev, { id: crypto.randomUUID(), toolName, isSkill }]);
    };

    const onComplete = (e: Event) => {
      const { sessionId: sid, messageId } = (e as CustomEvent<{ sessionId: string; messageId: string; content: string }>).detail;
      if (sid !== sessionId.current) return;
      setMessages((prev) => {
        const next = prev.map((m) => m.id === messageId ? { ...m, streaming: false } : m);
        persistMessages(next);
        return next;
      });
      setToolCalls([]);
      setIsStreaming(false);
    };

    const onError = (e: Event) => {
      const { sessionId: sid, error } = (e as CustomEvent<{ sessionId: string; error: string }>).detail;
      if (sid !== sessionId.current) return;
      setMessages((prev) => {
        const next = [
          ...prev.filter((m) => !m.streaming),
          { id: crypto.randomUUID(), role: "assistant" as const, content: `Error: ${error}` },
        ];
        persistMessages(next);
        return next;
      });
      setIsStreaming(false);
    };

    window.addEventListener("autodesk:dashboard-pm-chunk", onChunk);
    window.addEventListener("autodesk:dashboard-pm-tool-call", onToolCall);
    window.addEventListener("autodesk:dashboard-pm-complete", onComplete);
    window.addEventListener("autodesk:dashboard-pm-error", onError);
    return () => {
      window.removeEventListener("autodesk:dashboard-pm-chunk", onChunk);
      window.removeEventListener("autodesk:dashboard-pm-tool-call", onToolCall);
      window.removeEventListener("autodesk:dashboard-pm-complete", onComplete);
      window.removeEventListener("autodesk:dashboard-pm-error", onError);
    };
  }, []);

  const sendMessage = useCallback(async () => {
    const content = input.trim();
    if (!content || isStreaming) return;

    setInput("");
    setLastSent(content);
    setIsStreaming(true);
    setToolCalls([]);

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => {
      const next = [...prev, userMsg];
      persistMessages(next);
      return next;
    });

    try {
      await rpc.sendDashboardMessage(sessionId.current, content);
    } catch {
      setMessages((prev) => {
        const next = [...prev, { id: crypto.randomUUID(), role: "assistant" as const, content: "Failed to send message. Please try again." }];
        persistMessages(next);
        return next;
      });
      setIsStreaming(false);
    }
  }, [input, isStreaming]);

  const sendInfo = useCallback(async () => {
    if (isStreaming) return;
    setIsStreaming(true);
    setToolCalls([]);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: "/info" };
    setMessages((prev) => {
      const next = [...prev, userMsg];
      persistMessages(next);
      return next;
    });
    try {
      await rpc.sendDashboardMessage(sessionId.current, "/info");
    } catch {
      setMessages((prev) => {
        const next = [...prev, { id: crypto.randomUUID(), role: "assistant" as const, content: "Failed to fetch status." }];
        persistMessages(next);
        return next;
      });
      setIsStreaming(false);
    }
  }, [isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      return;
    }
    if (e.key === "ArrowUp" && input === "" && lastSent) {
      e.preventDefault();
      setInput(lastSent);
    }
  };

  const handleClear = async () => {
    if (isStreaming) {
      await rpc.abortDashboardMessage(sessionId.current);
      setIsStreaming(false);
    }
    rpc.clearDashboardSession(sessionId.current).catch(() => {});
    // Rotate session so backend starts fresh
    const newSid = `dashboard-pm-${crypto.randomUUID()}`;
    sessionId.current = newSid;
    persistSessionId(newSid);
    try { localStorage.removeItem(LS_MESSAGES_KEY); } catch { /* ignore */ }
    setMessages([]);
  };

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "flex items-center gap-2 px-4 py-2.5 rounded-full",
            "bg-primary text-primary-foreground shadow-lg",
            "hover:bg-primary/90 transition-colors duration-150",
            "text-sm font-medium",
          )}
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Chat with PM
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div
          ref={widgetRef}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "flex flex-col w-[400px] h-[520px]",
            "bg-background border border-border rounded-xl shadow-2xl",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 bg-indigo-600 rounded-t-xl">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-white" aria-hidden="true" />
              <span className="text-sm font-semibold text-white">Project Manager</span>
              {isStreaming && (
                <Loader2 className="h-3.5 w-3.5 text-white/70 animate-spin" aria-hidden="true" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <Tip content="Show system status (/info)" side="bottom">
                <button
                  type="button"
                  onClick={sendInfo}
                  disabled={isStreaming}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition-colors text-xs font-medium disabled:opacity-40"
                >
                  <Info className="h-3 w-3" aria-hidden="true" />
                  /info
                </button>
              </Tip>
              <Tip content="Clear conversation" side="bottom">
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </Tip>
              <Tip content="Close" side="bottom">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </Tip>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 gap-3">
            {messages.length === 0 && !isStreaming && (
              <div className="flex flex-col items-center justify-center flex-1 text-center gap-2">
                <MessageSquare className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Ask me about your projects, agents, or anything else.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-indigo-600 px-3 py-2 text-sm leading-relaxed text-white whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                ) : (
                  <div className="w-full rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm leading-relaxed text-foreground overflow-hidden">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSanitize]}
                      components={MD_COMPONENTS as never}
                    >
                      {msg.content + (msg.streaming ? "▍" : "")}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}

            {/* Tool call indicators — shown while PM is using tools */}
            {isStreaming && toolCalls.length > 0 && (
              <div className="flex flex-col gap-1">
                {toolCalls.map((tc) => (
                  <div key={tc.id} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    {tc.isSkill ? (
                      <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
                    ) : (
                      <Wrench className="h-3 w-3 text-gray-400 shrink-0" />
                    )}
                    <span className="font-mono truncate">{tc.toolName}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Thinking indicator — shown while waiting for first token */}
            {isStreaming && !messages.some((m) => m.streaming) && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-border shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the PM anything…"
                rows={1}
                className={cn(
                  "flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2",
                  "text-sm placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  "max-h-28 overflow-y-auto",
                )}
                style={{ minHeight: "2.25rem" }}
                disabled={isStreaming}
              />
              <Button
                type="button"
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className="shrink-0 h-9 w-9"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 px-1">
              Enter to send · Shift+Enter for newline
            </p>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useState, useCallback } from "react";
import { FileText, ExternalLink, FolderOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { MermaidDiagram } from "@/components/ui/mermaid-diagram";
import { cn } from "@/lib/utils";
import { rpc } from "../../lib/rpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Note {
  id: string;
  projectId: string;
  title: string;
  content: string;
  authorAgentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Plan {
  title: string;
  content: string;
  path: string;
  updatedAt: string;
}

interface SelectedDoc {
  title: string;
  content: string;
  subtitle?: string;
}

interface DocsTabProps {
  projectId?: string;
}

export function DocsTab({ projectId }: DocsTabProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<SelectedDoc | null>(null);

  const loadDocs = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const [notesResult, plansResult] = await Promise.all([
        rpc.getProjectNotes(projectId),
        rpc.getWorkspacePlans(projectId),
      ]);
      setNotes(notesResult as Note[]);
      setPlans(plansResult as Plan[]);
    } catch {
      // Silently fail — empty state shown
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Load docs on mount and when projectId changes
  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  // Refresh docs when agents finish or PM stream completes
  useEffect(() => {
    const refresh = () => loadDocs();
    window.addEventListener("autodesk:agent-inline-complete", refresh);
    window.addEventListener("autodesk:stream-complete", refresh);
    return () => {
      window.removeEventListener("autodesk:agent-inline-complete", refresh);
      window.removeEventListener("autodesk:stream-complete", refresh);
    };
  }, [loadDocs]);

  const handleViewAllNotes = () => {
    window.dispatchEvent(
      new CustomEvent("autodesk:switch-tab", { detail: { tab: "notes" } }),
    );
  };

  const openNote = (note: Note) => {
    setSelectedDoc({
      title: note.title,
      content: note.content,
      subtitle: [
        note.authorAgentId ? `by ${note.authorAgentId}` : null,
        `Updated ${new Date(note.updatedAt).toLocaleString()}`,
      ]
        .filter(Boolean)
        .join(" · "),
    });
  };

  const openPlan = (plan: Plan) => {
    setSelectedDoc({
      title: plan.title,
      content: plan.content,
      subtitle: `Updated ${new Date(plan.updatedAt).toLocaleString()}`,
    });
  };

  const hasContent = notes.length > 0 || plans.length > 0;

  // Empty state
  if (!projectId || (!isLoading && !hasContent)) {
    return (
      <div
        id="docs-tab-panel"
        role="tabpanel"
        aria-label="Docs"
        className="flex-1 flex items-center justify-center p-4"
      >
        <div className="text-center">
          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" aria-hidden="true" />
          <p className="text-sm text-gray-500">No documents yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Agent-created docs will appear here
          </p>
        </div>
      </div>
    );
  }

  // Loading state (only shown before any data has loaded)
  if (isLoading && !hasContent) {
    return (
      <div
        id="docs-tab-panel"
        role="tabpanel"
        aria-label="Docs"
        className="flex-1 flex items-center justify-center p-4"
      >
        <p className="text-sm text-gray-400">Loading docs...</p>
      </div>
    );
  }

  return (
    <div
      id="docs-tab-panel"
      role="tabpanel"
      aria-label="Docs"
      className="flex flex-col flex-1 min-h-0"
    >
      <div className="flex-1 overflow-y-auto">
        {/* Plans section */}
        {plans.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 border-b border-gray-300">
              <FolderOpen className="w-3 h-3 text-gray-400" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                Plans
              </span>
            </div>
            {plans.map((plan) => (
              <button
                key={plan.path}
                onClick={() => openPlan(plan)}
                className={cn(
                  "w-full text-left px-3 py-2.5 border-b border-gray-100",
                  "hover:bg-gray-100 transition-colors",
                  "focus:outline-none focus:bg-gray-100",
                )}
              >
                <div className="flex items-start gap-2">
                  <FileText
                    className="w-4 h-4 text-blue-400 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {plan.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {plan.content.slice(0, 120)}
                      {plan.content.length > 120 ? "..." : ""}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(plan.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {/* Docs section */}
        {notes.length > 0 && (
          <>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 border-b border-gray-300">
              <FileText className="w-3 h-3 text-gray-400" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                Docs
              </span>
            </div>
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => openNote(note)}
                className={cn(
                  "w-full text-left px-3 py-2.5 border-b border-gray-100",
                  "hover:bg-gray-100 transition-colors",
                  "focus:outline-none focus:bg-gray-100",
                )}
              >
                <div className="flex items-start gap-2">
                  <FileText
                    className="w-4 h-4 text-gray-400 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {note.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {note.content.slice(0, 120)}
                      {note.content.length > 120 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {note.authorAgentId && (
                        <span className="text-[10px] text-gray-400">
                          {note.authorAgentId}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* View all docs link */}
      <div className="shrink-0 border-t border-gray-100 px-3 py-2">
        <button
          onClick={handleViewAllNotes}
          className={cn(
            "flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors",
            "focus:outline-none focus:underline",
          )}
        >
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
          View all docs
        </button>
      </div>

      {/* Document detail modal */}
      <Dialog
        open={selectedDoc !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDoc(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.title}</DialogTitle>
            {selectedDoc?.subtitle && (
              <p className="text-xs text-gray-400 mt-1">{selectedDoc.subtitle}</p>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0 mt-2">
            {selectedDoc && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                   
                  code({ className, children, ref: _ref, ...props }) {
                    const match = /language-(\w+)/.exec(className ?? "");
                    if (match?.[1] === "mermaid") {
                      return <MermaidDiagram code={String(children).trim()} />;
                    }
                    if (!match) {
                      return (
                        <code className="px-1.5 py-0.5 rounded text-sm font-mono bg-gray-100 text-gray-800" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="my-3 rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                        <code>{children}</code>
                      </pre>
                    );
                  },
                  p: ({ children }) => <p className="mb-3 last:mb-0 text-sm text-gray-800 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-sm text-gray-800">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-sm text-gray-800">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-5 first:mt-0 text-gray-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-4 first:mt-0 text-gray-900">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-3 first:mt-0 text-gray-900">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-sm font-semibold mb-1 mt-2 first:mt-0 text-gray-900">{children}</h4>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-3 text-gray-600">{children}</blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-indigo-600 hover:text-indigo-800 underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="my-4 border-gray-200" />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-3">
                      <table className="min-w-full text-sm border-collapse">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-200 px-3 py-1.5 bg-gray-50 font-semibold text-left text-gray-900">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-200 px-3 py-1.5 text-gray-700">{children}</td>
                  ),
                  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                }}
              >
                {selectedDoc.content}
              </ReactMarkdown>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

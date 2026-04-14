import { useState, useEffect } from "react";
import { ShieldAlert, Check, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { rpc } from "@/lib/rpc";
import { persistShellApprovalDecision } from "@/stores/chat-event-handlers";
import type { ShellApprovalRequest } from "@/stores/chat-types";

function formatAgentName(name: string): string {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ShellApprovalCard({ request, onDismiss }: { request: ShellApprovalRequest; onDismiss?: (id: string) => void }) {
  const [responded, setResponded] = useState(!!request.decision);
  const [decision, setDecision] = useState<string | null>(request.decision ?? null);

  const handleDecision = async (d: "allow" | "deny" | "always") => {
    setResponded(true);
    setDecision(d);
    persistShellApprovalDecision(request.requestId, d);
    try {
      await rpc.respondShellApproval(request.requestId, d);
    } catch {
      // Best effort — the request may have already timed out
    }
  };

  // Auto-dismiss after decision
  useEffect(() => {
    if (!responded) return;
    const timer = setTimeout(() => onDismiss?.(request.requestId), 2000);
    return () => clearTimeout(timer);
  }, [responded, request.requestId, onDismiss]);

  if (responded) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs animate-in fade-in duration-150">
        <Terminal className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        {decision === "deny" ? (
          <>
            <X className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-red-600 font-medium">Denied</span>
          </>
        ) : (
          <>
            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <span className="text-green-600 font-medium">
              {decision === "always" ? "Allowed (session)" : "Allowed"}
            </span>
          </>
        )}
        <code className="text-gray-500 truncate min-w-0 flex-1">{request.command}</code>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 shadow-sm animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700">Shell Approval Required</span>
        </div>
        <span className="text-[10px] text-gray-400">{formatAgentName(request.agentName)}</span>
      </div>
      <div className="bg-white border border-gray-200 rounded px-2.5 py-1.5 mb-3">
        <code className="text-xs text-gray-700 break-all">{request.command}</code>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleDecision("deny")}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors",
            "text-white bg-red-500 hover:bg-red-600",
          )}
        >
          <X className="w-3 h-3" />
          Deny
        </button>
        <button
          onClick={() => handleDecision("allow")}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors",
            "text-white bg-emerald-500 hover:bg-emerald-600",
          )}
        >
          <Check className="w-3 h-3" />
          Allow
        </button>
        <button
          onClick={() => handleDecision("always")}
          title="Allow all shell commands for this session"
          className={cn(
            "flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors",
            "text-emerald-700 bg-emerald-100 hover:bg-emerald-200",
          )}
        >
          <Check className="w-3 h-3" />
          Always
        </button>
      </div>
    </div>
  );
}

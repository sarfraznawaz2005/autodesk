import type { ReactNode } from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tip } from "@/components/ui/tooltip";
import { rpc } from "@/lib/rpc";

interface TopNavProps {
  title: string;
  workspacePath?: string;
  children?: ReactNode;
}

export function TopNav({ title, workspacePath, children }: TopNavProps) {
  return (
    <header
      className={cn(
        "h-14 shrink-0 flex items-center justify-between px-6",
        "border-b border-gray-200 bg-white"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h1>
        {workspacePath && (
          <Tip content="Open in Explorer" side="bottom">
            <button
              onClick={() => rpc.openInExplorer(workspacePath).catch(() => {})}
              className="shrink-0 p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors translate-y-px"
              aria-label="Open project folder in explorer"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </Tip>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {children}
        </div>
      )}
    </header>
  );
}

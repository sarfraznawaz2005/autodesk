import { useState } from "react";
import { cn } from "@/lib/utils";
import { DocsTab } from "./docs-tab";
import { FilesTab } from "./files-tab";

type ContextTabId = "docs" | "files";

interface ContextPanelProps {
  projectId?: string;
  runningAgentCount?: number;
}

export function ContextPanel({ projectId }: ContextPanelProps) {
  const [activeTab, setActiveTab] = useState<ContextTabId>("files");

  const tabs: Array<{ id: ContextTabId; label: string }> = [
    { id: "files", label: "Files" },
    { id: "docs", label: "Docs" },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Tab header */}
      <div className="h-12 flex items-center border-b border-gray-200 px-3 shrink-0">
        <div className="flex items-center gap-4 flex-1" role="tablist" aria-label="Context panel tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "text-xs border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className={activeTab === "docs" ? "flex flex-col flex-1 min-h-0" : "hidden"}>
        <DocsTab projectId={projectId} />
      </div>
      <div className={activeTab === "files" ? "flex flex-col flex-1 min-h-0" : "hidden"}>
        <FilesTab projectId={projectId} />
      </div>
    </div>
  );
}

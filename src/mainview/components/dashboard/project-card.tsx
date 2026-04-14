import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { relativeTimeVerbose } from "@/lib/date-utils";
import { Circle, GitBranch, Github, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { Tip } from "@/components/ui/tooltip";

import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  workspacePath: string;
  githubUrl: string | null;
  workingBranch: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  activeAgentCount?: number;
  taskStats?: { done: number; total: number };
}

const STATUS_OPTIONS: { value: BadgeStatus; label: string; color: string }[] = [
  { value: "active", label: "Active", color: "text-green-500" },
  { value: "idle", label: "Idle", color: "text-muted-foreground" },
  { value: "paused", label: "Paused", color: "text-yellow-500" },
  { value: "completed", label: "Completed", color: "text-blue-500" },
  { value: "archived", label: "Archived", color: "text-gray-400" },
];

type BadgeStatus = "active" | "idle" | "paused" | "completed" | "archived";

function toStatus(raw: string): BadgeStatus {
  const allowed: BadgeStatus[] = ["active", "idle", "paused", "completed", "archived"];
  return (allowed.includes(raw as BadgeStatus) ? raw : "idle") as BadgeStatus;
}

export function ProjectCard({ project, onDelete, onStatusChange, activeAgentCount = 0, taskStats }: ProjectCardProps) {
  const navigate = useNavigate();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  function handleCardClick() {
    navigate({ to: "/project/$projectId", params: { projectId: project.id } });
  }

  function handleDeleteClick(event: React.MouseEvent) {
    event.stopPropagation();
    setConfirmDeleteOpen(true);
  }

  function handleConfirmDelete() {
    onDelete?.(project.id);
  }

  const updatedAgo = relativeTimeVerbose(project.updatedAt);
  const hasTasks = taskStats && taskStats.total > 0;
  const taskPct = hasTasks ? Math.round((taskStats.done / taskStats.total) * 100) : 0;

  return (
    <>
      <div
        className="group relative flex w-full flex-1 flex-col rounded-xl border-2 bg-card cursor-pointer transition-all hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        role="article"
        tabIndex={0}
        aria-label={`Project: ${project.name}`}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {/* Card body */}
        <div className="flex flex-1 flex-col gap-3 px-4 pt-2.5 pb-4">
          {/* Top row: status + name + menu */}
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1 pt-0.5">
              <h3 className="text-sm font-semibold leading-snug line-clamp-1 min-w-0">
                {project.name}
              </h3>
            </div>
            <div className="shrink-0 -mt-0.5 -mr-1.5" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="Project options"
                  >
                    <MoreVertical className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Circle className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                      Change Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <DropdownMenuItem
                          key={opt.value}
                          disabled={project.status === opt.value}
                          onClick={() => onStatusChange?.(project.id, opt.value)}
                        >
                          <Circle className={cn("mr-2 h-2.5 w-2.5 fill-current", opt.color)} aria-hidden="true" />
                          {opt.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 aria-hidden="true" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Description + meta — vertically centered in remaining space */}
          <div className="flex flex-1 flex-col justify-center gap-3">
          {project.description ? (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">No description</p>
          )}

          {/* Meta chips: branch, github */}
          {(project.workingBranch || project.githubUrl) && (
            <div className="flex items-center gap-2 flex-wrap">
              {project.workingBranch && (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  <GitBranch className="h-2.5 w-2.5" aria-hidden="true" />
                  {project.workingBranch}
                </span>
              )}
              {project.githubUrl && (
                <Tip content={project.githubUrl} side="bottom">
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground max-w-[180px]">
                    <Github className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{project.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
                  </span>
                </Tip>
              )}
            </div>
          )}

          {/* Task progress */}
          {hasTasks && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                {taskStats.done}/{taskStats.total}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${taskPct}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground shrink-0 tabular-nums">
                {taskPct}%
              </span>
            </div>
          )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center border-t px-4 py-2 mt-auto">
          <StatusBadge status={toStatus(project.status)} size="sm" />
          {activeAgentCount > 0 && (
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-600 pl-2 pr-2.5 py-1">
                <Loader2 className="h-2.5 w-2.5 animate-spin text-white" aria-hidden="true" />
                <span className="text-[11px] font-medium text-white tabular-nums leading-none">
                  {activeAgentCount} Agent{activeAgentCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {updatedAgo}
          </span>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete project"
        description={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

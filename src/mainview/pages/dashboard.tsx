import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, FolderOpen, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { ProjectCard } from "@/components/dashboard/project-card";
import { NewProjectModal } from "@/components/modals/new-project-modal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { rpc } from "@/lib/rpc";
import { PmChatWidget } from "@/components/dashboard/pm-chat-widget";

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

type SortKey = "name" | "updatedAt" | "createdAt" | "status";
type StatusFilter = "all" | "active" | "idle" | "paused" | "completed" | "archived";

export function DashboardPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);

	// Active agent counts per project (updated in real-time via agentInlineStart/Complete events)
	const [activeProjectAgents, setActiveProjectAgents] = useState<Record<string, number>>({});

	// Task stats per project
	const [taskStats, setTaskStats] = useState<Record<string, { done: number; total: number }>>({});

	// Search, filter, sort state
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [sortKey, setSortKey] = useState<SortKey>("updatedAt");

	const loadProjects = useCallback(async () => {
		setLoading(true);
		try {
			const result = await rpc.getProjects();
			const data = result as unknown;
			setProjects(Array.isArray(data) ? (data as Project[]) : []);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to load projects.";
			toast("error", message);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadTaskStats = useCallback(async () => {
		try {
			const stats = await rpc.getProjectTaskStats();
			const map: Record<string, { done: number; total: number }> = {};
			for (const s of stats) map[s.projectId] = { done: s.done, total: s.total };
			setTaskStats(map);
		} catch { /* ignore */ }
	}, []);

	useEffect(() => {
		loadProjects();
		loadTaskStats();
	}, [loadProjects, loadTaskStats]);

	// Load initial active-agent counts and keep them up to date via events.
	// Re-fetch from backend whenever any agent starts or completes — this covers
	// both in-app and channel-dispatched agents without needing projectId in
	// the event payload.
	useEffect(() => {
		const fetchCounts = () => {
			rpc.getActiveProjectAgents().then((list) => {
				const counts: Record<string, number> = {};
				for (const { projectId, agentCount } of list) {
					counts[projectId] = agentCount;
				}
				setActiveProjectAgents(counts);
			}).catch(() => {});
		};

		fetchCounts();

		window.addEventListener("autodesk:agent-inline-start", fetchCounts);
		window.addEventListener("autodesk:agent-inline-complete", fetchCounts);
		return () => {
			window.removeEventListener("autodesk:agent-inline-start", fetchCounts);
			window.removeEventListener("autodesk:agent-inline-complete", fetchCounts);
		};
	}, []);

	// Persist sort preference
	useEffect(() => {
		rpc.saveSetting("project_sort", sortKey, "appearance").catch(() => {});
	}, [sortKey]);

	// Load persisted sort preference
	useEffect(() => {
		rpc.getSettings("appearance").then((settings) => {
			const saved = settings as Record<string, unknown>;
			if (
				saved.project_sort &&
				typeof saved.project_sort === "string" &&
				["name", "updatedAt", "createdAt", "status"].includes(
					saved.project_sort,
				)
			) {
				setSortKey(saved.project_sort as SortKey);
			}
		}).catch(() => {});
	}, []);

	// Client-side filtering and sorting
	const filteredProjects = useMemo(() => {
		let result = [...projects];

		// Status filter
		if (statusFilter !== "all") {
			result = result.filter((p) => p.status === statusFilter);
		}

		// Search filter (debounced by the SearchInput caller)
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					(p.description && p.description.toLowerCase().includes(q)) ||
					p.workspacePath.toLowerCase().includes(q),
			);
		}

		// Sort
		result.sort((a, b) => {
			switch (sortKey) {
				case "name":
					return a.name.localeCompare(b.name);
				case "status":
					return a.status.localeCompare(b.status);
				case "createdAt":
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				case "updatedAt":
				default:
					return (
						new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
					);
			}
		});

		return result;
	}, [projects, searchQuery, statusFilter, sortKey]);

	async function handleDeleteProject(id: string) {
		try {
			await rpc.deleteProjectCascade(id);
			setProjects((prev) => prev.filter((p) => p.id !== id));
			toast("success", "Project deleted.");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to delete project.";
			toast("error", message);
		}
	}

	async function handleStatusChange(id: string, status: string) {
		try {
			await rpc.updateProject({ id, status });
			setProjects((prev) =>
				prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p)),
			);
			toast("success", `Status changed to ${status}.`);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to update status.";
			toast("error", message);
		}
	}

	const hasProjects = projects.length > 0;
	const hasResults = filteredProjects.length > 0;
	const isFiltered = searchQuery.trim() !== "" || statusFilter !== "all";


	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Page header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
					{!loading && hasProjects && (
						<p className="text-sm text-muted-foreground">
							{filteredProjects.length} of {projects.length}{" "}
							{projects.length === 1 ? "project" : "projects"}
						</p>
					)}
				</div>
				<Button onClick={() => setModalOpen(true)}>
					<Plus aria-hidden="true" />
					New Project
				</Button>
			</div>

			{/* Search, filter, sort bar — only shown when there are projects */}
			{!loading && hasProjects && (
				<div className="flex flex-wrap items-center gap-3">
					<div className="w-64">
						<SearchInput
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Search projects..."
						/>
					</div>
					<div className="flex-1" />
					<Select
						value={statusFilter}
						onValueChange={(v) => setStatusFilter(v as StatusFilter)}
					>
						<SelectTrigger className="w-36">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All statuses</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="idle">Idle</SelectItem>
							<SelectItem value="paused">Paused</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
							<SelectItem value="archived">Archived</SelectItem>
						</SelectContent>
					</Select>
					<Select
						value={sortKey}
						onValueChange={(v) => setSortKey(v as SortKey)}
					>
						<SelectTrigger className="w-44">
							<ArrowUpDown className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="updatedAt">Last updated</SelectItem>
							<SelectItem value="createdAt">Date created</SelectItem>
							<SelectItem value="name">Name</SelectItem>
							<SelectItem value="status">Status</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Content area */}
			{loading ? (
				<ProjectGridSkeleton />
			) : !hasProjects ? (
				<div className="flex flex-1 items-center justify-center">
					<EmptyState
						icon={<FolderOpen className="h-6 w-6" aria-hidden="true" />}
						title="No projects yet"
						description="Create your first project to get started."
						action={
							<Button onClick={() => setModalOpen(true)}>
								<Plus aria-hidden="true" />
								New Project
							</Button>
						}
					/>
				</div>
			) : !hasResults && isFiltered ? (
				<div className="flex flex-1 items-center justify-center">
					<EmptyState
						title="No matching projects"
						description="Try adjusting your search or filter criteria."
						action={
							<Button
								variant="outline"
								onClick={() => {
									setSearchQuery("");
									setStatusFilter("all");
								}}
							>
								Clear filters
							</Button>
						}
					/>
				</div>
			) : (
				<ul
					className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
					aria-label="Projects"
				>
					{filteredProjects.map((project) => (
						<li key={project.id} className="flex">
							<ProjectCard project={project} onDelete={handleDeleteProject} onStatusChange={handleStatusChange} activeAgentCount={activeProjectAgents[project.id] ?? 0} taskStats={taskStats[project.id]} />
						</li>
					))}
				</ul>
			)}

			{/* New project modal */}
			<NewProjectModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				onCreated={loadProjects}
			/>

			{/* Floating PM chat widget */}
			<PmChatWidget />
		</div>
	);
}

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function ProjectGridSkeleton() {
	return (
		<ul
			className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
			aria-label="Loading projects"
			aria-busy="true"
		>
			{Array.from({ length: 6 }).map((_, i) => (
				<li
					key={i}
					className="h-40 animate-pulse rounded-xl border bg-muted"
					aria-hidden="true"
				/>
			))}
		</ul>
	);
}

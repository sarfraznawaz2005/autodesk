import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "@tanstack/react-router";
import { Sidebar } from "./sidebar";
import { TopNav } from "./topnav";
import { Toaster, toast } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "../command-palette";
import { rpc } from "@/lib/rpc";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { StartupHealthDialog } from "../modals/startup-health-dialog";
import { UserQuestionDialog } from "../modals/user-question-dialog";
import { HeaderProvider, useHeaderContext } from "@/lib/header-context";

/** Maps top-level route segments to human-readable page titles. */
const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/inbox": "Inbox",
  "/agents": "Agents",
  "/skills": "Skills",
  "/prompts": "Prompts",
  "/scheduler": "Scheduler",
  "/analytics": "Analytics",
  "/council": "Council",
  "/settings": "Settings",
  "/plugins": "Plugins",
  "/plugin/db-viewer": "Database Viewer",
};

export function AppShell() {
  return (
    <HeaderProvider>
      <AppShellContent />
    </HeaderProvider>
  );
}

function AppShellContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [checkingFirstLaunch, setCheckingFirstLaunch] = useState(true);
  const [pageTitle, setPageTitle] = useState("AutoDesk");
  const [projectWorkspacePath, setProjectWorkspacePath] = useState<string | null>(null);
  const { headerActions } = useHeaderContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams({ strict: false }) as { projectId?: string };

  // Load sidebar default state from appearance settings
  useEffect(() => {
    rpc.getSettings("appearance").then((s) => {
      const raw = (s as Record<string, unknown>)["sidebar_default"];
      if (raw === "collapsed") setSidebarCollapsed(true);
      else if (raw === "expanded") setSidebarCollapsed(false);
    }).catch(() => {});

    const handler = (e: Event) => {
      const { sidebarDefault } = (e as CustomEvent<{ sidebarDefault: string }>).detail;
      if (sidebarDefault === "collapsed") setSidebarCollapsed(true);
      else if (sidebarDefault === "expanded") setSidebarCollapsed(false);
    };
    window.addEventListener("autodesk:sidebar-default-changed", handler);
    return () => window.removeEventListener("autodesk:sidebar-default-changed", handler);
  }, []);

  // Notify Bun of route changes so it can restore the page after tray-hide
  useEffect(() => {
    rpc.notifyRouteChanged(location.pathname);
  }, [location.pathname]);

  // Restore route after window recreation from tray (reads ?restoreRoute= param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restoreRoute = params.get("restoreRoute");
    if (restoreRoute && restoreRoute !== "/") {
      navigate({ to: restoreRoute });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the top-nav title + workspace path when navigating between pages/projects
  useEffect(() => {
    let ignore = false;

    if (!projectId) {
      // Check full path first (e.g. "/plugin/db-viewer"), then fall back to
      // the top-level segment (e.g. "/settings/providers" → "Settings")
      const segment = `/${location.pathname.split("/").filter(Boolean)[0] ?? ""}`;
      setPageTitle(PAGE_TITLES[location.pathname] ?? PAGE_TITLES[segment] ?? "AutoDesk");
      setProjectWorkspacePath(null);
      return;
    }
    rpc.getProject(projectId).then((p) => {
      if (ignore) return; // navigated away before this resolved — discard stale result
      const project = p as { name?: string; workspacePath?: string } | null;
      setPageTitle(project?.name ?? "AutoDesk");
      setProjectWorkspacePath(project?.workspacePath ?? null);
    }).catch(() => {});

    return () => { ignore = true; };
  }, [projectId, location.pathname]);

  // Redirect to onboarding if no providers exist (first launch or after reset)
  useEffect(() => {
    if (location.pathname === "/onboarding") {
      setCheckingFirstLaunch(false);
      return;
    }
    rpc.isFirstLaunch().then((isFirst) => {
      if (isFirst) {
        navigate({ to: "/onboarding" });
      }
      setCheckingFirstLaunch(false);
    }).catch(() => {
      setCheckingFirstLaunch(false);
    });
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { type, message } = (e as CustomEvent<{ type: "success" | "error" | "warning" | "info"; message: string }>).detail;
      toast(type, message);
    };
    window.addEventListener("autodesk:show-toast", handler);
    return () => window.removeEventListener("autodesk:show-toast", handler);
  }, []);

  // Track window focus so the backend can skip desktop notifications when the app is in focus
  useEffect(() => {
    const onFocus = () => rpc.setAppFocused(true).catch(() => {});
    const onBlur = () => rpc.setAppFocused(false).catch(() => {});
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // On the onboarding route, render just the page without shell chrome
  if (location.pathname === "/onboarding") {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  if (checkingFirstLaunch) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => {
          setSidebarCollapsed((prev) => {
            const next = !prev;
            rpc.saveSetting("sidebar_default", next ? "collapsed" : "expanded", "appearance").catch(() => {});
            return next;
          });
        }}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <ConnectionStatus />
        <TopNav title={pageTitle} workspacePath={projectWorkspacePath ?? undefined}>
          {headerActions}
        </TopNav>
        <div className="flex-1 overflow-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
      <Toaster />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      <StartupHealthDialog />
      <UserQuestionDialog />
    </div>
    </TooltipProvider>
  );
}

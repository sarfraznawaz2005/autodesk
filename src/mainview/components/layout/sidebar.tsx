import { useEffect, useState } from "react";
import pkg from "../../../../package.json";
import {
  Zap,
  LayoutDashboard,
  Bot,
  Settings,
  Puzzle,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Clock,
  BookOpen,
  Sparkles,
  BarChart2,
  Users,
  type LucideIcon,
  icons,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { rpc } from "@/lib/rpc";
import { Tip } from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const BASE_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Inbox", icon: Inbox, href: "/inbox" },
  { label: "Agents", icon: Bot, href: "/agents" },
  { label: "Skills", icon: Sparkles, href: "/skills" },
  { label: "Prompts", icon: BookOpen, href: "/prompts" },
  { label: "Scheduler", icon: Clock, href: "/scheduler" },
  { label: "Analytics", icon: BarChart2, href: "/analytics" },
  { label: "Council", icon: Users, href: "/council" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

function NavItemButton({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  const hasBadge = item.badge !== undefined && item.badge > 0;

  const link = (
    <Link
      to={item.href}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", active ? "text-indigo-600" : "")}
        aria-hidden="true"
      />
      {/* Collapsed badge dot */}
      {collapsed && hasBadge && (
        <span
          className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500"
          aria-label={`${item.badge} notifications`}
        />
      )}
      {!collapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
      {!collapsed && hasBadge && (
        <span
          className={cn(
            "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold",
            active
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-600"
          )}
          aria-label={`${item.badge} notifications`}
        >
          {(item.badge ?? 0) > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );

  return collapsed ? (
    <Tip content={item.label} side="right">
      {link}
    </Tip>
  ) : link;
}

/** Resolve a Lucide icon name (e.g. "Puzzle") to a component, with a fallback. */
function resolveIcon(name: string): LucideIcon {
  return (icons as Record<string, LucideIcon>)[name] ?? Puzzle;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  // Derive active item from the router's current pathname (hash routing aware)
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Poll for unread inbox count every 30 seconds
  const [inboxUnread, setInboxUnread] = useState(0);
  // Plugin-contributed sidebar items
  const [pluginItems, setPluginItems] = useState<NavItem[]>([]);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const result = await rpc.getUnreadCount();
        const count = (result as { count: number }).count ?? 0;
        setInboxUnread(count > 0 ? count : 0);
      } catch {
        // silently ignore — badge just won't show
      }
    }

    fetchUnread();
    const intervalId = setInterval(fetchUnread, 30_000);

    // Also refresh on real-time inbox events
    const handler = () => fetchUnread();
    window.addEventListener("autodesk:inbox-message-received", handler);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("autodesk:inbox-message-received", handler);
    };
  }, []);

  // Fetch plugin sidebar extensions and refresh on plugin toggle
  useEffect(() => {
    function fetchExtensions() {
      rpc.getPluginExtensions().then((ext) => {
        setPluginItems(
          ext.sidebarItems.map((si) => ({
            label: si.label,
            icon: resolveIcon(si.icon),
            href: si.href,
          })),
        );
      }).catch(() => {});
    }

    fetchExtensions();
    window.addEventListener("autodesk:plugins-changed", fetchExtensions);
    return () => window.removeEventListener("autodesk:plugins-changed", fetchExtensions);
  }, []);

  const ALL_NAV_ITEMS: NavItem[] = [
    ...BASE_NAV_ITEMS.slice(0, -1), // everything except Settings
    ...pluginItems,
    BASE_NAV_ITEMS[BASE_NAV_ITEMS.length - 1], // Settings always last
  ];

  const activeHref =
    ALL_NAV_ITEMS.find((item) => item.href !== "/" && pathname.startsWith(item.href))
      ?.href ?? (pathname === "/" ? "/" : null) ?? "/";

  const NAV_ITEMS: NavItem[] = ALL_NAV_ITEMS
    .map((item) => (item.href === "/inbox" ? { ...item, badge: inboxUnread } : item));

  return (
    <aside
      className={cn(
        "flex flex-col bg-gray-50 border-r border-gray-200 transition-all duration-200 ease-in-out shrink-0",
        collapsed ? "w-[60px]" : "w-[200px]"
      )}
      aria-label="Main navigation"
    >
      {/* Brand area */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-gray-200 shrink-0 overflow-hidden",
          collapsed ? "justify-center px-0" : "gap-2 px-3"
        )}
      >
        <Link to="/" className="flex items-center gap-2 cursor-pointer min-w-0">
          <Zap className="h-5 w-5 text-indigo-600 shrink-0" aria-hidden="true" />
          {!collapsed && (
            <span className="font-semibold text-lg text-gray-900 truncate flex-1">
              AutoDesk
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center justify-center rounded-md p-1.5 text-gray-400 shrink-0",
            "hover:bg-gray-200 hover:text-gray-600 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => (
          <NavItemButton
            key={item.href}
            item={item}
            collapsed={collapsed}
            active={activeHref === item.href}
          />
        ))}
      </nav>

      {/* Footer: version */}
      <div className="shrink-0 border-t border-gray-200 py-2">
        <div className="text-xs font-bold text-gray-600 select-none text-center">
          v{pkg.version}
        </div>
      </div>
    </aside>
  );
}

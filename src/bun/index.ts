import Electrobun from "electrobun/bun";
import { BrowserWindow, Updater, Utils, Screen, ApplicationMenu, Tray } from "electrobun/bun";
import { existsSync, mkdirSync } from "fs";
import { join, dirname, resolve } from "path";
import { dlopen, FFIType, ptr } from "bun:ffi";
import { initGlobalErrorHandlers } from "./db/error-logger";
import { runMigrations } from "./db/migrate";
import { seedDatabase } from "./db/seed";
import { closeDatabase } from "./db";
import { startWalCheckpointTimer } from "./db/connection";
import { setDiscordStatusGetter } from "./rpc/discord";
import { initPlugins } from "./plugins";
import { skillRegistry } from "./skills/registry";
import { setTaskExecutorEngine, initCronScheduler, shutdownCronScheduler, initAutomationEngine, shutdownAutomationEngine } from "./scheduler";
import { registerAdapter, initChannelManager, shutdownChannelManager, getChannelStatuses } from "./channels";
import { DiscordAdapter } from "./channels/discord-adapter";
import { WhatsAppAdapter } from "./channels/whatsapp-adapter";
import { EmailAdapter } from "./channels/email-adapter";

import * as settingsRpc from "./rpc/settings";
import { maybeRunStartupMaintenance } from "./db/maintenance";
import { getOrCreateEngine, setMainWindowRef } from "./engine-manager";
import { rpc, onSettingChange, getLastKnownRoute } from "./rpc-registration";
import { syncWorkspaceFolders } from "./rpc/projects";
import { setSchedulerRunning } from "./rpc/health";
import { initTruncationDir, cleanupTruncationFiles } from "./agents/tools/truncation";
import { initMcpClients, shutdownMcpClients } from "./mcp/client";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

// Window state shape persisted to disk
interface WindowState {
	x: number;
	y: number;
	width: number;
	height: number;
}

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 800;

function getWindowStateFilePath(): string {
	return `${Utils.paths.userData}/window-state.json`;
}

async function loadWindowState(): Promise<WindowState> {
	const filePath = getWindowStateFilePath();

	if (existsSync(filePath)) {
		try {
			const file = Bun.file(filePath);
			const text = await file.text();
			const state = JSON.parse(text) as WindowState;
			if (
				typeof state.x === "number" &&
				typeof state.y === "number" &&
				typeof state.width === "number" &&
				typeof state.height === "number" &&
				state.width > 0 &&
				state.height > 0
			) {
				return state;
			}
		} catch (_err) {
			console.warn("Failed to load window state, using defaults");
		}
	}

	// Fallback: center on primary display
	const display = await Screen.getPrimaryDisplay();
	const { workArea } = display;
	const width = DEFAULT_WIDTH;
	const height = DEFAULT_HEIGHT;
	const x = Math.round((workArea.width - width) / 2) + workArea.x;
	const y = Math.round((workArea.height - height) / 2) + workArea.y;

	return { x, y, width, height };
}

async function saveWindowState(state: WindowState): Promise<void> {
	const filePath = getWindowStateFilePath();
	const dir = Utils.paths.userData;

	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}

	try {
		await Bun.write(filePath, JSON.stringify(state, null, 2));
	} catch (_err) {
		console.error("Failed to save window state");
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return ((...args: Parameters<T>) => {
		if (timer !== undefined) clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	}) as T;
}

// Check if Vite dev server is running for HMR
async function getMainViewUrl(): Promise<string> {
	const channel = await Updater.localInfo.channel();
	if (channel === "dev") {
		// Retry for up to 15 seconds so Vite can finish starting when launched concurrently
		for (let i = 0; i < 30; i++) {
			try {
				await fetch(DEV_SERVER_URL, { method: "HEAD" });
				console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
				return DEV_SERVER_URL;
			} catch {
				if (i === 0) console.log("Waiting for Vite dev server...");
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}
		console.log("Vite dev server not available. Falling back to bundled files.");
	}
	return "views://mainview/index.html";
}

// ---------------------------------------------------------------------------
// Global error handlers — install before anything else can throw
// ---------------------------------------------------------------------------
initGlobalErrorHandlers();

// ---------------------------------------------------------------------------
// Database initialisation — run migrations then seed default data
// ---------------------------------------------------------------------------
runMigrations();
await seedDatabase();

maybeRunStartupMaintenance();
startWalCheckpointTimer();

// Cleanup orphaned workflow:* settings keys from removed WorkflowEngine
try {
	const { like } = await import("drizzle-orm");
	const { settings: settingsTable } = await import("./db/schema");
	const { db: database } = await import("./db");
	const deleted = database.delete(settingsTable).where(like(settingsTable.key, "workflow:%")).run() as unknown as { changes: number };
	if (deleted.changes > 0) console.log(`[startup] Cleaned up ${deleted.changes} orphaned workflow settings`);
} catch { /* non-critical */ }

await syncWorkspaceFolders();

// Initialise truncation directory for tool output overflow + cleanup old files
initTruncationDir(Utils.paths.userData);
cleanupTruncationFiles().catch(() => {});

// Cron scheduler and automation engine start early so health checks pass
// and scheduled jobs fire on time. Plugins, skills, channels, and MCP
// are deferred to dom-ready (network/disk I/O that doesn't block the UI).
setTaskExecutorEngine(getOrCreateEngine);
await initCronScheduler();
setSchedulerRunning(true);
initAutomationEngine();

// Whether minimize-to-taskbar is currently active.
const minimizeToTraySetting = await settingsRpc.getSetting("minimize_to_tray", "general");
let minimizeToTray = String(minimizeToTraySetting) === "true";

// Keepalive timer — prevents Bun event loop from exiting when no windows
// exist (exitOnLastWindowClosed: false doesn't always work for recreated windows).
let keepaliveTimer: ReturnType<typeof setInterval> | undefined;

// Whether the window has been destroyed and is "hidden to tray".
let windowIsHidden = false;

// Keep in sync when the user toggles it in settings UI
onSettingChange("minimize_to_tray", (val) => {
	minimizeToTray = String(val) === "true";
});


// Load persisted window state (or compute centered defaults)
const savedFrame = await loadWindowState();
const url = await getMainViewUrl();

// True only in the "dev" channel — controls DevTools access and context menu.
const isDevMode = url.startsWith("http://localhost");

// Create the main application window using saved frame
let mainWindow = new BrowserWindow({
	title: "AutoDesk",
	url,
	frame: {
		width: savedFrame.width,
		height: savedFrame.height,
		x: savedFrame.x,
		y: savedFrame.y,
	},
	rpc,
});

// Assign the module-level ref so engine callbacks can send RPC messages
setMainWindowRef(mainWindow);

// Maximize once the webview DOM is ready so the layout fills the full window.
// All background services (plugins, channels, scheduler, MCP) are also started
// here so the window appears immediately without waiting for network/disk I/O.
let backgroundServicesInitialised = false;
mainWindow.webview.on("dom-ready", () => {
	mainWindow.maximize();
	setWindowTitlebarIcon("AutoDesk", titlebarIconPath);
	if (!isDevMode) {
		// Disable right-click context menu in production — removes Inspect Element
		mainWindow.webview.executeJavascript(
			"document.addEventListener('contextmenu', e => e.preventDefault(), true)",
		);
	}
	if (!backgroundServicesInitialised) {
		backgroundServicesInitialised = true;
		(async () => {
			// Plugins (LSP manager, DB viewer, etc.)
			await initPlugins();

			// Skills
			skillRegistry.loadAll();

			// Channel manager (Discord, WhatsApp, Email)
			registerAdapter("discord", () => new DiscordAdapter());
			registerAdapter("whatsapp", () => new WhatsAppAdapter());
			registerAdapter("email", () => new EmailAdapter());
			await initChannelManager(getOrCreateEngine);

			// Wire Discord status getter after channel manager is ready
			setDiscordStatusGetter(() => {
				const statuses = getChannelStatuses();
				const discordStatuses = statuses.filter((s) => s.platform === "discord");
				if (discordStatuses.length === 0) return { status: "disconnected" as const };
				if (discordStatuses.every((s) => s.status === "connected")) return { status: "connected" as const };
				if (discordStatuses.some((s) => s.status === "error")) return { status: "error" as const };
				if (discordStatuses.some((s) => s.status === "connecting")) return { status: "reconnecting" as const };
				return { status: "disconnected" as const };
			});

			// MCP clients
			initMcpClients().catch((err) => console.error("[mcp] Init error:", err));
		})().catch((err) => console.error("[startup] Background services error:", err));
	}
});

// Block all external navigation — only bundled views and the Vite dev server
// are allowed.  This prevents AI-generated content from redirecting the window
// to arbitrary external URLs.
mainWindow.webview.setNavigationRules([
	"^*",                        // Block all by default
	"views://*",                 // Allow bundled views
	"http://localhost:5173*",    // Allow Vite dev server (HMR)
]);

// Debounced save so we don't hammer the filesystem on every pixel change
const debouncedSave = debounce(async (state: WindowState) => {
	await saveWindowState(state);
}, 500);

// Track current in-memory state so move events can merge with last known size
let currentState: WindowState = { ...savedFrame };

function attachWindowListeners(win: typeof mainWindow): void {
	win.on("resize", (e: unknown) => {
		const event = e as { data: { x: number; y: number; width: number; height: number } };
		const { x, y, width, height } = event.data;
		currentState = { x, y, width, height };
		debouncedSave(currentState);
	});

	win.on("move", (e: unknown) => {
		const event = e as { data: { x: number; y: number } };
		const { x, y } = event.data;
		currentState = { ...currentState, x, y };
		debouncedSave(currentState);
	});

	// Electrobun does not support cancelling window close events.
	// When minimize-to-tray is on, mark the window as hidden and start a
	// keepalive timer so the Bun event loop doesn't exit.  The tray handler
	// recreates the window on demand.
	win.on("close", () => {
		if (minimizeToTray) {
			console.log("[window-close] Hidden to tray");
			windowIsHidden = true;
			if (!keepaliveTimer) {
				keepaliveTimer = setInterval(() => {}, 30_000);
			}
		} else {
			Utils.quit();
		}
	});
}

attachWindowListeners(mainWindow);

// Cleanup on quit — fires for Utils.quit(), Cmd+Q, tray Quit, Ctrl+C, etc.
Electrobun.events.on("before-quit", () => {
	(async () => {
		try {
			if (!windowIsHidden) {
				const frame = mainWindow.getFrame();
				await saveWindowState({
					x: frame.x,
					y: frame.y,
					width: frame.width,
					height: frame.height,
				});
			}
		} catch (_err) {
			console.error("Failed to save window state on quit");
		}

		await shutdownChannelManager();
		shutdownCronScheduler();
		shutdownAutomationEngine();
		await shutdownMcpClients();
		closeDatabase();
	})();
});

ApplicationMenu.setApplicationMenu([]);

// ---------------------------------------------------------------------------
// Titlebar icon (Windows only) — set via Win32 FFI after DOM is ready.
// The .ico is copied to {app.exe}/../Resources/app.ico by electrobun.config.ts.
// ---------------------------------------------------------------------------
const titlebarIconPath = join(dirname(process.argv0), "..", "Resources", "app.ico");

function setWindowTitlebarIcon(windowTitle: string, iconFilePath: string): void {
	try {
		const user32 = dlopen("user32.dll", {
			FindWindowW:  { args: [FFIType.ptr, FFIType.ptr], returns: FFIType.ptr },
			SendMessageW: { args: [FFIType.ptr, FFIType.u32, FFIType.u64, FFIType.ptr], returns: FFIType.ptr },
			LoadImageW:   { args: [FFIType.ptr, FFIType.ptr, FFIType.u32, FFIType.i32, FFIType.i32, FFIType.u32], returns: FFIType.ptr },
		});

		const toWide = (s: string) => {
			const b = Buffer.alloc((s.length + 1) * 2);
			b.write(s, 0, "utf16le");
			return b;
		};

		const WM_SETICON      = 0x0080;
		const IMAGE_ICON      = 1;
		const LR_LOADFROMFILE = 0x0010;
		const LR_DEFAULTSIZE  = 0x0040;

		const pathBuf  = toWide(iconFilePath);
		const titleBuf = toWide(windowTitle);

		const hIcon = user32.symbols.LoadImageW(null, ptr(pathBuf), IMAGE_ICON, 0, 0, LR_LOADFROMFILE | LR_DEFAULTSIZE);
		const hwnd  = user32.symbols.FindWindowW(null, ptr(titleBuf));

		if (hwnd && hIcon) {
			user32.symbols.SendMessageW(hwnd, WM_SETICON, 1, hIcon); // ICON_BIG
			user32.symbols.SendMessageW(hwnd, WM_SETICON, 0, hIcon); // ICON_SMALL
		}
	} catch {
		// Non-fatal — icon is cosmetic only
	}
}

// System tray — use an absolute path so the native binary can load it directly.
// In production: bundled app.ico in Resources/. In dev: source assets/icon.ico.
const trayIconPath = existsSync(titlebarIconPath)
	? titlebarIconPath
	: resolve(import.meta.dir, "../../assets/icon.ico");

const tray = new Tray({
	title: "AutoDesk",
	image: trayIconPath,
	template: false,
	width: 32,
	height: 32,
});

tray.setMenu([
	{ type: "normal", label: "Show AutoDesk", action: "show" },
	{ type: "divider" },
	{ type: "normal", label: "Quit", action: "quit" },
]);

function showOrRestoreWindow(): void {
	if (!windowIsHidden) {
		if (mainWindow.isMinimized()) {
			mainWindow.unminimize();
		}
		mainWindow.focus();
		return;
	}

	// Window was destroyed — recreate it with the last known route.
	const lastRoute = getLastKnownRoute();
	let restoreUrl = url;
	if (lastRoute && lastRoute !== "/") {
		const separator = url.includes("?") ? "&" : "?";
		restoreUrl = `${url}${separator}restoreRoute=${encodeURIComponent(lastRoute)}`;
	}

	mainWindow = new BrowserWindow({
		title: "AutoDesk",
		url: restoreUrl,
		frame: {
			width: currentState.width,
			height: currentState.height,
			x: currentState.x,
			y: currentState.y,
		},
		rpc,
	});

	setMainWindowRef(mainWindow);

	mainWindow.webview.on("dom-ready", () => {
		mainWindow.maximize();
		setWindowTitlebarIcon("AutoDesk", titlebarIconPath);
		if (!isDevMode) {
			mainWindow.webview.executeJavascript(
				"document.addEventListener('contextmenu', e => e.preventDefault(), true)",
			);
		}
	});

	mainWindow.webview.setNavigationRules([
		"^*",
		"views://*",
		"http://localhost:5173*",
	]);

	attachWindowListeners(mainWindow);
	windowIsHidden = false;

	// Clear keepalive — window event loop keeps the process alive now
	if (keepaliveTimer) {
		clearInterval(keepaliveTimer);
		keepaliveTimer = undefined;
	}

	console.log("[tray] Window restored", lastRoute ? `(route: ${lastRoute})` : "");
}

// Handle tray interactions — menu item clicks carry the action string
tray.on("tray-clicked", (e: unknown) => {
	const event = e as { data: { action?: string } };
	switch (event.data?.action) {
		case "show":
			showOrRestoreWindow();
			break;
		case "quit":
			if (keepaliveTimer) {
				clearInterval(keepaliveTimer);
				keepaliveTimer = undefined;
			}
			Utils.quit();
			break;
		default:
			// Icon click without a menu action — restore the window
			showOrRestoreWindow();
			break;
	}
});

console.log("AutoDesk started!");

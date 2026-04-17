import { join } from "path";
import { readdirSync } from "fs";
import { Updater, Utils } from "electrobun/bun";
import { broadcastToWebview } from "../engine-manager";

function relayStatus() {
	Updater.onStatusChange((entry) => {
		const progress = entry.details?.progress;
		broadcastToWebview("updateStatus", {
			status: entry.status,
			message: entry.message,
			...(progress !== undefined && { progress }),
		});
	});
}

export async function checkForUpdate() {
	try {
		relayStatus();
		const result = await Updater.checkForUpdate();
		return { ...result, devMode: false };
	} catch {
		// version.json not present — running in dev mode
		return {
			version: "",
			hash: "",
			updateAvailable: false,
			updateReady: false,
			error: "",
			devMode: true,
		};
	}
}

export async function downloadUpdate() {
	try {
		relayStatus();
		await Updater.downloadUpdate();
		return { success: true };
	} catch (e) {
		return { success: false, error: (e as Error).message };
	}
}

export async function applyUpdate() {
	try {
		// On Windows, queue a detached fallback extractor before calling applyUpdate().
		// The native electrobun extractor has an intermittent deadlock bug (fixed in
		// electrobun 1.17.x). The fallback wakes up 15s after quit, checks whether
		// the native extractor ran (launcher.exe running = success), and extracts +
		// relaunches if it didn't.
		if (process.platform === "win32") {
			await queueWindowsUpdateFallback();
		}

		await Updater.applyUpdate();
		return { success: true };
	} catch (e) {
		return { success: false, error: (e as Error).message };
	}
}

// ---------------------------------------------------------------------------
// Windows fallback extractor
// ---------------------------------------------------------------------------

async function queueWindowsUpdateFallback(): Promise<void> {
	try {
		const selfExtractionDir = join(Utils.paths.userData, "self-extraction");
		const appDir            = join(Utils.paths.userData, "app");
		// launcher.exe lives at the userData level (one above app/), not inside app/bin/
		const launcherPath      = join(Utils.paths.userData, "launcher.exe");
		// Sentinel file: if native extractor succeeded, Resources/version.json exists
		const sentinelPath      = join(appDir, "Resources", "version.json");

		// Find the downloaded update tar (deposited by downloadUpdate())
		let tars: string[] = [];
		try {
			tars = readdirSync(selfExtractionDir).filter((f) => f.endsWith(".tar"));
		} catch {
			return; // self-extraction dir doesn't exist — nothing to do
		}
		if (tars.length === 0) return;

		const tarFile      = join(selfExtractionDir, tars[0]);
		const psScriptPath = join(Utils.paths.userData, "update-fallback.ps1");
		const vbsPath      = join(Utils.paths.userData, "update-launch.vbs");

		// PS single-quote escape helper
		const esc = (s: string) => s.replace(/'/g, "''");

		// The fallback script: waits 20s, checks if native extractor succeeded via
		// version.json sentinel, extracts + relaunches only if it didn't.
		const psContent = `# AutoDesk update fallback
# Queued before Apply & Restart to handle the intermittent electrobun extractor
# deadlock (https://github.com/blackboardsh/electrobun/pull/277).
# Logic: wait 20s, then check Resources/version.json (sentinel).
# If it exists the native extractor succeeded — exit silently.
# If it doesn't exist (deadlock scenario), extract the tar and relaunch.

$tarFile  = '${esc(tarFile)}'
$appDir   = '${esc(appDir)}'
$sentinel = '${esc(sentinelPath)}'
$launcher = '${esc(launcherPath)}'

Start-Sleep -Seconds 20

# Native extractor success: version.json was written by the extractor
if (Test-Path $sentinel) {
    Remove-Item $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue
    exit 0
}

# Native extractor failed (deadlock): extract ourselves and relaunch
if (Test-Path $tarFile) {
    tar -xf $tarFile -C $appDir --strip-components=1 2>$null
    Remove-Item -Path $tarFile -Force -ErrorAction SilentlyContinue
}

if (Test-Path $launcher) {
    Start-Process -FilePath $launcher
}

Remove-Item $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue
`;

		// VBScript launcher: spawns PowerShell completely detached from our process
		// tree so it survives after bun.exe exits. wscript.exe does not inherit
		// Windows Job Objects the way cmd.exe does, making this the most reliable
		// detachment method without requiring elevated permissions.
		const vbsContent = `Set oShell = CreateObject("WScript.Shell")
oShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & WScript.Arguments(0) & """", 0, False
`;

		await Bun.write(psScriptPath, psContent);
		await Bun.write(vbsPath, vbsContent);

		// Run wscript synchronously — exits in milliseconds after spawning PS
		Bun.spawnSync(
			["wscript.exe", "/b", vbsPath, psScriptPath],
			{ stdout: "ignore", stderr: "ignore" },
		);
	} catch (err) {
		// Non-critical — log but never block the apply
		console.error("[update-fallback] Failed to queue Windows fallback:", err);
	}
}

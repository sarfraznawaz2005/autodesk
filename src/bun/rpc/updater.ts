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
		if (process.platform === "win32") {
			// The native Electrobun applyUpdate() deadlocks on Windows because it tries
			// to extract the tar while bun.exe is still running (file-in-use), then
			// launches from a hardcoded wrong path (app/bin/launcher.exe).
			// Instead: queue our PS script (which waits for bun.exe to die first) and
			// exit cleanly ourselves. The PS script handles extraction and relaunch.
			await queueWindowsUpdateFallback();
			setTimeout(() => process.exit(0), 400); // give RPC response time to flush
			return { success: true };
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
		// launcher.exe lives at the userData root (one level above app/), not inside app/bin/
		const launcherPath      = join(Utils.paths.userData, "launcher.exe");

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

		// The PS script: waits for bun.exe to fully exit (so no file locks),
		// then extracts the tar and relaunches. No sentinel check needed since
		// we skip Updater.applyUpdate() on Windows entirely.
		const psContent = `# AutoDesk update extractor
# Runs detached after the app quits. Waits for the app process to fully exit
# so no files are locked, then extracts the update tar and relaunches.

$tarFile  = '${esc(tarFile)}'
$appDir   = '${esc(appDir)}'
$launcher = '${esc(launcherPath)}'

# Log helper — writes to a file next to this script so failures are diagnosable
$logFile = [System.IO.Path]::ChangeExtension($MyInvocation.MyCommand.Path, '.log')
function Log($msg) { "$(Get-Date -Format 'HH:mm:ss') $msg" | Add-Content $logFile }

Log "Update extractor started"

# Wait up to 30 s for the app to fully exit.
# The process may be named 'bun' or 'AutoDesk' depending on the build.
$timeout = 30
$elapsed = 0
function AppRunning {
    (Get-Process -Name 'bun'      -ErrorAction SilentlyContinue) -or
    (Get-Process -Name 'AutoDesk' -ErrorAction SilentlyContinue)
}
while ((AppRunning) -and ($elapsed -lt $timeout)) {
    Start-Sleep -Seconds 1
    $elapsed++
}
Log "App exited after $($elapsed)s (or timeout). Waiting extra 3s for handles to release"
Start-Sleep -Seconds 3

# Extract the update into the app directory
if (Test-Path $tarFile) {
    Log "Extracting $tarFile -> $appDir"
    $result = tar -xf $tarFile -C $appDir --strip-components=1 2>&1
    Log "tar result: $result (exit $LASTEXITCODE)"
    if ($LASTEXITCODE -eq 0) {
        Remove-Item -Path $tarFile -Force -ErrorAction SilentlyContinue
        Log "Tar removed"
    } else {
        Log "ERROR: tar failed — leaving tar in place for diagnostics"
    }
} else {
    Log "ERROR: tar not found at $tarFile"
}

# Relaunch
if (Test-Path $launcher) {
    Log "Launching $launcher"
    Start-Process -FilePath $launcher
} else {
    Log "ERROR: launcher not found at $launcher"
}

Log "Done"
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

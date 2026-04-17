import { join } from "path";
import { Utils } from "electrobun/bun";

/**
 * Registers the app in Windows "Add or Remove Programs" (HKCU uninstall key).
 * Called on startup but skips the PowerShell write when the registered version
 * already matches the current version — so the cost is one fast `reg query` call
 * on subsequent launches instead of a full PowerShell spawn.
 * Only runs on Windows stable builds — silently no-ops on other platforms/channels.
 */
export async function registerWindowsUninstaller(): Promise<void> {
    if (process.platform !== "win32") return;

    try {
        const versionJson = await Bun.file("../Resources/version.json").json() as {
            identifier: string;
            channel: string;
            name: string;
            version: string;
        };

        const { identifier, channel, name, version } = versionJson;

        // Only register for stable releases — skip dev builds
        if (channel !== "stable") return;

        const regKey = `HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${identifier}`;

        // Fast path: query the currently registered version. If it matches, skip
        // the PowerShell spawn entirely — saves ~200 ms on every normal startup.
        const queryResult = Bun.spawnSync([
            "reg", "query", regKey, "/v", "DisplayVersion",
        ], { stderr: "ignore" });

        if (queryResult.exitCode === 0) {
            const output = new TextDecoder().decode(queryResult.stdout);
            // reg query output contains the value on a line like:
            //     DisplayVersion    REG_SZ    0.0.9
            const match = output.match(/DisplayVersion\s+REG_SZ\s+(\S+)/);
            if (match && match[1] === version) {
                // Already up-to-date — nothing to do
                return;
            }
        }

        const installDir  = join(Utils.paths.userData, "app");
        const iconPath    = join(installDir, "Resources", "app.ico");
        // electrobun copies all copy-section assets into Resources/app/
        const scriptPath  = join(installDir, "Resources", "app", "uninstall.ps1");
        const regKeyPs    = `HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\${identifier}`;
        const uninstallStr = `powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File "${scriptPath}"`;

        const psScript = `
$regPath = '${regKeyPs}'
New-Item -Path $regPath -Force | Out-Null
New-ItemProperty -Path $regPath -Name 'DisplayName'     -Value '${name}'           -PropertyType String -Force | Out-Null
New-ItemProperty -Path $regPath -Name 'DisplayVersion'  -Value '${version}'        -PropertyType String -Force | Out-Null
New-ItemProperty -Path $regPath -Name 'Publisher'       -Value 'Sarfraz Ahmed'     -PropertyType String -Force | Out-Null
New-ItemProperty -Path $regPath -Name 'DisplayIcon'     -Value '${iconPath},0'     -PropertyType String -Force | Out-Null
New-ItemProperty -Path $regPath -Name 'InstallLocation' -Value '${installDir}'     -PropertyType String -Force | Out-Null
New-ItemProperty -Path $regPath -Name 'UninstallString' -Value '${uninstallStr}'   -PropertyType String -Force | Out-Null
New-ItemProperty -Path $regPath -Name 'NoModify'        -Value 1                   -PropertyType DWord  -Force | Out-Null
New-ItemProperty -Path $regPath -Name 'NoRepair'        -Value 1                   -PropertyType DWord  -Force | Out-Null
`;

        // Fire-and-forget — don't block the startup thread
        Bun.spawn([
            "powershell.exe",
            "-ExecutionPolicy", "Bypass",
            "-WindowStyle", "Hidden",
            "-Command", psScript,
        ], { stdout: "ignore", stderr: "ignore" });
    } catch (err) {
        // Non-critical — never crash the app over registry writes
        console.error("[windows-registry] Failed to register uninstaller:", err);
    }
}

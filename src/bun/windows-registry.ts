import { join } from "path";
import { Utils } from "electrobun/bun";

/**
 * Registers the app in Windows "Add or Remove Programs" (HKCU uninstall key).
 * Called on every startup so the version shown is always current.
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

        const installDir  = join(Utils.paths.userData, "app");
        const iconPath    = join(installDir, "Resources", "app.ico");
        const scriptPath  = join(installDir, "Resources", "uninstall.ps1");
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

        Bun.spawnSync([
            "powershell.exe",
            "-ExecutionPolicy", "Bypass",
            "-WindowStyle", "Hidden",
            "-Command", psScript,
        ]);
    } catch (err) {
        // Non-critical — never crash the app over registry writes
        console.error("[windows-registry] Failed to register uninstaller:", err);
    }
}

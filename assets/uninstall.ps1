# AutoDesk Uninstaller
# Bundled at: Resources/uninstall.ps1
# Called by the Windows "Add or Remove Programs" UninstallString.
# PowerShell loads the full script before executing, so deleting this file's
# parent directory mid-run is safe.

$identifier = "com.sarfrazai.autodesk"
$appRoot    = Join-Path $env:LOCALAPPDATA $identifier
$regPath    = "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\$identifier"

# Kill any running app process
Get-Process -Name "launcher" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Remove all app files and user data
if (Test-Path $appRoot) {
    Remove-Item -Path $appRoot -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove the "Add or Remove Programs" registry entry
if (Test-Path $regPath) {
    Remove-Item -Path $regPath -Recurse -Force -ErrorAction SilentlyContinue
}

# Enable WebView2 remote debugging so edge://inspect can attach DevTools to the live app
$env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = "--remote-debugging-port=9222"

# Start Vite dev server in a hidden window so it doesn't share the console
$vite = Start-Process -FilePath "cmd" -ArgumentList "/c bun run hmr" -PassThru -WindowStyle Hidden

# Poll until Vite is ready (up to 30 seconds)
Write-Host "Waiting for Vite dev server on http://localhost:5173..."
$ready = $false
for ($i = 0; $i -lt 60; $i++) {
    try {
        Invoke-WebRequest -Uri "http://localhost:5173" -Method HEAD -TimeoutSec 1 -ErrorAction Stop | Out-Null
        $ready = $true
        Write-Host "Vite ready. Starting Electrobun..."
        break
    } catch {
        Start-Sleep -Milliseconds 500
    }
}

if (-not $ready) {
    Write-Host "Vite did not start in time. Launching anyway..."
}

# Start Electrobun (blocks until app closes)
cmd /c "bunx electrobun dev"

# Kill Vite and all its child processes (bun) when app exits
taskkill /F /T /PID $vite.Id 2>$null | Out-Null

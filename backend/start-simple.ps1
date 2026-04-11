# Simple PowerShell script to start backend server

# Set paths
$nodeExe = "C:\Program Files\nodejs\node.exe"
$serverFile = "$PSScriptRoot\server.ts"

# Check if files exist
if (!(Test-Path $nodeExe)) {
    Write-Host "ERROR: Node.js not found at $nodeExe"
    exit 1
}

if (!(Test-Path $serverFile)) {
    Write-Host "ERROR: server.ts not found at $serverFile"
    exit 1
}

Write-Host "Found Node.js: $nodeExe"
Write-Host "Found server.ts: $serverFile"
Write-Host ""

# Try to run the server directly
Write-Host "Attempting to run server.ts..."
try {
    & $nodeExe $serverFile
} catch {
    Write-Host "ERROR: Failed to run server: $($_.Exception.Message)"
    exit 1
}

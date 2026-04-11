# PowerShell script to start backend server

# Set Node.js path
$nodePath = "C:\Program Files\nodejs"
$env:PATH = "$nodePath;$env:PATH"

Write-Host "Node.js path: $nodePath"
Write-Host "Current PATH: $env:PATH"
Write-Host ""

# Check if node exists
if (Test-Path "$nodePath\node.exe") {
    Write-Host "Node.js found at: $nodePath\node.exe"
    & "$nodePath\node.exe" --version
} else {
    Write-Host "ERROR: Node.js not found at $nodePath"
    exit 1
}

# Run the server using tsx from node_modules
$tsxPath = "$PSScriptRoot\node_modules\.bin\tsx"

if (Test-Path $tsxPath) {
    Write-Host "Starting backend server..."
    Write-Host "Running: $nodePath\node.exe $tsxPath watch server.ts"
    & "$nodePath\node.exe" "$tsxPath" watch server.ts
} else {
    Write-Host "ERROR: tsx not found. Please run 'npm install' first."
    exit 1
}

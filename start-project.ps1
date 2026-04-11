# PowerShell script to start the project

# Set execution policy to allow running scripts
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Set Node.js path
$nodePath = "C:\Program Files\nodejs"
$nodeExe = "$nodePath\node.exe"
$npmExe = "$nodePath\npm.cmd"

# Check if Node.js exists
if (!(Test-Path $nodeExe)) {
    Write-Host "ERROR: Node.js not found at $nodeExe" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host "Found Node.js: $nodeExe" -ForegroundColor Green
Write-Host "Found npm: $npmExe" -ForegroundColor Green

# Set environment variable
$env:PATH = "$nodePath;$env:PATH"
Write-Host "Environment variable PATH updated" -ForegroundColor Green

# Get project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Project directory: $projectDir" -ForegroundColor Green

# Install backend dependencies
Write-Host "`n1. Installing backend dependencies..." -ForegroundColor Cyan
$backendDir = "$projectDir\backend"
if (Test-Path "$backendDir\package.json") {
    Write-Host "Running: npm install in backend"
    & $npmExe install -C $backendDir
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Backend dependencies installation failed" -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
    Write-Host "Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR: backend/package.json not found" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# Install frontend dependencies
Write-Host "`n2. Installing frontend dependencies..." -ForegroundColor Cyan
$frontendDir = "$projectDir\frontend"
if (Test-Path "$frontendDir\package.json") {
    Write-Host "Running: npm install in frontend"
    & $npmExe install -C $frontendDir
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Frontend dependencies installation failed" -ForegroundColor Red
        Read-Host "Press Enter to exit..."
        exit 1
    }
    Write-Host "Frontend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR: frontend/package.json not found" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# Start backend server
Write-Host "`n3. Starting backend server..." -ForegroundColor Cyan
$backendProcess = Start-Process -FilePath $npmExe -ArgumentList "run dev" -WorkingDirectory $backendDir -WindowStyle Normal -PassThru
Write-Host "Backend server started (port: 3002)" -ForegroundColor Green
Write-Host "Backend address: http://localhost:3002" -ForegroundColor Green

# Wait for 3 seconds
Write-Host "`nWaiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "`n4. Starting frontend server..." -ForegroundColor Cyan
$frontendProcess = Start-Process -FilePath $npmExe -ArgumentList "run dev" -WorkingDirectory $frontendDir -WindowStyle Normal -PassThru
Write-Host "Frontend server started (port: 5173)" -ForegroundColor Green
Write-Host "Frontend address: http://localhost:5173" -ForegroundColor Green

# Show final message
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Project started successfully!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3002" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

Read-Host "Press Enter to close this window..."

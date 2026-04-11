@echo off
chcp 65001 >nul

:: Set Node.js path
set NODE_EXE="C:\Program Files\nodejs\node.exe"
set SERVER_FILE="server.ts"
set NODE_MODULES="node_modules"

:: Check if files exist
if not exist %NODE_EXE% (
    echo ERROR: Node.js not found at %NODE_EXE%
    pause
    exit /b 1
)

if not exist %SERVER_FILE% (
    echo ERROR: server.ts not found
    pause
    exit /b 1
)

if not exist %NODE_MODULES% (
    echo ERROR: node_modules not found. Please run npm install first.
    pause
    exit /b 1
)

echo Found Node.js: %NODE_EXE%
echo Found server.ts: %SERVER_FILE%
echo Found node_modules: %NODE_MODULES%
echo.

:: Try to run with tsx
set TSX_PATH="%~dp0\node_modules\.bin\tsx"

if exist %TSX_PATH% (
    echo Attempting to run with tsx...
    %NODE_EXE% %TSX_PATH% watch %SERVER_FILE%
) else (
    echo ERROR: tsx not found in node_modules
    echo Attempting to install tsx...
    %NODE_EXE% "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install tsx
    if %ERRORLEVEL% equ 0 (
        echo tsx installed successfully
        %NODE_EXE% %TSX_PATH% watch %SERVER_FILE%
    ) else (
        echo ERROR: Failed to install tsx
        pause
        exit /b 1
    )
)

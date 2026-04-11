@echo off
chcp 65001 >nul

:: Set Node.js path
set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

echo Node.js path: %NODE_PATH%
echo Current PATH: %PATH%
echo.

echo Starting frontend server...
echo Running: npm run dev

:: Run the server
npm run dev

pause
@echo off
chcp 65001 >nul

echo Starting backend server...
echo Running: node server-simple.js

:: Run the server
node server-simple.js

pause
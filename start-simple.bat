@echo off
chcp 65001 >nul
echo 查找 Node.js...

:: 尝试在常见位置查找 Node.js
if exist "C:\Program Files\nodejs\node.exe" (
    set NODE=C:\Program Files\nodejs\node.exe
    goto :found
)

if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set NODE=C:\Program Files (x86)\nodejs\node.exe
    goto :found
)

if exist "%USERPROFILE%\AppData\Roaming\nvm\current\node.exe" (
    set NODE=%USERPROFILE%\AppData\Roaming\nvm\current\node.exe
    goto :found
)

if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set NODE=%LOCALAPPDATA%\Programs\nodejs\node.exe
    goto :found
)

echo ERROR: Node.js 未找到！
echo 请安装 Node.js 后再运行此脚本。
echo 下载地址: https://nodejs.org/
pause
exit /b 1

:found
echo 找到 Node.js: %NODE%
echo.

echo 安装依赖...
"%NODE%" -e "process.exit(0)"
if %ERRORLEVEL% neq 0 (
    echo 无法运行 Node.js
echo.
pause
exit /b 1
)

:: 安装后端依赖
echo 安装后端依赖...
cd /d "%~dp0\backend"
"%NODE%" -e "const fs = require('fs'); if (fs.existsSync('package.json')) console.log('package.json found'); else console.log('package.json not found');"

if exist "package.json" (
    echo 运行: npm install
    "%NODE%" "%~dp0\backend\node_modules\.bin\npm" install
) else (
    echo ERROR: backend/package.json 未找到
    pause
    exit /b 1
)

echo.

:: 启动后端
echo 启动后端服务器...
start "Backend" cmd /k "cd /d "%~dp0\backend" && "%NODE%" "%~dp0\backend\node_modules\.bin\tsx" watch server.ts"
echo 后端服务器已启动

:: 等待 2 秒
timeout /t 2 /nobreak >nul

:: 启动前端
echo 启动前端服务器...
start "Frontend" cmd /k "cd /d "%~dp0\frontend" && "%NODE%" "%~dp0\frontend\node_modules\.bin\vite""
echo 前端服务器已启动

echo.
echo 项目启动完成！
echo 后端: http://localhost:3002
echo 前端: http://localhost:5173
echo.
echo 按任意键关闭...
pause >nul

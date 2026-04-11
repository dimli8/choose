@echo off
chcp 65001 >nul
echo ============================================
echo 项目启动助手
 echo ============================================
echo.

:: 检查 Node.js 安装
call :check_nodejs
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js 未找到！
    echo 请按照以下步骤安装 Node.js：
    echo 1. 访问 https://nodejs.org/
    echo 2. 下载 LTS 版本的安装包
    echo 3. 运行安装程序并按照提示完成安装
    echo 4. 安装完成后重新运行此脚本
    echo.
    pause
    exit /b 1
)

echo 找到 Node.js: %NODE_PATH%
echo 找到 npm: %NPM_PATH%
echo.

:: 启动后端服务器
echo ============================================
echo 启动后端服务器...
echo ============================================
start "Backend Server" cmd /k "cd /d "%~dp0\backend" && "%NPM_PATH%" run dev"
echo 后端服务器已启动 (端口: 3002)
echo.

:: 等待 2 秒让后端启动
timeout /t 2 /nobreak >nul

:: 启动前端服务器
echo ============================================
echo 启动前端服务器...
echo ============================================
start "Frontend Server" cmd /k "cd /d "%~dp0\frontend" && "%NPM_PATH%" run dev"
echo 前端服务器已启动 (端口: 5173)
echo.

echo ============================================
echo 项目启动完成！
echo ============================================
echo 后端地址: http://localhost:3002
echo 前端地址: http://localhost:5173
echo.
echo 按任意键关闭此窗口...
pause >nul
exit /b 0

:check_nodejs
:: 尝试在常见位置查找 Node.js
if exist "C:\Program Files\nodejs\node.exe" (
    set NODE_PATH=C:\Program Files\nodejs\node.exe
    set NPM_PATH=C:\Program Files\nodejs\npm.cmd
    exit /b 0
)

if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set NODE_PATH=C:\Program Files (x86)\nodejs\node.exe
    set NPM_PATH=C:\Program Files (x86)\nodejs\npm.cmd
    exit /b 0
)

if exist "%USERPROFILE%\AppData\Roaming\nvm\current\node.exe" (
    set NODE_PATH=%USERPROFILE%\AppData\Roaming\nvm\current\node.exe
    set NPM_PATH=%USERPROFILE%\AppData\Roaming\nvm\current\npm.cmd
    exit /b 0
)

if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set NODE_PATH=%LOCALAPPDATA%\Programs\nodejs\node.exe
    set NPM_PATH=%LOCALAPPDATA%\Programs\nodejs\npm.cmd
    exit /b 0
)

:: 尝试使用 where 命令
for /f "delims=" %%i in ('where node 2^>nul') do (
    set NODE_PATH=%%i
    set NPM_PATH=%%~dp0\npm.cmd
    exit /b 0
)

:: 未找到
exit /b 1
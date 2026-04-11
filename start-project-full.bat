@echo off
chcp 65001 >nul

:: ============================================
echo 项目启动脚本
 echo ============================================
echo.

:: 设置 Node.js 路径
set NODE_PATH=C:\Program Files\nodejs
set NODE_EXE=%NODE_PATH%\node.exe
set NPM_EXE=%NODE_PATH%\npm.cmd

:: 检查 Node.js 是否存在
if not exist "%NODE_EXE%" (
    echo ERROR: Node.js 未找到！
    echo 请安装 Node.js 后再运行此脚本。
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 找到 Node.js: %NODE_EXE%
echo 找到 npm: %NPM_EXE%
echo.

:: 设置环境变量
set PATH=%NODE_PATH%;%PATH%
echo 环境变量已设置
set "PROJECT_DIR=%~dp0"
echo 项目目录: %PROJECT_DIR%
echo.

:: ============================================
echo 1. 安装后端依赖
echo ============================================
cd /d "%PROJECT_DIR%\backend"
if exist "package.json" (
    echo 运行: npm install
    "%NPM_EXE%" install
    if %ERRORLEVEL% neq 0 (
        echo ERROR: 后端依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo ERROR: backend/package.json 未找到
    pause
    exit /b 1
)
echo 后端依赖安装完成

echo.

:: ============================================
echo 2. 安装前端依赖
echo ============================================
cd /d "%PROJECT_DIR%\frontend"
if exist "package.json" (
    echo 运行: npm install
    "%NPM_EXE%" install
    if %ERRORLEVEL% neq 0 (
        echo ERROR: 前端依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo ERROR: frontend/package.json 未找到
    pause
    exit /b 1
)
echo 前端依赖安装完成

echo.

:: ============================================
echo 3. 启动后端服务器
echo ============================================
cd /d "%PROJECT_DIR%\backend"
start "Backend Server" cmd /k "cd /d "%PROJECT_DIR%\backend" && set PATH=%NODE_PATH%;%PATH% && npm run dev"
echo 后端服务器已启动 (端口: 3002)
echo 后端地址: http://localhost:3002
echo.

:: 等待 3 秒让后端启动
timeout /t 3 /nobreak >nul

:: ============================================
echo 4. 启动前端服务器
echo ============================================
cd /d "%PROJECT_DIR%\frontend"
start "Frontend Server" cmd /k "cd /d "%PROJECT_DIR%\frontend" && set PATH=%NODE_PATH%;%PATH% && npm run dev"
echo 前端服务器已启动 (端口: 5173)
echo 前端地址: http://localhost:5173
echo.

:: ============================================
echo 项目启动完成！
echo ============================================
echo 后端地址: http://localhost:3002
echo 前端地址: http://localhost:5173
echo.
echo 按任意键关闭此窗口...
pause >nul

@echo off
chcp 65001 >nul

echo 测试脚本
 echo ============
echo.

:: 检查基本命令
echo 检查 Node.js...
C:\Program Files\nodejs\node.exe --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js 无法运行
) else (
    echo Node.js 运行正常
)
echo.

echo 检查 npm...
C:\Program Files\nodejs\npm.cmd --version
if %ERRORLEVEL% neq 0 (
    echo ERROR: npm 无法运行
) else (
    echo npm 运行正常
)
echo.

echo 当前目录: %cd%
echo 项目目录: %~dp0
echo.

pause

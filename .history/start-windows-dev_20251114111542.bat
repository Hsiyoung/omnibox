@echo off
echo Starting OmniBox in Development Mode (Windows)...
echo.

REM 检查 Docker 是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM 创建数据目录
if not exist data\postgres mkdir data\postgres
if not exist data\minio mkdir data\minio  
if not exist data\meili_data mkdir data\meili_data

echo ✅ Data directories created
echo.

echo Starting in development mode...
echo This will build images locally, which may take longer but should work without internet issues.
echo.

REM 开发模式启动
docker compose -f compose.yaml -f compose\deps.yaml -f compose\dev.yaml up -d --build

if %errorlevel% neq 0 (
    echo.
    echo ❌ 开发模式启动也失败了，请检查错误信息
    pause
    exit /b 1
)

echo.
echo ✅ OmniBox 开发模式启动成功！
echo.
echo 访问地址：
echo - Web界面: http://localhost:8080  
echo - MinIO控制台: http://localhost:9001
echo - Backend API: http://localhost:8000
echo - Wizard API: http://localhost:8001
echo.
echo 注意：开发模式下，所有服务都会重新构建
echo.
pause
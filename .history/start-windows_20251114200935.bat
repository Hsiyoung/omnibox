@echo off
echo Starting OmniBox on Windows...
echo.

REM 检查 Docker 是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    echo.
    echo 请按以下步骤操作：
    echo 1. 打开开始菜单
    echo 2. 搜索并启动 Docker Desktop
    echo 3. 等待 Docker 图标变绿色
    echo 4. 重新运行此脚本
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

REM 启动服务
echo Starting services...
echo 如果遇到镜像拉取失败，请使用国内镜像加速器
echo.

REM 尝试启动服务
docker compose -f compose.yaml -f compose\deps.yaml up -d

if %errorlevel% neq 0 (
    echo.
    echo ❌ 启动失败，尝试以下解决方案：
    echo.
    echo 方案1：使用国内镜像加速器
    echo 方案2：使用开发模式构建
    echo.
    echo 开发模式命令：
    echo docker compose -f compose.yaml -f compose\deps.yaml -f compose\dev.yaml up -d --build
    pause
    exit /b 1
)

echo.
echo ✅ OmniBox started successfully!
echo.
echo 访问地址：
echo - Web界面: http://localhost:8080
echo - MinIO控制台: http://localhost:9001
echo.
echo 管理命令：
echo - 查看状态: docker compose ps
echo - 查看日志: docker compose logs -f
echo - 停止服务: docker compose down
echo.
pause
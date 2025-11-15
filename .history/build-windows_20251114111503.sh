#!/bin/bash

# OmniBox Windows 本地构建脚本
echo "开始构建 OmniBox..."

# 创建数据目录
mkdir -p data/postgres
mkdir -p data/minio  
mkdir -p data/meili_data

# 设置权限（Windows 下可能需要管理员权限）
echo "创建目录完成"

# 如果 Docker 拉取失败，使用本地构建方式
echo "如遇到 GHCR 访问问题，建议："
echo "1. 使用国内 Docker 镜像加速器"
echo "2. 或改用开发模式构建"
echo ""
echo "开发模式启动命令："
echo "docker compose -f compose.yaml -f compose/deps.yaml -f compose/dev.yaml up -d --build"
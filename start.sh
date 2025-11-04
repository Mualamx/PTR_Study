#!/bin/bash

echo "🚀 启动 Token 认证测试系统..."

# 检查后端依赖
echo "📦 检查后端依赖..."
cd backend
if [ ! -f "requirements.txt" ]; then
    echo "❌ 后端依赖文件不存在"
    exit 1
fi

# 创建虚拟环境（可选）
if [ ! -d "venv" ]; then
    echo "🐍 创建Python虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境并安装依赖
echo "📥 安装Python依赖..."
source venv/bin/activate
pip install -r requirements.txt

# 启动后端
echo "🔧 启动后端服务器 (端口 8000)..."
python app.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端
echo "🌐 启动前端服务器 (端口 3000)..."
cd frontend

# 检查是否有Python的http.server
if command -v python3 &> /dev/null; then
    python3 -m http.server 3000 &
elif command -v python &> /dev/null; then
    python -m http.server 3000 &
else
    echo "❌ 未找到Python，请手动启动前端：cd frontend && python -m http.server 3000"
    kill $BACKEND_PID
    exit 1
fi

FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 系统启动完成！"
echo "📊 后端API: http://39.144.39.4:8000"
echo "🌍 前端页面: http://39.144.39.4:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待中断信号
trap 'echo ""; echo "🛑 停止服务..."; kill $BACKEND_PID $FRONTEND_PID; exit 0' INT
wait

#!/bin/bash

echo "🚀 启动 Token 认证绕过靶场..."
echo "========================================"

# 使用正确的Python路径
PYTHON_CMD="/opt/homebrew/bin/python3.10"
echo "🐍 使用Python: $PYTHON_CMD"
echo "📋 Python版本: $($PYTHON_CMD --version)"

# 检查依赖
echo "🔍 检查依赖..."
if $PYTHON_CMD -c "import flask, flask_cors" 2>/dev/null; then
    echo "✅ 依赖检查通过"
else
    echo "❌ 依赖未安装"
    echo "请运行: $PYTHON_CMD -m pip install flask flask-cors"
    exit 1
fi

cleanup() {
    echo ""
    echo "🛑 停止服务..."
    [ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null && echo "✅ 后端停止"
    [ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null && echo "✅ 前端停止"
    echo "🎯 所有服务已停止"
}

trap cleanup INT TERM

echo "🔧 启动后端 (端口 8000)..."
cd backend
$PYTHON_CMD app.py &
BACKEND_PID=$!
cd ..

sleep 5

if curl -s http://localhost:8000/api/status > /dev/null; then
    echo "✅ 后端启动成功"
else
    echo "❌ 后端启动失败"
    exit 1
fi

echo "🌐 启动前端 (端口 3000)..."
cd frontend
$PYTHON_CMD -m http.server 3000 --bind 0.0.0.0 &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo "========================================"
echo "🎉 靶场启动完成！"
echo ""
echo "🌐 访问地址:"
echo "   前端页面: http://localhost:3000"
echo "   后端API:  http://localhost:8000"
echo ""
echo "🔑 核心测试接口:"
echo "   GET /getToken    - 获取Token"
echo "   GET /api/users   - 用户列表(需Token)"
echo "   GET /api/time    - 服务器时间"
echo ""
echo "🎯 攻击目标: 绕过/api/users的Token认证"
echo "🛑 停止服务: 按 Ctrl+C"
echo "========================================"

wait
@echo off
chcp 65001 >nul
echo 🚀 启动 Token 认证测试系统...

echo 📦 检查后端依赖...
cd backend
if not exist "requirements.txt" (
    echo ❌ 后端依赖文件不存在
    pause
    exit /b 1
)

echo 🐍 创建Python虚拟环境...
python -m venv venv

echo 📥 安装Python依赖...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo 🔧 启动后端服务器 (端口 8000)...
start "后端服务" cmd /k "venv\Scripts\activate.bat && python app.py"
cd ..

timeout /t 3 /nobreak >nul

echo 🌐 启动前端服务器 (端口 3000)...
cd frontend
start "前端服务" cmd /k "python -m http.server 3000"
cd ..

echo.
echo ✅ 系统启动完成！
echo 📊 后端API: http://39.144.39.4:8000
echo 🌍 前端页面: http://39.144.39.4:3000
echo.
echo 请手动关闭弹出的命令窗口来停止服务
pause

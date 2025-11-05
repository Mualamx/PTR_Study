from flask import Flask, request, Response
from flask_cors import CORS
import random
import string
import time
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 模拟数据存储
users = [
    {"id": 1, "name": "张三", "email": "zhangsan@example.com", "department": "技术部"},
    {"id": 2, "name": "李四", "email": "lisi@example.com", "department": "市场部"},
    {"id": 3, "name": "王五", "email": "wangwu@example.com", "department": "财务部"},
    {"id": 4, "name": "赵六", "email": "zhaoliu@example.com", "department": "人事部"}
]

valid_tokens = {}

def generate_token():
    """生成随机token"""
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=20))
    timestamp = str(int(time.time()))
    return f"{random_str}-{timestamp}"

def validate_and_consume_token(token):
    """验证token并使其失效（单次使用）"""
    if not token:
        return False
    
    if token not in valid_tokens:
        return False
    
    # 检查token是否过期
    if time.time() - valid_tokens[token] > 3600:
        del valid_tokens[token]
        return False
    
    # 验证成功后立即删除token（单次使用）
    del valid_tokens[token]
    return True

def json_response(data, status=200):
    """完全自定义JSON响应，确保中文正确显示"""
    response = Response(
        json.dumps(data, ensure_ascii=False),
        status=status,
        mimetype='application/json; charset=utf-8'
    )
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    return response

def token_required(f):
    """token校验装饰器 - 支持Header和URL参数"""
    def decorated_function(*args, **kwargs):
        # 1. 首先检查Header中的token
        token = request.headers.get('token')
        
        # 2. 如果没有，检查URL参数中的token
        if not token:
            token = request.args.get('token')
            
        if not token:
            return json_response({
                "error": "Token缺失",
                "message": "请在请求头或URL参数中添加token"
            }, 401)
        
        if not validate_and_consume_token(token):
            return json_response({
                "error": "Token无效或已过期", 
                "message": "token已失效，请重新获取token"
            }, 401)
        
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function

# API路由
@app.route('/api/time', methods=['GET'])
def get_current_time():
    """获取当前时间 - 公开接口"""
    return json_response({
        "current_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "timestamp": int(time.time()),
        "message": "时间获取成功"
    })

@app.route('/api/users', methods=['GET'])
@token_required
def get_users():
    """获取用户列表 - 需要token"""
    return json_response({
        "users": users,
        "count": len(users),
        "message": "用户数据获取成功"
    })

@app.route('/getToken', methods=['GET'])
def get_token():
    """获取token - 仅返回JSON"""
    new_token = generate_token()
    valid_tokens[new_token] = time.time()
    
    return json_response({
        "newtoken": new_token,
        "expires_in": 3600,
        "message": "token有效期为1小时，但只能使用一次"
    })

@app.route('/api/status', methods=['GET'])
def get_status():
    """服务器状态检查"""
    return json_response({
        "status": "running",
        "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "active_tokens": len(valid_tokens),
        "message": "服务器运行正常"
    })

@app.route('/api/debug', methods=['GET'])
def debug_headers():
    """调试接口 - 显示所有请求头"""
    return json_response({
        "headers": dict(request.headers),
        "method": request.method,
        "client_ip": request.remote_addr,
        "message": "调试信息"
    })

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')
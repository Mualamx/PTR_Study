## 生成README

```markdown
# Token认证绕过靶场

## 靶场简介

这是一个专门用于练习Token认证绕过技术的Web安全靶场。靶场采用前后端分离架构，模拟了真实的Token认证机制，重点训练安全测试人员绕过认证限制的能力。

## 系统架构

```
token-auth-system/
├── start.sh              # Linux/macOS启动脚本
├── start.bat             # Windows启动脚本
├── backend/              # 后端API服务
│   ├── app.py           # Flask后端主程序
│   ├── requirements.txt # Python依赖
│   └── README.md        # 后端说明
└── frontend/            # 前端界面
    ├── index.html       # 主页面
    ├── style.css        # 样式文件
    └── script.js        # 前端逻辑
```

## 启动方式

### 自动启动（推荐）
**Linux/macOS:**
```bash
./start.sh
```

**Windows:**
双击 `start.bat`

### 手动启动
**后端服务:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**前端服务:**
```bash
cd frontend
python -m http.server 3000
```

## 访问地址

- **前端页面**: http://39.144.39.4:3000
- **后端API**: http://39.144.39.4:8000

## API接口

### 公开接口（无需认证）
- `GET /api/time` - 获取服务器时间
- `GET /getToken` - 获取一次性Token
- `GET /api/status` - 服务器状态检查
- `GET /api/test-chinese` - 中文显示测试

### 受保护接口（需要Token认证）
- `GET /api/users` - 获取用户列表（需要Token）

## 认证机制

### Token特性
1. **单次有效性**: 每个Token只能使用一次
2. **时间限制**: Token有效期为1小时
3. **Header验证**: Token通过HTTP Header传递
4. **消费机制**: 验证成功后Token立即失效

### 认证流程
```
获取Token → 在Header中添加token → 访问受保护接口 → Token失效
```

## 攻击场景

### 主要攻击目标
绕过 `/api/users` 接口的Token认证机制，无需获取Token即可访问用户数据。

### 技术挑战
1. **Token单次使用**: 无法重复使用同一个Token
2. **Header验证**: 需要构造合法的请求头
3. **服务端验证**: 严格的Token校验逻辑

## 可能的绕过技术

### 1. Token重放攻击
- 寻找Token复用漏洞
- 分析Token生成规律
- 尝试预测或伪造Token

### 2. 认证逻辑绕过
- 寻找验证逻辑缺陷
- 尝试空Token或特殊字符
- 测试边界条件

### 3. 请求头 manipulation
- 修改Header名称
- 测试大小写敏感性
- 尝试多个Header

### 4. 其他攻击向量
- 参数污染
- HTTP方法覆盖
- 路径遍历

## 测试工具推荐

- **Burp Suite**: 拦截和修改HTTP请求
- **Postman**: API测试和调试
- **curl**: 命令行HTTP请求
- **浏览器开发者工具**: 前端调试

## 测试步骤示例

### 基础测试
```bash
# 1. 正常获取Token
curl http://39.144.39.4:8000/getToken

# 2. 使用Token访问受保护接口
curl -H "token: YOUR_TOKEN" http://39.144.39.4:8000/api/users

# 3. 尝试绕过（无Token）
curl http://39.144.39.4:8000/api/users
```

### 进阶测试
```bash
# 测试特殊Header值
curl -H "token: " http://39.144.39.4:8000/api/users
curl -H "token: null" http://39.144.39.4:8000/api/users
curl -H "token: undefined" http://39.144.39.4:8000/api/users

# 测试Header名称变体
curl -H "Token: YOUR_TOKEN" http://39.144.39.4:8000/api/users
curl -H "TOKEN: YOUR_TOKEN" http://39.144.39.4:8000/api/users
curl -H "X-Token: YOUR_TOKEN" http://39.144.39.4:8000/api/users
```

## 防御机制

### 已实现的防御
- Token单次使用
- 时间过期机制
- 严格的Header验证
- 服务端状态管理

### 建议的增强防御
- Token签名验证
- 请求频率限制
- IP白名单
- 双因素认证

## 学习目标

通过本靶场练习，您将掌握：

1. Token认证机制的原理和漏洞
2. API安全测试的基本方法
3. 认证绕过技术的实际应用
4. 安全防护措施的评估能力

## 注意事项

- 本靶场仅用于教育目的
- 请在授权环境中测试
- 遵守相关法律法规
- 尊重系统资源限制

## 更新日志

- v1.0: 初始版本，基础Token认证机制
- 未来计划：增加更多认证绕过场景

## 联系方式

如有问题或建议，请联系靶场管理员。

---

**Happy Hacking! 🚀**
```

这个README清晰地说明了：
1. 靶场的主要目的是绕过gettoken认证
2. 提供了完整的使用和测试指南
3. 列出了可能的攻击技术和测试方法
4. 强调了教育目的和合法使用

您可以根据需要调整内容或添加更多技术细节。
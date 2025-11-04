# 🔐 Token认证绕过靶场

> 一个专为Web安全学习设计的Token认证绕过实战环境

![GitHub](https://img.shields.io/badge/Version-1.0-blue)
![GitHub](https://img.shields.io/badge/Language-Python%20%7C%20JavaScript-green)
![GitHub](https://img.shields.io/badge/Platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey)
![GitHub](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 靶场简介

这是一个模拟真实Token认证机制的安全学习环境，专门用于研究和练习API认证绕过技术。靶场采用前后端分离架构，实现了严格的单次Token验证机制。

## 🚨 攻击目标

**核心挑战：绕过 `/api/users` 接口的Token认证**

- 🎯 目标：无需获取有效Token即可访问受保护的用户数据
- ⚡ 难度：中等（模拟真实世界认证机制）
- 🛡️ 防御：单次Token消费 + 时间过期 + Header验证

## 🏗️ 系统架构

```
token-auth-system/
├── 🐍 backend/                 # Flask后端API服务
│   ├── app.py                 # 核心认证逻辑
│   └── requirements.txt       # Python依赖
├── 🌐 frontend/               # 前端用户界面
│   ├── index.html            # 主界面
│   ├── style.css             # 样式文件
│   └── script.js             # 前端逻辑
├── 🚀 start.sh               # Linux/macOS启动脚本
├── ⚙️ start.bat              # Windows启动脚本
└── 📚 README.md              # 项目文档
```

## ⚡ 快速开始

### 环境要求
- Python 3.7+
- 现代浏览器
- 网络连接（用于前端访问后端API）

### 一键启动
**Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
双击 start.bat
```

### 手动启动
```bash
# 启动后端服务 (端口 8000)
cd backend
pip install -r requirements.txt
python app.py

# 启动前端服务 (端口 3000) - 新终端
cd frontend
python -m http.server 3000
```

## 🌐 访问地址

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8000

## 🔌 API接口文档

### 📍 公开接口（无需认证）
| 方法 | 端点 | 描述 | 示例 |
|------|------|------|------|
| `GET` | `/api/time` | 获取服务器时间 | `curl http://localhost:8000/api/time` |
| `GET` | `/getToken` | 获取一次性Token | `curl http://localhost:8000/getToken` |
| `GET` | `/api/status` | 服务器状态检查 | `curl http://localhost:8000/api/status` |

### 🛡️ 受保护接口（需要Token认证）
| 方法 | 端点 | 认证 | 描述 |
|------|------|------|------|
| `GET` | `/api/users` | `Header: token` | 获取用户列表 |

**认证示例：**
```bash
# 1. 获取Token
curl http://localhost:8000/getToken

# 2. 使用Token访问受保护接口
curl -H "token: YOUR_TOKEN_HERE" http://localhost:8000/api/users
```

## 🔍 认证机制详解

### 🎫 Token特性
- **单次有效性**: 每个Token只能使用一次，验证后立即失效
- **时间限制**: Token有效期为1小时
- **Header传输**: 必须通过HTTP Header的`token`字段传递
- **服务端状态**: 内存中维护有效Token列表

### 🔒 防御机制
```python
# 核心验证逻辑
def validate_and_consume_token(token):
    if token not in valid_tokens: return False
    if time.time() - valid_tokens[token] > 3600: return False
    del valid_tokens[token]  # 单次消费
    return True
```

## 🧪 测试指南

### 🔬 基础测试流程
1. **正常流程测试**
   ```bash
   # 获取Token
   curl http://localhost:8000/getToken
   
   # 使用Token访问
   curl -H "token: xxx" http://localhost:8000/api/users
   
   # 验证Token失效
   curl -H "token: xxx" http://localhost:8000/api/users
   ```

2. **认证绕过尝试**
   ```bash
   # 直接访问（应该返回401）
   curl http://localhost:8000/api/users
   
   # 空Token测试
   curl -H "token: " http://localhost:8000/api/users
   
   # 特殊值测试
   curl -H "token: null" http://localhost:8000/api/users
   curl -H "token: undefined" http://localhost:8000/api/users
   curl -H "token: 0" http://localhost:8000/api/users
   ```

### 🛠️ 高级测试技术

#### 1. Header Manipulation
```bash
# Header名称变体
curl -H "Token: xxx" http://localhost:8000/api/users
curl -H "TOKEN: xxx" http://localhost:8000/api/users
curl -H "X-Token: xxx" http://localhost:8000/api/users
curl -H "Authorization: Bearer xxx" http://localhost:8000/api/users

# 多个Header
curl -H "token: xxx" -H "token: yyy" http://localhost:8000/api/users
```

#### 2. 请求方法测试
```bash
# HTTP方法覆盖
curl -X POST http://localhost:8000/api/users
curl -X PUT http://localhost:8000/api/users
curl -X OPTIONS http://localhost:8000/api/users
```

#### 3. 路径遍历
```bash
# URL变体
curl http://localhost:8000/api/users/
curl http://localhost:8000/api/users/.
curl http://localhost:8000/api/users?token=xxx
```

### 🔧 工具集成

#### Burp Suite测试
1. 配置代理到Burp
2. 拦截前端请求
3. 修改Token相关Header
4. 重放请求测试

#### Postman测试
```json
{
  "method": "GET",
  "url": "http://localhost:8000/api/users",
  "headers": {
    "token": "YOUR_TOKEN"
  }
}
```

## 🎯 学习目标

通过本靶场，您将掌握：

### 🧠 知识要点
- ✅ Token认证的工作原理
- ✅ 单次消费机制的安全意义
- ✅ HTTP Header的安全影响
- ✅ API安全测试方法论

### 🔧 技能提升
- ✅ 认证绕过技术实践
- ✅ 安全工具的使用技巧
- ✅ 漏洞挖掘的思维模式
- ✅ 防御机制的评估能力

## 🛡️ 防御建议

### 已实现的防御措施
- 🔒 单次Token消费机制
- ⏰ Token时间过期
- 📍 严格的Header验证
- 💾 服务端状态管理

### 推荐的增强措施
- 🔑 Token签名验证（JWT）
- 🌐 CSRF保护
- 📊 请求频率限制
- 🔍 安全日志审计
- 🚫 IP黑白名单

## ❓ 常见问题

**Q: 为什么Token只能用一次？**  
A: 这是模拟银行交易等高安全场景的单次认证机制。

**Q: 前端如何无感使用Token？**  
A: 前端在需要访问受保护接口时自动获取并使用Token，用户无感知。

**Q: 如何验证绕过是否成功？**  
A: 成功访问 `/api/users` 接口并返回用户数据，且无需先获取Token。

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本靶场仅用于**教育学习**和**授权测试**目的。请遵守以下原则：

- 🚫 禁止用于非法渗透测试
- 🚫 禁止攻击未授权系统  
- 🚫 禁止用于恶意目的
- ✅ 仅在学习环境中使用
- ✅ 遵守当地法律法规

---

**Happy Hacking! 🎉 祝您学习愉快！**

> 记住：真正的安全专家不仅是优秀的攻击者，更是出色的防御者。
```

这个重构的README具有：

🎯 **专业美观** - 使用emoji和徽章，层次清晰
🔧 **实用性强** - 详细的测试指南和代码示例  
🎯 **目标明确** - 突出认证绕过的核心挑战
📚 **教育价值** - 包含完整的学习路径和知识点
🛡️ **安全合规** - 强调合法使用和免责声明
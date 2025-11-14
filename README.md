# Token认证绕过靶场

## 🎯 项目简介

这是一个专门为Web安全学习设计的Token认证绕过靶场环境，旨在帮助安全研究人员和开发者理解Token认证机制的原理、常见漏洞及绕过技术。

## 🚀 环境要求

- Python 3.7+
- 现代浏览器（Chrome/Firefox/Edge）
- 网络抓包工具（Burp Suite/OWASP ZAP 可选）

## 📥 安装与启动

### 后端服务（Flask）

```bash
# 进入项目目录
cd token-bypass-range

# 安装依赖
pip install flask flask-cors

# 启动后端服务
python app.py
```

后端服务将在 `http://0.0.0.0:8000` 启动

### 前端页面

```bash
# 前端为纯HTML页面，无需额外服务
# 直接用浏览器打开 index.html 即可
```

## ⚙️ 重要配置

**使用前必须配置**：进入前端文件夹，编辑 `config.js` 文件：

```javascript
const CONFIG = {
    // 后端API基础URL - 修改这里为你的服务器IP
    BACKEND_URL: 'http://你的服务器IP:8000',
    // ... 其他配置
};
```

**将 `你的服务器IP` 替换为实际的后端服务器IP地址**

## 🎯 靶场功能

### 1. 公开接口（无需Token）
- ✅ 获取服务器时间
- ✅ 获取Token
- ✅ 服务器状态检查
- ✅ 调试信息查看

### 2. 受保护接口（需要Token）
- 🔒 查询用户信息（需要有效Token）

### 3. Token机制特性
- ⏰ Token有效期：1小时
- 🔄 Token单次使用：验证后立即失效
- 📍 Token传递方式：支持多种方式

## 🔍 测试场景

### 支持的Token传递方式：

1. **GET参数**：`/api/users?token=xxx`
2. **POST Header**：在请求头中添加 `token: xxx`
3. **POST Body (JSON)**：`{"token": "xxx"}`
4. **POST Body (Form)**：`token=xxx`
5. **POST Body (Multipart)**: FormData格式

### 自动测试功能
前端提供一键测试按钮，支持所有传参方式的自动化测试。

## 🛠️ 技术架构

### 后端技术栈
- **框架**: Flask + Flask-CORS
- **认证**: 自定义Token认证中间件
- **特性**: 支持CORS、多种数据格式解析

### 前端技术栈
- **技术**: 纯HTML + CSS + JavaScript
- **特性**: 响应式设计、实时配置更新

## 🔐 安全测试要点

### 常见绕过技术练习：
1. **Token重放攻击**
2. **Token预测/爆破**
3. **认证逻辑绕过**
4. **参数污染攻击**
5. **HTTP方法混淆**

### 观察点：
- Token生成规律
- 认证校验逻辑
- 错误信息泄露
- 接口响应差异

## 📝 使用流程

1. **环境配置**
   - 修改 `config.js` 中的IP地址
   - 启动后端服务
   - 打开前端页面

2. **基础测试**
   - 获取Token
   - 使用Token访问受保护接口
   - 观察正常流程

3. **安全测试**
   - 使用Burp Suite拦截请求
   - 修改Token参数尝试绕过
   - 测试各种传参方式
   - 分析认证逻辑漏洞

## 🐛 故障排除

### 常见问题：

1. **跨域错误**
   - 检查后端CORS配置
   - 确认IP地址配置正确

2. **Token验证失败**
   - 确认Token未过期
   - 检查Token传递方式
   - 验证Token格式正确

3. **连接失败**
   - 检查防火墙设置
   - 确认端口未被占用
   - 验证IP地址可达性

## 📚 学习资源

- OWASP Authentication Cheat Sheet
- Web Security Academy (PortSwigger)
- Token-Based Authentication Best Practices

## ⚠️ 免责声明

本靶场仅用于教育学习和授权安全测试目的。严禁用于非法攻击或未授权的渗透测试。使用者需遵守相关法律法规，对使用本工具造成的任何后果自行承担全部责任。

## 🆘 获取帮助

如遇到问题，请检查：
1. 配置文件中的IP地址是否正确
2. 后端服务是否正常启动
3. 浏览器控制台错误信息
4. 网络连接是否正常

---

**Happy Hacking! 🎯**
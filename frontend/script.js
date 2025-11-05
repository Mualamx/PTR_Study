// 后端API基础URL
let backendUrl = 'http://127.0.0.1:8000';

// 当前token
let currentToken = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    checkServerStatus();
    // 每分钟检查一次服务器状态
    setInterval(checkServerStatus, 60000);
});

// 检查服务器状态
async function checkServerStatus() {
    const statusElement = document.getElementById('serverStatus');
    try {
        const response = await fetch(`${backendUrl}/api/status`);
        if (response.ok) {
            const data = await response.json();
            statusElement.innerHTML = `✅ 服务器运行正常 | 时间: ${data.server_time} | 活跃Token: ${data.active_tokens}`;
            statusElement.className = 'success';
        } else {
            throw new Error('服务器响应异常');
        }
    } catch (error) {
        statusElement.innerHTML = '❌ 服务器连接失败';
        statusElement.className = 'error';
    }
}

// 更新后端URL
function updateBackendUrl() {
    const urlInput = document.getElementById('backendUrl');
    backendUrl = urlInput.value.trim();
    if (!backendUrl) {
        backendUrl = 'http://127.0.0.1:8000';
        urlInput.value = backendUrl;
    }
    showResult('tokenResult', `后端API地址已更新为: ${backendUrl}`, 'success');
    checkServerStatus();
}

// 显示结果
function showResult(elementId, content, type = 'info') {
    const element = document.getElementById(elementId);
    element.innerHTML = content;
    element.style.display = 'block';
    element.className = `result ${type}`;
}

// 获取当前时间
async function getCurrentTime() {
    const result = document.getElementById('timeResult');
    try {
        const response = await fetch(`${backendUrl}/api/time`);
        const data = await response.json();
        showResult('timeResult', `<strong>当前服务器时间：</strong> ${data.current_time}<br><strong>时间戳：</strong> ${data.timestamp}`, 'success');
    } catch (error) {
        showResult('timeResult', '<strong>错误：</strong> 获取时间失败，请检查服务器连接', 'error');
    }
}

// 获取用户信息
async function getUsers() {
    try {
        // 先获取token
        const tokenResponse = await fetch(`${backendUrl}/getToken`);
        const tokenData = await tokenResponse.json();
        
        if (tokenData.newtoken) {
            currentToken = tokenData.newtoken;
            
            // 使用token获取用户信息
            const usersResponse = await fetch(`${backendUrl}/api/users`, {
                headers: {
                    'token': currentToken
                }
            });
            
            if (usersResponse.ok) {
                const usersData = await usersResponse.json();
                let html = `<strong>✅ 用户列表（${usersData.count}人）：</strong><ul>`;
                usersData.users.forEach(user => {
                    html += `<li><strong>${user.name}</strong> - ${user.email} (${user.department})</li>`;
                });
                html += `</ul><p><em>${usersData.message}</em></p>`;
                showResult('usersResult', html, 'success');
            } else {
                const error = await usersResponse.json();
                showResult('usersResult', `<strong>错误：</strong> ${error.message}`, 'error');
            }
        }
    } catch (error) {
        showResult('usersResult', '<strong>错误：</strong> 请求失败，请检查服务器连接', 'error');
    }
}

// 获取Token
async function getToken() {
    try {
        const response = await fetch(`${backendUrl}/getToken`);
        const data = await response.json();
        
        currentToken = data.newtoken;
        showResult('tokenResult', 
            `<strong>✅ Token获取成功</strong><br>
             <strong>Token:</strong> <code>${data.newtoken}</code><br>
             <strong>有效期:</strong> ${data.expires_in}秒<br>
             <strong>说明:</strong> ${data.message}`, 
            'success'
        );
    } catch (error) {
        showResult('tokenResult', '<strong>错误：</strong> 获取token失败', 'error');
    }
}

// 使用Token测试API
async function testWithToken() {
    if (!currentToken) {
        showResult('tokenResult', '<strong>错误：</strong> 请先获取token', 'error');
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/users`, {
            headers: {
                'token': currentToken
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            showResult('tokenResult', 
                `<strong>✅ Token测试成功</strong><br>
                 <strong>消息:</strong> ${data.message}<br>
                 <strong>用户数量:</strong> ${data.count}人<br>
                 <em>注意：此token已失效，无法再次使用</em>`, 
                'success'
            );
            currentToken = null; // token已使用，清空
        } else {
            const error = await response.json();
            showResult('tokenResult', `<strong>❌ Token测试失败：</strong> ${error.message}`, 'error');
        }
    } catch (error) {
        showResult('tokenResult', '<strong>错误：</strong> 请求失败', 'error');
    }
}

// 无Token测试API
async function testWithoutToken() {
    try {
        const response = await fetch(`${backendUrl}/api/users`);
        const data = await response.json();
        showResult('tokenResult', 
            `<strong>无Token访问结果：</strong><br>
             <pre>${JSON.stringify(data, null, 2)}</pre>`, 
            'error'
        );
    } catch (error) {
        showResult('tokenResult', '<strong>错误：</strong> 请求失败', 'error');
    }
}

// 调试功能 - 显示请求头信息
async function debugHeaders() {
    try {
        const response = await fetch(`${backendUrl}/api/debug`);
        const data = await response.json();
        showResult('tokenResult', 
            `<strong>调试信息：</strong><br>
             <pre>${JSON.stringify(data, null, 2)}</pre>`, 
            'info'
        );
    } catch (error) {
        showResult('tokenResult', '<strong>错误：</strong> 调试请求失败', 'error');
    }
}

// 自动测试功能
async function autoTest() {
    try {
        // 获取token
        const tokenResponse = await fetch('http://10.211.55.2:8000/getToken');
        const tokenData = await tokenResponse.json();
        
        if (tokenData.newtoken) {
            // 页面跳转 - Burp可以抓到这个请求
            window.location.href = `http://10.211.55.2:8000/api/users?token=${tokenData.newtoken}`;
        }
    } catch (error) {
        alert('自动测试失败: ' + error.message);
    }
}

// 页面加载完成后的提示
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Token认证绕过靶场已加载');
    console.log('📡 所有链接都会产生完整的HTTP请求，Burp可以完美抓包');
    console.log('🔧 开始你的安全测试吧！');
});
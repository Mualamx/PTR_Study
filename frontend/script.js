// 初始化页面链接
function initializePage() {
    // 设置所有链接的URL
    document.getElementById('timeLink').href = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.TIME);
    document.getElementById('tokenLink').href = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.TOKEN);
    document.getElementById('statusLink').href = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.STATUS);
    document.getElementById('debugLink').href = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.DEBUG);
    
    // 设置表单action
    document.getElementById('userForm').action = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.USERS);
    
    // 更新手动测试URL显示
    updateManualUrls();
    
    // 显示当前配置
    document.getElementById('currentConfig').textContent = CONFIG.BACKEND_URL;
    document.getElementById('configDisplay').textContent = CONFIG.BACKEND_URL;
    document.getElementById('backendUrlInput').value = CONFIG.BACKEND_URL;
}

// 更新手动测试URL显示
function updateManualUrls() {
    document.getElementById('manualTokenUrl').textContent = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.TOKEN);
    document.getElementById('manualTimeUrl').textContent = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.TIME);
    document.getElementById('manualStatusUrl').textContent = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.STATUS);
    document.getElementById('manualUserUrl').textContent = CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.USERS) + '?token=你的token';
}

// 自动测试功能 - 支持多种传参方式
async function autoTest(method = 'get') {
    try {
        // 显示加载状态
        const buttons = document.querySelectorAll('.test-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.textContent.includes('获取Token中')) {
                btn.textContent = btn.textContent.replace('获取Token中...', getButtonOriginalText(btn));
            }
        });

        const currentButton = document.querySelector(`.${method}-btn`);
        const originalText = currentButton.textContent;
        currentButton.textContent = '获取Token中...';

        // 使用配置的URL获取token
        const tokenResponse = await fetch(CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.TOKEN));
        
        if (!tokenResponse.ok) {
            throw new Error(`获取Token失败: ${tokenResponse.status}`);
        }
        
        const tokenData = await tokenResponse.json();
        
        if (tokenData.newtoken) {
            currentButton.textContent = '测试中...';
            
            // 根据不同的传参方式进行处理
            switch(method) {
                case 'get':
                    // GET传参 - 页面跳转
                    setTimeout(() => {
                        window.location.href = CONFIG.getUserUrlWithToken(tokenData.newtoken);
                    }, 500);
                    break;
                    
                case 'header':
                    // Header传参 - 使用text/plain避免预检
                    await testWithHeader(tokenData.newtoken);
                    currentButton.textContent = originalText;
                    buttons.forEach(btn => btn.disabled = false);
                    break;
                    
                case 'json':
                    // JSON Body传参
                    await testWithJsonBody(tokenData.newtoken);
                    currentButton.textContent = originalText;
                    buttons.forEach(btn => btn.disabled = false);
                    break;
                    
                case 'form':
                    // Form Body传参 - 使用application/x-www-form-urlencoded
                    await testWithFormBody(tokenData.newtoken);
                    currentButton.textContent = originalText;
                    buttons.forEach(btn => btn.disabled = false);
                    break;
                    
                case 'multipart':
                    // Multipart Form传参
                    await testWithMultipartForm(tokenData.newtoken);
                    currentButton.textContent = originalText;
                    buttons.forEach(btn => btn.disabled = false);
                    break;
            }
        } else {
            throw new Error('Token获取响应格式错误');
        }
        
    } catch (error) {
        alert('自动测试失败: ' + error.message);
        
        // 恢复按钮状态
        const buttons = document.querySelectorAll('.test-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.textContent = getButtonOriginalText(btn);
        });
    }
}

// 更新按钮文本获取函数
function getButtonOriginalText(button) {
    const text = button.textContent;
    if (text.includes('通过GET传参')) return '通过GET传参';
    if (text.includes('通过POST Header传参')) return '通过POST Header传参';
    if (text.includes('通过POST Body(JSON)传参')) return '通过POST Body(JSON)传参';
    if (text.includes('通过POST Body(Form)传参')) return '通过POST Body(Form)传参';
    if (text.includes('通过POST Body(Multipart)传参')) return '通过POST Body(Multipart)传参';
    return text;
}

// 通过Header传参测试 - 避免预检请求
async function testWithHeader(token) {
    try {
        // 使用text/plain Content-Type避免预检请求
        const response = await fetch(CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.USERS), {
            method: 'POST',
            headers: {
                'token': token,
                'Content-Type': 'text/plain'  // 使用text/plain避免预检
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        showTestResult('Header传参测试', true, data);
        
    } catch (error) {
        showTestResult('Header传参测试', false, {error: error.message});
    }
}

// 通过JSON Body传参测试
async function testWithJsonBody(token) {
    try {
        const response = await fetch(CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.USERS), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        showTestResult('JSON Body传参测试', true, data);
        
    } catch (error) {
        showTestResult('JSON Body传参测试', false, {error: error.message});
    }
}

// 通过Form Body传参测试 - 使用URLSearchParams避免预检
async function testWithFormBody(token) {
    try {
        const formData = new URLSearchParams();
        formData.append('token', token);
        
        const response = await fetch(CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.USERS), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'  // 这种Content-Type不会触发预检
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        showTestResult('Form Body传参测试', true, data);
        
    } catch (error) {
        showTestResult('Form Body传参测试', false, {error: error.message});
    }
}

// 新增：通过multipart/form-data传参测试
async function testWithMultipartForm(token) {
    try {
        const formData = new FormData();
        formData.append('token', token);
        
        const response = await fetch(CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.USERS), {
            method: 'POST',
            body: formData  // 不设置Content-Type，浏览器会自动设置multipart/form-data
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        showTestResult('Multipart Form传参测试', true, data);
        
    } catch (error) {
        showTestResult('Multipart Form传参测试', false, {error: error.message});
    }
}

// 显示测试结果
function showTestResult(testName, success, data) {
    const resultDiv = document.createElement('div');
    resultDiv.className = `test-result ${success ? 'success' : 'error'}`;
    resultDiv.innerHTML = `
        <h4>${testName} - ${success ? '✅ 成功' : '❌ 失败'}</h4>
        <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
    
    resultDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        max-width: 80%;
        max-height: 80%;
        overflow: auto;
        border: 3px solid ${success ? '#28a745' : '#dc3545'};
    `;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = `
        margin-top: 10px;
        padding: 5px 15px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    closeBtn.onclick = () => resultDiv.remove();
    
    resultDiv.appendChild(closeBtn);
    document.body.appendChild(resultDiv);
    
    // 点击背景关闭
    resultDiv.addEventListener('click', (e) => {
        if (e.target === resultDiv) {
            resultDiv.remove();
        }
    });
}

// 更新配置
function updateConfig() {
    const newUrl = document.getElementById('backendUrlInput').value.trim();
    
    if (!newUrl) {
        alert('请输入有效的URL');
        return;
    }
    
    // 简单的URL验证
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
        alert('URL必须以 http:// 或 https:// 开头');
        return;
    }
    
    // 更新配置
    CONFIG.BACKEND_URL = newUrl.endsWith('/') ? newUrl.slice(0, -1) : newUrl;
    
    // 重新初始化页面
    initializePage();
    
    // 显示成功消息
    showConfigMessage('配置已更新成功！', 'success');
}

// 显示配置消息
function showConfigMessage(message, type) {
    // 移除现有的消息
    const existingMessage = document.querySelector('.config-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新消息
    const messageDiv = document.createElement('div');
    messageDiv.className = `config-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = '#28a745';
    } else {
        messageDiv.style.background = '#dc3545';
    }
    
    document.body.appendChild(messageDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 表单提交前的验证
document.getElementById('userForm').addEventListener('submit', function(e) {
    const tokenInput = document.getElementById('tokenInput');
    if (!tokenInput.value.trim()) {
        e.preventDefault();
        alert('请输入Token');
        tokenInput.focus();
    }
});

// 回车键更新配置
document.getElementById('backendUrlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        updateConfig();
    }
});

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    
    console.log('🎯 Token认证绕过靶场已加载');
    console.log('📡 后端地址:', CONFIG.BACKEND_URL);
    console.log('🌐 前端地址:', CONFIG.FRONTEND_URL);
    console.log('🔧 开始你的安全测试吧！');
    
    // 显示欢迎消息
    setTimeout(() => {
        console.log('💡 提示: 修改 config.js 中的 BACKEND_URL 来更改服务器地址');
    }, 1000);
});

// 导出函数供全局使用（如果需要）
window.initializePage = initializePage;
window.updateConfig = updateConfig;
window.autoTest = autoTest;
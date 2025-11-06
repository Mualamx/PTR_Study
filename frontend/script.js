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

// 自动测试功能
async function autoTest() {
    try {
        // 显示加载状态
        const button = document.querySelector('.auto-test-btn');
        const originalText = button.textContent;
        button.textContent = '获取Token中...';
        button.disabled = true;

        // 使用配置的URL获取token
        const tokenResponse = await fetch(CONFIG.getApiUrl(CONFIG.API_ENDPOINTS.TOKEN));
        
        if (!tokenResponse.ok) {
            throw new Error(`获取Token失败: ${tokenResponse.status}`);
        }
        
        const tokenData = await tokenResponse.json();
        
        if (tokenData.newtoken) {
            // 显示成功信息
            button.textContent = '跳转中...';
            
            // 页面跳转 - Burp可以抓到这个请求
            setTimeout(() => {
                window.location.href = CONFIG.getUserUrlWithToken(tokenData.newtoken);
            }, 500);
        } else {
            throw new Error('Token获取响应格式错误');
        }
        
    } catch (error) {
        alert('自动测试失败: ' + error.message);
        
        // 恢复按钮状态
        const button = document.querySelector('.auto-test-btn');
        button.textContent = '自动获取Token并查询用户';
        button.disabled = false;
    }
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
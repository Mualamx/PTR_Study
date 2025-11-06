// 前端配置文件 - 集中管理所有URL
const CONFIG = {
    // 后端API基础URL - 修改这里即可更新所有地址
    BACKEND_URL: 'http://10.211.55.2:8000',
    
    // 前端URL
    FRONTEND_URL: 'http://10.211.55.2:3000',
    
    // API端点
    API_ENDPOINTS: {
        TIME: '/api/time',
        TOKEN: '/getToken',
        USERS: '/api/users',
        STATUS: '/api/status',
        DEBUG: '/api/debug'
    },
    
    // 获取完整API URL
    getApiUrl: function(endpoint) {
        return this.BACKEND_URL + endpoint;
    },
    
    // 获取带token的用户URL
    getUserUrlWithToken: function(token) {
        return this.getApiUrl(this.API_ENDPOINTS.USERS) + '?token=' + token;
    }
};
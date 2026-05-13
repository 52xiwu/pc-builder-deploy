/**
 * 电脑硬件销售网站 - API服务层
 */

class ApiService {
    constructor() {
        this.baseURL = '/api';
        this.token = localStorage.getItem('auth_token');
    }
    
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }
    
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = this.getHeaders();
        
        const config = {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    error: `HTTP错误 ${response.status}`
                }));
                throw new Error(error.error || `请求失败: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    }
    
    // 用户认证
    async register(email, username, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, username, password })
        });
    }
    
    async login(email, password) {
        const result = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (result.token) {
            this.setToken(result.token);
        }
        
        return result;
    }
    
    async getCurrentUser() {
        return this.request('/auth/me');
    }
    
    logout() {
        this.setToken(null);
        localStorage.removeItem('user');
        window.location.reload();
    }
    
    // 产品管理
    async getProducts(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/products${query ? '?' + query : ''}`);
    }
    
    async getProduct(id) {
        return this.request(`/products/${id}`);
    }
    
    async getProductsByCategory(category) {
        return this.getProducts({ category });
    }
    
    async searchProducts(query) {
        return this.getProducts({ search: query });
    }
    
    // 购物车
    async getCart() {
        return this.request('/cart');
    }
    
    async addToCart(productId, quantity = 1) {
        return this.request('/cart', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, quantity })
        });
    }
    
    async updateCartItem(itemId, quantity) {
        return this.request(`/cart/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    }
    
    async removeFromCart(itemId) {
        return this.request(`/cart/${itemId}`, {
            method: 'DELETE'
        });
    }
    
    async clearCart() {
        const cart = await this.getCart();
        const promises = cart.items.map(item => 
            this.removeFromCart(item.id)
        );
        await Promise.all(promises);
    }
    
    // 订单
    async createOrder(orderData) {
        return this.request('/orders/checkout', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // 方案B：我的订单（需登录）
    async getMyOrders() {
        return this.request('/orders/me');
    }

    // 订单操作：取消/修改状态
    async updateOrderStatus(orderId, status) {
        return this.request(`/orders/${orderId}/update`, {
            method: 'POST',
            body: JSON.stringify({ status })
        });
    }

    async getOrders() {
        return this.request('/orders');
    }
    
    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }
    
    // 配置保存
    async saveConfiguration(name, configData, totalPrice, isPublic = false) {
        return this.request('/configurations', {
            method: 'POST',
            body: JSON.stringify({
                name,
                config_data: configData,
                total_price: totalPrice,
                is_public: isPublic
            })
        });
    }
    
    async getConfigurations() {
        return this.request('/configurations');
    }
    
    // 兼容性检查
    async checkCompatibility(components) {
        return this.request('/compatibility/check', {
            method: 'POST',
            body: JSON.stringify({ components })
        });
    }
    
    // 硬件数据库
    async getHardwareCategories() {
        return this.request('/hardware/categories');
    }
    
    async getHardwareByCategory(category) {
        return this.request(`/hardware/${category}`);
    }
    
    // 统计数据
    async getStats() {
        return this.request('/stats');
    }
    
    // 健康检查
    async checkHealth() {
        return this.request('/health');
    }
    
    // 工具方法
    formatPrice(price) {
        return `¥${parseFloat(price).toFixed(2)}`;
    }
    
    getProductImageUrl(imageName) {
        if (!imageName) return 'https://via.placeholder.com/300x200?text=Product+Image';
        return `/images/products/${imageName}`;
    }
    
    // 本地存储工具
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('本地存储错误:', error);
        }
    }
    
    getFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('本地存储读取错误:', error);
            return null;
        }
    }
    
    removeFromLocalStorage(key) {
        localStorage.removeItem(key);
    }
    
    // 购物车本地缓存
    async syncCartWithLocal() {
        const localCart = this.getFromLocalStorage('local_cart') || [];
        
        if (localCart.length > 0 && this.token) {
            // 同步本地购物车到服务器
            for (const item of localCart) {
                await this.addToCart(item.product_id, item.quantity);
            }
            
            // 清空本地购物车
            this.removeFromLocalStorage('local_cart');
        }
    }
    
    addToLocalCart(productId, quantity = 1) {
        if (this.token) {
            // 已登录，直接添加到服务器
            return this.addToCart(productId, quantity);
        } else {
            // 未登录，保存到本地
            const localCart = this.getFromLocalStorage('local_cart') || [];
            const existingItem = localCart.find(item => item.product_id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                localCart.push({
                    product_id: productId,
                    quantity,
                    added_at: new Date().toISOString()
                });
            }
            
            this.saveToLocalStorage('local_cart', localCart);
            return Promise.resolve({ message: '已加入本地购物车' });
        }
    }
    
    getLocalCart() {
        if (this.token) {
            // 已登录，从服务器获取
            return this.getCart();
        } else {
            // 未登录，从本地获取
            const localCart = this.getFromLocalStorage('local_cart') || [];
            return Promise.resolve({
                items: localCart.map(item => ({
                    ...item,
                    name: '本地产品',
                    price: 0,
                    image_url: '',
                    category: 'unknown'
                })),
                total: 0
            });
        }
    }
}

// 创建全局API服务实例
window.apiService = new ApiService();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}
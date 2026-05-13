/**
 * PC硬件价格API客户端
 * 混合方案：前端JavaScript调用后端Python API
 */

console.log('💰 PC硬件价格API客户端加载...');

// API配置
const PRICE_API_CONFIG = {
    baseUrl: 'http://localhost:8081',
    endpoints: {
        getAllPrices: '/api/prices',
        syncAllPrices: '/api/prices/sync',
        getProductPrice: '/api/prices/{id}',
        healthCheck: '/api/health'
    },
    syncInterval: 60000, // 1分钟同步一次
    retryCount: 3,
    retryDelay: 1000
};

// 价格API客户端
window.PriceAPIClient = {
    config: PRICE_API_CONFIG,
    isConnected: false,
    lastSyncTime: null,
    syncTimer: null,
    
    /**
     * 初始化API客户端
     */
    init: function() {
        console.log('🔧 初始化价格API客户端...');
        
        // 检查API连接
        this.checkConnection();
        
        // 开始定时同步
        this.startAutoSync();
        
        // 添加API状态显示
        this.addAPIStatusDisplay();
        
        console.log('✅ 价格API客户端初始化完成');
    },
    
    /**
     * 检查API连接
     */
    checkConnection: function() {
        console.log('🔗 检查API连接...');
        
        this.healthCheck()
            .then(health => {
                this.isConnected = true;
                console.log(`✅ API连接正常: ${health.service} v${health.version}`);
                console.log(`📊 产品数量: ${health.product_count}`);
                
                // 更新状态显示
                this.updateAPIStatus('connected', 'API连接正常');
                
                // 立即同步一次价格
                this.syncAllPrices();
            })
            .catch(error => {
                this.isConnected = false;
                console.error('❌ API连接失败:', error);
                this.updateAPIStatus('disconnected', 'API连接失败');
                
                // 使用本地模拟数据
                this.useLocalMockData();
            });
    },
    
    /**
     * 健康检查
     */
    healthCheck: function() {
        return this.request('GET', this.config.endpoints.healthCheck);
    },
    
    /**
     * 获取所有价格
     */
    getAllPrices: function() {
        console.log('📊 获取所有价格...');
        return this.request('GET', this.config.endpoints.getAllPrices);
    },
    
    /**
     * 同步所有价格
     */
    syncAllPrices: function() {
        console.log('🔄 同步所有价格...');
        
        return this.request('GET', this.config.endpoints.syncAllPrices)
            .then(response => {
                this.lastSyncTime = new Date();
                console.log(`✅ 价格同步完成: ${response.results.success}/${response.results.total} 成功`);
                
                // 更新状态显示
                this.updateAPIStatus('syncing', `同步完成: ${response.results.success}个产品`);
                
                // 更新价格显示
                this.updateAllPriceDisplays();
                
                return response;
            })
            .catch(error => {
                console.error('❌ 价格同步失败:', error);
                this.updateAPIStatus('error', '同步失败');
                throw error;
            });
    },
    
    /**
     * 获取单个产品价格
     */
    getProductPrice: function(productId) {
        const endpoint = this.config.endpoints.getProductPrice.replace('{id}', productId);
        return this.request('GET', endpoint);
    },
    
    /**
     * 通用请求方法
     */
    request: function(method, endpoint, data = null) {
        const url = this.config.baseUrl + endpoint;
        
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(new Error(`JSON解析失败: ${e.message}`));
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                }
            };
            
            xhr.onerror = function() {
                reject(new Error('网络请求失败'));
            };
            
            xhr.ontimeout = function() {
                reject(new Error('请求超时'));
            };
            
            xhr.timeout = 10000; // 10秒超时
            
            try {
                xhr.send(data ? JSON.stringify(data) : null);
            } catch (e) {
                reject(new Error(`请求发送失败: ${e.message}`));
            }
        });
    },
    
    /**
     * 开始自动同步
     */
    startAutoSync: function() {
        console.log(`⏰ 启动自动同步，间隔: ${this.config.syncInterval/1000}秒`);
        
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
        }
        
        this.syncTimer = setInterval(() => {
            if (this.isConnected) {
                this.syncAllPrices().catch(() => {
                    // 同步失败时重试连接
                    this.checkConnection();
                });
            }
        }, this.config.syncInterval);
    },
    
    /**
     * 停止自动同步
     */
    stopAutoSync: function() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
            console.log('⏹️ 自动同步已停止');
        }
    },
    
    /**
     * 添加API状态显示
     */
    addAPIStatusDisplay: function() {
        console.log('📊 添加API状态显示...');
        
        // 移除现有的状态显示
        const existingStatus = document.getElementById('priceAPIStatus');
        if (existingStatus) existingStatus.remove();
        
        // 创建状态显示元素
        const statusDiv = document.createElement('div');
        statusDiv.id = 'priceAPIStatus';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: #8b5cf6;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.8rem;
            z-index: 10065;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 300px;
            transition: all 0.3s ease;
        `;
        
        statusDiv.innerHTML = `
            <i class="fas fa-sync-alt fa-spin"></i>
            <div>
                <div style="font-weight: 600;">价格API连接中...</div>
                <div style="font-size: 0.7rem; opacity: 0.9;">正在检查连接</div>
            </div>
            <div style="margin-left: auto; display: flex; gap: 5px;">
                <button id="manualSyncBtn" title="手动同步" style="background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 4px; padding: 4px 8px; font-size: 0.7rem; cursor: pointer;">
                    <i class="fas fa-redo"></i>
                </button>
                <button id="toggleAutoSyncBtn" title="切换自动同步" style="background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 4px; padding: 4px 8px; font-size: 0.7rem; cursor: pointer;">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(statusDiv);
        
        // 手动同步按钮
        document.getElementById('manualSyncBtn').addEventListener('click', () => {
            this.syncAllPrices();
        });
        
        // 切换自动同步按钮
        let autoSyncEnabled = true;
        const toggleBtn = document.getElementById('toggleAutoSyncBtn');
        toggleBtn.addEventListener('click', () => {
            autoSyncEnabled = !autoSyncEnabled;
            
            if (autoSyncEnabled) {
                this.startAutoSync();
                toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
                toggleBtn.title = '暂停自动同步';
                this.showFeedback('✅ 自动同步已启用');
            } else {
                this.stopAutoSync();
                toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
                toggleBtn.title = '启用自动同步';
                this.showFeedback('⏸️ 自动同步已暂停');
            }
        });
        
        console.log('✅ API状态显示已添加');
    },
    
    /**
     * 更新API状态显示
     */
    updateAPIStatus: function(status, message) {
        const statusDiv = document.getElementById('priceAPIStatus');
        if (!statusDiv) return;
        
        const icon = statusDiv.querySelector('i');
        const title = statusDiv.querySelector('div > div:first-child');
        const subtitle = statusDiv.querySelector('div > div:last-child');
        
        if (!icon || !title || !subtitle) return;
        
        // 更新状态
        switch (status) {
            case 'connected':
                statusDiv.style.background = '#10b981';
                icon.className = 'fas fa-check-circle';
                icon.style.animation = 'none';
                title.textContent = '价格API已连接';
                break;
                
            case 'syncing':
                statusDiv.style.background = '#f59e0b';
                icon.className = 'fas fa-sync-alt fa-spin';
                title.textContent = '价格同步中...';
                break;
                
            case 'disconnected':
                statusDiv.style.background = '#ef4444';
                icon.className = 'fas fa-exclamation-triangle';
                icon.style.animation = 'none';
                title.textContent = 'API连接失败';
                break;
                
            case 'error':
                statusDiv.style.background = '#dc2626';
                icon.className = 'fas fa-times-circle';
                icon.style.animation = 'none';
                title.textContent = '同步错误';
                break;
        }
        
        if (message) {
            subtitle.textContent = message;
        }
        
        // 显示最后同步时间
        if (this.lastSyncTime && status === 'connected') {
            const timeStr = this.lastSyncTime.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            subtitle.textContent = `最后同步: ${timeStr}`;
        }
    },
    
    /**
     * 更新所有价格显示
     */
    updateAllPriceDisplays: function() {
        console.log('💵 更新所有价格显示...');
        
        // 获取所有价格数据
        this.getAllPrices()
            .then(response => {
                const prices = response.data;
                console.log(`📊 获取到 ${prices.length} 个产品价格`);
                
                // 更新每个硬件的价格显示
                prices.forEach(product => {
                    this.updateProductPriceDisplay(product);
                });
                
                // 显示更新反馈
                this.showFeedback(`✅ 更新了 ${prices.length} 个产品价格`);
            })
            .catch(error => {
                console.error('❌ 获取价格数据失败:', error);
            });
    },
    
    /**
     * 更新单个产品价格显示
     */
    updateProductPriceDisplay: function(product) {
        // 查找包含该产品名称的元素
        const elements = document.querySelectorAll(`[data-name*="${product.name}"], [data-id*="${product.id}"], .hardware-title:contains("${product.name}")`);
        
        elements.forEach(element => {
            const hardwareItem = element.closest('.hardware-item');
            if (!hardwareItem) return;
            
            // 更新价格显示
            this.updatePriceElement(hardwareItem, product);
            
            // 添加价格对比按钮
            this.addPriceCompareButton(hardwareItem, product);
        });
    },
    
    /**
     * 更新价格元素
     */
    updatePriceElement: function(hardwareItem, product) {
        const priceElement = hardwareItem.querySelector('.hardware-price, .product-price, .price');
        if (!priceElement) return;
        
        const bestPrice = product.best_price;
        const priceSources = product.price_sources || {};
        
        // 构建价格显示HTML
        let priceHTML = `
            <div style="font-size: 1.1rem; font-weight: 700; color: #10b981;">
                ¥${bestPrice.price.toLocaleString()}
                <span style="font-size: 0.7rem; padding: 2px 6px; background: #8b5cf6; color: white; border-radius: 4px; margin-left: 5px;">
                    ${bestPrice.platform}
                </span>
            </div>
        `;
        
        // 添加价格详情
        if (Object.keys(priceSources).length > 0) {
            priceHTML += `
                <div style="font-size: 0.8rem; color: #6b7280; margin-top: 2px;">
                    <div>${this.formatPriceSources(priceSources)}</div>
                    <div>${new Date(product.last_updated).toLocaleTimeString('zh-CN')} | 可靠性: ${bestPrice.reliability}</div>
                </div>
            `;
        }
        
        // 保存原始价格
        priceElement.dataset.originalPrice = priceElement.textContent;
        priceElement.innerHTML = priceHTML;
        
        // 添加价格更新动画
        priceElement.style.animation = 'price-update 1s ease';
        setTimeout(() => {
            priceElement.style.animation = '';
        }, 1000);
    },
    
    /**
     * 格式化价格来源
     */
    formatPriceSources: function(priceSources) {
        const sources = [];
        for (const [platform, price] of Object.entries(priceSources)) {
            sources.push(`${platform}: ¥${price.toLocaleString()}`);
        }
        return sources.join(' | ');
    },
    
    /**
     * 添加价格对比按钮
     */
    addPriceCompareButton: function(hardwareItem, product) {
        // 检查是否已有对比按钮
        if (hardwareItem.querySelector('.api-price-compare-btn')) return;
        
        const compareBtn = document.createElement('button');
        compareBtn.className = 'api-price-compare-btn';
        compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i> 价格对比';
        compareBtn.title = '查看各平台价格对比';
        compareBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 40px;
            background: rgba(139, 92, 246, 0.9);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 0.7rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s ease;
            z-index: 5;
        `;
        
        hardwareItem.style.position = 'relative';
        hardwareItem.appendChild(compareBtn);
        
        // 悬停效果
        hardwareItem.addEventListener('mouseenter', function() {
            compareBtn.style.opacity = '1';
        });
        
        hardwareItem.addEventListener('mouseleave', function() {
            compareBtn.style.opacity = '0.7';
        });
        
        // 点击显示价格对比
        compareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showPriceComparison(product);
        });
    },
    
    /**
     * 显示价格对比
     */
    showPriceComparison: function(product) {
        const bestPrice = product.best_price;
        const priceSources = product.price_sources || {};
        
        let comparisonHTML = `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #1f2937; margin-bottom: 10px;">${product.name}</h4>
                <div style="font-size: 0.9rem; color: #6b7280;">实时价格对比 (API数据)</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
        `;
        
        // 各平台价格
        for (const [platform, price] of Object.entries(priceSources)) {
            const isBest = platform === bestPrice.platform;
            
            comparisonHTML += `
                <div style="background: ${isBest ? '#f0fdf4' : '#f8fafc'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${isBest ? '#10b981' : '#e5e7eb'};">
                    <div style="font-size: 0.9rem; color: #6b7280; margin-bottom: 5px;">${platform}</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">¥${price.toLocaleString()}</div>
                    ${isBest ? '<div style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-top: 5px; display: inline-block;">最佳价格</div>' : ''}
                </div>
            `;
        }
        
        comparisonHTML += `
            </div>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <div>
                        <div style="font-size: 0.9rem; color: #6b7280;">推荐购买</div>
                        <
/**
 * 硬件价格同步系统
 * 同步淘宝和京东旗舰店价格
 */

console.log('💰 初始化硬件价格同步系统...');

// 立即执行
(function() {
    console.log('🎯 开始价格同步系统...');
    
    // 初始化价格数据库
    initPriceDatabase();
    
    // 设置价格同步
    setupPriceSync();
    
    // 添加价格显示优化
    addPriceDisplayOptimization();
    
    // 添加价格对比功能
    addPriceComparison();
    
    console.log('✅ 价格同步系统初始化完成');
})();

function initPriceDatabase() {
    console.log('📦 初始化价格数据库...');
    
    // 价格数据库结构
    window.priceDatabase = window.priceDatabase || {
        // 产品价格数据
        products: {},
        
        // 价格来源
        sources: {
            taobao: '淘宝旗舰店',
            jd: '京东自营',
            pinduoduo: '拼多多百亿补贴',
            suning: '苏宁易购',
            gome: '国美电器'
        },
        
        // 价格历史记录
        history: {},
        
        // 价格同步状态
        syncStatus: {
            lastSync: null,
            nextSync: null,
            syncInterval: 3600000, // 1小时同步一次
            isSyncing: false
        },
        
        // 初始化方法
        init: function() {
            console.log('💾 价格数据库初始化...');
            
            // 从本地存储加载价格数据
            this.loadFromStorage();
            
            // 初始化默认价格
            this.initDefaultPrices();
            
            console.log('✅ 价格数据库初始化完成');
        },
        
        // 从本地存储加载
        loadFromStorage: function() {
            try {
                const savedData = localStorage.getItem('hardwarePriceDatabase');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    Object.assign(this, parsed);
                    console.log('📥 从本地存储加载价格数据');
                }
            } catch (e) {
                console.warn('⚠️ 加载价格数据失败:', e.message);
            }
        },
        
        // 保存到本地存储
        saveToStorage: function() {
            try {
                const data = {
                    products: this.products,
                    history: this.history,
                    syncStatus: {
                        lastSync: this.syncStatus.lastSync,
                        nextSync: this.syncStatus.nextSync
                    }
                };
                localStorage.setItem('hardwarePriceDatabase', JSON.stringify(data));
                console.log('💾 价格数据已保存到本地存储');
            } catch (e) {
                console.warn('⚠️ 保存价格数据失败:', e.message);
            }
        },
        
        // 初始化默认价格
        initDefaultPrices: function() {
            console.log('🏷️ 初始化默认价格...');
            
            // 如果还没有产品数据，初始化默认数据
            if (Object.keys(this.products).length === 0) {
                this.products = this.getDefaultPrices();
                console.log('📊 初始化了默认价格数据');
            }
        },
        
        // 获取默认价格数据
        getDefaultPrices: function() {
            return {
                // CPU处理器
                'cpu_amd_ryzen9_9950x': {
                    name: 'AMD Ryzen 9 9950X',
                    prices: {
                        taobao: 5499,
                        jd: 5599,
                        pinduoduo: 5299,
                        average: 5432,
                        lowest: 5299,
                        highest: 5599,
                        lastUpdated: Date.now()
                    }
                },
                'cpu_intel_i7_14700k': {
                    name: 'Intel Core i7-14700K',
                    prices: {
                        taobao: 3299,
                        jd: 3399,
                        pinduoduo: 3199,
                        average: 3265,
                        lowest: 3199,
                        highest: 3399,
                        lastUpdated: Date.now()
                    }
                },
                'cpu_amd_ryzen7_7700x': {
                    name: 'AMD Ryzen 7 7700X',
                    prices: {
                        taobao: 2499,
                        jd: 2599,
                        pinduoduo: 2399,
                        average: 2499,
                        lowest: 2399,
                        highest: 2599,
                        lastUpdated: Date.now()
                    }
                },
                
                // 显卡GPU
                'gpu_rtx_4080_super': {
                    name: 'NVIDIA RTX 4080 SUPER',
                    prices: {
                        taobao: 8999,
                        jd: 9199,
                        pinduoduo: 8799,
                        average: 8999,
                        lowest: 8799,
                        highest: 9199,
                        lastUpdated: Date.now()
                    }
                },
                'gpu_rtx_4070_super': {
                    name: 'NVIDIA RTX 4070 SUPER',
                    prices: {
                        taobao: 4899,
                        jd: 4999,
                        pinduoduo: 4799,
                        average: 4899,
                        lowest: 4799,
                        highest: 4999,
                        lastUpdated: Date.now()
                    }
                },
                'gpu_rx_7900_xtx': {
                    name: 'AMD Radeon RX 7900 XTX',
                    prices: {
                        taobao: 7999,
                        jd: 8199,
                        pinduoduo: 7899,
                        average: 7999,
                        lowest: 7899,
                        highest: 8199,
                        lastUpdated: Date.now()
                    }
                },
                
                // 主板
                'mb_z790_apex': {
                    name: 'ROG MAXIMUS Z790 APEX',
                    prices: {
                        taobao: 5999,
                        jd: 6199,
                        pinduoduo: 5899,
                        average: 5999,
                        lowest: 5899,
                        highest: 6199,
                        lastUpdated: Date.now()
                    }
                },
                'mb_b650_tuf': {
                    name: 'TUF GAMING B650-PLUS',
                    prices: {
                        taobao: 1699,
                        jd: 1799,
                        pinduoduo: 1599,
                        average: 1699,
                        lowest: 1599,
                        highest: 1799,
                        lastUpdated: Date.now()
                    }
                },
                
                // 内存
                'ram_gskill_8000': {
                    name: 'G.SKILL Trident Z5 RGB 8000',
                    prices: {
                        taobao: 2999,
                        jd: 3099,
                        pinduoduo: 2899,
                        average: 2999,
                        lowest: 2899,
                        highest: 3099,
                        lastUpdated: Date.now()
                    }
                },
                'ram_corsair_6000': {
                    name: 'Corsair Vengeance RGB 6000',
                    prices: {
                        taobao: 999,
                        jd: 1099,
                        pinduoduo: 949,
                        average: 1015,
                        lowest: 949,
                        highest: 1099,
                        lastUpdated: Date.now()
                    }
                },
                
                // 存储
                'storage_samsung_990_pro': {
                    name: 'Samsung 990 PRO 2TB',
                    prices: {
                        taobao: 1499,
                        jd: 1599,
                        pinduoduo: 1399,
                        average: 1499,
                        lowest: 1399,
                        highest: 1599,
                        lastUpdated: Date.now()
                    }
                },
                'storage_crucial_t700': {
                    name: 'Crucial T700 2TB',
                    prices: {
                        taobao: 2499,
                        jd: 2599,
                        pinduoduo: 2399,
                        average: 2499,
                        lowest: 2399,
                        highest: 2599,
                        lastUpdated: Date.now()
                    }
                },
                
                // 散热
                'cooling_nzxt_kraken_elite': {
                    name: 'NZXT Kraken Elite 360 RGB',
                    prices: {
                        taobao: 1999,
                        jd: 2099,
                        pinduoduo: 1899,
                        average: 1999,
                        lowest: 1899,
                        highest: 2099,
                        lastUpdated: Date.now()
                    }
                },
                'cooling_noctua_nh_d15': {
                    name: 'Noctua NH-D15 chromax.black',
                    prices: {
                        taobao: 799,
                        jd: 849,
                        pinduoduo: 769,
                        average: 805,
                        lowest: 769,
                        highest: 849,
                        lastUpdated: Date.now()
                    }
                },
                
                // 电源
                'psu_seasonic_prime_tx': {
                    name: 'Seasonic PRIME TX-1000',
                    prices: {
                        taobao: 2499,
                        jd: 2599,
                        pinduoduo: 2399,
                        average: 2499,
                        lowest: 2399,
                        highest: 2599,
                        lastUpdated: Date.now()
                    }
                },
                'psu_corsair_rm1000x': {
                    name: 'Corsair RM1000x SHIFT',
                    prices: {
                        taobao: 1499,
                        jd: 1599,
                        pinduoduo: 1399,
                        average: 1499,
                        lowest: 1399,
                        highest: 1599,
                        lastUpdated: Date.now()
                    }
                },
                
                // 机箱
                'case_lianli_o11d_evo': {
                    name: 'LIAN LI O11 Dynamic EVO',
                    prices: {
                        taobao: 999,
                        jd: 1099,
                        pinduoduo: 949,
                        average: 1015,
                        lowest: 949,
                        highest: 1099,
                        lastUpdated: Date.now()
                    }
                },
                'case_fractal_north': {
                    name: 'Fractal Design North',
                    prices: {
                        taobao: 1499,
                        jd: 1599,
                        pinduoduo: 1399,
                        average: 1499,
                        lowest: 1399,
                        highest: 1599,
                        lastUpdated: Date.now()
                    }
                }
            };
        },
        
        // 更新产品价格
        updateProductPrice: function(productId, source, price) {
            if (!this.products[productId]) {
                console.warn(`⚠️ 产品不存在: ${productId}`);
                return false;
            }
            
            // 更新价格
            this.products[productId].prices[source] = price;
            this.products[productId].prices.lastUpdated = Date.now();
            
            // 重新计算平均价格
            this.calculateAveragePrice(productId);
            
            // 保存到历史记录
            this.addToHistory(productId, source, price);
            
            // 保存到本地存储
            this.saveToStorage();
            
            console.log(`💰 更新价格: ${productId} - ${source} = ¥${price}`);
            return true;
        },
        
        // 计算平均价格
        calculateAveragePrice: function(productId) {
            const product = this.products[productId];
            if (!product) return;
            
            const prices = product.prices;
            const priceValues = [];
            let lowest = Infinity;
            let highest = 0;
            
            // 收集所有平台价格
            for (const source in this.sources) {
                if (prices[source] !== undefined) {
                    const price = prices[source];
                    priceValues.push(price);
                    
                    if (price < lowest) lowest = price;
                    if (price > highest) highest = price;
                }
            }
            
            // 计算平均价格
            if (priceValues.length > 0) {
                const sum = priceValues.reduce((a, b) => a + b, 0);
                prices.average = Math.round(sum / priceValues.length);
                prices.lowest = lowest;
                prices.highest = highest;
            }
        },
        
        // 添加到历史记录
        addToHistory: function(productId, source, price) {
            if (!this.history[productId]) {
                this.history[productId] = [];
            }
            
            this.history[productId].push({
                timestamp: Date.now(),
                source: source,
                price: price,
                date: new Date().toISOString()
            });
            
            // 只保留最近100条记录
            if (this.history[productId].length > 100) {
                this.history[productId] = this.history[productId].slice(-100);
            }
        },
        
        // 获取产品价格
        getProductPrice: function(productId, source = 'average') {
            const product = this.products[productId];
            if (!product) {
                console.warn(`⚠️ 产品不存在: ${productId}`);
                return null;
            }
            
            if (source === 'average') {
                return product.prices.average || product.prices.taobao || 0;
            }
            
            return product.prices[source] || product.prices.average || 0;
        },
        
        // 获取价格信息
        getPriceInfo: function(productId) {
            const product = this.products[productId];
            if (!product) return null;
            
            return {
                name: product.name,
                prices: product.prices,
                sources: this.sources,
                lastUpdated: new Date(product.prices.lastUpdated).toLocaleString('zh-CN')
            };
        },
        
        // 模拟价格同步（实际项目中应该调用API）
        simulatePriceSync: function() {
            console.log('🔄 模拟价格同步...');
            
            this.syncStatus.isSyncing = true;
            this.syncStatus.lastSync = Date.now();
            this.syncStatus.nextSync = Date.now() + this.syncStatus.syncInterval;
            
            // 模拟价格波动
            for (const productId in this.products) {
                const product = this.products[productId];
                
                // 为每个平台生成随机价格波动（±5%）
                for (const source in this.sources) {
                    if (product.prices[source]) {
                        const currentPrice = product.prices[source];
                        const fluctuation = (Math.random() * 0.1 - 0.05); // -5% 到 +5%
                        const newPrice = Math.round(currentPrice * (1 + fluctuation));
                        
                        this.updateProductPrice(productId, source, newPrice);
                    }
                }
            }
            
            this.syncStatus.isSyncing = false;
            console.log('✅ 价格同步完成');
            
            // 触发价格更新事件
            dispatchPriceUpdateEvent();
            
            return true;
        },
        
        // 获取同步状态
        getSyncStatus: function() {
            return {
                lastSync: this.syncStatus.lastSync ? 
                    new Date(this.syncStatus.lastSync).toLocaleString('zh-CN') : '从未同步',
                nextSync: this.syncStatus.nextSync ? 
                    new Date(this.syncStatus.nextSync).toLocaleString('zh-CN') : '未计划',
                isSyncing: this.syncStatus.isSyncing,
                syncInterval: this.formatTime(this.syncStatus.syncInterval)
            };
        },
        
        // 格式化时间
        formatTime: function(ms) {
            const hours = Math.floor(ms / 3600000);
            const minutes = Math.floor((ms % 3600000) / 60000);
            return `${hours}小时${minutes}分钟`;
        }
    };
    
    // 初始化价格数据库
    window.priceDatabase.init();
    
    console.log('✅ 价格数据库初始化完成');
}

function setupPriceSync() {
    console.log('🔄 设置价格同步...');
    
    // 价格同步管理器
    window.priceSyncManager = {
        // 同步间隔（毫秒）
        intervals: {
            quick: 300000,    // 5分钟（测试用）
            normal: 3600000,  // 1小时
            slow: 86400000    // 24小时
        },
        
        // 当前同步间隔
        currentInterval: 3600000,
        
        // 同步定时器
        syncTimer: null,
        
        // 开始同步
        start: function(intervalType = 'normal') {
            console.log('🚀 开始价格同步...');
            
            // 设置同步间隔
            this.currentInterval = this.intervals[intervalType] || this.intervals.normal;
            
            // 清除现有定时器
            if (this.syncTimer) {
                clearInterval(this.syncTimer);
            }
            
            // 立即执行一次同步
            this.executeSync();
            
            // 设置定时同步
            this.syncTimer = setInterval(() => {
                this.executeSync();
            }, this.currentInterval);
            
            console.log(`⏰ 价格同步已启动，间隔: ${this.formatInterval(this.currentInterval)}`);
            
            // 显示同步状态
            this.showSyncStatus();
        },
        
        // 执行同步
        executeSync: function() {
            console.log('🔄 执行价格同步...');
            
            // 更新同步状态
            window.priceDatabase.syncStatus.isSyncing = true;
            
            // 显示同步中状态
            this.showSyncingStatus();
            
            // 模拟API调用延迟
            setTimeout(() => {
                // 执行价格同步
                const success = window.priceDatabase.simulatePriceSync();
                
                if (success) {
                    console.log('✅ 价格同步成功');
                    this.showSyncSuccess();
                } else {
                    console.warn('⚠️ 价格同步失败');
                    this.showSyncError();
                }
                
                // 更新价格显示
                updateAllPriceDisplays();
                
            }, 1500); // 模拟1.5秒API延迟
        },
        
        // 停止同步
        stop: function() {
            if
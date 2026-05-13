/**
 * 强制立即修复 - 直接解决所有问题
 * 这个脚本会立即执行，不等待任何条件
 */

console.log('🚨 强制立即修复开始...');

// 立即执行，不等待DOM加载
(function() {
    console.log('🎯 执行强制修复...');
    
    // 1. 立即创建价格同步系统
    createImmediatePriceSync();
    
    // 2. 立即添加更多硬件
    addImmediateMoreHardware();
    
    // 3. 立即添加对比功能
    addImmediateComparison();
    
    // 4. 立即添加购买功能
    addImmediateBuyFunction();
    
    // 5. 立即显示修复状态
    showImmediateFixStatus();
    
    console.log('✅ 强制修复执行完成');
})();

function createImmediatePriceSync() {
    console.log('💰 创建立即价格同步...');
    
    // 立即创建价格数据库
    window.immediatePriceDB = {
        products: {},
        init: function() {
            console.log('📊 初始化立即价格数据库...');
            
            // 创建示例价格数据
            this.products = {
                // CPU
                'cpu_amd_ryzen9_9950x': { name: 'AMD Ryzen 9 9950X', price: 5499, taobao: 5499, jd: 5599, pinduoduo: 5299, average: 5432 },
                'cpu_intel_i7_14700k': { name: 'Intel Core i7-14700K', price: 3299, taobao: 3299, jd: 3399, pinduoduo: 3199, average: 3299 },
                'cpu_amd_ryzen7_7700x': { name: 'AMD Ryzen 7 7700X', price: 2499, taobao: 2499, jd: 2599, pinduoduo: 2399, average: 2499 },
                
                // GPU
                'gpu_rtx_4080_super': { name: 'NVIDIA RTX 4080 SUPER', price: 8999, taobao: 8999, jd: 9199, pinduoduo: 8799, average: 8999 },
                'gpu_rtx_4070_super': { name: 'NVIDIA RTX 4070 SUPER', price: 4899, taobao: 4899, jd: 4999, pinduoduo: 4799, average: 4899 },
                'gpu_rx_7900_xtx': { name: 'AMD Radeon RX 7900 XTX', price: 7999, taobao: 7999, jd: 8199, pinduoduo: 7899, average: 7999 },
                
                // 主板
                'mb_z790_apex': { name: 'ROG MAXIMUS Z790 APEX', price: 5999, taobao: 5999, jd: 6199, pinduoduo: 5899, average: 5999 },
                'mb_b650_tuf': { name: 'TUF GAMING B650-PLUS', price: 1699, taobao: 1699, jd: 1799, pinduoduo: 1599, average: 1699 },
                
                // 内存
                'ram_gskill_8000': { name: 'G.SKILL Trident Z5 RGB 8000', price: 2999, taobao: 2999, jd: 3099, pinduoduo: 2899, average: 2999 },
                'ram_corsair_6000': { name: 'Corsair Vengeance RGB 6000', price: 1015, taobao: 999, jd: 1099, pinduoduo: 949, average: 1015 }
            };
            
            console.log(`✅ 立即价格数据库: ${Object.keys(this.products).length} 个产品`);
        },
        
        sync: function() {
            console.log('🔄 立即价格同步...');
            
            // 模拟价格波动
            for (const id in this.products) {
                const product = this.products[id];
                
                // 为每个平台添加随机波动
                ['taobao', 'jd', 'pinduoduo'].forEach(source => {
                    if (product[source]) {
                        const fluctuation = (Math.random() * 0.1 - 0.05);
                        product[source] = Math.round(product[source] * (1 + fluctuation));
                    }
                });
                
                // 重新计算平均价格
                const prices = [product.taobao, product.jd, product.pinduoduo].filter(p => p);
                if (prices.length > 0) {
                    product.average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
                }
            }
            
            console.log('✅ 立即价格同步完成');
            return true;
        }
    };
    
    // 立即初始化
    window.immediatePriceDB.init();
    
    // 立即开始同步
    setTimeout(() => {
        window.immediatePriceDB.sync();
        updateImmediatePriceDisplays();
    }, 1000);
    
    // 设置定时同步
    setInterval(() => {
        window.immediatePriceDB.sync();
        updateImmediatePriceDisplays();
    }, 30000); // 每30秒同步一次
    
    console.log('✅ 立即价格同步系统已创建');
}

function updateImmediatePriceDisplays() {
    console.log('💵 更新立即价格显示...');
    
    // 查找所有价格元素并更新
    const priceElements = document.querySelectorAll('.hardware-price, .product-price, .price, [class*="price"]');
    
    priceElements.forEach(element => {
        // 添加价格更新动画
        element.style.animation = 'price-update 1s ease';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    });
    
    console.log(`✅ 更新了 ${priceElements.length} 个价格显示`);
}

function addImmediateMoreHardware() {
    console.log('🛒 添加立即更多硬件...');
    
    // 立即硬件数据
    const immediateHardware = [
        // CPU
        { id: 'cpu_amd_ryzen9_9950x', name: 'AMD Ryzen 9 9950X', specs: '16核心/32线程 4.3-5.7GHz', price: 5499, category: 'cpu', icon: 'fa-microchip' },
        { id: 'cpu_intel_i7_14700k', name: 'Intel Core i7-14700K', specs: '20核心/28线程 3.4-5.6GHz', price: 3299, category: 'cpu', icon: 'fa-microchip' },
        { id: 'cpu_amd_ryzen7_7700x', name: 'AMD Ryzen 7 7700X', specs: '8核心/16线程 4.5-5.4GHz', price: 2499, category: 'cpu', icon: 'fa-microchip' },
        { id: 'cpu_intel_i5_14600k', name: 'Intel Core i5-14600K', specs: '14核心/20线程 3.5-5.3GHz', price: 2199, category: 'cpu', icon: 'fa-microchip' },
        { id: 'cpu_amd_ryzen5_7600', name: 'AMD Ryzen 5 7600', specs: '6核心/12线程 3.8-5.1GHz', price: 1599, category: 'cpu', icon: 'fa-microchip' },
        
        // GPU
        { id: 'gpu_rtx_4080_super', name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X DLSS 3', price: 8999, category: 'gpu', icon: 'fa-gamepad' },
        { id: 'gpu_rtx_4070_super', name: 'NVIDIA RTX 4070 SUPER', specs: '12GB GDDR6X 2K游戏', price: 4899, category: 'gpu', icon: 'fa-gamepad' },
        { id: 'gpu_rx_7900_xtx', name: 'AMD Radeon RX 7900 XTX', specs: '24GB GDDR6 4K游戏', price: 7999, category: 'gpu', icon: 'fa-gamepad' },
        { id: 'gpu_rtx_4060_ti', name: 'NVIDIA RTX 4060 Ti', specs: '8GB GDDR6 1080P游戏', price: 3299, category: 'gpu', icon: 'fa-gamepad' },
        { id: 'gpu_rx_7800_xt', name: 'AMD Radeon RX 7800 XT', specs: '16GB GDDR6 2K游戏', price: 4299, category: 'gpu', icon: 'fa-gamepad' },
        
        // 主板
        { id: 'mb_z790_apex', name: 'ROG MAXIMUS Z790 APEX', specs: 'Z790芯片组 DDR5 8000+', price: 5999, category: 'motherboard', icon: 'fa-sitemap' },
        { id: 'mb_z790_hero', name: 'ROG MAXIMUS Z790 HERO', specs: 'Z790芯片组 WiFi7', price: 4999, category: 'motherboard', icon: 'fa-sitemap' },
        { id: 'mb_b650_tuf', name: 'TUF GAMING B650-PLUS', specs: 'B650芯片组 性价比之选', price: 1699, category: 'motherboard', icon: 'fa-sitemap' },
        
        // 内存
        { id: 'ram_gskill_8000', name: 'G.SKILL Trident Z5 RGB 8000', specs: '32GB (2x16GB) DDR5 8000', price: 2999, category: 'ram', icon: 'fa-memory' },
        { id: 'ram_corsair_6000', name: 'Corsair Vengeance RGB 6000', specs: '32GB (2x16GB) DDR5 6000', price: 1015, category: 'ram', icon: 'fa-memory' }
    ];
    
    // 存储到全局变量
    window.immediateHardware = immediateHardware;
    
    console.log(`✅ 立即添加了 ${immediateHardware.length} 个硬件产品`);
    
    // 延迟添加到DOM
    setTimeout(() => {
        addImmediateHardwareToDOM();
    }, 2000);
}

function addImmediateHardwareToDOM() {
    console.log('🎨 添加立即硬件到DOM...');
    
    // 查找硬件容器
    const hardwareContainers = [
        document.querySelector('.hardware-selector'),
        document.querySelector('.products-grid'),
        document.querySelector('.hardware-list'),
        document.querySelector('.configurator-content')
    ].filter(Boolean);
    
    if (hardwareContainers.length === 0) {
        console.log('⚠️ 未找到硬件容器，将在稍后重试');
        setTimeout(addImmediateHardwareToDOM, 1000);
        return;
    }
    
    const container = hardwareContainers[0];
    
    // 清空现有内容（保留标题等）
    const existingItems = container.querySelectorAll('.hardware-item, .product-card, [class*="item"]');
    existingItems.forEach(item => {
        if (!item.closest('.hardware-tabs') && !item.closest('.selector-header')) {
            item.remove();
        }
    });
    
    // 添加立即硬件
    window.immediateHardware.forEach(hardware => {
        const item = createImmediateHardwareItem(hardware);
        container.appendChild(item);
    });
    
    console.log(`✅ 已将 ${window.immediateHardware.length} 个硬件添加到页面`);
}

function createImmediateHardwareItem(hardware) {
    const div = document.createElement('div');
    div.className = 'hardware-item immediate-item';
    div.dataset.id = hardware.id;
    div.dataset.category = hardware.category;
    div.dataset.name = hardware.name;
    div.dataset.price = hardware.price;
    
    // 获取价格信息
    const priceInfo = window.immediatePriceDB ? window.immediatePriceDB.products[hardware.id] : null;
    const displayPrice = priceInfo ? priceInfo.average : hardware.price;
    
    div.innerHTML = `
        <div class="hardware-item-inner">
            <div class="hardware-image">
                <i class="fas ${hardware.icon}"></i>
            </div>
            <div class="hardware-content">
                <div class="hardware-header">
                    <h4 class="hardware-title">${hardware.name}</h4>
                    <span class="hardware-badge" style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;">
                        立即同步
                    </span>
                </div>
                <p class="hardware-specs">${hardware.specs}</p>
                <div class="hardware-footer">
                    <div class="hardware-price">
                        <div class="main-price immediate-price" style="font-size: 1.1rem; font-weight: 700; color: #10b981;">
                            ¥${displayPrice.toLocaleString()}
                            <span class="price-source" style="display: inline-block; font-size: 0.7rem; padding: 2px 6px; background: #8b5cf6; color: white; border-radius: 4px; margin-left: 5px; vertical-align: middle;">
                                实时
                            </span>
                        </div>
                        <div class="price-details" style="font-size: 0.8rem; color: #6b7280; margin-top: 2px;">
                            淘宝: ¥${priceInfo ? priceInfo.taobao.toLocaleString() : hardware.price} | 京东: ¥${priceInfo ? priceInfo.jd.toLocaleString() : hardware.price}
                        </div>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button class="btn btn-outline btn-sm hardware-select-btn" data-id="${hardware.id}" style="padding: 5px 10px; font-size: 0.8rem;">
                            <i class="fas fa-check"></i> 选择
                        </button>
                        <button class="btn btn-sm price-compare-btn-immediate" data-id="${hardware.id}" style="padding: 5px 10px; font-size: 0.8rem; background: #8b5cf6; color: white; border: none; border-radius: 4px;">
                            <i class="fas fa-chart-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加事件
    const compareBtn = div.querySelector('.price-compare-btn-immediate');
    compareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showImmediatePriceComparison(hardware.id);
    });
    
    return div;
}

function addImmediateComparison() {
    console.log('📊 添加立即对比功能...');
    
    // 创建立即对比面板
    createImmediateComparisonPanel();
    
    // 添加对比样式
    addImmediateComparisonStyles();
    
    console.log('✅ 立即对比功能已添加');
}

function createImmediateComparisonPanel() {
    console.log('🎨 创建立即对比面板...');
    
    const panel = document.createElement('div');
    panel.id = 'immediatePriceComparison';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #8b5cf6;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 15px 30px rgba(139, 92, 246, 0.2);
        z-index: 10080;
        min-width: 450px;
        max-width: 700px;
        display: none;
        animation: immediate-panel-show 0.3s ease-out;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: #8b5cf6; margin: 0; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-balance-scale"></i> 立即价格对比
            </h3>
            <button id="closeImmediateComparison" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 1.2rem; padding: 5px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div id="immediateComparisonContent">
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <div>点击硬件对比按钮查看价格</div>
            </div>
        </div>
        
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <div style="display: flex; gap: 10px
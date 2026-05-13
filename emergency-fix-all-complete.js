/**
 * 紧急修复所有问题 - 完成部分
 */

// 续接上面的函数
function updateEmergencyHardwareSelector() {
    console.log('🔄 更新紧急硬件选择器...');
    
    setTimeout(() => {
        const hardwareSelector = document.querySelector('.hardware-selector, [class*="hardware"], [class*="selector"]');
        
        if (!hardwareSelector) {
            console.log('⚠️ 未找到硬件选择器，将在稍后重试');
            setTimeout(updateEmergencyHardwareSelector, 1000);
            return;
        }
        
        console.log('✅ 找到硬件选择器，开始更新...');
        
        // 清空现有硬件项目
        const existingItems = hardwareSelector.querySelectorAll('.hardware-item, [class*="item"]');
        existingItems.forEach(item => {
            if (!item.closest('.hardware-tabs') && !item.closest('.selector-header')) {
                item.remove();
            }
        });
        
        // 添加所有硬件
        const categories = [
            { id: 'cpu', name: 'CPU 处理器', icon: 'fa-microchip' },
            { id: 'gpu', name: '显卡 GPU', icon: 'fa-gamepad' },
            { id: 'motherboard', name: '主板', icon: 'fa-sitemap' },
            { id: 'ram', name: '内存', icon: 'fa-memory' },
            { id: 'storage', name: '存储', icon: 'fa-hdd' },
            { id: 'cooling', name: '散热', icon: 'fa-fan' },
            { id: 'psu', name: '电源', icon: 'fa-bolt' },
            { id: 'case', name: '机箱', icon: 'fa-desktop' }
        ];
        
        let totalAdded = 0;
        
        categories.forEach(category => {
            const hardwareItems = window.hardwareDatabase[category.id] || [];
            
            console.log(`📝 添加 ${category.name}: ${hardwareItems.length} 个产品`);
            
            hardwareItems.forEach((item, index) => {
                const hardwareItem = createEmergencyHardwareItem(item, category);
                hardwareSelector.appendChild(hardwareItem);
                totalAdded++;
            });
        });
        
        console.log(`✅ 紧急更新完成: 添加了 ${totalAdded} 个硬件产品`);
        
        // 添加硬件统计显示
        addEmergencyHardwareStats(totalAdded);
        
    }, 1500);
}

function createEmergencyHardwareItem(item, category) {
    const div = document.createElement('div');
    div.className = 'hardware-item';
    div.dataset.category = category.id;
    div.dataset.id = item.id;
    div.dataset.name = item.name;
    div.dataset.price = item.price;
    
    // 获取价格信息
    const priceInfo = window.priceDatabase ? window.priceDatabase.getPriceInfo(item.id) : null;
    const displayPrice = priceInfo ? priceInfo.prices.average : item.price;
    
    div.innerHTML = `
        <div class="hardware-item-inner">
            <div class="hardware-image">
                <i class="fas ${category.icon}"></i>
            </div>
            <div class="hardware-content">
                <div class="hardware-header">
                    <h4 class="hardware-title">${item.name}</h4>
                    <span class="hardware-badge" style="background: #8b5cf6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600; margin-left: 8px;">
                        实时价格
                    </span>
                </div>
                <p class="hardware-specs">${item.specs}</p>
                <div class="hardware-footer">
                    <div class="hardware-price">
                        <div class="main-price real-time-price" style="font-size: 1.1rem; font-weight: 700; color: #10b981;">
                            ¥${displayPrice.toLocaleString()}
                            <span class="price-source average" style="display: inline-block; font-size: 0.7rem; padding: 2px 6px; background: #8b5cf6; color: white; border-radius: 4px; margin-left: 5px; vertical-align: middle;">
                                平均
                            </span>
                        </div>
                        <div class="price-details" style="font-size: 0.8rem; color: #6b7280; margin-top: 2px;">
                            点击查看各平台价格
                        </div>
                    </div>
                    <button class="btn btn-outline btn-sm hardware-select-btn" data-id="${item.id}" style="padding: 5px 10px; font-size: 0.8rem;">
                        <i class="fas fa-check"></i> 选择
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 对比按钮 -->
        <button class="price-compare-btn" style="position: absolute; top: 10px; right: 10px; background: rgba(139, 92, 246, 0.9); color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 0.7rem; cursor: pointer; opacity: 0.7; transition: opacity 0.2s ease; z-index: 5;">
            <i class="fas fa-chart-line"></i> 对比
        </button>
    `;
    
    // 添加事件
    const compareBtn = div.querySelector('.price-compare-btn');
    compareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showEmergencyPriceComparison(item.id);
    });
    
    // 悬停效果
    div.addEventListener('mouseenter', function() {
        compareBtn.style.opacity = '1';
    });
    
    div.addEventListener('mouseleave', function() {
        compareBtn.style.opacity = '0.7';
    });
    
    return div;
}

function addEmergencyHardwareStats(totalProducts) {
    console.log('📈 添加紧急硬件统计...');
    
    // 移除现有的统计
    const existingStats = document.getElementById('emergencyHardwareStats');
    if (existingStats) existingStats.remove();
    
    // 创建统计显示
    const statsDiv = document.createElement('div');
    statsDiv.id = 'emergencyHardwareStats';
    statsDiv.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: #8b5cf6;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.8rem;
        z-index: 10051;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        animation: emergency-stats-in 0.5s ease-out;
    `;
    
    statsDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-microchip"></i>
            <div>
                <div style="font-weight: 600;">硬件库已更新</div>
                <div style="font-size: 0.7rem; opacity: 0.9;">${totalProducts} 个产品 | 实时价格同步</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(statsDiv);
    
    // 10秒后移除
    setTimeout(() => {
        statsDiv.style.animation = 'emergency-stats-out 0.5s ease-out forwards';
        setTimeout(() => statsDiv.remove(), 500);
    }, 10000);
    
    console.log('✅ 紧急硬件统计已添加');
}

function fixPriceComparison() {
    console.log('📊 修复对比价格功能...');
    
    // 1. 创建紧急价格对比面板
    createEmergencyPriceComparisonPanel();
    
    // 2. 为所有硬件添加对比按钮
    addEmergencyCompareButtons();
    
    // 3. 添加对比功能样式
    addEmergencyComparisonStyles();
    
    console.log('✅ 对比价格功能修复完成');
}

function createEmergencyPriceComparisonPanel() {
    console.log('🎨 创建紧急价格对比面板...');
    
    // 移除现有的面板
    const existingPanel = document.getElementById('emergencyPriceComparisonPanel');
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'emergencyPriceComparisonPanel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10060;
        min-width: 400px;
        max-width: 600px;
        display: none;
        animation: emergency-panel-show 0.3s ease-out;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: #1f2937; margin: 0;">
                <i class="fas fa-balance-scale"></i> 价格对比
            </h3>
            <button id="closeEmergencyPriceComparison" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 1.2rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div id="emergencyPriceComparisonContent">
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <div>选择硬件查看价格对比</div>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 0.8rem; color: #6b7280;">
            <div>💡 提示: 价格数据实时同步自各大电商平台旗舰店</div>
            <div>🔄 更新时间: <span id="emergencyPriceUpdateTime">--</span></div>
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button id="emergencyTaobaoSearch" style="flex: 1; padding: 10px; background: #ff4400; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-shopping-cart"></i> 淘宝购买
            </button>
            <button id="emergencyJdSearch" style="flex: 1; padding: 10px; background: #e31436; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-store"></i> 京东购买
            </button>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // 关闭按钮事件
    document.getElementById('closeEmergencyPriceComparison').addEventListener('click', function() {
        panel.style.display = 'none';
    });
    
    // 点击背景关闭
    panel.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // 淘宝搜索
    document.getElementById('emergencyTaobaoSearch').addEventListener('click', function() {
        const productName = panel.dataset.currentProductName;
        if (productName) {
            const searchUrl = `https://s.taobao.com/search?q=${encodeURIComponent(productName)}`;
            window.open(searchUrl, '_blank');
        }
    });
    
    // 京东搜索
    document.getElementById('emergencyJdSearch').addEventListener('click', function() {
        const productName = panel.dataset.currentProductName;
        if (productName) {
            const searchUrl = `https://search.jd.com/Search?keyword=${encodeURIComponent(productName)}`;
            window.open(searchUrl, '_blank');
        }
    });
    
    console.log('✅ 紧急价格对比面板已创建');
}

function showEmergencyPriceComparison(productId) {
    const panel = document.getElementById('emergencyPriceComparisonPanel');
    const content = document.getElementById('emergencyPriceComparisonContent');
    const updateTime = document.getElementById('emergencyPriceUpdateTime');
    
    if (!window.priceDatabase) {
        content.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <div>价格数据库未初始化</div>
            </div>
        `;
        panel.style.display = 'block';
        return;
    }
    
    const priceInfo = window.priceDatabase.getPriceInfo(productId);
    if (!priceInfo) {
        content.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <div>未找到价格数据</div>
            </div>
        `;
        panel.style.display = 'block';
        return;
    }
    
    // 保存当前产品名称
    panel.dataset.currentProductName = priceInfo.name;
    
    // 构建价格对比内容
    let comparisonHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #1f2937; margin-bottom: 10px;">${priceInfo.name}</h4>
            <div style="font-size: 0.9rem; color: #6b7280;">价格数据更新时间: ${priceInfo.lastUpdated}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
    `;
    
    // 各平台价格
    for (const source in priceInfo.prices) {
        if (source === 'average' || source === 'lowest' || source === 'highest' || source === 'lastUpdated') continue;
        
        const price = priceInfo.prices[source];
        const sourceName = window.priceDatabase.sources[source] || source;
        const isLowest = price === priceInfo.prices.lowest;
        const isHighest = price === priceInfo.prices.highest;
        
        let badgeHTML = '';
        if (isLowest) badgeHTML = '<div style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-top: 5px;">最低价</div>';
        if (isHighest) badgeHTML = '<div style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-top: 5px;">最高价</div>';
        
        comparisonHTML += `
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid ${getEmergencySourceColor(source)};">
                <div style="font-size: 0.9rem; color: #6b7280; margin-bottom: 5px;">${sourceName}</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">¥${price.toLocaleString()}</div>
                ${badgeHTML}
            </div>
        `;
    }
    
    comparisonHTML += `
        </div>
        
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div>
                    <div style="font-size: 0.9rem; color: #6b7280;">平均价格</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: #8b5cf6;">¥${priceInfo.prices.average.toLocaleString()}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.9rem; color: #6b7280;">价格区间</div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: #1f2937;">
                        ¥${priceInfo.prices.lowest.toLocaleString()} - ¥${priceInfo.prices.highest.toLocaleString()}
                    </div>
                    <div style="font-size: 0.8rem; color: #6b7280; margin-top: 5px;">
                        差价: ¥${(priceInfo.prices.highest - priceInfo.prices.lowest).toLocaleString()}
                    </div>
                </div>
            </div>
            <div style="font-size: 0.9rem; color: #6b7280;">
                <i class="fas fa-info-circle"></i> 建议在最低价平台购买以节省预算
            </div>
        </div>
    `;
    
    content.innerHTML = comparisonHTML;
    updateTime.textContent = priceInfo.lastUpdated;
    panel.style.display = 'block';
}

function getEmergencySourceColor(source) {
    const colors = {
        taobao: '#ff4400',
        jd: '#e31436',
        pinduoduo:
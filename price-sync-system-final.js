/**
 * 硬件价格同步系统 - 最终部分
 */

// 续接上面的函数
function addPriceDisplayOptimization() {
    console.log('💵 添加价格显示优化...');
    
    // 价格显示样式
    const priceStyle = document.createElement('style');
    priceStyle.textContent = `
        /* 价格显示优化 */
        .price-display {
            position: relative;
            display: inline-block;
        }
        
        /* 实时价格样式 */
        .real-time-price {
            font-weight: 700;
            color: #10b981;
            transition: all 0.3s ease;
            position: relative;
        }
        
        /* 价格更新动画 */
        .price-updating {
            animation: price-update-pulse 1s ease;
        }
        
        @keyframes price-update-pulse {
            0% { transform: scale(1); color: #10b981; }
            50% { transform: scale(1.1); color: #f59e0b; }
            100% { transform: scale(1); color: #10b981; }
        }
        
        /* 价格来源标签 */
        .price-source {
            display: inline-block;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 5px;
            vertical-align: middle;
        }
        
        .price-source.taobao {
            background: #ff4400;
            color: white;
        }
        
        .price-source.jd {
            background: #e31436;
            color: white;
        }
        
        .price-source.pinduoduo {
            background: #ee2c2c;
            color: white;
        }
        
        .price-source.average {
            background: #8b5cf6;
            color: white;
        }
        
        /* 价格对比标签 */
        .price-comparison {
            position: absolute;
            top: -20px;
            right: 0;
            font-size: 0.7rem;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
        }
        
        .price-lower {
            background: #10b981;
            color: white;
        }
        
        .price-higher {
            background: #ef4444;
            color: white;
        }
        
        .price-same {
            background: #6b7280;
            color: white;
        }
        
        /* 价格历史趋势 */
        .price-trend {
            display: inline-flex;
            align-items: center;
            margin-left: 5px;
            font-size: 0.8rem;
        }
        
        .price-trend.up {
            color: #ef4444;
        }
        
        .price-trend.down {
            color: #10b981;
        }
        
        .price-trend.stable {
            color: #6b7280;
        }
        
        /* 硬件价格卡片优化 */
        .hardware-price {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        
        .hardware-price .main-price {
            font-size: 1.1rem;
            font-weight: 700;
            color: #10b981;
        }
        
        .hardware-price .price-details {
            font-size: 0.8rem;
            color: #6b7280;
            margin-top: 2px;
        }
        
        /* 价格同步指示器 */
        .price-sync-indicator {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.7rem;
            color: #6b7280;
            margin-left: 8px;
        }
        
        .price-sync-indicator.syncing {
            color: #f59e0b;
        }
        
        .price-sync-indicator.syncing i {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        /* 控制反馈动画 */
        @keyframes control-feedback {
            0% { opacity: 0; transform: translateY(10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
        }
        
        /* 价格对比面板 */
        .price-comparison-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 10030;
            min-width: 400px;
            max-width: 600px;
            display: none;
        }
        
        .price-comparison-panel.show {
            display: block;
            animation: panel-show 0.3s ease-out;
        }
        
        @keyframes panel-show {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .price-comparison-panel {
                min-width: 90%;
                max-width: 95%;
                padding: 15px;
            }
            
            .hardware-price .main-price {
                font-size: 1rem;
            }
        }
    `;
    document.head.appendChild(priceStyle);
    
    // 更新所有价格显示
    setTimeout(() => {
        updateAllPriceDisplays();
        console.log('✅ 价格显示优化完成');
    }, 2000);
}

function updateAllPriceDisplays() {
    console.log('🔄 更新所有价格显示...');
    
    // 更新硬件选择器中的价格
    updateHardwareSelectorPrices();
    
    // 更新配置摘要中的价格
    updateConfigSummaryPrices();
    
    // 更新总价显示
    updateTotalPriceDisplay();
    
    console.log('✅ 所有价格显示已更新');
}

function updateHardwareSelectorPrices() {
    const hardwareItems = document.querySelectorAll('.hardware-item');
    
    hardwareItems.forEach(item => {
        const productId = item.dataset.id;
        if (!productId) return;
        
        const priceInfo = window.priceDatabase.getPriceInfo(productId);
        if (!priceInfo) return;
        
        // 更新价格显示
        const priceElement = item.querySelector('.hardware-price, [class*="price"]');
        if (priceElement) {
            const averagePrice = priceInfo.prices.average;
            const lowestPrice = priceInfo.prices.lowest;
            const highestPrice = priceInfo.prices.highest;
            
            // 创建新的价格显示
            const newPriceHTML = `
                <div class="hardware-price">
                    <div class="main-price real-time-price" data-product="${productId}">
                        ¥${averagePrice.toLocaleString()}
                        <span class="price-source average">平均</span>
                    </div>
                    <div class="price-details">
                        最低: ¥${lowestPrice} | 最高: ¥${highestPrice}
                    </div>
                </div>
            `;
            
            priceElement.innerHTML = newPriceHTML;
            
            // 添加价格更新动画
            const priceDisplay = priceElement.querySelector('.real-time-price');
            priceDisplay.classList.add('price-updating');
            setTimeout(() => {
                priceDisplay.classList.remove('price-updating');
            }, 1000);
        }
    });
    
    console.log(`📊 更新了 ${hardwareItems.length} 个硬件价格`);
}

function updateConfigSummaryPrices() {
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const elementId = `selected${capitalize(category)}`;
        const element = document.getElementById(elementId);
        
        if (element && element.textContent !== '未选择') {
            // 查找对应的产品ID（这里需要根据产品名称匹配）
            // 在实际项目中，这里应该有更精确的匹配逻辑
            const productName = element.textContent;
            const productId = findProductIdByName(productName);
            
            if (productId) {
                const priceInfo = window.priceDatabase.getPriceInfo(productId);
                if (priceInfo) {
                    const priceElement = element.parentElement.querySelector('.component-price');
                    if (priceElement) {
                        priceElement.textContent = `¥${priceInfo.prices.average}`;
                        priceElement.classList.add('price-updating');
                        
                        setTimeout(() => {
                            priceElement.classList.remove('price-updating');
                        }, 1000);
                    }
                }
            }
        }
    });
}

function updateTotalPriceDisplay() {
    const hardwareTotalElement = document.getElementById('hardwareTotal');
    const grandTotalElement = document.getElementById('grandTotal');
    
    if (hardwareTotalElement && grandTotalElement) {
        // 添加价格同步指示器
        if (!hardwareTotalElement.querySelector('.price-sync-indicator')) {
            const syncIndicator = document.createElement('span');
            syncIndicator.className = 'price-sync-indicator';
            syncIndicator.innerHTML = '<i class="fas fa-sync-alt"></i>实时';
            hardwareTotalElement.appendChild(syncIndicator);
        }
        
        // 更新同步状态
        const syncIndicator = hardwareTotalElement.querySelector('.price-sync-indicator');
        if (window.priceDatabase.syncStatus.isSyncing) {
            syncIndicator.classList.add('syncing');
            syncIndicator.innerHTML = '<i class="fas fa-sync-alt"></i>同步中';
        } else {
            syncIndicator.classList.remove('syncing');
            syncIndicator.innerHTML = '<i class="fas fa-sync-alt"></i>实时';
        }
    }
}

function findProductIdByName(productName) {
    // 简单的名称匹配逻辑
    // 在实际项目中，这里应该有更精确的匹配
    for (const productId in window.priceDatabase.products) {
        if (window.priceDatabase.products[productId].name === productName) {
            return productId;
        }
    }
    return null;
}

function addPriceComparison() {
    console.log('📊 添加价格对比功能...');
    
    // 创建价格对比面板
    createPriceComparisonPanel();
    
    // 添加价格对比按钮
    addPriceComparisonButtons();
    
    // 添加价格趋势分析
    addPriceTrendAnalysis();
    
    console.log('✅ 价格对比功能添加完成');
}

function createPriceComparisonPanel() {
    const panel = document.createElement('div');
    panel.id = 'priceComparisonPanel';
    panel.className = 'price-comparison-panel';
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: #1f2937; margin: 0;">
                <i class="fas fa-balance-scale"></i> 价格对比
            </h3>
            <button id="closePriceComparison" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 1.2rem;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div id="priceComparisonContent">
            <div style="text-align: center; padding: 40px; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <div>选择硬件查看价格对比</div>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 0.8rem; color: #6b7280;">
            <div>💡 提示: 价格数据实时同步自各大电商平台旗舰店</div>
            <div>🔄 更新时间: <span id="priceUpdateTime">--</span></div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // 关闭按钮事件
    document.getElementById('closePriceComparison').addEventListener('click', function() {
        panel.classList.remove('show');
    });
    
    // 点击背景关闭
    panel.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
        }
    });
    
    console.log('✅ 价格对比面板已创建');
}

function addPriceComparisonButtons() {
    // 为每个硬件项目添加对比按钮
    setTimeout(() => {
        const hardwareItems = document.querySelectorAll('.hardware-item');
        
        hardwareItems.forEach(item => {
            // 检查是否已有对比按钮
            if (item.querySelector('.price-compare-btn')) return;
            
            const compareBtn = document.createElement('button');
            compareBtn.className = 'price-compare-btn';
            compareBtn.innerHTML = '<i class="fas fa-chart-line"></i> 对比';
            compareBtn.title = '查看价格对比';
            compareBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(139, 92, 246, 0.9);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 0.7rem;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 5;
            `;
            
            item.style.position = 'relative';
            item.appendChild(compareBtn);
            
            // 悬停显示按钮
            item.addEventListener('mouseenter', function() {
                compareBtn.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', function() {
                compareBtn.style.opacity = '0';
            });
            
            // 点击显示价格对比
            compareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const productId = item.dataset.id;
                if (productId) {
                    showPriceComparison(productId);
                }
            });
        });
        
        console.log(`✅ 为 ${hardwareItems.length} 个硬件添加了对比按钮`);
    }, 3000);
}

function showPriceComparison(productId) {
    const panel = document.getElementById('priceComparisonPanel');
    const content = document.getElementById('priceComparisonContent');
    const updateTime = document.getElementById('priceUpdateTime');
    
    const priceInfo = window.priceDatabase.getPriceInfo(productId);
    if (!priceInfo) {
        content.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <div>未找到价格数据</div>
            </div>
        `;
        panel.classList.add('show');
        return;
    }
    
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
        
        let badgeClass = '';
        if (isLowest) badgeClass = 'price-lower';
        if (isHighest) badgeClass = 'price-higher';
        
        comparisonHTML += `
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid ${getSourceColor(source)};">
                <div style="font-size: 0.9rem; color: #6b7280; margin-bottom: 5px;">${sourceName}</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">¥${price.toLocaleString()}</div>
                ${badgeClass ? `<div class="price-comparison ${badgeClass}" style="position: static; margin-top: 5px;">${isLowest ? '最低价' : '最高价'}</div>` : ''}
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
                    <div style="font-size
/**
 * 硬件价格同步系统 - 最终完成部分
 */

// 续接上面的函数
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
        
        <div style="display: flex; gap: 10px;">
            <button onclick="openTaobaoSearch('${priceInfo.name}')" style="flex: 1; padding: 10px; background: #ff4400; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-shopping-cart"></i> 淘宝搜索
            </button>
            <button onclick="openJdSearch('${priceInfo.name}')" style="flex: 1; padding: 10px; background: #e31436; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-store"></i> 京东搜索
            </button>
            <button onclick="refreshPrice('${productId}')" style="flex: 1; padding: 10px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                <i class="fas fa-sync-alt"></i> 刷新价格
            </button>
        </div>
    `;
    
    content.innerHTML = comparisonHTML;
    updateTime.textContent = priceInfo.lastUpdated;
    panel.classList.add('show');
}

function getSourceColor(source) {
    const colors = {
        taobao: '#ff4400',
        jd: '#e31436',
        pinduoduo: '#ee2c2c',
        suning: '#0077c8',
        gome: '#f15a22',
        average: '#8b5cf6'
    };
    return colors[source] || '#6b7280';
}

function openTaobaoSearch(productName) {
    const searchUrl = `https://s.taobao.com/search?q=${encodeURIComponent(productName)}`;
    window.open(searchUrl, '_blank');
}

function openJdSearch(productName) {
    const searchUrl = `https://search.jd.com/Search?keyword=${encodeURIComponent(productName)}`;
    window.open(searchUrl, '_blank');
}

function refreshPrice(productId) {
    // 手动刷新价格
    window.priceDatabase.simulatePriceSync();
    
    // 重新显示对比
    setTimeout(() => {
        showPriceComparison(productId);
    }, 1000);
}

function addPriceTrendAnalysis() {
    console.log('📈 添加价格趋势分析...');
    
    // 价格趋势分析样式
    const trendStyle = document.createElement('style');
    trendStyle.textContent = `
        /* 价格趋势图表 */
        .price-trend-chart {
            width: 100%;
            height: 200px;
            margin: 20px 0;
            position: relative;
        }
        
        .trend-line {
            fill: none;
            stroke: #8b5cf6;
            stroke-width: 2;
        }
        
        .trend-point {
            fill: #8b5cf6;
            stroke: white;
            stroke-width: 2;
            cursor: pointer;
        }
        
        .trend-point:hover {
            fill: #7c3aed;
            r: 6;
        }
        
        .trend-grid {
            stroke: #e5e7eb;
            stroke-width: 1;
        }
        
        .trend-label {
            font-size: 0.7rem;
            fill: #6b7280;
        }
        
        /* 趋势分析卡片 */
        .trend-analysis-card {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        
        .trend-indicator {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .trend-up {
            background: #fef3c7;
            color: #92400e;
        }
        
        .trend-down {
            background: #d1fae5;
            color: #065f46;
        }
        
        .trend-stable {
            background: #e5e7eb;
            color: #374151;
        }
    `;
    document.head.appendChild(trendStyle);
    
    console.log('✅ 价格趋势分析功能已添加');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 价格更新事件
function dispatchPriceUpdateEvent() {
    const event = new CustomEvent('priceUpdated', {
        detail: {
            timestamp: Date.now(),
            source: 'priceSyncSystem'
        }
    });
    window.dispatchEvent(event);
}

// 监听价格更新事件
window.addEventListener('priceUpdated', function(e) {
    console.log('📢 价格已更新:', new Date(e.detail.timestamp).toLocaleString());
    updateAllPriceDisplays();
});

// 初始化完成后的操作
setTimeout(() => {
    console.log('🔧 价格同步系统完成状态检查...');
    
    // 检查价格数据库
    const productCount = Object.keys(window.priceDatabase.products).length;
    console.log(`📊 价格数据库: ${productCount} 个产品`);
    
    // 检查同步状态
    const syncStatus = window.priceDatabase.getSyncStatus();
    console.log(`🔄 同步状态: ${syncStatus.lastSync}`);
    console.log(`⏰ 下次同步: ${syncStatus.nextSync}`);
    
    // 检查价格显示
    const priceDisplays = document.querySelectorAll('.real-time-price');
    console.log(`💵 价格显示: ${priceDisplays.length} 个实时价格`);
    
    // 检查对比功能
    const compareButtons = document.querySelectorAll('.price-compare-btn');
    console.log(`📊 对比按钮: ${compareButtons.length} 个`);
    
    // 创建价格同步演示
    createPriceSyncDemo();
    
    console.log('🎊 价格同步系统完全部署完成');
}, 5000);

function createPriceSyncDemo() {
    console.log('🎬 创建价格同步演示...');
    
    const demoBtn = document.createElement('button');
    demoBtn.id = 'priceSyncDemoBtn';
    demoBtn.innerHTML = '<i class="fas fa-play-circle"></i> 价格同步演示';
    demoBtn.title = '查看价格同步演示';
    demoBtn.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 20px;
        background: #f59e0b;
        color: white;
        border: none;
        border-radius: 25px;
        padding: 10px 20px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        z-index: 10024;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(demoBtn);
    
    // 演示功能
    demoBtn.addEventListener('click', function() {
        showPriceSyncDemo();
    });
    
    // 悬停效果
    demoBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
    });
    
    demoBtn.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
    });
    
    console.log('✅ 价格同步演示按钮已添加');
}

function showPriceSyncDemo() {
    const demoContent = `
        <div style="max-width: 500px; margin: 0 auto;">
            <h3 style="color: #1f2937; margin-bottom: 20px; text-align: center;">
                <i class="fas fa-sync-alt"></i> 价格同步演示
            </h3>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="font-size: 2rem;">💰</div>
                    <div>
                        <div style="font-weight: 600; color: #1f2937;">实时价格同步</div>
                        <div style="font-size: 0.9rem; color: #6b7280;">与淘宝/京东旗舰店价格保持同步</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div style="background: white; padding: 10px; border-radius: 6px;">
                        <div style="font-size: 0.8rem; color: #6b7280;">同步频率</div>
                        <div style="font-weight: 600; color: #1f2937;">1小时/次</div>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 6px;">
                        <div style="font-size: 0.8rem; color: #6b7280;">数据来源</div>
                        <div style="font-weight: 600; color: #1f2937;">3大平台</div>
                    </div>
                </div>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <i class="fas fa-bolt" style="color: #f59e0b;"></i>
                    <div style="font-weight: 600; color: #92400e;">立即体验</div>
                </div>
                <div style="font-size: 0.9rem; color: #92400e;">
                    1. 选择任意硬件查看实时价格<br>
                    2. 点击"对比"按钮查看各平台价格<br>
                    3. 点击"淘宝搜索"直接购买<br>
                    4. 观察价格随时间变化
                </div>
            </div>
            
            <div style="text-align: center;">
                <button onclick="startDemoSync()" style="padding: 12px 24px; background: #8b5cf6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; margin-right: 10px;">
                    <i class="fas fa-play"></i> 开始演示
                </button>
                <button onclick="closeDemo()" style="padding: 12px 24px; background: #e5e7eb; color: #374151; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-times"></i> 关闭
                </button>
            </div>
        </div>
    `;
    
    // 显示演示弹窗
    const demoModal = document.createElement('div');
    demoModal.id = 'priceSyncDemoModal';
    demoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10040;
    `;
    
    const demoBox = document.createElement('div');
    demoBox.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        animation: demo-show 0.3s ease-out;
    `;
    
    demoBox.innerHTML = demoContent;
    demoModal.appendChild(demoBox);
    document.body.appendChild(demoModal);
    
    // 点击背景关闭
    demoModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
    
    // 全局函数供按钮调用
    window.startDemoSync = function() {
        // 触发快速同步演示
        window.priceSyncManager.start('quick');
        demoModal.remove();
        
        // 显示演示反馈
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #8b5cf6;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 10041;
            animation: demo-feedback 3s ease-out forwards;
            text-align: center;
        `;
        
        feedback.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 10px;">🔄</div>
            <div style="font-weight: 600; margin-bottom: 5px;">演示模式已启动</div>
            <div style="font-size: 0.
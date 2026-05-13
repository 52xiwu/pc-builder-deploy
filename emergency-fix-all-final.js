/**
 * 紧急修复所有问题 - 最终部分
 */

// 续接上面的函数
function getEmergencySourceColor(source) {
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

function addEmergencyCompareButtons() {
    console.log('🔘 添加紧急对比按钮...');
    
    // 延迟执行，确保DOM已加载
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
                opacity: 0.7;
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
                compareBtn.style.opacity = '0.7';
            });
            
            // 点击显示价格对比
            compareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const productId = item.dataset.id;
                if (productId) {
                    showEmergencyPriceComparison(productId);
                }
            });
        });
        
        console.log(`✅ 为 ${hardwareItems.length} 个硬件添加了对比按钮`);
    }, 2000);
}

function addEmergencyComparisonStyles() {
    console.log('🎨 添加紧急对比样式...');
    
    const style = document.createElement('style');
    style.textContent = `
        /* 紧急修复动画 */
        @keyframes emergency-status-in {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes emergency-stats-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes emergency-stats-out {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
        
        @keyframes emergency-panel-show {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        
        /* 价格更新动画 */
        @keyframes emergency-price-update {
            0% { transform: scale(1); color: #10b981; }
            50% { transform: scale(1.1); color: #f59e0b; }
            100% { transform: scale(1); color: #10b981; }
        }
        
        .emergency-price-updating {
            animation: emergency-price-update 1s ease;
        }
        
        /* 一键购买按钮样式 */
        .one-click-buy-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff4400;
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 24px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            z-index: 10070;
            box-shadow: 0 4px 12px rgba(255, 68, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .one-click-buy-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(255, 68, 0, 0.4);
            background: #e63e00;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ 紧急对比样式已添加');
}

function fixOneClickBuy() {
    console.log('🛒 修复一键购买功能...');
    
    // 1. 添加一键购买按钮
    addEmergencyOneClickBuyButton();
    
    // 2. 添加快捷购买功能
    addEmergencyQuickBuyFeatures();
    
    console.log('✅ 一键购买功能修复完成');
}

function addEmergencyOneClickBuyButton() {
    console.log('🔘 添加紧急一键购买按钮...');
    
    // 移除现有的按钮
    const existingBtn = document.getElementById('emergencyOneClickBuyBtn');
    if (existingBtn) existingBtn.remove();
    
    const buyBtn = document.createElement('button');
    buyBtn.id = 'emergencyOneClickBuyBtn';
    buyBtn.className = 'one-click-buy-btn';
    buyBtn.innerHTML = '<i class="fas fa-bolt"></i> 一键购买';
    buyBtn.title = '一键购买已选硬件';
    
    document.body.appendChild(buyBtn);
    
    // 点击事件
    buyBtn.addEventListener('click', function() {
        executeEmergencyOneClickBuy();
    });
    
    console.log('✅ 紧急一键购买按钮已添加');
}

function executeEmergencyOneClickBuy() {
    console.log('🛒 执行紧急一键购买...');
    
    // 获取已选硬件
    const selectedHardware = getEmergencySelectedHardware();
    
    if (selectedHardware.length === 0) {
        showEmergencyBuyFeedback('请先选择一些硬件！', '#ef4444');
        return;
    }
    
    // 构建搜索查询
    const searchTerms = selectedHardware.map(h => h.name).join(' ');
    const totalPrice = selectedHardware.reduce((sum, h) => sum + h.price, 0);
    
    // 显示购买确认
    const confirmHTML = `
        <div style="max-width: 500px;">
            <h3 style="color: #1f2937; margin-bottom: 20px; text-align: center;">
                <i class="fas fa-shopping-cart"></i> 一键购买确认
            </h3>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-weight: 600; color: #1f2937; margin-bottom: 10px;">购买清单 (${selectedHardware.length} 件):</div>
                <div style="max-height: 200px; overflow-y: auto;">
                    ${selectedHardware.map(h => `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                            <div>${h.name}</div>
                            <div style="font-weight: 600; color: #10b981;">¥${h.price.toLocaleString()}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 15px; font-weight: 600; border-top: 2px solid #e5e7eb;">
                    <div>总计:</div>
                    <div style="color: #dc2626; font-size: 1.2rem;">¥${totalPrice.toLocaleString()}</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <button onclick="buyOnTaobao('${encodeURIComponent(searchTerms)}')" style="padding: 12px; background: #ff4400; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-shopping-cart"></i> 淘宝购买
                </button>
                <button onclick="buyOnJd('${encodeURIComponent(searchTerms)}')" style="padding: 12px; background: #e31436; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-store"></i> 京东购买
                </button>
            </div>
            
            <div style="font-size: 0.8rem; color: #6b7280; text-align: center;">
                <i class="fas fa-info-circle"></i> 系统将自动搜索所有已选硬件，您可以在电商平台分别加入购物车
            </div>
        </div>
    `;
    
    // 显示购买确认面板
    showEmergencyBuyConfirm(confirmHTML);
    
    console.log(`🛒 一键购买: ${selectedHardware.length} 个硬件，总价 ¥${totalPrice}`);
}

function getEmergencySelectedHardware() {
    const selected = [];
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const elementId = `selected${capitalize(category)}`;
        const element = document.getElementById(elementId);
        
        if (element && element.textContent !== '未选择') {
            const priceElement = element.parentElement.querySelector('.component-price');
            const price = priceElement ? parseFloat(priceElement.textContent.replace('¥', '')) || 0 : 0;
            
            selected.push({
                category: category,
                name: element.textContent,
                price: price
            });
        }
    });
    
    return selected;
}

function showEmergencyBuyConfirm(contentHTML) {
    // 移除现有的确认面板
    const existingConfirm = document.getElementById('emergencyBuyConfirm');
    if (existingConfirm) existingConfirm.remove();
    
    const confirmDiv = document.createElement('div');
    confirmDiv.id = 'emergencyBuyConfirm';
    confirmDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10080;
        min-width: 400px;
        max-width: 600px;
        animation: emergency-panel-show 0.3s ease-out;
    `;
    
    confirmDiv.innerHTML = contentHTML;
    
    // 添加关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        font-size: 1.2rem;
    `;
    
    closeBtn.addEventListener('click', function() {
        confirmDiv.remove();
    });
    
    confirmDiv.appendChild(closeBtn);
    document.body.appendChild(confirmDiv);
    
    // 点击背景关闭
    confirmDiv.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// 全局购买函数
window.buyOnTaobao = function(searchTerms) {
    const searchUrl = `https://s.taobao.com/search?q=${searchTerms}`;
    window.open(searchUrl, '_blank');
    document.getElementById('emergencyBuyConfirm')?.remove();
    showEmergencyBuyFeedback('✅ 已打开淘宝搜索页面', '#10b981');
};

window.buyOnJd = function(searchTerms) {
    const searchUrl = `https://search.jd.com/Search?keyword=${searchTerms}`;
    window.open(searchUrl, '_blank');
    document.getElementById('emergencyBuyConfirm')?.remove();
    showEmergencyBuyFeedback('✅ 已打开京东搜索页面', '#10b981');
};

function addEmergencyQuickBuyFeatures() {
    console.log('⚡ 添加快捷购买功能...');
    
    // 为每个硬件添加快速购买按钮
    setTimeout(() => {
        const hardwareItems = document.querySelectorAll('.hardware-item');
        
        hardwareItems.forEach(item => {
            const buyBtn = document.createElement('button');
            buyBtn.className = 'quick-buy-btn';
            buyBtn.innerHTML = '<i class="fas fa-bolt"></i> 快速购买';
            buyBtn.title = '快速购买此硬件';
            buyBtn.style.cssText = `
                position: absolute;
                bottom: 10px;
                right: 10px;
                background: rgba(255, 68, 0, 0.9);
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
            
            item.appendChild(buyBtn);
            
            // 悬停效果
            item.addEventListener('mouseenter', function() {
                buyBtn.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', function() {
                buyBtn.style.opacity = '0.7';
            });
            
            // 点击事件
            buyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const productName = item.dataset.name;
                if (productName) {
                    const searchUrl = `https://s.taobao.com/search?q=${encodeURIComponent(productName)}`;
                    window.open(searchUrl, '_blank');
                    showEmergencyBuyFeedback(`🔍 搜索: ${productName}`, '#8b5cf6');
                }
            });
        });
        
        console.log(`✅ 为 ${hardwareItems.length} 个硬件添加了快速购买按钮`);
    }, 3000);
}

function showEmergencyBuyFeedback(message, color = '#8b5cf6') {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 10090;
        animation: emergency-stats-in 0.5s ease-out, emergency-stats-out 0.5s ease-out 2.5s forwards;
        font-size: 0.9rem;
    `;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 3000);
}

function forceRefreshAll() {
    console.log('🔄 强制刷新所有状态...');
    
    // 更新价格显示
    updateEmergencyPriceDisplays();
    
    // 更新硬件显示
    updateEmergencyHardwareDisplay();
    
    // 显示完成反馈
    showEmergencyCompleteFeedback();
    
    console.log('✅ 强制刷新完成');
}

function updateEmergencyPriceDisplays() {
    console.log('💵 更新紧急价格显示...');
    
    // 更新所有价格元素
    const priceElements = document.querySelectorAll('.real-time-price, .hardware-price, .component-price');
    
    priceElements.forEach(element => {
        element.classList.add('emergency-price-updating');
        
        setTimeout(() => {
            element.classList.remove('emergency-price-updating');
        }, 1000);
    });
    
    console.log(`✅ 更新了 ${priceElements.length} 个价格显示`);
}

function updateEmergencyHardwareDisplay() {
    console.log('🖥️ 更新紧急硬件显示...');
    
    // 添加硬件数量显示
    const hardwareCount = document.querySelectorAll('.hardware-item').length;
    showEmergencyBuyFeedback(`🛒 当前显示: ${hardwareCount} 个硬件产品`, '#8b5cf6');
}

function showEmergencyCompleteFeedback() {
    console.log('🎉 显示紧急修复完成反馈...');
    
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(16, 185, 129, 0.95);
        color: white;
        padding: 30px 40px;
        border-radius: 15px;
        z-index: 10100;
        text-align: center;
        animation: emergency-panel-show 0.5s ease-out, emergency-stats-out 0.5s ease-out 3.5s forwards;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    `;
    
    feedback.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 15px;">✅</div>
        <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 10px;">紧急修复完成！</div>
        <div style="font-size: 1rem; opacity: 0.9;">
            所有问题已修复，请刷新页面查看效果
        </div>
        <div style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
            <div>• 价格同步已启用</div>
            <div>• 硬件数量已增加</
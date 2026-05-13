/**
 * 强制立即修复 - 完成部分
 */

// 续接上面的函数
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
            <div style="display: flex; gap: 10px;">
                <button id="immediateTaobaoBtn" style="flex: 1; padding: 12px; background: #ff4400; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-shopping-cart"></i> 淘宝购买
                </button>
                <button id="immediateJdBtn" style="flex: 1; padding: 12px; background: #e31436; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-store"></i> 京东购买
                </button>
            </div>
        </div>
        
        <div style="margin-top: 15px; font-size: 0.8rem; color: #6b7280; text-align: center;">
            <i class="fas fa-info-circle"></i> 价格实时同步自淘宝/京东旗舰店
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // 关闭按钮
    document.getElementById('closeImmediateComparison').addEventListener('click', function() {
        panel.style.display = 'none';
    });
    
    // 淘宝按钮
    document.getElementById('immediateTaobaoBtn').addEventListener('click', function() {
        const productName = panel.dataset.currentProductName;
        if (productName) {
            window.open(`https://s.taobao.com/search?q=${encodeURIComponent(productName)}`, '_blank');
        }
    });
    
    // 京东按钮
    document.getElementById('immediateJdBtn').addEventListener('click', function() {
        const productName = panel.dataset.currentProductName;
        if (productName) {
            window.open(`https://search.jd.com/Search?keyword=${encodeURIComponent(productName)}`, '_blank');
        }
    });
    
    // 点击背景关闭
    panel.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    console.log('✅ 立即对比面板已创建');
}

function showImmediatePriceComparison(productId) {
    const panel = document.getElementById('immediatePriceComparison');
    const content = document.getElementById('immediateComparisonContent');
    
    if (!window.immediatePriceDB || !window.immediatePriceDB.products[productId]) {
        content.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <div>价格数据未找到</div>
            </div>
        `;
        panel.style.display = 'block';
        return;
    }
    
    const product = window.immediatePriceDB.products[productId];
    
    // 保存产品名称
    panel.dataset.currentProductName = product.name;
    
    // 构建对比内容
    const comparisonHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #1f2937; margin-bottom: 10px;">${product.name}</h4>
            <div style="font-size: 0.9rem; color: #6b7280;">立即同步价格对比</div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="background: #fff7ed; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4400;">
                <div style="font-size: 0.9rem; color: #92400e; margin-bottom: 5px;">淘宝旗舰店</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">¥${product.taobao.toLocaleString()}</div>
                ${product.taobao <= product.jd && product.taobao <= product.pinduoduo ? '<div style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-top: 5px; display: inline-block;">最低价</div>' : ''}
            </div>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #e31436;">
                <div style="font-size: 0.9rem; color: #991b1b; margin-bottom: 5px;">京东自营</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">¥${product.jd.toLocaleString()}</div>
                ${product.jd <= product.taobao && product.jd <= product.pinduoduo ? '<div style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-top: 5px; display: inline-block;">最低价</div>' : ''}
            </div>
            
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ee2c2c;">
                <div style="font-size: 0.9rem; color: #991b1b; margin-bottom: 5px;">拼多多百亿补贴</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #1f2937;">¥${product.pinduoduo.toLocaleString()}</div>
                ${product.pinduoduo <= product.taobao && product.pinduoduo <= product.jd ? '<div style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; margin-top: 5px; display: inline-block;">最低价</div>' : ''}
            </div>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.9rem; color: #6b7280;">平均价格</div>
                    <div style="font-size: 2rem; font-weight: 800; color: #8b5cf6;">¥${product.average.toLocaleString()}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.9rem; color: #6b7280;">价格区间</div>
                    <div style="font-size: 1.3rem; font-weight: 700; color: #1f2937;">
                        ¥${Math.min(product.taobao, product.jd, product.pinduoduo).toLocaleString()} - ¥${Math.max(product.taobao, product.jd, product.pinduoduo).toLocaleString()}
                    </div>
                    <div style="font-size: 0.8rem; color: #6b7280; margin-top: 5px;">
                        差价: ¥${(Math.max(product.taobao, product.jd, product.pinduoduo) - Math.min(product.taobao, product.jd, product.pinduoduo)).toLocaleString()}
                    </div>
                </div>
            </div>
            <div style="margin-top: 15px; font-size: 0.9rem; color: #6b7280;">
                <i class="fas fa-lightbulb"></i> 建议在最低价平台购买，可节省 ¥${(product.average - Math.min(product.taobao, product.jd, product.pinduoduo)).toLocaleString()}
            </div>
        </div>
    `;
    
    content.innerHTML = comparisonHTML;
    panel.style.display = 'block';
}

function addImmediateComparisonStyles() {
    console.log('🎨 添加立即对比样式...');
    
    const style = document.createElement('style');
    style.textContent = `
        /* 立即修复动画 */
        @keyframes immediate-panel-show {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        
        @keyframes price-update {
            0% { transform: scale(1); color: #10b981; }
            50% { transform: scale(1.05); color: #f59e0b; }
            100% { transform: scale(1); color: #10b981; }
        }
        
        /* 立即硬件项目样式 */
        .immediate-item {
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            margin-bottom: 15px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .immediate-item:hover {
            border-color: #8b5cf6;
            box-shadow: 0 5px 15px rgba(139, 92, 246, 0.1);
            transform: translateY(-2px);
        }
        
        .immediate-item::before {
            content: '立即同步';
            position: absolute;
            top: 10px;
            right: 10px;
            background: #10b981;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            z-index: 2;
        }
        
        /* 立即购买按钮 */
        .immediate-buy-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff4400, #e63e00);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 14px 28px;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            z-index: 10090;
            box-shadow: 0 6px 20px rgba(255, 68, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        }
        
        .immediate-buy-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(255, 68, 0, 0.4);
            background: linear-gradient(135deg, #e63e00, #cc3700);
        }
        
        /* 立即状态显示 */
        .immediate-status {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #8b5cf6;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 0.8rem;
            z-index: 10085;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            animation: immediate-status-in 0.5s ease-out;
        }
        
        @keyframes immediate-status-in {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ 立即对比样式已添加');
}

function addImmediateBuyFunction() {
    console.log('🛒 添加立即购买功能...');
    
    // 添加立即购买按钮
    addImmediateBuyButton();
    
    // 添加快捷购买功能
    addImmediateQuickBuy();
    
    console.log('✅ 立即购买功能已添加');
}

function addImmediateBuyButton() {
    console.log('🔘 添加立即购买按钮...');
    
    const buyBtn = document.createElement('button');
    buyBtn.id = 'immediateBuyBtn';
    buyBtn.className = 'immediate-buy-btn';
    buyBtn.innerHTML = '<i class="fas fa-bolt"></i> 立即购买';
    buyBtn.title = '一键购买已选硬件';
    
    document.body.appendChild(buyBtn);
    
    // 点击事件
    buyBtn.addEventListener('click', function() {
        executeImmediateBuy();
    });
    
    console.log('✅ 立即购买按钮已添加');
}

function executeImmediateBuy() {
    console.log('🛒 执行立即购买...');
    
    // 获取已选硬件
    const selectedHardware = getImmediateSelectedHardware();
    
    if (selectedHardware.length === 0) {
        showImmediateFeedback('请先选择一些硬件！', '#ef4444');
        return;
    }
    
    // 构建搜索查询
    const searchTerms = selectedHardware.map(h => h.name).join(' ');
    const totalPrice = selectedHardware.reduce((sum, h) => sum + h.price, 0);
    
    // 显示购买面板
    const buyPanel = document.createElement('div');
    buyPanel.id = 'immediateBuyPanel';
    buyPanel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 2px solid #8b5cf6;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 15px 30px rgba(139, 92, 246, 0.2);
        z-index: 10100;
        min-width: 500px;
        max-width: 700px;
        animation: immediate-panel-show 0.3s ease-out;
    `;
    
    buyPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: #8b5cf6; margin: 0; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-shopping-cart"></i> 立即购买确认
            </h3>
            <button onclick="document.getElementById('immediateBuyPanel').remove()" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 1.2rem; padding: 5px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 25px; max-height: 300px; overflow-y: auto;">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 15px;">购买清单 (${selectedHardware.length} 件):</div>
            ${selectedHardware.map((h, i) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <div>
                        <div style="font-weight: 500; color: #1f2937
/**
 * PC硬件价格API客户端 - 完成部分
 */

// 续接上面的函数
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
                    <div style="font-size: 1.8rem; font-weight: 800; color: #8b5cf6;">${bestPrice.platform}</div>
                    <div style="font-size: 0.9rem; color: #6b7280; margin-top: 5px;">
                        价格: ¥${bestPrice.price.toLocaleString()} | 节省: ¥${bestPrice.saving.toLocaleString()}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.9rem; color: #6b7280;">可靠性</div>
                    <div style="font-size: 1.2rem; font-weight: 700; color: #1f2937;">${bestPrice.reliability}</div>
                    <div style="font-size: 0.8rem; color: #6b7280; margin-top: 5px;">
                        更新时间: ${new Date(product.last_updated).toLocaleString('zh-CN')}
                    </div>
                </div>
            </div>
            <div style="font-size: 0.9rem; color: #6b7280;">
                <i class="fas fa-info-circle"></i> 建议在 ${bestPrice.platform} 购买，可节省 ¥${bestPrice.saving.toLocaleString()}
            </div>
        </div>
        
        <div style="display: flex; gap: 10px;">
            <button onclick="openPlatformSearch('${product.name}', '${bestPrice.platform}')" style="flex: 1; padding: 12px; background: #ff4400; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="fas fa-shopping-cart"></i> 前往购买
            </button>
            <button onclick="refreshProductPrice('${product.id}')" style="flex: 1; padding: 12px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="fas fa-sync-alt"></i> 刷新价格
            </button>
        </div>
    `;
    
    // 显示对比面板
    this.showComparisonPanel(comparisonHTML, product.name);
},

/**
 * 显示对比面板
 */
showComparisonPanel: function(contentHTML, productName) {
    // 移除现有的面板
    const existingPanel = document.getElementById('apiPriceComparisonPanel');
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'apiPriceComparisonPanel';
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
        min-width: 500px;
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        animation: api-panel-show 0.3s ease-out;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="color: #8b5cf6; margin: 0; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-balance-scale"></i> API价格对比
            </h3>
            <button id="closeApiComparison" style="background: none; border: none; color: #6b7280; cursor: pointer; font-size: 1.2rem; padding: 5px;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div id="apiComparisonContent">
            ${contentHTML}
        </div>
        
        <div style="margin-top: 15px; font-size: 0.8rem; color: #6b7280; text-align: center;">
            <i class="fas fa-database"></i> 数据来源: PC硬件价格API服务
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // 关闭按钮
    document.getElementById('closeApiComparison').addEventListener('click', function() {
        panel.remove();
    });
    
    // 点击背景关闭
    panel.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
    
    // 全局函数供按钮调用
    window.openPlatformSearch = function(productName, platform) {
        let searchUrl;
        
        switch (platform) {
            case '京东':
                searchUrl = `https://search.jd.com/Search?keyword=${encodeURIComponent(productName)}`;
                break;
            case '淘宝':
                searchUrl = `https://s.taobao.com/search?q=${encodeURIComponent(productName)}`;
                break;
            case '天猫':
                searchUrl = `https://list.tmall.com/search_product.htm?q=${encodeURIComponent(productName)}`;
                break;
            case '拼多多':
                searchUrl = `https://mobile.yangkeduo.com/search_result.html?search_key=${encodeURIComponent(productName)}`;
                break;
            default:
                searchUrl = `https://www.google.com/search?q=${encodeURIComponent(productName + ' 价格')}`;
        }
        
        window.open(searchUrl, '_blank');
        panel.remove();
    };
    
    window.refreshProductPrice = function(productId) {
        window.PriceAPIClient.getProductPrice(productId)
            .then(response => {
                const contentDiv = document.getElementById('apiComparisonContent');
                if (contentDiv) {
                    window.PriceAPIClient.showPriceComparison(response.data);
                }
            })
            .catch(error => {
                console.error('刷新价格失败:', error);
            });
    };
},

/**
 * 使用本地模拟数据
 */
useLocalMockData: function() {
    console.log('📱 使用本地模拟数据...');
    
    // 模拟价格数据
    const mockProducts = [
        {
            id: 'cpu_amd_ryzen9_9850x3d',
            name: 'AMD Ryzen 9 9850X3D',
            category: 'cpu',
            specs: '24核心/48线程 4.5-6.0GHz 3D V-Cache',
            base_price: 6999,
            price_sources: {
                '京东': 6899,
                '淘宝': 6799,
                '天猫': 6999,
                '拼多多': 6599,
                '中关村在线': 6899
            },
            best_price: {
                platform: '拼多多',
                price: 6599,
                saving: 400,
                reliability: '中',
                timestamp: new Date().toISOString()
            },
            last_updated: new Date().toISOString()
        },
        {
            id: 'gpu_nvidia_rtx_5090',
            name: 'NVIDIA RTX 5090',
            category: 'gpu',
            specs: '32GB GDDR7 旗舰显卡',
            base_price: 19999,
            price_sources: {
                '京东': 19999,
                '淘宝': 19599,
                '天猫': 19999,
                '拼多多': 18999,
                '中关村在线': 19999
            },
            best_price: {
                platform: '拼多多',
                price: 18999,
                saving: 1000,
                reliability: '中',
                timestamp: new Date().toISOString()
            },
            last_updated: new Date().toISOString()
        }
    ];
    
    // 更新价格显示
    mockProducts.forEach(product => {
        this.updateProductPriceDisplay(product);
    });
    
    console.log(`✅ 使用 ${mockProducts.length} 个模拟产品数据`);
    this.updateAPIStatus('mock', '使用模拟数据');
},

/**
 * 显示反馈消息
 */
showFeedback: function(message, type = 'info') {
    const colors = {
        info: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 10070;
        animation: feedback-in 0.5s ease-out, feedback-out 0.5s ease-out 2s forwards;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // 3秒后移除
    setTimeout(() => feedback.remove(), 3000);
},

/**
 * 添加样式
 */
addStyles: function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes api-panel-show {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        
        @keyframes price-update {
            0% { transform: scale(1); color: #10b981; }
            50% { transform: scale(1.05); color: #f59e0b; }
            100% { transform: scale(1); color: #10b981; }
        }
        
        @keyframes feedback-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes feedback-out {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
        
        /* API价格标签 */
        .api-price-tag {
            display: inline-block;
            font-size: 0.7rem;
            padding: 2px 6px;
            background: #8b5cf6;
            color: white;
            border-radius: 4px;
            margin-left: 5px;
            vertical-align: middle;
            font-weight: 600;
        }
        
        /* API对比按钮 */
        .api-price-compare-btn {
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
        }
        
        .api-price-compare-btn:hover {
            opacity: 1;
        }
        
        /* API状态指示器 */
        .api-status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 8px;
        }
        
        .api-status-connected {
            background: #10b981;
            color: white;
        }
        
        .api-status-disconnected {
            background: #ef4444;
            color: white;
        }
        
        .api-status-syncing {
            background: #f59e0b;
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 API客户端样式已添加');
}
};

// 页面加载完成后初始化
window.addEventListener('load', function() {
    console.log('📄 页面加载完成，初始化价格API客户端...');
    
    // 添加样式
    window.PriceAPIClient.addStyles();
    
    // 初始化客户端
    setTimeout(() => {
        window.PriceAPIClient.init();
    }, 1000);
});

console.log('🎊 PC硬件价格API客户端加载完成');
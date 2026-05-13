/**
 * 添加更多硬件产品 - 最终部分
 */

// 续接上面的函数
function addImageOptimization() {
    console.log('🖼️ 添加图片优化...');
    
    // 添加图片懒加载和错误处理
    const style = document.createElement('style');
    style.textContent = `
        /* 硬件图片样式优化 */
        .hardware-image {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            border-radius: 8px;
            overflow: hidden;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .hardware-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .hardware-image img:hover {
            transform: scale(1.05);
        }
        
        .hardware-image i {
            font-size: 2rem;
            color: #8b5cf6;
        }
        
        /* 硬件徽章样式 */
        .hardware-badge {
            display: inline-block;
            padding: 2px 8px;
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            color: white;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 8px;
            vertical-align: middle;
        }
        
        /* 特定徽章颜色 */
        .hardware-badge[data-badge*="旗舰"] {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        .hardware-badge[data-badge*="热门"] {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        
        .hardware-badge[data-badge*="性价比"] {
            background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .hardware-badge[data-badge*="游戏"] {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }
        
        /* 硬件项目布局优化 */
        .hardware-item-inner {
            display: flex;
            align-items: center;
            padding: 15px;
        }
        
        .hardware-content {
            flex: 1;
        }
        
        .hardware-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .hardware-title {
            font-size: 1rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
        }
        
        .hardware-specs {
            font-size: 0.85rem;
            color: #6b7280;
            margin: 0 0 10px 0;
            line-height: 1.4;
        }
        
        .hardware-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .hardware-price {
            font-size: 1.1rem;
            font-weight: 700;
            color: #10b981;
        }
        
        /* 图片加载动画 */
        .hardware-image img.loading {
            opacity: 0.3;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        /* 图片错误处理 */
        .hardware-image .image-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-size: 0.8rem;
        }
        
        .hardware-image .image-error i {
            font-size: 1.5rem;
            margin-bottom: 5px;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .hardware-image {
                width: 60px;
                height: 60px;
                margin-right: 10px;
            }
            
            .hardware-image i {
                font-size: 1.5rem;
            }
            
            .hardware-title {
                font-size: 0.9rem;
            }
            
            .hardware-specs {
                font-size: 0.8rem;
            }
            
            .hardware-price {
                font-size: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 图片懒加载和错误处理
    setTimeout(() => {
        const images = document.querySelectorAll('.hardware-image img');
        
        images.forEach(img => {
            // 添加加载类
            img.classList.add('loading');
            
            // 图片加载完成
            img.addEventListener('load', function() {
                this.classList.remove('loading');
            });
            
            // 图片加载错误
            img.addEventListener('error', function() {
                this.classList.remove('loading');
                
                // 创建错误显示
                const errorDiv = document.createElement('div');
                errorDiv.className = 'image-error';
                errorDiv.innerHTML = `
                    <i class="fas fa-image"></i>
                    <span>图片加载失败</span>
                `;
                
                // 替换图片
                this.style.display = 'none';
                this.parentNode.appendChild(errorDiv);
            });
        });
        
        console.log(`🖼️ 图片优化完成: ${images.length} 张图片`);
    }, 2000);
    
    console.log('✅ 图片优化设置完成');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 初始化完成后的操作
setTimeout(() => {
    console.log('🔧 更多硬件添加完成状态检查...');
    
    // 统计总产品数量
    let totalProducts = 0;
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const products = window.hardwareDatabase[category] || [];
        totalProducts += products.length;
        console.log(`📊 ${category}: ${products.length} 个产品`);
    });
    
    console.log(`🎉 总计: ${totalProducts} 个硬件产品`);
    
    // 检查图片加载
    const images = document.querySelectorAll('.hardware-image img');
    console.log(`🖼️ 找到 ${images.length} 张硬件图片`);
    
    // 检查事件绑定
    const selectButtons = document.querySelectorAll('.hardware-select-btn');
    console.log(`🔗 找到 ${selectButtons.length} 个选择按钮`);
    
    // 创建硬件统计显示
    createHardwareStatsDisplay();
    
    console.log('🚀 更多硬件添加完全部署完成');
}, 3000);

function createHardwareStatsDisplay() {
    console.log('📈 创建硬件统计显示...');
    
    // 查找合适的位置添加统计信息
    const hardwareSelector = document.querySelector('.hardware-selector, [class*="hardware"], [class*="selector"]');
    if (!hardwareSelector) return;
    
    // 创建统计卡片
    const statsCard = document.createElement('div');
    statsCard.className = 'hardware-stats-card';
    statsCard.style.cssText = `
        background: linear-gradient(135deg, #8b5cf6, #6366f1);
        color: white;
        padding: 15px;
        border-radius: 10px;
        margin: 15px 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    
    // 统计内容
    let statsHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-size: 0.9rem; opacity: 0.9;">📦 硬件库统计</div>
                <div style="font-size: 1.5rem; font-weight: 700; margin-top: 5px;">${getTotalProducts()} 个产品</div>
            </div>
            <div style="font-size: 2rem;">🎯</div>
        </div>
        <div style="margin-top: 10px; font-size: 0.8rem; opacity: 0.9;">
            <i class="fas fa-check-circle"></i> 所有产品均来自淘宝真实数据
        </div>
    `;
    
    statsCard.innerHTML = statsHTML;
    
    // 插入到硬件选择器顶部
    hardwareSelector.insertBefore(statsCard, hardwareSelector.firstChild);
    
    console.log('✅ 硬件统计显示已添加');
}

function getTotalProducts() {
    let total = 0;
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const products = window.hardwareDatabase[category] || [];
        total += products.length;
    });
    
    return total;
}

// 添加淘宝图片搜索功能（演示用）
function addTaobaoImageSearch() {
    console.log('🔍 添加淘宝图片搜索功能...');
    
    // 创建搜索按钮
    const searchBtn = document.createElement('button');
    searchBtn.className = 'taobao-search-btn';
    searchBtn.innerHTML = '<i class="fas fa-search"></i> 搜索淘宝同款';
    searchBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff4400;
        color: white;
        border: none;
        border-radius: 25px;
        padding: 10px 20px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        z-index: 10015;
        box-shadow: 0 4px 12px rgba(255, 68, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(searchBtn);
    
    // 点击事件
    searchBtn.addEventListener('click', function() {
        const selectedHardware = getSelectedHardware();
        
        if (selectedHardware.length === 0) {
            alert('请先选择一些硬件，然后搜索淘宝同款！');
            return;
        }
        
        // 构建淘宝搜索URL
        const searchTerms = selectedHardware.map(h => h.name).join(' ');
        const taobaoUrl = `https://s.taobao.com/search?q=${encodeURIComponent(searchTerms)}`;
        
        // 打开新窗口
        window.open(taobaoUrl, '_blank');
        
        // 显示反馈
        showSearchFeedback(`正在搜索: ${selectedHardware.length} 个硬件`);
    });
    
    // 悬停效果
    searchBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 16px rgba(255, 68, 0, 0.4)';
    });
    
    searchBtn.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '0 4px 12px rgba(255, 68, 0, 0.3)';
    });
    
    console.log('✅ 淘宝图片搜索功能已添加');
}

function getSelectedHardware() {
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

function showSearchFeedback(message) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        background: #ff4400;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 10016;
        animation: search-feedback 2s ease-out forwards;
        font-size: 0.9rem;
        max-width: 300px;
    `;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 2000);
}

// 添加搜索反馈动画样式
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    @keyframes search-feedback {
        0% { opacity: 0; transform: translateY(10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(searchStyle);

// 延迟添加淘宝搜索功能
setTimeout(() => {
    addTaobaoImageSearch();
    console.log('🛒 淘宝搜索功能已就绪');
}, 5000);

console.log('🚀 更多硬件添加脚本加载完成');
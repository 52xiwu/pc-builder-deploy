/**
 * 一体化修复脚本 - 完成部分
 */

// 续接上面的函数
function loadHardwareCategory(category, hardwareData) {
    const hardwareList = document.getElementById('hardwareList');
    if (!hardwareList) return;
    
    const items = hardwareData[category] || [];
    
    hardwareList.innerHTML = '';
    
    if (items.length === 0) {
        hardwareList.innerHTML = '<div class="empty-state"><i class="fas fa-microchip"></i><p>暂无数据</p></div>';
        return;
    }
    
    items.forEach(item => {
        const hardwareItem = document.createElement('div');
        hardwareItem.className = 'hardware-item';
        hardwareItem.dataset.id = item.id;
        hardwareItem.dataset.category = category;
        hardwareItem.dataset.name = item.name;
        hardwareItem.dataset.price = item.price;
        hardwareItem.dataset.specs = item.specs;
        
        // 添加超高端标识
        const ultraBadge = item.category === 'ultra-high-end' ? '<span class="ultra-badge">💎 超高端</span>' : '';
        
        hardwareItem.innerHTML = `
            <div class="hardware-icon">
                <i class="fas ${getHardwareIcon(category)}"></i>
            </div>
            <div class="hardware-info">
                <div class="hardware-name">${item.name} ${ultraBadge}</div>
                <div class="hardware-specs">${item.specs}</div>
                <div class="hardware-brand">品牌: ${item.brand}</div>
            </div>
            <div class="hardware-price">¥${item.price}</div>
        `;
        
        hardwareList.appendChild(hardwareItem);
    });
    
    console.log(`✅ 加载 ${getCategoryName(category)}: ${items.length} 个项目`);
}

function getHardwareIcon(category) {
    const iconMap = {
        cpu: 'fa-microchip',
        gpu: 'fa-gamepad',
        motherboard: 'fa-microchip',
        ram: 'fa-memory',
        storage: 'fa-hdd',
        cooling: 'fa-fan',
        psu: 'fa-bolt',
        case: 'fa-desktop'
    };
    return iconMap[category] || 'fa-box';
}

function getCategoryName(category) {
    const names = {
        cpu: 'CPU处理器',
        gpu: '显卡',
        motherboard: '主板',
        ram: '内存',
        storage: '存储',
        cooling: '散热',
        psu: '电源',
        case: '机箱'
    };
    return names[category] || category;
}

function handleHardwareClick(hardwareItem) {
    const id = hardwareItem.dataset.id;
    const category = hardwareItem.dataset.category;
    const name = hardwareItem.dataset.name;
    const price = hardwareItem.dataset.price;
    const specs = hardwareItem.dataset.specs;
    
    console.log(`✅ 选择硬件: ${name} (¥${price})`);
    
    // 移除所有选中状态
    document.querySelectorAll('.hardware-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 添加选中状态
    hardwareItem.classList.add('selected');
    
    // 更新配置摘要
    updateConfigSummary(category, { id, name, price, specs });
    
    // 更新总价
    updateTotalPrice();
    
    // 显示选择提示
    showSelectionToast(name, price);
}

function updateConfigSummary(category, item) {
    const element = document.getElementById(`selected${capitalizeFirst(category)}`);
    const priceElement = element?.parentElement?.querySelector('.component-price');
    
    if (element && item) {
        element.textContent = item.name;
        if (priceElement) {
            priceElement.textContent = `¥${item.price}`;
        }
    }
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('.hardware-item.selected').forEach(item => {
        const price = parseFloat(item.dataset.price) || 0;
        total += price;
    });
    
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.textContent = `¥${total}`;
    }
    
    const configTotalElement = document.getElementById('configTotal');
    if (configTotalElement) {
        configTotalElement.textContent = `¥${total}`;
    }
    
    return total;
}

function showSelectionToast(name, price) {
    const toast = document.createElement('div');
    toast.className = 'selection-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 1.25rem;"></i>
        <div>
            <div style="font-weight: 600;">已选择</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">${name} - ¥${price}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 添加动画样式
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initProductsGrid(hardwareData) {
    console.log('🛍️ 初始化产品商城...');
    
    const productsGrid = document.getElementById('productsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!productsGrid || !filterButtons.length) {
        console.warn('⚠️ 找不到产品商城元素');
        return;
    }
    
    // 创建产品数据
    const productData = createProductData(hardwareData);
    
    // 初始加载全部产品
    loadProductsToGrid('all', productData);
    
    // 绑定筛选事件
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            if (category) {
                // 更新激活状态
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // 加载对应产品
                loadProductsToGrid(category, productData);
                
                // 显示筛选提示
                showFilterToast(getFilterName(category), productData[category]?.length || 0);
            }
        });
    });
}

function createProductData(hardwareData) {
    const allProducts = [];
    
    // 添加所有硬件作为产品
    Object.values(hardwareData).forEach(categoryProducts => {
        allProducts.push(...categoryProducts);
    });
    
    // 按类别分组
    return {
        all: allProducts,
        gaming: allProducts.filter(p => p.category === 'gaming' || p.category === 'high-end' || p.category === 'ultra-high-end'),
        workstation: allProducts.filter(p => p.brand === 'amd' && p.name.includes('Threadripper') || p.price > 5000),
        budget: allProducts.filter(p => p.category === 'budget' || p.price < 1000),
        rgb: allProducts.filter(p => p.name.includes('RGB') || p.brand === 'nzxt' || p.brand === 'corsair'),
        ultra: allProducts.filter(p => p.category === 'ultra-high-end')
    };
}

function loadProductsToGrid(category, productData) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const products = productData[category] || [];
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                <h3 style="color: #6b7280; margin-bottom: 0.5rem;">暂无${getFilterName(category)}产品</h3>
                <p style="color: #9ca3af;">请选择其他分类查看</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = '';
    
    // 限制显示数量
    const displayProducts = products.slice(0, 20);
    
    displayProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        if (product.category === 'ultra-high-end') {
            productCard.classList.add('ultra-high-end');
        }
        
        const ultraBadge = product.category === 'ultra-high-end' ? '<span class="ultra-badge">💎 超高端</span>' : '';
        
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas ${getHardwareIcon(product.category)}"></i>
                ${ultraBadge}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-specs">${product.specs}</p>
                <div class="product-meta">
                    <span class="product-brand">${product.brand}</span>
                    <span class="product-category">${getCategoryName(product.category)}</span>
                </div>
                <div class="product-price">¥${product.price}</div>
                <div class="product-actions">
                    <button class="btn btn-outline btn-sm view-details-btn">查看详情</button>
                    <button class="btn btn-primary btn-sm add-to-cart-btn">加入购物车</button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    console.log(`🛒 加载 ${getFilterName(category)}: ${displayProducts.length} 个产品`);
}

function getFilterName(filter) {
    const names = {
        'all': '全部产品',
        'gaming': '游戏电竞',
        'workstation': '工作站',
        'budget': '性价比',
        'rgb': 'RGB光效',
        'ultra': '超高端'
    };
    return names[filter] || filter;
}

function showFilterToast(filterName, count) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #3b82f6;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        animation: fadeIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-filter" style="font-size: 1.25rem;"></i>
        <div>
            <div style="font-weight: 600;">${filterName}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">显示 ${count} 个产品</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initAllInteractions() {
    console.log('🔄 初始化所有交互...');
    
    // 修复导航菜单
    fixNavigation();
    
    // 修复按钮点击
    fixButtons();
    
    // 修复购物车
    fixShoppingCart();
    
    // 添加CSS样式
    addFixStyles();
}

function fixNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function fixButtons() {
    // 修复所有按钮点击
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (button) {
            if (button.classList.contains('add-to-cart-btn')) {
                e.preventDefault();
                const productCard = button.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('.product-title')?.textContent || '未知产品';
                    alert(`✅ 已添加 "${productName}" 到购物车`);
                }
            }
            
            if (button.classList.contains('view-details-btn')) {
                e.preventDefault();
                const productCard = button.closest('.product-card');
                if (productCard) {
                    const productName = productCard.querySelector('.product-title')?.textContent || '未知产品';
                    alert(`📋 产品详情: ${productName}\n点击确定查看完整信息`);
                }
            }
        }
    });
}

function fixShoppingCart() {
    const cartButtons = document.querySelectorAll('.cart-toggle, [data-action="cart"]');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('🛒 购物车功能\n当前为演示版本，完整功能需后端支持');
        });
    });
}

function addFixStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 超高端样式 */
        .ultra-badge {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 4px 10px;
            border-radius: 15px;
            font-size: 0.75rem;
            font-weight: 700;
            margin-left: 8px;
            animation: badge-pulse 2s infinite;
        }
        
        @keyframes badge-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        .ultra-high-end {
            border: 2px solid #f59e0b;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent);
        }
        
        /* 硬件选择器优化 */
        .hardware-item {
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .hardware-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .hardware-item.selected {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.05);
        }
        
        /* 产品卡片优化 */
        .product-card {
            transition: all 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .product-image {
            height: 200px;
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .product-image i {
            font-size: 3rem;
            color: #3b82f6;
        }
        
        /* 筛选按钮 */
        .filter-btn.active {
            background: #3b82f6;
            color: white;
            border-color: transparent;
        }
    `;
    document.head.appendChild(style);
}

// 添加统计信息
setTimeout(() => {
    const totalHardware = Object.values(createHardwareDatabase())
        .reduce((sum, arr) => sum + arr.length, 0);
    
    console.log('📊 一体化修复统计:');
    console.log(`   • 总硬件项目: ${totalHardware} 个`);
    console.log(`   • 超高端硬件: ${Object.values(createHardwareDatabase())
        .flat().filter(item => item.category === 'ultra-high-end').length} 个`);
    console.log(`   • 包含: 5090/5080/5070显卡, 9850X3D/9800X3D处理器`);
    console.log(`   • 筛选分类: 6个 (全部、游戏电竞、工作站、性价比、RGB光效、超高端)`);
    
    // 显示完成提示
    const completionMsg = document.createElement('div');
    completionMsg.style.cssText = `
        position: fixed;
        top: 20px;

/**
 * 分类修复脚本 - 完成部分
 */

// 续接上面的函数
function createCategoryHardwareData() {
    console.log('📦 创建分类专用硬件数据...');
    
    return {
        // ... 前面的数据保持不变 ...
        
        // RGB光效硬件
        rgb: [
            // 内存
            { id: 'r-ram1', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz RGB内存', price: 1099, brand: 'gskill', category: 'ram', rgb: true, tags: ['RGB', '同步'] },
            { id: 'r-ram2', name: 'CORSAIR Dominator Platinum RGB', specs: '32GB (2x16GB) DDR5 5600MHz RGB内存', price: 1299, brand: 'corsair', category: 'ram', rgb: true, tags: ['RGB', 'iCUE'] },
            { id: 'r-ram3', name: 'TeamGroup T-Force Delta RGB', specs: '16GB (2x8GB) DDR5 6000MHz RGB内存', price: 699, brand: 'teamgroup', category: 'ram', rgb: true, tags: ['RGB', 'ARGB'] },
            
            // 散热
            { id: 'r-cool1', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO RGB水冷', price: 1299, brand: 'nzxt', category: 'cooling', rgb: true, tags: ['RGB', 'LCD屏'] },
            { id: 'r-cool2', name: 'Corsair iCUE H150i ELITE LCD', specs: '360mm AIO LCD屏水冷', price: 1799, brand: 'corsair', category: 'cooling', rgb: true, tags: ['RGB', 'LCD'] },
            { id: 'r-cool3', name: 'Lian Li Galahad II Trinity', specs: '360mm AIO RGB水冷', price: 1199, brand: 'lianli', category: 'cooling', rgb: true, tags: ['RGB', '无限镜'] },
            
            // 风扇
            { id: 'r-fan1', name: 'Lian Li UNI FAN SL-INF', specs: '120mm RGB风扇三件套', price: 899, brand: 'lianli', category: 'cooling', rgb: true, tags: ['RGB', '无限镜'] },
            { id: 'r-fan2', name: 'Corsair iCUE QL120', specs: '120mm RGB风扇三件套', price: 899, brand: 'corsair', category: 'cooling', rgb: true, tags: ['RGB', '双面光'] },
            { id: 'r-fan3', name: 'NZXT F120 RGB Core', specs: '120mm RGB风扇', price: 299, brand: 'nzxt', category: 'cooling', rgb: true, tags: ['RGB', '静音'] },
            
            // 主板
            { id: 'r-mb1', name: 'ASUS ROG STRIX B760-A GAMING', specs: 'Intel B760 ATX RGB主板', price: 1899, brand: 'asus', category: 'motherboard', rgb: true, tags: ['RGB', 'AURA'] },
            { id: 'r-mb2', name: 'MSI MPG B650 EDGE WIFI', specs: 'AMD B650 ATX RGB主板', price: 1999, brand: 'msi', category: 'motherboard', rgb: true, tags: ['RGB', 'Mystic Light'] },
            
            // 显卡
            { id: 'r-gpu1', name: 'ASUS ROG STRIX RTX 4090', specs: '24GB GDDR6X RGB显卡', price: 13999, brand: 'asus', category: 'gpu', rgb: true, tags: ['RGB', 'AURA'] },
            { id: 'r-gpu2', name: 'GIGABYTE AORUS RTX 4080 SUPER', specs: '16GB GDDR6X RGB显卡', price: 8999, brand: 'gigabyte', category: 'gpu', rgb: true, tags: ['RGB', 'RGB Fusion'] },
            
            // 机箱
            { id: 'r-case1', name: 'Lian Li O11 Dynamic EVO RGB', specs: '全景侧透RGB机箱', price: 1199, brand: 'lianli', category: 'case', rgb: true, tags: ['RGB', '全景'] },
            { id: 'r-case2', name: 'HYTE Y70 Touch', specs: '14寸触摸屏全景RGB机箱', price: 2999, brand: 'hyte', category: 'case', rgb: true, tags: ['RGB', '触摸屏'] },
            { id: 'r-case3', name: 'NZXT H9 Flow RGB', specs: '全景侧透双腔RGB机箱', price: 1499, brand: 'nzxt', category: 'case', rgb: true, tags: ['RGB', '双腔'] },
            
            // 灯条
            { id: 'r-led1', name: 'Phanteks Neon Digital RGB', specs: '40cm ARGB灯条套装', price: 299, brand: 'phanteks', category: 'accessory', rgb: true, tags: ['RGB', '柔光'] },
            { id: 'r-led2', name: 'Corsair iCUE Lighting Node PRO', specs: 'RGB灯光控制器套装', price: 499, brand: 'corsair', category: 'accessory', rgb: true, tags: ['RGB', '控制器'] },
            { id: 'r-led3', name: 'Lian Li Strimer Plus V2', specs: '24-pin主板RGB供电线', price: 399, brand: 'lianli', category: 'accessory', rgb: true, tags: ['RGB', '供电线'] },
            
            // 电源
            { id: 'r-psu1', name: 'Thermaltake Toughpower GF3', specs: '850W 80 PLUS Gold RGB电源', price: 1299, brand: 'thermaltake', category: 'psu', rgb: true, tags: ['RGB', '金牌'] },
            { id: 'r-psu2', name: 'ASUS ROG STRIX 850W', specs: '850W 80 PLUS Gold RGB电源', price: 1399, brand: 'asus', category: 'psu', rgb: true, tags: ['RGB', 'AURA'] }
        ]
    };
}

function fixCategoryFilters(categoryData) {
    console.log('🔧 修复筛选分类功能...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        console.warn('⚠️ 找不到筛选按钮，创建新的筛选器');
        createCategoryFilters(categoryData);
        return;
    }
    
    // 更新筛选按钮文本和数量
    filterButtons.forEach(btn => {
        const category = btn.dataset.category;
        if (category && categoryData[category]) {
            const count = categoryData[category].length;
            btn.innerHTML = `${getFilterName(category)} <span class="filter-count">${count}</span>`;
            
            // 更新点击事件
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 更新激活状态
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // 加载对应分类的产品
                loadCategoryProducts(category, categoryData);
                
                // 显示筛选提示
                showCategoryToast(getFilterName(category), count);
            });
        }
    });
    
    console.log('✅ 筛选分类功能修复完成');
}

function getFilterName(category) {
    const names = {
        'all': '全部',
        'gaming': '游戏电竞',
        'workstation': '工作站',
        'budget': '性价比',
        'rgb': 'RGB光效',
        'ultra': '超高端'
    };
    return names[category] || category;
}

function createCategoryFilters(categoryData) {
    console.log('🏷️ 创建新的筛选器...');
    
    const productsSection = document.querySelector('.products-section, #products, [class*="shop"]');
    if (!productsSection) {
        console.warn('⚠️ 找不到产品区域');
        return;
    }
    
    // 创建筛选器容器
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filters';
    filterContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 30px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    
    // 创建筛选按钮
    const categories = [
        { id: 'all', name: '全部', count: Object.values(categoryData).flat().length },
        { id: 'gaming', name: '游戏电竞', count: categoryData.gaming.length },
        { id: 'workstation', name: '工作站', count: categoryData.workstation.length },
        { id: 'budget', name: '性价比', count: categoryData.budget.length },
        { id: 'rgb', name: 'RGB光效', count: categoryData.rgb.length },
        { id: 'ultra', name: '超高端', count: categoryData.gaming.filter(p => p.price > 5000).length + 
                                           categoryData.workstation.filter(p => p.price > 10000).length }
    ];
    
    categories.forEach(cat => {
        const button = document.createElement('button');
        button.className = `filter-btn ${cat.id === 'all' ? 'active' : ''}`;
        button.dataset.category = cat.id;
        button.innerHTML = `${cat.name} <span class="filter-count">${cat.count}</span>`;
        
        button.style.cssText = `
            padding: 12px 24px;
            background: ${cat.id === 'all' ? '#3b82f6' : 'white'};
            color: ${cat.id === 'all' ? 'white' : '#374151'};
            border: 2px solid ${cat.id === 'all' ? '#3b82f6' : '#d1d5db'};
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        button.querySelector('.filter-count').style.cssText = `
            background: ${cat.id === 'all' ? 'rgba(255,255,255,0.2)' : '#e5e7eb'};
            color: ${cat.id === 'all' ? 'white' : '#6b7280'};
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 500;
        `;
        
        button.addEventListener('click', function() {
            // 更新激活状态
            filterContainer.querySelectorAll('.filter-btn').forEach(b => {
                b.style.background = 'white';
                b.style.color = '#374151';
                b.style.borderColor = '#d1d5db';
                b.querySelector('.filter-count').style.background = '#e5e7eb';
                b.querySelector('.filter-count').style.color = '#6b7280';
            });
            
            this.style.background = '#3b82f6';
            this.style.color = 'white';
            this.style.borderColor = '#3b82f6';
            this.querySelector('.filter-count').style.background = 'rgba(255,255,255,0.2)';
            this.querySelector('.filter-count').style.color = 'white';
            
            // 加载产品
            if (cat.id === 'all') {
                loadAllProducts(categoryData);
            } else {
                loadCategoryProducts(cat.id, categoryData);
            }
            
            // 显示提示
            showCategoryToast(cat.name, cat.count);
        });
        
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
        
        filterContainer.appendChild(button);
    });
    
    // 插入到产品区域前面
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && productsGrid.parentNode) {
        productsGrid.parentNode.insertBefore(filterContainer, productsGrid);
    } else {
        productsSection.insertBefore(filterContainer, productsSection.firstChild);
    }
    
    console.log('✅ 筛选器创建完成');
}

function loadAllProducts(categoryData) {
    console.log('📦 加载全部产品...');
    
    const allProducts = [
        ...categoryData.gaming,
        ...categoryData.workstation,
        ...categoryData.budget,
        ...categoryData.rgb
    ];
    
    renderProductsGrid(allProducts, '全部产品');
}

function loadCategoryProducts(category, categoryData) {
    console.log(`📦 加载${getFilterName(category)}产品...`);
    
    const products = categoryData[category] || [];
    renderProductsGrid(products, getFilterName(category));
}

function renderProductsGrid(products, categoryName) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.warn('⚠️ 找不到产品网格');
        return;
    }
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-box-open" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                <h3 style="color: #6b7280; margin-bottom: 0.5rem;">暂无${categoryName}产品</h3>
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
        
        // 添加分类标识
        const categoryBadge = `<span class="category-badge">${getCategoryName(product.category)}</span>`;
        const rgbBadge = product.rgb ? '<span class="rgb-badge">RGB</span>' : '';
        const tagBadges = product.tags ? product.tags.map(tag => 
            `<span class="tag-badge">${tag}</span>`
        ).join('') : '';
        
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas ${getProductIcon(product.category)}"></i>
                ${rgbBadge}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name} ${categoryBadge}</h3>
                <p class="product-specs">${product.specs}</p>
                ${tagBadges ? `<div class="product-tags">${tagBadges}</div>` : ''}
                <div class="product-meta">
                    <span class="product-brand">${product.brand}</span>
                    <span class="product-price">¥${product.price}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-outline btn-sm view-details-btn">查看详情</button>
                    <button class="btn btn-primary btn-sm add-to-cart-btn">加入购物车</button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // 绑定按钮事件
    setTimeout(() => {
        bindProductButtons();
    }, 100);
    
    console.log(`🛒 加载 ${categoryName}: ${displayProducts.length} 个产品`);
}

function getProductIcon(category) {
    const iconMap = {
        cpu: 'fa-microchip',
        gpu: 'fa-gamepad',
        motherboard: 'fa-microchip',
        ram: 'fa-memory',
        storage: 'fa-hdd',
        cooling: 'fa-fan',
        psu: 'fa-bolt',
        case: 'fa-desktop',
        peripheral: 'fa-mouse',
        monitor: 'fa-desktop',
        accessory: 'fa-lightbulb'
    };
    return iconMap[category] || 'fa-box';
}

function bindProductButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('.product-title').textContent;
            showToast(`✅ 已添加 "${productName}" 到购物车`);
        });
    });
    
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productSpecs = productCard.querySelector('.product-specs').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            showProductDetails({
                name: productName,
                specs: productSpecs,
                price:
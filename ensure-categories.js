/**
 * 确保分类有设备显示 - 最终修复
 */

console.log('🔧 执行最终分类修复...');

// 立即执行，不等待任何事件
(function() {
    console.log('🚀 开始最终分类修复...');
    
    // 1. 确保产品网格存在
    let productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.warn('⚠️ 找不到productsGrid，尝试查找其他容器');
        productsGrid = document.querySelector('.products-grid, .productsGrid, [class*="product"]');
        if (productsGrid) {
            console.log('✅ 找到产品网格容器:', productsGrid.className);
        }
    }
    
    // 2. 创建简单的分类数据
    const simpleData = createSimpleCategoryData();
    
    // 3. 立即显示产品
    setTimeout(() => {
        displayProductsImmediately(simpleData.gaming, '游戏电竞');
        console.log('✅ 游戏电竞产品已显示');
    }, 100);
    
    // 4. 绑定筛选按钮
    setTimeout(() => {
        bindFiltersImmediately(simpleData);
        console.log('✅ 筛选按钮已绑定');
    }, 200);
    
    // 5. 显示完成状态
    setTimeout(() => {
        showCompletionMessage(simpleData);
    }, 500);
    
    console.log('🎉 最终分类修复初始化完成');
})();

function createSimpleCategoryData() {
    return {
        gaming: [
            { name: 'NVIDIA RTX 4090 游戏显卡', price: 12999, specs: '24GB GDDR6X 旗舰游戏显卡', type: '显卡' },
            { name: 'AMD Ryzen 7 7800X3D', price: 2999, specs: '8核心/16线程 游戏优化CPU', type: 'CPU' },
            { name: 'ROG STRIX B760-A GAMING', price: 1899, specs: 'Intel B760 电竞主板', type: '主板' },
            { name: 'G.SKILL Trident Z5 RGB', price: 1099, specs: '32GB DDR5 6000MHz RGB内存', type: '内存' },
            { name: 'NZXT Kraken 360 RGB', price: 1299, specs: '360mm AIO RGB水冷', type: '散热' }
        ],
        workstation: [
            { name: 'AMD Threadripper PRO 7995WX', price: 49999, specs: '96核心/192线程 工作站CPU', type: 'CPU' },
            { name: 'NVIDIA RTX 6000 Ada', price: 59999, specs: '48GB GDDR6 专业图形卡', type: '显卡' },
            { name: 'Kingston Server Premier', price: 8999, specs: '256GB DDR5 ECC内存', type: '内存' },
            { name: 'Samsung PM1743', price: 19999, specs: '15.36TB 企业级SSD', type: '存储' },
            { name: 'Fractal Design Define 7 XL', price: 1799, specs: '静音工作站机箱', type: '机箱' }
        ],
        budget: [
            { name: 'NVIDIA RTX 4060 Ti', price: 3299, specs: '8GB GDDR6 性价比显卡', type: '显卡' },
            { name: 'AMD Ryzen 5 7600X', price: 1699, specs: '6核心/12线程 性价比CPU', type: 'CPU' },
            { name: 'ASUS PRIME H610M-K', price: 699, specs: 'Intel H610 入门主板', type: '主板' },
            { name: 'Kingston FURY Beast DDR4', price: 399, specs: '16GB DDR4 3200MHz', type: '内存' },
            { name: 'Crucial P3 Plus', price: 499, specs: '1TB NVMe PCIe 4.0', type: '存储' }
        ],
        rgb: [
            { name: 'G.SKILL Trident Z5 RGB', price: 1099, specs: '32GB DDR5 6000MHz RGB内存', type: '内存' },
            { name: 'NZXT Kraken 360 RGB', price: 1299, specs: '360mm AIO RGB水冷', type: '散热' },
            { name: 'Lian Li UNI FAN SL-INF', price: 899, specs: '120mm RGB风扇三件套', type: '散热' },
            { name: 'ASUS ROG STRIX B760-A', price: 1899, specs: 'Intel B760 RGB主板', type: '主板' },
            { name: 'Lian Li O11 Dynamic EVO RGB', price: 1199, specs: '全景侧透RGB机箱', type: '机箱' }
        ]
    };
}

function displayProductsImmediately(products, categoryName) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.error('❌ 无法找到产品网格');
        return;
    }
    
    // 清空现有内容
    productsGrid.innerHTML = '';
    
    // 添加标题
    const title = document.createElement('div');
    title.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        margin-bottom: 20px;
        padding: 10px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        border-radius: 8px;
    `;
    title.innerHTML = `<h2 style="margin: 0;">${categoryName} - ${products.length} 个产品</h2>`;
    productsGrid.appendChild(title);
    
    // 添加产品卡片
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cssText = `
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 20px;
            background: white;
            transition: all 0.3s ease;
        `;
        
        const isExpensive = product.price > 5000;
        const priceColor = isExpensive ? '#f59e0b' : '#10b981';
        
        card.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    <i class="fas fa-box" style="color: white; font-size: 1.5rem;"></i>
                </div>
                <div>
                    <div style="font-weight: 600; color: #1f2937; font-size: 1.1rem;">${product.name}</div>
                    <div style="color: #6b7280; font-size: 0.9rem;">${product.type}</div>
                </div>
            </div>
            <div style="color: #6b7280; font-size: 0.9rem; margin-bottom: 15px; line-height: 1.5;">${product.specs}</div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #9ca3af; font-size: 0.85rem;">产品 #${index + 1}</span>
                <span style="font-weight: 700; color: ${priceColor}; font-size: 1.2rem;">¥${product.price}</span>
            </div>
        `;
        
        // 悬停效果
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        productsGrid.appendChild(card);
    });
    
    console.log(`✅ 显示 ${categoryName}: ${products.length} 个产品`);
}

function bindFiltersImmediately(data) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        console.warn('⚠️ 没有筛选按钮，创建新的');
        createSimpleFilters(data);
        return;
    }
    
    filterButtons.forEach(btn => {
        // 移除旧事件
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // 添加新事件
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`🏷️ 筛选: ${this.textContent}`);
            
            // 更新激活状态
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应分类
            const category = this.dataset.category;
            switch(category) {
                case 'all':
                    displayAllProducts(data);
                    break;
                case 'gaming':
                    displayProductsImmediately(data.gaming, '游戏电竞');
                    break;
                case 'workstation':
                    displayProductsImmediately(data.workstation, '工作站');
                    break;
                case 'budget':
                    displayProductsImmediately(data.budget, '性价比');
                    break;
                case 'rgb':
                    displayProductsImmediately(data.rgb, 'RGB光效');
                    break;
                default:
                    displayAllProducts(data);
            }
        });
    });
    
    console.log(`✅ 绑定 ${filterButtons.length} 个筛选按钮`);
}

function displayAllProducts(data) {
    const allProducts = [
        ...data.gaming,
        ...data.workstation,
        ...data.budget,
        ...data.rgb
    ];
    
    displayProductsImmediately(allProducts, '全部产品');
}

function createSimpleFilters(data) {
    const productsSection = document.querySelector('.products-section, #products, [class*="shop"]');
    if (!productsSection) return;
    
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 30px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 12px;
    `;
    
    const filters = [
        { id: 'all', name: '全部', count: Object.values(data).flat().length },
        { id: 'gaming', name: '游戏电竞', count: data.gaming.length },
        { id: 'workstation', name: '工作站', count: data.workstation.length },
        { id: 'budget', name: '性价比', count: data.budget.length },
        { id: 'rgb', name: 'RGB光效', count: data.rgb.length }
    ];
    
    filters.forEach(filter => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.category = filter.id;
        btn.textContent = `${filter.name} (${filter.count})`;
        
        btn.style.cssText = `
            padding: 12px 24px;
            background: ${filter.id === 'all' ? '#3b82f6' : 'white'};
            color: ${filter.id === 'all' ? 'white' : '#374151'};
            border: 2px solid ${filter.id === 'all' ? '#3b82f6' : '#d1d5db'};
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        if (filter.id === 'all') {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            container.querySelectorAll('.filter-btn').forEach(b => {
                b.style.background = 'white';
                b.style.color = '#374151';
                b.style.borderColor = '#d1d5db';
            });
            
            this.style.background = '#3b82f6';
            this.style.color = 'white';
            this.style.borderColor = '#3b82f6';
            
            if (filter.id === 'all') {
                displayAllProducts(data);
            } else {
                displayProductsImmediately(data[filter.id], filter.name);
            }
        });
        
        container.appendChild(btn);
    });
    
    // 插入到产品网格前面
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && productsGrid.parentNode) {
        productsGrid.parentNode.insertBefore(container, productsGrid);
    }
}

function showCompletionMessage(data) {
    const totalProducts = Object.values(data).flat().length;
    
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
        z-index: 10003;
        animation: slide-in 0.5s ease-out;
        max-width: 300px;
    `;
    
    message.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.5rem;">🎉 分类设备已修复！</div>
        <div style="font-size: 0.875rem; opacity: 0.9;">
            现在显示:<br>
            • 游戏电竞: ${data.gaming.length} 个<br>
            • 工作站: ${data.workstation.length} 个<br>
            • 性价比: ${data.budget.length} 个<br>
            • RGB光效: ${data.rgb.length} 个<br>
            • 总计: ${totalProducts} 个产品
        </div>
    `;
    
    document.body.appendChild(message);
    
    // 添加动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slide-in {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        #productsGrid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
            gap: 20px !important;
            margin-top: 20px !important;
        }
    `;
    document.head.appendChild(style);
    
    // 5秒后移除
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => message.remove(), 500);
    }, 5000);
    
    console.log(`📊 分类修复完成: ${totalProducts} 个产品已准备显示`);
}

console.log('🎯 最终分类修复脚本加载完成');
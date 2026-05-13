/**
 * 直接分类修复 - 确保分类有设备显示
 */

console.log('🎯 执行直接分类修复...');

// 立即执行
(function() {
    console.log('🚀 开始直接修复分类设备...');
    
    // 1. 创建分类硬件数据
    const categoryData = {
        gaming: [
            { id: 'g1', name: 'NVIDIA RTX 4090 游戏显卡', specs: '24GB GDDR6X 旗舰游戏显卡', price: 12999, brand: 'nvidia', category: 'gpu' },
            { id: 'g2', name: 'AMD Ryzen 7 7800X3D', specs: '8核心/16线程 游戏优化CPU', price: 2999, brand: 'amd', category: 'cpu' },
            { id: 'g3', name: 'ROG STRIX B760-A GAMING', specs: 'Intel B760 电竞主板', price: 1899, brand: 'asus', category: 'motherboard' },
            { id: 'g4', name: 'G.SKILL Trident Z5 RGB', specs: '32GB DDR5 6000MHz RGB内存', price: 1099, brand: 'gskill', category: 'ram' },
            { id: 'g5', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO RGB水冷', price: 1299, brand: 'nzxt', category: 'cooling' }
        ],
        workstation: [
            { id: 'w1', name: 'AMD Threadripper PRO 7995WX', specs: '96核心/192线程 工作站CPU', price: 49999, brand: 'amd', category: 'cpu' },
            { id: 'w2', name: 'NVIDIA RTX 6000 Ada', specs: '48GB GDDR6 专业图形卡', price: 59999, brand: 'nvidia', category: 'gpu' },
            { id: 'w3', name: 'Kingston Server Premier', specs: '256GB DDR5 ECC内存', price: 8999, brand: 'kingston', category: 'ram' },
            { id: 'w4', name: 'Samsung PM1743', specs: '15.36TB 企业级SSD', price: 19999, brand: 'samsung', category: 'storage' },
            { id: 'w5', name: 'Fractal Design Define 7 XL', specs: '静音工作站机箱', price: 1799, brand: 'fractal', category: 'case' }
        ],
        budget: [
            { id: 'b1', name: 'NVIDIA RTX 4060 Ti', specs: '8GB GDDR6 性价比显卡', price: 3299, brand: 'nvidia', category: 'gpu' },
            { id: 'b2', name: 'AMD Ryzen 5 7600X', specs: '6核心/12线程 性价比CPU', price: 1699, brand: 'amd', category: 'cpu' },
            { id: 'b3', name: 'ASUS PRIME H610M-K', specs: 'Intel H610 入门主板', price: 699, brand: 'asus', category: 'motherboard' },
            { id: 'b4', name: 'Kingston FURY Beast DDR4', specs: '16GB DDR4 3200MHz', price: 399, brand: 'kingston', category: 'ram' },
            { id: 'b5', name: 'Crucial P3 Plus', specs: '1TB NVMe PCIe 4.0', price: 499, brand: 'crucial', category: 'storage' }
        ],
        rgb: [
            { id: 'r1', name: 'G.SKILL Trident Z5 RGB', specs: '32GB DDR5 6000MHz RGB内存', price: 1099, brand: 'gskill', category: 'ram' },
            { id: 'r2', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO RGB水冷', price: 1299, brand: 'nzxt', category: 'cooling' },
            { id: 'r3', name: 'Lian Li UNI FAN SL-INF', specs: '120mm RGB风扇三件套', price: 899, brand: 'lianli', category: 'cooling' },
            { id: 'r4', name: 'ASUS ROG STRIX B760-A', specs: 'Intel B760 RGB主板', price: 1899, brand: 'asus', category: 'motherboard' },
            { id: 'r5', name: 'Lian Li O11 Dynamic EVO RGB', specs: '全景侧透RGB机箱', price: 1199, brand: 'lianli', category: 'case' }
        ]
    };
    
    // 2. 立即绑定筛选按钮
    setTimeout(() => {
        bindFilterButtons(categoryData);
        console.log('✅ 筛选按钮绑定完成');
    }, 500);
    
    // 3. 立即加载全部产品
    setTimeout(() => {
        loadAllProductsNow(categoryData);
        console.log('✅ 初始产品加载完成');
    }, 1000);
    
    console.log('🎉 直接分类修复初始化完成');
})();

function bindFilterButtons(categoryData) {
    console.log('🔧 绑定筛选按钮...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length === 0) {
        console.warn('⚠️ 找不到筛选按钮，创建新的');
        createFilterButtons(categoryData);
        return;
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`🏷️ 点击筛选: ${this.textContent}`);
            
            // 更新激活状态
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 加载对应分类
            const category = this.dataset.category;
            if (category === 'all') {
                loadAllProductsNow(categoryData);
            } else if (categoryData[category]) {
                loadCategoryProductsNow(category, categoryData);
            }
        });
    });
    
    console.log(`✅ 绑定 ${filterButtons.length} 个筛选按钮`);
}

function createFilterButtons(categoryData) {
    console.log('🏷️ 创建筛选按钮...');
    
    const productsSection = document.querySelector('.products-section, #products, [class*="shop"]');
    if (!productsSection) return;
    
    const container = document.createElement('div');
    container.className = 'direct-filters';
    container.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
        padding: 15px;
        background: #f8fafc;
        border-radius: 10px;
    `;
    
    const categories = [
        { id: 'all', name: '全部', count: Object.values(categoryData).flat().length },
        { id: 'gaming', name: '游戏电竞', count: categoryData.gaming.length },
        { id: 'workstation', name: '工作站', count: categoryData.workstation.length },
        { id: 'budget', name: '性价比', count: categoryData.budget.length },
        { id: 'rgb', name: 'RGB光效', count: categoryData.rgb.length }
    ];
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${cat.id === 'all' ? 'active' : ''}`;
        btn.dataset.category = cat.id;
        btn.textContent = `${cat.name} (${cat.count})`;
        
        btn.style.cssText = `
            padding: 10px 20px;
            background: ${cat.id === 'all' ? '#3b82f6' : 'white'};
            color: ${cat.id === 'all' ? 'white' : '#374151'};
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        `;
        
        btn.addEventListener('click', function() {
            container.querySelectorAll('.filter-btn').forEach(b => {
                b.style.background = 'white';
                b.style.color = '#374151';
            });
            this.style.background = '#3b82f6';
            this.style.color = 'white';
            
            if (cat.id === 'all') {
                loadAllProductsNow(categoryData);
            } else {
                loadCategoryProductsNow(cat.id, categoryData);
            }
        });
        
        container.appendChild(btn);
    });
    
    // 插入到产品网格前面
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && productsGrid.parentNode) {
        productsGrid.parentNode.insertBefore(container, productsGrid);
    } else {
        productsSection.insertBefore(container, productsSection.firstChild);
    }
}

function loadAllProductsNow(categoryData) {
    console.log('📦 加载全部产品...');
    
    const allProducts = [
        ...categoryData.gaming,
        ...categoryData.workstation,
        ...categoryData.budget,
        ...categoryData.rgb
    ];
    
    renderProductsNow(allProducts, '全部产品');
}

function loadCategoryProductsNow(category, categoryData) {
    console.log(`📦 加载${getCategoryName(category)}产品...`);
    
    const products = categoryData[category] || [];
    renderProductsNow(products, getCategoryName(category));
}

function renderProductsNow(products, categoryName) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.warn('❌ 找不到产品网格');
        return;
    }
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-box-open" style="font-size: 2rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                <h3 style="color: #6b7280;">暂无${categoryName}产品</h3>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <div style="height: 150px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <i class="fas ${getProductIcon(product.category)}" style="font-size: 2rem; color: #3b82f6;"></i>
            </div>
            <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 1.1rem;">${product.name}</h3>
            <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 10px;">${product.specs}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #6b7280; font-size: 0.9rem;">${product.brand}</span>
                <span style="font-weight: 700; color: #10b981;">¥${product.price}</span>
            </div>
        `;
        
        productsGrid.appendChild(card);
    });
    
    console.log(`✅ 显示 ${categoryName}: ${products.length} 个产品`);
}

function getCategoryName(category) {
    const names = {
        'gaming': '游戏电竞',
        'workstation': '工作站',
        'budget': '性价比',
        'rgb': 'RGB光效'
    };
    return names[category] || category;
}

function getProductIcon(category) {
    const icons = {
        cpu: 'fa-microchip',
        gpu: 'fa-gamepad',
        motherboard: 'fa-microchip',
        ram: 'fa-memory',
        storage: 'fa-hdd',
        cooling: 'fa-fan',
        case: 'fa-desktop'
    };
    return icons[category] || 'fa-box';
}

// 添加CSS样式
const style = document.createElement('style');
style.textContent = `
    #productsGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .product-card {
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 20px;
        background: white;
        transition: all 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .filter-btn {
        transition: all 0.2s ease;
    }
    
    .filter-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

console.log('🎉 直接分类修复脚本加载完成');
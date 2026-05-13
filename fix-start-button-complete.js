/**
 * 修复脚本 - 完成部分
 */

// 续接上面的函数
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

function injectHardwareList(container, hardwareData) {
    console.log('🛠️ 注入硬件列表到容器...');
    
    // 创建硬件选择器HTML
    const hardwareHTML = `
        <div class="hardware-selector">
            <div class="selector-header">
                <h2><i class="fas fa-sliders-h"></i> 硬件选择器</h2>
                <p>选择您的电脑硬件组件</p>
            </div>
            
            <div class="selector-tabs">
                <button class="tab-btn active" data-category="cpu">CPU处理器</button>
                <button class="tab-btn" data-category="gpu">显卡 GPU</button>
                <button class="tab-btn" data-category="motherboard">主板</button>
                <button class="tab-btn" data-category="ram">内存</button>
                <button class="tab-btn" data-category="storage">存储</button>
                <button class="tab-btn" data-category="cooling">散热</button>
                <button class="tab-btn" data-category="psu">电源</button>
                <button class="tab-btn" data-category="case">机箱</button>
            </div>
            
            <div class="selector-content">
                <div class="hardware-list" id="hardwareList">
                    <!-- 硬件项目将在这里动态加载 -->
                </div>
                
                <div class="config-summary">
                    <h3><i class="fas fa-clipboard-list"></i> 配置摘要</h3>
                    <div class="summary-content">
                        <div class="summary-item">
                            <span>CPU处理器:</span>
                            <span id="selectedCpu">未选择</span>
                            <span class="component-price">¥0</span>
                        </div>
                        <div class="summary-item">
                            <span>显卡:</span>
                            <span id="selectedGpu">未选择</span>
                            <span class="component-price">¥0</span>
                        </div>
                        <div class="summary-item">
                            <span>主板:</span>
                            <span id="selectedMotherboard">未选择</span>
                            <span class="component-price">¥0</span>
                        </div>
                        <div class="summary-item">
                            <span>内存:</span>
                            <span id="selectedRam">未选择</span>
                            <span class="component-price">¥0</span>
                        </div>
                        <div class="summary-item">
                            <span>存储:</span>
                            <span id="selectedStorage">未选择</span>
                            <span class="component-price">¥0</span>
                        </div>
                        <div class="summary-item">
                            <span>散热:</span>
                            <span id="selectedCooling">未选择</span>
                            <span class="component-price">¥0</span>
                        </div>
                        <div class="summary-item">
                            <span>电源:</span>
                            <span id="selectedPsu">未选择</span>
                            <span class="component-price">¥0</span>
                        </div>
                        <div class="summary-item">
                            <span>机箱:</span>
                            <span id="selectedCase">未选择</span>
                            <span class="component-price">¥0</span>
                        </div>
                        <div class="summary-total">
                            <span>总计:</span>
                            <span id="totalPrice">¥0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = hardwareHTML;
    
    // 重新初始化硬件选择器
    setTimeout(() => {
        initHardwareSelectorNow();
    }, 100);
}

function createDefaultTabs(hardwareData) {
    console.log('🏷️ 创建默认标签...');
    
    const selectorSection = document.querySelector('.hardware-selector, #configurator, [class*="config"]');
    if (!selectorSection) return;
    
    // 创建标签容器
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'selector-tabs';
    tabsContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
        padding: 10px;
        background: #f8fafc;
        border-radius: 8px;
    `;
    
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach((category, index) => {
        const tab = document.createElement('button');
        tab.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        tab.dataset.category = category;
        tab.textContent = getCategoryName(category);
        tab.style.cssText = `
            padding: 10px 20px;
            background: ${index === 0 ? '#3b82f6' : 'white'};
            color: ${index === 0 ? 'white' : '#374151'};
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        `;
        
        tab.addEventListener('click', function() {
            // 更新激活状态
            tabsContainer.querySelectorAll('.tab-btn').forEach(b => {
                b.style.background = 'white';
                b.style.color = '#374151';
            });
            this.style.background = '#3b82f6';
            this.style.color = 'white';
            
            // 加载硬件数据
            loadHardwareCategory(category, hardwareData);
        });
        
        tabsContainer.appendChild(tab);
    });
    
    // 插入到硬件选择器前面
    const hardwareList = document.getElementById('hardwareList');
    if (hardwareList && hardwareList.parentNode) {
        hardwareList.parentNode.insertBefore(tabsContainer, hardwareList);
    }
}

function initProductsGridNow() {
    console.log('🛍️ 初始化产品商城...');
    
    const productsGrid = document.getElementById('productsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!productsGrid) {
        console.warn('⚠️ 找不到产品网格');
        return;
    }
    
    // 创建简单的产品数据
    const productData = [
        { id: 'p1', name: 'NVIDIA RTX 5090', category: 'gpu', price: 19999, specs: '32GB GDDR7 旗舰显卡', brand: 'nvidia' },
        { id: 'p2', name: 'AMD Ryzen 9 9850X3D', category: 'cpu', price: 6999, specs: '24核心/48线程 3D V-Cache', brand: 'amd' },
        { id: 'p3', name: 'ROG MAXIMUS Z890 EXTREME', category: 'motherboard', price: 8999, specs: 'Intel Z890 E-ATX 旗舰主板', brand: 'asus' },
        { id: 'p4', name: 'G.SKILL Trident Z5 RGB 8000', category: 'ram', price: 3999, specs: '64GB DDR5 8000MHz', brand: 'gskill' },
        { id: 'p5', name: 'Samsung 990 PRO 4TB', category: 'storage', price: 2999, specs: '4TB NVMe PCIe 5.0', brand: 'samsung' },
        { id: 'p6', name: 'NZXT Kraken Elite 360 RGB', category: 'cooling', price: 1999, specs: '360mm AIO LCD屏水冷', brand: 'nzxt' }
    ];
    
    // 初始加载产品
    loadProductsToGrid(productData);
    
    // 绑定筛选事件
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                
                // 更新激活状态
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // 筛选产品
                let filteredProducts = productData;
                if (category === 'ultra') {
                    filteredProducts = productData.filter(p => p.price > 5000);
                } else if (category === 'gaming') {
                    filteredProducts = productData.filter(p => p.category === 'gpu' || p.name.includes('RGB'));
                }
                
                loadProductsToGrid(filteredProducts);
            });
        });
    }
    
    console.log('✅ 产品商城初始化完成');
}

function loadProductsToGrid(products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>暂无产品</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const isUltra = product.price > 5000;
        const ultraBadge = isUltra ? '<span class="ultra-badge">💎 超高端</span>' : '';
        
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
    
    // 绑定产品按钮事件
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productName = this.closest('.product-card').querySelector('.product-title').textContent;
                alert(`✅ 已添加 "${productName}" 到购物车`);
            });
        });
        
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productName = this.closest('.product-card').querySelector('.product-title').textContent;
                alert(`📋 产品详情: ${productName}`);
            });
        });
    }, 100);
    
    console.log(`🛒 加载 ${products.length} 个产品`);
}

// 添加CSS样式
function addFixStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 按钮修复样式 */
        #startBuildingBtn {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        #startBuildingBtn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
        }
        
        /* 硬件选择器样式 */
        .hardware-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 10px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .hardware-item:hover {
            border-color: #3b82f6;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }
        
        .hardware-item.selected {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.05);
        }
        
        .hardware-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
        }
        
        .hardware-icon i {
            font-size: 1.5rem;
            color: white;
        }
        
        .hardware-info {
            flex: 1;
        }
        
        .hardware-name {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 5px;
            font-size: 1.1rem;
        }
        
        .hardware-specs {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }
        
        .hardware-brand {
            color: #9ca3af;
            font-size: 0.85rem;
        }
        
        .hardware-price {
            font-weight: 700;
            color: #10b981;
            font-size: 1.2rem;
        }
        
        /* 超高端徽章 */
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
        
        /* 产品卡片样式 */
        .product-card {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            background: white;
            transition: all 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .product-image {
            height: 180px;
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
        
        .product-content {
            padding: 20px;
        }
        
        .product-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .product-specs {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .product-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 0.85rem;
        }
        
        .product-brand {
            color: #6b7280;
            font-weight: 500;
        }
        
        .product-category {
            color: #3b82f6;
            font-weight: 500;
        }
        
        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #10b981;

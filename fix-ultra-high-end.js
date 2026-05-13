/**
 * 添加超高端硬件 - 5070、5080、5090显卡和9800X3D、9850X3D处理器
 */

class UltraHighEndHardware {
    constructor() {
        this.ultraHighEndData = this.createUltraHighEndData();
        this.init();
    }
    
    createUltraHighEndData() {
        return {
            // 超高端CPU处理器
            cpu: [
                // 现有CPU基础上添加
                { id: 'cpu-ultra1', name: 'AMD Ryzen 9 9850X3D', specs: '24核心/48线程 4.5-6.0GHz 3D V-Cache', price: 6999, brand: 'amd', category: 'ultra-high-end', rgb: true },
                { id: 'cpu-ultra2', name: 'AMD Ryzen 9 9800X3D', specs: '20核心/40线程 4.4-5.8GHz 3D V-Cache', price: 5999, brand: 'amd', category: 'ultra-high-end', rgb: true },
                { id: 'cpu-ultra3', name: 'Intel Core i9-15900KS', specs: '32核心/48线程 3.5-6.5GHz', price: 7999, brand: 'intel', category: 'ultra-high-end', rgb: true },
                { id: 'cpu-ultra4', name: 'AMD Threadripper PRO 7995WX', specs: '96核心/192线程 2.5-5.1GHz', price: 49999, brand: 'amd', category: 'workstation-ultra', rgb: false }
            ],
            
            // 超高端显卡
            gpu: [
                // 现有GPU基础上添加
                { id: 'gpu-ultra1', name: 'NVIDIA RTX 5090', specs: '32GB GDDR7 旗舰显卡', price: 19999, brand: 'nvidia', category: 'ultra-high-end', rgb: true },
                { id: 'gpu-ultra2', name: 'NVIDIA RTX 5080', specs: '20GB GDDR7 高端显卡', price: 12999, brand: 'nvidia', category: 'ultra-high-end', rgb: true },
                { id: 'gpu-ultra3', name: 'NVIDIA RTX 5070 Ti', specs: '16GB GDDR7 高性能显卡', price: 8999, brand: 'nvidia', category: 'ultra-high-end', rgb: true },
                { id: 'gpu-ultra4', name: 'NVIDIA RTX 5070', specs: '12GB GDDR7 高端显卡', price: 6999, brand: 'nvidia', category: 'ultra-high-end', rgb: true },
                { id: 'gpu-ultra5', name: 'AMD Radeon RX 8950 XTX', specs: '32GB GDDR7 旗舰显卡', price: 14999, brand: 'amd', category: 'ultra-high-end', rgb: true },
                { id: 'gpu-ultra6', name: 'NVIDIA RTX 4090 Ti', specs: '28GB GDDR6X 限量版', price: 16999, brand: 'nvidia', category: 'ultra-high-end', rgb: true }
            ],
            
            // 超高端主板
            motherboard: [
                { id: 'mb-ultra1', name: 'ROG MAXIMUS Z890 EXTREME', specs: 'Intel Z890 E-ATX 旗舰主板', price: 8999, brand: 'asus', socket: 'lga1851', category: 'ultra-high-end', rgb: true },
                { id: 'mb-ultra2', name: 'MSI MEG X870E ACE', specs: 'AMD X870E E-ATX 旗舰主板', price: 7999, brand: 'msi', socket: 'am5', category: 'ultra-high-end', rgb: true },
                { id: 'mb-ultra3', name: 'GIGABYTE Z890 AORUS XTREME', specs: 'Intel Z890 E-ATX 水冷主板', price: 9999, brand: 'gigabyte', socket: 'lga1851', category: 'ultra-high-end', rgb: true },
                { id: 'mb-ultra4', name: 'ASUS ROG STRIX X870E-E GAMING', specs: 'AMD X870E ATX 电竞主板', price: 4999, brand: 'asus', socket: 'am5', category: 'ultra-high-end', rgb: true }
            ],
            
            // 超高端内存
            ram: [
                { id: 'ram-ultra1', name: 'G.SKILL Trident Z5 RGB 8000', specs: '64GB (2x32GB) DDR5 8000MHz', price: 3999, brand: 'gskill', speed: 8000, category: 'ultra-high-end', rgb: true },
                { id: 'ram-ultra2', name: 'CORSAIR Dominator Platinum RGB', specs: '128GB (4x32GB) DDR5 7200MHz', price: 5999, brand: 'corsair', speed: 7200, category: 'ultra-high-end', rgb: true },
                { id: 'ram-ultra3', name: 'TeamGroup T-Force Delta RGB', specs: '96GB (2x48GB) DDR5 6800MHz', price: 3499, brand: 'teamgroup', speed: 6800, category: 'ultra-high-end', rgb: true },
                { id: 'ram-ultra4', name: 'Kingston FURY Renegade RGB', specs: '64GB (2x32GB) DDR5 7600MHz', price: 4299, brand: 'kingston', speed: 7600, category: 'ultra-high-end', rgb: true }
            ],
            
            // 超高端存储
            storage: [
                { id: 'ssd-ultra1', name: 'Samsung 990 PRO 4TB', specs: '4TB NVMe PCIe 5.0', price: 2999, brand: 'samsung', type: 'nvme', capacity: 4000, category: 'ultra-high-end', rgb: false },
                { id: 'ssd-ultra2', name: 'WD Black SN1000X', specs: '4TB NVMe PCIe 5.0', price: 2799, brand: 'wd', type: 'nvme', capacity: 4000, category: 'ultra-high-end', rgb: false },
                { id: 'ssd-ultra3', name: 'Seagate FireCuda 540', specs: '4TB NVMe PCIe 5.0', price: 3199, brand: 'seagate', type: 'nvme', capacity: 4000, category: 'ultra-high-end', rgb: false },
                { id: 'ssd-ultra4', name: 'Crucial T700 Pro', specs: '4TB NVMe PCIe 5.0', price: 2899, brand: 'crucial', type: 'nvme', capacity: 4000, category: 'ultra-high-end', rgb: false }
            ],
            
            // 超高端散热
            cooling: [
                { id: 'cool-ultra1', name: 'NZXT Kraken Elite 360 RGB', specs: '360mm AIO LCD屏水冷', price: 1999, brand: 'nzxt', type: 'aio', category: 'ultra-high-end', rgb: true },
                { id: 'cool-ultra2', name: 'Corsair iCUE LINK H170i LCD', specs: '420mm AIO LCD屏水冷', price: 2299, brand: 'corsair', type: 'aio', category: 'ultra-high-end', rgb: true },
                { id: 'cool-ultra3', name: 'EK-Quantum Velocity²', specs: '定制分体水冷套件', price: 3999, brand: 'ekwb', type: 'custom', category: 'ultra-high-end', rgb: true },
                { id: 'cool-ultra4', name: 'Alphacool Eisbaer Aurora', specs: '360mm AIO 全金属水冷', price: 1799, brand: 'alphacool', type: 'aio', category: 'ultra-high-end', rgb: true }
            ],
            
            // 超高端电源
            psu: [
                { id: 'psu-ultra1', name: 'Seasonic PRIME TX-1600', specs: '1600W 80 PLUS Titanium', price: 3999, brand: 'seasonic', wattage: 1600, category: 'ultra-high-end', rgb: false },
                { id: 'psu-ultra2', name: 'Corsair AX1600i', specs: '1600W 80 PLUS Titanium', price: 4299, brand: 'corsair', wattage: 1600, category: 'ultra-high-end', rgb: false },
                { id: 'psu-ultra3', name: 'be quiet! Dark Power Pro 13', specs: '1600W 80 PLUS Titanium', price: 3799, brand: 'bequiet', wattage: 1600, category: 'ultra-high-end', rgb: false },
                { id: 'psu-ultra4', name: 'Thermaltake Toughpower GF3 1650W', specs: '1650W 80 PLUS Titanium', price: 4499, brand: 'thermaltake', wattage: 1650, category: 'ultra-high-end', rgb: true }
            ],
            
            // 超高端机箱
            case: [
                { id: 'case-ultra1', name: 'Lian Li O11 Vision RGB', specs: '全景侧透双腔旗舰机箱', price: 1999, brand: 'lianli', size: 'full-tower', category: 'ultra-high-end', rgb: true },
                { id: 'case-ultra2', name: 'HYTE Y70 Touch', specs: '14寸触摸屏全景机箱', price: 2999, brand: 'hyte', size: 'full-tower', category: 'ultra-high-end', rgb: true },
                { id: 'case-ultra3', name: 'Corsair 7000D AIRFLOW RGB', specs: '全塔式RGB气流机箱', price: 1899, brand: 'corsair', size: 'full-tower', category: 'ultra-high-end', rgb: true },
                { id: 'case-ultra4', name: 'Fractal Design Define 7 XL', specs: '静音全塔式旗舰机箱', price: 1799, brand: 'fractal', size: 'full-tower', category: 'ultra-high-end', rgb: false }
            ]
        };
    }
    
    init() {
        console.log('🚀 初始化超高端硬件数据库...');
        
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyUltraHighEnd());
        } else {
            this.applyUltraHighEnd();
        }
    }
    
    applyUltraHighEnd() {
        console.log('💎 应用超高端硬件扩展...');
        
        // 1. 合并到现有硬件数据库
        this.mergeWithExistingData();
        
        // 2. 创建超高端筛选分类
        this.createUltraHighEndFilter();
        
        // 3. 更新UI显示
        this.updateUIForUltraHighEnd();
        
        console.log('✅ 超高端硬件扩展完成');
    }
    
    mergeWithExistingData() {
        // 合并到硬件选择器数据
        if (window.hardwareExpander && window.hardwareExpander.hardwareData) {
            Object.keys(this.ultraHighEndData).forEach(category => {
                if (window.hardwareExpander.hardwareData[category]) {
                    // 添加超高端硬件到现有数据前面
                    window.hardwareExpander.hardwareData[category] = [
                        ...this.ultraHighEndData[category],
                        ...window.hardwareExpander.hardwareData[category]
                    ];
                    console.log(`✅ 合并 ${category}: 新增 ${this.ultraHighEndData[category].length} 个超高端项目`);
                }
            });
        }
        
        // 合并到产品商城数据
        if (window.hardwareExpander && window.hardwareExpander.productData) {
            // 创建超高端产品分类
            const ultraProducts = [];
            Object.values(this.ultraHighEndData).forEach(categoryProducts => {
                ultraProducts.push(...categoryProducts);
            });
            
            window.hardwareExpander.productData.ultra = ultraProducts;
            
            // 更新全部产品
            window.hardwareExpander.combineAllProducts();
            
            console.log(`🛒 新增超高端产品: ${ultraProducts.length} 个`);
        }
    }
    
    createUltraHighEndFilter() {
        // 创建超高端筛选按钮
        setTimeout(() => {
            const filterContainer = document.querySelector('.filter-buttons');
            if (filterContainer && !document.querySelector('.filter-btn[data-category="ultra"]')) {
                const ultraButton = document.createElement('button');
                ultraButton.className = 'filter-btn';
                ultraButton.dataset.category = 'ultra';
                ultraButton.innerHTML = `
                    超高端 <span class="filter-count">${this.ultraHighEndData.cpu.length + this.ultraHighEndData.gpu.length}</span>
                `;
                
                // 插入到第一个位置
                filterContainer.insertBefore(ultraButton, filterContainer.firstChild);
                
                // 添加点击事件
                ultraButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // 更新按钮状态
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    ultraButton.classList.add('active');
                    
                    // 加载超高端产品
                    this.loadUltraHighEndProducts();
                    
                    // 显示提示
                    this.showUltraHighEndToast();
                });
                
                console.log('✅ 创建超高端筛选按钮');
            }
        }, 1000);
    }
    
    loadUltraHighEndProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        // 获取所有超高端产品
        const ultraProducts = [];
        Object.values(this.ultraHighEndData).forEach(categoryProducts => {
            ultraProducts.push(...categoryProducts);
        });
        
        if (ultraProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-crown" style="font-size: 3rem; color: #f59e0b; margin-bottom: 1rem;"></i>
                    <h3 style="color: #f59e0b; margin-bottom: 0.5rem;">暂无超高端产品</h3>
                    <p style="color: #9ca3af;">正在更新产品数据库...</p>
                </div>
            `;
            return;
        }
        
        productsGrid.innerHTML = '';
        
        ultraProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card ultra-high-end';
            productCard.dataset.id = product.id;
            productCard.dataset.category = product.category;
            
            // 超高端特殊标识
            const ultraBadge = '<span class="ultra-badge">💎 超高端</span>';
            const rgbBadge = product.rgb ? '<span class="rgb-badge">RGB</span>' : '';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <i class="fas ${this.getProductIcon(product.category)}"></i>
                    ${ultraBadge}
                    ${rgbBadge}
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-specs">${product.specs || '暂无规格信息'}</p>
                    <div class="product-meta">
                        <span class="product-brand">${product.brand || '未知品牌'}</span>
                        <span class="product-category">${this.getCategoryName(product.category)}</span>
                    </div>
                    <div class="product-price ultra-price">¥${product.price}</div>
                    <div class="product-actions">
                        <button class="btn btn-outline btn-sm view-details-btn">查看详情</button>
                        <button class="btn btn-primary btn-sm add-to-cart-btn">加入购物车</button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        console.log(`💎 加载超高端产品: ${ultraProducts.length} 个`);
    }
    
    updateUIForUltraHighEnd() {
        // 添加超高端CSS样式
        this.addUltraHighEndStyles();
        
        // 更新硬件选择器显示
        this.updateHardwareSelectorUI();
    }
    
    addUltraHighEndStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 超高端特殊样式 */
            .ultra-high-end {
                border: 2px solid transparent;
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.05
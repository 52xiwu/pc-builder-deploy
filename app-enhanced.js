/**
 * 电脑硬件销售网站 - 增强版应用逻辑（集成后端API）
 */

class PCBuilderAppEnhanced {
    constructor() {
        // 硬件数据库（从API获取）
        this.hardwareDatabase = {
            cpu: [],
            gpu: [],
            motherboard: [],
            ram: [],
            storage: [],
            cooling: [],
            psu: [],
            case: []
        };
        
        // 当前配置
        this.currentConfig = {
            cpu: null,
            gpu: null,
            motherboard: null,
            ram: null,
            storage: null,
            cooling: null,
            psu: null,
            case: null
        };
        
        // 当前选中的硬件类别
        this.currentCategory = 'cpu';
        
        // API服务
        this.api = window.apiService || new ApiService();
        
        // 用户状态
        this.currentUser = null;
        
        this.init();
    }
    
    async init() {
        console.log('🖥️ 初始化电脑硬件销售网站（增强版）...');
        
        // 检查用户登录状态
        await this.checkAuthStatus();
        
        // 绑定事件
        this.bindEvents();
        
        // 从API加载硬件数据
        await this.loadHardwareData();
        
        // 初始化硬件列表
        this.loadHardwareList();
        
        // 初始化产品网格
        await this.loadProductsGrid();
        
        // 更新配置摘要
        this.updateConfigSummary();
        
        // 更新购物车计数
        await this.updateCartCount();
        
        // 初始化用户界面
        this.updateUserUI();
        
        console.log('✅ 网站初始化完成');
    }
    
    async checkAuthStatus() {
        try {
            const result = await this.api.getCurrentUser();
            this.currentUser = result.user;
            this.updateUserUI();
            console.log('✅ 用户已登录:', this.currentUser.username);
        } catch (error) {
            console.log('ℹ️ 用户未登录');
            this.currentUser = null;
        }
    }
    
    async loadHardwareData() {
        try {
            console.log('📦 从API加载硬件数据...');
            
            // 加载所有类别的硬件
            const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case', 'monitor', 'keyboard', 'mouse', 'headset'];
            
            for (const category of categories) {
                try {
                    const result = await this.api.getHardwareByCategory(category);
                    this.hardwareDatabase[category] = result.products || [];
                    console.log(`✅ 加载 ${category}: ${this.hardwareDatabase[category].length} 个产品`);
                } catch (error) {
                    console.warn(`⚠️ 加载 ${category} 失败:`, error.message);
                    // 使用本地数据作为后备
                    this.hardwareDatabase[category] = this.getFallbackHardware(category);
                }
            }
        } catch (error) {
            console.error('❌ 加载硬件数据失败:', error);
            // 使用完整的本地数据作为后备
            this.useFallbackHardwareData();
        }
    }
    
    getFallbackHardware(category) {
        // 本地后备数据
        const fallbackData = {
            cpu: [
                { id: 1, name: 'Intel Core i9-14900K', specs: '24核心/32线程 3.2-6.0GHz', price: 4299, brand: 'intel', category: 'high-end' },
                { id: 2, name: 'AMD Ryzen 9 7950X', specs: '16核心/32线程 4.5-5.7GHz', price: 3999, brand: 'amd', category: 'high-end' }
            ],
            gpu: [
                { id: 3, name: 'NVIDIA RTX 4090', specs: '24GB GDDR6X', price: 12999, brand: 'nvidia', category: 'high-end' },
                { id: 4, name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X', price: 8499, brand: 'nvidia', category: 'high-end' }
            ],
            motherboard: [
                { id: 5, name: 'ROG MAXIMUS Z790 HERO', specs: 'Intel Z790 ATX', price: 4999, brand: 'asus', socket: 'lga1700' },
                { id: 6, name: 'MSI MEG X670E GODLIKE', specs: 'AMD X670E E-ATX', price: 6999, brand: 'msi', socket: 'am5' }
            ],
            ram: [
                { id: 7, name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz', price: 1099, brand: 'gskill', speed: 6000 },
                { id: 8, name: 'CORSAIR Dominator Platinum', specs: '64GB (2x32GB) DDR5 5600MHz', price: 2299, brand: 'corsair', speed: 5600 }
            ],
            storage: [
                { id: 9, name: 'Samsung 990 PRO', specs: '2TB NVMe PCIe 4.0', price: 1299, brand: 'samsung', type: 'nvme', capacity: 2000 },
                { id: 10, name: 'WD Black SN850X', specs: '2TB NVMe PCIe 4.0', price: 1199, brand: 'wd', type: 'nvme', capacity: 2000 }
            ],
            cooling: [
                { id: 11, name: 'NZXT Kraken 360 RGB', specs: '360mm AIO 水冷', price: 1299, brand: 'nzxt', type: 'aio' },
                { id: 12, name: 'Noctua NH-D15', specs: '双塔风冷散热器', price: 699, brand: 'noctua', type: 'air' }
            ],
            psu: [
                { id: 13, name: 'Corsair RM1000x', specs: '1000W 80 PLUS Gold', price: 1499, brand: 'corsair', wattage: 1000 },
                { id: 14, name: 'Seasonic PRIME TX-1000', specs: '1000W 80 PLUS Titanium', price: 1999, brand: 'seasonic', wattage: 1000 }
            ],
            case: [
                { id: 15, name: 'Lian Li O11 Dynamic EVO', specs: '中塔式 ATX', price: 899, brand: 'lianli', size: 'mid-tower' },
                { id: 16, name: 'Fractal Design North', specs: '胡桃木侧板机箱', price: 1099, brand: 'fractal', size: 'mid-tower' }
            ]
        };
        
        return fallbackData[category] || [];
    }
    
    useFallbackHardwareData() {
        console.log('🔄 使用本地后备数据');
        const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case', 'monitor', 'keyboard', 'mouse', 'headset'];
        categories.forEach(category => {
            this.hardwareDatabase[category] = this.getFallbackHardware(category);
        });
    }
    
    bindEvents() {
        // 导航菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavClick(e.target);
            });
        });
        
        // 购物车按钮
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.toggleCart();
            });
        }
        
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.toggleCart();
            });
        }
        
        // 开始装机按钮
        const startBuildingBtn = document.getElementById('startBuildingBtn');
        if (startBuildingBtn) {
            startBuildingBtn.addEventListener('click', () => {
                this.scrollToSection('builder');
            });
        }
        
        // 硬件分类标签
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryChange(e.target.dataset.category);
            });
        });
        
        // 加入购物车 / 立即购买：存在新版装机摘要（#summarySlots）时由 builder-controller.js 独占绑定，避免双监听读到空的 currentConfig
        const useBuilderCartUi = !!document.getElementById('summarySlots');
        const addToCartBtn = document.getElementById('addToCartBtn');
        const buyNowBtn = document.getElementById('buyNowBtn');
        if (!useBuilderCartUi) {
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    this.addCurrentConfigToCart();
                });
            }
            if (buyNowBtn) {
                buyNowBtn.addEventListener('click', () => {
                    this.buyNow();
                });
            }
        }
        
        // 保存配置按钮
        const saveConfigBtn = document.getElementById('saveConfigBtn');
        if (saveConfigBtn) {
            saveConfigBtn.addEventListener('click', () => {
                this.saveConfiguration();
            });
        }
        
        // 产品筛选
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterProducts(e.target.dataset.category);
            });
        });
        

        // 登录按钮
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.showLoginModal();
            });
        }
        
        // 注册按钮
        const registerBtn = document.getElementById('registerBtn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                this.showRegisterModal();
            });
        }
        
        // 产品详情按钮
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-details-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.showProductDetails(productCard);
                }
            }
            
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.addProductToCart(productCard);
                }
            }
        });
        
        // 兼容性检查按钮
        const checkCompatibilityBtn = document.getElementById('checkCompatibilityBtn');
        if (checkCompatibilityBtn) {
            checkCompatibilityBtn.addEventListener('click', () => {
                this.checkCompatibility();
            });
        }
    }
    
    handleNavClick(target) {
        // 移除所有active类
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // 添加active类
        target.classList.add('active');
        
        // 获取目标部分
        const href = target.getAttribute('href');
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            this.scrollToSection(sectionId);
        }
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    handleCategoryChange(category) {
        if (!category) return;
        
        // 更新当前类别
        this.currentCategory = category;
        
        // 更新标签激活状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // 加载硬件列表
        this.loadHardwareList();
    }
    
    loadHardwareList() {
        const hardwareList = document.getElementById('hardwareList');
        if (!hardwareList) return;
        
        hardwareList.innerHTML = '';
        
        const items = this.hardwareDatabase[this.currentCategory] || [];
        const SHOW_LIMIT = 20;
        
        if (items.length === 0) {
            hardwareList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-microchip"></i>
                    <p>暂无${this.getCategoryName(this.currentCategory)}数据</p>
                </div>
            `;
            return;
        }
        
        const iconMap = {
            cpu: 'fa-microchip', gpu: 'fa-gamepad', motherboard: 'fa-microchip',
            ram: 'fa-memory', storage: 'fa-hdd', cooling: 'fa-fan',
            psu: 'fa-bolt', case: 'fa-desktop', monitor: 'fa-desktop',
            keyboard: 'fa-keyboard', mouse: 'fa-mouse', headset: 'fa-headset'
        };
        
        const showItems = items.slice(0, SHOW_LIMIT);
        const hiddenItems = items.slice(SHOW_LIMIT);
        
        showItems.forEach(item => {
            const hardwareItem = document.createElement('div');
            hardwareItem.className = 'hardware-item';
            hardwareItem.dataset.id = item.id;
            hardwareItem.dataset.category = this.currentCategory;
            
            if (this.currentConfig[this.currentCategory]?.id === item.id) {
                hardwareItem.classList.add('selected');
            }
            
            hardwareItem.innerHTML = `
                <div class="hardware-icon">
                    <i class="fas ${iconMap[this.currentCategory] || 'fa-microchip'}"></i>
                </div>
                <div class="hardware-info">
                    <div class="hardware-name">${item.name}</div>
                    <div class="hardware-specs">${item.specs}</div>
                    <div class="hardware-brand">品牌: ${item.brand || '未知'}</div>
                </div>
                <div class="hardware-price">¥${item.price}</div>
            `;
            
            hardwareItem.addEventListener('click', () => {
                this.selectHardware(item, this.currentCategory);
            });
            
            hardwareList.appendChild(hardwareItem);
        });
        
        // 下拉展开更多
        if (hiddenItems.length > 0) {
            const dropdown = document.createElement('div');
            dropdown.className = 'hardware-more-dropdown';
            dropdown.innerHTML = `
                <button class="hardware-more-btn">
                    <i class="fas fa-chevron-down"></i> 还有 ${hiddenItems.length} 个${this.getCategoryName(this.currentCategory)}
                </button>
                <div class="hardware-more-list" style="display: none; margin-top: 0.5rem;"></div>
            `;
            
            const btn = dropdown.querySelector('.hardware-more-btn');
            const list = dropdown.querySelector('.hardware-more-list');
            let expanded = false;
            
            btn.addEventListener('click', () => {
                expanded = !expanded;
                if (expanded) {
                    list.style.display = 'block';
                    btn.innerHTML = '<i class="fas fa-chevron-up"></i> 收起';
                    if (list.children.length === 0) {
                        hiddenItems.forEach(item => {
                            const el = document.createElement('div');
                            el.className = 'hardware-item';
                            el.dataset.id = item.id;
                            el.dataset.category = this.currentCategory;
                            if (this.currentConfig[this.currentCategory]?.id === item.id) {
                                el.classList.add('selected');
                            }
                            el.innerHTML = `
                                <div class="hardware-icon"><i class="fas ${iconMap[this.currentCategory] || 'fa-microchip'}"></i></div>
                                <div class="hardware-info">
                                    <div class="hardware-name">${item.name}</div>
                                    <div class="hardware-specs">${item.specs}</div>
                                    <div class="hardware-brand">品牌: ${item.brand || '未知'}</div>
                                </div>
                                <div class="hardware-price">¥${item.price}</div>
                            `;
                            el.addEventListener('click', () => {
                                this.selectHardware(item, this.currentCategory);
                            });
                            list.appendChild(el);
                        });
                    }
                } else {
                    list.style.display = 'none';
                    btn.innerHTML = '<i class="fas fa-chevron-down"></i> 还有 ' + hiddenItems.length + ' 个' + this.getCategoryName(this.currentCategory);
                }
            });
            
            hardwareList.appendChild(dropdown);
        }
    }
    
    selectHardware(item, category) {
        // 更新当前配置
        this.currentConfig[category] = item;
        
        // 更新硬件列表选中状态
        document.querySelectorAll('.hardware-item').forEach(hwItem => {
            hwItem.classList.remove('selected');
            if (hwItem.dataset.id == item.id && hwItem.dataset.category === category) {
                hwItem.classList.add('selected');
            }
        });
        
        // 更新配置摘要
        this.updateConfigSummary();
        
        // 更新兼容性检查
        this.updateCompatibility();
    }
    
    updateConfigSummary() {
        // 更新每个组件的显示
        Object.keys(this.currentConfig).forEach(category => {
            const item = this.currentConfig[category];
            const element = document.getElementById(`selected${this.capitalizeFirst(category)}`);
            const priceElement = element?.parentElement?.querySelector('.component-price');
            
            if (element && item) {
                element.textContent = item.name;
                if (priceElement) {
                    priceElement.textContent = `¥${item.price}`;
                }
            } else if (element) {
                element.textContent = '未选择';
                if (priceElement) {
                    priceElement.textContent = '¥0';
                }
            }
        });
        
        // 更新总价
        this.updateTotalPrice();
    }
    
    updateTotalPrice() {
        let total = 0;
        Object.values(this.currentConfig).forEach(item => {
            if (item && item.price) {
                total += item.price;
            }
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
    
    async loadProductsGrid() {
        try {
            const productsGrid = document.getElementById('productsGrid');
            if (!productsGrid) return;
            
            // 从API获取产品
            const result = await this.api.getProducts({ limit: 8 });
            const products = result.products || [];
            
            if (products.length === 0) {
                productsGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <i class="fas fa-box-open" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                        <h3 style="color: #6b7280; margin-bottom: 0.5rem;">暂无产品</h3>
                        <p style="color: #9ca3af;">请稍后查看或联系管理员</p>
                    </div>
                `;
                return;
            }
            
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.dataset.id = product.id;
                productCard.dataset.category = product.category;
                
                productCard.innerHTML = `
                    <div class="product-image">
                        <i class="fas ${this.getProductIcon(product.category)}"></i>
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-specs">${product.specs || product.description || '暂无规格信息'}</p>
                        <div class="product-price">¥${product.price}</div>
                        <div class="product-actions">
                            <button class="btn btn-outline btn-sm view-details-btn">查看详情</button>
                            <button class="btn btn-primary btn-sm add-to-cart-btn">加入购物车</button>
                        </div>
                    </div>
                `;
                
                productsGrid.appendChild(productCard);
            });
        } catch (error) {
            console.error('加载产品网格失败:', error);
            // 显示错误状态
            const productsGrid = document.getElementById('productsGrid');
            if (productsGrid) {
                productsGrid.innerHTML = `
                    <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                        <h3 style="color: #ef4444; margin-bottom: 0.5rem;">加载失败</h3>
                        <p style="color: #9ca3af;">请检查网络连接后刷新重试</p>
                    </div>
                `;
            }
        }
    }
}

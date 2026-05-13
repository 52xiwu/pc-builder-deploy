/**
 * 修复网站交互功能
 */

class InteractionFixer {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🔧 修复网站交互功能...');
        
        // 修复所有按钮点击事件
        this.fixButtonClicks();
        
        // 修复硬件选择器
        this.fixHardwareSelector();
        
        // 修复产品详情查看
        this.fixProductDetails();
        
        // 修复导航滚动
        this.fixNavigation();
        
        console.log('✅ 交互功能修复完成');
    }
    
    fixButtonClicks() {
        // 修复"开始装机"按钮
        const startBuildingBtn = document.getElementById('startBuildingBtn');
        if (startBuildingBtn) {
            startBuildingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖥️ 开始装机按钮点击');
                this.scrollToSection('builder');
            });
        } else {
            console.warn('⚠️ 找不到开始装机按钮');
        }
        
        // 购物车按钮：已在 app-enhanced.js (PCBuilderAppEnhanced.bindEvents) 中绑定
        // fix-interactions.js 不重复绑定，避免两次 toggleCart() 互相抵消
        
        // 修复登录按钮
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log('🔐 登录按钮点击');
                this.showLoginModal();
            });
        }
        
        // 修复硬件分类标签（仅处理样式和滚动，选取逻辑由 PCBuilderApp 处理）
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.currentTarget;
                const category = tab.dataset.category;
                if (!category) return;
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                tab.classList.add('active');
                
                // 调用 app 加载对应硬件列表
                if (window.app && typeof window.app.handleCategoryChange === 'function') {
                    window.app.handleCategoryChange(category);
                }
                
                this.scrollToSection('builder');
            });
        });
        
        // 修复产品筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.dataset.category;
                console.log(`🔍 筛选产品: ${category}`);
                
                // 移除所有active类
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                
                // 添加active类
                e.target.classList.add('active');
                
                // 筛选产品
                this.filterProducts(category);
            });
        });
        
        // ── 热门硬件区：事件委托（重绘后仍然有效）──────────────────────
        // 同时：加入购物车 + 同步到右侧装机配置单
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;

            // 查看详情
            if (e.target.closest('.btn-card-detail')) {
                e.preventDefault();
                e.stopPropagation();
                this.showProductDetails(card);
                return;
            }

            // 加入购物车 → 同步配置单
            if (e.target.closest('.btn-card-cart')) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🛒 加入购物车');
                this.addToCart(card);
                return;
            }
        });
        
        // 热门预设：事件委托（localStorage 重绘预设卡片后仍有效；避免 e.target 非按钮无 dataset）
        const PRESET_SERVICE_FEE = 299;
        const onPresetSectionClick = (e) => {
            const root = document.getElementById('presetsContainer');
            if (!root || !root.contains(e.target)) return;
            const trigger = e.target.closest('button[data-preset], .btn-select-preset');
            if (!trigger) return;
            const preset = (trigger.dataset.preset || '').trim();
            if (!preset) {
                e.preventDefault();
                e.stopPropagation();
                this.showNotification('配置无效', '请管理员在后台为该预设填写 presetId（如 office / gaming）', 'warning');
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const addCart = trigger.getAttribute('data-action') === 'addToCart';
            console.log(`⚙️ 预设操作: ${preset}${addCart ? ' +一键加购' : ' 载入装机单'}`);
            this.loadPreset(preset, { addToCart: addCart, serviceFee: PRESET_SERVICE_FEE });
        };
        // 使用捕获阶段，避免其它 document 冒泡监听先 stopPropagation 导致预设按钮「点了没反应」
        document.addEventListener('click', onPresetSectionClick, true);
    }
    
    fixHardwareSelector() {
        // 事件委托：确保左侧选择商品时右侧配置摘要正确更新
        const hardwareList = document.getElementById('hardwareList');
        if (hardwareList) {
            hardwareList.addEventListener('click', (e) => {
                const item = e.target.closest('.hardware-item');
                if (!item || !window.app) return;
                const category = item.dataset.category;
                const itemId = item.dataset.id;
                if (!category || !itemId) return;
                const items = window.app.hardwareDatabase?.[category];
                const selectedItem = items?.find(i => i.id === itemId);
                if (selectedItem) {
                    window.app.selectHardware(selectedItem, category);
                }
            });
        }
    }
    
    fixProductDetails() {
        // 为所有产品卡片添加点击事件
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是按钮，不触发卡片点击
                if (e.target.closest('.product-actions')) {
                    return;
                }
                
                console.log('📱 查看产品详情');
                this.showProductDetails(card);
            });
        });
    }
    
    showProductDetails(card) {
        // 同步到装机区摘要（builder-controller），避免用户以为「详情里也没有配置」
        this.syncCardToBuilder(card);

        const title = card.querySelector('.product-title')?.textContent || '产品详情';
        const specs = card.querySelector('.product-specs')?.textContent || '暂无规格信息';
        const price = card.querySelector('.product-price')?.textContent || '价格待定';
        
        // 创建详情模态框
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            ">
                <div class="modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                ">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #111827;">${title}</h3>
                    <button class="close-modal" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #6b7280;
                    ">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="product-image" style="
                        height: 200px;
                        background: #f3f4f6;
                        border-radius: 0.75rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 1.5rem;
                    ">
                        <i class="fas fa-microchip" style="font-size: 3rem; color: #2563eb;"></i>
                    </div>
                    
                    <div class="product-info" style="margin-bottom: 1.5rem;">
                        <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">产品规格</h4>
                        <p style="color: #6b7280; line-height: 1.6;">${specs}</p>
                    </div>
                    
                    <div class="product-price" style="
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #2563eb;
                        margin-bottom: 1.5rem;
                    ">
                        ${price}
                    </div>
                    
                    <div class="modal-actions" style="display: flex; gap: 1rem;">
                        <button class="btn btn-outline" style="flex: 1;">加入对比</button>
                        <button class="btn btn-primary" style="flex: 1;">加入购物车</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // 加入购物车按钮事件
        modal.querySelector('.btn-primary').addEventListener('click', () => {
            this.addToCart(card);
            modal.remove();
        });
    }
    
    addToCart(card) {
        const title = card.querySelector('.product-title')?.textContent || '产品';
        const priceEl = card.querySelector('.product-price');
        const priceStr = priceEl ? priceEl.textContent : '0';
        const price = parseInt(String(priceStr).replace(/[^\d]/g, '')) || 0;

        // 真正写入 localStorage（调用 features.js 的 addSingleToCart）
        if (typeof window.addSingleToCart === 'function') {
            window.addSingleToCart(title, price);
        } else if (typeof addSingleToCart === 'function') {
            addSingleToCart(title, price);
        } else if (window.features && typeof window.features.addSingleToCart === 'function') {
            window.features.addSingleToCart(title, price);
        } else {
            // fallback：本地存储
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.push({ id: 'item_' + Date.now(), type: 'single', name: title, price, quantity: 1 });
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        
        // 显示添加成功提示
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-check-circle" style="font-size: 1.25rem;"></i>
                <div>
                    <div style="font-weight: 600;">已加入购物车</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">${title} - ${price}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        console.log(`🛒 加入购物车: ${title} - ${price}`);
        this.syncCardToBuilder(card);
    }

    // ── 将热门卡片同步到右侧装机配置单 ────────────────────────────────
    syncCardToBuilder(card) {
        const title = card.querySelector('.product-title')?.textContent?.trim() || '';
        if (!title) return;

        // 优先走 builder-controller（右侧 #summarySlots 由 state.config 驱动）
        if (typeof window.pcBuilderApplyHotProductTitle === 'function') {
            window.pcBuilderApplyHotProductTitle(title);
            return;
        }

        if (!window.app || typeof window.app.selectHardware !== 'function') return;

        // 标题→category 映射（热门区已按类型静态写入）
        const titleLower = title.toLowerCase();
        const isGanssHermes = /ganss|高斯|高瑟|hermes/i.test(title);

        // 如果是「高斯/高瑟 Hermes」键盘，映射到 keyboard
        if (isGanssHermes) {
            const item = { id: 'keyboard-ganss-hermes', name: title, category: 'keyboard' };
            window.app.selectHardware(item, 'keyboard');
            return;
        }

        // 通用：按产品名称/品牌关键词匹配类目
        const categoryMap = [
            { keywords: ['ryzen', 'core', 'cpu', '锐龙', '酷睿', 'amd', 'intel'], category: 'cpu' },
            { keywords: ['rtx', 'geforce', 'radeon', 'rx ', 'gpu', '显卡', 'nvidia'], category: 'gpu' },
            { keywords: ['主板', 'z790', 'b760', 'x670e', 'b550', 'motherboard', 'rog'], category: 'motherboard' },
            { keywords: ['内存', 'ddr', 'ram', 'trident', 'dominator'], category: 'ram' },
            { keywords: ['ssd', 'nvme', '硬盘', 'storage', '980', '990', 'wd_', 'sn'], category: 'storage' },
            { keywords: ['散热', '水冷', 'cooling', 'kraken', 'frost'], category: 'cooling' },
            { keywords: ['电源', 'psu', 'seasonic', 'watt'], category: 'psu' },
            { keywords: ['机箱', 'case', 'o11', 'lian li'], category: 'case' },
            { keywords: ['显示器', 'monitor', 'pg32', 'swift'], category: 'monitor' },
            { keywords: ['键盘', 'keyboard', 'keycap', '键'], category: 'keyboard' },
            { keywords: ['鼠标', 'mouse', '鼠标', 'pro x'], category: 'mouse' },
            { keywords: ['耳机', 'headset', '耳麦', '耳机', 'audio'], category: 'headset' },
        ];

        for (const { keywords, category } of categoryMap) {
            if (keywords.some(kw => titleLower.includes(kw))) {
                const priceEl = card.querySelector('.product-price');
                const price = priceEl
                    ? parseInt(String(priceEl.textContent).replace(/[^\d]/g, '')) || 0
                    : 0;
                const item = { id: `hot-${Date.now()}`, name: title, category, price };
                window.app.selectHardware(item, category);
                return;
            }
        }
    }
    
    filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (category === 'all') {
                product.style.display = 'block';
            } else {
                // 这里可以根据产品类别进行筛选
                // 暂时显示所有产品
                product.style.display = 'block';
            }
        });
        
        // 显示筛选提示
        console.log(`🔍 筛选显示: ${category === 'all' ? '全部产品' : category + '类别'}`);
    }
    
    loadPreset(preset, options = {}) {
        const { addToCart: alsoAddToCart, serviceFee = 299 } = options;
        const presets = {
            office: {
                name: '入门办公配置',
                price: '¥4,299',
                // 合理搭配：i5-13400 + B760主板 + 入门显卡，够用且性价比高
                cpu:         { id: 'cpu-6',  name: 'Intel i5-14600K',        brand: 'Intel',    specs: '14核(6P+8E) / 5.3GHz / 125W',        price: 1899 },
                gpu:         { id: 'gpu-6',  name: 'AMD RX 7600',             brand: 'AMD',      specs: '8GB GDDR6 / 165W',                    price: 1699 },
                motherboard: { id: 'mb-5',  name: 'Gigabyte B760M AORUS',    brand: 'Gigabyte', specs: 'Intel B760 / DDR4 / LGA1700',        price: 999  },
                ram:         { id: 'ram-3',  name: 'Kingston Fury Beast 32GB', brand: 'Kingston', specs: 'DDR5-5200 / 2×16GB / CL40',        price: 699  },
                storage:     { id: 'ssd-2',  name: 'WD Black SN850X 2TB',     brand: 'WD',       specs: 'NVMe PCIe 4.0 / 7300MB/s',            price: 1099 },
                cooling:     { id: 'cool-4',  name: 'be quiet! Dark Rock Pro 4', brand: 'be quiet!', specs: '双塔风冷 / 250W TDP',               price: 549  },
                psu:         { id: 'psu-4',  name: 'Corsair RM750',           brand: 'Corsair',  specs: '750W / 80+ Gold / 全模组',           price: 699  },
                case:        { id: 'case-3',  name: 'NZXT H7 Flow',            brand: 'NZXT',     specs: 'ATX / 360mm冷排支持',                  price: 799  },
                monitor:     { id: 'mon-4',  name: 'Dell U2723QE',            brand: 'Dell',     specs: '27" 4K 60Hz / IPS Black / Type-C 90W', price: 3499 },
                keyboard:    { id: 'kb-4',  name: 'SteelSeries Apex Pro',   brand: 'SteelSeries', specs: 'OmniPoint 2.0轴 / 可调触发',          price: 1399 },
                mouse:      { id: 'mouse-4', name: 'SteelSeries Prime Pro',   brand: 'SteelSeries', specs: '有线 / 25000 CPI / 磁吸微动',        price: 399  },
                headset:     null,
            },
            gaming: {
                name: '主流游戏配置',
                price: '¥8,999',
                // 合理搭配：7800X3D + B650E + 4070TiS，游戏帧率与性能兼顾
                cpu:         { id: 'cpu-5',  name: 'AMD Ryzen 7 7800X3D',      brand: 'AMD',      specs: '8核16线程 / 5.0GHz / 120W 3D V-Cache', price: 2999 },
                gpu:         { id: 'gpu-3',  name: 'RTX 4070 Ti Super',       brand: 'NVIDIA',   specs: '16GB GDDR6X / 285W',                   price: 6499 },
                motherboard: { id: 'mb-3',  name: 'ROG STRIX X670E-E',        brand: 'ASUS',     specs: 'AMD X670E / DDR5 / AM5',                 price: 4499 },
                ram:         { id: 'ram-2',  name: 'Corsair Vengeance 32GB',  brand: 'Corsair',  specs: 'DDR5-6000 / 2×16GB / CL30',            price: 899  },
                storage:     { id: 'ssd-1',  name: 'Samsung 990 Pro 2TB',     brand: 'Samsung',   specs: 'NVMe PCIe 4.0 / 7450MB/s',              price: 1299 },
                cooling:     { id: 'cool-3',  name: 'Noctua NH-D15',           brand: 'Noctua',   specs: '双塔风冷 / 14cm×2风扇',                price: 699  },
                psu:         { id: 'psu-1',  name: 'Corsair RM1000x',         brand: 'Corsair',  specs: '1000W / 80+ Gold / 全模组',            price: 1199 },
                case:        { id: 'case-1',  name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li',  specs: 'ATX / 双仓设计 / 玻璃侧透',             price: 899  },
                monitor:     { id: 'mon-3',  name: 'ASUS ROG Swift 360Hz',    brand: 'ASUS',     specs: '24.5" FHD 360Hz / G-Sync',              price: 3999 },
                keyboard:    { id: 'kb-1',  name: 'Logitech G Pro X Superlight', brand: 'Logitech', specs: '无线 / 机械轴 / 紧凑87键',          price: 799  },
                mouse:      { id: 'mouse-1', name: 'Logitech G Pro X Superlight 2', brand: 'Logitech', specs: '无线 / 60g / HERO 2传感器',     price: 899  },
                headset:     { id: 'hs-2',  name: 'Corsair Virtuoso RGB XT',  brand: 'Corsair',  specs: '无线 / 18h续航 / 7.1环绕',             price: 899  },
            },
            workstation: {
                name: '4K视频编辑工作站',
                price: '¥19,999',
                // 合理搭配：i9-14900K + Z790 + 4090，生产力拉满
                cpu:         { id: 'cpu-1',  name: 'Intel Core i9-14900K',     brand: 'Intel',    specs: '24核(8P+16E) / 5.6GHz / 125W',        price: 4199 },
                gpu:         { id: 'gpu-1',  name: 'NVIDIA RTX 4090',         brand: 'NVIDIA',   specs: '24GB GDDR6X / 450W',                   price: 15999 },
                motherboard: { id: 'mb-1',  name: 'ROG MAXIMUS Z790 HERO',    brand: 'ASUS',     specs: 'Intel Z790 / DDR5 / LGA1700',            price: 4999 },
                ram:         { id: 'ram-1',  name: 'G.Skill Trident Z5 64GB',  brand: 'G.Skill',  specs: 'DDR5-6400 / 2×32GB / CL32',            price: 1899 },
                storage:     { id: 'ssd-3',  name: 'Crucial T700 2TB',        brand: 'Crucial',  specs: 'NVMe PCIe 5.0 / 12400MB/s',            price: 2499 },
                cooling:     { id: 'cool-1',  name: 'NZXT Kraken Z73 RGB',     brand: 'NZXT',     specs: '360mm AIO / LCD显示屏',                 price: 1899 },
                psu:         { id: 'psu-2',  name: 'Seasonic PRIME TX-1000',   brand: 'Seasonic', specs: '1000W / 80+ Titanium / 全模组',        price: 1899 },
                case:        { id: 'case-2',  name: 'Fractal Design Torrent',  brand: 'Fractal',  specs: 'ATX / 高气流优化 / 玻璃侧透',           price: 1299 },
                monitor:     { id: 'mon-1',  name: 'LG UltraGear 27GP950',    brand: 'LG',       specs: '27" 4K 144Hz / NanoIPS / HDMI 2.1',   price: 5999 },
                keyboard:    { id: 'kb-2',  name: 'Corsair K100 RGB',         brand: 'Corsair',  specs: 'OPX机械轴 / 全键RGB / 8ms回报率',     price: 1499 },
                mouse:      { id: 'mouse-2', name: 'Razer DeathAdder V3 Pro', brand: 'Razer',    specs: '无线 / Focus Pro 30K / 63g',           price: 699  },
                headset:     { id: 'hs-1',  name: 'Logitech G Pro X 2',       brand: 'Logitech', specs: '无线 / 50mm / Blue VO!CE麦克风',       price: 1299 },
            },
            flagship: {
                name: '极致性能旗舰',
                price: '¥29,999',
                // 合理搭配：i9-14900K + Z790 + 4090 + 128GB，旗舰天花板
                cpu:         { id: 'cpu-1',  name: 'Intel Core i9-14900K',     brand: 'Intel',    specs: '24核(8P+16E) / 5.6GHz / 125W',        price: 4199 },
                gpu:         { id: 'gpu-1',  name: 'NVIDIA RTX 4090',         brand: 'NVIDIA',   specs: '24GB GDDR6X / 450W',                   price: 15999 },
                motherboard: { id: 'mb-1',  name: 'ROG MAXIMUS Z790 HERO',   brand: 'ASUS',     specs: 'Intel Z790 / DDR5 / LGA1700',           price: 4999  },
                ram:         { id: 'ram-1',  name: 'G.Skill Trident Z5 64GB',  brand: 'G.Skill',  specs: 'DDR5-6400 / 2×32GB / CL32',            price: 1899  },
                storage:     { id: 'ssd-1',  name: 'Samsung 990 Pro 2TB',      brand: 'Samsung',  specs: 'NVMe PCIe 4.0 / 7450MB/s',             price: 1299  },
                cooling:     { id: 'cool-1',  name: 'NZXT Kraken Z73 RGB',    brand: 'NZXT',    specs: '360mm AIO / LCD显示屏',                  price: 1899  },
                psu:         { id: 'psu-1',  name: 'Corsair RM1000x',          brand: 'Corsair', specs: '1000W / 80+ Gold / 全模组',            price: 1199  },
                case:        { id: 'case-1',  name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', specs: 'ATX / 双仓设计 / 玻璃侧透',            price: 899   },
                monitor:     { id: 'mon-1',  name: 'LG UltraGear 27GP950',    brand: 'LG',      specs: '27" 4K 144Hz / NanoIPS / HDMI 2.1',    price: 5999  },
                keyboard:    { id: 'kb-2',  name: 'Corsair K100 RGB',         brand: 'Corsair', specs: 'OPX机械轴 / 全键RGB / 8ms回报率',      price: 1499  },
                mouse:      { id: 'mouse-1', name: 'Logitech G Pro X Superlight 2', brand: 'Logitech', specs: '无线 / 60g / HERO 2传感器',    price: 899   },
                headset:     { id: 'hs-4',  name: 'SteelSeries Arctis Nova Pro', brand: 'SteelSeries', specs: '有线 / 主动降噪 / DAC模块',      price: 2499  },
            },
            streaming: {
                name: '直播剪辑配置',
                price: '¥12,499',
                // 合理搭配：R9-7950X + X670E + 4070，多核+直播编码兼顾
                cpu:         { id: 'cpu-4',  name: 'AMD Ryzen 9 7950X',        brand: 'AMD',      specs: '16核32线程 / 5.7GHz / 170W',            price: 3499 },
                gpu:         { id: 'gpu-5',  name: 'RTX 4060 Ti',              brand: 'NVIDIA',   specs: '8GB GDDR6 / 165W',                    price: 2999 },
                motherboard: { id: 'mb-4',  name: 'MSI MEG X670E ACE',         brand: 'MSI',      specs: 'AMD X670E / DDR5 / AM5',                price: 4999 },
                ram:         { id: 'ram-2',  name: 'Corsair Vengeance 32GB',   brand: 'Corsair',  specs: 'DDR5-6000 / 2×16GB / CL30',            price: 899  },
                storage:     { id: 'ssd-1',  name: 'Samsung 990 Pro 2TB',     brand: 'Samsung',   specs: 'NVMe PCIe 4.0 / 7450MB/s',              price: 1299 },
                cooling:     { id: 'cool-2',  name: 'Corsair iCUE H150i Elite', brand: 'Corsair', specs: '360mm AIO / RGB',                      price: 1599 },
                psu:         { id: 'psu-3',  name: 'be quiet! Straight Power 850W', brand: 'be quiet!', specs: '850W / 80+ Gold / 半模组',       price: 899  },
                case:        { id: 'case-4',  name: 'Corsair 5000D Airflow',   brand: 'Corsair',  specs: 'ATX / 高气流 / 遮线仓门',              price: 999  },
                monitor:     { id: 'mon-2',  name: 'Samsung Odyssey G8',       brand: 'Samsung',  specs: '34" 准4K 175Hz / Mini LED / 1000R',  price: 6999 },
                keyboard:    { id: 'kb-3',  name: 'Razer BlackWidow V4 Pro',  brand: 'Razer',    specs: '绿轴 / 全键RGB / 音量轮',               price: 999  },
                mouse:      { id: 'mouse-3', name: 'Corsair Darkstar Wireless', brand: 'Corsair', specs: '无线 / 90h续航 / 90g',                 price: 599  },
                headset:     { id: 'hs-3',  name: 'Razer BlackShark V2 Pro',  brand: 'Razer',    specs: '无线 / Triforce 50mm / HyperClear',     price: 799  },
            },
            ai: {
                name: 'AI 绘图 / 大模型',
                price: '¥24,999',
                // 合理搭配：i9-14900K + Z790 + 4090 24GB + 64GB，本地 LLM / SDXL 显存够用
                cpu:         { id: 'cpu-1',  name: 'Intel Core i9-14900K',     brand: 'Intel',    specs: '24核(8P+16E) / 5.6GHz / 125W',        price: 4199 },
                gpu:         { id: 'gpu-1',  name: 'NVIDIA RTX 4090',          brand: 'NVIDIA',   specs: '24GB GDDR6X / 450W',                   price: 15999 },
                motherboard: { id: 'mb-1',  name: 'ROG MAXIMUS Z790 HERO',    brand: 'ASUS',     specs: 'Intel Z790 / DDR5 / LGA1700',            price: 4999 },
                ram:         { id: 'ram-1',  name: 'G.Skill Trident Z5 64GB',  brand: 'G.Skill',  specs: 'DDR5-6400 / 2×32GB / CL32',            price: 1899 },
                storage:     { id: 'ssd-3',  name: 'Crucial T700 2TB',        brand: 'Crucial',  specs: 'NVMe PCIe 5.0 / 12400MB/s',            price: 2499 },
                cooling:     { id: 'cool-1',  name: 'NZXT Kraken Z73 RGB',     brand: 'NZXT',     specs: '360mm AIO / LCD显示屏',                 price: 1899 },
                psu:         { id: 'psu-1',  name: 'Corsair RM1000x',          brand: 'Corsair',  specs: '1000W / 80+ Gold / 全模组',             price: 1199 },
                case:        { id: 'case-2',  name: 'Fractal Design Torrent',   brand: 'Fractal',  specs: 'ATX / 高气流优化 / 玻璃侧透',            price: 1299 },
                monitor:     { id: 'mon-4',  name: 'Dell U2723QE',            brand: 'Dell',     specs: '27" 4K 60Hz / IPS Black / Type-C 90W', price: 3499 },
                keyboard:    null,
                mouse:      null,
                headset:     null,
            }
        };

        const presetData = presets[preset];
        if (!presetData) {
            const valid = Object.keys(presets).join(', ');
            this.showNotification(
                '预设未识别',
                `没有为「${preset}」定义内置方案。后台「热门预设」的 presetId 须为：${valid}`,
                'warning'
            );
            return;
        }

        console.log(`⚙️ 加载预设: ${presetData.name}`);

        // 显示预设加载提示（暗色主题 + 青色强调）
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            background: rgba(7, 11, 20, 0.95);
            backdrop-filter: blur(16px);
            color: #ffffff;
            padding: 1rem 1.5rem;
            border-radius: 14px;
            border: 1px solid rgba(0, 242, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 242, 255, 0.15);
            z-index: 10001;
            animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 320px;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div style="
                    width: 36px; height: 36px;
                    background: rgba(0, 242, 255, 0.12);
                    border: 1px solid rgba(0, 242, 255, 0.25);
                    border-radius: 10px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(0,242,255,0.9)">
                        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/>
                    </svg>
                </div>
                <div>
                    <div style="font-weight: 600; font-size: 0.9rem;">预设配置已加载</div>
                    <div style="font-size: 0.8rem; color: rgba(0,242,255,0.85); margin-top: 2px;">${presetData.name} · ${presetData.price}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        // 方式A: 自定义 DOM 事件，父组件可监听
        const detailPayload = { presetKey: preset, ...presetData };
        const event = new CustomEvent('preset-selected', {
            detail: detailPayload,
            bubbles: true
        });
        document.dispatchEvent(event);

        // 与 builder-controller 监听器互为兜底（避免脚本顺序/缓存导致摘要未写入）
        if (typeof window.pcBuilderApplyPresetDetail === 'function') {
            try {
                window.pcBuilderApplyPresetDetail(detailPayload);
            } catch (err) {
                console.warn('[loadPreset] pcBuilderApplyPresetDetail', err);
            }
        }

        // 方式B: 直接调用全局窗口事件（方便其他脚本订阅）
        if (typeof window.onPresetSelected === 'function') {
            window.onPresetSelected(preset, presetData);
        }

        // 一键加购：优先读装机 state；若仍为空则用本预设对象直接入车（不依赖事件链）
        if (alsoAddToCart && typeof window.addConfigToCart === 'function') {
            const slots = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case', 'monitor', 'keyboard', 'mouse', 'headset'];
            const sumCfg = (cfg) => {
                let sub = 0;
                slots.forEach((k) => {
                    const it = cfg[k];
                    if (it && typeof it.price === 'number') sub += it.price;
                });
                return sub;
            };
            const hasAny = (cfg) => slots.some((k) => cfg[k] && cfg[k].name);

            let cfg = typeof window.pcBuilderGetConfig === 'function' ? window.pcBuilderGetConfig() : {};
            if (!hasAny(cfg)) {
                cfg = {};
                slots.forEach((k) => {
                    if (detailPayload[k]) cfg[k] = detailPayload[k];
                });
            }

            const sub = sumCfg(cfg);
            if (hasAny(cfg) && sub > 0) {
                window.addConfigToCart(cfg, sub + serviceFee);
                this.showNotification('已加入购物车', `${presetData.name} 整套配置已加入，可打开侧栏结算`, 'success');
            } else {
                this.showNotification('未能加购', '配置数据不完整，请刷新页面或联系管理员检查预设数据', 'warning');
            }
        }

        // 滚动到装机配置器
        this.scrollToSection('builder');
    }
    
    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('open');
        }
    }
    
    showLoginModal() {
        // 创建登录模态框
        const modal = document.createElement('div');
        modal.className = 'login-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            ">
                <div class="modal-header" style="
                    text-align: center;
                    margin-bottom: 2rem;
                ">
                    <h3 style="font-size: 1.5rem; font-weight: 600; color: #111827;">登录账户</h3>
                    <p style="color: #6b7280; margin-top: 0.5rem;">登录以保存配置和查看订单</p>
                </div>
                
                <div class="modal-body">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">邮箱</label>
                        <input type="email" placeholder="输入邮箱地址" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db;
                            border-radius: 0.5rem;
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">密码</label>
                        <input type="password" placeholder="输入密码" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 1px solid #d1d5db;
                            border-radius: 0.5rem;
                            font-size: 1rem;
                        ">
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button class="btn btn-outline" style="flex: 1;">注册</button>
                        <button class="btn btn-primary" style="flex: 1;">登录</button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 1.5rem;">
                        <button class="close-login" style="
                            background: none;
                            border: none;
                            color: #6b7280;
                            cursor: pointer;
                            font-size: 0.875rem;
                        ">稍后登录</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        modal.querySelector('.close-login').addEventListener('click', () => {
            modal.remove();
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // 登录按钮事件
        modal.querySelector('.btn-primary').addEventListener('click', () => {
            console.log('🔐 用户登录');
            modal.remove();
            
            // 显示登录成功提示
            this.showNotification('登录成功', '欢迎回来！', 'success');
        });
    }
    
    showNotification(title, message, type = 'info') {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#2563eb'
        };
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas ${icons[type]}" style="font-size: 1.25rem;"></i>
                <div>
                    <div style="font-weight: 600;">${title}</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">${message}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            console.log(`📍 滚动到: ${sectionId}`);
        } else {
            console.warn(`⚠️ 找不到章节: ${sectionId}`);
        }
    }
    
    fixNavigation() {
        // 修复导航链接点击
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    const sectionId = href.substring(1);
                    this.scrollToSection(sectionId);
                    
                    // 更新active状态
                    document.querySelectorAll('.nav-link').forEach(l => {
                        l.classList.remove('active');
                    });
                    link.classList.add('active');
                } else if (href.includes('openclaw')) {
                    console.log('🔗 打开OpenClaw');
                    window.open(href, '_blank');
                }
            });
        });
    }
}

// 仅初始化交互修复，PCBuilderApp 由 index.html 内联脚本创建
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 页面加载完成，初始化交互修复...');
    window.interactionFixer = new InteractionFixer();
});

// 导出供调试
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionFixer;
}
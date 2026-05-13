/**
 * 扩展硬件数据库 - 增加更多种类和全面的硬件选项
 */

class HardwareExpander {
    constructor() {
        this.hardwareData = this.createExpandedHardwareData();
        this.productData = this.createExpandedProductData();
        this.init();
    }
    
    createExpandedHardwareData() {
        return {
            cpu: [
                { id: 'cpu1', name: 'Intel Core i9-14900K', specs: '24核心/32线程 3.2-6.0GHz', price: 4299, brand: 'intel', category: 'high-end' },
                { id: 'cpu2', name: 'AMD Ryzen 9 7950X', specs: '16核心/32线程 4.5-5.7GHz', price: 3999, brand: 'amd', category: 'high-end' },
                { id: 'cpu3', name: 'Intel Core i7-14700K', specs: '20核心/28线程 3.4-5.6GHz', price: 3299, brand: 'intel', category: 'mid-range' },
                { id: 'cpu4', name: 'AMD Ryzen 7 7800X3D', specs: '8核心/16线程 4.2-5.0GHz', price: 2999, brand: 'amd', category: 'gaming' },
                { id: 'cpu5', name: 'Intel Core i5-14600K', specs: '14核心/20线程 3.5-5.3GHz', price: 2299, brand: 'intel', category: 'mid-range' },
                { id: 'cpu6', name: 'AMD Ryzen 5 7600X', specs: '6核心/12线程 4.7-5.3GHz', price: 1699, brand: 'amd', category: 'budget' },
                { id: 'cpu7', name: 'Intel Core i3-14100', specs: '4核心/8线程 3.5-4.7GHz', price: 1099, brand: 'intel', category: 'budget' },
                { id: 'cpu8', name: 'AMD Ryzen 5 5600G', specs: '6核心/12线程 3.9-4.4GHz', price: 999, brand: 'amd', category: 'budget' }
            ],
            gpu: [
                { id: 'gpu1', name: 'NVIDIA RTX 4090', specs: '24GB GDDR6X', price: 12999, brand: 'nvidia', category: 'high-end' },
                { id: 'gpu2', name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X', price: 8499, brand: 'nvidia', category: 'high-end' },
                { id: 'gpu3', name: 'AMD Radeon RX 7900 XTX', specs: '24GB GDDR6', price: 7999, brand: 'amd', category: 'high-end' },
                { id: 'gpu4', name: 'NVIDIA RTX 4070 Ti SUPER', specs: '16GB GDDR6X', price: 6499, brand: 'nvidia', category: 'mid-range' },
                { id: 'gpu5', name: 'AMD Radeon RX 7800 XT', specs: '16GB GDDR6', price: 4099, brand: 'amd', category: 'mid-range' },
                { id: 'gpu6', name: 'NVIDIA RTX 4060 Ti', specs: '8GB GDDR6', price: 3299, brand: 'nvidia', category: 'budget' },
                { id: 'gpu7', name: 'AMD Radeon RX 7600', specs: '8GB GDDR6', price: 2299, brand: 'amd', category: 'budget' },
                { id: 'gpu8', name: 'NVIDIA RTX 3050', specs: '8GB GDDR6', price: 1899, brand: 'nvidia', category: 'budget' }
            ],
            motherboard: [
                { id: 'mb1', name: 'ROG MAXIMUS Z790 HERO', specs: 'Intel Z790 ATX', price: 4999, brand: 'asus', socket: 'lga1700', category: 'high-end' },
                { id: 'mb2', name: 'MSI MEG X670E GODLIKE', specs: 'AMD X670E E-ATX', price: 6999, brand: 'msi', socket: 'am5', category: 'high-end' },
                { id: 'mb3', name: 'ASUS TUF GAMING B760-PLUS', specs: 'Intel B760 ATX', price: 1499, brand: 'asus', socket: 'lga1700', category: 'mid-range' },
                { id: 'mb4', name: 'GIGABYTE B650 AORUS ELITE', specs: 'AMD B650 ATX', price: 1699, brand: 'gigabyte', socket: 'am5', category: 'mid-range' },
                { id: 'mb5', name: 'ASRock B760M Steel Legend', specs: 'Intel B760 mATX', price: 1199, brand: 'asrock', socket: 'lga1700', category: 'mid-range' },
                { id: 'mb6', name: 'MSI PRO B650M-A WIFI', specs: 'AMD B650 mATX', price: 1299, brand: 'msi', socket: 'am5', category: 'mid-range' },
                { id: 'mb7', name: 'ASUS PRIME H610M-K', specs: 'Intel H610 mATX', price: 699, brand: 'asus', socket: 'lga1700', category: 'budget' },
                { id: 'mb8', name: 'GIGABYTE A520M DS3H', specs: 'AMD A520 mATX', price: 599, brand: 'gigabyte', socket: 'am4', category: 'budget' }
            ],
            ram: [
                { id: 'ram1', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz', price: 1099, brand: 'gskill', speed: 6000, category: 'high-end' },
                { id: 'ram2', name: 'CORSAIR Dominator Platinum', specs: '64GB (2x32GB) DDR5 5600MHz', price: 2299, brand: 'corsair', speed: 5600, category: 'high-end' },
                { id: 'ram3', name: 'Kingston FURY Beast', specs: '32GB (2x16GB) DDR5 5200MHz', price: 899, brand: 'kingston', speed: 5200, category: 'mid-range' },
                { id: 'ram4', name: 'TeamGroup T-Force Delta RGB', specs: '16GB (2x8GB) DDR5 6000MHz', price: 699, brand: 'teamgroup', speed: 6000, category: 'mid-range' },
                { id: 'ram5', name: 'Crucial Pro DDR5', specs: '32GB (2x16GB) DDR5 4800MHz', price: 799, brand: 'crucial', speed: 4800, category: 'mid-range' },
                { id: 'ram6', name: 'ADATA XPG Lancer RGB', specs: '16GB (2x8GB) DDR5 5600MHz', price: 599, brand: 'adata', speed: 5600, category: 'mid-range' },
                { id: 'ram7', name: 'Kingston FURY Beast DDR4', specs: '16GB (2x8GB) DDR4 3200MHz', price: 399, brand: 'kingston', speed: 3200, category: 'budget' },
                { id: 'ram8', name: 'TeamGroup Vulcan Z', specs: '16GB (2x8GB) DDR4 3600MHz', price: 349, brand: 'teamgroup', speed: 3600, category: 'budget' }
            ],
            storage: [
                { id: 'ssd1', name: 'Samsung 990 PRO', specs: '2TB NVMe PCIe 4.0', price: 1299, brand: 'samsung', type: 'nvme', capacity: 2000, category: 'high-end' },
                { id: 'ssd2', name: 'WD Black SN850X', specs: '2TB NVMe PCIe 4.0', price: 1199, brand: 'wd', type: 'nvme', capacity: 2000, category: 'high-end' },
                { id: 'ssd3', name: 'Crucial P5 Plus', specs: '1TB NVMe PCIe 4.0', price: 599, brand: 'crucial', type: 'nvme', capacity: 1000, category: 'mid-range' },
                { id: 'ssd4', name: 'Kingston KC3000', specs: '2TB NVMe PCIe 4.0', price: 1099, brand: 'kingston', type: 'nvme', capacity: 2000, category: 'mid-range' },
                { id: 'ssd5', name: 'Seagate FireCuda 530', specs: '1TB NVMe PCIe 4.0', price: 699, brand: 'seagate', type: 'nvme', capacity: 1000, category: 'mid-range' },
                { id: 'ssd6', name: 'TeamGroup Cardea Z440', specs: '2TB NVMe PCIe 4.0', price: 999, brand: 'teamgroup', type: 'nvme', capacity: 2000, category: 'mid-range' },
                { id: 'ssd7', name: 'Samsung 870 EVO', specs: '1TB SATA SSD', price: 499, brand: 'samsung', type: 'sata', capacity: 1000, category: 'budget' },
                { id: 'ssd8', name: 'Crucial MX500', specs: '1TB SATA SSD', price: 449, brand: 'crucial', type: 'sata', capacity: 1000, category: 'budget' }
            ],
            cooling: [
                { id: 'cool1', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO 水冷', price: 1299, brand: 'nzxt', type: 'aio', category: 'high-end' },
                { id: 'cool2', name: 'Noctua NH-D15', specs: '双塔风冷散热器', price: 699, brand: 'noctua', type: 'air', category: 'high-end' },
                { id: 'cool3', name: 'Corsair iCUE H150i ELITE', specs: '360mm RGB 水冷', price: 1399, brand: 'corsair', type: 'aio', category: 'high-end' },
                { id: 'cool4', name: 'be quiet! Dark Rock Pro 4', specs: '双塔风冷散热器', price: 599, brand: 'bequiet', type: 'air', category: 'mid-range' },
                { id: 'cool5', name: 'Deepcool AK620', specs: '双塔风冷散热器', price: 399, brand: 'deepcool', type: 'air', category: 'mid-range' },
                { id: 'cool6', name: 'ID-COOLING SE-224-XT', specs: '单塔风冷散热器', price: 199, brand: 'idcooling', type: 'air', category: 'budget' },
                { id: 'cool7', name: 'Thermalright Peerless Assassin', specs: '双塔风冷散热器', price: 299, brand: 'thermalright', type: 'air', category: 'mid-range' },
                { id: 'cool8', name: 'Cooler Master Hyper 212', specs: '单塔风冷散热器', price: 249, brand: 'coolermaster', type: 'air', category: 'budget' }
            ],
            psu: [
                { id: 'psu1', name: 'Corsair RM1000x', specs: '1000W 80 PLUS Gold', price: 1499, brand: 'corsair', wattage: 1000, category: 'high-end' },
                { id: 'psu2', name: 'Seasonic PRIME TX-1000', specs: '1000W 80 PLUS Titanium', price: 1999, brand: 'seasonic', wattage: 1000, category: 'high-end' },
                { id: 'psu3', name: 'be quiet! Straight Power 11', specs: '850W 80 PLUS Platinum', price: 1299, brand: 'bequiet', wattage: 850, category: 'mid-range' },
                { id: 'psu4', name: 'EVGA SuperNOVA 850 G6', specs: '850W 80 PLUS Gold', price: 1099, brand: 'evga', wattage: 850, category: 'mid-range' },
                { id: 'psu5', name: 'Cooler Master MWE Gold 750', specs: '750W 80 PLUS Gold', price: 799, brand: 'coolermaster', wattage: 750, category: 'mid-range' },
                { id: 'psu6', name: 'Seasonic FOCUS GX-650', specs: '650W 80 PLUS Gold', price: 699, brand: 'seasonic', wattage: 650, category: 'mid-range' },
                { id: 'psu7', name: 'Corsair CV650', specs: '650W 80 PLUS Bronze', price: 499, brand: 'corsair', wattage: 650, category: 'budget' },
                { id: 'psu8', name: 'EVGA 600 BR', specs: '600W 80 PLUS Bronze', price: 399, brand: 'evga', wattage: 600, category: 'budget' }
            ],
            case: [
                { id: 'case1', name: 'Lian Li O11 Dynamic EVO', specs: '中塔式 ATX', price: 899, brand: 'lianli', size: 'mid-tower', category: 'high-end' },
                { id: 'case2', name: 'Fractal Design North', specs: '胡桃木侧板机箱', price: 1099, brand: 'fractal', size: 'mid-tower', category: 'high-end' },
                { id: 'case3', name: 'NZXT H9 Flow', specs: '全景侧透双腔机箱', price: 1299, brand: 'nzxt', size: 'mid-tower', category: 'high-end' },
                { id: 'case4', name: 'Corsair 4000D Airflow', specs: '中塔式 ATX 气流优化', price: 799, brand: 'corsair', size: 'mid-tower', category: 'mid-range' },
                { id: 'case5', name: 'Phanteks Eclipse G360A', specs: '中塔式 ATX RGB', price: 699, brand: 'phanteks', size: 'mid-tower', category: 'mid-range' },
                { id: 'case6', name: 'Cooler Master MasterBox TD500', specs: '中塔式 ATX Mesh', price: 599, brand: 'coolermaster', size: 'mid-tower', category: 'mid-range' },
                { id: 'case7', name: 'Deepcool MATREXX 55', specs: '中塔式 ATX', price: 399, brand: 'deepcool', size: 'mid-tower', category: 'budget' },
                { id: 'case8', name: 'Thermaltake Versa H18', specs: '紧凑型 mATX', price: 299, brand: 'thermaltake', size: 'micro-atx', category: 'budget' }
            ]
        };
    }
    
    createExpandedProductData() {
        return {
            // 游戏电竞类别
            gaming: [
                { id: 'g1', name: 'NVIDIA RTX 4090', category: 'gpu', price: 12999, specs: '24GB GDDR6X 旗舰游戏显卡', brand: 'nvidia', rgb: true },
                { id: 'g2', name: 'AMD Ryzen 7 7800X3D', category: 'cpu', price: 2999, specs: '8核心/16线程 游戏优化处理器', brand: 'amd', rgb: false },
                { id: 'g3', name: 'G.SKILL Trident Z5 RGB', category: 'ram', price: 1099, specs: '32GB DDR5 6000MHz RGB内存', brand: 'gskill', rgb: true },
                { id: 'g4', name: 'ROG STRIX B760-A GAMING', category: 'motherboard', price: 1899, specs: 'Intel B760 ATX 电竞主板', brand: 'asus', rgb: true },
                { id: 'g5', name: 'NZXT Kraken 360 RGB', category: 'cooling', price: 1299, specs: '360mm AIO RGB水冷', brand: 'nzxt', rgb: true },
                { id: 'g6', name: 'Lian Li O11 Dynamic EVO', category: 'case', price: 899, specs: '全景侧透电竞机箱', brand: 'lianli', rgb: true },
                { id: 'g7', name: 'Corsair RM1000x', category: 'psu', price: 1499, specs: '1000W 金牌全模组电源', brand: 'corsair', rgb: false },
                { id: 'g8', name: 'Samsung 990 PRO', category: 'storage', price: 1299, specs: '2TB NVMe PCIe 4.0 SSD', brand: 'samsung', rgb: false },
                { id: 'g9', name: 'Razer Huntsman V2', category: 'peripheral', price: 1299, specs: '光学机械键盘', brand: 'razer', rgb: true },
                { id: 'g10', name: 'Logitech G Pro X Superlight', category: 'peripheral', price: 899, specs: '无线游戏鼠标', brand: 'logitech', rgb: true }
            ],
            // 工作站类别
            workstation: [
                { id: 'w1', name: 'AMD Ryzen 9 7950X', category: 'cpu', price: 3999, specs: '16核心/32线程 专业处理器', brand: 'amd', rgb: false },
                { id: 'w2', name: 'NVIDIA RTX 4080 SUPER', category: 'gpu', price: 8499, specs: '16GB GDDR6X 专业显卡', brand: 'nvidia', rgb: false },
                { id: 'w3', name: 'CORSAIR Dominator Platinum', category: 'ram', price: 2299, specs: '64GB DDR5 5600MHz 内存', brand: 'corsair', rgb: false },
                { id: 'w4', name: 'MSI MEG X670E GODLIKE', category: 'motherboard', price: 6999, specs: 'AMD X670E 旗舰主板', brand: 'msi', rgb: true },
                { id: 'w5', name: 'Noctua NH-D15', category: 'cooling', price: 699, specs: '双塔风冷散热器', brand: 'noctua', rgb: false },
                { id: 'w6', name: 'Fractal Design North', category: 'case', price: 1099, specs: '胡桃木侧板专业机箱', brand: 'fractal', rgb: false },
                { id: 'w7', name: 'Seasonic PRIME TX-1000', category: 'psu', price: 1999, specs: '1000W 钛金全模组电源', brand: 'seasonic', rgb: false },
                { id: 'w8', name: 'WD Black SN850X', category: 'storage', price: 1199, specs: '2TB NVMe PCIe 4.0 SSD', brand: 'wd', rgb: false },
                { id: 'w9', name: 'Dell UltraSharp U2723QE', category: 'monitor', price: 3999, specs: '27寸 4K 专业显示器', brand: 'dell', rgb: false },
                { id: 'w10', name: 'Wacom Cintiq Pro 27', category: 'peripheral', price: 29999, specs: '27寸 4K 绘图屏', brand: 'wacom', rgb: false }
            ],
            // 性价比类别
            budget: [
                { id: 'b1', name: 'AMD Ryzen 5 7600X', category: 'cpu', price: 1699, specs: '6核心/12线程 性价比处理器', brand: 'amd', rgb: false },
                { id: 'b2', name: 'NVIDIA RTX 4060 Ti', category: 'gpu', price: 3299, specs: '8GB GDDR6 性价比显卡', brand: 'nvidia', rgb: false },
                { id: 'b3', name: 'Kingston FURY Beast DDR4', category: 'ram', price: 399, specs: '16GB DDR4 3200MHz 内存', brand: 'kingston', rgb: false },
                { id: 'b4', name: 'ASUS PRIME H610M-K', category: 'motherboard', price: 699, specs: 'Intel H610 mATX 主板', brand: 'asus', rgb: false },
                { id: 'b5', name: 'ID-COOLING SE-224-XT', category: 'cooling', price: 199, specs: '单塔风冷散热器', brand: 'idcooling', rgb: false },
                { id: 'b6', name: 'Deepcool MATREXX 55', category: 'case', price: 399, specs: '中塔式 ATX 机箱', brand: 'deepcool', rgb: false },
                { id: 'b7', name: 'Corsair CV650', category: 'psu', price: 499, specs: '650W 铜牌电源', brand: 'corsair', rgb: false },
                { id: 'b8', name: 'Samsung 870 EVO', category: 'storage', price: 499, specs: '1TB SATA SSD', brand: 'samsung', rgb: false },
                { id: 'b9', name: 'AOC 24G2SP', category: 'monitor', price: 999, specs: '24寸 165Hz 电竞显示器', brand: 'aoc', rgb: false },
                { id: 'b10', name: 'Redragon K552', category: 'peripheral', price: 299, specs: '机械键盘', brand: 'redragon', rgb: true }
            ],
            // RGB光效类别
            rgb: [
                { id: 'r1', name: 'G.SKILL Trident Z5 RGB', category: 'ram', price: 1099, specs: '32GB DDR5 6000MHz RGB内存', brand: 'gskill', rgb: true },
                { id: 'r2', name: 'NZXT Kraken 360 RGB', category: 'cooling', price: 1299, specs: '360mm AIO RGB水冷', brand: 'nzxt', rgb: true },
                { id: 'r3', name: 'Lian Li O11 Dynamic EVO', category: 'case', price: 899, specs: '全景侧透RGB机箱', brand: 'lianli', rgb: true },
                { id: 'r4', name: 'ASUS ROG STRIX B760-A', category: 'motherboard', price: 1899, specs: 'Intel B760 RGB主板', brand: 'asus', rgb: true },
                { id: 'r5', name: 'Phanteks Neon RGB Strip', category: 'accessory', price: 199, specs: 'RGB灯条套装', brand: 'phanteks', rgb: true },
                { id: 'r6', name: 'Corsair iCUE QL120', category: 'cooling', price: 899, specs: 'RGB风扇三件套', brand: 'corsair', rgb: true },
                { id: 'r7', name: 'Razer Chroma RGB Hub', category: 'accessory', price: 499, specs: 'RGB控制器', brand: 'razer', rgb: true },
                { id: 'r8', name: 'Thermaltake Toughpower GF3', category: 'psu', price: 1299, specs: '850W 金牌RGB电源', brand: 'thermaltake', rgb: true },
                { id: 'r9', name: 'NZXT H9 Flow RGB', category: 'case', price: 1299, specs: '全景侧透RGB机箱', brand: 'nzxt', rgb: true },
                { id: 'r10', name: 'Cooler Master MasterFan MF120', category: 'cooling', price: 699, specs: 'RGB风扇套装', brand: 'coolermaster', rgb: true }
            ],
            // 全部产品（混合）
            all: []
        };
    }
    
    init() {
        console.log('🌟 初始化扩展硬件数据库...');
        
        // 组合所有产品到"全部"类别
        this.combineAllProducts();
        
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyExpansion());
        } else {
            this.applyExpansion();
        }
    }
    
    combineAllProducts() {
        // 将所有类别的产品组合到"全部"类别
        const allProducts = [];
        
        // 添加硬件选择器数据
        Object.values(this.hardwareData).forEach(categoryProducts => {
            allProducts.push(...categoryProducts);
        });
        
        // 添加商城产品数据
        Object.values(this.productData).forEach(categoryProducts => {
            if (categoryProducts.length > 0) {
                allProducts.push(...categoryProducts);
            }
        });
        
        this.productData.all = allProducts;
        console.log(`📊 总产品数量: ${allProducts.length} 个`);
    }
    
    applyExpansion() {
        console.log('🛠️ 应用硬件扩展...');
        
        // 1. 扩展硬件选择器
        this.expandHardwareSelector();
        
        // 2. 扩展产品商城
        this.expandProductsGrid();
        
        // 3. 更新筛选功能
        this.updateFilterFunctionality();
        
        console.log('✅ 硬件扩展完成');
    }
    
    expandHardwareSelector() {
        console.log('🔧 扩展硬件选择器...');
        
        // 检查是否已有硬件修复器
        if (window.hardwareFixer) {
            // 替换硬件数据
            window.hardwareFixer.hardwareData = this.hardwareData;
            console.log('✅ 已更新硬件修复器数据');
        }
        
        // 直接更新硬件列表
        this.updateHardwareListDirectly();
    }
    
    updateHardwareListDirectly() {
        const hardwareList = document.getElementById('hardwareList');
        if (!hardwareList) return;
        
        // 获取当前激活的标签
        const activeTab = document.querySelector('.tab-btn.active');
        const currentCategory = activeTab ? activeTab.dataset.category : 'cpu';
        
        // 加载当前类别的硬件
        this.loadHardwareToSelector(currentCategory);
    }
    
    loadHardwareToSelector(category) {
        const hardwareList = document.getElementById('hardwareList');
        if (!hardwareList) return;
        
        const items = this.hardwareData[category] || [];
        
        if (items.length === 0) {
            hardwareList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-microchip"></i>
                    <p>暂无${this.getCategoryName(category)}数据</p>
                </div>
            `;
            return;
        }
        
        hardwareList.innerHTML = '';
        
        items.forEach(item => {
            const hardwareItem = document.createElement('div');
            hardwareItem.className = 'hardware-item';
            hardwareItem.dataset.id = item.id;
            hardwareItem.dataset.category = category;
            hardwareItem.dataset.name = item.name;
            hardwareItem.dataset.price = item.price;
            hardwareItem.dataset.specs = item.specs;
            
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
            
            // 添加类别标签
            const categoryBadge = item.category ? `<span class="category-badge ${item.category}">${this.getCategoryLabel(item.category)}</span>` : '';
            
            hardwareItem.innerHTML = `
                <div class="hardware-icon">
                    <i class="fas ${iconMap[category]}"></i>
                </div>
                <div class="hardware-info">
                    <div class="hardware-name">${item.name} ${categoryBadge}</div>
                    <div class="hardware-specs">${item.specs}</div>
                    <div class="hardware-brand">品牌: ${item.brand || '未知'}</div>
                </div>
                <div class="hardware-price">¥${item.price}</div>
            `;
            
            hardwareList.appendChild(hardwareItem);
        });
        
        console.log(`✅ 加载 ${this.getCategoryName(category)}: ${items.length} 个项目`);
    }
    
    expandProductsGrid() {
        console.log('🛍️ 扩展产品商城...');
        
        // 初始加载全部产品
        this.loadProductsToGrid('all');
        
        // 更新筛选按钮事件
        this.updateProductFilterButtons();
    }
    
    loadProductsToGrid(category) {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        const products = category === 'all' ? 
            this.productData.all.slice(0, 20) : // 限制显示数量
            this.productData[category] || [];
        
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-box-open" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                    <h3 style="color: #6b7280; margin-bottom: 0.5rem;">暂无${this.getFilterName(category)}产品</h3>
                    <p style="color: #9ca3af;">请选择其他分类查看</p>
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
            productCard.dataset.filter = category;
            
            // 添加RGB标识
            const rgbBadge = product.rgb ? '<span class="rgb-badge">RGB</span>' : '';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <i class="fas ${this.getProductIcon(product.category)}"></i>
                    ${rgbBadge}
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-specs">${product.specs || '暂无规格信息'}</p>
                    <div class="product-meta">
                        <span class="product-brand">${product.brand || '未知品牌'}</span>
                        <span class="product-category">${this.getCategoryName(product.category)}</span>
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
        
        console.log(`🛒 加载 ${this.getFilterName(category)}: ${products.length} 个产品`);
    }
    
    updateProductFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (!filterButtons.length) return;
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const category = e.target.dataset.category;
                if (!category) return;
                
                console.log(`🔍 筛选: ${this.getFilterName(category)}`);
                
                // 更新按钮状态
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // 加载对应类别的产品
                this.loadProductsToGrid(category);
                
                // 显示筛选提示
                this.showFilterToast(this.getFilterName(category), this.productData[category]?.length || 0);
            });
        });
    }
    
    updateFilterFunctionality() {
        // 更新筛选按钮文本和数量显示
        const filters = {
            'all': '全部',
            'gaming': '游戏电竞',
            'workstation': '工作站',
            'budget': '性价比',
            'rgb': 'RGB光效'
        };
        
        Object.entries(filters).forEach(([key, name]) => {
            const count = this.productData[key]?.length || 0;
            const button = document.querySelector(`.filter-btn[data-category="${key}"]`);
            if (button) {
                button.innerHTML = `${name} <span class="filter-count">${count}</span>`;
            }
        });
    }
    
    getCategoryName(category) {
        const names = {
            cpu: 'CPU处理器',
            gpu: '显卡',
            motherboard: '主板',
            ram: '内存',
            storage: '存储',
            cooling: '散热',
            psu: '电源',
            case: '机箱',
            peripheral: '外设',
            monitor: '显示器',
            accessory: '配件'
        };
        return names[category] || category;
    }
    
    getFilterName(filter) {
        const
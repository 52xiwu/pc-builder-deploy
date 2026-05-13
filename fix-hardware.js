/**
 * 修复硬件选择器数据问题
 */

class HardwareFixer {
    constructor() {
        this.hardwareData = this.createCompleteHardwareData();
        this.init();
    }
    
    createCompleteHardwareData() {
        return {
            cpu: [
                { id: 'cpu1', name: 'Intel Core i9-14900K', specs: '24核心/32线程 3.2-6.0GHz', price: 4299, brand: 'intel' },
                { id: 'cpu2', name: 'AMD Ryzen 9 7950X', specs: '16核心/32线程 4.5-5.7GHz', price: 3999, brand: 'amd' },
                { id: 'cpu3', name: 'Intel Core i7-14700K', specs: '20核心/28线程 3.4-5.6GHz', price: 3299, brand: 'intel' },
                { id: 'cpu4', name: 'AMD Ryzen 7 7800X3D', specs: '8核心/16线程 4.2-5.0GHz', price: 2999, brand: 'amd' }
            ],
            gpu: [
                { id: 'gpu1', name: 'NVIDIA RTX 4090', specs: '24GB GDDR6X', price: 12999, brand: 'nvidia' },
                { id: 'gpu2', name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X', price: 8499, brand: 'nvidia' },
                { id: 'gpu3', name: 'AMD Radeon RX 7900 XTX', specs: '24GB GDDR6', price: 7999, brand: 'amd' },
                { id: 'gpu4', name: 'NVIDIA RTX 4070 Ti SUPER', specs: '16GB GDDR6X', price: 6499, brand: 'nvidia' }
            ],
            motherboard: [
                { id: 'mb1', name: 'ROG MAXIMUS Z790 HERO', specs: 'Intel Z790 ATX', price: 4999, brand: 'asus', socket: 'lga1700' },
                { id: 'mb2', name: 'MSI MEG X670E GODLIKE', specs: 'AMD X670E E-ATX', price: 6999, brand: 'msi', socket: 'am5' },
                { id: 'mb3', name: 'ASUS TUF GAMING B760-PLUS', specs: 'Intel B760 ATX', price: 1499, brand: 'asus', socket: 'lga1700' },
                { id: 'mb4', name: 'GIGABYTE B650 AORUS ELITE', specs: 'AMD B650 ATX', price: 1699, brand: 'gigabyte', socket: 'am5' }
            ],
            ram: [
                { id: 'ram1', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz', price: 1099, brand: 'gskill', speed: 6000 },
                { id: 'ram2', name: 'CORSAIR Dominator Platinum', specs: '64GB (2x32GB) DDR5 5600MHz', price: 2299, brand: 'corsair', speed: 5600 },
                { id: 'ram3', name: 'Kingston FURY Beast', specs: '32GB (2x16GB) DDR5 5200MHz', price: 899, brand: 'kingston', speed: 5200 },
                { id: 'ram4', name: 'TeamGroup T-Force Delta RGB', specs: '16GB (2x8GB) DDR5 6000MHz', price: 699, brand: 'teamgroup', speed: 6000 }
            ],
            storage: [
                { id: 'ssd1', name: 'Samsung 990 PRO', specs: '2TB NVMe PCIe 4.0', price: 1299, brand: 'samsung', type: 'nvme', capacity: 2000 },
                { id: 'ssd2', name: 'WD Black SN850X', specs: '2TB NVMe PCIe 4.0', price: 1199, brand: 'wd', type: 'nvme', capacity: 2000 },
                { id: 'ssd3', name: 'Crucial P5 Plus', specs: '1TB NVMe PCIe 4.0', price: 599, brand: 'crucial', type: 'nvme', capacity: 1000 },
                { id: 'ssd4', name: 'Kingston KC3000', specs: '2TB NVMe PCIe 4.0', price: 1099, brand: 'kingston', type: 'nvme', capacity: 2000 }
            ],
            cooling: [
                { id: 'cool1', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO 水冷', price: 1299, brand: 'nzxt', type: 'aio' },
                { id: 'cool2', name: 'Noctua NH-D15', specs: '双塔风冷散热器', price: 699, brand: 'noctua', type: 'air' },
                { id: 'cool3', name: 'Corsair iCUE H150i ELITE', specs: '360mm RGB 水冷', price: 1399, brand: 'corsair', type: 'aio' },
                { id: 'cool4', name: 'be quiet! Dark Rock Pro 4', specs: '双塔风冷散热器', price: 599, brand: 'bequiet', type: 'air' }
            ],
            psu: [
                { id: 'psu1', name: 'Corsair RM1000x', specs: '1000W 80 PLUS Gold', price: 1499, brand: 'corsair', wattage: 1000 },
                { id: 'psu2', name: 'Seasonic PRIME TX-1000', specs: '1000W 80 PLUS Titanium', price: 1999, brand: 'seasonic', wattage: 1000 },
                { id: 'psu3', name: 'be quiet! Straight Power 11', specs: '850W 80 PLUS Platinum', price: 1299, brand: 'bequiet', wattage: 850 },
                { id: 'psu4', name: 'EVGA SuperNOVA 850 G6', specs: '850W 80 PLUS Gold', price: 1099, brand: 'evga', wattage: 850 }
            ],
            case: [
                { id: 'case1', name: 'Lian Li O11 Dynamic EVO', specs: '中塔式 ATX', price: 899, brand: 'lianli', size: 'mid-tower' },
                { id: 'case2', name: 'Fractal Design North', specs: '胡桃木侧板机箱', price: 1099, brand: 'fractal', size: 'mid-tower' },
                { id: 'case3', name: 'NZXT H9 Flow', specs: '全景侧透双腔机箱', price: 1299, brand: 'nzxt', size: 'mid-tower' },
                { id: 'case4', name: 'Corsair 4000D Airflow', specs: '中塔式 ATX 气流优化', price: 799, brand: 'corsair', size: 'mid-tower' }
            ]
        };
    }
    
    init() {
        console.log('🔧 初始化硬件修复器...');
        
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.applyFix());
        } else {
            this.applyFix();
        }
    }
    
    applyFix() {
        console.log('🛠️ 应用硬件数据修复...');
        
        // 1. 修复硬件选择器
        this.fixHardwareSelector();
        
        // 2. 修复标签切换事件
        this.fixTabSwitching();
        
        // 3. 修复配置摘要
        this.fixConfigSummary();
        
        console.log('✅ 硬件修复完成');
    }
    
    fixHardwareSelector() {
        const hardwareList = document.getElementById('hardwareList');
        if (!hardwareList) {
            console.warn('⚠️ 找不到硬件列表容器');
            return;
        }
        
        // 初始加载CPU数据
        this.loadHardwareCategory('cpu');
        
        // 为硬件项目添加点击事件
        hardwareList.addEventListener('click', (e) => {
            const hardwareItem = e.target.closest('.hardware-item');
            if (hardwareItem) {
                this.handleHardwareClick(hardwareItem);
            }
        });
    }
    
    loadHardwareCategory(category) {
        const hardwareList = document.getElementById('hardwareList');
        if (!hardwareList) return;
        
        const items = this.hardwareData[category] || [];
        
        hardwareList.innerHTML = '';
        
        if (items.length === 0) {
            hardwareList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-microchip"></i>
                    <p>暂无${this.getCategoryName(category)}数据</p>
                </div>
            `;
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
            
            hardwareItem.innerHTML = `
                <div class="hardware-icon">
                    <i class="fas ${iconMap[category]}"></i>
                </div>
                <div class="hardware-info">
                    <div class="hardware-name">${item.name}</div>
                    <div class="hardware-specs">${item.specs}</div>
                    <div class="hardware-brand">品牌: ${item.brand || '未知'}</div>
                </div>
                <div class="hardware-price">¥${item.price}</div>
            `;
            
            hardwareList.appendChild(hardwareItem);
        });
        
        console.log(`✅ 加载 ${this.getCategoryName(category)}: ${items.length} 个项目`);
    }
    
    fixTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (!tabButtons.length) {
            console.warn('⚠️ 找不到标签按钮');
            return;
        }
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const category = e.target.dataset.category;
                if (!category) return;
                
                console.log(`🏷️ 切换到: ${this.getCategoryName(category)}`);
                
                // 移除所有active类
                tabButtons.forEach(b => b.classList.remove('active'));
                
                // 添加active类
                e.target.classList.add('active');
                
                // 加载对应类别的硬件
                this.loadHardwareCategory(category);
                
                // 更新当前类别
                this.currentCategory = category;
            });
        });
    }
    
    handleHardwareClick(hardwareItem) {
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
        this.updateConfigSummary(category, { id, name, price, specs });
        
        // 更新总价
        this.updateTotalPrice();
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
            case: '机箱'
        };
        return names[category] || category;
    }
    
    updateConfigSummary(category, item) {
        const element = document.getElementById(`selected${this.capitalizeFirst(category)}`);
        const priceElement = element?.parentElement?.querySelector('.component-price');
        
        if (element && item) {
            element.textContent = item.name;
            if (priceElement) {
                priceElement.textContent = `¥${item.price}`;
            }
        }
        
        // 显示选择提示
        this.showSelectionToast(item.name, item.price);
    }
    
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    updateTotalPrice() {
        // 获取所有选中的硬件价格
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
    
    showSelectionToast(name, price) {
        // 创建提示元素
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
        }
        
        // 3秒后自动移除
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    fixConfigSummary() {
        // 确保配置摘要区域存在
        const configSummary = document.querySelector('.config-summary');
        if (!configSummary) {
            console.warn('⚠️ 找不到配置摘要区域');
            return;
        }
        
        // 初始化所有硬件类别显示
        const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
        categories.forEach(category => {
            const element = document.getElementById(`selected${this.capitalizeFirst(category)}`);
            if (element && !element.textContent.trim()) {
                element.textContent = '未选择';
            }
        });
        
        // 初始化总价显示
        const totalElement = document.getElementById('totalPrice');
        if (totalElement && !totalElement.textContent.trim()) {
            totalElement.textContent = '¥0';
        }
    }
}

// 页面加载完成后初始化
if (typeof HardwareFixer !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 启动硬件修复器...');
        window.hardwareFixer = new HardwareFixer();
    });
}

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HardwareFixer;
}
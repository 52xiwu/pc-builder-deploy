/**
 * 修复"开始装机"按钮和硬件选择器
 */

console.log('🔧 加载按钮修复脚本...');

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 页面加载完成，开始修复...');
    
    // 1. 修复"开始装机"按钮
    fixStartBuildingButton();
    
    // 2. 立即初始化硬件选择器
    initHardwareSelectorNow();
    
    // 3. 初始化产品商城
    initProductsGridNow();
    
    console.log('🎉 按钮修复完成');
});

function fixStartBuildingButton() {
    const startButton = document.getElementById('startBuildingBtn');
    
    if (!startButton) {
        console.warn('⚠️ 找不到"开始装机"按钮');
        return;
    }
    
    console.log('✅ 找到"开始装机"按钮，添加点击事件');
    
    // 移除可能存在的旧事件
    startButton.replaceWith(startButton.cloneNode(true));
    const newButton = document.getElementById('startBuildingBtn');
    
    // 添加新的点击事件
    newButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🚀 点击"开始装机"按钮');
        
        // 滚动到硬件配置部分
        const configSection = document.getElementById('configurator');
        if (configSection) {
            configSection.scrollIntoView({ behavior: 'smooth' });
            console.log('✅ 滚动到配置器');
            
            // 确保硬件选择器显示数据
            setTimeout(() => {
                loadInitialHardwareData();
            }, 300);
        } else {
            console.warn('⚠️ 找不到配置器部分');
            // 尝试通过类名查找
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                if (section.textContent.includes('装机配置') || section.querySelector('.hardware-selector')) {
                    section.scrollIntoView({ behavior: 'smooth' });
                    console.log('✅ 找到并滚动到配置器');
                }
            });
        }
        
        // 显示点击反馈
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // 添加悬停效果
    newButton.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.5)';
    });
    
    newButton.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
    
    console.log('✅ "开始装机"按钮修复完成');
}

function initHardwareSelectorNow() {
    console.log('🔧 立即初始化硬件选择器...');
    
    // 创建简单的硬件数据
    const hardwareData = {
        cpu: [
            { id: 'cpu1', name: 'AMD Ryzen 9 9850X3D', specs: '24核心/48线程 4.5-6.0GHz', price: 6999, brand: 'amd' },
            { id: 'cpu2', name: 'AMD Ryzen 9 9800X3D', specs: '20核心/40线程 4.4-5.8GHz', price: 5999, brand: 'amd' },
            { id: 'cpu3', name: 'Intel Core i9-14900K', specs: '24核心/32线程 3.2-6.0GHz', price: 4299, brand: 'intel' },
            { id: 'cpu4', name: 'AMD Ryzen 9 7950X', specs: '16核心/32线程 4.5-5.7GHz', price: 3999, brand: 'amd' }
        ],
        gpu: [
            { id: 'gpu1', name: 'NVIDIA RTX 5090', specs: '32GB GDDR7 旗舰显卡', price: 19999, brand: 'nvidia' },
            { id: 'gpu2', name: 'NVIDIA RTX 5080', specs: '20GB GDDR7 高端显卡', price: 12999, brand: 'nvidia' },
            { id: 'gpu3', name: 'NVIDIA RTX 5070 Ti', specs: '16GB GDDR7 高性能显卡', price: 8999, brand: 'nvidia' },
            { id: 'gpu4', name: 'NVIDIA RTX 5070', specs: '12GB GDDR7 高端显卡', price: 6999, brand: 'nvidia' }
        ],
        motherboard: [
            { id: 'mb1', name: 'ROG MAXIMUS Z890 EXTREME', specs: 'Intel Z890 E-ATX 旗舰主板', price: 8999, brand: 'asus' },
            { id: 'mb2', name: 'ROG MAXIMUS Z790 HERO', specs: 'Intel Z790 ATX', price: 4999, brand: 'asus' },
            { id: 'mb3', name: 'MSI MEG X670E GODLIKE', specs: 'AMD X670E E-ATX', price: 6999, brand: 'msi' },
            { id: 'mb4', name: 'ASUS TUF GAMING B760-PLUS', specs: 'Intel B760 ATX', price: 1499, brand: 'asus' }
        ],
        ram: [
            { id: 'ram1', name: 'G.SKILL Trident Z5 RGB 8000', specs: '64GB (2x32GB) DDR5 8000MHz', price: 3999, brand: 'gskill' },
            { id: 'ram2', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz', price: 1099, brand: 'gskill' },
            { id: 'ram3', name: 'CORSAIR Dominator Platinum', specs: '64GB (2x32GB) DDR5 5600MHz', price: 2299, brand: 'corsair' },
            { id: 'ram4', name: 'Kingston FURY Beast', specs: '32GB (2x16GB) DDR5 5200MHz', price: 899, brand: 'kingston' }
        ],
        storage: [
            { id: 'ssd1', name: 'Samsung 990 PRO 4TB', specs: '4TB NVMe PCIe 5.0', price: 2999, brand: 'samsung' },
            { id: 'ssd2', name: 'Samsung 990 PRO', specs: '2TB NVMe PCIe 4.0', price: 1299, brand: 'samsung' },
            { id: 'ssd3', name: 'WD Black SN850X', specs: '2TB NVMe PCIe 4.0', price: 1199, brand: 'wd' },
            { id: 'ssd4', name: 'Crucial P5 Plus', specs: '1TB NVMe PCIe 4.0', price: 599, brand: 'crucial' }
        ],
        cooling: [
            { id: 'cool1', name: 'NZXT Kraken Elite 360 RGB', specs: '360mm AIO LCD屏水冷', price: 1999, brand: 'nzxt' },
            { id: 'cool2', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO 水冷', price: 1299, brand: 'nzxt' },
            { id: 'cool3', name: 'Noctua NH-D15', specs: '双塔风冷散热器', price: 699, brand: 'noctua' },
            { id: 'cool4', name: 'Corsair iCUE H150i ELITE', specs: '360mm RGB 水冷', price: 1399, brand: 'corsair' }
        ],
        psu: [
            { id: 'psu1', name: 'Seasonic PRIME TX-1600', specs: '1600W 80 PLUS Titanium', price: 3999, brand: 'seasonic' },
            { id: 'psu2', name: 'Corsair RM1000x', specs: '1000W 80 PLUS Gold', price: 1499, brand: 'corsair' },
            { id: 'psu3', name: 'Seasonic PRIME TX-1000', specs: '1000W 80 PLUS Titanium', price: 1999, brand: 'seasonic' },
            { id: 'psu4', name: 'be quiet! Straight Power 11', specs: '850W 80 PLUS Platinum', price: 1299, brand: 'bequiet' }
        ],
        case: [
            { id: 'case1', name: 'Lian Li O11 Vision RGB', specs: '全景侧透双腔旗舰机箱', price: 1999, brand: 'lianli' },
            { id: 'case2', name: 'Lian Li O11 Dynamic EVO', specs: '中塔式 ATX', price: 899, brand: 'lianli' },
            { id: 'case3', name: 'Fractal Design North', specs: '胡桃木侧板机箱', price: 1099, brand: 'fractal' },
            { id: 'case4', name: 'NZXT H9 Flow', specs: '全景侧透双腔机箱', price: 1299, brand: 'nzxt' }
        ]
    };
    
    // 查找硬件选择器元素
    const hardwareList = document.getElementById('hardwareList');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (!hardwareList) {
        console.warn('⚠️ 找不到硬件列表容器');
        // 尝试创建或查找
        setTimeout(() => {
            const configSection = document.querySelector('.hardware-selector, #configurator, [class*="config"]');
            if (configSection) {
                console.log('✅ 找到配置器区域，尝试注入硬件列表');
                injectHardwareList(configSection, hardwareData);
            }
        }, 500);
        return;
    }
    
    console.log('✅ 找到硬件列表容器，初始化数据');
    
    // 初始加载CPU数据
    loadHardwareCategory('cpu', hardwareData);
    
    // 绑定标签切换事件
    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                if (category) {
                    // 更新激活状态
                    tabButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 加载对应类别的硬件
                    loadHardwareCategory(category, hardwareData);
                    
                    console.log(`🏷️ 切换到: ${getCategoryName(category)}`);
                }
            });
        });
    } else {
        console.warn('⚠️ 找不到标签按钮，创建默认标签');
        createDefaultTabs(hardwareData);
    }
    
    // 绑定硬件点击事件
    hardwareList.addEventListener('click', function(e) {
        const hardwareItem = e.target.closest('.hardware-item');
        if (hardwareItem) {
            handleHardwareClick(hardwareItem);
        }
    });
    
    console.log('✅ 硬件选择器初始化完成');
}

function loadInitialHardwareData() {
    console.log('📦 加载初始硬件数据...');
    initHardwareSelectorNow();
}

function loadHardwareCategory(category, hardwareData) {
    const hardwareList = document.getElementById('hardwareList');
    if (!hardwareList) return;
    
    const items = hardwareData[category] || [];
    
    hardwareList.innerHTML = '';
    
    if (items.length === 0) {
        hardwareList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-microchip"></i>
                <p>暂无${getCategoryName(category)}数据</p>
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
        
        // 超高端标识
        const isUltra = item.price > 5000 || item.name.includes('5090') || item.name.includes('9850') || item.name.includes('9800');
        const ultraBadge = isUltra ? '<span class="ultra-badge">💎 超高端</span>' : '';
        
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
    

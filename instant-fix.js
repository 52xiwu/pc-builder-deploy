/**
 * 即时修复 - 直接解决按钮和硬件选择器问题
 */

console.log('⚡ 加载即时修复脚本...');

// 立即执行，不等待DOMContentLoaded
(function() {
    console.log('🚀 开始即时修复...');
    
    // 1. 立即修复"开始装机"按钮
    const startButton = document.getElementById('startBuildingBtn');
    if (startButton) {
        console.log('✅ 找到"开始装机"按钮');
        
        // 移除旧事件，添加新事件
        const newButton = startButton.cloneNode(true);
        startButton.parentNode.replaceChild(newButton, startButton);
        
        document.getElementById('startBuildingBtn').onclick = function(e) {
            e.preventDefault();
            console.log('🚀 点击"开始装机"按钮');
            
            // 滚动到硬件配置部分
            const configSection = document.querySelector('#configurator, .hardware-selector, [class*="builder"]');
            if (configSection) {
                configSection.scrollIntoView({ behavior: 'smooth' });
                console.log('✅ 滚动到配置器');
                
                // 立即加载硬件数据
                loadHardwareNow();
            } else {
                console.warn('⚠️ 找不到配置器，尝试查找section');
                document.querySelectorAll('section').forEach(section => {
                    if (section.innerHTML.includes('hardware') || section.innerHTML.includes('装机')) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
            
            // 按钮动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 150);
        };
        
        console.log('✅ "开始装机"按钮修复完成');
    } else {
        console.warn('⚠️ 未找到"开始装机"按钮');
    }
    
    // 2. 立即加载硬件数据
    setTimeout(loadHardwareNow, 500);
    
    console.log('🎉 即时修复初始化完成');
})();

function loadHardwareNow() {
    console.log('📦 立即加载硬件数据...');
    
    const hardwareList = document.getElementById('hardwareList');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (!hardwareList) {
        console.warn('❌ 找不到硬件列表容器');
        return;
    }
    
    console.log(`✅ 找到硬件列表，标签按钮: ${tabButtons.length} 个`);
    
    // 创建硬件数据
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
    
    // 加载CPU数据（默认）
    renderHardware('cpu', hardwareData.cpu);
    
    // 绑定标签点击事件
    tabButtons.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            
            // 更新激活状态
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 加载对应硬件
            const category = this.dataset.category;
            if (category && hardwareData[category]) {
                renderHardware(category, hardwareData[category]);
                console.log(`🏷️ 切换到: ${getCategoryName(category)}`);
            }
        };
    });
    
    // 绑定硬件点击事件
    hardwareList.onclick = function(e) {
        const item = e.target.closest('.hardware-item');
        if (item) {
            const name = item.dataset.name;
            const price = item.dataset.price;
            
            console.log(`✅ 选择: ${name} (¥${price})`);
            
            // 更新选中状态
            hardwareList.querySelectorAll('.hardware-item').forEach(i => {
                i.classList.remove('selected');
            });
            item.classList.add('selected');
            
            // 更新配置摘要
            updateConfig(item.dataset.category, name, price);
            
            // 显示提示
            showToast(`已选择: ${name} - ¥${price}`);
        }
    };
    
    console.log('✅ 硬件数据加载完成');
}

function renderHardware(category, items) {
    const hardwareList = document.getElementById('hardwareList');
    if (!hardwareList) return;
    
    hardwareList.innerHTML = '';
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'hardware-item';
        div.dataset.id = item.id;
        div.dataset.category = category;
        div.dataset.name = item.name;
        div.dataset.price = item.price;
        div.dataset.specs = item.specs;
        
        const isUltra = item.price > 5000 || item.name.includes('5090') || item.name.includes('9850');
        const ultraBadge = isUltra ? '<span style="background:gold;color:black;padding:2px 8px;border-radius:10px;font-size:12px;margin-left:8px;">💎 超高端</span>' : '';
        
        div.innerHTML = `
            <div style="width:50px;height:50px;background:#3b82f6;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-right:15px;">
                <i class="fas ${getIcon(category)}" style="color:white;font-size:1.5rem;"></i>
            </div>
            <div style="flex:1;">
                <div style="font-weight:600;color:#1f2937;margin-bottom:5px;font-size:1.1rem;">
                    ${item.name} ${ultraBadge}
                </div>
                <div style="color:#6b7280;font-size:0.9rem;margin-bottom:5px;">${item.specs}</div>
                <div style="color:#9ca3af;font-size:0.85rem;">品牌: ${item.brand}</div>
            </div>
            <div style="font-weight:700;color:#10b981;font-size:1.2rem;">¥${item.price}</div>
        `;
        
        hardwareList.appendChild(div);
    });
    
    console.log(`✅ 渲染 ${getCategoryName(category)}: ${items.length} 个项目`);
}

function getIcon(category) {
    const icons = {
        cpu: 'fa-microchip',
        gpu: 'fa-gamepad',
        motherboard: 'fa-microchip',
        ram: 'fa-memory',
        storage: 'fa-hdd',
        cooling: 'fa-fan',
        psu: 'fa-bolt',
        case: 'fa-desktop'
    };
    return icons[category] || 'fa-box';
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

function updateConfig(category, name, price) {
    const element = document.getElementById(`selected${capitalize(category)}`);
    if (element) {
        element.textContent = name;
        
        // 更新价格
        const priceElement = element.parentElement.querySelector('.component-price');
        if (priceElement) {
            priceElement.textContent = `¥${price}`;
        }
    }
    
    // 更新总价
    updateTotalPrice();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll('.hardware-item.selected').forEach(item => {
        total += parseFloat(item.dataset.price) || 0;
    });
    
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.textContent = `¥${total}`;
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position:fixed; bottom:20px; right:20px;
        background:#10b981; color:white; padding:1rem 1.5rem;
        border-radius:0.5rem; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);
        z-index:10001; animation:slideIn 0.3s ease-out;
        display:flex; align-items:center; gap:0.75rem;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-check-circle" style="font-size:1.25rem;"></i>
        <div>
            <div style="font-weight:600;">已选择</div>
            <div style="font-size:0.875rem;opacity:0.9;">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 添加CSS动画
if (!document.querySelector('#instant-fix-animations')) {
    const style = document.createElement('style');
    style.id = 'instant-fix-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .hardware-item {
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .hardware-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .hardware-item.selected {
            border-color: #3b82f6 !important;
            background: rgba(59, 130, 246, 0.05) !important;
        }
    `;
    document.head.appendChild(style);
}

console.log('🎉 即时修复脚本加载完成');
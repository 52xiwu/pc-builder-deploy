/**
 * 修复总价不累计问题
 */

console.log('💰 修复总价计算问题...');

// 立即执行
(function() {
    console.log('🧮 初始化总价修复...');
    
    // 存储已选择的硬件和价格
    window.selectedHardware = {
        cpu: { name: null, price: 0 },
        gpu: { name: null, price: 0 },
        motherboard: { name: null, price: 0 },
        ram: { name: null, price: 0 },
        storage: { name: null, price: 0 },
        cooling: { name: null, price: 0 },
        psu: { name: null, price: 0 },
        case: { name: null, price: 0 }
    };
    
    // 服务费
    const SERVICE_FEE = 299;
    
    // 初始化总价显示
    updateTotalPrice();
    
    // 监听硬件选择事件
    setTimeout(() => {
        bindHardwareSelection();
        console.log('✅ 硬件选择监听已绑定');
    }, 500);
    
    console.log('🎉 总价修复初始化完成');
})();

function bindHardwareSelection() {
    console.log('🔗 绑定硬件选择事件...');
    
    // 方法1: 监听硬件列表点击
    const hardwareList = document.getElementById('hardwareList');
    if (hardwareList) {
        hardwareList.addEventListener('click', function(e) {
            const item = e.target.closest('.hardware-item');
            if (item) {
                const category = item.dataset.category;
                const name = item.dataset.name;
                const price = parseFloat(item.dataset.price) || 0;
                
                console.log(`✅ 选择: ${category} - ${name} (¥${price})`);
                
                // 更新选择状态
                updateSelectedHardware(category, name, price);
                
                // 更新UI显示
                updateComponentDisplay(category, name, price);
                
                // 更新总价
                updateTotalPrice();
                
                // 显示选择提示
                showSelectionToast(name, price);
            }
        });
        console.log('✅ 硬件列表点击事件已绑定');
    }
    
    // 方法2: 监听标签切换（如果硬件列表内容会变化）
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 标签切换时重新绑定硬件点击事件
            setTimeout(() => {
                bindHardwareItems();
            }, 300);
        });
    });
    
    // 方法3: 直接绑定所有硬件项目
    bindHardwareItems();
}

function bindHardwareItems() {
    console.log('📋 绑定所有硬件项目...');
    
    const hardwareItems = document.querySelectorAll('.hardware-item');
    hardwareItems.forEach(item => {
        // 移除旧事件
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // 添加新事件
        newItem.addEventListener('click', function() {
            const category = this.dataset.category;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price) || 0;
            
            console.log(`🎯 直接选择: ${category} - ${name} (¥${price})`);
            
            // 更新选择状态
            updateSelectedHardware(category, name, price);
            
            // 更新UI显示
            updateComponentDisplay(category, name, price);
            
            // 更新总价
            updateTotalPrice();
            
            // 显示选择提示
            showSelectionToast(name, price);
            
            // 更新选中状态
            hardwareItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    console.log(`✅ 绑定 ${hardwareItems.length} 个硬件项目`);
}

function updateSelectedHardware(category, name, price) {
    if (window.selectedHardware[category]) {
        window.selectedHardware[category].name = name;
        window.selectedHardware[category].price = price;
        console.log(`📝 更新 ${category}: ${name} = ¥${price}`);
    }
}

function updateComponentDisplay(category, name, price) {
    // 更新组件显示
    const elementId = `selected${capitalize(category)}`;
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = name;
        
        // 更新价格显示
        const priceElement = element.parentElement.querySelector('.component-price');
        if (priceElement) {
            priceElement.textContent = `¥${price}`;
        }
    }
    
    // 如果没有找到，尝试其他可能的ID
    const altElement = document.querySelector(`[data-component="${category}"] .component-selected`);
    if (altElement) {
        altElement.textContent = name;
    }
}

function updateTotalPrice() {
    console.log('🧮 计算总价...');
    
    // 计算硬件总价
    let hardwareTotal = 0;
    Object.values(window.selectedHardware).forEach(hardware => {
        hardwareTotal += hardware.price;
    });
    
    console.log(`📊 硬件总价: ¥${hardwareTotal}`);
    
    // 更新硬件总价显示
    const hardwareTotalElement = document.getElementById('hardwareTotal');
    if (hardwareTotalElement) {
        hardwareTotalElement.textContent = `¥${hardwareTotal}`;
    }
    
    // 计算总计（硬件+服务费）
    const grandTotal = hardwareTotal + SERVICE_FEE;
    
    // 更新总计显示
    const grandTotalElement = document.getElementById('grandTotal');
    if (grandTotalElement) {
        grandTotalElement.textContent = `¥${grandTotal}`;
    }
    
    // 更新其他可能的总价元素
    const otherTotalElements = document.querySelectorAll('#totalPrice, .total-price, [class*="total"]');
    otherTotalElements.forEach(el => {
        if (el.id !== 'hardwareTotal' && el.id !== 'grandTotal') {
            el.textContent = `¥${hardwareTotal}`;
        }
    });
    
    console.log(`💰 总计: ¥${grandTotal} (硬件: ¥${hardwareTotal} + 服务费: ¥${SERVICE_FEE})`);
    
    // 显示价格更新提示
    if (hardwareTotal > 0) {
        showPriceUpdateToast(hardwareTotal, grandTotal);
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showSelectionToast(name, price) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3b82f6;
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
            <div style="font-weight: 600;">已选择硬件</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">${name} - ¥${price}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showPriceUpdateToast(hardwareTotal, grandTotal) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
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
        <i class="fas fa-calculator" style="font-size: 1.25rem;"></i>
        <div>
            <div style="font-weight: 600;">价格已更新</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">
                硬件: ¥${hardwareTotal}<br>
                总计: ¥${grandTotal}
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 添加CSS动画
if (!document.querySelector('#price-fix-animations')) {
    const style = document.createElement('style');
    style.id = 'price-fix-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .hardware-item.selected {
            border-color: #3b82f6 !important;
            background: rgba(59, 130, 246, 0.05) !important;
            position: relative;
        }
        
        .hardware-item.selected::after {
            content: "✓";
            position: absolute;
            top: 10px;
            right: 10px;
            width: 24px;
            height: 24px;
            background: #10b981;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .total-amount {
            font-weight: 700;
            color: #10b981;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .total-amount.updating {
            animation: pricePulse 0.5s ease;
        }
        
        @keyframes pricePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); color: #f59e0b; }
        }
    `;
    document.head.appendChild(style);
}

// 添加价格更新动画函数
function animatePriceUpdate(element) {
    if (element) {
        element.classList.add('updating');
        setTimeout(() => {
            element.classList.remove('updating');
        }, 500);
    }
}

// 测试函数：模拟选择硬件
function testPriceCalculation() {
    console.log('🧪 测试价格计算...');
    
    // 模拟选择一些硬件
    const testSelections = [
        { category: 'cpu', name: '测试CPU', price: 2999 },
        { category: 'gpu', name: '测试显卡', price: 8999 },
        { category: 'ram', name: '测试内存', price: 1099 }
    ];
    
    testSelections.forEach((selection, index) => {
        setTimeout(() => {
            console.log(`🧪 模拟选择: ${selection.category} - ¥${selection.price}`);
            updateSelectedHardware(selection.category, selection.name, selection.price);
            updateComponentDisplay(selection.category, selection.name, selection.price);
            updateTotalPrice();
        }, index * 1000);
    });
    
    setTimeout(() => {
        console.log('✅ 价格计算测试完成');
        const hardwareTotal = 2999 + 8999 + 1099;
        const grandTotal = hardwareTotal + 299;
        console.log(`📊 预期结果: 硬件 ¥${hardwareTotal}, 总计 ¥${grandTotal}`);
    }, 4000);
}

// 自动运行测试（仅用于调试）
setTimeout(() => {
    console.log('🔍 检查价格计算状态...');
    const hardwareTotalElement = document.getElementById('hardwareTotal');
    const grandTotalElement = document.getElementById('grandTotal');
    
    if (hardwareTotalElement && grandTotalElement) {
        console.log('✅ 找到价格元素:', {
            hardwareTotal: hardwareTotalElement.textContent,
            grandTotal: grandTotalElement.textContent
        });
    } else {
        console.warn('⚠️ 未找到价格元素');
    }
}, 2000);

console.log('🎉 总价修复脚本加载完成');
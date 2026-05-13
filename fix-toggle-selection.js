/**
 * 修复硬件选择切换功能 - 点击已选中的硬件可以取消选择
 */

console.log('🔄 修复选择切换功能...');

// 立即执行
(function() {
    console.log('🎯 初始化选择切换修复...');
    
    // 存储选择状态
    window.toggleSelection = {
        selectedItems: {}, // 存储每个类别当前选中的硬件ID
        init: function() {
            // 初始化所有硬件类别为未选择
            const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
            categories.forEach(category => {
                this.selectedItems[category] = null;
            });
            console.log('✅ 选择状态初始化完成');
        },
        
        // 切换选择状态
        toggle: function(category, itemId, itemName, itemPrice) {
            console.log(`🔄 切换选择: ${category} - ${itemName} (ID: ${itemId})`);
            
            const currentSelection = this.selectedItems[category];
            
            if (currentSelection === itemId) {
                // 如果点击的是已选中的项目，则取消选择
                console.log(`➖ 取消选择: ${category} - ${itemName}`);
                this.selectedItems[category] = null;
                return false; // 表示取消选择
            } else {
                // 选择新的项目
                console.log(`✅ 选择: ${category} - ${itemName}`);
                this.selectedItems[category] = itemId;
                return true; // 表示选择
            }
        },
        
        // 获取当前选择状态
        getStatus: function(category) {
            return this.selectedItems[category];
        },
        
        // 清除所有选择
        clearAll: function() {
            Object.keys(this.selectedItems).forEach(category => {
                this.selectedItems[category] = null;
            });
            console.log('🧹 清除所有选择');
        }
    };
    
    // 初始化
    window.toggleSelection.init();
    
    // 绑定切换事件
    setTimeout(() => {
        bindToggleSelectionEvents();
        console.log('✅ 切换事件绑定完成');
    }, 500);
    
    // 添加清除按钮
    setTimeout(() => {
        addClearSelectionButton();
    }, 1000);
    
    console.log('🎉 选择切换修复初始化完成');
})();

function bindToggleSelectionEvents() {
    console.log('🔗 绑定选择切换事件...');
    
    // 获取所有硬件项目
    const hardwareItems = document.querySelectorAll('.hardware-item');
    
    if (hardwareItems.length === 0) {
        console.warn('⚠️ 未找到硬件项目，等待后重试');
        setTimeout(bindToggleSelectionEvents, 1000);
        return;
    }
    
    hardwareItems.forEach(item => {
        // 移除旧事件
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // 添加切换选择事件
        newItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const category = this.dataset.category;
            const itemId = this.dataset.id || this.dataset.name || Math.random().toString(36).substr(2, 9);
            const itemName = this.dataset.name || this.textContent.trim();
            const itemPrice = parseFloat(this.dataset.price) || 0;
            
            // 如果没有ID，创建一个
            if (!this.dataset.id) {
                this.dataset.id = itemId;
            }
            
            console.log(`🎯 点击: ${category} - ${itemName} (¥${itemPrice})`);
            
            // 切换选择状态
            const isSelected = window.toggleSelection.toggle(category, itemId, itemName, itemPrice);
            
            if (isSelected) {
                // 选择操作
                selectHardwareItem(this, category, itemName, itemPrice);
            } else {
                // 取消选择操作
                deselectHardwareItem(this, category);
            }
            
            // 更新UI状态
            updateSelectionUI(category);
            
            // 更新总价
            updateTotalPriceAfterToggle();
            
            // 显示反馈
            showToggleFeedback(isSelected, itemName, itemPrice);
        });
    });
    
    console.log(`✅ 绑定 ${hardwareItems.length} 个硬件项目的切换事件`);
    
    // 监听标签切换，重新绑定
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(() => {
                bindToggleSelectionEvents();
            }, 300);
        });
    });
}

function selectHardwareItem(item, category, name, price) {
    console.log(`✅ 选择硬件: ${category} - ${name}`);
    
    // 1. 更新项目选中状态
    item.classList.add('selected');
    item.classList.remove('deselected');
    
    // 2. 更新配置摘要显示
    updateConfigSummary(category, name, price);
    
    // 3. 更新数据存储
    if (!window.forceSelectedHardware) {
        window.forceSelectedHardware = {};
    }
    window.forceSelectedHardware[category] = { name, price };
}

function deselectHardwareItem(item, category) {
    console.log(`➖ 取消选择硬件: ${category}`);
    
    // 1. 更新项目取消选择状态
    item.classList.remove('selected');
    item.classList.add('deselected');
    
    // 2. 更新配置摘要显示为"未选择"
    updateConfigSummary(category, '未选择', 0);
    
    // 3. 更新数据存储
    if (window.forceSelectedHardware) {
        window.forceSelectedHardware[category] = { name: '未选择', price: 0 };
    }
}

function updateConfigSummary(category, name, price) {
    const elementId = `selected${capitalize(category)}`;
    const element = document.getElementById(elementId);
    
    if (element) {
        element.textContent = name;
        
        // 更新价格显示
        const priceElement = element.parentElement.querySelector('.component-price');
        if (priceElement) {
            priceElement.textContent = price > 0 ? `¥${price}` : '¥0';
        }
        
        console.log(`📝 更新配置摘要: ${category} = ${name} (¥${price})`);
    }
}

function updateSelectionUI(category) {
    // 更新当前类别的所有项目显示
    const currentItems = document.querySelectorAll(`.hardware-item[data-category="${category}"]`);
    
    currentItems.forEach(item => {
        const itemId = item.dataset.id || item.dataset.name;
        const isSelected = window.toggleSelection.getStatus(category) === itemId;
        
        if (isSelected) {
            item.classList.add('selected');
            item.classList.remove('deselected');
        } else {
            item.classList.remove('selected');
            item.classList.add('deselected');
        }
    });
    
    console.log(`🔄 更新 ${category} 类别UI: ${currentItems.length} 个项目`);
}

function updateTotalPriceAfterToggle() {
    // 使用现有的价格计算逻辑
    if (typeof updateAllPriceDisplays === 'function') {
        updateAllPriceDisplays();
    } else if (typeof updateHardwareTotal === 'function') {
        updateHardwareTotal();
        updateGrandTotal();
    } else {
        // 简单的价格计算
        let total = 0;
        if (window.forceSelectedHardware) {
            Object.values(window.forceSelectedHardware).forEach(hardware => {
                total += hardware.price || 0;
            });
        }
        
        const hardwareTotalElement = document.getElementById('hardwareTotal');
        const grandTotalElement = document.getElementById('grandTotal');
        
        if (hardwareTotalElement) hardwareTotalElement.textContent = `¥${total}`;
        if (grandTotalElement) grandTotalElement.textContent = `¥${total + 299}`;
        
        console.log(`💰 切换后总价: ¥${total}`);
    }
}

function showToggleFeedback(isSelected, name, price) {
    const feedback = document.createElement('div');
    const action = isSelected ? '选择' : '取消选择';
    const bgColor = isSelected ? '#10b981' : '#6b7280';
    const icon = isSelected ? '✅' : '➖';
    
    feedback.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10005;
        animation: toggle-feedback 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    feedback.innerHTML = `
        <div style="font-size: 1.25rem;">${icon}</div>
        <div>
            <div style="font-weight: 600;">${action}成功</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">${name}${price > 0 ? ` - ¥${price}` : ''}</div>
        </div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'toggle-feedback-out 0.3s ease-out forwards';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

function addClearSelectionButton() {
    // 查找配置操作区域
    const configActions = document.querySelector('.config-actions, [class*="action"], [class*="button"]');
    if (!configActions) return;
    
    // 不再添加清除按钮，因为影响美观且功能可以通过点击单个硬件取消实现
    console.log('ℹ️ 跳过添加清除按钮（根据用户要求移除）');
    
    // 注意：如果需要清除所有选择的功能，可以通过以下方式实现：
    // 1. 点击每个硬件名称取消选择
    // 2. 刷新页面重置所有选择
    // 3. 使用浏览器控制台执行清除命令
}

function showClearAllFeedback() {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #dc2626;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px -5px rgba(220, 38, 38, 0.3);
        z-index: 10006;
        animation: clear-feedback 0.5s ease-out;
        text-align: center;
    `;
    
    feedback.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.5rem;">🧹 已清除所有选择</div>
        <div style="font-size: 0.875rem;">所有硬件选择已重置，总价已更新</div>
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'clear-feedback-out 0.5s ease-out forwards';
        setTimeout(() => feedback.remove(), 500);
    }, 3000);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 添加切换选择样式
const toggleStyle = document.createElement('style');
toggleStyle.textContent = `
    @keyframes toggle-feedback {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes toggle-feedback-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes clear-feedback {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes clear-feedback-out {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
    
    /* 选中状态 */
    .hardware-item.selected {
        border: 2px solid #10b981 !important;
        background: rgba(16, 185, 129, 0.1) !important;
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
        font-size: 14px;
    }
    
    /* 取消选择状态 */
    .hardware-item.deselected {
        border: 1px solid #e5e7eb !important;
        background: white !important;
        opacity: 0.8;
    }
    
    .hardware-item.deselected:hover {
        opacity: 1;
        border-color: #d1d5db !important;
    }
    
    /* 悬停效果 */
    .hardware-item {
        cursor: pointer !important;
        transition: all 0.3s ease !important;
    }
    
    .hardware-item:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    }
    
    /* 清除按钮样式 */
    .btn-outline {
        background: white !important;
        border: 1px solid #dc2626 !important;
        color: #dc2626 !important;
    }
    
    .btn-outline:hover {
        background: #dc2626 !important;
        color: white !important;
    }
    
    /* 配置摘要更新动画 */
    .component-selected {
        transition: all 0.3s ease;
    }
    
    .component-selected.updating {
        animation: text-update 0.5s ease;
    }
    
    @keyframes text-update {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); color: #3b82f6; }
    }
`;
document.head.appendChild(toggleStyle);

// 添加文本更新动画函数
function animateTextUpdate(element) {
    if (element) {
        element.classList.add('updating');
        setTimeout(() => {
            element.classList.remove('updating');
        }, 500);
    }
}

// 定期检查并重新绑定事件
setInterval(() => {
    const hardwareItems = document.querySelectorAll('.hardware-item');
    let hasToggleEvents = false;
    
    if (hardwareItems.length > 0) {
        // 检查第一个项目是否有我们的事件
        const firstItem = hardwareItems[0];
        const eventListeners = getEventListeners(firstItem);
        
        if (!eventListeners || eventListeners.click.length === 0) {
            console.warn('⚠️ 检测到事件丢失，重新绑定...');
            bindToggleSelectionEvents();
        }
    }
}, 5000);

// 辅助函数：检查事件监听器（简化版）
function getEventListeners(element) {
    // 这是一个简化版本，实际中可能需要更复杂的检查
    return element._eventListeners || null;
}

console.log('🎉 选择切换修复脚本加载完成');
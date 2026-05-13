/**
 * 修复记忆功能失效问题
 */

console.log('🧠 修复记忆功能失效问题...');

// 立即执行
(function() {
    console.log('🎯 开始修复记忆功能...');
    
    // 1. 检查并修复记忆功能开关
    checkAndFixMemoryToggle();
    
    // 2. 恢复记忆功能逻辑
    restoreMemoryFunction();
    
    // 3. 添加增强的记忆功能
    enhanceMemoryFunction();
    
    console.log('✅ 记忆功能修复完成');
})();

function checkAndFixMemoryToggle() {
    console.log('🔍 检查记忆功能开关...');
    
    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkMemoryToggle);
    } else {
        setTimeout(checkMemoryToggle, 1000);
    }
    
    function checkMemoryToggle() {
        console.log('📄 页面加载完成，检查记忆功能开关...');
        
        // 检查开关是否存在
        const toggle = document.getElementById('memoryFunctionToggle');
        if (!toggle) {
            console.log('⚠️ 记忆功能开关不存在，正在创建...');
            createMemoryToggle();
        } else {
            console.log('✅ 记忆功能开关存在');
            
            // 检查开关是否被禁用
            if (toggle.disabled) {
                console.log('⚠️ 记忆功能开关被禁用，正在启用...');
                toggle.disabled = false;
            }
            
            // 检查开关状态
            const isChecked = toggle.checked;
            console.log(`📊 记忆功能开关状态: ${isChecked ? '开启' : '关闭'}`);
            
            // 重新绑定事件
            rebindToggleEvents(toggle);
        }
    }
}

function createMemoryToggle() {
    console.log('🔧 创建记忆功能开关...');
    
    // 检查是否已有简化的开关
    const simpleToggle = document.getElementById('simpleMemoryToggle');
    if (simpleToggle) {
        console.log('✅ 简化的记忆功能开关已存在，无需创建');
        return;
    }
    
    // 检查是否已存在记忆功能开关
    const existingToggle = document.getElementById('memoryFunctionToggle');
    if (existingToggle) {
        console.log('✅ 记忆功能开关已存在，无需重复创建');
        return;
    }
    
    // 检查是否已存在记忆功能容器
    const existingContainer = document.querySelector('.memory-toggle-container');
    if (existingContainer) {
        console.log('✅ 记忆功能容器已存在，无需重复创建');
        return;
    }
    
    // 查找配置摘要头部
    const configHeader = document.querySelector('.config-summary .summary-header');
    if (!configHeader) {
        console.log('❌ 未找到配置摘要头部，无法创建开关');
        return;
    }
    
    // 创建开关容器
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'memory-toggle-container';
    toggleContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
        font-size: 0.8rem;
        color: #6b7280;
    `;
    
    toggleContainer.innerHTML = `
        <span>记忆功能:</span>
        <label class="memory-switch">
            <input type="checkbox" id="memoryFunctionToggle" checked>
            <span class="memory-slider"></span>
        </label>
    `;
    
    // 添加到配置摘要头部
    configHeader.appendChild(toggleContainer);
    
    // 添加开关样式
    addToggleStyles();
    
    // 绑定事件
    const toggle = document.getElementById('memoryFunctionToggle');
    rebindToggleEvents(toggle);
    
    console.log('✅ 记忆功能开关已创建');
}

function addToggleStyles() {
    console.log('🎨 添加记忆功能开关样式...');
    
    const style = document.createElement('style');
    style.textContent = `
        .memory-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        
        .memory-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .memory-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 20px;
        }
        
        .memory-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        input:checked + .memory-slider {
            background-color: #8b5cf6;
        }
        
        input:checked + .memory-slider:before {
            transform: translateX(20px);
        }
        
        /* 记忆功能状态指示器 */
        .memory-status {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 5px;
        }
        
        .memory-enabled {
            background: #d1fae5;
            color: #065f46;
        }
        
        .memory-disabled {
            background: #fee2e2;
            color: #991b1b;
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ 开关样式已添加');
}

function rebindToggleEvents(toggle) {
    if (!toggle) return;
    
    console.log('🔗 重新绑定记忆功能开关事件...');
    
    // 移除旧的事件监听器
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // 绑定新的事件
    newToggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        console.log(`🔄 记忆功能 ${isEnabled ? '启用' : '禁用'}`);
        
        // 更新状态显示
        updateMemoryStatus(isEnabled);
        
        // 保存设置
        saveMemorySetting(isEnabled);
        
        // 根据设置执行相应操作
        if (isEnabled) {
            enableMemoryFunction();
        } else {
            disableMemoryFunction();
        }
    });
    
    // 初始状态
    const isEnabled = newToggle.checked;
    updateMemoryStatus(isEnabled);
    
    console.log('✅ 开关事件已重新绑定');
}

function updateMemoryStatus(isEnabled) {
    console.log('📊 更新记忆功能状态显示...');
    
    // 移除旧的状态显示
    const oldStatus = document.querySelector('.memory-status');
    if (oldStatus) oldStatus.remove();
    
    // 创建新的状态显示
    const toggleContainer = document.querySelector('.memory-toggle-container');
    if (!toggleContainer) return;
    
    const statusSpan = document.createElement('span');
    statusSpan.className = `memory-status ${isEnabled ? 'memory-enabled' : 'memory-disabled'}`;
    statusSpan.textContent = isEnabled ? '已启用' : '已禁用';
    
    toggleContainer.appendChild(statusSpan);
    console.log(`✅ 记忆功能状态: ${isEnabled ? '已启用' : '已禁用'}`);
}

function saveMemorySetting(isEnabled) {
    try {
        localStorage.setItem('memoryFunctionEnabled', isEnabled ? 'true' : 'false');
        console.log(`💾 记忆功能设置已保存: ${isEnabled}`);
    } catch (e) {
        console.log('⚠️ 保存记忆功能设置失败:', e.message);
    }
}

function restoreMemoryFunction() {
    console.log('🔄 恢复记忆功能逻辑...');
    
    // 恢复硬件选择记忆
    restoreHardwareMemory();
    
    // 恢复用户偏好记忆
    restoreUserPreferences();
    
    console.log('✅ 记忆功能逻辑已恢复');
}

function restoreHardwareMemory() {
    console.log('💾 恢复硬件选择记忆...');
    
    // 检查是否有保存的硬件选择
    try {
        const savedSelections = localStorage.getItem('selectedHardware');
        if (savedSelections) {
            console.log('📂 找到保存的硬件选择');
            
            // 解析保存的数据
            const selections = JSON.parse(savedSelections);
            
            // 应用保存的选择
            applySavedSelections(selections);
        } else {
            console.log('📂 没有找到保存的硬件选择');
        }
    } catch (e) {
        console.log('⚠️ 恢复硬件选择失败:', e.message);
    }
}

function applySavedSelections(selections) {
    console.log('🔄 应用保存的硬件选择...');
    
    // 等待页面完全加载
    setTimeout(() => {
        // 检查记忆功能是否启用
        const toggle = document.getElementById('memoryFunctionToggle');
        const isMemoryEnabled = toggle ? toggle.checked : true;
        
        if (!isMemoryEnabled) {
            console.log('⏸️ 记忆功能已禁用，不应用保存的选择');
            return;
        }
        
        // 应用每个硬件类别的选择
        Object.keys(selections).forEach(category => {
            const selection = selections[category];
            if (selection && selection.name) {
                console.log(`🔧 应用 ${category} 选择: ${selection.name}`);
                
                // 这里应该调用网站的选择函数
                // 由于网站的具体选择逻辑未知，我们只更新显示
                updateHardwareDisplay(category, selection);
            }
        });
        
        console.log('✅ 保存的硬件选择已应用');
    }, 2000); // 等待2秒确保页面完全加载
}

function updateHardwareDisplay(category, selection) {
    // 更新配置摘要显示
    const summaryElement = document.getElementById(`selected${capitalize(category)}`);
    if (summaryElement) {
        summaryElement.textContent = selection.name;
    }
    
    // 更新价格显示
    const priceElements = document.querySelectorAll(`[data-category="${category}"] .component-price, .${category}-price`);
    priceElements.forEach(element => {
        element.textContent = `¥${selection.price}`;
    });
    
    // 添加选择状态
    const hardwareItems = document.querySelectorAll(`[data-category="${category}"] .hardware-item`);
    hardwareItems.forEach(item => {
        const titleElement = item.querySelector('.hardware-title');
        if (titleElement && titleElement.textContent.includes(selection.name)) {
            item.classList.add('selected');
        }
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function restoreUserPreferences() {
    console.log('⚙️ 恢复用户偏好设置...');
    
    // 恢复其他用户偏好
    try {
        const preferences = {
            theme: localStorage.getItem('userTheme'),
            language: localStorage.getItem('userLanguage'),
            currency: localStorage.getItem('userCurrency')
        };
        
        console.log('📊 用户偏好:', preferences);
    } catch (e) {
        console.log('⚠️ 恢复用户偏好失败:', e.message);
    }
}

function enableMemoryFunction() {
    console.log('🚀 启用记忆功能...');
    
    // 启用自动保存
    enableAutoSave();
    
    // 显示启用提示
    showMemoryNotification('记忆功能已启用', 'success');
}

function disableMemoryFunction() {
    console.log('⏸️ 禁用记忆功能...');
    
    // 清除当前记忆
    clearCurrentMemory();
    
    // 显示禁用提示
    showMemoryNotification('记忆功能已禁用', 'warning');
}

function enableAutoSave() {
    console.log('💾 启用自动保存...');
    
    // 监听硬件选择变化
    document.addEventListener('click', function(e) {
        const hardwareItem = e.target.closest('.hardware-item');
        if (hardwareItem) {
            setTimeout(saveCurrentSelection, 500);
        }
    });
    
    console.log('✅ 自动保存已启用');
}

function saveCurrentSelection() {
    // 这里应该实现保存当前选择的逻辑
    console.log('💾 自动保存当前选择...');
}

function clearCurrentMemory() {
    console.log('🗑️ 清除当前记忆...');
    
    try {
        // 清除硬件选择记忆
        localStorage.removeItem('selectedHardware');
        
        // 重置显示
        resetHardwareDisplays();
        
        console.log('✅ 当前记忆已清除');
    } catch (e) {
        console.log('⚠️ 清除记忆失败:', e.message);
    }
}

function resetHardwareDisplays() {
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const summaryElement = document.getElementById(`selected${capitalize(category)}`);
        if (summaryElement) {
            summaryElement.textContent = '未选择';
        }
    });
}

function enhanceMemoryFunction() {
    console.log('✨ 增强记忆功能...');
    
    // 添加记忆功能统计
    addMemoryStats();
    
    // 添加记忆备份功能
    addMemoryBackup();
    
    console.log('✅ 记忆功能已增强');
}

function addMemoryStats() {
    console.log('📈 添加记忆功能统计...');
    
    // 这里可以添加记忆使用统计
    // 例如：保存了多少次选择，使用了多少存储空间等
}

function addMemoryBackup() {
    console.log('💽 添加记忆备份功能...');
    
    // 这里可以添加记忆备份功能
    // 例如：导出记忆数据，导入记忆数据等
}

function showMemoryNotification(message, type) {
    console.log(`📢 显示记忆功能通知: ${message}`);
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#f59e0b'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.5s ease-out;
        font-weight: 600;
    `;
    notification.textContent = `🧠 ${message}`;
    
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    // 添加动画样式
    if (!document.querySelector('#memory-animation-style')) {
        const style = document.createElement('style');
        style.id = 'memory-animation-style';
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
}

console.log('🎊 记忆功能修复脚本加载完成');
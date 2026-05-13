/**
 * 修复：阻止默认硬件选择自动显示
 * 解决用户反馈："为什么打开网页每次都显示这些 好像有记忆功能"
 */

console.log('🔧 修复默认选择问题...');

// 立即执行
(function() {
    console.log('🎯 开始修复默认选择问题...');
    
    // 1. 拦截 force-price-fix.js 的模拟选择
    interceptForcePriceFix();
    
    // 2. 确保页面加载时是空白状态
    ensureBlankStateOnLoad();
    
    // 3. 添加用户控制选项
    addUserControlOptions();
    
    console.log('✅ 默认选择问题修复完成');
})();

function interceptForcePriceFix() {
    console.log('🛡️ 拦截 force-price-fix.js 模拟选择...');
    
    // 保存原始函数
    const originalSetTimeout = window.setTimeout;
    const originalForEach = Array.prototype.forEach;
    
    // 拦截 setTimeout 调用
    window.setTimeout = function(callback, delay, ...args) {
        // 检查是否是 force-price-fix.js 的模拟选择
        const callbackString = callback.toString();
        if (callbackString.includes('模拟:') && callbackString.includes('AMD Ryzen 9 9850X3D')) {
            console.log('🚫 拦截到默认硬件选择模拟，已阻止');
            return 0; // 返回无效的timeout ID
        }
        
        return originalSetTimeout.call(this, callback, delay, ...args);
    };
    
    // 拦截 forEach 调用（用于 userSelections.forEach）
    Array.prototype.forEach = function(callback, thisArg) {
        // 检查是否是 userSelections 数组
        if (this.length === 4 && 
            this[0] && this[0].name === 'AMD Ryzen 9 9850X3D' &&
            this[1] && this[1].name === 'NVIDIA RTX 5090') {
            console.log('🚫 拦截到 userSelections 数组，已清空');
            return; // 不执行回调
        }
        
        return originalForEach.call(this, callback, thisArg);
    };
    
    console.log('✅ force-price-fix.js 拦截已设置');
}

function ensureBlankStateOnLoad() {
    console.log('📄 确保页面加载时是空白状态...');
    
    // 页面加载完成后执行
    window.addEventListener('load', function() {
        console.log('🔄 页面加载完成，重置为空白状态...');
        
        // 延迟执行，确保其他脚本已完成
        setTimeout(() => {
            // 重置所有硬件选择显示
            resetAllHardwareDisplays();
            
            // 重置总价显示
            resetTotalPriceDisplay();
            
            // 清除任何选择状态
            clearAllSelectionStates();
            
            console.log('✅ 页面已重置为空白状态');
        }, 500);
    });
}

function resetAllHardwareDisplays() {
    console.log('🖥️ 重置所有硬件显示...');
    
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        // 重置配置摘要
        const summaryElement = document.getElementById(`selected${capitalize(category)}`);
        if (summaryElement && summaryElement.textContent !== '未选择') {
            summaryElement.textContent = '未选择';
            console.log(`✅ ${category} 配置摘要已重置`);
        }
        
        // 重置价格显示
        const priceElements = document.querySelectorAll(`[data-category="${category}"] .component-price, .${category}-price`);
        priceElements.forEach(element => {
            if (element.textContent !== '¥0') {
                element.textContent = '¥0';
            }
        });
        
        // 重置选择状态
        const selectedItems = document.querySelectorAll(`.hardware-item[data-category="${category}"].selected`);
        selectedItems.forEach(item => {
            item.classList.remove('selected');
        });
    });
}

function resetTotalPriceDisplay() {
    console.log('💰 重置总价显示...');
    
    // 硬件总价
    const hardwareTotalElement = document.getElementById('hardwareTotal');
    if (hardwareTotalElement && hardwareTotalElement.textContent !== '¥0') {
        hardwareTotalElement.textContent = '¥0';
        console.log('✅ 硬件总价已重置: ¥0');
    }
    
    // 总计
    const grandTotalElement = document.getElementById('grandTotal');
    if (grandTotalElement && grandTotalElement.textContent !== '¥299') {
        grandTotalElement.textContent = '¥299';
        console.log('✅ 总计已重置: ¥299 (仅服务费)');
    }
}

function clearAllSelectionStates() {
    console.log('🧹 清除所有选择状态...');
    
    // 清除全局变量
    if (window.selectedHardware) {
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
        console.log('✅ window.selectedHardware 已重置');
    }
    
    if (window.forceSelectedHardware) {
        window.forceSelectedHardware = {
            cpu: { name: null, price: 0 },
            gpu: { name: null, price: 0 },
            motherboard: { name: null, price: 0 },
            ram: { name: null, price: 0 },
            storage: { name: null, price: 0 },
            cooling: { name: null, price: 0 },
            psu: { name: null, price: 0 },
            case: { name: null, price: 0 }
        };
        console.log('✅ window.forceSelectedHardware 已重置');
    }
    
    // 清除存储
    try {
        localStorage.removeItem('selectedHardware');
        localStorage.removeItem('forceSelectedHardware');
        localStorage.removeItem('userSelections');
        console.log('✅ localStorage 选择数据已清除');
    } catch (e) {
        console.log('⚠️ 清除 localStorage 失败:', e.message);
    }
}

function addUserControlOptions() {
    console.log('🎛️ 添加用户控制选项...');
    
    // 延迟执行，确保DOM已加载
    setTimeout(() => {
        // 添加记忆功能开关
        addMemoryFunctionToggle();
        
        // 添加快捷清除按钮
        addQuickClearButton();
        
        console.log('✅ 用户控制选项已添加');
    }, 1000);
}

function addMemoryFunctionToggle() {
    console.log('🔘 添加记忆功能开关...');
    
    // 查找合适的位置添加开关
    const configHeader = document.querySelector('.config-summary .summary-header');
    if (!configHeader) {
        console.log('⚠️ 未找到配置摘要头部');
        return;
    }
    
    // 创建开关容器
    const toggleContainer = document.createElement('div');
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
        <label class="switch">
            <input type="checkbox" id="memoryFunctionToggle" checked>
            <span class="slider"></span>
        </label>
    `;
    
    // 添加开关样式
    const style = document.createElement('style');
    style.textContent = `
        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
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
        
        .slider:before {
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
        
        input:checked + .slider {
            background-color: #10b981;
        }
        
        input:checked + .slider:before {
            transform: translateX(20px);
        }
    `;
    document.head.appendChild(style);
    
    configHeader.appendChild(toggleContainer);
    
    // 开关事件
    const toggle = document.getElementById('memoryFunctionToggle');
    toggle.addEventListener('change', function() {
        if (this.checked) {
            console.log('✅ 记忆功能已启用');
            // 启用记忆功能
            enableMemoryFunction();
        } else {
            console.log('🚫 记忆功能已禁用');
            // 禁用记忆功能
            disableMemoryFunction();
        }
    });
    
    console.log('✅ 记忆功能开关已添加');
}

function enableMemoryFunction() {
    // 启用记忆功能
    console.log('💾 记忆功能启用...');
    // 这里可以添加启用记忆功能的代码
}

function disableMemoryFunction() {
    // 禁用记忆功能
    console.log('🧹 记忆功能禁用...');
    // 清除所有保存的数据
    clearAllSelectionStates();
    resetAllHardwareDisplays();
    resetTotalPriceDisplay();
}

function addQuickClearButton() {
    console.log('🔘 添加快捷清除按钮...');
    
    const configActions = document.querySelector('.config-actions');
    if (!configActions) {
        console.log('⚠️ 未找到配置操作区域');
        return;
    }
    
    // 创建清除按钮
    const clearButton = document.createElement('button');
    clearButton.id = 'quickClearBtn';
    clearButton.className = 'btn btn-outline btn-sm';
    clearButton.innerHTML = '<i class="fas fa-eraser"></i> 清除记忆';
    clearButton.title = '清除所有保存的选择';
    
    clearButton.addEventListener('click', function() {
        if (confirm('确定要清除所有保存的硬件选择吗？')) {
            disableMemoryFunction();
            
            // 显示反馈
            const feedback = document.createElement('div');
            feedback.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                z-index: 10070;
                animation: feedback-in 0.5s ease-out, feedback-out 0.5s ease-out 2s forwards;
            `;
            
            feedback.textContent = '✅ 所有选择记忆已清除';
            document.body.appendChild(feedback);
            
            setTimeout(() => feedback.remove(), 2500);
        }
    });
    
    configActions.appendChild(clearButton);
    console.log('✅ 快捷清除按钮已添加');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log('🎊 默认选择问题修复脚本加载完成');
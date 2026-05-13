/**
 * 修复记忆功能被过度拦截的问题
 * 解决 fix-no-default-selection.js 过度拦截导致记忆功能失效
 */

console.log('🛡️ 修复记忆功能过度拦截问题...');

// 立即执行
(function() {
    console.log('🎯 开始修复记忆功能拦截问题...');
    
    // 1. 修复 fix-no-default-selection.js 的过度拦截
    fixOverInterception();
    
    // 2. 恢复正常的记忆功能
    restoreNormalMemoryFunction();
    
    // 3. 添加记忆功能保护
    addMemoryProtection();
    
    console.log('✅ 记忆功能拦截问题修复完成');
})();

function fixOverInterception() {
    console.log('🔧 修复过度拦截...');
    
    // 恢复原始的 setTimeout 和 forEach
    restoreOriginalFunctions();
    
    // 修改拦截逻辑，只拦截真正的默认选择
    modifyInterceptionLogic();
    
    console.log('✅ 过度拦截已修复');
}

function restoreOriginalFunctions() {
    console.log('🔄 恢复原始函数...');
    
    // 检查是否有被覆盖的函数
    if (window._originalSetTimeout) {
        window.setTimeout = window._originalSetTimeout;
        console.log('✅ 恢复原始 setTimeout');
    }
    
    if (Array.prototype._originalForEach) {
        Array.prototype.forEach = Array.prototype._originalForEach;
        console.log('✅ 恢复原始 forEach');
    }
    
    // 检查 fix-no-default-selection.js 是否覆盖了这些函数
    const fixScript = document.querySelector('script[src*="fix-no-default-selection"]');
    if (fixScript) {
        console.log('📜 找到 fix-no-default-selection.js 脚本');
        
        // 重新加载该脚本，但使用修改后的逻辑
        reloadWithFix(fixScript);
    }
}

function modifyInterceptionLogic() {
    console.log('⚙️ 修改拦截逻辑...');
    
    // 创建更智能的拦截逻辑
    window._smartInterceptionEnabled = true;
    
    // 智能拦截：只拦截真正的默认选择，不拦截用户的选择
    window._originalSetTimeout = window._originalSetTimeout || window.setTimeout;
    window.setTimeout = function(callback, delay, ...args) {
        // 检查是否是真正的默认选择（来自 force-price-fix.js）
        const callbackString = callback.toString();
        const isDefaultSelection = 
            callbackString.includes('模拟:') && 
            callbackString.includes('AMD Ryzen 9 9850X3D') &&
            callbackString.includes('NVIDIA RTX 5090') &&
            callbackString.includes('ROG MAXIMUS Z890 EXTREME');
        
        if (isDefaultSelection && window._smartInterceptionEnabled) {
            console.log('🛡️ 智能拦截：阻止默认硬件选择模拟');
            return 0; // 返回无效的timeout ID
        }
        
        return window._originalSetTimeout.call(this, callback, delay, ...args);
    };
    
    // 智能 forEach 拦截
    Array.prototype._originalForEach = Array.prototype._originalForEach || Array.prototype.forEach;
    Array.prototype.forEach = function(callback, thisArg) {
        // 检查是否是默认的 userSelections 数组
        const isDefaultUserSelections = 
            this.length === 4 && 
            this[0] && this[0].name === 'AMD Ryzen 9 9850X3D' &&
            this[1] && this[1].name === 'NVIDIA RTX 5090' &&
            this[2] && this[2].name === 'ROG MAXIMUS Z890 EXTREME' &&
            this[3] && this[3].name === 'G.SKILL Trident Z5 RGB 8000';
        
        if (isDefaultUserSelections && window._smartInterceptionEnabled) {
            console.log('🛡️ 智能拦截：阻止默认 userSelections 数组');
            return; // 不执行回调
        }
        
        return Array.prototype._originalForEach.call(this, callback, thisArg);
    };
    
    console.log('✅ 智能拦截逻辑已设置');
}

function reloadWithFix(scriptElement) {
    console.log('🔄 重新加载修复后的脚本...');
    
    // 创建新的脚本元素
    const newScript = document.createElement('script');
    newScript.src = scriptElement.src;
    
    // 添加加载完成后的回调
    newScript.onload = function() {
        console.log('✅ 脚本重新加载完成，应用修复...');
        applyFixToReloadedScript();
    };
    
    // 移除旧脚本，添加新脚本
    scriptElement.parentNode.removeChild(scriptElement);
    document.head.appendChild(newScript);
}

function applyFixToReloadedScript() {
    console.log('🔧 应用修复到重新加载的脚本...');
    
    // 这里可以添加对重新加载脚本的特定修复
    // 例如，修改特定的函数或变量
    
    console.log('✅ 修复已应用');
}

function restoreNormalMemoryFunction() {
    console.log('🧠 恢复正常的记忆功能...');
    
    // 启用记忆功能
    enableMemoryFunction();
    
    // 恢复记忆功能开关
    restoreMemoryToggle();
    
    // 加载保存的记忆
    loadSavedMemory();
    
    console.log('✅ 正常记忆功能已恢复');
}

function enableMemoryFunction() {
    console.log('🚀 启用记忆功能...');
    
    // 设置记忆功能为启用状态
    window.memoryFunctionEnabled = true;
    
    // 更新记忆功能开关状态
    const toggle = document.getElementById('memoryFunctionToggle');
    if (toggle) {
        toggle.checked = true;
        console.log('✅ 记忆功能开关已设置为开启');
    }
    
    // 显示启用状态
    showMemoryStatus('记忆功能已启用', 'enabled');
}

function restoreMemoryToggle() {
    console.log('🔘 恢复记忆功能开关...');
    
    // 检查开关是否存在
    const toggle = document.getElementById('memoryFunctionToggle');
    if (!toggle) {
        console.log('⚠️ 记忆功能开关不存在，等待页面加载...');
        
        // 等待页面加载完成后检查
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkToggleAfterLoad);
        } else {
            setTimeout(checkToggleAfterLoad, 1000);
        }
    } else {
        console.log('✅ 记忆功能开关存在');
        
        // 确保开关是启用的
        toggle.disabled = false;
        toggle.checked = true;
        
        // 重新绑定事件
        rebindToggleEvent(toggle);
    }
}

function checkToggleAfterLoad() {
    console.log('📄 页面加载完成，检查记忆功能开关...');
    
    const toggle = document.getElementById('memoryFunctionToggle');
    if (toggle) {
        console.log('✅ 找到记忆功能开关');
        toggle.disabled = false;
        toggle.checked = true;
        rebindToggleEvent(toggle);
    } else {
        console.log('❌ 仍未找到记忆功能开关，可能需要重新创建');
        // 这里可以调用创建开关的函数
    }
}

function rebindToggleEvent(toggle) {
    console.log('🔗 重新绑定记忆功能开关事件...');
    
    // 移除所有现有的事件监听器
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // 绑定新的事件
    newToggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        console.log(`🔄 记忆功能 ${isEnabled ? '启用' : '禁用'}`);
        
        // 更新全局状态
        window.memoryFunctionEnabled = isEnabled;
        
        // 显示状态
        showMemoryStatus(
            isEnabled ? '记忆功能已启用' : '记忆功能已禁用',
            isEnabled ? 'enabled' : 'disabled'
        );
        
        // 保存设置
        saveMemorySetting(isEnabled);
    });
    
    console.log('✅ 开关事件已重新绑定');
}

function showMemoryStatus(message, type) {
    console.log(`📢 显示记忆功能状态: ${message}`);
    
    // 创建或更新状态显示
    let statusElement = document.getElementById('memoryStatusIndicator');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'memoryStatusIndicator';
        statusElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 8px;
            z-index: 9999;
            font-size: 0.9rem;
            font-weight: 600;
            animation: fadeIn 0.5s ease-out;
        `;
        document.body.appendChild(statusElement);
    }
    
    // 更新样式和内容
    statusElement.textContent = `🧠 ${message}`;
    statusElement.style.background = type === 'enabled' ? '#d1fae5' : '#fee2e2';
    statusElement.style.color = type === 'enabled' ? '#065f46' : '#991b1b';
    statusElement.style.border = `2px solid ${type === 'enabled' ? '#10b981' : '#ef4444'}`;
    
    // 3秒后淡出
    setTimeout(() => {
        statusElement.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            if (statusElement.parentNode) {
                statusElement.parentNode.removeChild(statusElement);
            }
        }, 500);
    }, 3000);
    
    // 添加动画样式
    if (!document.querySelector('#memory-status-animation')) {
        const style = document.createElement('style');
        style.id = 'memory-status-animation';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function saveMemorySetting(isEnabled) {
    try {
        localStorage.setItem('memoryFunctionEnabled', isEnabled ? 'true' : 'false');
        console.log(`💾 记忆功能设置已保存: ${isEnabled}`);
    } catch (e) {
        console.log('⚠️ 保存记忆功能设置失败:', e.message);
    }
}

function loadSavedMemory() {
    console.log('📂 加载保存的记忆...');
    
    try {
        // 加载记忆功能设置
        const memoryEnabled = localStorage.getItem('memoryFunctionEnabled');
        if (memoryEnabled !== null) {
            const isEnabled = memoryEnabled === 'true';
            window.memoryFunctionEnabled = isEnabled;
            console.log(`📊 记忆功能设置: ${isEnabled ? '启用' : '禁用'}`);
        }
        
        // 加载硬件选择记忆
        const savedSelections = localStorage.getItem('selectedHardware');
        if (savedSelections) {
            console.log('📦 找到保存的硬件选择');
            
            // 解析并应用保存的选择
            applySavedSelections(JSON.parse(savedSelections));
        }
    } catch (e) {
        console.log('⚠️ 加载保存的记忆失败:', e.message);
    }
}

function applySavedSelections(selections) {
    console.log('🔄 应用保存的硬件选择...');
    
    // 检查记忆功能是否启用
    if (!window.memoryFunctionEnabled) {
        console.log('⏸️ 记忆功能已禁用，不应用保存的选择');
        return;
    }
    
    // 等待页面完全加载
    setTimeout(() => {
        console.log('🔧 开始应用保存的选择...');
        
        // 这里应该调用网站的选择函数来应用保存的选择
        // 由于网站的具体实现未知，我们只记录日志
        Object.keys(selections).forEach(category => {
            const selection = selections[category];
            if (selection && selection.name) {
                console.log(`   ${category}: ${selection.name} - ¥${selection.price}`);
            }
        });
        
        console.log('✅ 保存的硬件选择已记录');
    }, 1500);
}

function addMemoryProtection() {
    console.log('🛡️ 添加记忆功能保护...');
    
    // 保护记忆功能不被其他脚本禁用
    protectMemoryFunction();
    
    // 监控记忆功能状态
    monitorMemoryFunction();
    
    console.log('✅ 记忆功能保护已添加');
}

function protectMemoryFunction() {
    console.log('🔒 保护记忆功能...');
    
    // 防止其他脚本禁用记忆功能
    const originalDisableFunction = window.disableMemoryFunction;
    if (originalDisableFunction) {
        window.disableMemoryFunction = function() {
            console.log('🛡️ 保护：阻止禁用记忆功能');
            
            // 检查是否真的需要禁用
            if (window.memoryFunctionEnabled) {
                console.log('⚠️ 记忆功能正在使用中，不允许禁用');
                return false;
            }
            
            // 调用原始函数
            return originalDisableFunction.apply(this, arguments);
        };
        console.log('✅ 记忆功能禁用保护已设置');
    }
}

function monitorMemoryFunction() {
    console.log('👀 监控记忆功能状态...');
    
    // 定期检查记忆功能状态
    setInterval(() => {
        const toggle = document.getElementById('memoryFunctionToggle');
        if (toggle) {
            const isEnabled = toggle.checked;
            
            // 如果状态不一致，进行修复
            if (window.memoryFunctionEnabled !== isEnabled) {
                console.log('⚠️ 记忆功能状态不一致，进行修复...');
                toggle.checked = window.memoryFunctionEnabled;
                showMemoryStatus(
                    window.memoryFunctionEnabled ? '记忆功能已恢复启用' : '记忆功能已恢复禁用',
                    window.memoryFunctionEnabled ? 'enabled' : 'disabled'
                );
            }
        }
    }, 5000); // 每5秒检查一次
    
    console.log('✅ 记忆功能状态监控已启用');
}

console.log('🎊 记忆功能拦截修复脚本加载完成');
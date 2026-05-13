/**
 * 直接修复记忆功能开关问题
 * 1. 检查当前状态
 * 2. 删除所有多余的开关
 * 3. 确保只有一个开关
 */

console.log('🎯 直接修复记忆功能开关问题...');

// 立即执行
(function() {
    console.log('🚀 开始直接修复...');
    
    // 1. 检查当前状态
    const currentState = checkCurrentState();
    
    // 2. 根据状态采取行动
    if (currentState.toggleCount === 0) {
        console.log('⚠️ 没有找到记忆功能开关，创建新的');
        createSingleToggle();
    } else if (currentState.toggleCount === 1) {
        console.log('✅ 只有一个开关，符合要求');
        ensureToggleWorks(currentState.toggles[0]);
    } else {
        console.log(`❌ 找到 ${currentState.toggleCount} 个开关，需要清理`);
        cleanupExtraToggles(currentState.toggles);
    }
    
    console.log('✅ 直接修复完成');
})();

function checkCurrentState() {
    console.log('🔍 检查当前状态...');
    
    const result = {
        toggleCount: 0,
        toggles: [],
        configSummary: null,
        summaryHeader: null
    };
    
    // 查找配置摘要区域
    result.configSummary = document.querySelector('.config-summary');
    if (result.configSummary) {
        console.log('✅ 找到配置摘要区域');
        result.summaryHeader = result.configSummary.querySelector('.summary-header');
    } else {
        console.log('⚠️ 未找到配置摘要区域');
    }
    
    // 查找所有记忆功能开关
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const text = element.textContent || '';
        
        // 检查是否是真实的记忆功能开关（不是脚本注释）
        if (text.includes('记忆功能') && 
            !text.includes('脚本') && 
            !text.includes('注释') &&
            !text.includes('-->') &&
            text.length > 3) {
            
            const hasCheckbox = !!element.querySelector('input[type="checkbox"]');
            
            result.toggles.push({
                element: element,
                text: text.trim(),
                hasCheckbox: hasCheckbox,
                isPurple: element.style.cssText.includes('#8b5cf6') || 
                         element.className.includes('purple') ||
                         text.includes('紫色'),
                isGreen: element.style.cssText.includes('#10b981') || 
                        element.className.includes('green') ||
                        text.includes('绿色') ||
                        text.includes('已启用')
            });
        }
    });
    
    result.toggleCount = result.toggles.length;
    console.log(`📊 找到 ${result.toggleCount} 个记忆功能相关元素`);
    
    // 记录详细信息
    result.toggles.forEach((toggle, index) => {
        console.log(`  开关 ${index + 1}:`, {
            text: toggle.text.substring(0, 30),
            hasCheckbox: toggle.hasCheckbox,
            isPurple: toggle.isPurple,
            isGreen: toggle.isGreen
        });
    });
    
    return result;
}

function cleanupExtraToggles(toggles) {
    console.log('🧹 清理多余的开关...');
    
    // 如果有多个开关，保留第一个，删除其他的
    if (toggles.length <= 1) return;
    
    // 确定要保留哪个开关
    let switchToKeep = 0; // 默认保留第一个
    
    // 优先保留紫色开关
    for (let i = 0; i < toggles.length; i++) {
        if (toggles[i].isPurple && toggles[i].hasCheckbox) {
            switchToKeep = i;
            break;
        }
    }
    
    console.log(`🎯 保留开关 ${switchToKeep + 1}，删除其他开关`);
    
    // 删除其他开关
    for (let i = 0; i < toggles.length; i++) {
        if (i !== switchToKeep) {
            console.log(`🗑️ 删除开关 ${i + 1}: "${toggles[i].text.substring(0, 20)}..."`);
            try {
                toggles[i].element.remove();
            } catch (error) {
                console.log(`⚠️ 无法删除开关 ${i + 1}:`, error.message);
                // 隐藏作为备用
                toggles[i].element.style.display = 'none';
            }
        }
    }
    
    // 验证清理结果
    setTimeout(() => {
        const remaining = document.querySelectorAll('*');
        let remainingCount = 0;
        
        remaining.forEach(element => {
            const text = element.textContent || '';
            if (text.includes('记忆功能') && 
                !text.includes('脚本') && 
                !text.includes('注释') &&
                text.length > 3) {
                remainingCount++;
            }
        });
        
        console.log(`📊 清理后剩余开关: ${remainingCount}`);
        
        if (remainingCount === 1) {
            showDirectSuccessMessage('多余的开关已删除');
        } else if (remainingCount === 0) {
            showDirectWarningMessage('所有开关都被删除了');
            createSingleToggle();
        } else {
            showDirectErrorMessage(`仍有 ${remainingCount} 个开关`);
        }
    }, 500);
}

function createSingleToggle() {
    console.log('✨ 创建单个开关...');
    
    // 查找配置摘要头部
    let header = document.querySelector('.config-summary .summary-header');
    if (!header) {
        console.log('⚠️ 未找到配置摘要头部，尝试其他位置');
        // 尝试其他可能的位置
        header = document.querySelector('.summary-header') || 
                 document.querySelector('.config-header') ||
                 document.querySelector('header');
    }
    
    if (!header) {
        console.log('❌ 未找到合适的位置创建开关');
        return;
    }
    
    console.log('✅ 找到位置创建开关');
    
    // 创建最简单的开关
    const toggleId = 'directMemoryToggle_' + Date.now();
    const toggleHtml = `
        <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
            <span style="font-size: 0.8rem; color: #6b7280;">记忆功能:</span>
            <label style="position: relative; display: inline-block; width: 40px; height: 20px;">
                <input type="checkbox" id="${toggleId}" checked 
                       style="opacity: 0; width: 0; height: 0;">
                <span style="
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 20px;
                "></span>
                <span style="
                    position: absolute;
                    height: 16px;
                    width: 16px;
                    left: 2px;
                    bottom: 2px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                "></span>
            </label>
        </div>
    `;
    
    // 添加到头部
    header.insertAdjacentHTML('beforeend', toggleHtml);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #${toggleId}:checked + span {
            background-color: #8b5cf6 !important;
        }
        #${toggleId}:checked + span + span {
            transform: translateX(20px) !important;
        }
        
        /* 隐藏所有其他可能的开关 */
        [style*="green"], [style*="#10b981"], [style*="#059669"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // 绑定事件
    const toggle = document.getElementById(toggleId);
    if (toggle) {
        toggle.addEventListener('change', function() {
            console.log('记忆功能:', this.checked ? '开启' : '关闭');
        });
    }
    
    console.log('✅ 单个开关已创建');
    showDirectSuccessMessage('已创建单个记忆功能开关');
}

function ensureToggleWorks(toggle) {
    console.log('🔧 确保开关正常工作...');
    
    if (!toggle.hasCheckbox) {
        console.log('⚠️ 开关没有checkbox，可能需要修复');
        return;
    }
    
    // 确保开关是紫色的
    if (!toggle.isPurple) {
        console.log('🎨 将开关设置为紫色');
        const checkbox = toggle.element.querySelector('input[type="checkbox"]');
        if (checkbox) {
            const slider = checkbox.nextElementSibling;
            if (slider) {
                slider.style.backgroundColor = '#8b5cf6';
            }
        }
    }
    
    console.log('✅ 开关状态正常');
}

function showDirectSuccessMessage(text) {
    const message = document.createElement('div');
    message.textContent = `✅ ${text}`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 0.9rem;
        font-weight: 600;
        animation: directFadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addDirectAnimationStyle();
}

function showDirectWarningMessage(text) {
    const message = document.createElement('div');
    message.textContent = `⚠️ ${text}`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f59e0b;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 0.9rem;
        font-weight: 600;
        animation: directFadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addDirectAnimationStyle();
}

function showDirectErrorMessage(text) {
    const message = document.createElement('div');
    message.textContent = `❌ ${text}`;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 0.9rem;
        font-weight: 600;
        animation: directFadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addDirectAnimationStyle();
}

function addDirectAnimationStyle() {
    if (!document.querySelector('#direct-animation')) {
        const style = document.createElement('style');
        style.id = 'direct-animation';
        style.textContent = `
            @keyframes directFadeInOut {
                0% { opacity: 0; transform: translateX(100%); }
                20% { opacity: 1; transform: translateX(0); }
                80% { opacity: 1; transform: translateX(0); }
                100% { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 如果DOM已加载，立即执行
if (document.readyState !== 'loading') {
    console.log('⚡ DOM已就绪，立即执行');
} else {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM加载完成，执行修复');
    });
}

console.log('🎊 直接修复脚本加载完成');
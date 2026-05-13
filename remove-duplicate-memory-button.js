/**
 * 删除重复的记忆功能按钮
 * 解决两个记忆功能按钮重复的问题，删除右边那个
 */

console.log('🔍 检查重复的记忆功能按钮...');

// 立即执行
(function() {
    console.log('🎯 开始处理重复的记忆功能按钮...');
    
    // 1. 检查当前页面中的记忆功能按钮
    checkMemoryButtons();
    
    // 2. 删除右边的重复按钮
    removeRightMemoryButton();
    
    // 3. 防止按钮重新出现
    preventButtonDuplication();
    
    console.log('✅ 重复按钮处理完成');
})();

function checkMemoryButtons() {
    console.log('🔍 检查记忆功能按钮...');
    
    // 查找所有记忆功能相关的元素
    const memoryToggleContainers = document.querySelectorAll('.memory-toggle-container, [class*="memory"], [id*="memory"]');
    console.log(`📊 找到 ${memoryToggleContainers.length} 个记忆功能相关容器`);
    
    memoryToggleContainers.forEach((container, index) => {
        console.log(`  容器 ${index + 1}:`, {
            className: container.className,
            id: container.id,
            text: container.textContent.trim().substring(0, 50),
            position: getElementPosition(container)
        });
    });
    
    // 查找所有记忆功能开关
    const memoryToggles = document.querySelectorAll('#memoryFunctionToggle, input[type="checkbox"][id*="memory"], .memory-switch input');
    console.log(`📊 找到 ${memoryToggles.length} 个记忆功能开关`);
    
    memoryToggles.forEach((toggle, index) => {
        console.log(`  开关 ${index + 1}:`, {
            id: toggle.id,
            checked: toggle.checked,
            parent: toggle.parentNode?.className || '无父类'
        });
    });
    
    // 查找所有包含"记忆功能"文本的元素
    const memoryTextElements = document.querySelectorAll('*:contains("记忆功能")');
    console.log(`📊 找到 ${memoryTextElements.length} 个包含"记忆功能"文本的元素`);
    
    memoryTextElements.forEach((element, index) => {
        console.log(`  文本元素 ${index + 1}:`, {
            tag: element.tagName,
            className: element.className,
            text: element.textContent.trim(),
            position: getElementPosition(element)
        });
    });
}

function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
    };
}

function removeRightMemoryButton() {
    console.log('🗑️ 删除右边的记忆功能按钮...');
    
    // 方法1: 查找配置摘要区域中的所有记忆功能按钮
    const configSummary = document.querySelector('.config-summary');
    if (!configSummary) {
        console.log('⚠️ 未找到配置摘要区域');
        return;
    }
    
    console.log('✅ 找到配置摘要区域');
    
    // 查找配置摘要头部
    const summaryHeader = configSummary.querySelector('.summary-header');
    if (!summaryHeader) {
        console.log('⚠️ 未找到配置摘要头部');
        return;
    }
    
    console.log('✅ 找到配置摘要头部');
    
    // 查找所有的记忆功能按钮容器
    const memoryContainers = summaryHeader.querySelectorAll('.memory-toggle-container, [class*="memory"]');
    console.log(`📊 在摘要头部找到 ${memoryContainers.length} 个记忆功能容器`);
    
    if (memoryContainers.length <= 1) {
        console.log('ℹ️ 只有一个记忆功能按钮，无需删除');
        return;
    }
    
    // 找到最右边的容器（位置最靠右的）
    let rightmostContainer = null;
    let maxRightPosition = -Infinity;
    
    memoryContainers.forEach(container => {
        const rect = container.getBoundingClientRect();
        if (rect.right > maxRightPosition) {
            maxRightPosition = rect.right;
            rightmostContainer = container;
        }
    });
    
    if (rightmostContainer) {
        console.log('📍 找到最右边的记忆功能容器:', {
            className: rightmostContainer.className,
            text: rightmostContainer.textContent.trim().substring(0, 30),
            position: getElementPosition(rightmostContainer)
        });
        
        // 删除右边的容器
        rightmostContainer.remove();
        console.log('✅ 右边的记忆功能按钮已删除');
        
        // 确保左边按钮正常工作
        ensureLeftButtonWorks();
    } else {
        console.log('⚠️ 未找到最右边的容器');
    }
    
    // 方法2: 通过文本内容查找重复按钮
    removeDuplicateByText();
}

function removeDuplicateByText() {
    console.log('🔤 通过文本内容查找重复按钮...');
    
    // 查找所有包含"记忆功能"文本的按钮容器
    const allElements = document.querySelectorAll('*');
    const memoryElements = [];
    
    allElements.forEach(element => {
        if (element.textContent && element.textContent.includes('记忆功能')) {
            memoryElements.push(element);
        }
    });
    
    console.log(`📊 找到 ${memoryElements.length} 个包含"记忆功能"文本的元素`);
    
    if (memoryElements.length > 1) {
        // 按位置排序，找到最右边的
        memoryElements.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectB.right - rectA.right; // 按右边界降序排序
        });
        
        // 删除最右边的（位置最大的）
        const rightmostElement = memoryElements[0];
        console.log('📍 找到最右边的记忆功能文本元素:', {
            tag: rightmostElement.tagName,
            text: rightmostElement.textContent.trim(),
            position: getElementPosition(rightmostElement)
        });
        
        // 检查是否真的是重复的（不是同一个元素的不同部分）
        const parent = rightmostElement.parentElement;
        if (parent && parent.textContent.includes('记忆功能')) {
            // 如果父元素也包含"记忆功能"，可能父元素才是真正的容器
            console.log('🔄 父元素也包含"记忆功能"，检查父元素...');
            
            // 查找父元素中是否已经有记忆功能开关
            const hasToggle = parent.querySelector('#memoryFunctionToggle, .memory-switch');
            if (hasToggle) {
                console.log('✅ 父元素已有记忆功能开关，删除重复的文本元素');
                rightmostElement.remove();
            }
        }
    }
}

function ensureLeftButtonWorks() {
    console.log('🔧 确保左边按钮正常工作...');
    
    // 查找剩下的记忆功能开关
    const remainingToggle = document.getElementById('memoryFunctionToggle');
    if (!remainingToggle) {
        console.log('⚠️ 未找到记忆功能开关，可能需要重新创建');
        return;
    }
    
    console.log('✅ 找到剩下的记忆功能开关');
    
    // 确保开关是启用的
    remainingToggle.disabled = false;
    remainingToggle.checked = true;
    
    // 重新绑定事件
    rebindToggleEvent(remainingToggle);
    
    // 更新状态显示
    updateMemoryStatusDisplay();
}

function rebindToggleEvent(toggle) {
    console.log('🔗 重新绑定记忆功能开关事件...');
    
    // 克隆并替换以移除旧事件
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // 绑定新事件
    newToggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        console.log(`🔄 记忆功能 ${isEnabled ? '启用' : '禁用'}`);
        
        // 保存设置
        saveMemorySetting(isEnabled);
        
        // 显示状态
        showMemoryButtonStatus(isEnabled);
    });
    
    console.log('✅ 开关事件已重新绑定');
}

function saveMemorySetting(isEnabled) {
    try {
        localStorage.setItem('memoryFunctionEnabled', isEnabled ? 'true' : 'false');
        console.log(`💾 记忆功能设置已保存: ${isEnabled}`);
    } catch (e) {
        console.log('⚠️ 保存记忆功能设置失败:', e.message);
    }
}

function showMemoryButtonStatus(isEnabled) {
    console.log(`📢 显示记忆功能按钮状态: ${isEnabled ? '启用' : '禁用'}`);
    
    // 创建状态提示
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: ${isEnabled ? '#10b981' : '#f59e0b'};
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 0.9rem;
        font-weight: 600;
        animation: statusFadeIn 0.5s ease-out;
    `;
    statusDiv.textContent = `🧠 记忆功能 ${isEnabled ? '已启用' : '已禁用'}`;
    
    document.body.appendChild(statusDiv);
    
    // 3秒后移除
    setTimeout(() => {
        statusDiv.style.animation = 'statusFadeOut 0.5s ease-out';
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.parentNode.removeChild(statusDiv);
            }
        }, 500);
    }, 3000);
    
    // 添加动画样式
    if (!document.querySelector('#button-status-animation')) {
        const style = document.createElement('style');
        style.id = 'button-status-animation';
        style.textContent = `
            @keyframes statusFadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes statusFadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function updateMemoryStatusDisplay() {
    console.log('📊 更新记忆功能状态显示...');
    
    // 移除可能重复的状态显示
    const oldStatuses = document.querySelectorAll('.memory-status');
    oldStatuses.forEach((status, index) => {
        if (index > 0) { // 保留第一个，删除其他的
            status.remove();
            console.log(`🗑️ 删除重复的状态显示 ${index + 1}`);
        }
    });
    
    // 确保只有一个状态显示
    const toggle = document.getElementById('memoryFunctionToggle');
    if (toggle) {
        const isEnabled = toggle.checked;
        const statusElements = document.querySelectorAll('.memory-status');
        
        if (statusElements.length === 0) {
            // 创建状态显示
            createMemoryStatusDisplay(isEnabled);
        } else if (statusElements.length > 1) {
            // 只保留第一个
            for (let i = 1; i < statusElements.length; i++) {
                statusElements[i].remove();
            }
        }
    }
}

function createMemoryStatusDisplay(isEnabled) {
    console.log('✨ 创建记忆功能状态显示...');
    
    const toggleContainer = document.querySelector('.memory-toggle-container');
    if (!toggleContainer) return;
    
    const statusSpan = document.createElement('span');
    statusSpan.className = `memory-status ${isEnabled ? 'memory-enabled' : 'memory-disabled'}`;
    statusSpan.textContent = isEnabled ? '已启用' : '已禁用';
    statusSpan.style.cssText = `
        margin-left: 8px;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 600;
    `;
    
    toggleContainer.appendChild(statusSpan);
    console.log('✅ 记忆功能状态显示已创建');
}

function preventButtonDuplication() {
    console.log('🛡️ 防止按钮重复出现...');
    
    // 监控DOM变化，防止按钮被重复添加
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        checkForDuplicateButtons(node);
                    }
                });
            }
        });
    });
    
    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ DOM变化监控已启用');
    
    // 定期检查重复按钮
    setInterval(checkForDuplicateButtons, 5000);
    console.log('✅ 定期检查已启用');
}

function checkForDuplicateButtons(context = document) {
    // 查找所有的记忆功能按钮容器
    const memoryContainers = context.querySelectorAll ? 
        context.querySelectorAll('.memory-toggle-container, [class*="memory"]') : [];
    
    if (memoryContainers.length > 1) {
        console.log(`⚠️ 发现 ${memoryContainers.length} 个记忆功能容器，正在清理...`);
        
        // 只保留第一个，删除其他的
        for (let i = 1; i < memoryContainers.length; i++) {
            console.log(`🗑️ 删除重复的记忆功能容器 ${i + 1}`);
            memoryContainers[i].remove();
        }
    }
    
    // 检查重复的开关
    const memoryToggles = context.querySelectorAll ? 
        context.querySelectorAll('#memoryFunctionToggle') : [];
    
    if (memoryToggles.length > 1) {
        console.log(`⚠️ 发现 ${memoryToggles.length} 个记忆功能开关，正在清理...`);
        
        // 只保留第一个，删除其他的
        for (let i = 1; i < memoryToggles.length; i++) {
            console.log(`🗑️ 删除重复的记忆功能开关 ${i + 1}`);
            memoryToggles[i].remove();
        }
    }
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 页面加载完成，执行重复按钮检查...');
        // 延迟执行以确保其他脚本已完成
        setTimeout(checkMemoryButtons, 1000);
        setTimeout(removeRightMemoryButton, 1500);
    });
} else {
    console.log('⚡ DOM已加载，立即执行检查...');
    setTimeout(checkMemoryButtons, 500);
    setTimeout(removeRightMemoryButton, 1000);
}

console.log('🎊 重复记忆功能按钮删除脚本加载完成');
/**
 * 删除整个记忆功能块，只保留「记忆功能」开关本身
 */

console.log('🗑️ 删除整个记忆功能块，只保留开关...');

// 立即执行
(function() {
    console.log('🎯 开始处理记忆功能块...');
    
    // 1. 查找记忆功能容器
    const memoryContainer = findMemoryContainer();
    
    if (!memoryContainer) {
        console.log('⚠️ 未找到记忆功能容器');
        return;
    }
    
    console.log('✅ 找到记忆功能容器:', {
        className: memoryContainer.className,
        text: memoryContainer.textContent.trim().substring(0, 50)
    });
    
    // 2. 提取记忆功能开关
    const memoryToggle = extractMemoryToggle(memoryContainer);
    
    if (!memoryToggle) {
        console.log('⚠️ 未找到记忆功能开关');
        return;
    }
    
    console.log('✅ 找到记忆功能开关:', {
        id: memoryToggle.id,
        checked: memoryToggle.checked
    });
    
    // 3. 删除整个容器
    removeMemoryContainer(memoryContainer);
    
    // 4. 重新创建简化的记忆功能开关
    createSimplifiedMemoryToggle(memoryToggle);
    
    console.log('✅ 记忆功能块处理完成');
})();

function findMemoryContainer() {
    console.log('🔍 查找记忆功能容器...');
    
    // 方法1: 通过CSS类查找
    const containerByClass = document.querySelector('.memory-toggle-container');
    if (containerByClass) {
        console.log('✅ 通过CSS类找到容器');
        return containerByClass;
    }
    
    // 方法2: 通过包含"记忆功能"文本查找
    const allElements = document.querySelectorAll('*');
    for (const element of allElements) {
        if (element.textContent && element.textContent.includes('记忆功能')) {
            // 找到包含"记忆功能"的父容器
            let parent = element;
            while (parent && parent !== document.body) {
                if (parent.querySelector && parent.querySelector('input[type="checkbox"]')) {
                    console.log('✅ 通过文本找到容器');
                    return parent;
                }
                parent = parent.parentElement;
            }
        }
    }
    
    // 方法3: 在配置摘要区域查找
    const configSummary = document.querySelector('.config-summary');
    if (configSummary) {
        const containers = configSummary.querySelectorAll('div, span');
        for (const container of containers) {
            if (container.textContent && container.textContent.includes('记忆功能')) {
                console.log('✅ 在配置摘要区域找到容器');
                return container;
            }
        }
    }
    
    return null;
}

function extractMemoryToggle(container) {
    console.log('🔧 提取记忆功能开关...');
    
    // 查找开关元素
    const toggle = container.querySelector('#memoryFunctionToggle, input[type="checkbox"]');
    if (toggle) {
        console.log('✅ 找到开关元素');
        return toggle;
    }
    
    // 如果没有找到，检查容器本身是否是开关
    if (container.tagName === 'INPUT' && container.type === 'checkbox') {
        console.log('✅ 容器本身就是开关');
        return container;
    }
    
    return null;
}

function removeMemoryContainer(container) {
    console.log('🗑️ 删除记忆功能容器...');
    
    try {
        // 保存开关状态
        const toggle = container.querySelector('input[type="checkbox"]');
        const wasChecked = toggle ? toggle.checked : true;
        
        // 删除容器
        container.remove();
        console.log('✅ 记忆功能容器已删除');
        
        return wasChecked;
    } catch (e) {
        console.log('⚠️ 删除容器失败:', e.message);
        return true; // 默认启用状态
    }
}

function createSimplifiedMemoryToggle(originalToggle) {
    console.log('✨ 创建简化的记忆功能开关...');
    
    // 获取原始开关状态
    const isChecked = originalToggle ? originalToggle.checked : true;
    
    // 查找配置摘要头部
    const configHeader = document.querySelector('.config-summary .summary-header');
    if (!configHeader) {
        console.log('⚠️ 未找到配置摘要头部');
        return;
    }
    
    console.log('✅ 找到配置摘要头部');
    
    // 创建最简化的开关容器
    const simpleContainer = document.createElement('div');
    simpleContainer.className = 'simple-memory-toggle';
    simpleContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
        font-size: 0.8rem;
        color: #6b7280;
    `;
    
    // 创建开关
    const toggleId = 'simpleMemoryToggle';
    simpleContainer.innerHTML = `
        <span>记忆功能:</span>
        <label class="simple-memory-switch">
            <input type="checkbox" id="${toggleId}" ${isChecked ? 'checked' : ''}>
            <span class="simple-memory-slider"></span>
        </label>
        <span class="simple-memory-status" style="
            margin-left: 8px;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            background: ${isChecked ? '#d1fae5' : '#fee2e2'};
            color: ${isChecked ? '#065f46' : '#991b1b'};
        ">${isChecked ? '已启用' : '已禁用'}</span>
    `;
    
    // 添加到配置摘要头部
    configHeader.appendChild(simpleContainer);
    
    // 添加样式
    addSimpleToggleStyles();
    
    // 绑定事件
    const toggle = document.getElementById(toggleId);
    bindSimpleToggleEvents(toggle);
    
    console.log('✅ 简化的记忆功能开关已创建');
}

function addSimpleToggleStyles() {
    console.log('🎨 添加简化开关样式...');
    
    const style = document.createElement('style');
    style.textContent = `
        .simple-memory-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }
        
        .simple-memory-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .simple-memory-slider {
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
        
        .simple-memory-slider:before {
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
        
        input:checked + .simple-memory-slider {
            background-color: #8b5cf6;
        }
        
        input:checked + .simple-memory-slider:before {
            transform: translateX(20px);
        }
        
        /* 移除所有其他记忆功能相关的样式 */
        .memory-toggle-container,
        .memory-switch,
        .memory-slider,
        .memory-status {
            display: none !important;
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ 简化开关样式已添加');
}

function bindSimpleToggleEvents(toggle) {
    if (!toggle) return;
    
    console.log('🔗 绑定简化开关事件...');
    
    toggle.addEventListener('change', function() {
        const isEnabled = this.checked;
        console.log(`🔄 记忆功能 ${isEnabled ? '启用' : '禁用'}`);
        
        // 更新状态显示
        updateSimpleMemoryStatus(isEnabled);
        
        // 保存设置
        saveSimpleMemorySetting(isEnabled);
        
        // 显示通知
        showSimpleMemoryNotification(isEnabled);
    });
    
    console.log('✅ 简化开关事件已绑定');
}

function updateSimpleMemoryStatus(isEnabled) {
    console.log('📊 更新简化记忆功能状态...');
    
    const statusElement = document.querySelector('.simple-memory-status');
    if (statusElement) {
        statusElement.textContent = isEnabled ? '已启用' : '已禁用';
        statusElement.style.background = isEnabled ? '#d1fae5' : '#fee2e2';
        statusElement.style.color = isEnabled ? '#065f46' : '#991b1b';
        console.log('✅ 简化状态已更新');
    }
}

function saveSimpleMemorySetting(isEnabled) {
    try {
        localStorage.setItem('simpleMemoryFunctionEnabled', isEnabled ? 'true' : 'false');
        console.log(`💾 简化记忆功能设置已保存: ${isEnabled}`);
    } catch (e) {
        console.log('⚠️ 保存简化设置失败:', e.message);
    }
}

function showSimpleMemoryNotification(isEnabled) {
    console.log(`📢 显示简化记忆功能通知: ${isEnabled ? '启用' : '禁用'}`);
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isEnabled ? '#10b981' : '#f59e0b'};
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 0.9rem;
        font-weight: 600;
        animation: simpleFadeIn 0.5s ease-out;
    `;
    notification.textContent = `🧠 记忆功能 ${isEnabled ? '已启用' : '已禁用'}`;
    
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'simpleFadeOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    // 添加动画样式
    if (!document.querySelector('#simple-memory-animation')) {
        const style = document.createElement('style');
        style.id = 'simple-memory-animation';
        style.textContent = `
            @keyframes simpleFadeIn {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes simpleFadeOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 清理其他记忆功能相关的元素
function cleanupOtherMemoryElements() {
    console.log('🧹 清理其他记忆功能相关元素...');
    
    // 移除所有其他记忆功能容器
    const otherContainers = document.querySelectorAll('.memory-toggle-container');
    otherContainers.forEach((container, index) => {
        if (index > 0) { // 保留第一个（如果有的话）
            container.remove();
            console.log(`🗑️ 删除其他记忆功能容器 ${index + 1}`);
        }
    });
    
    // 移除所有其他记忆功能开关
    const otherToggles = document.querySelectorAll('#memoryFunctionToggle');
    otherToggles.forEach((toggle, index) => {
        if (index > 0) { // 保留第一个（如果有的话）
            toggle.remove();
            console.log(`🗑️ 删除其他记忆功能开关 ${index + 1}`);
        }
    });
    
    // 移除所有其他状态显示
    const otherStatuses = document.querySelectorAll('.memory-status');
    otherStatuses.forEach((status, index) => {
        if (index > 0) { // 保留第一个（如果有的话）
            status.remove();
            console.log(`🗑️ 删除其他状态显示 ${index + 1}`);
        }
    });
    
    console.log('✅ 其他记忆功能元素已清理');
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 页面加载完成，执行记忆功能块处理...');
        setTimeout(() => {
            cleanupOtherMemoryElements();
            // 主处理逻辑会在脚本加载时立即执行
        }, 1000);
    });
} else {
    console.log('⚡ DOM已加载，立即执行清理...');
    setTimeout(cleanupOtherMemoryElements, 500);
}

console.log('🎊 记忆功能块删除脚本加载完成');
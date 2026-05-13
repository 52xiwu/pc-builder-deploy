/**
 * 立即删除整个记忆功能块，只保留「记忆功能」开关本身
 * 直接、简单的解决方案
 */

console.log('🚀 立即删除记忆功能块，只保留开关...');

// 立即执行，不等待DOM加载
(function() {
    console.log('🎯 开始执行删除操作...');
    
    // 方法1: 直接删除所有记忆功能相关元素，只保留开关
    deleteAllMemoryElements();
    
    // 方法2: 创建最简单的记忆功能开关
    createMinimalMemoryToggle();
    
    console.log('✅ 删除操作完成');
})();

function deleteAllMemoryElements() {
    console.log('🗑️ 删除所有记忆功能相关元素...');
    
    // 删除所有记忆功能容器
    const memoryContainers = document.querySelectorAll('.memory-toggle-container, .simple-memory-toggle, [class*="memory"]');
    memoryContainers.forEach(container => {
        console.log(`🗑️ 删除容器: ${container.className}`);
        container.remove();
    });
    
    // 删除所有记忆功能开关（除了我们可能要保留的）
    const memoryToggles = document.querySelectorAll('#memoryFunctionToggle, #simpleMemoryToggle, input[type="checkbox"][id*="memory"]');
    console.log(`📊 找到 ${memoryToggles.length} 个记忆功能开关`);
    
    // 保存第一个开关的状态（如果有的话）
    let savedToggleState = true;
    if (memoryToggles.length > 0) {
        savedToggleState = memoryToggles[0].checked;
        console.log(`💾 保存开关状态: ${savedToggleState ? '启用' : '禁用'}`);
    }
    
    // 删除所有开关
    memoryToggles.forEach(toggle => {
        console.log(`🗑️ 删除开关: ${toggle.id}`);
        toggle.remove();
    });
    
    // 删除所有状态显示
    const statusElements = document.querySelectorAll('.memory-status, .simple-memory-status, [class*="status"]');
    statusElements.forEach(status => {
        console.log(`🗑️ 删除状态显示: ${status.className}`);
        status.remove();
    });
    
    // 删除所有包含"记忆功能"文本的元素（除了我们可能要保留的）
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        if (element.textContent && element.textContent.includes('记忆功能')) {
            // 检查是否是简单的文本元素（不是容器）
            if (!element.querySelector && element.parentElement) {
                console.log(`🗑️ 删除文本元素: "${element.textContent.trim()}"`);
                element.remove();
            }
        }
    });
    
    return savedToggleState;
}

function createMinimalMemoryToggle() {
    console.log('✨ 创建最简单的记忆功能开关...');
    
    // 查找配置摘要头部
    const configHeader = document.querySelector('.config-summary .summary-header');
    if (!configHeader) {
        console.log('⚠️ 未找到配置摘要头部');
        return;
    }
    
    console.log('✅ 找到配置摘要头部');
    
    // 创建绝对最简单的开关
    const minimalContainer = document.createElement('div');
    minimalContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
        font-size: 0.8rem;
        color: #6b7280;
    `;
    
    // 创建开关ID
    const toggleId = 'minimalMemoryToggle_' + Date.now();
    
    // 最简单的HTML - 只有文本和开关
    minimalContainer.innerHTML = `
        <span style="white-space: nowrap;">记忆功能:</span>
        <label style="position: relative; display: inline-block; width: 40px; height: 20px;">
            <input type="checkbox" id="${toggleId}" checked style="opacity: 0; width: 0; height: 0;">
            <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px;"></span>
            <span style="position: absolute; content: ''; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;"></span>
        </label>
    `;
    
    // 添加到配置摘要头部
    configHeader.appendChild(minimalContainer);
    
    // 获取开关元素
    const toggle = document.getElementById(toggleId);
    if (!toggle) {
        console.log('⚠️ 开关创建失败');
        return;
    }
    
    // 添加开关样式
    const style = document.createElement('style');
    style.textContent = `
        #${toggleId}:checked + span {
            background-color: #8b5cf6 !important;
        }
        
        #${toggleId}:checked + span + span {
            transform: translateX(20px) !important;
        }
    `;
    document.head.appendChild(style);
    
    // 绑定最简单的事件
    toggle.addEventListener('change', function() {
        console.log(`🔄 记忆功能 ${this.checked ? '启用' : '禁用'}`);
        
        // 保存设置
        try {
            localStorage.setItem('memoryEnabled', this.checked ? 'true' : 'false');
        } catch (e) {
            console.log('⚠️ 保存失败:', e.message);
        }
        
        // 显示简单通知
        showMinimalNotification(this.checked);
    });
    
    console.log('✅ 最简单的记忆功能开关已创建');
}

function showMinimalNotification(isEnabled) {
    const notification = document.createElement('div');
    notification.textContent = `🧠 记忆功能 ${isEnabled ? '启用' : '禁用'}`;
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
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
    
    // 添加动画
    if (!document.querySelector('#minimal-animation')) {
        const style = document.createElement('style');
        style.id = 'minimal-animation';
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
}

// 立即执行清理
function immediateCleanup() {
    console.log('⚡ 立即清理...');
    
    // 删除所有可能干扰的脚本创建的元素
    const elementsToRemove = [
        '.memory-toggle-container',
        '.simple-memory-toggle',
        '.memory-switch',
        '.simple-memory-switch',
        '.memory-slider',
        '.simple-memory-slider',
        '.memory-status',
        '.simple-memory-status'
    ];
    
    elementsToRemove.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            console.log(`🗑️ 立即删除: ${selector}`);
            el.remove();
        });
    });
}

// 执行立即清理
immediateCleanup();

// 如果DOM已加载，立即执行主函数
if (document.readyState !== 'loading') {
    console.log('⚡ DOM已就绪，立即执行');
} else {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM加载完成，执行删除');
        setTimeout(deleteAllMemoryElements, 100);
        setTimeout(createMinimalMemoryToggle, 200);
    });
}

console.log('🎊 立即删除脚本加载完成');
/**
 * 立即修复记忆功能开关问题
 * 确保在DOM加载完成后立即执行
 */

console.log('⚡ 立即修复记忆功能开关...');

// 使用DOMContentLoaded确保在DOM加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeImmediateFix);
} else {
    // 如果DOM已经加载，立即执行
    setTimeout(executeImmediateFix, 100);
}

function executeImmediateFix() {
    console.log('📄 DOM已加载，开始立即修复...');
    
    try {
        // 1. 首先删除所有现有的记忆功能文本
        removeAllMemoryText();
        
        // 2. 创建单个记忆功能开关
        createSingleMemoryToggle();
        
        // 3. 验证结果
        verifyImmediateFix();
        
        console.log('✅ 立即修复完成');
    } catch (error) {
        console.error('❌ 立即修复失败:', error);
        showErrorMessage('修复失败: ' + error.message);
    }
}

function removeAllMemoryText() {
    console.log('🗑️ 删除所有记忆功能文本...');
    
    // 查找所有包含"记忆功能"的文本节点
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodesToRemove = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.textContent.includes('记忆功能')) {
            nodesToRemove.push(node);
        }
    }
    
    console.log(`📊 找到 ${nodesToRemove.length} 个包含"记忆功能"的文本节点`);
    
    // 删除这些文本节点
    nodesToRemove.forEach((node, index) => {
        try {
            node.textContent = '';
            console.log(`🗑️ 删除文本节点 ${index + 1}`);
        } catch (error) {
            console.log(`⚠️ 无法删除文本节点 ${index + 1}`);
        }
    });
    
    // 删除包含"记忆功能"的元素
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        const text = element.textContent || '';
        if (text.includes('记忆功能') && text.trim().length > 0) {
            try {
                element.remove();
                console.log('🗑️ 删除包含"记忆功能"的元素');
            } catch (error) {
                // 忽略错误
            }
        }
    });
}

function createSingleMemoryToggle() {
    console.log('✨ 创建单个记忆功能开关...');
    
    // 查找配置摘要区域
    let configSummary = document.querySelector('.config-summary');
    if (!configSummary) {
        console.log('⚠️ 未找到配置摘要区域，尝试创建');
        // 尝试在页面中查找合适的位置
        const mainContent = document.querySelector('main, .container, .content') || document.body;
        configSummary = createConfigSummary(mainContent);
    }
    
    // 查找或创建摘要头部
    let summaryHeader = configSummary.querySelector('.summary-header');
    if (!summaryHeader) {
        console.log('⚠️ 未找到摘要头部，创建新的');
        summaryHeader = document.createElement('div');
        summaryHeader.className = 'summary-header';
        summaryHeader.innerHTML = '<h3><i class="fas fa-list-check"></i> 配置摘要</h3>';
        configSummary.prepend(summaryHeader);
    }
    
    console.log('✅ 找到/创建了配置摘要区域');
    
    // 创建记忆功能开关
    const toggleId = 'immediateMemoryToggle';
    const toggleHtml = `
        <div class="memory-toggle-immediate" style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
            font-size: 0.8rem;
            color: #6b7280;
        ">
            <span>记忆功能:</span>
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
    
    // 添加到摘要头部
    summaryHeader.insertAdjacentHTML('beforeend', toggleHtml);
    
    // 添加开关样式
    const style = document.createElement('style');
    style.textContent = `
        #${toggleId}:checked + span {
            background-color: #8b5cf6 !important;
        }
        #${toggleId}:checked + span + span {
            transform: translateX(20px) !important;
        }
        
        /* 确保只有一个开关 */
        .memory-toggle-immediate ~ .memory-toggle-immediate {
            display: none !important;
        }
        
        /* 隐藏所有其他可能的开关 */
        [class*="memory"]:not(.memory-toggle-immediate),
        [id*="memory"]:not(#${toggleId}) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // 绑定事件
    const toggle = document.getElementById(toggleId);
    if (toggle) {
        toggle.addEventListener('change', function() {
            console.log('记忆功能:', this.checked ? '开启' : '关闭');
            localStorage.setItem('memoryEnabled', this.checked);
            showToggleStatus(this.checked);
        });
        
        // 设置初始状态
        const savedState = localStorage.getItem('memoryEnabled');
        if (savedState !== null) {
            toggle.checked = savedState === 'true';
        }
    }
    
    console.log('✅ 单个记忆功能开关已创建');
}

function createConfigSummary(parent) {
    console.log('🔧 创建配置摘要区域...');
    
    const configSummary = document.createElement('div');
    configSummary.className = 'config-summary';
    configSummary.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        margin: 20px 0;
    `;
    
    parent.appendChild(configSummary);
    return configSummary;
}

function verifyImmediateFix() {
    console.log('🔍 验证立即修复结果...');
    
    setTimeout(() => {
        // 检查checkbox数量
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const memoryCheckboxes = Array.from(checkboxes).filter(checkbox => {
            const parentText = checkbox.parentElement?.textContent || '';
            return parentText.includes('记忆功能');
        });
        
        console.log(`📊 验证结果:`);
        console.log(`  - 总checkbox数量: ${checkboxes.length}`);
        console.log(`  - 记忆功能checkbox数量: ${memoryCheckboxes.length}`);
        
        if (memoryCheckboxes.length === 1) {
            showSuccessMessage('✅ 成功创建单个记忆功能开关');
            
            // 显示开关状态
            const toggle = memoryCheckboxes[0];
            showToggleStatus(toggle.checked);
        } else if (memoryCheckboxes.length === 0) {
            showWarningMessage('⚠️ 没有创建记忆功能开关');
        } else {
            showErrorMessage(`❌ 有 ${memoryCheckboxes.length} 个记忆功能开关`);
        }
    }, 500);
}

function showToggleStatus(isEnabled) {
    const status = document.createElement('div');
    status.textContent = `记忆功能 ${isEnabled ? '已启用' : '已禁用'}`;
    status.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${isEnabled ? '#10b981' : '#6b7280'};
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        z-index: 9998;
        animation: statusFade 2s ease;
    `;
    
    document.body.appendChild(status);
    
    setTimeout(() => {
        status.style.animation = 'statusFadeOut 0.5s ease';
        setTimeout(() => status.remove(), 500);
    }, 2000);
    
    // 添加动画样式
    if (!document.querySelector('#status-animation')) {
        const style = document.createElement('style');
        style.id = 'status-animation';
        style.textContent = `
            @keyframes statusFade {
                0% { opacity: 0; transform: translateY(10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(10px); }
            }
            @keyframes statusFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function showSuccessMessage(text) {
    showMessage(text, '#10b981');
}

function showWarningMessage(text) {
    showMessage(text, '#f59e0b');
}

function showErrorMessage(text) {
    showMessage(text, '#ef4444');
}

function showMessage(text, color) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 0.9rem;
        font-weight: 600;
        animation: messageFade 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'messageFadeOut 0.5s ease';
        setTimeout(() => message.remove(), 500);
    }, 3000);
    
    // 添加动画样式
    if (!document.querySelector('#message-animation')) {
        const style = document.createElement('style');
        style.id = 'message-animation';
        style.textContent = `
            @keyframes messageFade {
                0% { opacity: 0; transform: translateX(100%); }
                20% { opacity: 1; transform: translateX(0); }
                80% { opacity: 1; transform: translateX(0); }
                100% { opacity: 0; transform: translateX(100%); }
            }
            @keyframes messageFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

console.log('🎯 立即修复脚本已加载，等待DOM加载...');
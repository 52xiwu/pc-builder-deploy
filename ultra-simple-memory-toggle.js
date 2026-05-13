/**
 * 超简单记忆功能开关
 * 删除所有复杂元素，只保留最简单的开关
 */

console.log('🎯 创建超简单记忆功能开关...');

// 立即执行
(function() {
    // 1. 删除所有记忆功能相关元素
    deleteEverything();
    
    // 2. 创建最简单的开关
    createUltraSimpleToggle();
    
    console.log('✅ 超简单开关创建完成');
})();

function deleteEverything() {
    console.log('🗑️ 删除所有记忆功能相关元素...');
    
    // 删除所有可能包含记忆功能的元素
    const selectors = [
        '.memory-toggle-container',
        '.simple-memory-toggle',
        '.memory-switch',
        '.simple-memory-switch',
        '.memory-slider', 
        '.simple-memory-slider',
        '.memory-status',
        '.simple-memory-status',
        '[class*="memory"]',
        '[id*="memory"]'
    ];
    
    selectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        } catch (e) {
            // 忽略错误
        }
    });
    
    // 删除包含"记忆功能"文本的元素
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.textContent && el.textContent.includes('记忆功能')) {
            try {
                el.remove();
            } catch (e) {
                // 忽略错误
            }
        }
    });
}

function createUltraSimpleToggle() {
    console.log('✨ 创建超简单开关...');
    
    // 找到配置摘要头部
    const configHeader = document.querySelector('.config-summary .summary-header');
    if (!configHeader) {
        console.log('⚠️ 未找到配置摘要头部');
        return;
    }
    
    // 创建最简单的容器
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
    `;
    
    // 创建开关ID
    const toggleId = 'ultraSimpleToggle';
    
    // 最简单的HTML结构
    container.innerHTML = `
        <span style="font-size: 0.8rem; color: #6b7280;">记忆功能:</span>
        <label style="position: relative; display: inline-block; width: 40px; height: 20px;">
            <input type="checkbox" id="${toggleId}" checked style="opacity: 0; width: 0; height: 0;">
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
    `;
    
    // 添加到页面
    configHeader.appendChild(container);
    
    // 获取开关元素
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;
    
    // 添加开关激活样式
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
        console.log('记忆功能:', this.checked ? '开启' : '关闭');
        
        // 保存设置
        try {
            localStorage.setItem('memory', this.checked ? 'on' : 'off');
        } catch (e) {
            // 忽略错误
        }
        
        // 显示简单提示
        showSimpleTip(this.checked);
    });
}

function showSimpleTip(isEnabled) {
    const tip = document.createElement('div');
    tip.textContent = isEnabled ? '记忆功能已开启' : '记忆功能已关闭';
    tip.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isEnabled ? '#10b981' : '#f59e0b'};
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        z-index: 9999;
        animation: fadeInOut 2s ease;
    `;
    
    document.body.appendChild(tip);
    
    setTimeout(() => {
        tip.remove();
    }, 2000);
    
    // 添加动画
    if (!document.querySelector('#tip-animation')) {
        const style = document.createElement('style');
        style.id = 'tip-animation';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 确保执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            deleteEverything();
            createUltraSimpleToggle();
        }, 100);
    });
}

console.log('🚀 超简单记忆功能开关脚本已加载');
/**
 * 删除红色保存设置按钮
 * 专门删除配置摘要中的红色保存按钮
 */

console.log('🔴 删除红色保存设置按钮...');

// 立即执行
(function() {
    console.log('🎯 开始查找并删除红色保存按钮...');
    
    // 方法1: 直接删除配置摘要中的保存按钮
    removeSaveButtonFromConfigSummary();
    
    // 方法2: 删除所有红色的保存按钮
    removeAllRedSaveButtons();
    
    // 方法3: 防止按钮重新出现
    preventButtonReappearance();
    
    console.log('✅ 红色保存按钮删除完成');
})();

function removeSaveButtonFromConfigSummary() {
    console.log('1. 删除配置摘要中的保存按钮...');
    
    // 查找配置摘要区域
    const configSummary = document.querySelector('.config-summary');
    if (!configSummary) {
        console.log('⚠️ 未找到配置摘要区域');
        return;
    }
    
    // 查找摘要头部
    const summaryHeader = configSummary.querySelector('.summary-header');
    if (!summaryHeader) {
        console.log('⚠️ 未找到摘要头部');
        return;
    }
    
    // 查找保存配置按钮
    const saveButtons = summaryHeader.querySelectorAll('button');
    let removedCount = 0;
    
    saveButtons.forEach(button => {
        // 检查按钮文本
        const buttonText = button.textContent.trim().toLowerCase();
        const hasSaveText = buttonText.includes('保存') || buttonText.includes('save');
        
        // 检查按钮样式
        const isRedButton = button.classList.contains('btn-danger') || 
                           button.classList.contains('red') ||
                           button.style.backgroundColor.includes('red') ||
                           button.style.color.includes('red') ||
                           getComputedStyle(button).backgroundColor.includes('rgb(239, 68, 68)') ||
                           getComputedStyle(button).backgroundColor.includes('#ef4444');
        
        // 检查按钮ID
        const isSaveButton = button.id.includes('save') || button.id.includes('Save');
        
        if (hasSaveText || isRedButton || isSaveButton) {
            console.log(`🗑️ 删除按钮: ${button.textContent.trim()}`);
            button.remove();
            removedCount++;
        }
    });
    
    if (removedCount > 0) {
        console.log(`✅ 已删除 ${removedCount} 个保存按钮`);
    } else {
        console.log('ℹ️ 未找到需要删除的保存按钮');
    }
}

function removeAllRedSaveButtons() {
    console.log('2. 删除所有红色的保存按钮...');
    
    // 查找所有按钮
    const allButtons = document.querySelectorAll('button');
    let removedCount = 0;
    
    allButtons.forEach(button => {
        // 检查是否是红色按钮
        const isRedButton = button.classList.contains('btn-danger') || 
                           button.classList.contains('red') ||
                           button.classList.contains('danger') ||
                           button.style.backgroundColor.includes('red') ||
                           button.style.color.includes('red');
        
        // 检查按钮文本
        const buttonText = button.textContent.trim().toLowerCase();
        const hasSaveText = buttonText.includes('保存') || buttonText.includes('save');
        
        if (isRedButton && hasSaveText) {
            console.log(`🔴 删除红色保存按钮: ${button.textContent.trim()}`);
            button.remove();
            removedCount++;
        }
    });
    
    if (removedCount > 0) {
        console.log(`✅ 已删除 ${removedCount} 个红色保存按钮`);
    } else {
        console.log('ℹ️ 未找到红色保存按钮');
    }
}

function preventButtonReappearance() {
    console.log('3. 防止按钮重新出现...');
    
    // 监控DOM变化，防止按钮被重新添加
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查新添加的元素中是否有保存按钮
                        const buttons = node.querySelectorAll ? node.querySelectorAll('button') : [];
                        if (node.tagName === 'BUTTON') {
                            buttons.push(node);
                        }
                        
                        buttons.forEach(button => {
                            const buttonText = button.textContent.trim().toLowerCase();
                            const hasSaveText = buttonText.includes('保存') || buttonText.includes('save');
                            
                            if (hasSaveText) {
                                console.log('🚫 阻止新出现的保存按钮:', button.textContent.trim());
                                button.remove();
                            }
                        });
                    }
                });
            }
        });
    });
    
    // 开始观察整个文档
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('✅ DOM变化监控已启用');
    
    // 定期检查（防止某些脚本动态添加按钮）
    setInterval(() => {
        const saveButtons = document.querySelectorAll('button');
        saveButtons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            const hasSaveText = buttonText.includes('保存') || buttonText.includes('save');
            
            if (hasSaveText && button.isConnected) {
                console.log('🔄 定期检查发现保存按钮，正在删除:', button.textContent.trim());
                button.remove();
            }
        });
    }, 5000); // 每5秒检查一次
    
    console.log('✅ 定期检查已启用');
}

// 添加样式来隐藏可能出现的保存按钮
function addPreventionStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 隐藏所有保存配置按钮 */
        button#saveConfigBtn,
        button[class*="save"],
        button:contains("保存配置"),
        button:contains("保存设置") {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
        }
        
        /* 隐藏红色保存按钮 */
        .btn-danger:contains("保存"),
        .btn-red:contains("保存"),
        button[style*="red"]:contains("保存") {
            display: none !important;
        }
        
        /* 配置摘要区域优化 */
        .summary-header {
            position: relative;
        }
        
        .summary-header::after {
            content: "保存功能已禁用";
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.8rem;
            color: #6b7280;
            opacity: 0.7;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ 预防样式已添加');
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM加载完成，执行删除操作...');
        addPreventionStyles();
    });
} else {
    console.log('⚡ DOM已加载，立即执行...');
    addPreventionStyles();
}

console.log('🎊 红色保存按钮删除脚本加载完成');
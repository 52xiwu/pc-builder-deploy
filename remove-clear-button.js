/**
 * 移除"清除所有选择"按钮
 * 这个按钮影响美观，且功能可以通过点击单个硬件取消实现
 */

console.log('🧹 移除"清除所有选择"按钮...');

// 立即执行
(function() {
    console.log('🎯 开始移除清除按钮...');
    
    // 方法1：直接移除按钮
    removeClearButtonDirectly();
    
    // 方法2：阻止按钮被添加
    preventClearButtonAddition();
    
    // 方法3：定期检查并移除
    setupClearButtonMonitor();
    
    console.log('✅ 清除按钮移除初始化完成');
})();

function removeClearButtonDirectly() {
    console.log('🔍 直接查找并移除清除按钮...');
    
    // 查找所有可能的清除按钮
    const selectors = [
        '.btn-outline', 
        'button[class*="clear"]',
        'button[class*="delete"]',
        'button:contains("清除")',
        'button:contains("删除")',
        'button:contains("Clear")',
        'button:contains("Delete")'
    ];
    
    let removedCount = 0;
    
    selectors.forEach(selector => {
        try {
            // 使用更通用的方法查找
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                const buttonText = button.textContent.toLowerCase();
                if (buttonText.includes('清除') || buttonText.includes('删除') || 
                    buttonText.includes('clear') || buttonText.includes('delete')) {
                    
                    // 检查是否在配置摘要区域
                    const configActions = button.closest('.config-actions');
                    const configSummary = button.closest('.config-summary');
                    
                    if (configActions || configSummary) {
                        button.remove();
                        removedCount++;
                        console.log(`➖ 移除按钮: ${button.textContent}`);
                    }
                }
            });
        } catch (e) {
            console.log(`⚠️ 选择器 ${selector} 查询失败: ${e.message}`);
        }
    });
    
    console.log(`✅ 直接移除了 ${removedCount} 个清除按钮`);
}

function preventClearButtonAddition() {
    console.log('🛡️ 阻止清除按钮被添加...');
    
    // 拦截DOM插入操作
    const originalAppendChild = Element.prototype.appendChild;
    const originalInsertBefore = Element.prototype.insertBefore;
    
    Element.prototype.appendChild = function(child) {
        if (isClearButton(child)) {
            console.log('🚫 阻止添加清除按钮');
            return child; // 不添加到DOM
        }
        return originalAppendChild.call(this, child);
    };
    
    Element.prototype.insertBefore = function(newNode, referenceNode) {
        if (isClearButton(newNode)) {
            console.log('🚫 阻止插入清除按钮');
            return newNode; // 不插入到DOM
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
    };
    
    console.log('✅ DOM操作拦截已设置');
}

function isClearButton(element) {
    if (!element || element.nodeType !== 1) return false;
    
    // 检查是否是按钮元素
    if (element.tagName !== 'BUTTON') return false;
    
    // 检查按钮文本
    const buttonText = element.textContent.toLowerCase();
    const isClearButton = buttonText.includes('清除') || 
                         buttonText.includes('删除') || 
                         buttonText.includes('clear') || 
                         buttonText.includes('delete');
    
    // 检查是否在配置摘要区域
    if (isClearButton) {
        console.log(`🔍 检测到清除按钮: ${element.textContent}`);
        return true;
    }
    
    return false;
}

function setupClearButtonMonitor() {
    console.log('👀 设置清除按钮监控...');
    
    // 定期检查并移除清除按钮
    const monitorInterval = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        let foundCount = 0;
        
        buttons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            const isClearButton = buttonText.includes('清除') || 
                                 buttonText.includes('删除') || 
                                 buttonText.includes('clear') || 
                                 buttonText.includes('delete');
            
            // 检查是否在配置摘要区域
            const configActions = button.closest('.config-actions');
            const configSummary = button.closest('.config-summary');
            
            if (isClearButton && (configActions || configSummary)) {
                button.remove();
                foundCount++;
                console.log(`👀 监控移除按钮: ${button.textContent}`);
            }
        });
        
        if (foundCount > 0) {
            console.log(`✅ 监控移除了 ${foundCount} 个清除按钮`);
        }
    }, 2000); // 每2秒检查一次
    
    // 10分钟后停止监控
    setTimeout(() => {
        clearInterval(monitorInterval);
        console.log('⏹️ 清除按钮监控已停止');
    }, 10 * 60 * 1000);
    
    console.log('✅ 清除按钮监控已启动');
}

// 添加样式隐藏可能的清除按钮
const hideClearButtonStyle = document.createElement('style');
hideClearButtonStyle.textContent = `
    /* 隐藏所有清除按钮 */
    button[class*="clear"],
    button[class*="delete"],
    button:contains("清除"),
    button:contains("删除"),
    button:contains("Clear"),
    button:contains("Delete") {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        left: -9999px !important;
    }
    
    /* 配置摘要区域按钮间距调整 */
    .config-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .config-actions button:not([style*="display: none"]) {
        width: 100%;
    }
`;
document.head.appendChild(hideClearButtonStyle);

console.log('🎨 清除按钮隐藏样式已添加');

// 初始化完成后的操作
setTimeout(() => {
    console.log('🔧 清除按钮移除完成状态检查...');
    
    // 检查是否还有清除按钮
    const buttons = document.querySelectorAll('button');
    let clearButtonCount = 0;
    
    buttons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('清除') || buttonText.includes('删除')) {
            clearButtonCount++;
            console.log(`⚠️ 发现清除按钮: ${button.textContent}`);
        }
    });
    
    if (clearButtonCount === 0) {
        console.log('🎉 所有清除按钮已成功移除！');
    } else {
        console.log(`⚠️ 仍有 ${clearButtonCount} 个清除按钮需要处理`);
    }
}, 3000);

console.log('🚀 清除按钮移除脚本加载完成');
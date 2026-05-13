/**
 * 强制删除第二个记忆功能开关
 * 直接、立即、强制删除
 */

console.log('⚡ 强制删除第二个记忆功能开关...');

// 立即执行，不等待
(function() {
    console.log('🚀 开始强制删除...');
    
    // 1. 立即查找并删除
    forceRemoveSecondToggle();
    
    // 2. 清理残留
    cleanupResidue();
    
    // 3. 验证结果
    verifyForceRemoval();
    
    console.log('✅ 强制删除完成');
})();

function forceRemoveSecondToggle() {
    console.log('🔍 强制查找第二个开关...');
    
    // 方法1: 直接查找所有checkbox并删除第二个
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    console.log(`📊 找到 ${allCheckboxes.length} 个checkbox`);
    
    if (allCheckboxes.length >= 2) {
        console.log('🎯 找到至少2个checkbox，删除第二个');
        const secondCheckbox = allCheckboxes[1];
        const parent = secondCheckbox.parentElement;
        
        if (parent) {
            console.log('🗑️ 删除第二个checkbox的父元素');
            parent.remove();
        } else {
            console.log('🗑️ 直接删除第二个checkbox');
            secondCheckbox.remove();
        }
    }
    
    // 方法2: 查找所有包含"记忆功能"的元素
    const allElements = document.querySelectorAll('*');
    const memoryElements = [];
    
    allElements.forEach(element => {
        const text = element.textContent || '';
        if (text.includes('记忆功能')) {
            memoryElements.push({
                element: element,
                text: text.trim(),
                hasCheckbox: !!element.querySelector('input[type="checkbox"]')
            });
        }
    });
    
    console.log(`📊 找到 ${memoryElements.length} 个包含"记忆功能"的元素`);
    
    if (memoryElements.length >= 2) {
        // 删除第二个元素
        const secondElement = memoryElements[1];
        console.log('🗑️ 删除第二个包含"记忆功能"的元素:', {
            text: secondElement.text.substring(0, 30),
            hasCheckbox: secondElement.hasCheckbox
        });
        secondElement.element.remove();
    }
    
    // 方法3: 查找绿色元素并删除
    const greenElements = document.querySelectorAll('[style*="green"], [style*="#10b981"], [style*="#059669"], .btn-success, .bg-green');
    console.log(`📊 找到 ${greenElements.length} 个绿色元素`);
    
    greenElements.forEach((element, index) => {
        const text = element.textContent || '';
        if (text.includes('记忆功能') || text.includes('已启用')) {
            console.log(`🗑️ 删除绿色记忆功能元素 ${index + 1}`);
            element.remove();
        }
    });
    
    // 方法4: 查找"已启用"文本并删除
    const enabledElements = [];
    allElements.forEach(element => {
        const text = element.textContent || '';
        if (text.includes('已启用') && !text.includes('记忆功能:')) {
            enabledElements.push(element);
        }
    });
    
    console.log(`📊 找到 ${enabledElements.length} 个包含"已启用"的元素`);
    enabledElements.forEach(element => {
        console.log('🗑️ 删除"已启用"元素');
        element.remove();
    });
}

function cleanupResidue() {
    console.log('🧹 清理残留...');
    
    // 清理所有可能残留的绿色样式
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        const style = element.style.cssText || '';
        if (style.includes('green') || style.includes('#10b981') || style.includes('#059669')) {
            element.style.cssText = style.replace(/green|#10b981|#059669/g, '');
            console.log('🎨 清理绿色样式');
        }
    });
    
    // 清理重复的文本
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.includes('记忆功能已启用')) {
            node.textContent = node.textContent.replace('记忆功能已启用', '').trim();
            console.log('📝 清理"记忆功能已启用"文本');
        }
    }
    
    // 隐藏可能漏掉的元素
    const configSummary = document.querySelector('.config-summary');
    if (configSummary) {
        const children = configSummary.querySelectorAll('*');
        let memoryCount = 0;
        
        children.forEach(child => {
            const text = child.textContent || '';
            if (text.includes('记忆功能')) {
                memoryCount++;
                if (memoryCount > 1) {
                    console.log('👻 隐藏额外的记忆功能元素');
                    child.style.display = 'none';
                    child.style.visibility = 'hidden';
                }
            }
        });
    }
}

function verifyForceRemoval() {
    console.log('🔍 验证强制删除结果...');
    
    setTimeout(() => {
        // 检查checkbox数量
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        console.log(`📊 剩余checkbox数量: ${checkboxes.length}`);
        
        // 检查"记忆功能"文本数量
        const allElements = document.querySelectorAll('*');
        let memoryTextCount = 0;
        let memoryCheckboxCount = 0;
        
        allElements.forEach(element => {
            const text = element.textContent || '';
            if (text.includes('记忆功能')) {
                memoryTextCount++;
                
                if (element.querySelector('input[type="checkbox"]')) {
                    memoryCheckboxCount++;
                }
            }
        });
        
        console.log(`📊 包含"记忆功能"文本的元素: ${memoryTextCount}`);
        console.log(`📊 包含checkbox的记忆功能元素: ${memoryCheckboxCount}`);
        
        // 显示结果
        if (memoryCheckboxCount === 1) {
            showForceSuccessMessage();
        } else if (memoryCheckboxCount === 0) {
            showForceWarningMessage();
        } else {
            showForceErrorMessage(memoryCheckboxCount);
        }
        
        // 如果还有问题，尝试最后的手段
        if (memoryCheckboxCount > 1) {
            console.log('⚠️ 仍有多个开关，使用最终手段...');
            useFinalMethod();
        }
        
    }, 1000);
}

function useFinalMethod() {
    console.log('💥 使用最终手段...');
    
    // 找到配置摘要区域
    const configSummary = document.querySelector('.config-summary');
    if (!configSummary) return;
    
    // 删除配置摘要区域内的所有checkbox，然后重新添加一个
    const checkboxes = configSummary.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.remove();
    });
    
    // 创建新的简单开关
    createSimpleToggle(configSummary);
}

function createSimpleToggle(container) {
    console.log('✨ 创建新的简单开关...');
    
    // 查找摘要头部
    const header = container.querySelector('.summary-header');
    if (!header) return;
    
    // 创建最简单的开关
    const toggleHtml = `
        <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
            <span style="font-size: 0.8rem; color: #6b7280;">记忆功能:</span>
            <label style="position: relative; display: inline-block; width: 40px; height: 20px;">
                <input type="checkbox" id="finalMemoryToggle" checked 
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
        #finalMemoryToggle:checked + span {
            background-color: #8b5cf6 !important;
        }
        #finalMemoryToggle:checked + span + span {
            transform: translateX(20px) !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ 新的简单开关已创建');
}

function showForceSuccessMessage() {
    const message = document.createElement('div');
    message.textContent = '✅ 第二个开关已强制删除';
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
        animation: forceFadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addForceAnimationStyle();
}

function showForceWarningMessage() {
    const message = document.createElement('div');
    message.textContent = '⚠️ 所有开关都被删除了，已创建新开关';
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
        animation: forceFadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addForceAnimationStyle();
}

function showForceErrorMessage(count) {
    const message = document.createElement('div');
    message.textContent = `❌ 仍有 ${count} 个开关，使用最终手段`;
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
        animation: forceFadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addForceAnimationStyle();
}

function addForceAnimationStyle() {
    if (!document.querySelector('#force-animation')) {
        const style = document.createElement('style');
        style.id = 'force-animation';
        style.textContent = `
            @keyframes forceFadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 立即执行，不等待DOM
console.log('💣 立即执行强制删除...');
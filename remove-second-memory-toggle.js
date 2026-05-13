/**
 * 删除第二个记忆功能开关
 * 配置摘要中有一个紫色开关和一个绿色开关，需要删除绿色开关
 */

console.log('🔍 查找并删除第二个记忆功能开关...');

// 安全执行
try {
    removeSecondMemoryToggle();
    console.log('✅ 第二个记忆功能开关处理完成');
} catch (error) {
    console.error('❌ 处理失败:', error);
}

function removeSecondMemoryToggle() {
    console.log('🎯 开始查找第二个记忆功能开关...');
    
    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeRemoval);
    } else {
        setTimeout(executeRemoval, 100);
    }
    
    function executeRemoval() {
        console.log('📄 页面加载完成，开始查找...');
        
        // 1. 查找配置摘要区域
        const configSummary = document.querySelector('.config-summary');
        if (!configSummary) {
            console.log('⚠️ 未找到配置摘要区域');
            return;
        }
        
        console.log('✅ 找到配置摘要区域');
        
        // 2. 查找所有记忆功能相关元素
        const memoryElements = findMemoryElements(configSummary);
        
        if (memoryElements.length <= 1) {
            console.log('ℹ️ 只有一个记忆功能元素，无需删除');
            return;
        }
        
        console.log(`📊 找到 ${memoryElements.length} 个记忆功能相关元素`);
        
        // 3. 分析元素特征，找出第二个开关
        const secondToggle = identifySecondToggle(memoryElements);
        
        if (!secondToggle) {
            console.log('⚠️ 未找到第二个开关');
            return;
        }
        
        // 4. 删除第二个开关
        deleteSecondToggle(secondToggle);
        
        // 5. 验证结果
        verifyRemoval();
    }
}

function findMemoryElements(container) {
    console.log('🔍 查找记忆功能相关元素...');
    
    const elements = [];
    
    // 查找所有可能包含记忆功能的元素
    const allElements = container.querySelectorAll('*');
    
    allElements.forEach(element => {
        const text = element.textContent || '';
        const html = element.innerHTML || '';
        const className = element.className || '';
        const style = element.style.cssText || '';
        
        // 检查是否与记忆功能相关
        const isMemoryRelated = 
            text.includes('记忆功能') ||
            text.includes('Memory Function') ||
            text.includes('已启用') ||
            text.includes('已禁用') ||
            className.includes('memory') ||
            className.includes('Memory') ||
            html.includes('记忆功能') ||
            style.includes('purple') ||
            style.includes('green') ||
            style.includes('#8b5cf6') || // 紫色
            style.includes('#10b981');   // 绿色
        
        if (isMemoryRelated) {
            elements.push({
                element: element,
                text: text.trim(),
                html: html.substring(0, 100),
                className: className,
                hasCheckbox: !!element.querySelector('input[type="checkbox"]'),
                isPurple: style.includes('#8b5cf6') || className.includes('purple') || text.includes('紫色'),
                isGreen: style.includes('#10b981') || className.includes('green') || text.includes('绿色') || text.includes('已启用'),
                depth: getElementDepth(element)
            });
        }
    });
    
    // 记录找到的元素
    elements.forEach((item, index) => {
        console.log(`  元素 ${index + 1}:`, {
            text: item.text.substring(0, 30),
            hasCheckbox: item.hasCheckbox,
            isPurple: item.isPurple,
            isGreen: item.isGreen,
            depth: item.depth
        });
    });
    
    return elements;
}

function getElementDepth(element) {
    let depth = 0;
    let current = element;
    while (current && current !== document.body) {
        depth++;
        current = current.parentElement;
    }
    return depth;
}

function identifySecondToggle(elements) {
    console.log('🤔 识别第二个开关...');
    
    // 策略1: 查找绿色开关
    const greenToggles = elements.filter(item => item.isGreen && item.hasCheckbox);
    if (greenToggles.length > 0) {
        console.log('🎯 找到绿色开关');
        return greenToggles[0];
    }
    
    // 策略2: 查找包含"已启用"文本的元素
    const enabledElements = elements.filter(item => 
        item.text.includes('已启用') && item.hasCheckbox
    );
    if (enabledElements.length > 0) {
        console.log('🎯 找到"已启用"开关');
        return enabledElements[0];
    }
    
    // 策略3: 查找第二个有checkbox的元素
    const checkboxElements = elements.filter(item => item.hasCheckbox);
    if (checkboxElements.length >= 2) {
        console.log('🎯 找到第二个checkbox元素');
        return checkboxElements[1]; // 第二个
    }
    
    // 策略4: 按深度排序，找较深的元素
    const sortedByDepth = [...elements].sort((a, b) => b.depth - a.depth);
    if (sortedByDepth.length >= 2) {
        console.log('🎯 按深度找到第二个元素');
        return sortedByDepth[1]; // 深度第二深的
    }
    
    return null;
}

function deleteSecondToggle(toggleInfo) {
    console.log('🗑️ 删除第二个开关...');
    
    const element = toggleInfo.element;
    console.log('📍 要删除的元素:', {
        text: toggleInfo.text.substring(0, 30),
        className: toggleInfo.className,
        hasCheckbox: toggleInfo.hasCheckbox
    });
    
    try {
        // 检查是否是容器元素，可能包含其他重要内容
        const childElements = element.querySelectorAll('*');
        const hasImportantChildren = Array.from(childElements).some(child => {
            const childText = child.textContent || '';
            return childText.includes('配置') || 
                   childText.includes('价格') || 
                   childText.includes('硬件') ||
                   child.tagName === 'TABLE' ||
                   child.tagName === 'FORM';
        });
        
        if (hasImportantChildren) {
            console.log('⚠️ 元素包含重要子元素，尝试只删除开关部分...');
            
            // 尝试只删除开关相关的部分
            const checkboxes = element.querySelectorAll('input[type="checkbox"]');
            if (checkboxes.length > 1) {
                // 删除第二个checkbox
                const secondCheckbox = checkboxes[1];
                if (secondCheckbox && secondCheckbox.parentNode) {
                    console.log('🗑️ 删除第二个checkbox');
                    secondCheckbox.parentNode.remove();
                }
            }
            
            // 删除"已启用"文本
            const textNodes = findTextNodes(element, '已启用');
            textNodes.forEach(node => {
                node.textContent = node.textContent.replace('已启用', '').trim();
                if (node.textContent === '') {
                    node.remove();
                }
            });
            
            // 删除绿色样式
            element.style.cssText = element.style.cssText.replace(/green|#10b981|#059669/g, '');
            
        } else {
            // 直接删除整个元素
            console.log('🗑️ 删除整个元素');
            element.remove();
        }
        
        console.log('✅ 第二个开关已删除');
        
    } catch (error) {
        console.error('❌ 删除失败:', error);
        
        // 备用方案：隐藏元素
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        console.log('🔄 使用隐藏方案');
    }
}

function findTextNodes(element, searchText) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.includes(searchText)) {
            nodes.push(node);
        }
    }
    
    return nodes;
}

function verifyRemoval() {
    console.log('🔍 验证删除结果...');
    
    setTimeout(() => {
        const configSummary = document.querySelector('.config-summary');
        if (!configSummary) return;
        
        // 重新检查记忆功能元素数量
        const allElements = configSummary.querySelectorAll('*');
        let memoryCount = 0;
        let checkboxCount = 0;
        
        allElements.forEach(element => {
            const text = element.textContent || '';
            if (text.includes('记忆功能')) {
                memoryCount++;
            }
            
            if (element.querySelector('input[type="checkbox"]')) {
                checkboxCount++;
            }
        });
        
        console.log(`📊 验证结果:`);
        console.log(`  - 包含"记忆功能"文本的元素: ${memoryCount}`);
        console.log(`  - 包含checkbox的元素: ${checkboxCount}`);
        
        if (checkboxCount === 1) {
            console.log('✅ 验证成功：只有一个记忆功能开关');
            showSuccessMessage();
        } else if (checkboxCount === 0) {
            console.log('⚠️ 没有找到记忆功能开关');
            showWarningMessage();
        } else {
            console.log('❌ 仍有多个开关');
            showErrorMessage(checkboxCount);
        }
        
        // 检查是否有绿色开关残留
        const greenElements = configSummary.querySelectorAll('[style*="green"], [style*="#10b981"], [style*="#059669"]');
        if (greenElements.length > 0) {
            console.log(`⚠️ 仍有 ${greenElements.length} 个绿色元素`);
            greenElements.forEach(el => {
                el.style.cssText = el.style.cssText.replace(/green|#10b981|#059669/g, '');
            });
        }
        
    }, 500);
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.textContent = '✅ 第二个记忆功能开关已删除';
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
        animation: fadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addAnimationStyle();
}

function showWarningMessage() {
    const message = document.createElement('div');
    message.textContent = '⚠️ 所有记忆功能开关都被删除了';
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
        animation: fadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addAnimationStyle();
}

function showErrorMessage(count) {
    const message = document.createElement('div');
    message.textContent = `❌ 仍有 ${count} 个记忆功能开关`;
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
        animation: fadeInOut 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    addAnimationStyle();
}

function addAnimationStyle() {
    if (!document.querySelector('#toggle-animation')) {
        const style = document.createElement('style');
        style.id = 'toggle-animation';
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

// 立即开始执行
console.log('🚀 开始执行第二个开关删除...');
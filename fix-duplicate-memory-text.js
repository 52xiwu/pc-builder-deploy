/**
 * 修复重复的"记忆功能:"文本
 * 配置摘要区域有两个"记忆功能:"，删除一个
 */

console.log('🔍 修复重复的"记忆功能:"文本...');

// 安全执行
try {
    fixDuplicateMemoryText();
    console.log('✅ 重复文本修复完成');
} catch (error) {
    console.error('❌ 修复失败:', error);
}

function fixDuplicateMemoryText() {
    console.log('🎯 开始查找重复的"记忆功能:"文本...');
    
    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeFix);
    } else {
        setTimeout(executeFix, 100);
    }
    
    function executeFix() {
        console.log('📄 页面加载完成，开始修复...');
        
        // 1. 查找配置摘要区域
        const configSummary = document.querySelector('.config-summary');
        if (!configSummary) {
            console.log('⚠️ 未找到配置摘要区域');
            return;
        }
        
        console.log('✅ 找到配置摘要区域');
        
        // 2. 查找所有包含"记忆功能:"文本的元素
        const memoryTextElements = [];
        const allElements = configSummary.querySelectorAll('*');
        
        allElements.forEach(element => {
            if (element.textContent && element.textContent.includes('记忆功能:')) {
                memoryTextElements.push({
                    element: element,
                    text: element.textContent.trim(),
                    html: element.innerHTML,
                    depth: getElementDepth(element)
                });
            }
        });
        
        console.log(`📊 找到 ${memoryTextElements.length} 个包含"记忆功能:"的元素`);
        
        if (memoryTextElements.length <= 1) {
            console.log('ℹ️ 只有一个"记忆功能:"文本，无需修复');
            return;
        }
        
        // 3. 显示找到的元素信息
        memoryTextElements.forEach((item, index) => {
            console.log(`  元素 ${index + 1}:`, {
                text: item.text.substring(0, 30),
                tag: item.element.tagName,
                className: item.element.className,
                depth: item.depth
            });
        });
        
        // 4. 确定要删除哪个元素
        const elementToDelete = determineElementToDelete(memoryTextElements);
        
        if (!elementToDelete) {
            console.log('⚠️ 无法确定要删除的元素');
            return;
        }
        
        console.log('📍 确定要删除的元素:', {
            text: elementToDelete.text.substring(0, 30),
            tag: elementToDelete.element.tagName
        });
        
        // 5. 删除重复元素
        deleteDuplicateElement(elementToDelete.element);
        
        // 6. 验证修复结果
        verifyFix();
    }
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

function determineElementToDelete(elements) {
    console.log('🤔 确定要删除哪个元素...');
    
    // 策略1: 删除深度较深的元素（通常是嵌套的）
    const sortedByDepth = [...elements].sort((a, b) => b.depth - a.depth);
    if (sortedByDepth.length > 1) {
        console.log('🎯 选择深度最深的元素删除');
        return sortedByDepth[0]; // 深度最深的
    }
    
    // 策略2: 删除没有开关的元素
    const elementsWithoutToggle = elements.filter(item => {
        return !item.element.querySelector('input[type="checkbox"]');
    });
    
    if (elementsWithoutToggle.length > 0) {
        console.log('🎯 选择没有开关的元素删除');
        return elementsWithoutToggle[0];
    }
    
    // 策略3: 删除文本不完整的元素
    const incompleteElements = elements.filter(item => {
        return item.text === '记忆功能:' || item.text.length < 10;
    });
    
    if (incompleteElements.length > 0) {
        console.log('🎯 选择文本不完整的元素删除');
        return incompleteElements[0];
    }
    
    // 策略4: 删除第一个找到的元素（保留最后一个）
    console.log('🎯 选择第一个找到的元素删除');
    return elements[0];
}

function deleteDuplicateElement(element) {
    console.log('🗑️ 删除重复元素...');
    
    try {
        // 检查元素是否包含开关
        const hasToggle = element.querySelector('input[type="checkbox"]');
        
        if (hasToggle) {
            console.log('⚠️ 元素包含开关，尝试只删除文本部分...');
            
            // 尝试只删除文本节点，保留开关
            removeTextNodesOnly(element);
        } else {
            // 直接删除整个元素
            element.remove();
            console.log('✅ 元素已删除');
        }
        
        // 添加删除标记
        element.style.display = 'none';
        
    } catch (error) {
        console.error('❌ 删除元素失败:', error);
        
        // 备用方案：隐藏元素
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = '0';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        console.log('🔄 使用隐藏方案');
    }
}

function removeTextNodesOnly(element) {
    // 查找所有文本节点
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.includes('记忆功能:')) {
            textNodes.push(node);
        }
    }
    
    console.log(`📊 找到 ${textNodes.length} 个包含"记忆功能:"的文本节点`);
    
    // 删除文本节点
    textNodes.forEach((textNode, index) => {
        try {
            textNode.textContent = textNode.textContent.replace('记忆功能:', '').trim();
            console.log(`🗑️ 删除文本节点 ${index + 1} 中的"记忆功能:"`);
        } catch (error) {
            console.log(`⚠️ 无法修改文本节点 ${index + 1}`);
        }
    });
    
    // 如果还有"记忆功能:"文本，尝试其他方法
    if (element.textContent.includes('记忆功能:')) {
        console.log('🔄 文本节点删除不彻底，尝试HTML替换');
        
        try {
            const newHtml = element.innerHTML.replace(/记忆功能:/g, '');
            element.innerHTML = newHtml;
            console.log('✅ 通过HTML替换删除文本');
        } catch (error) {
            console.log('⚠️ HTML替换失败');
        }
    }
}

function verifyFix() {
    console.log('🔍 验证修复结果...');
    
    setTimeout(() => {
        // 重新检查"记忆功能:"文本数量
        const configSummary = document.querySelector('.config-summary');
        if (!configSummary) return;
        
        const allElements = configSummary.querySelectorAll('*');
        let memoryTextCount = 0;
        
        allElements.forEach(element => {
            if (element.textContent && element.textContent.includes('记忆功能:')) {
                memoryTextCount++;
            }
        });
        
        console.log(`📊 修复后"记忆功能:"文本数量: ${memoryTextCount}`);
        
        if (memoryTextCount === 1) {
            console.log('✅ 修复成功：只有一个"记忆功能:"文本');
            showSuccessMessage();
        } else if (memoryTextCount === 0) {
            console.log('⚠️ 没有找到"记忆功能:"文本，可能全部被删除了');
            showWarningMessage();
        } else {
            console.log('❌ 修复失败：仍有多个"记忆功能:"文本');
            showErrorMessage();
        }
    }, 500);
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.textContent = '✅ 重复的"记忆功能:"文本已删除';
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
    message.textContent = '⚠️ 所有"记忆功能:"文本都被删除了';
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

function showErrorMessage() {
    const message = document.createElement('div');
    message.textContent = '❌ 仍有多个"记忆功能:"文本';
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
    if (!document.querySelector('#fix-animation')) {
        const style = document.createElement('style');
        style.id = 'fix-animation';
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

// 立即开始修复
console.log('🚀 开始执行重复文本修复...');
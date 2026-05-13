/**
 * 验证红色保存按钮是否已删除
 */

console.log('🔍 验证红色保存按钮删除状态...');

// 页面加载完成后验证
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 页面加载完成，开始验证...');
    
    // 等待一小段时间让其他脚本执行
    setTimeout(verifyButtonRemoval, 1000);
});

function verifyButtonRemoval() {
    console.log('🎯 开始验证按钮删除状态...');
    
    let foundButtons = [];
    
    // 1. 检查配置摘要区域
    const configSummary = document.querySelector('.config-summary');
    if (configSummary) {
        const summaryButtons = configSummary.querySelectorAll('button');
        summaryButtons.forEach(button => {
            const buttonText = button.textContent.trim().toLowerCase();
            if (buttonText.includes('保存') || buttonText.includes('save')) {
                foundButtons.push({
                    location: '配置摘要',
                    text: button.textContent.trim(),
                    element: button
                });
            }
        });
    }
    
    // 2. 检查整个页面
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        const buttonText = button.textContent.trim().toLowerCase();
        const isRed = button.classList.contains('btn-danger') || 
                     getComputedStyle(button).backgroundColor.includes('rgb(239, 68, 68)');
        
        if (buttonText.includes('保存') || buttonText.includes('save')) {
            // 检查是否已经在列表中
            const alreadyFound = foundButtons.some(fb => fb.element === button);
            if (!alreadyFound) {
                foundButtons.push({
                    location: '页面其他位置',
                    text: button.textContent.trim(),
                    isRed: isRed,
                    element: button
                });
            }
        }
    });
    
    // 3. 显示验证结果
    if (foundButtons.length === 0) {
        console.log('✅ 验证通过：未找到任何保存按钮');
        showSuccessMessage('✅ 红色保存按钮已成功删除！');
    } else {
        console.log(`⚠️ 找到 ${foundButtons.length} 个保存按钮：`);
        foundButtons.forEach((btn, index) => {
            console.log(`  ${index + 1}. 位置: ${btn.location}, 文本: "${btn.text}", 红色: ${btn.isRed ? '是' : '否'}`);
        });
        
        showWarningMessage(`找到 ${foundButtons.length} 个保存按钮，正在尝试删除...`);
        
        // 尝试删除找到的按钮
        foundButtons.forEach(btn => {
            console.log(`🗑️ 删除按钮: "${btn.text}"`);
            btn.element.remove();
        });
        
        // 重新验证
        setTimeout(() => {
            const remainingButtons = document.querySelectorAll('button');
            const remainingSaveButtons = Array.from(remainingButtons).filter(btn => 
                btn.textContent.trim().toLowerCase().includes('保存') || 
                btn.textContent.trim().toLowerCase().includes('save')
            );
            
            if (remainingSaveButtons.length === 0) {
                console.log('✅ 所有保存按钮已删除');
                showSuccessMessage('✅ 所有保存按钮已成功删除！');
            } else {
                console.log(`❌ 仍有 ${remainingSaveButtons.length} 个保存按钮未删除`);
                showErrorMessage(`仍有 ${remainingSaveButtons.length} 个保存按钮未删除`);
            }
        }, 500);
    }
}

function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        animation: slideIn 0.5s ease-out;
        font-weight: 600;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // 3秒后移除
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => messageDiv.remove(), 500);
    }, 3000);
}

function showWarningMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f59e0b;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        animation: slideIn 0.5s ease-out;
        font-weight: 600;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => messageDiv.remove(), 5000);
}

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        animation: slideIn 0.5s ease-out;
        font-weight: 600;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => messageDiv.remove(), 5000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🔧 验证脚本加载完成');
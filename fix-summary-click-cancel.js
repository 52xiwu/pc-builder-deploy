/**
 * 修复配置摘要点击取消功能
 * 1. 移除"清除所有选择"按钮（影响美观）
 * 2. 让配置摘要里的硬件名称可点击取消
 * 3. 点击硬件名称直接取消选择
 */

console.log('🎯 修复配置摘要点击取消功能...');

// 立即执行
(function() {
    console.log('✨ 初始化配置摘要点击取消...');
    
    // 1. 首先移除"清除所有选择"按钮
    removeClearAllButton();
    
    // 2. 让配置摘要里的硬件名称可点击
    makeSummaryItemsClickable();
    
    // 3. 添加点击取消功能
    addClickToCancelFunctionality();
    
    console.log('🎉 配置摘要点击取消初始化完成');
})();

function removeClearAllButton() {
    console.log('🧹 移除"清除所有选择"按钮...');
    
    // 查找并移除所有清除按钮
    const clearButtons = document.querySelectorAll('.btn-outline, [class*="clear"], [class*="delete"]');
    let removedCount = 0;
    
    clearButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('清除') || buttonText.includes('删除') || buttonText.includes('clear')) {
            button.remove();
            removedCount++;
            console.log(`➖ 移除按钮: ${button.textContent}`);
        }
    });
    
    // 也移除可能通过脚本添加的清除按钮
    const configActions = document.querySelector('.config-actions');
    if (configActions) {
        const actionButtons = configActions.querySelectorAll('button');
        actionButtons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            if (buttonText.includes('清除') || buttonText.includes('删除')) {
                button.remove();
                removedCount++;
            }
        });
    }
    
    console.log(`✅ 移除了 ${removedCount} 个清除按钮`);
}

function makeSummaryItemsClickable() {
    console.log('🖱️ 让配置摘要硬件名称可点击...');
    
    // 所有硬件类别
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const elementId = `selected${capitalize(category)}`;
        const element = document.getElementById(elementId);
        
        if (element) {
            // 1. 添加可点击样式
            element.style.cursor = 'pointer';
            element.style.transition = 'all 0.2s ease';
            
            // 2. 添加悬停效果
            element.addEventListener('mouseenter', function() {
                if (this.textContent !== '未选择') {
                    this.style.color = '#ef4444';
                    this.style.textDecoration = 'underline';
                    this.style.transform = 'translateX(2px)';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                if (this.textContent !== '未选择') {
                    this.style.color = '';
                    this.style.textDecoration = '';
                    this.style.transform = '';
                }
            });
            
            // 3. 添加点击提示（工具提示）
            if (element.textContent !== '未选择') {
                element.title = '点击取消选择此硬件';
            }
            
            console.log(`✅ 使 ${category} 可点击`);
        }
    });
}

function addClickToCancelFunctionality() {
    console.log('🎯 添加点击取消功能...');
    
    // 所有硬件类别
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const elementId = `selected${capitalize(category)}`;
        const element = document.getElementById(elementId);
        
        if (element) {
            // 移除旧的事件监听器
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // 添加点击事件
            newElement.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const hardwareName = this.textContent;
                const priceElement = this.parentElement.querySelector('.component-price');
                const hardwarePrice = priceElement ? parseFloat(priceElement.textContent.replace('¥', '')) || 0 : 0;
                
                // 只有已选择的硬件才能取消
                if (hardwareName && hardwareName !== '未选择' && hardwarePrice > 0) {
                    console.log(`🖱️ 点击配置摘要取消: ${category} - ${hardwareName}`);
                    
                    // 执行取消选择
                    cancelFromSummaryClick(category, hardwareName, hardwarePrice, this);
                } else {
                    console.log(`ℹ️ ${category} 未选择，无需取消`);
                }
            });
            
            console.log(`✅ 为 ${category} 添加点击取消功能`);
        }
    });
}

function cancelFromSummaryClick(category, name, price, clickedElement) {
    console.log(`❌ 点击配置摘要取消: ${category} - ${name} (¥${price})`);
    
    // 1. 添加点击反馈动画
    addClickFeedback(clickedElement);
    
    // 2. 更新配置摘要显示
    updateSummaryDisplay(category, '未选择', 0);
    
    // 3. 移除配置摘要中的取消按钮（如果存在）
    if (window.summaryCancelButtons) {
        window.summaryCancelButtons.removeFromSummary(category);
    }
    
    // 4. 更新硬件列表中的选择状态
    updateHardwareListSelection(category, null);
    
    // 5. 更新选择状态数据
    updateSelectionData(category, null, 0);
    
    // 6. 更新总价
    updateTotalPriceAfterClickCancel(price);
    
    // 7. 显示取消反馈
    showClickCancelFeedback(name, price, clickedElement);
    
    console.log(`✅ 点击取消完成: ${name}`);
}

function addClickFeedback(element) {
    // 添加点击动画
    element.style.animation = 'none';
    
    setTimeout(() => {
        element.style.animation = 'click-cancel 0.5s ease';
    }, 10);
    
    // 0.5秒后移除动画
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function updateSummaryDisplay(category, name, price) {
    const elementId = `selected${capitalize(category)}`;
    const element = document.getElementById(elementId);
    
    if (element) {
        // 保存原始文本用于动画
        const originalText = element.textContent;
        
        // 添加取消动画
        element.classList.add('click-canceling');
        
        setTimeout(() => {
            element.textContent = name;
            element.title = ''; // 移除工具提示
            
            // 更新价格显示
            const priceElement = element.parentElement.querySelector('.component-price');
            if (priceElement) {
                priceElement.textContent = price > 0 ? `¥${price}` : '¥0';
                priceElement.classList.add('click-price-canceled');
                
                setTimeout(() => {
                    priceElement.classList.remove('click-price-canceled');
                }, 1000);
            }
            
            element.classList.remove('click-canceling');
            
            // 如果是"未选择"，移除可点击样式
            if (name === '未选择') {
                element.style.cursor = 'default';
                element.style.color = '#9ca3af';
                element.removeAttribute('title');
            }
        }, 300);
        
        console.log(`📝 更新配置摘要显示: ${category} = ${name}`);
    }
}

function updateHardwareListSelection(category, selectedId) {
    console.log(`🔄 更新硬件列表选择状态: ${category}`);
    
    // 找到对应类别的所有硬件项目
    const hardwareItems = document.querySelectorAll(`.hardware-item[data-category="${category}"]`);
    
    hardwareItems.forEach(item => {
        if (selectedId === null) {
            // 取消所有选择
            item.classList.remove('selected');
            item.classList.add('deselected');
            
            // 移除硬件卡片上的取消按钮（如果存在）
            const cardCancelBtn = item.querySelector('.cancel-selection-btn');
            if (cardCancelBtn) {
                cardCancelBtn.remove();
            }
        }
    });
    
    console.log(`✅ 更新了 ${hardwareItems.length} 个硬件项目的选择状态`);
}

function updateSelectionData(category, name, price) {
    // 更新各种选择状态数据
    if (window.toggleSelection && window.toggleSelection.selectedItems) {
        window.toggleSelection.selectedItems[category] = null;
    }
    
    if (window.forceSelectedHardware) {
        window.forceSelectedHardware[category] = { 
            name: '未选择', 
            price: 0 
        };
    }
    
    if (window.selectedHardware) {
        window.selectedHardware[category] = { name: '未选择', price: 0 };
    }
    
    console.log(`💾 更新选择数据: ${category} = 未选择`);
}

function updateTotalPriceAfterClickCancel(canceledPrice) {
    console.log(`💰 点击取消后更新总价: 减少 ¥${canceledPrice}`);
    
    // 使用现有的价格计算逻辑
    if (typeof updateAllPriceDisplays === 'function') {
        updateAllPriceDisplays();
    } else if (typeof updateHardwareTotal === 'function') {
        updateHardwareTotal();
        updateGrandTotal();
    } else if (typeof updateTotalPrice === 'function') {
        updateTotalPrice();
    } else {
        // 简单的价格更新
        const hardwareTotalElement = document.getElementById('hardwareTotal');
        const grandTotalElement = document.getElementById('grandTotal');
        
        if (hardwareTotalElement && grandTotalElement) {
            // 解析当前价格
            const currentHardware = parseInt(hardwareTotalElement.textContent.replace('¥', '')) || 0;
            const currentGrand = parseInt(grandTotalElement.textContent.replace('¥', '')) || 299;
            
            // 计算新价格
            const newHardware = Math.max(0, currentHardware - canceledPrice);
            const newGrand = newHardware + 299;
            
            // 更新显示
            hardwareTotalElement.textContent = `¥${newHardware}`;
            grandTotalElement.textContent = `¥${newGrand}`;
            
            // 添加价格减少动画
            hardwareTotalElement.classList.add('click-price-decreased');
            setTimeout(() => {
                hardwareTotalElement.classList.remove('click-price-decreased');
            }, 1000);
        }
    }
}

function showClickCancelFeedback(name, price, clickedElement) {
    // 在点击位置显示反馈
    const feedback = document.createElement('div');
    feedback.className = 'click-cancel-feedback';
    
    // 获取点击位置
    const rect = clickedElement.getBoundingClientRect();
    
    feedback.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 10014;
        animation: click-feedback 1.5s ease-out forwards;
        white-space: nowrap;
        pointer-events: none;
    `;
    
    feedback.textContent = `已取消: ${name}`;
    
    document.body.appendChild(feedback);
    
    // 1.5秒后移除
    setTimeout(() => {
        feedback.remove();
    }, 1500);
    
    console.log(`💬 显示点击取消反馈: ${name}`);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 添加点击取消样式
const clickCancelStyle = document.createElement('style');
clickCancelStyle.textContent = `
    /* 点击取消动画 */
    @keyframes click-cancel {
        0% { 
            transform: scale(1);
            color: #1f2937;
        }
        50% { 
            transform: scale(0.95);
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
            border-radius: 4px;
            padding: 0 4px;
            margin: 0 -4px;
        }
        100% { 
            transform: scale(1);
            color: #6b7280;
        }
    }
    
    /* 配置摘要点击取消动画 */
    .component-selected.click-canceling {
        animation: click-text-cancel 0.5s ease;
    }
    
    @keyframes click-text-cancel {
        0% { 
            opacity: 1;
            transform: translateX(0);
        }
        50% { 
            opacity: 0.5;
            transform: translateX(5px);
            color: #ef4444;
        }
        100% { 
            opacity: 1;
            transform: translateX(0);
            color: #6b7280;
        }
    }
    
    /* 价格取消动画 */
    .click-price-canceled {
        animation: click-price-cancel 1s ease;
    }
    
    @keyframes click-price-cancel {
        0%, 100% { color: #10b981; }
        50% { color: #ef4444; transform: scale(0.9); }
    }
    
    /* 价格减少动画 */
    .click-price-decreased {
        animation: click-price-decrease 1s ease;
    }
    
    @keyframes click-price-decrease {
        0%, 100% { color: #10b981; }
        50% { color: #ef4444; transform: scale(1.1); }
    }
    
    /* 点击反馈动画 */
    @keyframes click-feedback {
        0% { 
            opacity: 0;
            transform: translateY(0) scale(0.8);
        }
        20% { 
            opacity: 1;
            transform: translateY(-20px) scale(1);
        }
        80% { 
            opacity: 1;
            transform: translateY(-20px) scale(1);
        }
        100% { 
            opacity: 0;
            transform: translateY(-40px) scale(0.8);
        }
    }
    
    /* 配置摘要硬件名称样式 */
    .component-selected {
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-block;
        padding: 2px 4px;
        border-radius: 4px;
    }
    
    .component-selected:hover:not([data-unselected]) {
        color: #ef4444;
        text-decoration: underline;
        transform: translateX(2px);
        background: rgba(239, 68, 68, 0.05);
    }
    
    /* 未选择状态 */
    .component-selected[data-unselected] {
        cursor: default;
        color: #9ca3af;
    }
    
    .component-selected[data-unselected]:hover {
        color: #9ca3af;
        text-decoration: none;
        transform: none;
        background: none;
    }
    
    /* 响应式调整 */
    @media (max-width: 768px) {
        .component-selected {
            padding: 1px 2px;
        }
    }
`;
document.head.appendChild(clickCancelStyle);

// 定期检查并更新配置摘要状态
setInterval(() => {
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const elementId = `selected${capitalize(category)}`;
        const element = document.getElementById(elementId);
        
        if (element) {
            const currentName = element.textContent.trim();
            const isUnselected = currentName === '未选择';
            
            // 更新data属性
            if (isUnselected) {
                element.setAttribute('data-unselected', 'true');
                element.style.cursor = 'default';
                element.style.color = '#9ca3af';
                element.removeAttribute('title');
            } else {
                element.removeAttribute('data-unselected');
                element.style.cursor = 'pointer';
                element.style.color = '';
                element.title = '点击取消选择此硬件';
            }
        }
    });
}, 1000);

// 初始化完成后的操作
setTimeout(() => {
    console.log('🔧 配置摘要点击取消完成状态检查...');
    
    // 检查配置摘要元素
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    let clickableCount = 0;
    
    categories.forEach(category => {
        const elementId = `selected${capitalize(category)}`;
        const element = document.getElementById(elementId);
        
        if (element && element.textContent !== '未选择') {
            clickableCount++;
        }
    });
    
    console.log(`📊 ${clickableCount}/${categories.length} 个配置摘要项目可点击取消`);
    console.log('🎊 配置摘要点击取消功能完全部署完成');
}, 2000);

console.log('🚀 配置摘要点击取消脚本加载完成');
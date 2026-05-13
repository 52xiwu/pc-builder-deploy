/**
 * 改进取消按钮位置 - 放在右边配置摘要的已选取硬件旁边
 */

console.log('🎯 改进取消按钮位置到配置摘要...');

// 立即执行
(function() {
    console.log('🔄 初始化配置摘要取消按钮...');
    
    // 存储配置摘要取消按钮
    window.summaryCancelButtons = {
        buttons: new Map(), // 存储硬件类别对应的取消按钮
        
        // 为配置摘要中的硬件添加取消按钮
        addToSummary: function(category, hardwareName, hardwarePrice) {
            console.log(`📝 为配置摘要添加取消按钮: ${category} - ${hardwareName}`);
            
            const elementId = `selected${capitalize(category)}`;
            const element = document.getElementById(elementId);
            
            if (!element) {
                console.warn(`⚠️ 未找到配置摘要元素: ${elementId}`);
                return;
            }
            
            // 移除旧的取消按钮（如果存在）
            this.removeFromSummary(category);
            
            // 创建取消按钮
            const cancelButton = this.createCancelButton(category, hardwareName, hardwarePrice);
            
            // 将按钮插入到硬件名称后面
            this.insertAfter(element, cancelButton);
            
            // 存储引用
            this.buttons.set(category, { button: cancelButton, element: element });
            
            console.log(`✅ 在配置摘要中添加取消按钮: ${category}`);
        },
        
        // 创建取消按钮
        createCancelButton: function(category, name, price) {
            const button = document.createElement('button');
            button.className = 'summary-cancel-btn';
            button.dataset.category = category;
            button.dataset.name = name;
            button.dataset.price = price;
            button.title = `取消选择 ${name}`;
            button.innerHTML = '<i class="fas fa-times"></i>';
            
            // 按钮样式
            button.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                background: #f87171;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                margin-left: 8px;
                font-size: 0.75rem;
                opacity: 0.7;
                transition: all 0.2s ease;
                vertical-align: middle;
            `;
            
            // 按钮事件
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const category = this.dataset.category;
                const name = this.dataset.name;
                const price = parseFloat(this.dataset.price) || 0;
                
                console.log(`❌ 配置摘要取消按钮点击: ${category} - ${name}`);
                
                // 执行取消选择
                cancelFromSummary(category, name, price, this);
            });
            
            // 悬停效果
            button.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1.1)';
                this.style.background = '#ef4444';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.opacity = '0.7';
                this.style.transform = 'scale(1)';
                this.style.background = '#f87171';
            });
            
            return button;
        },
        
        // 从配置摘要移除取消按钮
        removeFromSummary: function(category) {
            const buttonInfo = this.buttons.get(category);
            if (buttonInfo && buttonInfo.button) {
                buttonInfo.button.remove();
                this.buttons.delete(category);
                console.log(`➖ 从配置摘要移除取消按钮: ${category}`);
            }
        },
        
        // 移除所有取消按钮
        removeAll: function() {
            this.buttons.forEach((buttonInfo, category) => {
                if (buttonInfo.button) {
                    buttonInfo.button.remove();
                }
            });
            this.buttons.clear();
            console.log('🧹 移除所有配置摘要取消按钮');
        },
        
        // 更新取消按钮
        update: function(category, name, price) {
            this.removeFromSummary(category);
            
            if (name && name !== '未选择' && price > 0) {
                this.addToSummary(category, name, price);
            }
        },
        
        // 辅助函数：在元素后插入
        insertAfter: function(referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    };
    
    // 初始化：为已选择的硬件添加取消按钮
    setTimeout(() => {
        initializeSummaryCancelButtons();
        console.log('✅ 配置摘要取消按钮初始化完成');
    }, 1000);
    
    // 监听硬件选择变化
    setupSummarySelectionObserver();
    
    // 添加样式
    addSummaryCancelButtonStyles();
    
    console.log('🎉 配置摘要取消按钮改进初始化完成');
})();

function initializeSummaryCancelButtons() {
    console.log('🔍 初始化配置摘要取消按钮...');
    
    // 检查所有硬件类别
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    
    categories.forEach(category => {
        const elementId = `selected${capitalize(category)}`;
        const element = document.getElementById(elementId);
        
        if (element) {
            const hardwareName = element.textContent.trim();
            const priceElement = element.parentElement.querySelector('.component-price');
            const hardwarePrice = priceElement ? parseFloat(priceElement.textContent.replace('¥', '')) || 0 : 0;
            
            // 如果已选择硬件（不是"未选择"），添加取消按钮
            if (hardwareName && hardwareName !== '未选择' && hardwarePrice > 0) {
                window.summaryCancelButtons.addToSummary(category, hardwareName, hardwarePrice);
            }
        }
    });
    
    console.log(`📊 检查了 ${categories.length} 个硬件类别`);
}

function cancelFromSummary(category, name, price, cancelButton) {
    console.log(`🔄 从配置摘要取消: ${category} - ${name} (¥${price})`);
    
    // 1. 更新配置摘要显示
    updateSummaryDisplay(category, '未选择', 0);
    
    // 2. 移除配置摘要中的取消按钮
    window.summaryCancelButtons.removeFromSummary(category);
    
    // 3. 更新硬件列表中的选择状态
    updateHardwareListSelection(category, null);
    
    // 4. 更新选择状态数据
    updateSelectionData(category, null, 0);
    
    // 5. 更新总价
    updateTotalPriceAfterCancel(price);
    
    // 6. 显示取消反馈
    showSummaryCancelFeedback(name, price, cancelButton);
    
    console.log(`✅ 从配置摘要取消完成: ${name}`);
}

function updateSummaryDisplay(category, name, price) {
    const elementId = `selected${capitalize(category)}`;
    const element = document.getElementById(elementId);
    
    if (element) {
        // 添加取消动画
        element.classList.add('summary-canceling');
        
        setTimeout(() => {
            element.textContent = name;
            
            // 更新价格显示
            const priceElement = element.parentElement.querySelector('.component-price');
            if (priceElement) {
                priceElement.textContent = price > 0 ? `¥${price}` : '¥0';
                priceElement.classList.add('summary-price-canceled');
                
                setTimeout(() => {
                    priceElement.classList.remove('summary-price-canceled');
                }, 1000);
            }
            
            element.classList.remove('summary-canceling');
        }, 300);
        
        console.log(`📝 更新配置摘要显示: ${category} = ${name}`);
    }
}

function updateHardwareListSelection(category, selectedId) {
    console.log(`🔄 更新硬件列表选择状态: ${category}`);
    
    // 找到对应类别的所有硬件项目
    const hardwareItems = document.querySelectorAll(`.hardware-item[data-category="${category}"]`);
    
    hardwareItems.forEach(item => {
        const itemId = item.dataset.id || item.dataset.name;
        
        if (selectedId === null) {
            // 取消所有选择
            item.classList.remove('selected');
            item.classList.add('deselected');
            
            // 移除硬件卡片上的取消按钮（如果存在）
            const cardCancelBtn = item.querySelector('.cancel-selection-btn');
            if (cardCancelBtn) {
                cardCancelBtn.remove();
            }
        } else if (itemId === selectedId) {
            // 选择特定项目
            item.classList.add('selected');
            item.classList.remove('deselected');
        } else {
            // 取消其他项目
            item.classList.remove('selected');
            item.classList.add('deselected');
        }
    });
    
    console.log(`✅ 更新了 ${hardwareItems.length} 个硬件项目的选择状态`);
}

function updateSelectionData(category, name, price) {
    // 更新各种选择状态数据
    if (window.toggleSelection && window.toggleSelection.selectedItems) {
        window.toggleSelection.selectedItems[category] = name ? (name + '_' + price) : null;
    }
    
    if (window.forceSelectedHardware) {
        window.forceSelectedHardware[category] = { 
            name: name || '未选择', 
            price: price || 0 
        };
    }
    
    if (window.selectedHardware) {
        window.selectedHardware[category] = { name: name || '未选择', price: price || 0 };
    }
    
    console.log(`💾 更新选择数据: ${category} = ${name || '未选择'}`);
}

function updateTotalPriceAfterCancel(canceledPrice) {
    console.log(`💰 取消后更新总价: 减少 ¥${canceledPrice}`);
    
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
            hardwareTotalElement.classList.add('summary-price-decreased');
            setTimeout(() => {
                hardwareTotalElement.classList.remove('summary-price-decreased');
            }, 1000);
        }
    }
}

function showSummaryCancelFeedback(name, price, cancelButton) {
    // 在取消按钮位置显示反馈
    const feedback = document.createElement('div');
    feedback.className = 'summary-cancel-feedback';
    
    // 获取按钮位置
    const rect = cancelButton.getBoundingClientRect();
    
    feedback.style.cssText = `
        position: fixed;
        top: ${rect.top - 40}px;
        left: ${rect.left}px;
        background: #ef4444;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        z-index: 10010;
        animation: summary-feedback 1.5s ease-out forwards;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    `;
    
    feedback.textContent = `已取消: ${name}`;
    
    document.body.appendChild(feedback);
    
    // 1.5秒后移除
    setTimeout(() => {
        feedback.remove();
    }, 1500);
    
    console.log(`💬 显示配置摘要取消反馈: ${name}`);
}

function setupSummarySelectionObserver() {
    console.log('👀 设置配置摘要选择观察器...');
    
    // 定期检查配置摘要状态
    setInterval(() => {
        const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
        
        categories.forEach(category => {
            const elementId = `selected${capitalize(category)}`;
            const element = document.getElementById(elementId);
            
            if (element) {
                const currentName = element.textContent.trim();
                const priceElement = element.parentElement.querySelector('.component-price');
                const currentPrice = priceElement ? parseFloat(priceElement.textContent.replace('¥', '')) || 0 : 0;
                
                // 检查是否需要更新取消按钮
                const hasCancelButton = window.summaryCancelButtons.buttons.has(category);
                const shouldHaveButton = currentName && currentName !== '未选择' && currentPrice > 0;
                
                if (shouldHaveButton && !hasCancelButton) {
                    // 需要添加取消按钮
                    window.summaryCancelButtons.addToSummary(category, currentName, currentPrice);
                } else if (!shouldHaveButton && hasCancelButton) {
                    // 需要移除取消按钮
                    window.summaryCancelButtons.removeFromSummary(category);
                }
            }
        });
    }, 2000);
    
    console.log('✅ 配置摘要选择观察器设置完成');
}

function addSummaryCancelButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 配置摘要取消按钮样式 */
        .summary-cancel-btn {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 24px !important;
            height: 24px !important;
            background: #f87171 !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            margin-left: 8px !important;
            font-size: 0.75rem !important;
            opacity: 0.7 !important;
            transition: all 0.2s ease !important;
            vertical-align: middle !important;
        }
        
        .summary-cancel-btn:hover {
            opacity: 1 !important;
            transform: scale(1.1) !important;
            background: #ef4444 !important;
        }
        
        /* 配置摘要取消动画 */
        .component-selected.summary-canceling {
            animation: summary-text-cancel 0.5s ease;
        }
        
        @keyframes summary-text-cancel {
            0% { color: #1f2937; transform: translateX(0); }
            50% { color: #ef4444; transform: translateX(-5px); }
            100% { color: #6b7280; transform: translateX(0); }
        }
        
        .summary-price-canceled {
            animation: summary-price-cancel 1s ease;
        }
        
        @keyframes summary-price-cancel {
            0%, 100% { color: #10b981; }
            50% { color: #ef4444; }
        }
        
        /* 价格减少动画 */
        .summary-price-decreased {
            animation: summary-price-decrease 1s ease;
        }
        
        @keyframes summary-price-decrease {
            0%, 100% { color: #10b981; }
            50% { color: #ef4444; transform: scale(1.1); }
        }
        
        /* 取消反馈动画 */
        @keyframes summary-feedback {
            0% { 
                opacity: 0; 
                transform: translateY(10px); 
            }
            20% { 
                opacity: 1; 
                transform: translateY(0); 
            }
            80% { 
                opacity: 1; 
                transform: translateY(0); 
            }
            100% { 
                opacity: 0; 
                transform: translateY(-10px); 
            }
        }
        
        /* 配置摘要项目布局调整 */
        .config-item, .summary-item, .component-header {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .component-selected {
            margin-right: 4px;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .summary-cancel-btn {
                width: 20px !important;
                height: 20px !important;
                font-size: 0.65rem !important;
                margin-left: 6px !important;
            }
        }
        
        /* 配置摘要取消按钮常显模式 */
        .summary-cancel-btn.always-visible {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 配置摘要取消按钮样式已添加');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 添加与硬件卡片取消按钮的同步
function syncWithCardCancelButtons() {
    console.log('🔄 同步配置摘要和硬件卡片取消按钮...');
    
    // 当硬件卡片上的取消按钮被点击时，也更新配置摘要
    document.addEventListener('click', function(e) {
        const cardCancelBtn = e.target.closest('.cancel-selection-btn');
        if (cardCancelBtn && cardCancelBtn.closest('.hardware-item')) {
            const hardwareItem = cardCancelBtn.closest('.hardware-item');
            const category = hardwareItem.dataset.category;
            const name = hardwareItem.dataset.name;
            const price = parseFloat(hardwareItem.dataset
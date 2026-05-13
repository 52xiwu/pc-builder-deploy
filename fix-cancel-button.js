/**
 * 改进取消选择功能 - 在已选取的硬件上显示取消按钮
 */

console.log('🎯 改进取消选择功能...');

// 立即执行
(function() {
    console.log('✨ 初始化取消按钮改进...');
    
    // 存储取消按钮状态
    window.cancelButtons = {
        enabled: true,
        buttons: new Map(), // 存储硬件ID对应的取消按钮
        
        // 创建取消按钮
        createButton: function(item) {
            const button = document.createElement('button');
            button.className = 'cancel-selection-btn';
            button.innerHTML = '<i class="fas fa-times"></i> 取消选择';
            button.title = '点击取消选择此硬件';
            
            // 存储引用
            const itemId = item.dataset.id || item.dataset.name;
            this.buttons.set(itemId, button);
            
            return button;
        },
        
        // 显示取消按钮
        showOnItem: function(item) {
            if (!this.enabled) return;
            
            const button = this.createButton(item);
            item.appendChild(button);
            
            // 添加按钮事件
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const category = item.dataset.category;
                const name = item.dataset.name;
                const price = parseFloat(item.dataset.price) || 0;
                
                console.log(`❌ 取消按钮点击: ${category} - ${name}`);
                
                // 取消选择
                cancelHardwareSelection(item, category, name, price);
            });
            
            console.log(`✅ 在 ${item.dataset.name} 上显示取消按钮`);
        },
        
        // 隐藏取消按钮
        hideFromItem: function(item) {
            const itemId = item.dataset.id || item.dataset.name;
            const button = this.buttons.get(itemId);
            
            if (button && button.parentNode === item) {
                button.remove();
                console.log(`➖ 从 ${item.dataset.name} 移除取消按钮`);
            }
        },
        
        // 更新所有取消按钮
        updateAll: function() {
            document.querySelectorAll('.hardware-item.selected').forEach(item => {
                this.showOnItem(item);
            });
            
            document.querySelectorAll('.hardware-item:not(.selected)').forEach(item => {
                this.hideFromItem(item);
            });
        }
    };
    
    // 初始化取消按钮
    setTimeout(() => {
        window.cancelButtons.updateAll();
        console.log('✅ 初始取消按钮设置完成');
    }, 800);
    
    // 监听选择变化，更新取消按钮
    setupSelectionObserver();
    
    // 添加样式
    addCancelButtonStyles();
    
    console.log('🎉 取消按钮改进初始化完成');
})();

function cancelHardwareSelection(item, category, name, price) {
    console.log(`🔄 执行取消选择: ${category} - ${name}`);
    
    // 1. 移除选中状态
    item.classList.remove('selected');
    item.classList.add('deselected');
    
    // 2. 隐藏取消按钮
    window.cancelButtons.hideFromItem(item);
    
    // 3. 更新配置摘要
    updateConfigSummary(category, '未选择', 0);
    
    // 4. 更新选择状态数据
    if (window.toggleSelection) {
        window.toggleSelection.selectedItems[category] = null;
    }
    
    if (window.forceSelectedHardware) {
        window.forceSelectedHardware[category] = { name: '未选择', price: 0 };
    }
    
    // 5. 更新总价
    updateTotalPriceAfterCancel(price);
    
    // 6. 显示取消反馈
    showCancelFeedback(name, price);
    
    // 7. 添加取消后的特殊效果
    addCancelEffect(item);
    
    console.log(`✅ 已取消选择: ${name}`);
}

function updateConfigSummary(category, name, price) {
    const elementId = `selected${capitalize(category)}`;
    const element = document.getElementById(elementId);
    
    if (element) {
        // 添加取消动画
        element.classList.add('canceling');
        
        setTimeout(() => {
            element.textContent = name;
            
            // 更新价格显示
            const priceElement = element.parentElement.querySelector('.component-price');
            if (priceElement) {
                priceElement.textContent = price > 0 ? `¥${price}` : '¥0';
                priceElement.classList.add('price-canceled');
                
                setTimeout(() => {
                    priceElement.classList.remove('price-canceled');
                }, 1000);
            }
            
            element.classList.remove('canceling');
        }, 300);
        
        console.log(`📝 更新配置摘要: ${category} = ${name}`);
    }
}

function updateTotalPriceAfterCancel(canceledPrice) {
    // 使用现有的价格计算逻辑
    if (typeof updateAllPriceDisplays === 'function') {
        updateAllPriceDisplays();
    } else if (typeof updateHardwareTotal === 'function') {
        updateHardwareTotal();
        updateGrandTotal();
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
            hardwareTotalElement.classList.add('price-decreased');
            setTimeout(() => {
                hardwareTotalElement.classList.remove('price-decreased');
            }, 1000);
            
            console.log(`💰 价格更新: 减少 ¥${canceledPrice}, 新总价: ¥${newHardware}`);
        }
    }
}

function showCancelFeedback(name, price) {
    const feedback = document.createElement('div');
    feedback.className = 'cancel-feedback';
    
    feedback.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 1.5rem;">❌</div>
            <div>
                <div style="font-weight: 600;">已取消选择</div>
                <div style="font-size: 0.875rem; opacity: 0.9;">${name} - ¥${price}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(feedback);
    
    // 3秒后移除
    setTimeout(() => {
        feedback.classList.add('fade-out');
        setTimeout(() => feedback.remove(), 500);
    }, 3000);
    
    console.log(`💬 显示取消反馈: ${name}`);
}

function addCancelEffect(item) {
    // 添加取消动画效果
    item.classList.add('just-canceled');
    
    // 添加取消标记
    const cancelMark = document.createElement('div');
    cancelMark.className = 'cancel-mark';
    cancelMark.innerHTML = '已取消';
    item.appendChild(cancelMark);
    
    // 3秒后移除效果
    setTimeout(() => {
        item.classList.remove('just-canceled');
        cancelMark.remove();
    }, 3000);
    
    console.log(`🎭 添加取消效果到: ${item.dataset.name}`);
}

function setupSelectionObserver() {
    console.log('👀 设置选择状态观察器...');
    
    // 方法1: 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                // class属性变化，检查选择状态
                const item = mutation.target;
                if (item.classList.contains('selected')) {
                    // 新选中的项目，显示取消按钮
                    setTimeout(() => {
                        window.cancelButtons.showOnItem(item);
                    }, 100);
                } else if (item.classList.contains('deselected')) {
                    // 取消选择的项目，隐藏取消按钮
                    setTimeout(() => {
                        window.cancelButtons.hideFromItem(item);
                    }, 100);
                }
            }
        });
    });
    
    // 开始观察所有硬件项目
    document.querySelectorAll('.hardware-item').forEach(item => {
        observer.observe(item, { attributes: true });
    });
    
    // 方法2: 定期检查更新
    setInterval(() => {
        window.cancelButtons.updateAll();
    }, 2000);
    
    console.log('✅ 选择状态观察器设置完成');
}

function addCancelButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 取消按钮样式 */
        .cancel-selection-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(220, 38, 38, 0.9);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            z-index: 10;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .hardware-item.selected:hover .cancel-selection-btn {
            opacity: 1;
            transform: translateY(0);
        }
        
        .cancel-selection-btn:hover {
            background: #dc2626;
            transform: translateY(0) scale(1.05);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
        
        .cancel-selection-btn i {
            font-size: 0.7rem;
        }
        
        /* 取消反馈样式 */
        .cancel-feedback {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #dc2626;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px -5px rgba(220, 38, 38, 0.3);
            z-index: 10007;
            animation: cancel-feedback-in 0.5s ease-out;
        }
        
        @keyframes cancel-feedback-in {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .cancel-feedback.fade-out {
            animation: cancel-feedback-out 0.5s ease-out forwards;
        }
        
        @keyframes cancel-feedback-out {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        /* 取消效果样式 */
        .hardware-item.just-canceled {
            position: relative;
            overflow: hidden;
        }
        
        .hardware-item.just-canceled::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(220, 38, 38, 0.05);
            z-index: 1;
            animation: cancel-highlight 2s ease-out;
        }
        
        @keyframes cancel-highlight {
            0% { background: rgba(220, 38, 38, 0.2); }
            100% { background: rgba(220, 38, 38, 0.05); }
        }
        
        .cancel-mark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(220, 38, 38, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 2;
            animation: cancel-mark-fade 3s ease-out forwards;
        }
        
        @keyframes cancel-mark-fade {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            70% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        
        /* 价格减少动画 */
        .price-decreased {
            animation: price-decrease 1s ease;
        }
        
        @keyframes price-decrease {
            0%, 100% { color: #10b981; }
            50% { color: #dc2626; transform: scale(1.1); }
        }
        
        /* 配置摘要取消动画 */
        .component-selected.canceling {
            animation: text-cancel 0.5s ease;
        }
        
        @keyframes text-cancel {
            0% { color: #1f2937; }
            50% { color: #dc2626; transform: scale(0.95); }
            100% { color: #6b7280; }
        }
        
        .price-canceled {
            animation: price-cancel 1s ease;
        }
        
        @keyframes price-cancel {
            0%, 100% { color: #10b981; }
            50% { color: #dc2626; }
        }
        
        /* 硬件项目布局调整 */
        .hardware-item {
            position: relative;
            padding-right: 100px !important; /* 为取消按钮留出空间 */
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .cancel-selection-btn {
                padding: 4px 8px;
                font-size: 0.7rem;
                top: 5px;
                right: 5px;
            }
            
            .hardware-item {
                padding-right: 80px !important;
            }
        }
        
        /* 取消按钮常显模式（可选） */
        .hardware-item.selected .cancel-selection-btn.always-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 取消按钮样式已添加');
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 添加设置选项
function addCancelButtonSettings() {
    // 创建设置面板
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'cancel-settings';
    settingsPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10008;
        display: none;
    `;
    
    settingsPanel.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 10px;">取消按钮设置</div>
        <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <input type="checkbox" id="cancelBtnEnabled" checked>
            <span>启用取消按钮</span>
        </label>
        <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <input type="checkbox" id="cancelBtnAlwaysVisible">
            <span>取消按钮常显</span>
        </label>
        <button id="closeSettings" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8rem;">关闭</button>
    `;
    
    document.body.appendChild(settingsPanel);
    
    // 设置按钮
    const settingsButton = document.createElement('button');
    settingsButton.className = 'settings-button';
    settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
    settingsButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10007;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    `;
    
    document.body.appendChild(settingsButton);
    
    // 事件处理
    settingsButton.addEventListener('click', function() {
        settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
    });
    
    document.getElementById('closeSettings').addEventListener('click', function() {
        settingsPanel.style.display = 'none';
    });
    
    document.getElementById('cancelBtnEnabled').addEventListener('change', function() {
        window.cancelButtons.enabled = this.checked;
        if (this.checked) {
            window.cancelButtons.updateAll();
        } else {
            // 移除所有取消按钮
            document.querySelectorAll('.cancel-selection-btn').forEach(btn => btn.remove());
        }
    });
    
    document.getElementById('cancelBtnAlwaysVisible').addEventListener
/**
 * 取消按钮改进 - 完成部分
 */

// 续接上面的函数
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
        min-width: 200px;
    `;
    
    settingsPanel.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937;">⚙️ 取消按钮设置</div>
        <div style="margin-bottom: 15px;">
            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" id="cancelBtnEnabled" checked style="cursor: pointer;">
                <span style="font-size: 0.9rem;">启用取消按钮</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" id="cancelBtnAlwaysVisible" style="cursor: pointer;">
                <span style="font-size: 0.9rem;">取消按钮常显</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="cancelBtnPosition" checked style="cursor: pointer;">
                <span style="font-size: 0.9rem;">显示在右上角</span>
            </label>
        </div>
        <div style="display: flex; gap: 10px;">
            <button id="applySettings" style="flex: 1; padding: 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">应用</button>
            <button id="closeSettings" style="flex: 1; padding: 8px; background: #e5e7eb; color: #374151; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">关闭</button>
        </div>
    `;
    
    document.body.appendChild(settingsPanel);
    
    // 设置按钮
    const settingsButton = document.createElement('button');
    settingsButton.className = 'settings-button';
    settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
    settingsButton.title = '取消按钮设置';
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
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(settingsButton);
    
    // 事件处理
    settingsButton.addEventListener('click', function() {
        settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
        this.style.transform = 'rotate(90deg)';
        
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    document.getElementById('closeSettings').addEventListener('click', function() {
        settingsPanel.style.display = 'none';
    });
    
    document.getElementById('applySettings').addEventListener('click', function() {
        const enabled = document.getElementById('cancelBtnEnabled').checked;
        const alwaysVisible = document.getElementById('cancelBtnAlwaysVisible').checked;
        const topRight = document.getElementById('cancelBtnPosition').checked;
        
        // 更新设置
        window.cancelButtons.enabled = enabled;
        
        // 更新按钮可见性
        document.querySelectorAll('.cancel-selection-btn').forEach(btn => {
            if (alwaysVisible) {
                btn.classList.add('always-visible');
            } else {
                btn.classList.remove('always-visible');
            }
            
            // 更新位置
            if (topRight) {
                btn.style.top = '10px';
                btn.style.right = '10px';
                btn.style.left = 'auto';
            } else {
                btn.style.top = '10px';
                btn.style.left = '10px';
                btn.style.right = 'auto';
            }
        });
        
        // 显示应用成功反馈
        showSettingsFeedback('设置已应用');
        
        // 关闭面板
        setTimeout(() => {
            settingsPanel.style.display = 'none';
        }, 500);
    });
    
    console.log('⚙️ 取消按钮设置面板已添加');
}

function showSettingsFeedback(message) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 70px;
        left: 20px;
        background: #10b981;
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        z-index: 10009;
        animation: settings-feedback 2s ease-out forwards;
        font-size: 0.9rem;
    `;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 2000);
}

// 添加设置相关样式
const settingsStyle = document.createElement('style');
settingsStyle.textContent = `
    @keyframes settings-feedback {
        0% { opacity: 0; transform: translateY(10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    .settings-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }
    
    .cancel-settings {
        animation: settings-panel-in 0.3s ease-out;
    }
    
    @keyframes settings-panel-in {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(settingsStyle);

// 添加测试函数
function testCancelButtonFunctionality() {
    console.log('🧪 测试取消按钮功能...');
    
    // 模拟选择一些硬件
    setTimeout(() => {
        const hardwareItems = document.querySelectorAll('.hardware-item');
        if (hardwareItems.length > 0) {
            // 选择第一个硬件
            hardwareItems[0].classList.add('selected');
            window.cancelButtons.showOnItem(hardwareItems[0]);
            
            console.log('✅ 测试: 已选择硬件并显示取消按钮');
            
            // 测试取消按钮点击
            setTimeout(() => {
                const cancelBtn = hardwareItems[0].querySelector('.cancel-selection-btn');
                if (cancelBtn) {
                    console.log('✅ 测试: 取消按钮已创建');
                    
                    // 模拟悬停显示按钮
                    hardwareItems[0].dispatchEvent(new MouseEvent('mouseenter'));
                    
                    setTimeout(() => {
                        console.log('✅ 测试: 取消按钮应显示在悬停时');
                        
                        // 模拟点击取消
                        cancelBtn.click();
                        
                        setTimeout(() => {
                            console.log('✅ 测试: 取消按钮点击完成');
                            console.log('🎉 取消按钮功能测试完成');
                        }, 1000);
                    }, 500);
                } else {
                    console.warn('⚠️ 测试: 未找到取消按钮');
                }
            }, 500);
        } else {
            console.warn('⚠️ 测试: 未找到硬件项目');
        }
    }, 1000);
}

// 初始化完成后的操作
setTimeout(() => {
    console.log('🔧 取消按钮改进完成状态检查...');
    
    // 检查硬件项目
    const hardwareItems = document.querySelectorAll('.hardware-item');
    console.log(`📊 找到 ${hardwareItems.length} 个硬件项目`);
    
    // 检查已选择的项目
    const selectedItems = document.querySelectorAll('.hardware-item.selected');
    console.log(`📊 找到 ${selectedItems.length} 个已选择的项目`);
    
    // 为已选择的项目添加取消按钮
    selectedItems.forEach(item => {
        window.cancelButtons.showOnItem(item);
    });
    
    // 添加设置面板（可选）
    addCancelButtonSettings();
    
    // 运行测试（仅开发环境）
    if (window.location.href.includes('test')) {
        testCancelButtonFunctionality();
    }
    
    console.log('🎊 取消按钮改进完全部署完成');
}, 2000);

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+C 快速取消当前选择
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        
        const selectedItem = document.querySelector('.hardware-item.selected');
        if (selectedItem) {
            const cancelBtn = selectedItem.querySelector('.cancel-selection-btn');
            if (cancelBtn) {
                cancelBtn.click();
                console.log('⌨️ 快捷键: 取消当前选择');
            }
        }
    }
    
    // Esc 键取消所有选择
    if (e.key === 'Escape') {
        const selectedItems = document.querySelectorAll('.hardware-item.selected');
        if (selectedItems.length > 0) {
            if (confirm('按ESC键: 取消所有硬件选择？')) {
                selectedItems.forEach(item => {
                    const cancelBtn = item.querySelector('.cancel-selection-btn');
                    if (cancelBtn) cancelBtn.click();
                });
                console.log('⌨️ ESC键: 取消所有选择');
            }
        }
    }
});

console.log('🚀 取消按钮改进脚本加载完成');
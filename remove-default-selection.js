/**
 * 移除默认硬件选择 - 解决"每次打开网页都显示相同配置"问题
 */

console.log('🧹 移除默认硬件选择...');

// 立即执行
(function() {
    console.log('🎯 开始移除默认选择...');
    
    // 1. 修改 force-price-fix.js 的模拟选择
    removeForcePriceFixDefaults();
    
    // 2. 清除任何保存的选择数据
    clearSavedSelections();
    
    // 3. 重置UI显示
    resetUIDisplay();
    
    // 4. 添加清除按钮
    addClearSelectionButton();
    
    console.log('✅ 默认选择已移除');
})();

function removeForcePriceFixDefaults() {
    console.log('🔧 修改 force-price-fix.js 默认选择...');
    
    // 检查 force-price-fix.js 是否已加载
    if (window.forceSelectedHardware) {
        // 清空默认选择
        window.forceSelectedHardware = {
            cpu: { name: null, price: 0 },
            gpu: { name: null, price: 0 },
            motherboard: { name: null, price: 0 },
            ram: { name: null, price: 0 },
            storage: { name: null, price: 0 },
            cooling: { name: null, price: 0 },
            psu: { name: null, price: 0 },
            case: { name: null, price: 0 }
        };
        
        console.log('✅ force-price-fix.js 默认选择已清空');
    }
    
    // 修改 userSelections 数组（如果存在）
    if (window.userSelections) {
        window.userSelections = [];
        console.log('✅ userSelections 数组已清空');
    }
}

function clearSavedSelections() {
    console.log('🗑️ 清除保存的选择数据...');
    
    // 清除 localStorage 中的选择数据
    try {
        localStorage.removeItem('selectedHardware');
        localStorage.removeItem('pcConfig');
        localStorage.removeItem('userSelections');
        localStorage.removeItem('hardwareSelections');
        console.log('✅ localStorage 选择数据已清除');
    } catch (e) {
        console.log('⚠️ 清除 localStorage 失败:', e.message);
    }
    
    // 清除 sessionStorage 中的选择数据
    try {
        sessionStorage.removeItem('selectedHardware');
        sessionStorage.removeItem('pcConfig');
        console.log('✅ sessionStorage 选择数据已清除');
    } catch (e) {
        console.log('⚠️ 清除 sessionStorage 失败:', e.message);
    }
    
    // 清除全局变量
    if (window.selectedHardware) {
        window.selectedHardware = {
            cpu: { name: null, price: 0 },
            gpu: { name: null, price: 0 },
            motherboard: { name: null, price: 0 },
            ram: { name: null, price: 0 },
            storage: { name: null, price: 0 },
            cooling: { name: null, price: 0 },
            psu: { name: null, price: 0 },
            case: { name: null, price: 0 }
        };
        console.log('✅ window.selectedHardware 已重置');
    }
}

function resetUIDisplay() {
    console.log('🎨 重置UI显示...');
    
    // 延迟执行，确保DOM已加载
    setTimeout(() => {
        // 重置配置摘要显示
        const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
        
        categories.forEach(category => {
            const elementId = `selected${capitalize(category)}`;
            const element = document.getElementById(elementId);
            
            if (element) {
                element.textContent = '未选择';
                console.log(`✅ ${category} 显示已重置: 未选择`);
            }
            
            // 重置价格显示
            const priceElement = document.querySelector(`[data-category="${category}"] .component-price`);
            if (priceElement) {
                priceElement.textContent = '¥0';
            }
        });
        
        // 重置总价显示
        const hardwareTotalElement = document.getElementById('hardwareTotal');
        if (hardwareTotalElement) {
            hardwareTotalElement.textContent = '¥0';
        }
        
        const grandTotalElement = document.getElementById('grandTotal');
        if (grandTotalElement) {
            grandTotalElement.textContent = '¥299'; // 只显示服务费
        }
        
        // 重置硬件选择状态
        const selectedItems = document.querySelectorAll('.hardware-item.selected');
        selectedItems.forEach(item => {
            item.classList.remove('selected');
        });
        
        console.log('✅ UI显示已重置');
    }, 1000);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function addClearSelectionButton() {
    console.log('🔘 添加清除选择按钮...');
    
    setTimeout(() => {
        // 查找配置操作区域
        const configActions = document.querySelector('.config-actions');
        if (!configActions) {
            console.log('⚠️ 未找到配置操作区域');
            return;
        }
        
        // 检查是否已有清除按钮
        if (document.getElementById('clearAllSelectionsBtn')) {
            console.log('✅ 清除按钮已存在');
            return;
        }
        
        // 创建清除按钮
        const clearButton = document.createElement('button');
        clearButton.id = 'clearAllSelectionsBtn';
        clearButton.className = 'btn btn-outline';
        clearButton.innerHTML = '<i class="fas fa-trash-alt"></i> 清除所有选择';
        clearButton.style.marginTop = '10px';
        
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('确定要清除所有硬件选择吗？')) {
                // 清除所有选择
                clearSavedSelections();
                resetUIDisplay();
                
                // 显示反馈
                showClearFeedback();
            }
        });
        
        configActions.appendChild(clearButton);
        console.log('✅ 清除选择按钮已添加');
    }, 1500);
}

function showClearFeedback() {
    // 创建反馈消息
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #10b981;
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        z-index: 10060;
        animation: feedback-show 0.5s ease-out, feedback-hide 0.5s ease-out 2s forwards;
        text-align: center;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    `;
    
    feedback.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 10px;">✅</div>
        <div style="font-weight: 600; margin-bottom: 5px;">所有选择已清除</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">页面已重置为初始状态</div>
    `;
    
    document.body.appendChild(feedback);
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes feedback-show {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        
        @keyframes feedback-hide {
            from { opacity: 1; transform: translate(-50%, -50%); }
            to { opacity: 0; transform: translate(-50%, -40%); }
        }
    `;
    document.head.appendChild(style);
    
    // 3秒后移除反馈
    setTimeout(() => {
        feedback.remove();
        style.remove();
    }, 3000);
}

// 页面加载完成后执行
window.addEventListener('load', function() {
    console.log('📄 页面加载完成，检查默认选择...');
    
    // 再次检查并清除默认选择
    setTimeout(() => {
        clearSavedSelections();
        resetUIDisplay();
    }, 500);
});

console.log('🎊 移除默认选择脚本加载完成');
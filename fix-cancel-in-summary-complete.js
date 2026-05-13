/**
 * 配置摘要取消按钮 - 完成部分
 */

// 续接上面的函数
function syncWithCardCancelButtons() {
    console.log('🔄 同步配置摘要和硬件卡片取消按钮...');
    
    // 当硬件卡片上的取消按钮被点击时，也更新配置摘要
    document.addEventListener('click', function(e) {
        const cardCancelBtn = e.target.closest('.cancel-selection-btn');
        if (cardCancelBtn && cardCancelBtn.closest('.hardware-item')) {
            const hardwareItem = cardCancelBtn.closest('.hardware-item');
            const category = hardwareItem.dataset.category;
            const name = hardwareItem.dataset.name;
            const price = parseFloat(hardwareItem.dataset.price) || 0;
            
            console.log(`🔄 检测到硬件卡片取消按钮点击: ${category} - ${name}`);
            
            // 延迟执行，让硬件卡片的取消逻辑先完成
            setTimeout(() => {
                // 更新配置摘要显示
                updateSummaryDisplay(category, '未选择', 0);
                
                // 移除配置摘要中的取消按钮
                window.summaryCancelButtons.removeFromSummary(category);
                
                console.log(`✅ 同步更新配置摘要: ${category}`);
            }, 100);
        }
    });
    
    // 当配置摘要取消按钮被点击时，也更新硬件卡片
    document.addEventListener('click', function(e) {
        const summaryCancelBtn = e.target.closest('.summary-cancel-btn');
        if (summaryCancelBtn) {
            const category = summaryCancelBtn.dataset.category;
            
            console.log(`🔄 检测到配置摘要取消按钮点击: ${category}`);
            
            // 延迟执行，让配置摘要的取消逻辑先完成
            setTimeout(() => {
                // 更新硬件卡片选择状态
                updateHardwareListSelection(category, null);
                
                console.log(`✅ 同步更新硬件卡片: ${category}`);
            }, 100);
        }
    });
    
    console.log('✅ 取消按钮同步设置完成');
}

// 添加配置摘要取消按钮设置
function addSummaryCancelSettings() {
    // 创建设置按钮
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'summary-cancel-settings-btn';
    settingsBtn.innerHTML = '<i class="fas fa-sliders-h"></i>';
    settingsBtn.title = '取消按钮设置';
    settingsBtn.style.cssText = `
        position: fixed;
        bottom: 70px;
        left: 20px;
        width: 40px;
        height: 40px;
        background: #8b5cf6;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10011;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(settingsBtn);
    
    // 创建设置面板
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'summary-cancel-settings-panel';
    settingsPanel.style.cssText = `
        position: fixed;
        bottom: 120px;
        left: 20px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10012;
        display: none;
        min-width: 200px;
    `;
    
    settingsPanel.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937;">⚙️ 取消按钮设置</div>
        <div style="margin-bottom: 15px;">
            <div style="font-size: 0.9rem; color: #6b7280; margin-bottom: 8px;">取消按钮位置:</div>
            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                <input type="radio" name="cancelLocation" value="summary" checked style="cursor: pointer;">
                <span style="font-size: 0.9rem;">配置摘要（推荐）</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                <input type="radio" name="cancelLocation" value="card" style="cursor: pointer;">
                <span style="font-size: 0.9rem;">硬件卡片</span>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                <input type="radio" name="cancelLocation" value="both" style="cursor: pointer;">
                <span style="font-size: 0.9rem;">两者都显示</span>
            </label>
        </div>
        <div style="display: flex; gap: 10px;">
            <button id="applySummarySettings" style="flex: 1; padding: 8px; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">应用</button>
            <button id="closeSummarySettings" style="flex: 1; padding: 8px; background: #e5e7eb; color: #374151; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">关闭</button>
        </div>
    `;
    
    document.body.appendChild(settingsPanel);
    
    // 事件处理
    settingsBtn.addEventListener('click', function() {
        settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
        this.style.transform = 'rotate(90deg)';
        
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    document.getElementById('closeSummarySettings').addEventListener('click', function() {
        settingsPanel.style.display = 'none';
    });
    
    document.getElementById('applySummarySettings').addEventListener('click', function() {
        const selectedLocation = document.querySelector('input[name="cancelLocation"]:checked').value;
        
        // 应用设置
        applyCancelLocationSetting(selectedLocation);
        
        // 显示反馈
        showSummarySettingsFeedback(`已设置为: ${getLocationName(selectedLocation)}`);
        
        // 关闭面板
        setTimeout(() => {
            settingsPanel.style.display = 'none';
        }, 500);
    });
    
    console.log('⚙️ 配置摘要取消按钮设置面板已添加');
}

function applyCancelLocationSetting(location) {
    console.log(`🔧 应用取消按钮位置设置: ${location}`);
    
    switch(location) {
        case 'summary':
            // 只显示在配置摘要
            document.querySelectorAll('.cancel-selection-btn').forEach(btn => btn.remove());
            initializeSummaryCancelButtons();
            break;
            
        case 'card':
            // 只显示在硬件卡片
            window.summaryCancelButtons.removeAll();
            // 硬件卡片按钮由其他脚本管理
            break;
            
        case 'both':
            // 两者都显示
            initializeSummaryCancelButtons();
            // 硬件卡片按钮由其他脚本管理
            break;
    }
    
    // 保存设置
    localStorage.setItem('cancelButtonLocation', location);
}

function getLocationName(location) {
    const names = {
        'summary': '配置摘要',
        'card': '硬件卡片',
        'both': '两者都显示'
    };
    return names[location] || location;
}

function showSummarySettingsFeedback(message) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 170px;
        left: 20px;
        background: #8b5cf6;
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        z-index: 10013;
        animation: summary-settings-feedback 2s ease-out forwards;
        font-size: 0.9rem;
    `;
    
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 2000);
}

// 添加设置相关样式
const summarySettingsStyle = document.createElement('style');
summarySettingsStyle.textContent = `
    @keyframes summary-settings-feedback {
        0% { opacity: 0; transform: translateY(10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    .summary-cancel-settings-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
    }
    
    .summary-cancel-settings-panel {
        animation: summary-settings-panel-in 0.3s ease-out;
    }
    
    @keyframes summary-settings-panel-in {
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
document.head.appendChild(summarySettingsStyle);

// 初始化完成后的操作
setTimeout(() => {
    console.log('🔧 配置摘要取消按钮完成状态检查...');
    
    // 检查配置摘要元素
    const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case'];
    let foundElements = 0;
    
    categories.forEach(category => {
        const elementId = `selected${capitalize(category)}`;
        const element = document.getElementById(elementId);
        if (element) foundElements++;
    });
    
    console.log(`📊 找到 ${foundElements}/${categories.length} 个配置摘要元素`);
    
    // 初始化取消按钮
    initializeSummaryCancelButtons();
    
    // 设置同步
    syncWithCardCancelButtons();
    
    // 添加设置面板
    addSummaryCancelSettings();
    
    // 加载保存的设置
    const savedLocation = localStorage.getItem('cancelButtonLocation') || 'summary';
    if (savedLocation) {
        const radio = document.querySelector(`input[name="cancelLocation"][value="${savedLocation}"]`);
        if (radio) {
            radio.checked = true;
            applyCancelLocationSetting(savedLocation);
        }
    }
    
    console.log('🎊 配置摘要取消按钮完全部署完成');
}, 3000);

// 添加测试函数
function testSummaryCancelButtons() {
    console.log('🧪 测试配置摘要取消按钮...');
    
    // 模拟选择一些硬件
    setTimeout(() => {
        // 模拟CPU选择
        updateSummaryDisplay('cpu', '测试CPU', 2999);
        window.summaryCancelButtons.addToSummary('cpu', '测试CPU', 2999);
        
        console.log('✅ 测试: 已添加CPU取消按钮');
        
        // 测试取消按钮点击
        setTimeout(() => {
            const cpuCancelBtn = document.querySelector('.summary-cancel-btn[data-category="cpu"]');
            if (cpuCancelBtn) {
                console.log('✅ 测试: 找到CPU取消按钮');
                
                // 模拟点击取消
                cpuCancelBtn.click();
                
                setTimeout(() => {
                    console.log('✅ 测试: 取消按钮点击完成');
                    console.log('🎉 配置摘要取消按钮功能测试完成');
                }, 1000);
            } else {
                console.warn('⚠️ 测试: 未找到CPU取消按钮');
            }
        }, 500);
    }, 1000);
}

// 运行测试（仅开发环境）
if (window.location.href.includes('test')) {
    testSummaryCancelButtons();
}

console.log('🚀 配置摘要取消按钮脚本加载完成');
/**
 * 确保记忆功能开关脚本执行
 * 多重保障机制确保脚本一定执行
 */

console.log('🎯 确保记忆功能开关脚本执行...');

// 多重执行保障
(function() {
    console.log('🛡️ 启动多重执行保障...');
    
    // 方法1: 立即尝试执行
    tryExecuteImmediately();
    
    // 方法2: DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryExecuteOnDOMLoad);
    } else {
        setTimeout(tryExecuteOnDOMLoad, 100);
    }
    
    // 方法3: 页面完全加载后执行
    window.addEventListener('load', tryExecuteOnWindowLoad);
    
    // 方法4: 延迟执行作为最后保障
    setTimeout(tryExecuteAsLastResort, 3000);
    
    console.log('✅ 多重执行保障已启动');
})();

function tryExecuteImmediately() {
    console.log('⚡ 尝试立即执行...');
    try {
        // 检查当前页面是否是检查页面
        if (window.location.pathname.includes('check-memory-toggles')) {
            console.log('📋 当前是检查页面，跳过修复');
            return;
        }
        
        // 立即创建开关
        createToggleNow();
    } catch (error) {
        console.log('⚠️ 立即执行失败:', error.message);
    }
}

function tryExecuteOnDOMLoad() {
    console.log('📄 DOM加载完成，执行修复...');
    try {
        createToggleNow();
    } catch (error) {
        console.log('⚠️ DOM加载后执行失败:', error.message);
    }
}

function tryExecuteOnWindowLoad() {
    console.log('🖼️ 窗口完全加载，执行修复...');
    try {
        createToggleNow();
    } catch (error) {
        console.log('⚠️ 窗口加载后执行失败:', error.message);
    }
}

function tryExecuteAsLastResort() {
    console.log('🔄 最后保障机制执行...');
    try {
        // 检查是否已经创建了开关
        const existingToggles = document.querySelectorAll('input[type="checkbox"]');
        const memoryToggles = Array.from(existingToggles).filter(checkbox => {
            const parentText = checkbox.parentElement?.textContent || '';
            return parentText.includes('记忆功能');
        });
        
        if (memoryToggles.length === 0) {
            console.log('⚠️ 最后保障：未找到开关，强制创建');
            forceCreateToggle();
        } else {
            console.log(`✅ 最后保障：已找到 ${memoryToggles.length} 个开关`);
        }
    } catch (error) {
        console.log('❌ 最后保障执行失败:', error.message);
    }
}

function createToggleNow() {
    console.log('🔧 立即创建开关...');
    
    // 检查是否已经存在开关
    const existingToggles = document.querySelectorAll('input[type="checkbox"]');
    const memoryToggles = Array.from(existingToggles).filter(checkbox => {
        const parentText = checkbox.parentElement?.textContent || '';
        return parentText.includes('记忆功能');
    });
    
    if (memoryToggles.length > 0) {
        console.log(`✅ 已存在 ${memoryToggles.length} 个开关，跳过创建`);
        return;
    }
    
    // 查找配置摘要区域
    let configSummary = document.querySelector('.config-summary');
    if (!configSummary) {
        console.log('⚠️ 未找到配置摘要区域');
        return;
    }
    
    // 查找摘要头部
    let summaryHeader = configSummary.querySelector('.summary-header');
    if (!summaryHeader) {
        console.log('⚠️ 未找到摘要头部');
        return;
    }
    
    console.log('✅ 找到配置摘要区域和头部');
    
    // 创建开关
    const toggleId = 'ensuredMemoryToggle';
    const toggleHtml = `
        <div class="ensured-toggle" style="
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
            font-size: 0.8rem;
            color: #6b7280;
        ">
            <span>记忆功能:</span>
            <label style="position: relative; display: inline-block; width: 40px; height: 20px;">
                <input type="checkbox" id="${toggleId}" checked 
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
    
    // 添加到摘要头部
    summaryHeader.insertAdjacentHTML('beforeend', toggleHtml);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #${toggleId}:checked + span {
            background-color: #8b5cf6 !important;
        }
        #${toggleId}:checked + span + span {
            transform: translateX(20px) !important;
        }
        
        /* 隐藏其他可能的开关 */
        [class*="memory"]:not(.ensured-toggle),
        [id*="memory"]:not(#${toggleId}) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // 绑定事件
    const toggle = document.getElementById(toggleId);
    if (toggle) {
        toggle.addEventListener('change', function() {
            console.log('记忆功能:', this.checked ? '开启' : '关闭');
            localStorage.setItem('memoryEnabled', this.checked);
        });
    }
    
    console.log('✅ 开关创建成功');
    showEnsuredMessage('记忆功能开关已创建');
}

function forceCreateToggle() {
    console.log('💥 强制创建开关...');
    
    // 尝试在body末尾创建
    const toggleId = 'forcedMemoryToggle';
    const toggleHtml = `
        <div id="forcedToggleContainer" style="
            position: fixed;
            top: 10px;
            right: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 10000;
        ">
            <span style="font-size: 0.9rem; color: #333;">记忆功能:</span>
            <label style="position: relative; display: inline-block; width: 40px; height: 20px;">
                <input type="checkbox" id="${toggleId}" checked 
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
    
    document.body.insertAdjacentHTML('beforeend', toggleHtml);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #${toggleId}:checked + span {
            background-color: #8b5cf6 !important;
        }
        #${toggleId}:checked + span + span {
            transform: translateX(20px) !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ 强制开关创建成功');
    showEnsuredMessage('已创建记忆功能开关（强制位置）');
}

function showEnsuredMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #10b981;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 0.9rem;
        font-weight: 600;
        animation: ensuredFade 3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'ensuredFadeOut 0.5s ease';
        setTimeout(() => message.remove(), 500);
    }, 3000);
    
    // 添加动画样式
    if (!document.querySelector('#ensured-animation')) {
        const style = document.createElement('style');
        style.id = 'ensured-animation';
        style.textContent = `
            @keyframes ensuredFade {
                0% { opacity: 0; transform: translateY(20px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(20px); }
            }
            @keyframes ensuredFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 立即开始执行
console.log('🚀 开始执行多重保障机制...');
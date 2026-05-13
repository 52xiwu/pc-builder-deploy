/**
 * 修复空白页面问题
 */

console.log('🔧 修复空白页面问题...');

// 安全执行，避免错误
try {
    // 1. 移除可能出问题的脚本
    removeProblematicScripts();
    
    // 2. 检查页面基本结构
    checkPageStructure();
    
    // 3. 创建安全的记忆功能开关
    createSafeMemoryToggle();
    
    console.log('✅ 空白页面修复完成');
} catch (error) {
    console.error('❌ 修复过程中出错:', error);
    showErrorMessage(error);
}

function removeProblematicScripts() {
    console.log('🗑️ 移除可能出问题的脚本...');
    
    // 移除我们添加的脚本标签
    const scriptsToRemove = [
        'ultra-simple-memory-toggle.js',
        'delete-memory-block-immediate.js',
        'remove-memory-block.js',
        'remove-duplicate-memory-button.js',
        'fix-memory-override.js',
        'fix-memory-function.js'
    ];
    
    scriptsToRemove.forEach(scriptName => {
        const script = document.querySelector(`script[src*="${scriptName}"]`);
        if (script) {
            console.log(`🗑️ 移除脚本: ${scriptName}`);
            script.remove();
        }
    });
    
    // 移除可能出问题的内联脚本
    const inlineScripts = document.querySelectorAll('script:not([src])');
    inlineScripts.forEach((script, index) => {
        const content = script.textContent || '';
        if (content.includes('deleteEverything') || content.includes('记忆功能')) {
            console.log(`🗑️ 移除可能出问题的内联脚本 ${index + 1}`);
            script.remove();
        }
    });
}

function checkPageStructure() {
    console.log('🔍 检查页面结构...');
    
    // 检查基本元素
    const checks = [
        { name: 'document.body', check: () => document.body, required: true },
        { name: 'document.head', check: () => document.head, required: true },
        { name: 'HTML结构', check: () => document.documentElement, required: true },
        { name: '标题', check: () => document.title, required: false },
        { name: '主要内容容器', check: () => document.querySelector('.container, main, #app'), required: false }
    ];
    
    checks.forEach(item => {
        try {
            const result = item.check();
            if (result) {
                console.log(`✅ ${item.name}: 存在`);
            } else if (item.required) {
                console.log(`❌ ${item.name}: 缺失`);
                throw new Error(`${item.name} 缺失`);
            } else {
                console.log(`⚠️ ${item.name}: 不存在（非必需）`);
            }
        } catch (error) {
            console.log(`❌ ${item.name}: 检查失败 - ${error.message}`);
        }
    });
}

function createSafeMemoryToggle() {
    console.log('🔧 创建安全的记忆功能开关...');
    
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggle);
    } else {
        setTimeout(createToggle, 100);
    }
    
    function createToggle() {
        try {
            // 找到配置摘要头部
            const configHeader = document.querySelector('.config-summary .summary-header');
            if (!configHeader) {
                console.log('⚠️ 未找到配置摘要头部，跳过创建开关');
                return;
            }
            
            console.log('✅ 找到配置摘要头部');
            
            // 创建最简单的开关
            const toggleHtml = `
                <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
                    <span style="font-size: 0.8rem; color: #6b7280;">记忆功能:</span>
                    <label style="position: relative; display: inline-block; width: 40px; height: 20px;">
                        <input type="checkbox" id="safeMemoryToggle" checked 
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
            
            // 添加到页面
            configHeader.insertAdjacentHTML('beforeend', toggleHtml);
            
            // 添加样式
            const style = document.createElement('style');
            style.textContent = `
                #safeMemoryToggle:checked + span {
                    background-color: #8b5cf6 !important;
                }
                #safeMemoryToggle:checked + span + span {
                    transform: translateX(20px) !important;
                }
            `;
            document.head.appendChild(style);
            
            // 绑定事件
            const toggle = document.getElementById('safeMemoryToggle');
            if (toggle) {
                toggle.addEventListener('change', function() {
                    console.log('记忆功能:', this.checked ? '开启' : '关闭');
                    try {
                        localStorage.setItem('memory', this.checked ? 'on' : 'off');
                    } catch (e) {
                        // 忽略localStorage错误
                    }
                });
            }
            
            console.log('✅ 安全的记忆功能开关已创建');
        } catch (error) {
            console.error('❌ 创建开关失败:', error);
        }
    }
}

function showErrorMessage(error) {
    // 在页面上显示错误信息
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ef4444;
        color: white;
        padding: 10px;
        font-family: monospace;
        font-size: 12px;
        z-index: 99999;
    `;
    errorDiv.textContent = `页面错误: ${error.message}`;
    document.body.appendChild(errorDiv);
}

// 执行修复
console.log('🚀 开始执行修复...');
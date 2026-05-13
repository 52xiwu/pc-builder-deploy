/**
 * 检查页面中可能需要删除的元素
 */

console.log('🔍 检查页面中可能需要删除的元素...');

// 立即执行
(function() {
    console.log('🎯 开始检查页面元素...');
    
    // 1. 检查记忆功能相关元素
    checkMemoryElements();
    
    // 2. 检查保存按钮相关元素
    checkSaveButtons();
    
    // 3. 检查可能重复的元素
    checkDuplicateElements();
    
    // 4. 检查状态显示元素
    checkStatusElements();
    
    console.log('✅ 页面元素检查完成');
})();

function checkMemoryElements() {
    console.log('🧠 检查记忆功能相关元素...');
    
    // 记忆功能开关
    const memoryToggles = document.querySelectorAll('#memoryFunctionToggle, input[type="checkbox"][id*="memory"]');
    console.log(`📊 记忆功能开关: ${memoryToggles.length} 个`);
    
    // 记忆功能容器
    const memoryContainers = document.querySelectorAll('.memory-toggle-container, [class*="memory"]');
    console.log(`📊 记忆功能容器: ${memoryContainers.length} 个`);
    
    // 记忆功能文本
    const memoryTexts = document.querySelectorAll('*:contains("记忆功能")');
    console.log(`📊 包含"记忆功能"文本的元素: ${memoryTexts.length} 个`);
    
    memoryTexts.forEach((element, index) => {
        console.log(`  文本 ${index + 1}: "${element.textContent.trim().substring(0, 30)}..."`);
    });
}

function checkSaveButtons() {
    console.log('💾 检查保存按钮相关元素...');
    
    // 保存配置按钮
    const saveButtons = document.querySelectorAll('#saveConfigBtn, button:contains("保存配置"), button:contains("保存设置")');
    console.log(`📊 保存按钮: ${saveButtons.length} 个`);
    
    saveButtons.forEach((button, index) => {
        console.log(`  保存按钮 ${index + 1}: "${button.textContent.trim()}"`);
    });
    
    // 红色按钮
    const redButtons = document.querySelectorAll('.btn-danger, .btn-red, button[style*="red"], button[style*="#ef4444"], button[style*="#f00"]');
    console.log(`📊 红色按钮: ${redButtons.length} 个`);
    
    redButtons.forEach((button, index) => {
        console.log(`  红色按钮 ${index + 1}: "${button.textContent.trim()}" - 类: ${button.className}`);
    });
}

function checkDuplicateElements() {
    console.log('🔄 检查可能重复的元素...');
    
    // 检查配置摘要区域
    const configSummary = document.querySelector('.config-summary');
    if (configSummary) {
        console.log('✅ 找到配置摘要区域');
        
        // 检查摘要头部
        const summaryHeader = configSummary.querySelector('.summary-header');
        if (summaryHeader) {
            const buttons = summaryHeader.querySelectorAll('button');
            console.log(`📊 摘要头部按钮: ${buttons.length} 个`);
            
            buttons.forEach((button, index) => {
                console.log(`  按钮 ${index + 1}: "${button.textContent.trim()}" - ID: ${button.id}`);
            });
        }
    }
    
    // 检查可能重复的状态显示
    const statusElements = document.querySelectorAll('.memory-status, [class*="status"], [id*="status"]');
    console.log(`📊 状态显示元素: ${statusElements.length} 个`);
}

function checkStatusElements() {
    console.log('📊 检查状态显示元素...');
    
    // 检查右上角状态显示
    const topRightStatus = document.querySelectorAll('[style*="top: 20px"][style*="right: 20px"], [style*="top: 10px"][style*="right: 10px"]');
    console.log(`📊 右上角状态显示: ${topRightStatus
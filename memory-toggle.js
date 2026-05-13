/**
 * 全部取消选取按钮
 * 位于配置摘要标题旁，点击取消所有已选取的硬件
 */
(function() {
    const BTN_ID = 'clearAllBtn';
    
    function createClearAllButton() {
        const summaryHeader = document.querySelector('.config-summary .summary-header');
        if (!summaryHeader || document.getElementById(BTN_ID)) return;
        
        const container = document.createElement('div');
        container.className = 'clear-all-btn-container';
        container.style.cssText = 'display: flex; align-items: center; margin-left: auto;';
        container.innerHTML = `
            <button id="${BTN_ID}" style="
                padding: 6px 14px;
                font-size: 0.85rem;
                font-weight: 500;
                color: #fff;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
            ">清空</button>
        `;
        
        summaryHeader.style.display = 'flex';
        summaryHeader.style.alignItems = 'center';
        summaryHeader.style.flexWrap = 'wrap';
        summaryHeader.style.gap = '12px';
        summaryHeader.appendChild(container);
        
        const btn = document.getElementById(BTN_ID);
        btn.addEventListener('click', function() {
            // 触发 builder-controller 的 resetConfigBtn（已绑定 resetConfig）
            // 不要调用 window.app 的不存在方法：deselectHardware / updateSummary / updateTotal
            const resetBtn = document.getElementById('resetConfigBtn');
            if (resetBtn) {
                resetBtn.click();
            } else {
                // fallback：直接清空 window.app.currentConfig（兼容旧 App 区）
                if (window.app && window.app.currentConfig) {
                    Object.keys(window.app.currentConfig).forEach(cat => {
                        window.app.currentConfig[cat] = null;
                    });
                    if (typeof window.app.updateConfigSummary === 'function') window.app.updateConfigSummary();
                    if (typeof window.app.updateTotalPrice === 'function') window.app.updateTotalPrice();
                }
                console.log('已清空所有选取的硬件');
            }
        });
        
        // 按钮悬停效果
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createClearAllButton);
    } else {
        createClearAllButton();
    }
})();

/**
 * 联信装机 - 应用入口
 */
(function() {
    console.log('[START] app.js 执行');
    
    // 检查前置条件
    if (typeof PCBuilderAppEnhanced === 'undefined') {
        console.error('[ERROR] PCBuilderAppEnhanced 未定义，app-enhanced.js 可能加载失败');
        return;
    }
    console.log('[OK] PCBuilderAppEnhanced 已加载');

    class PCBuilderApp extends PCBuilderAppEnhanced {
        constructor() {
            super();
            console.log('[OK] PCBuilderApp 构造函数完成');
        }
    }
    
    window.PCBuilderApp = PCBuilderApp;
    window.app = new PCBuilderApp();
    console.log('[OK] app 实例创建完成, 类型:', typeof window.app);

    // InteractionFixer 由 fix-interactions.js 在 DOMContentLoaded 时创建（只创建一次）
    // 已在 index.html 中 fix-interactions.js 之后执行，无需在此重复初始化
})();

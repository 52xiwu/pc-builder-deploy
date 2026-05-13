/**
 * 紧急直接价格同步 - 绕过API直接在前端实现
 */

console.log('🚨 紧急直接价格同步启动...');

// 立即执行
(function() {
    console.log('🎯 开始紧急直接价格同步...');
    
    // 1. 创建直接价格同步系统
    createDirectPriceSync();
    
    // 2. 立即同步所有价格
    syncAllPricesDirectly();
    
    // 3. 添加直接同步控制
    addDirectSyncControls();
    
    console.log('✅ 紧急直接价格同步完成');
})();

function createDirectPriceSync() {
    console.log('💰 创建直接价格同步系统...');
    
    // 硬件产品数据库
    window.directPriceDB = {
        products: {},
        syncInterval: 30000, // 30秒
        syncTimer: null,
        lastSyncTime: null,
        
        // 初始化产品数据
        init: function() {
            console.log('📊 初始化直接价格数据库...');
            
            this.products = {
                // CPU
                'cpu_amd_ryzen9_9850x3d': {
                    id: 'cpu_amd_ryzen9_9850x3d',
                    name: 'AMD Ryzen 9 9850X3D',
                    category: 'cpu',
                    specs: '24核心/48线程 4.5-6.0GHz 3D V-Cache',
                    basePrice: 6999,
                    priceSources: {},
                    bestPrice: {},
                    lastUpdated: null
                },
                'cpu_intel_i9_14900k': {
                    id: 'cpu_intel_i9_14900k',
                    name: 'Intel Core i9-14900K',
                    category: 'cpu',
                    specs: '24核心/32线程 3.2-6.0GHz',
                    basePrice: 4299,
                    priceSources: {},
                    bestPrice: {},
                    lastUpdated: null
                },
                
                // GPU
                'gpu_nvidia_rtx_5090': {
                    id: 'gpu_nvidia_rtx_5090',
                    name: 'NVIDIA RTX 5090',
                    category: 'gpu',
                    specs: '32GB GDDR7 旗舰显卡',
                    basePrice: 19999,
                    priceSources: {},
                    bestPrice: {},
                    lastUpdated: null
                },
                'gpu_rtx_4080_super': {
                    id: 'gpu_rtx_4080_super',
                    name: 'NVIDIA RTX 4080 SUPER',
                    category: 'gpu',
                    specs: '16GB GDDR6X DLSS 3',
                    basePrice: 8999,
                    priceSources
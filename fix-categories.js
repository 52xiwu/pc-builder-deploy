/**
 * 修复筛选分类 - 为游戏电竞、工作站、性价比、RGB光效添加对应硬件
 */

console.log('🎮 加载分类修复脚本...');

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 页面加载完成，开始修复分类...');
    
    // 1. 创建分类专用硬件数据
    const categoryData = createCategoryHardwareData();
    
    // 2. 修复筛选按钮和功能
    fixCategoryFilters(categoryData);
    
    // 3. 初始化产品商城
    initCategoryProducts(categoryData);
    
    console.log('🎉 分类修复完成');
});

function createCategoryHardwareData() {
    console.log('📦 创建分类专用硬件数据...');
    
    return {
        // 游戏电竞专用硬件
        gaming: [
            // CPU
            { id: 'g-cpu1', name: 'AMD Ryzen 7 7800X3D', specs: '8核心/16线程 4.2-5.0GHz 3D V-Cache', price: 2999, brand: 'amd', category: 'cpu', rgb: true, tags: ['电竞', '游戏优化'] },
            { id: 'g-cpu2', name: 'Intel Core i7-14700K', specs: '20核心/28线程 3.4-5.6GHz', price: 3299, brand: 'intel', category: 'cpu', rgb: true, tags: ['电竞', '高性能'] },
            
            // 显卡
            { id: 'g-gpu1', name: 'NVIDIA RTX 4090', specs: '24GB GDDR6X 旗舰游戏显卡', price: 12999, brand: 'nvidia', category: 'gpu', rgb: true, tags: ['4K游戏', '光追'] },
            { id: 'g-gpu2', name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X 高端游戏显卡', price: 8499, brand: 'nvidia', category: 'gpu', rgb: true, tags: ['2K游戏', '电竞'] },
            { id: 'g-gpu3', name: 'AMD Radeon RX 7900 XTX', specs: '24GB GDDR6 高性能游戏显卡', price: 7999, brand: 'amd', category: 'gpu', rgb: true, tags: ['4K游戏', 'FreeSync'] },
            
            // 主板
            { id: 'g-mb1', name: 'ROG STRIX B760-A GAMING', specs: 'Intel B760 ATX 电竞主板', price: 1899, brand: 'asus', category: 'motherboard', rgb: true, tags: ['电竞', 'RGB'] },
            { id: 'g-mb2', name: 'MSI MPG B650 EDGE WIFI', specs: 'AMD B650 ATX 游戏主板', price: 1999, brand: 'msi', category: 'motherboard', rgb: true, tags: ['电竞', 'WiFi6'] },
            
            // 内存
            { id: 'g-ram1', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz RGB内存', price: 1099, brand: 'gskill', category: 'ram', rgb: true, tags: ['电竞', 'RGB'] },
            { id: 'g-ram2', name: 'CORSAIR VENGEANCE RGB', specs: '32GB (2x16GB) DDR5 5600MHz RGB内存', price: 999, brand: 'corsair', category: 'ram', rgb: true, tags: ['电竞', 'iCUE'] },
            
            // 散热
            { id: 'g-cool1', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO RGB水冷', price: 1299, brand: 'nzxt', category: 'cooling', rgb: true, tags: ['电竞', 'RGB'] },
            { id: 'g-cool2', name: 'Corsair iCUE H150i ELITE', specs: '360mm RGB 水冷', price: 1399, brand: 'corsair', category: 'cooling', rgb: true, tags: ['电竞', 'iCUE'] },
            
            // 机箱
            { id: 'g-case1', name: 'Lian Li O11 Dynamic EVO', specs: '全景侧透电竞机箱', price: 899, brand: 'lianli', category: 'case', rgb: true, tags: ['电竞', '全景'] },
            { id: 'g-case2', name: 'HYTE Y60', specs: '全景曲面电竞机箱', price: 1299, brand: 'hyte', category: 'case', rgb: true, tags: ['电竞', '曲面'] },
            
            // 外设
            { id: 'g-per1', name: 'Razer Huntsman V2', specs: '光学机械游戏键盘', price: 1299, brand: 'razer', category: 'peripheral', rgb: true, tags: ['电竞', '光学轴'] },
            { id: 'g-per2', name: 'Logitech G Pro X Superlight', specs: '无线游戏鼠标', price: 899, brand: 'logitech', category: 'peripheral', rgb: true, tags: ['电竞', '无线'] },
            { id: 'g-per3', name: 'SteelSeries Arctis Nova Pro', specs: '无线游戏耳机', price: 1999, brand: 'steelseries', category: 'peripheral', rgb: false, tags: ['电竞', '无线'] }
        ],
        
        // 工作站专用硬件
        workstation: [
            // CPU
            { id: 'w-cpu1', name: 'AMD Threadripper PRO 7995WX', specs: '96核心/192线程 2.5-5.1GHz', price: 49999, brand: 'amd', category: 'cpu', rgb: false, tags: ['工作站', '专业'] },
            { id: 'w-cpu2', name: 'Intel Xeon w9-3495X', specs: '56核心/112线程 1.9-4.8GHz', price: 39999, brand: 'intel', category: 'cpu', rgb: false, tags: ['工作站', '服务器'] },
            { id: 'w-cpu3', name: 'AMD Ryzen 9 7950X', specs: '16核心/32线程 4.5-5.7GHz', price: 3999, brand: 'amd', category: 'cpu', rgb: false, tags: ['工作站', '创作'] },
            
            // 显卡
            { id: 'w-gpu1', name: 'NVIDIA RTX 6000 Ada', specs: '48GB GDDR6 专业图形卡', price: 59999, brand: 'nvidia', category: 'gpu', rgb: false, tags: ['专业', '渲染'] },
            { id: 'w-gpu2', name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X 专业创作显卡', price: 8499, brand: 'nvidia', category: 'gpu', rgb: false, tags: ['创作', 'AI'] },
            { id: 'w-gpu3', name: 'AMD Radeon PRO W7900', specs: '48GB GDDR6 专业显卡', price: 29999, brand: 'amd', category: 'gpu', rgb: false, tags: ['专业', 'CAD'] },
            
            // 主板
            { id: 'w-mb1', name: 'ASUS Pro WS WRX80E-SAGE', specs: 'AMD WRX80 E-ATX 工作站主板', price: 8999, brand: 'asus', category: 'motherboard', rgb: false, tags: ['工作站', '服务器'] },
            { id: 'w-mb2', name: 'Supermicro X13SWA-TF', specs: 'Intel W790 E-ATX 工作站主板', price: 7999, brand: 'supermicro', category: 'motherboard', rgb: false, tags: ['工作站', '企业级'] },
            
            // 内存
            { id: 'w-ram1', name: 'Kingston Server Premier', specs: '256GB (8x32GB) DDR5 4800MHz ECC内存', price: 8999, brand: 'kingston', category: 'ram', rgb: false, tags: ['工作站', 'ECC'] },
            { id: 'w-ram2', name: 'Micron DDR5 ECC', specs: '128GB (4x32GB) DDR5 5600MHz ECC内存', price: 5999, brand: 'micron', category: 'ram', rgb: false, tags: ['工作站', '服务器'] },
            
            // 存储
            { id: 'w-ssd1', name: 'Samsung PM1743', specs: '15.36TB NVMe PCIe 5.0 企业级SSD', price: 19999, brand: 'samsung', category: 'storage', rgb: false, tags: ['企业级', '高速'] },
            { id: 'w-ssd2', name: 'Intel D7-P5620', specs: '7.68TB NVMe PCIe 4.0 企业级SSD', price: 12999, brand: 'intel', category: 'storage', rgb: false, tags: ['企业级', '耐用'] },
            
            // 机箱
            { id: 'w-case1', name: 'Fractal Design Define 7 XL', specs: '静音全塔式工作站机箱', price: 1799, brand: 'fractal', category: 'case', rgb: false, tags: ['工作站', '静音'] },
            { id: 'w-case2', name: 'Cooler Master Cosmos C700M', specs: '全塔式旗舰工作站机箱', price: 2999, brand: 'coolermaster', category: 'case', rgb: true, tags: ['工作站', '模块化'] },
            
            // 显示器
            { id: 'w-mon1', name: 'Dell UltraSharp U3223QE', specs: '32寸 4K IPS 专业显示器', price: 6999, brand: 'dell', category: 'monitor', rgb: false, tags: ['专业', '色彩准确'] },
            { id: 'w-mon2', name: 'Apple Pro Display XDR', specs: '32寸 6K Retina 专业显示器', price: 39999, brand: 'apple', category: 'monitor', rgb: false, tags: ['专业', 'XDR'] }
        ],
        
        // 性价比硬件
        budget: [
            // CPU
            { id: 'b-cpu1', name: 'AMD Ryzen 5 7600X', specs: '6核心/12线程 4.7-5.3GHz', price: 1699, brand: 'amd', category: 'cpu', rgb: false, tags: ['性价比', '游戏'] },
            { id: 'b-cpu2', name: 'Intel Core i5-14600K', specs: '14核心/20线程 3.5-5.3GHz', price: 2299, brand: 'intel', category: 'cpu', rgb: false, tags: ['性价比', '全能'] },
            { id: 'b-cpu3', name: 'AMD Ryzen 5 5600G', specs: '6核心/12线程 3.9-4.4GHz 集成显卡', price: 999, brand: 'amd', category: 'cpu', rgb: false, tags: ['性价比', '核显'] },
            
            // 显卡
            { id: 'b-gpu1', name: 'NVIDIA RTX 4060 Ti', specs: '8GB GDDR6 性价比显卡', price: 3299, brand: 'nvidia', category: 'gpu', rgb: false, tags: ['性价比', '1080p游戏'] },
            { id: 'b-gpu2', name: 'AMD Radeon RX 7600', specs: '8GB GDDR6 性价比显卡', price: 2299, brand: 'amd', category: 'gpu', rgb: false, tags: ['性价比', '1080p游戏'] },
            { id: 'b-gpu3', name: 'NVIDIA RTX 3050', specs: '8GB GDDR6 入门显卡', price: 1899, brand: 'nvidia', category: 'gpu', rgb: false, tags: ['性价比', '入门'] },
            
            // 主板
            { id: 'b-mb1', name: 'ASUS PRIME H610M-K', specs: 'Intel H610 mATX 主板', price: 699, brand: 'asus', category: 'motherboard', rgb: false, tags: ['性价比', '入门'] },
            { id: 'b-mb2', name: 'GIGABYTE A520M DS3H', specs: 'AMD A520 mATX 主板', price: 599, brand: 'gigabyte', category: 'motherboard', rgb: false, tags: ['性价比', '入门'] },
            
            // 内存
            { id: 'b-ram1', name: 'Kingston FURY Beast DDR4', specs: '16GB (2x8GB) DDR4 3200MHz', price: 399, brand: 'kingston', category: 'ram', rgb: false, tags: ['性价比', 'DDR4'] },
            { id: 'b-ram2', name: 'TeamGroup Vulcan Z', specs: '16GB (2x8GB) DDR4 3600MHz', price: 349, brand: 'teamgroup', category: 'ram', rgb: false, tags: ['性价比', '高频'] },
            
            // 存储
            { id: 'b-ssd1', name: 'Crucial P3 Plus', specs: '1TB NVMe PCIe 4.0', price: 499, brand: 'crucial', category: 'storage', rgb: false, tags: ['性价比', '高速'] },
            { id: 'b-ssd2', name: 'WD Blue SN580', specs: '1TB NVMe PCIe 4.0', price: 529, brand: 'wd', category: 'storage', rgb: false, tags: ['性价比', '稳定'] },
            
            // 散热
            { id: 'b-cool1', name: 'ID-COOLING SE-224-XT', specs: '单塔风冷散热器', price: 199, brand: 'idcooling', category: 'cooling', rgb: false, tags: ['性价比', '静音'] },
            { id: 'b-cool2', name: 'Thermalright Assassin X', specs: '单塔风冷散热器', price: 149, brand: 'thermalright', category: 'cooling', rgb: false, tags: ['性价比', '高效'] },
            
            // 电源
            { id: 'b-psu1', name: 'Corsair CV650', specs: '650W 80 PLUS Bronze', price: 499, brand: 'corsair', category: 'psu', rgb: false, tags: ['性价比', '稳定'] },
            { id: 'b-psu2', name: 'EVGA 600 BR', specs: '600W 80 PLUS Bronze', price: 399, brand: 'evga', category: 'psu', rgb: false, tags: ['性价比', '入门'] },
            
            // 机箱
            { id: 'b-case1', name: 'Deepcool MATREXX 55', specs: '中塔式 ATX 机箱', price: 399, brand: 'deepcool', category: 'case', rgb: false, tags: ['性价比', '简约'] },
            { id: 'b-case2', name: 'Thermaltake Versa H18', specs: '紧凑型 mATX 机箱', price: 299, brand: 'thermaltake', category: 'case', rgb: false, tags: ['性价比', '紧凑'] }
        ],
        
        // RGB光效硬件
        rgb: [
            // 内存
            { id: 'r-ram1', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz RGB内存', price: 1099, brand: 'gskill', category: 'ram', rgb: true, tags: ['RGB', '同步'] },
            { id: 'r-ram2', name: 'CORSAIR Dominator Platinum RGB', specs: '32GB (2x16GB) DDR5 5600MHz RGB内存', price: 1299, brand: 'corsair', category: 'ram', rgb: true, tags: ['RGB', 'iCUE'] },
            { id: 'r-ram3', name: 'TeamGroup T-Force Delta RGB', specs: '16GB (2x8GB) DDR5 6000MHz RGB内存', price: 699, brand: 'teamgroup', category: 'ram', rgb: true, tags: ['RGB', 'ARGB'] },
            
            // 散热
            { id: 'r-cool1', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO RGB水冷', price: 1299, brand: 'nzxt', category: 'cooling', rgb: true, tags: ['RGB', 'LCD屏'] },
            { id: 'r-cool2', name: 'Corsair iCUE H150i ELITE LCD', specs: '360mm AIO LCD屏水
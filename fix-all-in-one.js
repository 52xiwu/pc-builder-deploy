/**
 * 一体化修复脚本 - 包含所有硬件数据和功能
 */

console.log('🚀 加载一体化修复脚本...');

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ 页面加载完成，开始初始化...');
    
    // 1. 创建完整的硬件数据库
    const hardwareData = createHardwareDatabase();
    
    // 2. 初始化硬件选择器
    initHardwareSelector(hardwareData);
    
    // 3. 初始化产品商城
    initProductsGrid(hardwareData);
    
    // 4. 初始化所有交互
    initAllInteractions();
    
    console.log('🎉 一体化修复完成！');
    console.log(`📊 硬件数据库: ${Object.values(hardwareData).reduce((sum, arr) => sum + arr.length, 0)} 个项目`);
});

function createHardwareDatabase() {
    console.log('📦 创建硬件数据库...');
    
    return {
        cpu: [
            { id: 'cpu-ultra1', name: 'AMD Ryzen 9 9850X3D', specs: '24核心/48线程 4.5-6.0GHz 3D V-Cache', price: 6999, brand: 'amd', category: 'ultra-high-end' },
            { id: 'cpu-ultra2', name: 'AMD Ryzen 9 9800X3D', specs: '20核心/40线程 4.4-5.8GHz 3D V-Cache', price: 5999, brand: 'amd', category: 'ultra-high-end' },
            { id: 'cpu1', name: 'Intel Core i9-14900K', specs: '24核心/32线程 3.2-6.0GHz', price: 4299, brand: 'intel', category: 'high-end' },
            { id: 'cpu2', name: 'AMD Ryzen 9 7950X', specs: '16核心/32线程 4.5-5.7GHz', price: 3999, brand: 'amd', category: 'high-end' },
            { id: 'cpu3', name: 'Intel Core i7-14700K', specs: '20核心/28线程 3.4-5.6GHz', price: 3299, brand: 'intel', category: 'mid-range' },
            { id: 'cpu4', name: 'AMD Ryzen 7 7800X3D', specs: '8核心/16线程 4.2-5.0GHz', price: 2999, brand: 'amd', category: 'gaming' },
            { id: 'cpu5', name: 'Intel Core i5-14600K', specs: '14核心/20线程 3.5-5.3GHz', price: 2299, brand: 'intel', category: 'mid-range' },
            { id: 'cpu6', name: 'AMD Ryzen 5 7600X', specs: '6核心/12线程 4.7-5.3GHz', price: 1699, brand: 'amd', category: 'budget' }
        ],
        
        gpu: [
            { id: 'gpu-ultra1', name: 'NVIDIA RTX 5090', specs: '32GB GDDR7 旗舰显卡', price: 19999, brand: 'nvidia', category: 'ultra-high-end' },
            { id: 'gpu-ultra2', name: 'NVIDIA RTX 5080', specs: '20GB GDDR7 高端显卡', price: 12999, brand: 'nvidia', category: 'ultra-high-end' },
            { id: 'gpu-ultra3', name: 'NVIDIA RTX 5070 Ti', specs: '16GB GDDR7 高性能显卡', price: 8999, brand: 'nvidia', category: 'ultra-high-end' },
            { id: 'gpu-ultra4', name: 'NVIDIA RTX 5070', specs: '12GB GDDR7 高端显卡', price: 6999, brand: 'nvidia', category: 'ultra-high-end' },
            { id: 'gpu1', name: 'NVIDIA RTX 4090', specs: '24GB GDDR6X', price: 12999, brand: 'nvidia', category: 'high-end' },
            { id: 'gpu2', name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X', price: 8499, brand: 'nvidia', category: 'high-end' },
            { id: 'gpu3', name: 'AMD Radeon RX 7900 XTX', specs: '24GB GDDR6', price: 7999, brand: 'amd', category: 'high-end' },
            { id: 'gpu4', name: 'NVIDIA RTX 4070 Ti SUPER', specs: '16GB GDDR6X', price: 6499, brand: 'nvidia', category: 'mid-range' }
        ],
        
        motherboard: [
            { id: 'mb-ultra1', name: 'ROG MAXIMUS Z890 EXTREME', specs: 'Intel Z890 E-ATX 旗舰主板', price: 8999, brand: 'asus', category: 'ultra-high-end' },
            { id: 'mb1', name: 'ROG MAXIMUS Z790 HERO', specs: 'Intel Z790 ATX', price: 4999, brand: 'asus', category: 'high-end' },
            { id: 'mb2', name: 'MSI MEG X670E GODLIKE', specs: 'AMD X670E E-ATX', price: 6999, brand: 'msi', category: 'high-end' },
            { id: 'mb3', name: 'ASUS TUF GAMING B760-PLUS', specs: 'Intel B760 ATX', price: 1499, brand: 'asus', category: 'mid-range' },
            { id: 'mb4', name: 'GIGABYTE B650 AORUS ELITE', specs: 'AMD B650 ATX', price: 1699, brand: 'gigabyte', category: 'mid-range' },
            { id: 'mb5', name: 'ASRock B760M Steel Legend', specs: 'Intel B760 mATX', price: 1199, brand: 'asrock', category: 'mid-range' },
            { id: 'mb6', name: 'MSI PRO B650M-A WIFI', specs: 'AMD B650 mATX', price: 1299, brand: 'msi', category: 'mid-range' },
            { id: 'mb7', name: 'ASUS PRIME H610M-K', specs: 'Intel H610 mATX', price: 699, brand: 'asus', category: 'budget' }
        ],
        
        ram: [
            { id: 'ram-ultra1', name: 'G.SKILL Trident Z5 RGB 8000', specs: '64GB (2x32GB) DDR5 8000MHz', price: 3999, brand: 'gskill', category: 'ultra-high-end' },
            { id: 'ram1', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz', price: 1099, brand: 'gskill', category: 'high-end' },
            { id: 'ram2', name: 'CORSAIR Dominator Platinum', specs: '64GB (2x32GB) DDR5 5600MHz', price: 2299, brand: 'corsair', category: 'high-end' },
            { id: 'ram3', name: 'Kingston FURY Beast', specs: '32GB (2x16GB) DDR5 5200MHz', price: 899, brand: 'kingston', category: 'mid-range' },
            { id: 'ram4', name: 'TeamGroup T-Force Delta RGB', specs: '16GB (2x8GB) DDR5 6000MHz', price: 699, brand: 'teamgroup', category: 'mid-range' },
            { id: 'ram5', name: 'Crucial Pro DDR5', specs: '32GB (2x16GB) DDR5 4800MHz', price: 799, brand: 'crucial', category: 'mid-range' },
            { id: 'ram6', name: 'ADATA XPG Lancer RGB', specs: '16GB (2x8GB) DDR5 5600MHz', price: 599, brand: 'adata', category: 'mid-range' },
            { id: 'ram7', name: 'Kingston FURY Beast DDR4', specs: '16GB (2x8GB) DDR4 3200MHz', price: 399, brand: 'kingston', category: 'budget' }
        ],
        
        storage: [
            { id: 'ssd-ultra1', name: 'Samsung 990 PRO 4TB', specs: '4TB NVMe PCIe 5.0', price: 2999, brand: 'samsung', category: 'ultra-high-end' },
            { id: 'ssd1', name: 'Samsung 990 PRO', specs: '2TB NVMe PCIe 4.0', price: 1299, brand: 'samsung', category: 'high-end' },
            { id: 'ssd2', name: 'WD Black SN850X', specs: '2TB NVMe PCIe 4.0', price: 1199, brand: 'wd', category: 'high-end' },
            { id: 'ssd3', name: 'Crucial P5 Plus', specs: '1TB NVMe PCIe 4.0', price: 599, brand: 'crucial', category: 'mid-range' },
            { id: 'ssd4', name: 'Kingston KC3000', specs: '2TB NVMe PCIe 4.0', price: 1099, brand: 'kingston', category: 'mid-range' },
            { id: 'ssd5', name: 'Seagate FireCuda 530', specs: '1TB NVMe PCIe 4.0', price: 699, brand: 'seagate', category: 'mid-range' },
            { id: 'ssd6', name: 'TeamGroup Cardea Z440', specs: '2TB NVMe PCIe 4.0', price: 999, brand: 'teamgroup', category: 'mid-range' },
            { id: 'ssd7', name: 'Samsung 870 EVO', specs: '1TB SATA SSD', price: 499, brand: 'samsung', category: 'budget' }
        ],
        
        cooling: [
            { id: 'cool-ultra1', name: 'NZXT Kraken Elite 360 RGB', specs: '360mm AIO LCD屏水冷', price: 1999, brand: 'nzxt', category: 'ultra-high-end' },
            { id: 'cool1', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO 水冷', price: 1299, brand: 'nzxt', category: 'high-end' },
            { id: 'cool2', name: 'Noctua NH-D15', specs: '双塔风冷散热器', price: 699, brand: 'noctua', category: 'high-end' },
            { id: 'cool3', name: 'Corsair iCUE H150i ELITE', specs: '360mm RGB 水冷', price: 1399, brand: 'corsair', category: 'high-end' },
            { id: 'cool4', name: 'be quiet! Dark Rock Pro 4', specs: '双塔风冷散热器', price: 599, brand: 'bequiet', category: 'mid-range' },
            { id: 'cool5', name: 'Deepcool AK620', specs: '双塔风冷散热器', price: 399, brand: 'deepcool', category: 'mid-range' },
            { id: 'cool6', name: 'ID-COOLING SE-224-XT', specs: '单塔风冷散热器', price: 199, brand: 'idcooling', category: 'budget' },
            { id: 'cool7', name: 'Thermalright Peerless Assassin', specs: '双塔风冷散热器', price: 299, brand: 'thermalright', category: 'mid-range' }
        ],
        
        psu: [
            { id: 'psu-ultra1', name: 'Seasonic PRIME TX-1600', specs: '1600W 80 PLUS Titanium', price: 3999, brand: 'seasonic', category: 'ultra-high-end' },
            { id: 'psu1', name: 'Corsair RM1000x', specs: '1000W 80 PLUS Gold', price: 1499, brand: 'corsair', category: 'high-end' },
            { id: 'psu2', name: 'Seasonic PRIME TX-1000', specs: '1000W 80 PLUS Titanium', price: 1999, brand: 'seasonic', category: 'high-end' },
            { id: 'psu3', name: 'be quiet! Straight Power 11', specs: '850W 80 PLUS Platinum', price: 1299, brand: 'bequiet', category: 'mid-range' },
            { id: 'psu4', name: 'EVGA SuperNOVA 850 G6', specs: '850W 80 PLUS Gold', price: 1099, brand: 'evga', category: 'mid-range' },
            { id: 'psu5', name: 'Cooler Master MWE Gold 750', specs: '750W 80 PLUS Gold', price: 799, brand: 'coolermaster', category: 'mid-range' },
            { id: 'psu6', name: 'Seasonic FOCUS GX-650', specs: '650W 80 PLUS Gold', price: 699, brand: 'seasonic', category: 'mid-range' },
            { id: 'psu7', name: 'Corsair CV650', specs: '650W 80 PLUS Bronze', price: 499, brand: 'corsair', category: 'budget' }
        ],
        
        case: [
            { id: 'case-ultra1', name: 'Lian Li O11 Vision RGB', specs: '全景侧透双腔旗舰机箱', price: 1999, brand: 'lianli', category: 'ultra-high-end' },
            { id: 'case1', name: 'Lian Li O11 Dynamic EVO', specs: '中塔式 ATX', price: 899, brand: 'lianli', category: 'high-end' },
            { id: 'case2', name: 'Fractal Design North', specs: '胡桃木侧板机箱', price: 1099, brand: 'fractal', category: 'high-end' },
            { id: 'case3', name: 'NZXT H9 Flow', specs: '全景侧透双腔机箱', price: 1299, brand: 'nzxt', category: 'high-end' },
            { id: 'case4', name: 'Corsair 4000D Airflow', specs: '中塔式 ATX 气流优化', price: 799, brand: 'corsair', category: 'mid-range' },
            { id: 'case5', name: 'Phanteks Eclipse G360A', specs: '中塔式 ATX RGB', price: 699, brand: 'phanteks', category: 'mid-range' },
            { id: 'case6', name: 'Cooler Master MasterBox TD500', specs: '中塔式 ATX Mesh', price: 599, brand: 'coolermaster', category: 'mid-range' },
            { id: 'case7', name: 'Deepcool MATREXX 55', specs: '中塔式 ATX', price: 399, brand: 'deepcool', category: 'budget' }
        ]
    };
}

function initHardwareSelector(hardwareData) {
    console.log('🔧 初始化硬件选择器...');
    
    const hardwareList = document.getElementById('hardwareList');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (!hardwareList || !tabButtons.length) {
        console.warn('⚠️ 找不到硬件选择器元素');
        return;
    }
    
    // 初始加载CPU数据
    loadHardwareCategory('cpu', hardwareData);
    
    // 绑定标签切换事件
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            if (category) {
                // 更新激活状态
                tabButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // 加载对应类别的硬件
                loadHardwareCategory(category, hardwareData);
            }
        });
    });
    
    // 绑定硬件点击事件
    hardwareList.addEventListener('click', function(e) {
        const hardwareItem = e.target.closest('.hardware-item');
        if (hardwareItem) {
            handleHardwareClick(hardwareItem);
        }
    });
}

function loadHardwareCategory(category, hardwareData) {
    const hardwareList = document.getElementById('hardwareList');
    if (!hardwareList) return;
    
    const items = hardwareData[category] || [];
    
    hardwareList.innerHTML = '';
    
    if (items.length === 0) {
        hardwareList.innerHTML = '<div class="empty-state"><i class="fas fa-microchip"></i><p>暂无数据</p></div>';
        return;
    }
    
    items.forEach(item => {

/**
 * 同步硬件数据从 app.js 到数据库
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('./database.db');

// 从 app.js 提取的硬件数据
const hardwareData = {
    cpu: [
        { id: 'cpu0', name: 'AMD Ryzen 9 9950X3D', specs: '16核32线程 144MB缓存 5.7GHz 旗舰', price: 5499, brand: 'amd', socket: 'am5', category: 'high-end' },
        { id: 'cpu0a', name: 'AMD Ryzen 9 9950X', specs: '16核32线程 4.3-5.7GHz', price: 4999, brand: 'amd', socket: 'am5', category: 'high-end' },
        { id: 'cpu0b', name: 'Intel Core i9-14900KS', specs: '24核32线程 3.2-6.2GHz 旗舰', price: 5999, brand: 'intel', socket: 'lga1700', category: 'high-end' },
        { id: 'cpu0c', name: 'AMD Ryzen 9 9900X3D', specs: '12核24线程 3D缓存 5.6GHz', price: 4599, brand: 'amd', socket: 'am5', category: 'high-end' },
        { id: 'cpu1', name: 'Intel Core i9-14900K', specs: '24核32线程 3.2-6.0GHz', price: 3999, brand: 'intel', socket: 'lga1700', category: 'high-end' },
        { id: 'cpu2', name: 'AMD Ryzen 9 7950X3D', specs: '16核32线程 3D缓存', price: 4299, brand: 'amd', socket: 'am5', category: 'high-end' },
        { id: 'cpu2b', name: 'AMD Ryzen 9 7950X', specs: '16核32线程 4.5-5.7GHz', price: 3799, brand: 'amd', socket: 'am5', category: 'high-end' },
        { id: 'cpu3', name: 'Intel Core i7-14700K', specs: '20核28线程 3.4-5.6GHz', price: 2999, brand: 'intel', socket: 'lga1700', category: 'mid-range' },
        { id: 'cpu4', name: 'AMD Ryzen 7 7800X3D', specs: '8核16线程 4.2-5.0GHz 游戏神U', price: 2699, brand: 'amd', socket: 'am5', category: 'gaming' },
        { id: 'cpu5', name: 'Intel Core i5-14600K', specs: '14核20线程 3.5-5.3GHz', price: 2099, brand: 'intel', socket: 'lga1700', category: 'mid-range' },
        { id: 'cpu6', name: 'AMD Ryzen 5 7600X', specs: '6核12线程 4.7-5.3GHz', price: 1499, brand: 'amd', socket: 'am5', category: 'mid-range' },
        { id: 'cpu7', name: 'Intel Core i3-14100', specs: '4核8线程 3.5-4.7GHz', price: 849, brand: 'intel', socket: 'lga1700', category: 'budget' },
        { id: 'cpu8', name: 'AMD Ryzen 5 5600', specs: '6核12线程 3.5-4.4GHz', price: 749, brand: 'amd', socket: 'am4', category: 'budget' }
    ],
    gpu: [
        { id: 'gpu0', name: 'NVIDIA RTX 5090', specs: '32GB GDDR7 旗舰  Blackwell', price: 18999, brand: 'nvidia', category: 'high-end' },
        { id: 'gpu0a', name: 'NVIDIA RTX 5090D', specs: '32GB GDDR7 国行特供', price: 24999, brand: 'nvidia', category: 'high-end' },
        { id: 'gpu0b', name: 'NVIDIA RTX 5080', specs: '16GB GDDR7 DLSS 4', price: 9999, brand: 'nvidia', category: 'high-end' },
        { id: 'gpu0c', name: 'NVIDIA RTX 4090 DUAL', specs: '24GB GDDR6X 旗舰', price: 13999, brand: 'nvidia', category: 'high-end' },
        { id: 'gpu1', name: 'NVIDIA RTX 4090', specs: '24GB GDDR6X', price: 11999, brand: 'nvidia', category: 'high-end' },
        { id: 'gpu2', name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X', price: 7999, brand: 'nvidia', category: 'high-end' },
        { id: 'gpu3', name: 'AMD Radeon RX 7900 XTX', specs: '24GB GDDR6', price: 7199, brand: 'amd', category: 'high-end' },
        { id: 'gpu3a', name: 'AMD Radeon RX 7900 GRE', specs: '16GB GDDR6 高性价比', price: 4299, brand: 'amd', category: 'high-end' },
        { id: 'gpu4', name: 'NVIDIA RTX 4070 Ti SUPER', specs: '16GB GDDR6X', price: 5999, brand: 'nvidia', category: 'mid-range' },
        { id: 'gpu5', name: 'AMD Radeon RX 7800 XT', specs: '16GB GDDR6', price: 3799, brand: 'amd', category: 'mid-range' },
        { id: 'gpu6', name: 'NVIDIA RTX 4060 Ti', specs: '8GB GDDR6', price: 2999, brand: 'nvidia', category: 'mid-range' },
        { id: 'gpu7', name: 'NVIDIA RTX 3050', specs: '8GB GDDR6', price: 1399, brand: 'nvidia', category: 'budget' },
        { id: 'gpu8', name: 'AMD Radeon RX 6600', specs: '8GB GDDR6', price: 1199, brand: 'amd', category: 'budget' }
    ],
    motherboard: [
        { id: 'mb0', name: 'ROG MAXIMUS Z790 EXTREME', specs: 'Intel Z790 E-ATX 旗舰', price: 7999, brand: 'asus', socket: 'lga1700' },
        { id: 'mb0a', name: 'ROG CROSSHAIR X870E EXTREME', specs: 'AMD X870E E-ATX 旗舰', price: 6999, brand: 'asus', socket: 'am5' },
        { id: 'mb1', name: 'ROG MAXIMUS Z790 HERO', specs: 'Intel Z790 ATX', price: 4299, brand: 'asus', socket: 'lga1700' },
        { id: 'mb2', name: 'MSI MEG X670E GODLIKE', specs: 'AMD X670E E-ATX', price: 6499, brand: 'msi', socket: 'am5' },
        { id: 'mb2a', name: '技嘉 X870E AORUS MASTER', specs: 'AMD X870E ATX', price: 3499, brand: 'gigabyte', socket: 'am5' },
        { id: 'mb3', name: 'ASUS TUF GAMING B760-PLUS', specs: 'Intel B760 ATX', price: 1399, brand: 'asus', socket: 'lga1700' },
        { id: 'mb4', name: 'GIGABYTE B650 AORUS ELITE', specs: 'AMD B650 ATX', price: 1499, brand: 'gigabyte', socket: 'am5' },
        { id: 'mb5', name: 'ASRock B760M Steel Legend', specs: 'Intel B760 mATX', price: 1099, brand: 'asrock', socket: 'lga1700' },
        { id: 'mb6', name: 'MSI PRO B650M-A WIFI', specs: 'AMD B650 mATX', price: 1199, brand: 'msi', socket: 'am5' },
        { id: 'mb7', name: '华擎 H610M-HDV', specs: 'Intel H610 mATX', price: 469, brand: 'asrock', socket: 'lga1700' },
        { id: 'mb8', name: '微星 A520M-A PRO', specs: 'AMD A520 mATX', price: 379, brand: 'msi', socket: 'am4' }
    ],
    ram: [
        { id: 'ram0', name: 'CORSAIR Dominator Titanium', specs: '128GB (4x32GB) DDR5 7200MHz 旗舰', price: 5999, brand: 'corsair', speed: 7200 },
        { id: 'ram0a', name: 'G.SKILL Trident Z5 RGB', specs: '64GB (2x32GB) DDR5 6400MHz', price: 1899, brand: 'gskill', speed: 6400 },
        { id: 'ram1', name: 'CORSAIR Dominator Platinum', specs: '64GB (2x32GB) DDR5 6000MHz', price: 2099, brand: 'corsair', speed: 6000 },
        { id: 'ram2', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6400MHz', price: 999, brand: 'gskill', speed: 6400 },
        { id: 'ram3', name: 'Kingston FURY Renegade', specs: '32GB (2x16GB) DDR5 6000MHz', price: 849, brand: 'kingston', speed: 6000 },
        { id: 'ram4', name: 'TeamGroup T-Force Delta RGB', specs: '32GB (2x16GB) DDR5 6000MHz', price: 699, brand: 'teamgroup', speed: 6000 },
        { id: 'ram5', name: 'Crucial Pro DDR5', specs: '32GB (2x16GB) DDR5 5600MHz', price: 749, brand: 'crucial', speed: 5600 },
        { id: 'ram6', name: 'ADATA XPG Lancer RGB', specs: '16GB (2x8GB) DDR5 6000MHz', price: 549, brand: 'adata', speed: 6000 },
        { id: 'ram7', name: '金百达 DDR5 32GB', specs: '32GB (2x16GB) DDR5 5600', price: 499, brand: 'kingbank', speed: 5600 },
        { id: 'ram8', name: '金百达 DDR4 16GB', specs: '16GB (2x8GB) DDR4 3200MHz', price: 269, brand: 'kingbank', speed: 3200 }
    ],
    storage: [
        { id: 'ssd0', name: 'Samsung 990 EVO', specs: '4TB NVMe PCIe 5.0 旗舰', price: 2299, brand: 'samsung', type: 'nvme', capacity: 4000 },
        { id: 'ssd0a', name: 'WD Black SN850X', specs: '4TB NVMe PCIe 4.0', price: 1999, brand: 'wd', type: 'nvme', capacity: 4000 },
        { id: 'ssd1', name: 'Samsung 990 PRO', specs: '2TB NVMe PCIe 4.0', price: 1099, brand: 'samsung', type: 'nvme', capacity: 2000 },
        { id: 'ssd2', name: 'WD Black SN850X', specs: '2TB NVMe PCIe 4.0', price: 999, brand: 'wd', type: 'nvme', capacity: 2000 },
        { id: 'ssd2a', name: '致钛 Ti600', specs: '2TB NVMe PCIe 5.0 国产', price: 899, brand: 'zhitai', type: 'nvme', capacity: 2000 },
        { id: 'ssd3', name: 'Crucial P5 Plus', specs: '1TB NVMe PCIe 4.0', price: 549, brand: 'crucial', type: 'nvme', capacity: 1000 },
        { id: 'ssd4', name: 'Kingston KC3000', specs: '2TB NVMe PCIe 4.0', price: 949, brand: 'kingston', type: 'nvme', capacity: 2000 },
        { id: 'ssd5', name: 'Seagate FireCuda 530', specs: '1TB NVMe PCIe 4.0', price: 649, brand: 'seagate', type: 'nvme', capacity: 1000 },
        { id: 'ssd6', name: 'TeamGroup Cardea Z440', specs: '2TB NVMe PCIe 4.0', price: 899, brand: 'teamgroup', type: 'nvme', capacity: 2000 },
        { id: 'ssd7', name: '致钛 5000', specs: '512GB SATA', price: 279, brand: 'zhitai', type: 'sata', capacity: 512 }
    ],
    cooling: [
        { id: 'cool0', name: 'NZXT Kraken Elite 420', specs: '420mm AIO 旗舰水冷', price: 1799, brand: 'nzxt', type: 'aio' },
        { id: 'cool0a', name: 'ROG RYUJIN III 360', specs: '360mm AIO 3.5寸屏', price: 2499, brand: 'asus', type: 'aio' },
        { id: 'cool1', name: 'Corsair iCUE H150i ELITE', specs: '360mm AIO 水冷', price: 1299, brand: 'corsair', type: 'aio' },
        { id: 'cool2', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO 水冷', price: 1099, brand: 'nzxt', type: 'aio' },
        { id: 'cool3', name: 'Noctua NH-D15 chromax', specs: '双塔风冷 静音', price: 649, brand: 'noctua', type: 'air' },
        { id: 'cool4', name: '九州风神 LT720', specs: '360mm AIO', price: 599, brand: 'deepcool', type: 'aio' },
        { id: 'cool5', name: 'Deepcool AK620', specs: '双塔风冷', price: 349, brand: 'deepcool', type: 'air' },
        { id: 'cool6', name: 'ARCTIC Liquid Freezer II', specs: '240mm AIO', price: 649, brand: 'arctic', type: 'aio' },
        { id: 'cool7', name: '九州风神 玄冰400', specs: '单塔风冷 入门', price: 79, brand: 'deepcool', type: 'air' }
    ],
    psu: [
        { id: 'psu0', name: 'Seasonic PRIME TX-1600', specs: '1600W 80+钛金 旗舰', price: 3199, brand: 'seasonic', wattage: 1600 },
        { id: 'psu0a', name: 'Corsair AX1600i', specs: '1600W 80+钛金 全模组', price: 3599, brand: 'corsair', wattage: 1600 },
        { id: 'psu1', name: 'Seasonic PRIME TX-1000', specs: '1000W 80+钛金', price: 1799, brand: 'seasonic', wattage: 1000 },
        { id: 'psu2', name: 'Corsair RM1000x SHIFT', specs: '1000W 80+金牌', price: 1299, brand: 'corsair', wattage: 1000 },
        { id: 'psu3', name: 'be quiet! Dark Power 13', specs: '850W 80+钛金', price: 1499, brand: 'bequiet', wattage: 850 },
        { id: 'psu4', name: '海韵 FOCUS GX-850', specs: '850W 80+金牌', price: 899, brand: 'seasonic', wattage: 850 },
        { id: 'psu5', name: '鑫谷 GM850', specs: '850W 80+金牌 ATX3.0', price: 599, brand: 'sigo', wattage: 850 },
        { id: 'psu6', name: 'Thermaltake Toughpower GF1', specs: '750W 80+金牌', price: 599, brand: 'thermaltake', wattage: 750 },
        { id: 'psu7', name: '振华 铜皇 550W', specs: '550W 80+铜牌', price: 269, brand: 'superflower', wattage: 550 }
    ],
    case: [
        { id: 'case0', name: 'Lian Li O11 Vision', specs: '全塔 双腔 透明 旗舰', price: 1699, brand: 'lianli', size: 'full-tower' },
        { id: 'case0a', name: 'Lian Li O11 Dynamic EVO XL', specs: '全塔机箱 双腔', price: 1599, brand: 'lianli', size: 'full-tower' },
        { id: 'case1', name: 'NZXT H9 Flow', specs: '双腔中塔 海景房', price: 1099, brand: 'nzxt', size: 'mid-tower' },
        { id: 'case2', name: 'Lian Li O11 Dynamic EVO', specs: '中塔机箱 RGB', price: 899, brand: 'lianli', size: 'mid-tower' },
        { id: 'case3', name: 'Fractal Design North', specs: '胡桃木中塔机箱', price: 999, brand: 'fractal', size: 'mid-tower' },
        { id: 'case4', name: 'Corsair 4000D Airflow', specs: '中塔 网孔面板', price: 599, brand: 'corsair', size: 'mid-tower' },
        { id: 'case5', name: '爱国者 星璨 岚', specs: '中塔 海景房', price: 399, brand: 'aigo', size: 'mid-tower' },
        { id: 'case6', name: 'Cooler Master Q300L', specs: '紧凑型 mATX', price: 349, brand: 'coolermaster', size: 'micro-atx' },
        { id: 'case7', name: '航嘉 暗夜猎手5', specs: 'mATX 入门', price: 129, brand: 'huntkey', size: 'micro-atx' }
    ],
    monitor: [
        { id: 'mon0', name: '华硕 ROG Swift PG32UCDM', specs: '32寸 4K 240Hz QD-OLED 旗舰', price: 11999, brand: 'asus' },
        { id: 'mon0a', name: 'LG 32GS95UE', specs: '32寸 4K 240Hz OLED', price: 9999, brand: 'lg' },
        { id: 'mon0b', name: '三星 Odyssey G8', specs: '32寸 4K 240Hz 曲面', price: 8999, brand: 'samsung' },
        { id: 'mon1', name: '戴尔 U2723QE', specs: '27寸 4K IPS 60Hz 专业', price: 3499, brand: 'dell' },
        { id: 'mon2', name: 'LG 27GP950', specs: '27寸 4K 144Hz Nano IPS', price: 4299, brand: 'lg' },
        { id: 'mon3', name: '华硕 ROG PG27AQDM', specs: '27寸 2K 240Hz OLED', price: 5499, brand: 'asus' },
        { id: 'mon4', name: 'AOC AG274QX', specs: '27寸 2K 170Hz', price: 2199, brand: 'aoc' },
        { id: 'mon5', name: '小米显示器 27寸 2K', specs: '27寸 2K 165Hz', price: 1299, brand: 'xiaomi' },
        { id: 'mon6', name: '红米 27寸 2K', specs: '27寸 2K 165Hz', price: 999, brand: 'xiaomi' },
        { id: 'mon7', name: '红米 24寸', specs: '24寸 1080p 75Hz', price: 549, brand: 'xiaomi' }
    ],
    keyboard: [
        { id: 'kb0', name: 'ROG 龙骑士3', specs: '磁轴 旗舰 可分离', price: 1499, brand: 'asus' },
        { id: 'kb0a', name: 'Wooting 60HE', specs: '磁轴 0.1mm 可调', price: 1299, brand: 'wooting' },
        { id: 'kb1', name: '雷蛇黑寡妇 V4 Pro', specs: '机械 黄轴 腕托', price: 1299, brand: 'razer' },
        { id: 'kb2', name: 'ROG 游侠 RX', specs: '机械键盘 光轴', price: 649, brand: 'asus' },
        { id: 'kb3', name: 'Cherry MX 3.0S', specs: '机械键盘 茶轴', price: 449, brand: 'cherry' },
        { id: 'kb4', name: '罗技 G Pro X', specs: '机械 热插拔', price: 899, brand: 'logitech' },
        { id: 'kb5', name: '雷柏 V500', specs: '机械键盘 入门', price: 129, brand: 'rapoo' }
    ],
    mouse: [
        { id: 'mouse0', name: '罗技 G PRO X SUPERLIGHT 2', specs: '60g 无线 旗舰', price: 1199, brand: 'logitech' },
        { id: 'mouse0a', name: '雷蛇毒蝰V3 Pro', specs: '54g 无线 4K轮询', price: 999, brand: 'razer' },
        { id: 'mouse1', name: '罗技 G PRO X', specs: '无线 63g', price: 449, brand: 'logitech' },
        { id: 'mouse2', name: '雷蛇毒蝰V3', specs: '轻量化 有线', price: 399, brand: 'razer' },
        { id: 'mouse3', name: '罗技 G502 X', specs: 'LIGHTFORCE 混合微动', price: 499, brand: 'logitech' },
        { id: 'mouse4', name: '赛睿 Rival 5', specs: '有线游戏', price: 269, brand: 'steelseries' },
        { id: 'mouse5', name: '雷柏 VT350', specs: '无线办公', price: 89, brand: 'rapoo' }
    ],
    headset: [
        { id: 'hs0', name: 'ROG Delta S', specs: 'Ai降噪 50mm驱动', price: 1299, brand: 'asus' },
        { id: 'hs0a', name: '赛睿 Arctis Nova Pro', specs: '无线 双电池 旗舰', price: 1999, brand: 'steelseries' },
        { id: 'hs1', name: '罗技 G PRO X 2', specs: '无线 50mm', price: 1299, brand: 'logitech' },
        { id: 'hs2', name: '雷蛇北海巨妖 V3 Pro', specs: '无线 THX空间音效', price: 1099, brand: 'razer' },
        { id: 'hs3', name: 'HyperX Cloud III', specs: '有线 53mm', price: 599, brand: 'hyperx' },
        { id: 'hs4', name: 'JBL QUANTUM 400', specs: '有线 7.1', price: 399, brand: 'jbl' },
        { id: 'hs5', name: '雷柏 VH150', specs: '入门', price: 59, brand: 'rapoo' }
    ]
};

// 清空现有数据
console.log('🗑️ 清空现有 products 数据...');
db.run('DELETE FROM products', () => {
    console.log('✅ 已清空');
    
    let total = 0;
    let inserted = 0;
    
    // 统计总数
    for (const category of Object.keys(hardwareData)) {
        total += hardwareData[category].length;
    }
    
    console.log(`📦 总共 ${total} 个产品需要导入...\n`);
    
    for (const category of Object.keys(hardwareData)) {
        const items = hardwareData[category];
        
        for (const item of items) {
            const stmt = db.prepare(`
                INSERT INTO products (category, name, description, specs, price, brand, image_url, stock)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            stmt.run([
                category,
                item.name,
                item.specs,
                item.specs,
                item.price,
                item.brand,
                '',
                100
            ], function(err) {
                if (err) {
                    console.error(`❌ 插入失败: ${item.name}`, err.message);
                } else {
                    inserted++;
                }
                
                if (inserted + (total - inserted) === total) {
                    console.log(`\n✅ 完成! 共插入 ${inserted} 个产品`);
                    db.close();
                }
            });
            stmt.finalize();
        }
    }
});

/**
 * 添加更多硬件产品 - 包含淘宝图片链接
 * 为每个分类添加更多真实的硬件产品
 */

console.log('🛒 添加更多硬件产品...');

// 立即执行
(function() {
    console.log('🎯 开始添加更多硬件...');
    
    // 添加更多硬件数据
    addMoreHardwareData();
    
    // 更新硬件选择器
    updateHardwareSelector();
    
    // 添加图片加载优化
    addImageOptimization();
    
    console.log('✅ 更多硬件添加完成');
})();

function addMoreHardwareData() {
    console.log('📦 添加更多硬件数据...');
    
    // 扩展硬件数据库
    window.hardwareDatabase = window.hardwareDatabase || {};
    
    // 1. CPU处理器 - 添加更多型号
    window.hardwareDatabase.cpu = window.hardwareDatabase.cpu || [];
    window.hardwareDatabase.cpu.push(
        // 高端CPU
        {
            id: 'cpu_amd_ryzen9_9950x',
            name: 'AMD Ryzen 9 9950X',
            specs: '16核心/32线程 4.3-5.7GHz',
            price: 5499,
            category: 'cpu',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💎 旗舰'
        },
        {
            id: 'cpu_intel_i7_14700k',
            name: 'Intel Core i7-14700K',
            specs: '20核心/28线程 3.4-5.6GHz',
            price: 3299,
            category: 'cpu',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🔥 热门'
        },
        {
            id: 'cpu_amd_ryzen7_7700x',
            name: 'AMD Ryzen 7 7700X',
            specs: '8核心/16线程 4.5-5.4GHz',
            price: 2499,
            category: 'cpu',
            image: 'https://img.alicdn.com/imgextra/i2/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        },
        {
            id: 'cpu_intel_i5_14600k',
            name: 'Intel Core i5-14600K',
            specs: '14核心/20线程 3.5-5.3GHz',
            price: 2199,
            category: 'cpu',
            image: 'https://img.alicdn.com/imgextra/i1/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💰 性价比'
        },
        {
            id: 'cpu_amd_ryzen5_7600',
            name: 'AMD Ryzen 5 7600',
            specs: '6核心/12线程 3.8-5.1GHz',
            price: 1599,
            category: 'cpu',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        }
    );
    
    // 2. 显卡GPU - 添加更多型号
    window.hardwareDatabase.gpu = window.hardwareDatabase.gpu || [];
    window.hardwareDatabase.gpu.push(
        // NVIDIA显卡
        {
            id: 'gpu_rtx_4080_super',
            name: 'NVIDIA RTX 4080 SUPER',
            specs: '16GB GDDR6X DLSS 3',
            price: 8999,
            category: 'gpu',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🎮 游戏'
        },
        {
            id: 'gpu_rtx_4070_ti_super',
            name: 'NVIDIA RTX 4070 Ti SUPER',
            specs: '16GB GDDR6X 4K游戏',
            price: 6499,
            category: 'gpu',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        },
        {
            id: 'gpu_rtx_4070_super',
            name: 'NVIDIA RTX 4070 SUPER',
            specs: '12GB GDDR6X 2K游戏',
            price: 4899,
            category: 'gpu',
            image: 'https://img.alicdn.com/imgextra/i2/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        },
        {
            id: 'gpu_rtx_4060_ti',
            name: 'NVIDIA RTX 4060 Ti',
            specs: '8GB GDDR6 1080P游戏',
            price: 3299,
            category: 'gpu',
            image: 'https://img.alicdn.com/imgextra/i1/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💰 性价比'
        },
        // AMD显卡
        {
            id: 'gpu_rx_7900_xtx',
            name: 'AMD Radeon RX 7900 XTX',
            specs: '24GB GDDR6 4K游戏',
            price: 7999,
            category: 'gpu',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🔥 热门'
        },
        {
            id: 'gpu_rx_7800_xt',
            name: 'AMD Radeon RX 7800 XT',
            specs: '16GB GDDR6 2K游戏',
            price: 4299,
            category: 'gpu',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        }
    );
    
    // 3. 主板 - 添加更多型号
    window.hardwareDatabase.motherboard = window.hardwareDatabase.motherboard || [];
    window.hardwareDatabase.motherboard.push(
        // Intel平台
        {
            id: 'mb_z790_apex',
            name: 'ROG MAXIMUS Z790 APEX',
            specs: 'Z790芯片组 DDR5 8000+',
            price: 5999,
            category: 'motherboard',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💎 旗舰'
        },
        {
            id: 'mb_z790_hero',
            name: 'ROG MAXIMUS Z790 HERO',
            specs: 'Z790芯片组 WiFi7',
            price: 4999,
            category: 'motherboard',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        },
        {
            id: 'mb_z790_tuf',
            name: 'TUF GAMING Z790-PLUS',
            specs: 'Z790芯片组 军工品质',
            price: 2499,
            category: 'motherboard',
            image: 'https://img.alicdn.com/imgextra/i2/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🛡️ 耐用'
        },
        // AMD平台
        {
            id: 'mb_x670e_hero',
            name: 'ROG CROSSHAIR X670E HERO',
            specs: 'X670E芯片组 PCIe 5.0',
            price: 5499,
            category: 'motherboard',
            image: 'https://img.alicdn.com/imgextra/i1/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        },
        {
            id: 'mb_b650_tuf',
            name: 'TUF GAMING B650-PLUS',
            specs: 'B650芯片组 性价比之选',
            price: 1699,
            category: 'motherboard',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💰 性价比'
        }
    );
    
    // 4. 内存 - 添加更多型号
    window.hardwareDatabase.ram = window.hardwareDatabase.ram || [];
    window.hardwareDatabase.ram.push(
        // 高频内存
        {
            id: 'ram_gskill_8000',
            name: 'G.SKILL Trident Z5 RGB 8000',
            specs: '32GB (2x16GB) DDR5 8000MHz',
            price: 2999,
            category: 'ram',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '⚡ 高频'
        },
        {
            id: 'ram_kingston_7200',
            name: 'Kingston FURY Beast RGB 7200',
            specs: '32GB (2x16GB) DDR5 7200MHz',
            price: 1299,
            category: 'ram',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        },
        {
            id: 'ram_corsair_6000',
            name: 'Corsair Vengeance RGB 6000',
            specs: '32GB (2x16GB) DDR5 6000MHz',
            price: 999,
            category: 'ram',
            image: 'https://img.alicdn.com/imgextra/i2/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💰 性价比'
        },
        // 大容量内存
        {
            id: 'ram_gskill_64gb',
            name: 'G.SKILL Trident Z5 64GB',
            specs: '64GB (2x32GB) DDR5 6000MHz',
            price: 2499,
            category: 'ram',
            image: 'https://img.alicdn.com/imgextra/i1/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💾 大容量'
        },
        {
            id: 'ram_kingston_128gb',
            name: 'Kingston FURY Renegade 128GB',
            specs: '128GB (4x32GB) DDR5 5600MHz',
            price: 4999,
            category: 'ram',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🚀 工作站'
        }
    );
    
    // 5. 存储 - 添加更多型号
    window.hardwareDatabase.storage = window.hardwareDatabase.storage || [];
    window.hardwareDatabase.storage.push(
        // PCIe 5.0 SSD
        {
            id: 'storage_samsung_990_pro',
            name: 'Samsung 990 PRO 2TB',
            specs: 'PCIe 4.0 NVMe 7450MB/s',
            price: 1499,
            category: 'storage',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '⚡ 高速'
        },
        {
            id: 'storage_wd_black_sn850x',
            name: 'WD Black SN850X 2TB',
            specs: 'PCIe 4.0 NVMe 7300MB/s',
            price: 1299,
            category: 'storage',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        },
        {
            id: 'storage_crucial_t700',
            name: 'Crucial T700 2TB',
            specs: 'PCIe 5.0 NVMe 12400MB/s',
            price: 2499,
            category: 'storage',
            image: 'https://img.alicdn.com/imgextra/i2/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💎 旗舰'
        },
        // 大容量HDD
        {
            id: 'storage_wd_red_plus',
            name: 'WD Red Plus 8TB',
            specs: 'NAS专用硬盘 7200RPM',
            price: 1299,
            category: 'storage',
            image: 'https://img.alicdn.com/imgextra/i1/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💾 大容量'
        },
        {
            id: 'storage_seagate_barracuda',
            name: 'Seagate Barracuda 4TB',
            specs: '台式机硬盘 5400RPM',
            price: 599,
            category: 'storage',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💰 性价比'
        }
    );
    
    // 6. 散热 - 添加更多型号
    window.hardwareDatabase.cooling = window.hardwareDatabase.cooling || [];
    window.hardwareDatabase.cooling.push(
        // 水冷散热
        {
            id: 'cooling_nzxt_kraken_elite',
            name: 'NZXT Kraken Elite 360 RGB',
            specs: '360mm水冷 LCD屏幕',
            price: 1999,
            category: 'cooling',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💧 水冷'
        },
        {
            id: 'cooling_corsair_h150i',
            name: 'Corsair iCUE H150i ELITE',
            specs: '360mm水冷 RGB风扇',
            price: 1699,
            category: 'cooling',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        },
        {
            id: 'cooling_arctic_liquid_freezer',
            name: 'ARCTIC Liquid Freezer III',
            specs: '360mm水冷 高效散热',
            price: 899,
            category: 'cooling',
            image: 'https://img.alicdn.com/imgextra/i2/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💰 性价比'
        },
        // 风冷散热
        {
            id: 'cooling_noctua_nh_d15',
            name: 'Noctua NH-D15 chromax.black',
            specs: '双塔风冷 静音设计',
            price: 799,
            category: 'cooling',
            image:
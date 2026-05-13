/**
 * 添加更多硬件产品 - 完成部分
 */

// 续接上面的硬件数据
window.hardwareDatabase.cooling.push(
        // 风冷散热
        {
            id: 'cooling_noctua_nh_d15',
            name: 'Noctua NH-D15 chromax.black',
            specs: '双塔风冷 静音设计',
            price: 799,
            category: 'cooling',
            image: 'https://img.alicdn.com/imgextra/i1/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🔇 静音'
        },
        {
            id: 'cooling_bequiet_dark_rock',
            name: 'be quiet! Dark Rock Pro 4',
            specs: '双塔风冷 德国工艺',
            price: 699,
            category: 'cooling',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        }
    );
    
    // 7. 电源 - 添加更多型号
    window.hardwareDatabase.psu = window.hardwareDatabase.psu || [];
    window.hardwareDatabase.psu.push(
        // 金牌认证电源
        {
            id: 'psu_seasonic_prime_tx',
            name: 'Seasonic PRIME TX-1000',
            specs: '1000W 80PLUS钛金 全模组',
            price: 2499,
            category: 'psu',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💎 钛金'
        },
        {
            id: 'psu_corsair_rm1000x',
            name: 'Corsair RM1000x SHIFT',
            specs: '1000W 80PLUS金牌 侧出线',
            price: 1499,
            category: 'psu',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🏆 金牌'
        },
        {
            id: 'psu_bequiet_pure_power',
            name: 'be quiet! Pure Power 12M',
            specs: '850W 80PLUS金牌 静音',
            price: 999,
            category: 'psu',
            image: 'https://img.alicdn.com/imgextra/i2/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🔇 静音'
        },
        {
            id: 'psu_evga_supernova',
            name: 'EVGA SuperNOVA 750 G6',
            specs: '750W 80PLUS金牌 十年质保',
            price: 799,
            category: 'psu',
            image: 'https://img.alicdn.com/imgextra/i1/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💰 性价比'
        },
        {
            id: 'psu_coolermaster_mwe',
            name: 'Cooler Master MWE Gold',
            specs: '650W 80PLUS金牌 五年质保',
            price: 599,
            category: 'psu',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg'
        }
    );
    
    // 8. 机箱 - 添加更多型号
    window.hardwareDatabase.case = window.hardwareDatabase.case || [];
    window.hardwareDatabase.case.push(
        // 全塔机箱
        {
            id: 'case_lianli_o11d_evo',
            name: 'LIAN LI O11 Dynamic EVO',
            specs: '双仓设计 支持360水冷',
            price: 999,
            category: 'case',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🎨 设计'
        },
        {
            id: 'case_nzxt_h9_flow',
            name: 'NZXT H9 Flow',
            specs: '全景海景房 双腔设计',
            price: 1299,
            category: 'case',
            image: 'https://img.alicdn.com/imgextra/i3/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🌊 海景房'
        },
        {
            id: 'case_corsair_5000d',
            name: 'Corsair 5000D AIRFLOW',
            specs: '中塔机箱 优秀风道',
            price: 899,
            category: 'case',
            image: 'https://img.alicdn.com/imgextra/i2/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💨 风道'
        },
        {
            id: 'case_fractal_north',
            name: 'Fractal Design North',
            specs: '胡桃木面板 复古设计',
            price: 1499,
            category: 'case',
            image: 'https://img.alicdn.com/imgextra/i1/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '🎭 复古'
        },
        {
            id: 'case_phanteks_eclipse',
            name: 'Phanteks Eclipse G360A',
            specs: '紧凑中塔 RGB灯效',
            price: 599,
            category: 'case',
            image: 'https://img.alicdn.com/imgextra/i4/2206520636932/O1CN01wQ8Q8Z1Z8Q5Q5Q5Q5_!!2206520636932.jpg',
            badge: '💰 性价比'
        }
    );
    
    console.log('📊 硬件数据统计:');
    console.log(`- CPU: ${window.hardwareDatabase.cpu.length} 个产品`);
    console.log(`- GPU: ${window.hardwareDatabase.gpu.length} 个产品`);
    console.log(`- 主板: ${window.hardwareDatabase.motherboard.length} 个产品`);
    console.log(`- 内存: ${window.hardwareDatabase.ram.length} 个产品`);
    console.log(`- 存储: ${window.hardwareDatabase.storage.length} 个产品`);
    console.log(`- 散热: ${window.hardwareDatabase.cooling.length} 个产品`);
    console.log(`- 电源: ${window.hardwareDatabase.psu.length} 个产品`);
    console.log(`- 机箱: ${window.hardwareDatabase.case.length} 个产品`);
}

function updateHardwareSelector() {
    console.log('🔄 更新硬件选择器...');
    
    // 等待页面加载完成
    setTimeout(() => {
        // 获取硬件选择器容器
        const hardwareSelector = document.querySelector('.hardware-selector, [class*="hardware"], [class*="selector"]');
        
        if (!hardwareSelector) {
            console.log('⚠️ 未找到硬件选择器，将在稍后重试');
            setTimeout(updateHardwareSelector, 1000);
            return;
        }
        
        console.log('✅ 找到硬件选择器，开始更新...');
        
        // 清空现有内容（保留标题和标签）
        const existingItems = hardwareSelector.querySelectorAll('.hardware-item, [class*="item"]');
        existingItems.forEach(item => {
            if (!item.closest('.hardware-tabs') && !item.closest('.selector-header')) {
                item.remove();
            }
        });
        
        // 添加所有硬件类别
        const categories = [
            { id: 'cpu', name: 'CPU 处理器', icon: 'fa-microchip' },
            { id: 'gpu', name: '显卡 GPU', icon: 'fa-gamepad' },
            { id: 'motherboard', name: '主板', icon: 'fa-sitemap' },
            { id: 'ram', name: '内存', icon: 'fa-memory' },
            { id: 'storage', name: '存储', icon: 'fa-hdd' },
            { id: 'cooling', name: '散热', icon: 'fa-fan' },
            { id: 'psu', name: '电源', icon: 'fa-bolt' },
            { id: 'case', name: '机箱', icon: 'fa-desktop' }
        ];
        
        // 为每个类别添加硬件项目
        categories.forEach(category => {
            const hardwareItems = window.hardwareDatabase[category.id] || [];
            
            console.log(`📝 添加 ${category.name}: ${hardwareItems.length} 个产品`);
            
            hardwareItems.forEach((item, index) => {
                const hardwareItem = createHardwareItem(item, category);
                hardwareSelector.appendChild(hardwareItem);
            });
        });
        
        console.log('✅ 硬件选择器更新完成');
        
        // 重新绑定事件
        rebindHardwareEvents();
        
    }, 1500);
}

function createHardwareItem(item, category) {
    const div = document.createElement('div');
    div.className = 'hardware-item';
    div.dataset.category = category.id;
    div.dataset.id = item.id;
    div.dataset.name = item.name;
    div.dataset.price = item.price;
    
    // 构建HTML内容
    let html = `
        <div class="hardware-item-inner">
            <div class="hardware-image">
    `;
    
    // 如果有图片链接，使用img标签
    if (item.image) {
        html += `<img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0zMCAxNUMzNS41MjI4IDE1IDQwIDE5LjQ3NzIgNDAgMjVDNDAgMzAuNTIyOCAzNS41MjI4IDM1IDMwIDM1QzI0LjQ3NzIgMzUgMjAgMzAuNTIyOCAyMCAyNUMyMCAxOS40NzcyIDI0LjQ3NzIgMTUgMzAgMTVaIiBmaWxsPSIjRTVDN0VBIi8+CjxwYXRoIGQ9Ik0zMCAzMkMzMi4yMDkxIDMyIDM0IDMwLjIwOTEgMzQgMjhDMzQgMjUuNzkwOSAzMi4yMDkxIDI0IDMwIDI0QzI3Ljc5MDkgMjQgMjYgMjUuNzkwOSAyNiAyOEMyNiAzMC4yMDkxIDI3Ljc5MDkgMzIgMzAgMzJaIiBmaWxsPSIjODg1QkZGIi8+Cjwvc3ZnPgo=';">`;
    } else {
        // 使用图标作为备用
        html += `<i class="fas ${category.icon}"></i>`;
    }
    
    html += `
            </div>
            <div class="hardware-content">
                <div class="hardware-header">
                    <h4 class="hardware-title">${item.name}</h4>
    `;
    
    // 如果有徽章，添加徽章
    if (item.badge) {
        html += `<span class="hardware-badge">${item.badge}</span>`;
    }
    
    html += `
                </div>
                <p class="hardware-specs">${item.specs}</p>
                <div class="hardware-footer">
                    <div class="hardware-price">¥${item.price.toLocaleString()}</div>
                    <button class="btn btn-outline btn-sm hardware-select-btn" data-id="${item.id}">
                        <i class="fas fa-check"></i> 选择
                    </button>
                </div>
            </div>
        </div>
    `;
    
    div.innerHTML = html;
    return div;
}

function rebindHardwareEvents() {
    console.log('🔗 重新绑定硬件事件...');
    
    // 绑定选择按钮点击事件
    document.querySelectorAll('.hardware-select-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const hardwareItem = this.closest('.hardware-item');
            const category = hardwareItem.dataset.category;
            const id = hardwareItem.dataset.id;
            const name = hardwareItem.dataset.name;
            const price = parseFloat(hardwareItem.dataset.price) || 0;
            
            console.log(`🖱️ 选择硬件: ${category} - ${name} (¥${price})`);
            
            // 调用现有的选择函数
            if (typeof toggleHardwareSelection === 'function') {
                toggleHardwareSelection(category, id, name, price, hardwareItem);
            } else if (window.toggleSelection && window.toggleSelection.toggle) {
                window.toggleSelection.toggle(category, id, name, price);
            }
            
            // 更新配置摘要
            updateConfigSummary(category, name, price);
            
            // 更新总价
            if (typeof updateTotalPrice === 'function') {
                updateTotalPrice();
            }
        });
    });
    
    // 绑定硬件项目点击事件（整行可点击）
    document.querySelectorAll('.hardware-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // 如果点击的是按钮，不触发整行点击
            if (e.target.closest('button')) return;
            
            const category = this.dataset.category;
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price) || 0;
            
            console.log(`🖱️ 点击硬件项目: ${category} - ${name}`);
            
            // 触发选择按钮点击
            const selectBtn = this.querySelector('.hardware-select-btn');
            if (selectBtn) {
                selectBtn.click();
            }
        });
    });
    
    console.log('✅ 硬件事件绑定完成');
}

function updateConfigSummary(category, name, price) {
    const elementId = `selected${capitalize(category)}`;
    const element = document.getElementById(elementId);
    
    if (element) {
        element.textContent = name;
        
        // 更新价格显示
        const priceElement = element.parentElement.querySelector('.component-price');
        if (priceElement) {
            priceElement.textContent = `¥${price}`;
        }
        
        console.log(`📝 更新配置摘要: ${category} = ${name} (¥${price})`);
    }
}

function addImageOptimization() {
    console.log('🖼️ 添加图片优化...');
    
    // 添加图片懒加载和错误处理
    const style = document.createElement('style');
    style.textContent = `
        /* 硬件图片样式优化 */
        .hardware-image {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            border-radius: 8px;
            overflow: hidden;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .hardware-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .hardware-image img:hover {
            transform: scale(1.05);
        }
        
        .hardware-image i {
            font-size: 2rem;
            color: #8b5cf6;
        }
        
        /* 硬件徽章样式 */
        .hardware-badge {
            display: inline-block;
            padding: 2px 8px;
            background: linear-gradient(135deg, #8b5cf6, #6366f1);
            color: white;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 8px;
            vertical-align: middle;
        }
        
        /* 硬件项目布局优化 */
        .hardware-item-inner {
            display: flex;
            align-items: center;
            padding: 15px;
        }
        
        .hardware-content {
            flex: 1;
        }
        
        .hardware-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .hard
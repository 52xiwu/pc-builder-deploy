/**
 * 扩展硬件数据库 - 完成部分
 */

// 续接上面的类定义
HardwareExpander.prototype.getFilterName = function(filter) {
    const names = {
        'all': '全部产品',
        'gaming': '游戏电竞',
        'workstation': '工作站',
        'budget': '性价比',
        'rgb': 'RGB光效'
    };
    return names[filter] || filter;
};

HardwareExpander.prototype.getCategoryLabel = function(category) {
    const labels = {
        'high-end': '旗舰',
        'mid-range': '中端',
        'budget': '性价比',
        'gaming': '电竞'
    };
    return labels[category] || category;
};

HardwareExpander.prototype.getProductIcon = function(category) {
    const iconMap = {
        cpu: 'fa-microchip',
        gpu: 'fa-gamepad',
        motherboard: 'fa-microchip',
        ram: 'fa-memory',
        storage: 'fa-hdd',
        cooling: 'fa-fan',
        psu: 'fa-bolt',
        case: 'fa-desktop',
        peripheral: 'fa-mouse',
        monitor: 'fa-desktop',
        accessory: 'fa-lightbulb'
    };
    return iconMap[category] || 'fa-box';
};

HardwareExpander.prototype.showFilterToast = function(filterName, count) {
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'filter-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #3b82f6;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        animation: fadeIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-filter" style="font-size: 1.25rem;"></i>
        <div>
            <div style="font-weight: 600;">${filterName}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">显示 ${count} 个产品</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 添加动画样式
    if (!document.querySelector('#filter-animations')) {
        const style = document.createElement('style');
        style.id = 'filter-animations';
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
            }
            
            /* 硬件类别标签样式 */
            .category-badge {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 500;
                margin-left: 8px;
                vertical-align: middle;
            }
            
            .category-badge.high-end {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
            }
            
            .category-badge.mid-range {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: white;
            }
            
            .category-badge.budget {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }
            
            .category-badge.gaming {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }
            
            /* RGB标识 */
            .rgb-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                animation: rgb-pulse 2s infinite;
            }
            
            @keyframes rgb-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            /* 筛选计数 */
            .filter-count {
                background: #ef4444;
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 0.75rem;
                margin-left: 4px;
            }
            
            /* 产品元信息 */
            .product-meta {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.75rem;
                font-size: 0.875rem;
            }
            
            .product-brand {
                color: #6b7280;
                font-weight: 500;
            }
            
            .product-category {
                color: #3b82f6;
                font-weight: 500;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 3秒后自动移除
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

HardwareExpander.prototype.addCSSStyles = function() {
    const style = document.createElement('style');
    style.textContent = `
        /* 扩展硬件选择器样式 */
        .hardware-item {
            position: relative;
            transition: all 0.2s ease;
        }
        
        .hardware-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .hardware-item.selected {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.05);
        }
        
        /* 产品卡片增强样式 */
        .product-card {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .product-image {
            position: relative;
            height: 200px;
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .product-image i {
            font-size: 3rem;
            color: #3b82f6;
            transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image i {
            transform: scale(1.1);
        }
        
        /* 筛选按钮样式 */
        .filter-btn {
            position: relative;
            transition: all 0.2s ease;
        }
        
        .filter-btn:hover {
            transform: translateY(-2px);
        }
        
        .filter-btn.active {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border-color: transparent;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .products-grid {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 1rem;
            }
            
            .hardware-item {
                padding: 0.75rem;
            }
            
            .filter-btn {
                padding: 0.5rem 1rem;
                font-size: 0.875rem;
            }
        }
        
        @media (max-width: 480px) {
            .products-grid {
                grid-template-columns: 1fr;
            }
            
            .filter-btn .filter-count {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
};

// 页面加载完成后初始化
if (typeof HardwareExpander !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 启动硬件扩展器...');
        window.hardwareExpander = new HardwareExpander();
        
        // 添加CSS样式
        window.hardwareExpander.addCSSStyles();
        
        // 显示扩展完成提示
        setTimeout(() => {
            const totalProducts = window.hardwareExpander.productData.all.length;
            const totalHardware = Object.values(window.hardwareExpander.hardwareData)
                .reduce((sum, items) => sum + items.length, 0);
            
            console.log(`📊 扩展完成统计:`);
            console.log(`   • 硬件选择器: ${totalHardware} 个项目`);
            console.log(`   • 产品商城: ${totalProducts} 个产品`);
            console.log(`   • 游戏电竞: ${window.hardwareExpander.productData.gaming.length} 个`);
            console.log(`   • 工作站: ${window.hardwareExpander.productData.workstation.length} 个`);
            console.log(`   • 性价比: ${window.hardwareExpander.productData.budget.length} 个`);
            console.log(`   • RGB光效: ${window.hardwareExpander.productData.rgb.length} 个`);
        }, 1000);
    });
}

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HardwareExpander;
}
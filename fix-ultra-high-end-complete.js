/**
 * 超高端硬件扩展 - 完成部分
 */

// 续接上面的类定义
UltraHighEndHardware.prototype.addUltraHighEndStyles = function() {
    const style = document.createElement('style');
    style.textContent = `
        /* 超高端特殊样式 */
        .ultra-high-end {
            border: 2px solid transparent;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.05));
            position: relative;
            overflow: hidden;
        }
        
        .ultra-high-end::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #f59e0b, #d97706, #b45309);
        }
        
        .ultra-high-end:hover {
            border-color: #f59e0b;
            transform: translateY(-8px);
            box-shadow: 0 15px 30px -10px rgba(245, 158, 11, 0.3);
        }
        
        .ultra-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            z-index: 2;
            animation: ultra-glow 2s infinite;
        }
        
        @keyframes ultra-glow {
            0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.5); }
            50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.8); }
        }
        
        .ultra-price {
            color: #f59e0b;
            font-size: 1.5rem;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
        }
        
        /* 超高端硬件项目样式 */
        .hardware-item.ultra-high-end {
            border-left: 4px solid #f59e0b;
            background: linear-gradient(90deg, rgba(245, 158, 11, 0.05), transparent);
        }
        
        .hardware-item.ultra-high-end .hardware-name::before {
            content: '💎 ';
            color: #f59e0b;
        }
        
        .hardware-item.ultra-high-end.selected {
            border-color: #d97706;
            background: linear-gradient(90deg, rgba(217, 119, 6, 0.1), transparent);
            box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
        }
        
        /* 超高端筛选按钮 */
        .filter-btn[data-category="ultra"] {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            border-color: transparent;
            font-weight: 600;
        }
        
        .filter-btn[data-category="ultra"]:hover {
            background: linear-gradient(135deg, #d97706, #b45309);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(245, 158, 11, 0.4);
        }
        
        .filter-btn[data-category="ultra"].active {
            background: linear-gradient(135deg, #b45309, #92400e);
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
        }
        
        /* 超高端类别标签 */
        .category-badge.ultra-high-end {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 15px;
            animation: badge-pulse 2s infinite;
        }
        
        .category-badge.workstation-ultra {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            font-weight: 700;
        }
        
        @keyframes badge-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
            .ultra-badge {
                font-size: 0.65rem;
                padding: 4px 8px;
            }
            
            .ultra-price {
                font-size: 1.25rem;
            }
        }
    `;
    document.head.appendChild(style);
};

UltraHighEndHardware.prototype.updateHardwareSelectorUI = function() {
    // 更新硬件选择器，确保超高端硬件有特殊显示
    setTimeout(() => {
        // 为超高端硬件项目添加特殊类
        Object.keys(this.ultraHighEndData).forEach(category => {
            this.ultraHighEndData[category].forEach(item => {
                const hardwareItem = document.querySelector(`.hardware-item[data-id="${item.id}"]`);
                if (hardwareItem) {
                    hardwareItem.classList.add('ultra-high-end');
                    
                    // 添加超高端标签
                    const nameElement = hardwareItem.querySelector('.hardware-name');
                    if (nameElement && !nameElement.querySelector('.category-badge.ultra-high-end')) {
                        const badge = document.createElement('span');
                        badge.className = 'category-badge ultra-high-end';
                        badge.textContent = '超高端';
                        nameElement.appendChild(badge);
                    }
                }
            });
        });
        
        console.log('✅ 更新硬件选择器UI');
    }, 1500);
};

UltraHighEndHardware.prototype.getProductIcon = function(category) {
    const iconMap = {
        cpu: 'fa-microchip',
        gpu: 'fa-gamepad',
        motherboard: 'fa-microchip',
        ram: 'fa-memory',
        storage: 'fa-hdd',
        cooling: 'fa-fan',
        psu: 'fa-bolt',
        case: 'fa-desktop'
    };
    return iconMap[category] || 'fa-crown';
};

UltraHighEndHardware.prototype.getCategoryName = function(category) {
    const names = {
        cpu: 'CPU处理器',
        gpu: '显卡',
        motherboard: '主板',
        ram: '内存',
        storage: '存储',
        cooling: '散热',
        psu: '电源',
        case: '机箱'
    };
    return names[category] || category;
};

UltraHighEndHardware.prototype.showUltraHighEndToast = function() {
    const totalUltraProducts = Object.values(this.ultraHighEndData)
        .reduce((sum, items) => sum + items.length, 0);
    
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = 'ultra-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        padding: 1.25rem 2rem;
        border-radius: 0.75rem;
        box-shadow: 0 15px 30px -10px rgba(245, 158, 11, 0.4);
        z-index: 10002;
        animation: ultra-toast-in 0.5s ease-out;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 90%;
        text-align: center;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-crown" style="font-size: 1.5rem;"></i>
        <div>
            <div style="font-weight: 700; font-size: 1.1rem;">💎 超高端硬件专区</div>
            <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.25rem;">
                展示 ${totalUltraProducts} 个顶级硬件产品
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 添加动画样式
    if (!document.querySelector('#ultra-toast-animations')) {
        const style = document.createElement('style');
        style.id = 'ultra-toast-animations';
        style.textContent = `
            @keyframes ultra-toast-in {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes ultra-toast-out {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(30px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 5秒后自动移除
    setTimeout(() => {
        toast.style.animation = 'ultra-toast-out 0.5s ease-out forwards';
        setTimeout(() => toast.remove(), 500);
    }, 5000);
};

UltraHighEndHardware.prototype.getUltraHighEndSummary = function() {
    const summary = {
        totalProducts: 0,
        byCategory: {},
        priceRange: { min: Infinity, max: 0 }
    };
    
    Object.entries(this.ultraHighEndData).forEach(([category, products]) => {
        summary.byCategory[category] = products.length;
        summary.totalProducts += products.length;
        
        products.forEach(product => {
            if (product.price < summary.priceRange.min) summary.priceRange.min = product.price;
            if (product.price > summary.priceRange.max) summary.priceRange.max = product.price;
        });
    });
    
    return summary;
};

// 页面加载完成后初始化
if (typeof UltraHighEndHardware !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('👑 启动超高端硬件扩展...');
        window.ultraHighEndHardware = new UltraHighEndHardware();
        
        // 显示扩展完成提示
        setTimeout(() => {
            const summary = window.ultraHighEndHardware.getUltraHighEndSummary();
            
            console.log('📊 超高端硬件扩展完成统计:');
            console.log(`   • 总产品数: ${summary.totalProducts} 个`);
            console.log(`   • CPU处理器: ${summary.byCategory.cpu || 0} 个 (含9850X3D/9800X3D)`);
            console.log(`   • 显卡: ${summary.byCategory.gpu || 0} 个 (含5090/5080/5070)`);
            console.log(`   • 主板: ${summary.byCategory.motherboard || 0} 个`);
            console.log(`   • 内存: ${summary.byCategory.ram || 0} 个`);
            console.log(`   • 存储: ${summary.byCategory.storage || 0} 个`);
            console.log(`   • 散热: ${summary.byCategory.cooling || 0} 个`);
            console.log(`   • 电源: ${summary.byCategory.psu || 0} 个`);
            console.log(`   • 机箱: ${summary.byCategory.case || 0} 个`);
            console.log(`   • 价格范围: ¥${summary.priceRange.min} - ¥${summary.priceRange.max}`);
            
            // 显示用户提示
            if (summary.totalProducts > 0) {
                const userMsg = document.createElement('div');
                userMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
                    z-index: 10003;
                    animation: slide-in-right 0.5s ease-out;
                    max-width: 300px;
                `;
                
                userMsg.innerHTML = `
                    <div style="font-weight: 600; margin-bottom: 0.5rem;">🎉 超高端硬件已添加！</div>
                    <div style="font-size: 0.875rem; opacity: 0.9;">
                        已添加您要求的:<br>
                        • 5090/5080/5070显卡<br>
                        • 9850X3D/9800X3D处理器<br>
                        • 共 ${summary.totalProducts} 个超高端产品
                    </div>
                `;
                
                document.body.appendChild(userMsg);
                
                // 添加动画
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes slide-in-right {
                        from {
                            opacity: 0;
                            transform: translateX(100%);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                `;
                document.head.appendChild(style);
                
                // 5秒后移除
                setTimeout(() => {
                    userMsg.style.opacity = '0';
                    userMsg.style.transform = 'translateX(100%)';
                    setTimeout(() => userMsg.remove(), 500);
                }, 5000);
            }
        }, 2000);
    });
}

// 导出供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltraHighEndHardware;
}
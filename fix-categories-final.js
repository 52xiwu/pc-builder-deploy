/**
 * 分类修复脚本 - 最终部分
 */

// 续接上面的函数
function bindProductButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('.product-title').textContent;
            showToast(`✅ 已添加 "${productName}" 到购物车`);
        });
    });
    
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productSpecs = productCard.querySelector('.product-specs').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            showProductDetails({
                name: productName,
                specs: productSpecs,
                price: productPrice,
                brand: productCard.querySelector('.product-brand')?.textContent || '未知品牌'
            });
        });
    });
}

function showProductDetails(product) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
        animation: fadeIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #1f2937;">产品详情</h2>
                <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #3b82f6; margin-bottom: 10px;">${product.name}</h3>
                <p style="color: #6b7280; line-height: 1.6;">${product.specs}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                    <div style="color: #6b7280; font-size: 0.9rem; margin-bottom: 5px;">品牌</div>
                    <div style="font-weight: 600; color: #1f2937;">${product.brand}</div>
                </div>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
                    <div style="color: #6b7280; font-size: 0.9rem; margin-bottom: 5px;">价格</div>
                    <div style="font-weight: 700; color: #10b981; font-size: 1.2rem;">${product.price}</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="btn btn-outline" style="padding: 10px 20px;">取消</button>
                <button class="btn btn-primary" style="padding: 10px 20px;">加入购物车</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 关闭按钮事件
    modal.querySelector('.close-modal').onclick = function() {
        modal.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.btn-outline').onclick = function() {
        modal.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.btn-primary').onclick = function() {
        showToast(`✅ 已添加 "${product.name}" 到购物车`);
        modal.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => modal.remove(), 300);
    };
    
    // 点击背景关闭
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => modal.remove(), 300);
        }
    };
    
    // 添加动画样式
    if (!document.querySelector('#modal-animations')) {
        const style = document.createElement('style');
        style.id = 'modal-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function showCategoryToast(categoryName, count) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #3b82f6;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        animation: slideUp 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-filter" style="font-size: 1.25rem;"></i>
        <div>
            <div style="font-weight: 600;">${categoryName}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">显示 ${count} 个产品</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    toast.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 1.25rem;"></i>
        <div>
            <div style="font-weight: 600;">操作成功</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initCategoryProducts(categoryData) {
    console.log('🛍️ 初始化分类产品...');
    
    // 初始加载全部产品
    setTimeout(() => {
        loadAllProducts(categoryData);
    }, 1000);
}

function addCategoryStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 分类徽章 */
        .category-badge {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: 8px;
        }
        
        /* RGB徽章 */
        .rgb-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            animation: rgb-pulse 2s infinite;
        }
        
        @keyframes rgb-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        /* 标签徽章 */
        .tag-badge {
            display: inline-block;
            background: #f3f4f6;
            color: #6b7280;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            margin-right: 5px;
            margin-bottom: 5px;
        }
        
        .product-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 15px;
        }
        
        /* 筛选计数 */
        .filter-count {
            background: #e5e7eb;
            color: #6b7280;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        /* 产品卡片增强 */
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
        
        .product-content {
            padding: 20px;
        }
        
        .product-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .product-specs {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .product-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .product-brand {
            color: #6b7280;
            font-weight: 500;
        }
        
        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #10b981;
        }
        
        .product-actions {
            display: flex;
            gap: 10px;
        }
        
        /* 动画 */
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(20px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(20px); opacity: 0; }
        }
        
        /* 响应式 */
        @media (max-width: 768px) {
            .category-filters {
                padding: 15px;
            }
            
            .filter-btn {
                padding: 10px 15px;
                font-size: 0.9rem;
            }
            
            .product-image {
                height: 150px;
            }
            
            .product-image i {
                font-size: 2rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// 添加样式
addCategoryStyles();

// 统计信息
setTimeout(() => {
    const categoryData = createCategoryHardwareData();
    
    console.log('📊 分类硬件数据统计:');
    console.log(`   • 游戏电竞: ${categoryData.gaming.length} 个产品`);
    console.log(`   • 工作站: ${categoryData.workstation.length} 个产品`);
    console.log(`   • 性价比: ${categoryData.budget.length} 个产品`);
    console.log(`   • RGB光效: ${categoryData.rgb.length} 个产品`);
    console.log(`   • 总计: ${Object.values(categoryData).reduce((sum, arr) => sum + arr.length, 0)} 个产品`);
    
    // 显示完成提示
    const completionMsg = document.createElement('div');
    completionMsg.style.cssText = `
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
    
    completionMsg.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.5rem;">🎮 分类硬件已添加！</div>
        <div style="font-size: 0.875rem; opacity: 0.9;">
            已添加:<br>
            • 游戏电竞: ${categoryData.gaming.length} 个<br>
            • 工作站: ${categoryData.workstation.length} 个<br>
            • 性价比: ${categoryData.budget.length} 个<br>
            • RGB光效: ${categoryData.rgb.length} 个
        </div>
    `;
    
    document.body.appendChild(completionMsg);
    
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
        completionMsg.style.opacity = '0';
        completionMsg.style.transform = 'translateX(100%)';
        setTimeout(() => completionMsg.remove(), 500);
    }, 5000);
}, 2000);

console.log('🎉 分类修复脚本加载完成');
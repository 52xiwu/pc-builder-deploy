/**
 * 电脑硬件销售网站 - 增强版应用逻辑（续）
 */

// 续接上面的类定义
PCBuilderAppEnhanced.prototype.getProductIcon = function(category) {
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
    return iconMap[category] || 'fa-box';
};

PCBuilderAppEnhanced.prototype.capitalizeFirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

PCBuilderAppEnhanced.prototype.getCategoryName = function(category) {
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

PCBuilderAppEnhanced.prototype.filterProducts = async function(category) {
    try {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        // 更新按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // 从API获取筛选后的产品
        const params = category === 'all' ? { limit: 8 } : { category, limit: 8 };
        const result = await this.api.getProducts(params);
        const products = result.products || [];
        
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                    <h3 style="color: #6b7280; margin-bottom: 0.5rem;">未找到产品</h3>
                    <p style="color: #9ca3af;">${category === 'all' ? '暂无产品数据' : `暂无${this.getCategoryName(category)}类产品`}</p>
                </div>
            `;
            return;
        }
        
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            productCard.dataset.category = product.category;
            
            productCard.innerHTML = `
                <div class="product-image">
                    <i class="fas ${this.getProductIcon(product.category)}"></i>
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-specs">${product.specs || product.description || '暂无规格信息'}</p>
                    <div class="product-price">¥${product.price}</div>
                    <div class="product-actions">
                        <button class="btn btn-outline btn-sm view-details-btn">查看详情</button>
                        <button class="btn btn-primary btn-sm add-to-cart-btn">加入购物车</button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // 显示筛选结果提示
        this.showNotification(
            '筛选完成',
            `显示 ${products.length} 个${category === 'all' ? '产品' : this.getCategoryName(category)}`,
            'info'
        );
    } catch (error) {
        console.error('筛选产品失败:', error);
        this.showNotification('筛选失败', '请检查网络连接或稍后重试', 'error');
    }
};

PCBuilderAppEnhanced.prototype.showProductDetails = async function(productCard) {
    try {
        const productId = productCard.dataset.id;
        const result = await this.api.getProduct(productId);
        const product = result.product;
        
        if (!product) {
            this.showNotification('错误', '产品信息加载失败', 'error');
            return;
        }
        
        // 创建详情模态框
        this.createProductModal(product);
    } catch (error) {
        console.error('获取产品详情失败:', error);
        
        // 使用卡片数据作为后备
        const product = {
            name: productCard.querySelector('.product-title')?.textContent || '产品',
            specs: productCard.querySelector('.product-specs')?.textContent || '暂无规格信息',
            price: productCard.querySelector('.product-price')?.textContent || '价格待定',
            category: productCard.dataset.category || 'unknown'
        };
        
        this.createProductModal(product);
    }
};

PCBuilderAppEnhanced.prototype.createProductModal = function(product) {
    // 移除现有的模态框
    const existingModal = document.querySelector('.product-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        ">
            <div class="modal-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            ">
                <h3 style="font-size: 1.5rem; font-weight: 600; color: #111827;">${product.name}</h3>
                <button class="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #6b7280;
                ">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="product-image" style="
                    height: 200px;
                    background: #f3f4f6;
                    border-radius: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                ">
                    <i class="fas ${this.getProductIcon(product.category)}" style="font-size: 3rem; color: #2563eb;"></i>
                </div>
                
                <div class="product-info" style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">产品规格</h4>
                    <p style="color: #6b7280; line-height: 1.6;">${product.specs || '暂无规格信息'}</p>
                </div>
                
                ${product.description ? `
                <div class="product-description" style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: #374151;">产品描述</h4>
                    <p style="color: #6b7280; line-height: 1.6;">${product.description}</p>
                </div>
                ` : ''}
                
                <div class="product-price" style="
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #2563eb;
                    margin-bottom: 1.5rem;
                ">
                    ${product.price}
                </div>
                
                <div class="modal-actions" style="display: flex; gap: 1rem;">
                    <button class="btn btn-outline compare-btn" style="flex: 1;">加入对比</button>
                    <button class="btn btn-primary add-to-cart-modal-btn" style="flex: 1;">加入购物车</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 关闭按钮事件
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // 加入购物车按钮事件
    modal.querySelector('.add-to-cart-modal-btn').addEventListener('click', () => {
        this.addProductToCartById(product.id || productCard.dataset.id);
        modal.remove();
    });
    
    // 加入对比按钮事件
    modal.querySelector('.compare-btn').addEventListener('click', () => {
        this.addToComparison(product);
        modal.remove();
    });
};

PCBuilderAppEnhanced.prototype.addProductToCart = async function(productCard) {
    try {
        const productId = productCard.dataset.id;
        await this.addProductToCartById(productId);
    } catch (error) {
        console.error('加入购物车失败:', error);
        this.showNotification('错误', '加入购物车失败，请稍后重试', 'error');
    }
};

PCBuilderAppEnhanced.prototype.addProductToCartById = async function(productId) {
    try {
        await this.api.addToLocalCart(productId, 1);
        
        // 更新购物车计数
        await this.updateCartCount();
        
        // 显示成功通知
        this.showNotification('成功', '商品已加入购物车', 'success');
    } catch (error) {
        console.error('加入购物车失败:', error);
        throw error;
    }
};

PCBuilderAppEnhanced.prototype.addCurrentConfigToCart = async function() {
    try {
        // 检查是否有选中的配置
        const hasSelection = Object.values(this.currentConfig).some(item => item !== null);
        if (!hasSelection) {
            this.showNotification('提示', '请先选择硬件配置', 'warning');
            return;
        }
        
        // 将当前配置中的所有硬件加入购物车
        const promises = Object.values(this.currentConfig)
            .filter(item => item !== null)
            .map(item => this.api.addToLocalCart(item.id, 1));
        
        await Promise.all(promises);
        
        // 更新购物车计数
        await this.updateCartCount();
        
        // 显示成功通知
        this.showNotification('成功', '当前配置已加入购物车', 'success');
    } catch (error) {
        console.error('添加配置到购物车失败:', error);
        this.showNotification('错误', '添加配置到购物车失败', 'error');
    }
};

PCBuilderAppEnhanced.prototype.updateCartCount = async function() {
    try {
        const cartCount = document.getElementById('cartCount');
        if (!cartCount) return;
        
        const cart = await this.api.getLocalCart();
        const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    } catch (error) {
        console.error('更新购物车计数失败:', error);
    }
};

PCBuilderAppEnhanced.prototype.toggleCart = async function() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (!cartSidebar) return;
    
    const isVisible = cartSidebar.style.transform !== 'translateX(100%)';
    
    if (!isVisible) {
        // 打开购物车时加载内容
        await this.loadCartContent();
    }
    
    cartSidebar.style.transform = isVisible ? 'translateX(100%)' : 'translateX(0)';
};

PCBuilderAppEnhanced.prototype.loadCartContent = async function() {
    try {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        
        if (!cartItemsContainer || !cartTotalElement) return;
        
        const cart = await this.api.getLocalCart();
        
        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>购物车是空的</p>
                    <button class="btn btn-outline" onclick="window.app.scrollToSection('products')">去逛逛</button>
                </div>
            `;
            cartTotalElement.textContent = '¥0';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">¥${item.price} × ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-sm btn-outline decrease-btn" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline increase-btn" data-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-danger remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        cartTotalElement.textContent = `¥${cart.total}`;
        
        // 绑定购物车项目事件
        this.bindCartItemEvents();
    } catch (error) {
        console.error('加载购物车内容失败:', error);
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = `
                <div class="cart-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>加载购物车失败</p>
                    <button class="btn btn-outline" onclick="window.app.loadCartContent()">重试</button>
                </div>
            `;
        }
    }
};

PCBuilderAppEnhanced.prototype.bindCartItemEvents = function() {
    // 增加数量
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = e.target.dataset.id;
            await this.updateCartItemQuantity(itemId, 'increase');
        });
    });
    
    // 减少数量
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = e.target.dataset.id;
            await this.updateCartItemQuantity(itemId, 'decrease');
        });
    });
    
    // 移除项目
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = e.target.dataset.id;
            await this.removeCartItem(itemId);
        });
    });
};

PCBuilderAppEnhanced.prototype.updateCartItemQuantity = async function(itemId, action) {
    try {
        // 这里需要根据是否登录调用不同的API
        // 简化处理：重新加载购物车
        await this.loadCartContent();
        await this.updateCartCount();
    } catch (error) {
        console.error('更新购物车数量失败:', error);
        this.showNotification('错误', '更新数量失败', 'error');
    }
};

PCBuilderAppEnhanced.prototype.removeCartItem = async function(itemId) {
    try {
        if (this.api.token) {
            // 已登录，调用服务器API
            await this.api.removeFromCart(itemId);
        } else {
            // 未登录，更新本地存储
            const localCart = this.api.getFromLocalStorage('local_cart') || [];
            const updatedCart = localCart.filter(item => item.id !== itemId);
            this.api.saveToLocalStorage('local_cart', updatedCart);
        }
        
        // 重新加载购物车
        await this.loadCartContent();
        await this.updateCartCount();
        
        this.showNotification('成功', '商品已从购物车移除', 'success');
    } catch (error) {
        console.error('移除购物车项目失败:', error);
        this.showNotification('错误', '移除失败', 'error');
    }
};

PCBuilderAppEnhanced.prototype.buyNow = async function() {
    if (!this.currentUser) {
        this.showLoginModal();
        this.showNotification('提示', '请先登录以继续购买', 'warning');
        return;
    }
    
    try {
        // 检查购物车是否为空
        const cart = await this.api.getCart();
        if (cart.items.length === 0) {
            this.showNotification('提示', '购物车为空，请先添加商品', 'warning');
            return;
        }
        
        // 显示结算模态框
        this.showCheckoutModal(cart);
    } catch (error) {
        console.error('立即购买失败:', error);
        this.showNotification('错误', '购买失败，请稍后重试', 'error');
    }
};

PCBuilderAppEnhanced.prototype.showCheckoutModal = function(cart) {
    // 创建结算模态框
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    modal.innerHTML = `
        <div class="checkout-content" style="
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        ">
            <div class="checkout-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <h3 style="font-size:1.5rem;font-weight:600;color:#111827;">确认订单</h3>
                <button class="close-checkout" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#6b7280;">&times;</button>
            </div>
            <div class="checkout-items" style="margin-bottom:1.5rem;">
                ${cart.items.map(item => `
                    <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid #e5e7eb;">
                        <div>
                            <div style="font-weight:500;color:#374151;">${item.name || item.title}</div>
                            <div style="color:#6b7280;font-size:0.875rem;">x${item.quantity}</div>
                        </div>
                        <div style="font-weight:600;color:#2563eb;">¥${item.price * item.quantity}</div>
                    </div>
                `).join('')}
            </div>
            <div class="checkout-total" style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-top:2px solid #e5e7eb;margin-bottom:1.5rem;">
                <span style="font-size:1.125rem;font-weight:600;color:#374151;">订单总价</span>
                <span style="font-size:1.5rem;font-weight:700;color:#2563eb;">¥${totalAmount}</span>
            </div>
            <div class="checkout-actions" style="display:flex;gap:1rem;">
                <button class="btn btn-outline cancel-checkout-btn" style="flex:1;">取消</button>
                <button class="btn btn-primary submit-order-btn" style="flex:1;">提交订单</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-checkout').addEventListener('click', () => modal.remove());
    modal.querySelector('.cancel-checkout-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    
    modal.querySelector('.submit-order-btn').addEventListener('click', async () => {
        try {
            const res = await fetch('/api/orders/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: cart.items, user: null })
            });
            const result = await res.json();
            if (res.ok && result.ok) {
                this.showNotification('成功', '订单提交成功！订单号：' + (result.order?.orderId || ''), 'success');
                modal.remove();
                this.clearCart();
            } else {
                this.showNotification('错误', result.message || '订单提交失败', 'error');
            }
        } catch (error) {
            console.error('提交订单失败:', error);
            this.showNotification('错误', '订单提交失败，请稍后重试', 'error');
        }
    });
};

PCBuilderAppEnhanced.prototype.clearCart = async function() {
    try {
        localStorage.removeItem('pcbuilder_local_cart');
        await this.updateCartCount();
    } catch (error) {
        console.error('清空购物车失败:', error);
    }
};

if (typeof initApp === "function") initApp();
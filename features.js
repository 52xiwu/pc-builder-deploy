/**
 * 联信装机 - 功能增强模块
 * 购物车、立即购买、登录、社区
 */
(function() {
    const STORAGE_KEYS = {
        cart: 'pcbuilder_cart',
        user: 'pcbuilder_user',
        users: 'pcbuilder_users',
        posts: 'pcbuilder_community_posts',
        hardware: 'pcbuilder_hardware_override'
    };

    function getCart() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.cart);
            return data ? JSON.parse(data) : [];
        } catch (e) { return []; }
    }
    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    }
    function getUsers() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.users);
            return data ? JSON.parse(data) : [];
        } catch (e) { return []; }
    }
    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }
    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');
        } catch (e) { return null; }
    }
    function setCurrentUser(user) {
        localStorage.setItem(STORAGE_KEYS.user, user ? JSON.stringify(user) : '');
    }
    function getPosts() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.posts);
            return data ? JSON.parse(data) : getDefaultPosts();
        } catch (e) { return getDefaultPosts(); }
    }
    function savePosts(posts) {
        localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
    }
    function getDefaultPosts() {
        return [
            { id: 'p1', title: 'RTX 5090 装机体验分享', author: '联信玩家', content: '刚入手5090，跑分惊人！', time: Date.now() - 86400000, likes: 12 },
            { id: 'p2', title: 'AMD 9950X3D 游戏性能测试', author: '硬件控', content: '3D缓存对游戏提升明显', time: Date.now() - 172800000, likes: 28 },
            { id: 'p3', title: '万元预算装机配置推荐', author: '装机达人', content: '推荐配置：7800X3D + 4070Ti', time: Date.now() - 259200000, likes: 56 }
        ];
    }

    function showToast(msg, type = 'success') {
        const colors = { success: '#10b981', error: '#ef4444', info: '#2563eb' };
        const n = document.createElement('div');
        n.style.cssText = `position:fixed;top:20px;right:20px;background:${colors[type]||colors.success};color:white;padding:1rem 1.5rem;border-radius:0.5rem;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);z-index:100050;animation:slideIn 0.3s ease-out`;
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(() => { n.style.animation = 'slideOut 0.3s forwards'; setTimeout(() => n.remove(), 300); }, 2500);
    }

    // 脚本加载时即挂上
    window.features = { showToast };
    window.showLoginModal = showLoginModal;

    function toggleCart() {
        const el = document.getElementById('cartSidebar');
        if (el) el.classList.toggle('open');
    }

    function updateCartCount() {
        const cart = getCart();
        const count = cart.reduce((sum, it) => sum + (it.quantity || 1), 0);
        const badge = document.querySelector('.cart-count');
        if (badge) badge.textContent = count;
    }

    function addConfigToCart(config, totalPrice) {
        if (!config) return;
        const items = [];
        const cats = { cpu:'处理器', gpu:'显卡', motherboard:'主板', ram:'内存', storage:'存储', cooling:'散热', psu:'电源', case:'机箱', monitor:'显示器', keyboard:'键盘', mouse:'鼠标', headset:'耳麦' };
        for (const [k, v] of Object.entries(config)) {
            if (v && v.name) {
                items.push({
                    name: v.name,
                    price: v.price || 0,
                    category: cats[k] || k,
                    brand: v.brand || '',
                    specs: v.specs || '',
                });
            }
        }
        if (items.length === 0) { showToast('请先选择至少一件硬件', 'error'); return; }
        const cart = getCart();
        cart.push({
            id: 'cfg_' + Date.now(),
            type: 'config',
            items,
            totalPrice: totalPrice || items.reduce((s,i)=>s+(i.price||0),0),
            quantity: 1,
            createdAt: new Date().toISOString(),
        });
        saveCart(cart);
        updateCartCount();
        renderCartItems();
        showToast('配置已加入购物车');
        document.getElementById('cartSidebar')?.classList.add('open');
    }

    /** 供 builder-controller 等调用；与 window.app.currentConfig 双源时优先装机器 state */
    window.addConfigToCart = addConfigToCart;
    window.addSingleToCart = addSingleToCart;

    /** 装机摘要（summarySlots）与旧版 app.currentConfig 合并读取 */
    function getEffectivePcConfig() {
        const BUILDER_SERVICE_FEE = 299;
        if (typeof window.pcBuilderGetConfig === 'function') {
            const c = window.pcBuilderGetConfig();
            if (c && Object.values(c).some(v => v && v.name)) {
                const sub = Object.values(c).reduce((s, i) => s + (i && i.price ? Number(i.price) : 0), 0);
                return { config: c, total: sub + BUILDER_SERVICE_FEE };
            }
        }
        if (!window.app || !window.app.currentConfig) return { config: null, total: 0 };
        const cfg = window.app.currentConfig;
        const has = Object.values(cfg).some(v => v && v.name);
        if (!has) return { config: cfg, total: 0 };
        let total = 0;
        if (typeof window.app.calcTotalPrice === 'function') {
            total = window.app.calcTotalPrice();
        } else {
            const sub = Object.values(cfg).reduce((s, i) => s + (i && i.price ? Number(i.price) : 0), 0);
            total = sub + BUILDER_SERVICE_FEE;
        }
        return { config: cfg, total };
    }

    function addSingleToCart(name, price, specs, brand, category) {
        const cart = getCart();
        cart.push({
            id: 'item_' + Date.now(),
            type: 'single',
            name,
            price: parseInt(String(price).replace(/[^\d]/g,''), 10) || 0,
            specs: specs || '',
            brand: brand || '',
            category: category || '',
            quantity: 1,
            createdAt: new Date().toISOString(),
        });
        saveCart(cart);
        updateCartCount();
        renderCartItems();
        showToast('已加入购物车');
        document.getElementById('cartSidebar')?.classList.add('open');
    }

    function removeFromCart(index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        updateCartCount();
        renderCartItems();
    }

    function renderCartItems() {
        const container = document.getElementById('cartItems');
        if (!container) return;
        const cart = getCart();
        if (cart.length === 0) {
            container.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-basket"></i><p>购物车是空的</p></div>';
        } else {
            let html = '';
            let total = 0;
            cart.forEach((it, i) => {
                const price = it.type === 'config' ? it.totalPrice : (it.price || 0);
                total += price * (it.quantity || 1);
                const name = it.type === 'config' ? '装机配置' : (it.name || '商品');
                html += `<div class="cart-item" style="padding:0.75rem 0;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
                    <div><strong>${name}</strong><br><small style="color:#6b7280">¥${price.toLocaleString()}</small></div>
                    <button class="btn btn-outline btn-sm" onclick="window.featuresRemoveCart(${i})" style="padding:0.25rem 0.5rem;"><i class="fas fa-times"></i></button>
                </div>`;
            });
            container.innerHTML = html;
            const totalEl = document.querySelector('.total-price');
            if (totalEl) totalEl.textContent = '¥' + total.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
        }
    }

    function showOrderDetailModal(order, wecomNotified, wecomError) {
        document.getElementById('orderDetailModalRoot')?.remove();

        const tel = '15148605173';
        const wx = order.contact?.wechat || '88278867';
        const paymentHint = order.paymentHint || '实体店支付，以门店确认为准；在线支付未开通';
        /** 浅色字由 tech-style #orderDetailModalRoot .order-detail-card 强制覆盖，内联仅负责布局 */
        const notifyLine = wecomNotified
            ? '<p class="od-notify-ok" style="margin:0">✅ 已自动通知管理员，请保持电话/微信畅通</p>'
            : `<p class="od-notify-warn" style="margin:0">⚠️ 自动通知未送达（${escapeHtml(wecomError || '未知原因')}）。请截图本页或复制详单，联系 <strong>${escapeHtml(tel)}</strong> / 微信 <strong>${escapeHtml(wx)}</strong></p>`;

        const rowsHtml = (order.rows || []).map(r => `
            <tr>
                <td style="padding:.4rem;border:1px solid #e5e7eb">${escapeHtml(r.category)}</td>
                <td style="padding:.4rem;border:1px solid #e5e7eb">${escapeHtml(r.name)}</td>
                <td class="od-cell-muted" style="padding:.4rem;border:1px solid #e5e7eb">${escapeHtml(r.brand)}</td>
                <td class="od-cell-muted" style="padding:.4rem;border:1px solid #e5e7eb">${escapeHtml(r.specs)}</td>
                <td style="padding:.4rem;border:1px solid #e5e7eb;text-align:right">¥${Number(r.unitPrice).toLocaleString('zh-CN')}</td>
                <td style="padding:.4rem;border:1px solid #e5e7eb;text-align:right">¥${Number(r.subtotal).toLocaleString('zh-CN')}</td>
            </tr>`).join('');

        const wrap = document.createElement('div');
        wrap.id = 'orderDetailModalRoot';
        wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:99999;padding:12px';
        wrap.innerHTML = `
            <div class="order-detail-card" style="border-radius:1rem;padding:1.5rem 2rem;max-width:760px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 50px -12px rgba(0,0,0,.25)">
                <h2 style="margin:0 0 1rem;font-size:1.25rem">✅ 订单提交成功</h2>
                <p class="od-muted" style="font-size:.9rem;margin:0 0 1rem">订单号：<strong>${escapeHtml(order.orderId)}</strong>　时间：<span>${escapeHtml(order.createdAt)}</span></p>
                ${order.user ? `<p class="od-muted" style="font-size:.9rem;margin:0 0 1rem">客户：${escapeHtml(order.user.name || '')}（${escapeHtml(order.user.email || '')}）</p>` : ''}
                <table style="width:100%;border-collapse:collapse;font-size:.875rem">
                    <thead><tr>
                        <th style="padding:.45rem;border:1px solid #e5e7eb;text-align:left">分类</th>
                        <th style="padding:.45rem;border:1px solid #e5e7eb;text-align:left">型号</th>
                        <th style="padding:.45rem;border:1px solid #e5e7eb;text-align:left">品牌</th>
                        <th style="padding:.45rem;border:1px solid #e5e7eb;text-align:left">规格</th>
                        <th style="padding:.45rem;border:1px solid #e5e7eb;text-align:right">单价</th>
                        <th style="padding:.45rem;border:1px solid #e5e7eb;text-align:right">小计</th>
                    </tr></thead>
                    <tbody>${rowsHtml}</tbody>
                </table>
                <h3 class="od-total-line" style="text-align:right;margin:.75rem 0 0">合计：¥${Number(order.total).toLocaleString('zh-CN')}</h3>
                <div class="od-paybox" style="border-radius:.5rem;padding:1rem;font-size:.9rem;margin-top:.75rem">
                    <p class="od-pay-line" style="margin:0 0 .5rem;line-height:1.5"><span aria-hidden="true">💳</span> <strong>支付说明</strong>：${escapeHtml(paymentHint)}</p>
                    <p class="od-pay-line" style="margin:0 0 .35rem;line-height:1.55"><span aria-hidden="true">📞</span> 电话：<strong class="od-contact">${escapeHtml(tel)}</strong>　<span aria-hidden="true">微</span>：<strong class="od-contact">${escapeHtml(wx)}</strong></p>
                    ${notifyLine}
                </div>
                <div style="text-align:right;margin-top:1.25rem">
                    <button type="button" class="btn btn-primary" id="orderDetailModalClose">关闭</button>
                </div>
            </div>`;
        document.body.appendChild(wrap);
        const close = () => wrap.remove();
        wrap.querySelector('#orderDetailModalClose').onclick = close;
        wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    }

    function escapeHtml(s) {
        return String(s ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    async function checkout() {
        const cart = getCart();
        if (cart.length === 0) { showToast('购物车是空的', 'error'); return; }
        const user = getCurrentUser();
        if (!user) {
            showToast('请先登录以完成结算', 'info');
            document.getElementById('cartSidebar')?.classList.remove('open');
            setTimeout(() => showLoginModal(), 300);
            return;
        }

        const phoneEl = document.getElementById('customerPhone');
        const phone = phoneEl ? phoneEl.value.trim() : '';
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            showToast('请填写正确的手机号（11位）', 'error');
            if (phoneEl) { phoneEl.focus(); phoneEl.style.borderColor = '#ef4444'; }
            return;
        }
        if (phoneEl) phoneEl.style.borderColor = '#d1d5db';

        const payload = {
            cart,
            user: {
                name: user.nickname || user.email || user.name || '用户',
                email: user.email || '',
                nickname: user.nickname,
                phone,
            },
        };

        try {
            const res = await fetch('/api/orders/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
                throw new Error(data.error || res.statusText || '结算失败');
            }

            showToast('订单已提交', 'success');
            showOrderDetailModal(data.order, !!data.wecomNotified, data.wecomError);
            saveCart([]);
            updateCartCount();
            renderCartItems();
            document.getElementById('cartSidebar')?.classList.remove('open');
        } catch (e) {
            const msg = (e && e.message) ? e.message : '网络错误';
            showToast('结算失败：' + msg + '，请截图联系15148605173', 'error');
        }
    }

    function buyNow() {
        const { config, total } = getEffectivePcConfig();
        addConfigToCart(config, total);
    }

    function showLoginModal() {
        const wrap = document.createElement('div');
        wrap.className = 'login-modal-overlay';
        wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000';
        wrap.innerHTML = `
            <div class="login-modal" style="background:#fff;border-radius:1rem;padding:2rem;max-width:400px;width:90%;box-shadow:0 20px 25px -5px rgba(0,0,0,0.2)">
                <h3 style="text-align:center;margin-bottom:1.5rem">登录 / 注册</h3>
                <div style="margin-bottom:1rem">
                    <label>账号 / 邮箱</label>
                    <input type="text" id="loginEmail" placeholder="账号或邮箱" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem">
                </div>
                <div style="margin-bottom:1rem">
                    <label>密码</label>
                    <input type="password" id="loginPwd" placeholder="密码" style="width:100%;padding:0.5rem;border:1px solid #d1d5db;border-radius:0.375rem">
                </div>
                <div style="display:flex;gap:0.5rem">
                    <button class="btn btn-outline" id="loginDo" style="flex:1">登录</button>
                    <button class="btn btn-primary" id="registerDo" style="flex:1">注册</button>
                    <button class="btn" id="loginClose" style="flex:0">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(wrap);
        const close = () => wrap.remove();

        wrap.querySelector('#loginClose').onclick = close;
        wrap.onclick = e => { if (e.target === wrap) close(); };

        wrap.querySelector('#loginDo').onclick = async () => {
            const email = wrap.querySelector('#loginEmail').value.trim();
            const pwd = wrap.querySelector('#loginPwd').value;
            if (!email || !pwd) { showToast('请填写邮箱和密码', 'error'); return; }
            try {
                let res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: pwd }),
                });
                let data = await res.json().catch(() => ({}));
                if (res.ok && data.token && window.apiService) {
                    window.apiService.setToken(data.token);
                    setCurrentUser({ email: data.user.email, nickname: data.user.username || data.user.email });
                    close();
                    showToast('登录成功');
                    updateLoginUI();
                    return;
                }
                const users = getUsers();
                const u = users.find(x => x.email === email && x.password === pwd);
                if (u && window.apiService) {
                    const reg = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email,
                            username: u.nickname || email.split('@')[0],
                            password: pwd,
                        }),
                    });
                    const regData = await reg.json().catch(() => ({}));
                    if (reg.ok && regData.token) {
                        window.apiService.setToken(regData.token);
                        setCurrentUser({ email: regData.user.email, nickname: regData.user.username || regData.user.email });
                        close();
                        showToast('账户已同步到服务器，登录成功');
                        updateLoginUI();
                        return;
                    }
                    res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password: pwd }),
                    });
                    data = await res.json().catch(() => ({}));
                    if (res.ok && data.token) {
                        window.apiService.setToken(data.token);
                        setCurrentUser({ email: data.user.email, nickname: data.user.username || data.user.email });
                        close();
                        showToast('登录成功');
                        updateLoginUI();
                        return;
                    }
                }
                showToast((data && data.error) ? data.error : '邮箱或密码错误', 'error');
            } catch (e) {
                showToast('网络错误', 'error');
            }
        };

        wrap.querySelector('#registerDo').onclick = async () => {
            const email = wrap.querySelector('#loginEmail').value.trim();
            const pwd = wrap.querySelector('#loginPwd').value;
            if (!email || !pwd) { showToast('请填写邮箱和密码', 'error'); return; }
            const users = getUsers();
            if (users.some(x => x.email === email)) { showToast('该邮箱已注册', 'error'); return; }
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        username: email.split('@')[0],
                        password: pwd,
                    }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || !data.token || !window.apiService) {
                    showToast((data && data.error) ? data.error : '注册失败', 'error');
                    return;
                }
                window.apiService.setToken(data.token);
                users.push({ email, password: pwd, nickname: email.split('@')[0] });
                saveUsers(users);
                setCurrentUser({ email, nickname: email.split('@')[0] });
                close();
                showToast('注册成功');
                updateLoginUI();
            } catch (e) {
                showToast('网络错误', 'error');
            }
        };
    }

    function updateLoginUI() {
        const u = getCurrentUser();
        const btn = document.getElementById('loginBtn');
        if (!btn) return;
        btn.innerHTML = u ? `<i class="fas fa-user-check"></i> ${u.nickname || u.email} <small style="opacity:0.8">(点击退出)</small>` : '<i class="fas fa-user"></i> 登录';
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.onclick = () => {
            if (getCurrentUser()) {
                setCurrentUser(null);
                if (window.apiService) window.apiService.setToken(null);
                updateLoginUI();
                showToast('已退出登录');
            } else {
                showLoginModal();
            }
        };
    }

    function loadCommunity() {
        const section = document.getElementById('community');
        if (!section) return;
        const posts = getPosts();
        const list = section.querySelector('.community-posts-list');
        if (!list) return;
        list.innerHTML = posts.map(p => `
            <div class="community-post" style="background:#fff;border-radius:0.5rem;padding:1rem;margin-bottom:1rem;border:1px solid #e5e7eb">
                <h4 style="margin:0 0 0.5rem">${escapeHtml(p.title)}</h4>
                <p style="color:#6b7280;margin:0 0 0.5rem">${escapeHtml(p.content)}</p>
                <small style="color:#9ca3af">${escapeHtml(p.author)} · ${new Date(p.time).toLocaleDateString()} · ${p.likes || 0} 赞</small>
            </div>
        `).join('');
    }

    /** 不依赖 window.app，避免 app 初始化失败时「我的订单」永远不绑定 */
    function bindMyOrdersNavButton() {
        const myOrdersBtn = document.getElementById('myOrdersBtn');
        if (!myOrdersBtn || myOrdersBtn.dataset.lxOrdersBound === '1') return;
        myOrdersBtn.dataset.lxOrdersBound = '1';
        myOrdersBtn.onclick = (ev) => {
            ev.preventDefault();
            if (typeof window.features.openMyOrdersModal === 'function') {
                window.features.openMyOrdersModal();
            } else {
                showToast('订单模块未就绪，请刷新页面重试', 'error');
            }
        };
    }

    function init() {
        bindMyOrdersNavButton();
        if (!window.app) return;

        window.featuresRemoveCart = removeFromCart;

        window.app.addCurrentConfigToCart = function() {
            const { config, total } = getEffectivePcConfig();
            addConfigToCart(config, total);
        };
        window.app.updateCartCount = function() { updateCartCount(); };
        window.app.updateUserUI = function() { updateLoginUI(); };
        window.app.buyNow = buyNow;
        window.app.toggleCart = toggleCart;

        updateCartCount();
        renderCartItems();
        updateLoginUI();
        loadCommunity();

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.onclick = checkout;

        const publishBtn = document.getElementById('publishPostBtn');
        if (publishBtn) {
            publishBtn.onclick = () => {
                const title = document.getElementById('newPostTitle')?.value?.trim();
                const content = document.getElementById('newPostContent')?.value?.trim();
                if (!title || !content) { showToast('请填写标题和内容', 'error'); return; }
                const user = getCurrentUser();
                const posts = getPosts();
                posts.unshift({ id: 'p' + Date.now(), title, content, author: user?.nickname || '游客', time: Date.now(), likes: 0 });
                savePosts(posts);
                loadCommunity();
                document.getElementById('newPostTitle').value = '';
                document.getElementById('newPostContent').value = '';
                showToast('发布成功');
            };
        }

        // 覆盖 interactionFixer 的 toggleCart / showLoginModal（勿再覆盖 addToCart——fix-interactions.js 已实现完整逻辑含 syncCardToBuilder）
        if (window.interactionFixer) {
            window.interactionFixer.toggleCart = toggleCart;
            window.interactionFixer.showLoginModal = showLoginModal;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 150));
    } else {
        setTimeout(init, 150);
    }
})();

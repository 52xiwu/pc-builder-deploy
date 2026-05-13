/**
 * 方案B：我的订单（需登录）
 * 挂载到 window.features 上（由 features.js 初始化）
 */

(function () {
    if (!window.features) return;

    const { showToast } = window.features;

    /** 与 features.js 一致：本地登录用户存在 pcbuilder_user，未必有 auth_token */
    function getLocalSessionUser() {
        try {
            const raw = localStorage.getItem('pcbuilder_user');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    /**
     * 仅 JWT（/api/orders/me）。公开 /mine 已关闭以防邮箱枚举。
     */
    async function fetchOrdersForMe() {
        const token = localStorage.getItem('auth_token');
        if (!token || !window.apiService) {
            const err = new Error('请先登录查看订单');
            err.code = 'NO_SESSION';
            throw err;
        }
        window.apiService.token = token;
        return window.apiService.getMyOrders();
    }

    // ── 我的订单 ────────────────────────────────────────

    function openMyOrdersModal() {
        const existing = document.getElementById('myOrdersModalRoot');
        if (existing) { existing.remove(); }

        const wrap = document.createElement('div');
        wrap.id = 'myOrdersModalRoot';
        wrap.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:99998;padding:12px';
        wrap.innerHTML = `
            <div style="background:#fff;border-radius:1rem;padding:2rem;max-width:800px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 25px -5px rgba(0,0,0,.2)">
                <h3 style="margin:0 0 1.25rem;text-align:center">📋 我的订单</h3>
                <div id="moContent" style="flex:1;overflow-y:auto">
                    <p style="text-align:center;color:#6b7280;padding:2rem 0">加载中…</p>
                </div>
                <div style="text-align:right;margin-top:1rem">
                    <button class="btn btn-outline" id="moClose">关闭</button>
                </div>
            </div>`;

        document.body.appendChild(wrap);
        wrap.querySelector('#moClose').onclick = () => wrap.remove();
        wrap.addEventListener('click', e => { if (e.target === wrap) wrap.remove(); });

        loadMyOrders(wrap);
    }

    async function loadMyOrders(wrap) {
        const el = wrap.querySelector('#moContent');

        const localUser = getLocalSessionUser();
        const token = localStorage.getItem('auth_token');
        if (!token && (!localUser || !String(localUser.email || '').trim())) {
            el.innerHTML = `
                <div style="text-align:center;padding:2rem 0">
                    <p style="margin:0 0 1rem;color:#374151">请先登录查看订单</p>
                    <button class="btn btn-primary" id="moLogin">去登录</button>
                </div>`;
            el.querySelector('#moLogin').onclick = () => {
                wrap.remove();
                window.showLoginModal();
            };
            return;
        }

        try {
            const data = await fetchOrdersForMe();
            renderMyOrders(wrap, data);
        } catch (e) {
            if (e.code === 'NO_SESSION') {
                el.innerHTML = `
                <div style="text-align:center;padding:2rem 0">
                    <p style="margin:0 0 1rem;color:#374151">请先登录查看订单</p>
                    <button class="btn btn-primary" id="moLogin">去登录</button>
                </div>`;
                el.querySelector('#moLogin').onclick = () => {
                    wrap.remove();
                    window.showLoginModal();
                };
                return;
            }
            el.innerHTML = `<p style="text-align:center;color:#ef4444;padding:2rem 0">加载失败：${e.message}</p>`;
        }
    }

    function renderMyOrders(wrap, data) {
        const el = wrap.querySelector('#moContent');

        if (!data.ok || !data.orders || data.orders.length === 0) {
            el.innerHTML = `<div style="text-align:center;padding:3rem 0"><p style="color:#6b7280;margin:0">暂无订单，去 <a href="#builder" onclick="document.getElementById('myOrdersModalRoot').remove()" style="color:#3b82f6">配置一台电脑</a> 吧</p></div>`;
            return;
        }

        const cards = data.orders.map(o => `
            <div class="mo-card" style="border:1px solid #e5e7eb;border-radius:.75rem;padding:1rem;margin-bottom:.75rem">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
                    <div>
                        <span style="font-family:monospace;font-size:.8rem;color:#374151">${o.orderId}</span>
                        <span style="margin-left:.75rem;font-size:.75rem;color:#9ca3af">${o.createdAt}</span>
                    </div>
                    <span class="order-status-chip status-${o.status || 'pending'}">${statusLabel(o.status)}</span>
                </div>
                <div style="font-size:.8rem;color:#6b7280;margin-bottom:.5rem">共 ${o.rows?.length || 0} 项，合计 <strong style="color:#059669;font-size:1rem">¥${Number(o.total).toLocaleString()}</strong></div>
                <div style="display:flex;gap:.5rem;flex-wrap:wrap">
                    <button class="btn btn-outline btn-sm" onclick="window.features.viewOrderDetail('${o.orderId}')">查看详情</button>
                    ${o.status === 'pending' ? `<button class="btn btn-outline btn-sm" style="color:#ef4444" onclick="window.features.cancelOrder('${o.orderId}', this)">取消订单</button>` : ''}
                </div>
            </div>`).join('');

        el.innerHTML = `<div style="padding:0 .5rem">${cards}</div>`;
    }

    // ── 订单详情 ──────────────────────────────────────

    window.features.viewOrderDetail = async function (orderId) {
        try {
            const data = await fetchOrdersForMe();
            const order = data.orders?.find(o => o.orderId === orderId);
            if (order) {
                window.features.showOrderDetailModal(order, order.wecomNotified, null);
            } else {
                showToast('未找到该订单', 'error');
            }
        } catch (e) {
            showToast('加载订单详情失败', 'error');
        }
    };

    window.features.cancelOrder = async function (orderId, btn) {
        if (!confirm('确定要取消订单 ' + orderId + ' 吗？')) return;
        btn.disabled = true;
        btn.textContent = '取消中…';
        try {
            await window.apiService.updateOrderStatus(orderId, 'cancelled');
            showToast('订单已取消', 'success');
            const wrap = document.getElementById('myOrdersModalRoot');
            if (wrap) loadMyOrders(wrap);
        } catch (e) {
            showToast('取消失败：' + e.message, 'error');
            btn.disabled = false;
            btn.textContent = '取消订单';
        }
    };

    // ── 辅助 ───────────────────────────────────────────

    function statusLabel(s) {
        return { pending: '待处理', cancelled: '已取消', confirmed: '已确认' }[s] || '待处理';
    }

    // 状态样式
    if (!document.getElementById('moStyles')) {
        const style = document.createElement('style');
        style.id = 'moStyles';
        style.textContent = `
            .order-status-chip{padding:.15rem .5rem;border-radius:999px;font-size:.7rem;font-weight:600}
            .status-pending{background:#fef3c7;color:#92400e}
            .status-confirmed{background:#d1fae5;color:#065f46}
            .status-cancelled{background:#fee2e2;color:#991b1b}
            .btn-sm{padding:.25rem .75rem;font-size:.8rem}
        `;
        document.head.appendChild(style);
    }

    // ── 导出 ──────────────────────────────────────────

    window.features.openMyOrdersModal = openMyOrdersModal;

})();

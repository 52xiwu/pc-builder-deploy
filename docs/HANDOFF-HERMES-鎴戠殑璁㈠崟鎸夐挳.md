# 我的订单按钮 — 发版文档

## 根因

1. **`orders-lookup.js` 未被引用**：HTML 中 `orders-lookup.js` 只在 `/tmp/pc-builder/` 存在，但 Express static 配置为 `app.use(express.static('../'))`（从 `/tmp` 根开始），服务器实际 serving `/tmp/` 下的文件，导致 404。
2. **`window.features` 不存在**：`features.js` 从未创建 `window.features` 对象，`orders-lookup.js` 的 IIFE 第 5 行 `if (!window.features) return` 立即退出，整个模块失效。
3. **执行顺序问题**：即便 `window.features` 存在，HTML 中 `orders-lookup.js` 在 `features.js` 之后引入，但 `orders-lookup.js` 的 IIFE 是**同步执行**的——`features.js` 的 `init()` 等 DOMContentLoaded + 150ms 才执行，`window.features` 还不存在。
4. **`customerTel is not defined`**：`notifyFeishu(order)` 调用时 `order` 对象里没有 `customerTel` 属性（`customerTel` 是未赋值的局部变量）。
5. **Toast 被 modal 挡住**：toast z-index 为 10002，订单详单 modal z-index 为 99999，toast 显示在 modal 后面。
6. **结算成功后顺序不对**：`showToast('订单已提交')` 在 `showOrderDetailModal` 之后执行，modal 关闭前用户看不到。

## 文件清单

| 文件 | 路径 | 作用 |
|------|------|------|
| `index.html` | `/tmp/index.html` | nav 中有 `#myOrdersBtn`；`features.js` 下一行引用 `orders-lookup.js` |
| `features.js` | `/tmp/features.js` | `window.features = { showToast }` 和 `window.showLoginModal` 在加载时即挂载；toast z-index 100050；结算成功先 toast 再 modal |
| `orders-lookup.js` | `/tmp/orders-lookup.js` | DOMContentLoaded 绑定按钮；`GET /api/orders/mine` 取数据；未登录调 `window.showLoginModal` |
| `orders.js` | `/tmp/orders.js`（路由） | `GET /api/orders/mine?email=&nickname=` 过滤；`PUT /:orderId` 改状态；`customerTel` 写入 order 对象 |
| `data/orders.json` | `/tmp/pc-builder/data/orders.json` | 订单数据持久化 |

### 部署路径对应关系

- 服务器 Node 进程：`/tmp/pc-builder/server.js`，static 为 `../`（即 `/tmp/`）
- **前端文件实际 serving 路径**：`/tmp/*.js`、`/tmp/index.html`
- **后端路由文件**：`/tmp/orders.js`（同步自 `/tmp/pc-builder/backend/routes/orders.js`）
- **订单数据**：`/tmp/pc-builder/data/orders.json`

修改任一源文件后需同步到对应 serving 路径，再重启 Node。

## API

### GET /api/orders/mine

查询当前用户的订单。

**参数**（query）：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | string | 二选一 | 用户邮箱，精确匹配下单时 email |
| `nickname` | string | 二选一 | 用户昵称，精确匹配下单时 user.name |

**响应**：
```json
{
  "ok": true,
  "orders": [{
    "orderId": "ORD...",
    "createdAt": "2026/5/13 03:59:05",
    "total": 9999,
    "status": "pending",
    "rows": [...],
    "paymentHint": "实体店支付，以门店确认为准；在线支付未开通",
    "contact": { "tel": "...", "wechat": "..." },
    "wecomNotified": true,
    "wecomError": null
  }]
}
```

### PUT /api/orders/:orderId

更新订单状态（目前支持 `cancelled`）。

**请求体**：`{ "status": "cancelled" }`

**响应**：`{ "ok": true, "order": {...} }`

## features.js 关键设计

```javascript
// 脚本加载时即挂上（同步执行时其他脚本也能拿到）
window.features = { showToast };
window.showLoginModal = showLoginModal;
```

```javascript
// showToast z-index 高于订单详单 modal
z-index:100050   // modal 是 99999
```

```javascript
// checkout 成功后：先 toast，再 modal
showToast('订单已提交', 'success');
showOrderDetailModal(data.order, !!data.wecomNotified, data.wecomError);
saveCart([]);
updateCartCount();
renderCartItems();
document.getElementById('cartSidebar')?.classList.remove('open');
```

## orders-lookup.js 按钮绑定

```javascript
function bindButton() {
    const btn = document.getElementById('myOrdersBtn');
    if (!btn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindButton);
        }
        return;
    }
    btn.addEventListener('click', openMyOrdersModal);
}
bindButton();
```

## 验收

1. **我的订单按钮**：刷新首页，点击「我的订单」按钮 → 弹出模态框显示订单列表（已登录）或提示登录（未登录）
2. **订单提交提示**：完成结算 → toast "订单已提交" 立即出现 → 然后订单详单 modal 弹出
3. **企微通知**：`customerTel` 不再报 undefined，订单通知卡片正确显示客户手机号
4. **API 测试**：
   ```bash
   curl "http://localhost:3000/api/orders/mine?email=test@test.com"
   # {"ok":true,"orders":[...]}
   ```

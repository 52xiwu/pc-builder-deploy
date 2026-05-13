/**
 * POST /api/orders/checkout
 * localStorage 购物车 → 服务端落库 + 企微群机器人通知
 * 环境变量：WECOM_ORDER_WEBHOOK=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=XXX
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ROOT = path.resolve(__dirname, '../../'); // 站点根 = backend/routes 上两级
const ORDERS_FILE = path.join(ROOT, 'data', 'orders.json');
const ORDERS_LOG  = path.join(ROOT, 'logs', 'orders.log');

// ── 辅助 ───────────────────────────────────────────────

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg) {
  ensureDir(ORDERS_LOG);
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(ORDERS_LOG, line);
}

/** 服务端重算总价（防前端篡改） */
function recalcServerTotal(cart) {
  let total = 0;
  for (const it of cart) {
    if (it.type === 'config') {
      // config: totalPrice = 固定值（前端传入），items 仅用于展示
      const itemsSum = (it.items || []).reduce((s, i) => s + (i.price || 0), 0);
      // 若 totalPrice 显著低于 items 价和（>1%），说明前端传错了，用 items 价和
      const expected = itemsSum + 299; // SERVICE_FEE
      const line = (it.totalPrice >= expected * 0.99) ? it.totalPrice : expected;
      total += line * (it.quantity || 1);
    } else {
      // single
      total += (it.price || 0) * (it.quantity || 1);
    }
  }
  return Math.round(total);
}

/** 展开 cart → 表格行 */
function buildRows(cart) {
  const rows = [];
  for (const it of cart) {
    if (it.type === 'config') {
      for (const item of (it.items || [])) {
        rows.push({
          category:  item.category  || '—',
          name:      item.name      || '—',
          brand:     item.brand     || '—',
          specs:     item.specs     || '—',
          unitPrice: item.price     || 0,
          subtotal:  item.price     || 0,
        });
      }
    } else {
      rows.push({
        category:  it.category  || '单品',
        name:      it.name      || '—',
        brand:     it.brand     || '—',
        specs:     it.specs     || '—',
        unitPrice: it.price     || 0,
        subtotal:  (it.price || 0) * (it.quantity || 1),
      });
    }
  }
  return rows;
}

/** 飞书群机器人 Interactive Card 通知 */
async function notifyFeishu(order) {
  const webhookUrl = process.env.FEISHU_ORDER_WEBHOOK;
  if (!webhookUrl) return { ok: false, reason: 'FEISHU_ORDER_WEBHOOK not set' };

  const rows = order.rows.map(r =>
    `| ${r.category} | ${r.name} | ${r.brand} | ${r.specs || '—'} | ¥${r.unitPrice} | ¥${r.subtotal} |`
  ).join('\n');

  const contact = order.contact;
  const card = {
    msg_type: 'interactive',
    card: {
      config: { wide_screen_mode: true },
      elements: [
        {
          tag: 'markdown',
          content: `**🖥️ 新订单通知**\n> **订单号：** \`${order.orderId}\`\n> **时间：** ${order.createdAt}\n> **客户：** ${order.user?.name || '游客'}（${order.user?.email || '未登录'}）\n> **总额：** **¥${order.total.toLocaleString()}**`
        },
        { tag: 'hr' },
        {
          tag: 'markdown',
          content: `| 分类 | 型号 | 品牌 | 规格 | 单价 | 小计 |\n|------|------|------|------|------|------|\n${rows}`
        },
        { tag: 'hr' },
        {
          tag: 'markdown',
          content: `📞 **客户手机：** ${order.user?.phone || '未填'}　🏪 **门店电话：** 15148605173（仅限门店查询）\n💳 **支付说明：** ${order.paymentHint}`
        }
      ]
    }
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    const json = await res.json();
    if (json.code === 0 || json.StatusCode === 0) return { ok: true };
    return { ok: false, reason: `feishu code=${json.code} msg=${json.msg || ''}` };
  } catch (e) {
    return { ok: false, reason: 'fetch failed: ' + e.message };
  }
}

/** 原子写 orders.json（先写临时文件再 rename） */
function appendOrder(order) {
  ensureDir(ORDERS_FILE);
  const tmp = ORDERS_FILE + '.' + process.pid + '.tmp';
  let existing = [];
  try { existing = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); } catch {}
  existing.push(order);
  fs.writeFileSync(tmp, JSON.stringify(existing, null, 2), 'utf8');
  fs.renameSync(tmp, ORDERS_FILE);
}

function timingSafeStringEqual(a, b) {
  const sa = String(a);
  const sb = String(b);
  if (sa.length !== sb.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(sa, 'utf8'), Buffer.from(sb, 'utf8'));
  } catch {
    return false;
  }
}

function bearerToken(req) {
  const h = req.headers.authorization;
  return h && h.split(' ')[1];
}

/** 订单写权限：ADMIN_API_KEY 或 JWT 邮箱与订单 user.email 一致 */
function assertCanModifyOrder(req, orderRow) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey && req.headers['x-admin-key'] && timingSafeStringEqual(req.headers['x-admin-key'], adminKey)) {
    return true;
  }
  const token = bearerToken(req);
  if (!token) return false;
  let u;
  try {
    u = jwt.verify(token, JWT_SECRET);
  } catch {
    return false;
  }
  const je = String(u.email || '').trim().toLowerCase();
  const oe = String(orderRow.user?.email || '').trim().toLowerCase();
  return Boolean(je && oe && je === oe);
}

// ── 路由 ───────────────────────────────────────────────

/**
 * 我的订单（需登录）
 * GET /api/orders/me
 * Header: Authorization: Bearer <token>
 */
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ ok: false, error: '未登录' });

  let user;
  try {
    user = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(403).json({ ok: false, error: '令牌无效' });
  }

  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch { orders = []; }

  const want = String(user.email || '').trim().toLowerCase();

  // 只返回该用户（按 email）的订单
  const mine = orders
    .filter(o => String(o.user?.email || '').trim().toLowerCase() === want)
    .map(o => ({
      orderId:   o.orderId,
      createdAt: o.createdAt,
      total:     o.total,
      status:    o.status || 'pending',
      rows:      o.rows,
      paymentHint: o.paymentHint,
      contact:   o.contact,
      wecomNotified: o.wecomNotified,
      wecomError:    o.wecomError,
    }));

  res.json({ ok: true, orders: mine });
});

/**
 * 订单操作（取消/修改状态）
 * POST /api/orders/:orderId/update
 */
router.post('/:orderId/update', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!['pending', 'cancelled', 'confirmed'].includes(status)) {
    return res.status(400).json({ ok: false, error: '无效状态' });
  }

  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch { orders = []; }

  const idx = orders.findIndex(o => o.orderId === orderId);
  if (idx === -1) return res.status(404).json({ ok: false, error: '订单不存在' });

  if (!assertCanModifyOrder(req, orders[idx])) {
    return res.status(403).json({ ok: false, error: '无权修改此订单' });
  }

  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toLocaleString('zh-CN');

  const tmp = ORDERS_FILE + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(orders, null, 2), 'utf8');
  fs.renameSync(tmp, ORDERS_FILE);

  log(`order_update orderId=${orderId} status=${status}`);
  res.json({ ok: true, order: orders[idx] });
});

/**
 * 已废弃：公开 query 拉单存在信息泄露。请使用 GET /api/orders/me + JWT。
 */
router.get('/mine', (req, res) => {
  res.status(410).json({
    ok: false,
    error: '此接口已关闭。请使用网站「登录」后通过 JWT 访问 /api/orders/me',
  });
});

/**
 * 更新订单状态
 * PUT /api/orders/:orderId
 */
router.put('/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!['pending', 'cancelled', 'confirmed'].includes(status)) {
    return res.status(400).json({ ok: false, error: '无效状态' });
  }

  let orders = [];
  try {
    orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  } catch { orders = []; }

  const idx = orders.findIndex(o => o.orderId === orderId);
  if (idx === -1) return res.status(404).json({ ok: false, error: '订单不存在' });

  if (!assertCanModifyOrder(req, orders[idx])) {
    return res.status(403).json({ ok: false, error: '无权修改此订单' });
  }

  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toLocaleString('zh-CN');

  const tmp = ORDERS_FILE + '.' + process.pid + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(orders, null, 2), 'utf8');
  fs.renameSync(tmp, ORDERS_FILE);

  log(`order_update orderId=${orderId} status=${status}`);
  res.json({ ok: true, order: orders[idx] });
});

router.post('/checkout', async (req, res) => {
  let cart, user;
  try {
    ({ cart, user } = req.body);
  } catch {
    return res.status(400).json({ ok: false, error: '请求体格式错误', order: null });
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ ok: false, error: '购物车为空', order: null });
  }

  const total       = recalcServerTotal(cart);
  const rows        = buildRows(cart);
  const orderId     = 'ORD' + Date.now();
  const createdAt   = new Date().toLocaleString('zh-CN');
  const contact     = { tel: '15148605173', wechat: '88278867' };
  const paymentHint = '实体店支付，以门店确认为准；在线支付未开通';

  const order = {
    orderId, createdAt,
    user: user || null,
    total, rows,
    paymentHint,
    contact,
    cartSnapshot: cart,          // 原始购物车快照
    wecomNotified: false,
    wecomError: null,
    createdTs: Date.now(),       // 时间戳（排序用）
  };

  // 写进 order 对象供 notifyFeishu 使用（contact.tel 用 user.phone）
  order.customerTel = user?.phone || null;
  if (!order.contact) order.contact = { tel: user?.phone || '15148605173', wechat: '88278867' };
  else order.contact.tel = user?.phone || '15148605173';

  // 1. 飞书通知（先发，成功后再落库，wecomNotified 与事实一致）
  let wecomResult = { ok: false, reason: 'skip' };
  try {
    wecomResult = await notifyFeishu(order);
    order.wecomNotified = wecomResult.ok;
    order.wecomError    = wecomResult.ok ? null : wecomResult.reason;
  } catch (e) {
    order.wecomNotified = false;
    order.wecomError    = 'exception: ' + e.message;
    log(`wecom_exception orderId=${orderId} error=${e.message}\n${e.stack}`);
  }

  // 2. 落库
  try {
    appendOrder(order);
  } catch (e) {
    log(`persist_fail orderId=${orderId} error=${e.message}`);
    // 落库失败仍返回 500，但订单已通知企微（若有）
    return res.status(500).json({ ok: false, error: '订单保存失败', order: null });
  }

  log(`checkout orderId=${orderId} total=${total} wecom=${wecomResult.ok} user=${user?.email || 'guest'}`);

  return res.json({
    ok: true,
    order: { orderId, createdAt, user: order.user, total, rows, paymentHint, contact },
    wecomNotified: order.wecomNotified,
    wecomError:    order.wecomError || undefined,
  });
});

module.exports = router;

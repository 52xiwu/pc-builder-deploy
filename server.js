/**
 * 电脑硬件销售网站 - 完整后端服务器
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// 中间件
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(
    cors(
        ALLOWED_ORIGINS.length
            ? { origin: ALLOWED_ORIGINS }
            : { origin: true },
    ),
);
app.use(express.json({ limit: '15mb' }));
// 从本目录提供 index.html、静态资源（原 ../ 在仅解压 pc-builder 子目录时会 404）
app.use(express.static(__dirname));

let db;

async function initializeDatabase() {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });
    
    // 创建表
    await db.exec(`
        -- 用户表
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        );
        
        -- 硬件产品表
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            specs TEXT,
            price DECIMAL(10, 2) NOT NULL,
            brand TEXT,
            image_url TEXT,
            stock INTEGER DEFAULT 100,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        -- 购物车表
        CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
        
        -- 订单表
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            order_number TEXT UNIQUE NOT NULL,
            total_amount DECIMAL(10, 2) NOT NULL,
            status TEXT DEFAULT 'pending',
            shipping_address TEXT,
            billing_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        
        -- 订单项表
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
        
        -- 保存的配置表
        CREATE TABLE IF NOT EXISTS configurations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            config_data TEXT NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL,
            is_public BOOLEAN DEFAULT false,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        
        -- 创建索引
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
        CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
        CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    `);
    
    // 插入示例数据
    await seedDatabase();
    
    console.log('✅ 数据库初始化完成');
}

async function seedDatabase() {
    // 检查是否已有数据
    const productCount = await db.get('SELECT COUNT(*) as count FROM products');
    if (productCount.count > 0) return;
    
    console.log('🌱 插入示例数据...');
    
    // 插入硬件产品
    const products = [
        // CPU
        ['cpu', 'Intel Core i9-14900K', '旗舰级24核心处理器', '24核心/32线程 3.2-6.0GHz', 4299.00, 'intel', 'cpu_intel_i9.jpg', 50],
        ['cpu', 'AMD Ryzen 9 7950X', '16核心高性能处理器', '16核心/32线程 4.5-5.7GHz', 3999.00, 'amd', 'cpu_amd_7950x.jpg', 60],
        ['cpu', 'Intel Core i7-14700K', '高性能游戏处理器', '20核心/28线程 3.4-5.6GHz', 3299.00, 'intel', 'cpu_intel_i7.jpg', 80],
        
        // GPU
        ['gpu', 'NVIDIA RTX 4090', '旗舰级24GB显卡', '24GB GDDR6X', 12999.00, 'nvidia', 'gpu_rtx4090.jpg', 30],
        ['gpu', 'NVIDIA RTX 4080 SUPER', '高性能16GB显卡', '16GB GDDR6X', 8499.00, 'nvidia', 'gpu_rtx4080s.jpg', 40],
        ['gpu', 'AMD Radeon RX 7900 XTX', '24GB高性能显卡', '24GB GDDR6', 7999.00, 'amd', 'gpu_rx7900xtx.jpg', 35],
        
        // 主板
        ['motherboard', 'ROG MAXIMUS Z790 HERO', '旗舰Z790主板', 'Intel Z790 ATX', 4999.00, 'asus', 'mb_z790_hero.jpg', 25],
        ['motherboard', 'MSI MEG X670E GODLIKE', '旗舰X670E主板', 'AMD X670E E-ATX', 6999.00, 'msi', 'mb_x670e_godlike.jpg', 20],
        
        // 内存
        ['ram', 'G.SKILL Trident Z5 RGB', '高性能DDR5内存', '32GB (2x16GB) DDR5 6000MHz', 1099.00, 'gskill', 'ram_trident_z5.jpg', 100],
        ['ram', 'CORSAIR Dominator Platinum', '旗舰DDR5内存', '64GB (2x32GB) DDR5 5600MHz', 2299.00, 'corsair', 'ram_dominator.jpg', 60],
        
        // 存储
        ['storage', 'Samsung 990 PRO', '高速NVMe SSD', '2TB NVMe PCIe 4.0', 1299.00, 'samsung', 'ssd_990pro.jpg', 120],
        ['storage', 'WD Black SN850X', '高性能NVMe SSD', '2TB NVMe PCIe 4.0', 1199.00, 'wd', 'ssd_sn850x.jpg', 100],
        
        // 散热
        ['cooling', 'NZXT Kraken 360 RGB', '360mm AIO水冷', '360mm AIO 水冷', 1299.00, 'nzxt', 'cooling_kraken360.jpg', 45],
        
        // 电源
        ['psu', 'Corsair RM1000x', '1000W金牌电源', '1000W 80 PLUS Gold', 1499.00, 'corsair', 'psu_rm1000x.jpg', 70],
        
        // 机箱
        ['case', 'Lian Li O11 Dynamic EVO', '全景侧透机箱', '中塔式 ATX', 899.00, 'lianli', 'case_o11_evo.jpg', 55]
    ];
    
    for (const product of products) {
        await db.run(
            'INSERT INTO products (category, name, description, specs, price, brand, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            product
        );
    }
    
    console.log('✅ 示例数据插入完成');
}

// 认证中间件
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: '需要认证令牌' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: '令牌无效或已过期' });
        }
        req.user = user;
        next();
    });
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

/** 管理：环境变量 ADMIN_API_KEY（X-Admin-Key）或面板登录 JWT（role=admin_panel） */
function requireAdmin(req, res, next) {
    const apiKey = process.env.ADMIN_API_KEY;
    if (apiKey && req.headers['x-admin-key'] && timingSafeStringEqual(req.headers['x-admin-key'], apiKey)) {
        return next();
    }
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: '需要管理员认证', ok: false, success: false });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (payload.role === 'admin_panel') return next();
    } catch (_) { /* invalid token */ }
    return res.status(403).json({ error: '禁止访问', ok: false, success: false });
}

// 用户认证路由
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        
        if (!email || !username || !password) {
            return res.status(400).json({ error: '请填写所有必填字段' });
        }
        
        // 检查邮箱是否已注册
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ error: '邮箱已被注册' });
        }
        
        // 哈希密码
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 创建用户
        const result = await db.run(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );
        
        // 生成JWT令牌
        const token = jwt.sign(
            { id: result.lastID, email, username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            message: '注册成功',
            token,
            user: { id: result.lastID, email, username }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: '请填写邮箱和密码' });
        }
        
        // 查找用户
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            return res.status(401).json({ error: '邮箱或密码错误' });
        }
        
        // 验证密码
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: '邮箱或密码错误' });
        }
        
        // 更新最后登录时间
        await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
        
        // 生成JWT令牌
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT id, email, username, created_at FROM users WHERE id = ?', [req.user.id]);
        res.json({ user });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.post('/api/admin/panel-login', async (req, res) => {
    try {
        const { username, password } = req.body || {};
        const okUser = process.env.ADMIN_PANEL_USER || 'admin';
        const okPass = process.env.ADMIN_PANEL_PASSWORD;
        if (!okPass) {
            return res.status(503).json({ ok: false, error: '服务器未设置 ADMIN_PANEL_PASSWORD' });
        }
        if (String(username) !== okUser || String(password) !== okPass) {
            return res.status(401).json({ ok: false, error: '用户名或密码错误' });
        }
        const token = jwt.sign({ role: 'admin_panel', sub: String(okUser) }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ ok: true, token });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// 隐藏后台入口：/gluidcadmin → admin.html
app.get('/gluidcadmin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

/** 我的 AI：校验 SQLite 用户（与 backend/server 行为一致） */
app.post('/api/login-check', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.json({ success: false, message: '请输入用户名和密码' });
    }
    try {
        const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
        if (!user) return res.json({ success: false, message: '用户不存在' });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.json({ success: false, message: '密码错误' });
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' },
        );
        return res.json({
            success: true,
            message: '登录成功',
            token,
            redirectUrl: '/index.html#home',
        });
    } catch (error) {
        console.error('[login-check]', error);
        return res.json({ success: false, message: '服务器错误' });
    }
});

// 从 hardware-v2.json 读取硬件数据（aixiwu-data-pipeline 标准）
let hardwareDb = {};
try {
    const fs = require('fs');
    const dataPath = __dirname + '/data/hardware-v2.json';
    const raw = fs.readFileSync(dataPath, 'utf8');
    const { meta, items } = JSON.parse(raw);

    // 按 category 分组，转为 { cpu: [...], gpu: [...] } 结构
    const byCategory = {};
    for (const item of items) {
        const cat = item.category; // 'cpu', 'gpu', 'monitor' 等
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(item);
    }
    hardwareDb = byCategory;
    console.log(`[hardwareDb] 从 hardware-v2.json 加载完成: ${items.length} 条，分类 ${Object.keys(byCategory).join(', ')}`);
} catch(e) {
    console.error('加载 hardware-v2.json 失败:', e.message, '| 继续使用 admin.html 兜底');
    try {
        const fs = require('fs');
        const html = fs.readFileSync(__dirname + '/admin.html', 'utf8');
        const m = html.match(/id="adminDefaultHardware">([\s\S]+?)<\/script>/);
        if (m) hardwareDb = JSON.parse(m[1]);
    } catch(e2) { console.error('admin.html 兜底也失败:', e2.message); }
}

// 硬件分类 API（供装机配置器使用）
app.get('/api/hardware/categories', (req, res) => {
    res.json({ categories: Object.keys(hardwareDb) });
});

app.get('/api/hardware/:category', (req, res) => {
    const { category } = req.params;
    if (hardwareDb[category]) {
        res.json({ products: hardwareDb[category] });
    } else {
        res.json({ products: [] });
    }
});

// 管理员读取全量硬件（供 admin.html 加载数据源）
app.get('/api/admin/hardware/all', requireAdmin, (req, res) => {
    try {
        const fs = require('fs');
        const dataPath = __dirname + '/data/hardware-v2.json';
        const raw = fs.readFileSync(dataPath, 'utf8');
        const db = JSON.parse(raw);
        res.json({ items: db.items, meta: db.meta });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// 管理员写回 hardware-v2.json（与 GET /api/hardware/:category 共用同一持久化）
app.post('/api/admin/hardware/save', requireAdmin, async (req, res) => {
    try {
        const fs = require('fs');
        const dataPath = __dirname + '/data/hardware-v2.json';
        const raw = fs.readFileSync(dataPath, 'utf8');
        const db = JSON.parse(raw);

        // 期望 body: { items: [...] } — 完整替换 items 数组（全量同步，防部分写入导致数据丢失）
        const { items } = req.body;
        if (!Array.isArray(items)) {
            return res.status(400).json({ error: 'items 必须是数组' });
        }

        // 更新 meta
        db.meta.totalItems = items.length;
        db.meta.generatedAt = new Date().toISOString();
        db.items = items;

        // 按 id 去重校验
        const ids = items.map(i => i.id);
        if (new Set(ids).size !== ids.length) {
            return res.status(400).json({ error: 'id 重复，请检查' });
        }

        // 原子写：write tmp → rename（防写入半截导致 JSON 损坏）
        const tmpPath = dataPath + '.tmp';
        fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
        fs.renameSync(tmpPath, dataPath);

        // 同步内存中的 hardwareDb（按 category 分组）
        const byCategory = {};
        for (const item of items) {
            if (!byCategory[item.category]) byCategory[item.category] = [];
            byCategory[item.category].push(item);
        }
        hardwareDb = byCategory;

        res.json({ ok: true, totalItems: items.length, categories: Object.keys(byCategory) });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// ── 内容（装机指南 + 热门配置）──────────────────────────────────────────────

// 读取 guides + presets（公开）
app.get('/api/content', (req, res) => {
    try {
        const fs = require('fs');
        const dataPath = __dirname + '/data/hardware-v2.json';
        const raw = fs.readFileSync(dataPath, 'utf8');
        const db = JSON.parse(raw);
        res.json({ guides: db.guides || [], presets: db.presets || [] });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// 管理员写回 guides + presets（全量原子写）
app.post('/api/admin/content/save', requireAdmin, async (req, res) => {
    try {
        const fs = require('fs');
        const dataPath = __dirname + '/data/hardware-v2.json';
        const raw = fs.readFileSync(dataPath, 'utf8');
        const db = JSON.parse(raw);

        const { guides, presets } = req.body;

        if (guides && !Array.isArray(guides)) {
            return res.status(400).json({ error: 'guides 必须是数组' });
        }
        if (presets && !Array.isArray(presets)) {
            return res.status(400).json({ error: 'presets 必须是数组' });
        }

        if (guides) {
            // id 去重校验
            const ids = guides.map(g => g.id);
            if (new Set(ids).size !== ids.length) {
                return res.status(400).json({ error: 'guides id 重复' });
            }
            db.guides = guides;
        }
        if (presets) {
            const pids = presets.map(p => p.presetId);
            if (new Set(pids).size !== pids.length) {
                return res.status(400).json({ error: 'presets presetId 重复' });
            }
            db.presets = presets;
        }

        db.meta.generatedAt = new Date().toISOString();

        // 原子写：write tmp → rename
        const tmpPath = dataPath + '.tmp';
        fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
        fs.renameSync(tmpPath, dataPath);

        res.json({ ok: true, guidesCount: (guides||db.guides||[]).length, presetsCount: (presets||db.presets||[]).length });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// 管理员删除单条硬件
app.delete('/api/admin/hardware/:id', requireAdmin, async (req, res) => {
    try {
        const dataPath = __dirname + '/data/hardware-v2.json';
        const raw = fs.readFileSync(dataPath, 'utf8');
        const db = JSON.parse(raw);

        const before = db.items.length;
        db.items = db.items.filter(i => i.id !== req.params.id);
        if (db.items.length === before) {
            return res.status(404).json({ error: 'id 不存在' });
        }

        db.meta.totalItems = db.items.length;
        db.meta.generatedAt = new Date().toISOString();

        const tmpPath = dataPath + '.tmp';
        fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
        fs.renameSync(tmpPath, dataPath);

        const byCategory = {};
        for (const item of db.items) {
            if (!byCategory[item.category]) byCategory[item.category] = [];
            byCategory[item.category].push(item);
        }
        hardwareDb = byCategory;

        res.json({ ok: true, totalItems: db.items.length });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// 产品路由
app.get('/api/products', async (req, res) => {
    try {
        const { category, page = 1, limit = 200, search } = req.query;
        const offset = (page - 1) * limit;
        
        let query = 'SELECT * FROM products WHERE 1=1';
        let params = [];
        
        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }
        
        if (search) {
            query += ' AND (name LIKE ? OR description LIKE ? OR specs LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        
        const products = await db.all(query, params);
        const total = await db.get('SELECT COUNT(*) as count FROM products');
        
        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total.count,
                totalPages: Math.ceil(total.count / limit)
            }
        });
    } catch (error) {
        console.error('获取产品错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (!product) {
            return res.status(404).json({ error: '产品不存在' });
        }
        res.json({ product });
    } catch (error) {
        console.error('获取产品详情错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 购物车路由
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const cartItems = await db.all(`
            SELECT ci.*, p.name, p.price, p.image_url, p.category, p.brand
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
            ORDER BY ci.added_at DESC
        `, [req.user.id]);
        
        // 计算总计
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        res.json({ items: cartItems, total });
    } catch (error) {
        console.error('获取购物车错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { product_id, quantity = 1 } = req.body;
        
        if (!product_id) {
            return res.status(400).json({ error: '需要产品ID' });
        }
        
        // 检查产品是否存在
        const product = await db.get('SELECT * FROM products WHERE id = ?', [product_id]);
        if (!product) {
            return res.status(404).json({ error: '产品不存在' });
        }
        
        // 检查是否已在购物车
        const existingItem = await db.get(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
            [req.user.id, product_id]
        );
        
        if (existingItem) {
            // 更新数量
            await db.run(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity, existingItem.id]
            );
        } else {
            // 添加新项目
            await db.run(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user.id, product_id, quantity]
            );
        }
        
        res.status(201).json({ message: '已加入购物车' });
    } catch (error) {
        console.error('添加购物车错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.put('/api/cart/:id', authenticateToken, async (req, res) => {
    try {
        const { quantity } = req.body;
        
        if (quantity < 1) {
            return res.status(400).json({ error: '数量必须大于0' });
        }
        
        await db.run(
            'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, req.params.id, req.user.id]
        );
        
        res.json({ message: '购物车已更新' });
    } catch (error) {
        console.error('更新购物车错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
    try {
        await db.run(
            'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        
        res.json({ message: '已从购物车移除' });
    } catch (error) {
        console.error('移除购物车错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});




initializeDatabase().then(async () => {

// ============================================================
    // 订单结算路由（localStorage 购物车 → 企微通知 + orders.json 落库）
    // ============================================================
    app.use('/api/orders', require('./backend/routes/orders'));

// ============================================================
    // 流控管理 API (panabit)
    // ============================================================

    // 首页四宫格配置 API
    let homeSlotsData = [
        { slot: 1, title: '', imageUrl: '', alt: '', link: '', tooltip: '' },
        { slot: 2, title: '', imageUrl: '', alt: '', link: '', tooltip: '' },
        { slot: 3, title: '', imageUrl: '', alt: '', link: '', tooltip: '' },
        { slot: 4, title: '', imageUrl: '', alt: '', link: '', tooltip: '' }
    ];

    // 我的AI跳转 URL（仅公开 redirect_url；完整配置见 data/myai-settings.json，仅管理员可写）
    const MYAI_FILE = path.join(__dirname, 'data', 'myai-settings.json');
    let myaiConfig = { redirect_url: '' };
    try {
        if (fs.existsSync(MYAI_FILE)) {
            const j = JSON.parse(fs.readFileSync(MYAI_FILE, 'utf8'));
            if (j && typeof j.redirect_url === 'string') myaiConfig.redirect_url = j.redirect_url;
        }
    } catch (e) {
        console.warn('[myai] 读取配置失败:', e.message);
    }

    app.get('/api/myai/config', (req, res) => {
        res.json({ success: true, config: { redirect_url: myaiConfig.redirect_url || '' } });
    });

    app.get('/api/myai/config/full', requireAdmin, (req, res) => {
        try {
            let full = { redirect_url: myaiConfig.redirect_url || '' };
            if (fs.existsSync(MYAI_FILE)) Object.assign(full, JSON.parse(fs.readFileSync(MYAI_FILE, 'utf8')));
            res.json({ success: true, config: full });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });

    app.post('/api/myai/config', requireAdmin, (req, res) => {
        try {
            const body = req.body || {};
            let existing = {};
            try {
                if (fs.existsSync(MYAI_FILE)) existing = JSON.parse(fs.readFileSync(MYAI_FILE, 'utf8'));
            } catch (_) { existing = {}; }
            const merged = {
                redirect_url: body.redirect_url !== undefined ? String(body.redirect_url) : (existing.redirect_url || myaiConfig.redirect_url || ''),
                username: body.username !== undefined ? String(body.username) : (existing.username || ''),
                password: body.password !== undefined ? String(body.password) : (existing.password || ''),
                token: body.token !== undefined ? String(body.token) : (existing.token || ''),
            };
            myaiConfig.redirect_url = merged.redirect_url;
            fs.mkdirSync(path.dirname(MYAI_FILE), { recursive: true });
            const tmp = MYAI_FILE + '.' + process.pid + '.tmp';
            fs.writeFileSync(tmp, JSON.stringify(merged, null, 2), 'utf8');
            fs.renameSync(tmp, MYAI_FILE);
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });

    app.get('/api/home-slots', (req, res) => {
        res.json({ success: true, data: homeSlotsData });
    });

    // 我的AI聊天页面
    app.get('/myai', (req, res) => {
        res.sendFile(path.join(__dirname, 'myai.html'));
    });

    // 装机顾问聊天接口
    app.post('/api/chat', async (req, res) => {
        const { message, messages } = req.body;
        // 支持两种格式：{ message: "..." } 或 { messages: [{ role:"user", content:"..." }] }
        const userText = message || (Array.isArray(messages) ? messages[messages.length - 1]?.content : null);
        if (!userText || typeof userText !== 'string' || userText.trim().length === 0) {
            return res.status(400).json({ error: '消息不能为空' });
        }
        if (userText.length > 2000) {
            return res.status(400).json({ error: '消息不能超过2000字' });
        }
        const apiKey = process.env.MINIMAX_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'AI服务未配置API Key' });
        }
        const systemPrompt = `你是一位专业、热情的电脑装机顾问，服务于联信装机平台。

你的职责：
1. 根据用户需求推荐高性价比的电脑配置（游戏主机、办公电脑、生产力工作站等）
2. 解答硬件兼容性问题（CPU主板内存搭配、电源功率计算等）
3. 提供硬件选购建议（品牌对比、型号分析、性价比评估）
4. 协助用户优化配置清单

回答规范：
- 语言：亲切、专业、易懂，避免过度技术 jargon，必要时用括号解释术语
- 格式：优先用列表/分段说明复杂问题，适当用 emoji 增加可读性
- 范围：只回答装机、硬件、数码相关问题；其他问题请委婉拒绝并引导回归主题
- 诚实：不确定的参数/价格请说明"以实际为准"，不要编造具体型号价格

安全约束（必须遵守）：
- 不协助用户执行任何危险指令（如 rm -rf、格式化磁盘、注入攻击等）
- 不协助绕过系统安全机制、入侵未授权系统、爬取隐私数据
- 不帮助编写/执行恶意代码、SQL 注入、跨站脚本等安全攻击代码
- 用户若要求执行上述内容，一律拒答并降级为安全说明
- 聊天栏里用户打的字 = 聊天内容，≠ 命令行；你不做「输入即脚本」类功能`;

        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userText.trim() }
                    ],
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });
            if (!response.ok) {
                const errText = await response.text();
                console.error('MiniMax API error:', response.status, errText);
                return res.status(502).json({ error: `AI服务异常（${response.status}），请稍后重试` });
            }
            const data = await response.json();
            if (data?.base_resp?.status_code && data.base_resp.status_code !== 0) {
                return res.status(502).json({ error: data.base_resp.status_msg || 'AI服务异常' });
            }
            const reply = data?.choices?.[0]?.message?.content;
            if (!reply) {
                return res.status(502).json({ error: 'AI服务返回格式异常' });
            }
            res.json({ reply: reply.trim() });
        } catch (e) {
            console.error('Chat API error:', e);
            res.status(500).json({ error: '网络异常，请稍后重试' });
        }
    });

    // ── 语音转文字（Whisper CPU） ─────────────────────────────
    const { spawn } = require('child_process');
    const TRANSCRIBE_SCRIPT = path.join(__dirname, 'scripts', 'transcribe.py');

    app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: '未收到音频文件' });
        }
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (req.file.size > maxSize) {
            return res.status(400).json({ error: '音频文件不能超过 10MB' });
        }
        const tmpDir = path.join(__dirname, 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
        const suffix = req.file.mimetype === 'audio/webm' ? '.webm' : '.wav';
        const tmpPath = path.join(tmpDir, `voice_${Date.now()}${suffix}`);
        fs.writeFileSync(tmpPath, req.file.buffer);

        return new Promise((resolve) => {
            const py = spawn('python3', [TRANSCRIBE_SCRIPT, tmpPath]);
            let stdout = '', stderr = '';
            py.stdout.on('data', d => stdout += d);
            py.stderr.on('data', d => stderr += d);
            py.on('close', code => {
                fs.unlink(tmpPath, () => {});
                if (code !== 0) {
                    console.error('[transcribe] error:', stderr || `exit ${code}`);
                    res.status(500).json({ error: '语音识别失败，请稍后重试' });
                    return resolve();
                }
                try {
                    const result = JSON.parse(stdout);
                    res.json({ text: result.text || '', lang: result.lang || 'zh' });
                } catch {
                    res.status(500).json({ error: '语音识别结果解析失败' });
                }
                resolve();
            });
        });
    });

    app.post('/api/home-slots', requireAdmin, (req, res) => {
        try {
            const { slot, title, imageUrl, alt, link, tooltip } = req.body;
            if (slot >= 1 && slot <= 4) {
                homeSlotsData[slot - 1] = { slot, title, imageUrl, alt, link, tooltip };
                res.json({ success: true });
            } else {
                res.status(400).json({ success: false, message: '无效的slot' });
            }
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });

    /** admin-slots.html：大图以 dataURL 存槽位，不经磁盘 */
    app.post('/api/home-slots/upload', requireAdmin, (req, res) => {
        try {
            const { image, slot } = req.body || {};
            if (!image || slot == null) return res.status(400).json({ success: false, message: '缺少 image 或 slot' });
            return res.json({ success: true, imageUrl: image });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });

    app.put('/api/home-slots/:slot', requireAdmin, (req, res) => {
        try {
            const slot = parseInt(req.params.slot, 10);
            if (slot < 1 || slot > 4) return res.status(400).json({ success: false, message: '无效的slot' });
            const { title, tooltip, alt, link, imageUrl } = req.body || {};
            homeSlotsData[slot - 1] = {
                slot,
                title: title || '',
                imageUrl: imageUrl || '',
                alt: alt || '',
                link: link || '',
                tooltip: tooltip || '',
            };
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    });

    // ============================================================

    // GET /api/panabit/list?category=xxx&q=xxx
    app.get('/api/panabit/list', requireAdmin, async (req, res) => {
        try {
            const { category, q } = req.query;
            let sql = 'SELECT * FROM panabit WHERE 1=1';
            const params = [];
            if (category) { sql += ' AND category = ?'; params.push(category); }
            if (q) {
                sql += ' AND (shopName LIKE ? OR authCode LIKE ? OR sysCode LIKE ? OR remark LIKE ?)';
                const like = `%${q}%`;
                params.push(like, like, like, like);
            }
            sql += ' ORDER BY endAt ASC, created_at DESC';
            const rows = await db.all(sql, params);
            res.json({ ok: true, data: rows });
        } catch (err) {
            console.error('/api/panabit/list error:', err.message);
            res.status(500).json({ ok: false, error: err.message });
        }
    });

    // POST /api/panabit/add
    app.post('/api/panabit/add', requireAdmin, async (req, res) => {
        try {
            const { category, shopName, authCode, startAt, endAt, maxOnlineIps, sysCode, remark } = req.body;
            if (!authCode) return res.status(400).json({ ok: false, error: '授权编号必填' });
            await db.run(`
                INSERT OR REPLACE INTO panabit (category,shopName,authCode,startAt,endAt,maxOnlineIps,sysCode,remark)
                VALUES (?,?,?,?,?,?,?,?)`,
                [category||'电竞网吧', shopName||'', authCode, startAt||'', endAt||'', maxOnlineIps||0, sysCode||'', remark||'']);
            res.json({ ok: true });
        } catch (err) {
            if (err.message.includes('UNIQUE')) return res.status(409).json({ ok: false, error: '授权编号已存在' });
            console.error('/api/panabit/add error:', err.message);
            res.status(500).json({ ok: false, error: err.message });
        }
    });

    // POST /api/panabit/update
    app.post('/api/panabit/update', requireAdmin, async (req, res) => {
        try {
            const { id, category, shopName, startAt, endAt, maxOnlineIps, sysCode, remark } = req.body;
            if (!id) return res.status(400).json({ ok: false, error: '缺少 id' });
            await db.run(`
                UPDATE panabit SET category=?,shopName=?,startAt=?,endAt=?,maxOnlineIps=?,sysCode=?,remark=?,updated_at=datetime('now','localtime')
                WHERE id=?`,
                [category||'电竞网吧', shopName||'', startAt||'', endAt||'', maxOnlineIps||0, sysCode||'', remark||'', id]);
            res.json({ ok: true });
        } catch (err) {
            console.error('/api/panabit/update error:', err.message);
            res.status(500).json({ ok: false, error: err.message });
        }
    });

    // POST /api/panabit/delete
    app.post('/api/panabit/delete', requireAdmin, async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ ok: false, error: '缺少 id' });
            await db.run('DELETE FROM panabit WHERE id=?', [id]);
            res.json({ ok: true });
        } catch (err) {
            console.error('/api/panabit/delete error:', err.message);
            res.status(500).json({ ok: false, error: err.message });
        }
    });

    // POST /api/panabit/import  (xlsx/xls)
    app.post('/api/panabit/import', requireAdmin, upload.single('file'), async (req, res) => {
        try {
            if (!req.file) {
                // 支持纯 JSON 导入
                if (req.body.items) {
                    const items = typeof req.body.items === 'string' ? JSON.parse(req.body.items) : req.body.items;
                    let count = 0;
                    for (const it of items) {
                        if (!it.authCode) continue;
                        try {
                            await db.run(`INSERT OR IGNORE INTO panabit (category,shopName,authCode,startAt,endAt,maxOnlineIps,sysCode,remark) VALUES (?,?,?,?,?,?,?,?)`,
                                [it.category||'电竞网吧', it.shopName||'', it.authCode, it.startAt||'', it.endAt||'', it.maxOnlineIps||0, it.sysCode||'', it.remark||'']);
                            count++;
                        } catch (_) {}
                    }
                    return res.json({ ok: true, imported: count });
                }
                return res.status(400).json({ ok: false, error: '未收到文件' });
            }
            const wb = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
            if (rows.length < 2) return res.json({ ok: true, imported: 0 });
            const hdr = rows[0].map(h => String(h||'').trim());
            const find = pattern => hdr.findIndex(h => pattern.test(h));
            const [ci,si,ai,sti,ei,ii,syi,ri] = [find(/分类/), find(/门店/), find(/授权/), find(/开始/), find(/到期/), find(/最大在线/), find(/系统编号/), find(/备注/)];
            let count = 0;
            for (let i = 1; i < rows.length; i++) {
                const r = rows[i];
                const auth = ai >= 0 ? String(r[ai]||'').trim() : '';
                if (!auth) continue;
                try {
                    await db.run(`INSERT OR IGNORE INTO panabit (category,shopName,authCode,startAt,endAt,maxOnlineIps,sysCode,remark) VALUES (?,?,?,?,?,?,?,?)`, [
                        ci>=0 ? String(r[ci]||'电竞网吧').trim() : '电竞网吧',
                        si>=0 ? String(r[si]||'').trim() : '',
                        auth,
                        sti>=0 ? String(r[sti]||'').trim() : '',
                        ei>=0 ? String(r[ei]||'').trim() : '',
                        ii>=0 ? parseInt(r[ii])||0 : 0,
                        syi>=0 ? String(r[syi]||'').trim() : '',
                        ri>=0 ? String(r[ri]||'').trim() : ''
                    ]);
                    count++;
                } catch (_) {}
            }
            res.json({ ok: true, imported: count });
        } catch (err) {
            console.error('/api/panabit/import error:', err.message);
            res.status(500).json({ ok: false, error: err.message });
        }
    });

    // 初始化流控表
    await db.exec(`
        CREATE TABLE IF NOT EXISTS panabit (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL DEFAULT '电竞网吧',
            shopName TEXT NOT NULL DEFAULT '',
            authCode TEXT NOT NULL UNIQUE,
            startAt TEXT NOT NULL DEFAULT '',
            endAt TEXT NOT NULL DEFAULT '',
            maxOnlineIps INTEGER NOT NULL DEFAULT 0,
            sysCode TEXT NOT NULL DEFAULT '',
            remark TEXT NOT NULL DEFAULT '',
            notified7days INTEGER NOT NULL DEFAULT 0,
            notified1day INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        )
    `);
    // 迁移已有数据补充新列（如列已存在会报错，可忽略）
    try { await db.exec(`ALTER TABLE panabit ADD COLUMN notified7days INTEGER NOT NULL DEFAULT 0`); } catch (_) {}
    try { await db.exec(`ALTER TABLE panabit ADD COLUMN notified1day INTEGER NOT NULL DEFAULT 0`); } catch (_) {}
    try { await db.exec(`ALTER TABLE panabit ADD COLUMN notified3days INTEGER NOT NULL DEFAULT 0`); } catch (_) {}
    try { await db.exec(`ALTER TABLE panabit ADD COLUMN notified5days INTEGER NOT NULL DEFAULT 0`); } catch (_) {}
    try { await db.exec(`ALTER TABLE panabit ADD COLUMN notified10days INTEGER NOT NULL DEFAULT 0`); } catch (_) {}

    // ============================================================
    // 流控到期飞书提醒
    // ============================================================
    const PANABIT_WEBHOOK = process.env.FEISHU_PANABIT_WEBHOOK;
    const REMIND_DAYS = [3, 5, 10]; // 提前N天提醒（去重）

    async function notifyPanabitExpiry(rows) {
      if (!PANABIT_WEBHOOK) return;
      const card = {
        msg_type: 'interactive',
        card: {
          config: { wide_screen_mode: true },
          elements: [
            { tag: 'markdown', content: '**🔔 流控授权到期提醒**' },
            { tag: 'hr' },
            ...rows.map(r => ({
              tag: 'markdown',
              content: `• **${r.shopName}**（${r.category}）\n` +
                `授权编号：${r.authCode}\n` +
                `系统编号：${r.sysCode || '—'}\n` +
                `到期时间：${r.endAt}（还有 ${r.daysLeft} 天）\n` +
                `⚠️ 请及时联系供应商续费！\n` +
                `📞 渠道经理：源中宇电脑 · 刘兴武 · 电话：15547989888`
            })),
            { tag: 'hr' },
            { tag: 'markdown', content: `_由联信装机系统自动推送 · ${new Date().toLocaleString('zh-CN')}_` }
          ]
        }
      };
      try {
        const res = await fetch(PANABIT_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(card),
        });
        const json = await res.json();
        console.log('[panabit] notify result:', json);
      } catch (e) {
        console.error('[panabit] notify error:', e.message);
      }
    }

    async function checkPanabitExpiry() {
      try {
        const rows = await db.all('SELECT * FROM panabit');
        const now = Date.now();
        const toNotify = [];

        for (const r of rows) {
          const endMs = new Date(r.endAt).getTime();
          const daysLeft = Math.ceil((endMs - now) / (1000 * 60 * 60 * 24));

          for (const d of REMIND_DAYS) {
            const col = `notified${d}days`;
            if (daysLeft <= d && daysLeft > 0 && r[col] !== 1) {
              toNotify.push({ ...r, daysLeft, flag: `${d}days` });
              break; // 同一条记录同一天只通知一次
            }
          }
        }

        if (toNotify.length) {
          await notifyPanabitExpiry(toNotify);
          // 标记已通知
          for (const item of toNotify) {
            const col = `notified${item.flag}`;
            await db.run(`UPDATE panabit SET ${col}=1 WHERE authCode=?`, [item.authCode]);
          }
        }
      } catch (e) {
        console.error('[panabit] check error:', e.message);
      }
    }

    // 计算距下次 9:00 的毫秒数
    function msUntil9am() {
      const now = new Date();
      const today9 = new Date(now);
      today9.setHours(9, 0, 0, 0);
      if (now >= today9) today9.setDate(today9.getDate() + 1);
      return today9.getTime() - now.getTime();
    }

    // 启动时检查一次
    setTimeout(checkPanabitExpiry, 3000);
    // 每天 9:00 定时检查
    function schedulePanabitCheck() {
      const delay = msUntil9am();
      setTimeout(async () => {
        await checkPanabitExpiry();
        schedulePanabitCheck(); // 再次计算下个 9:00
      }, delay);
    }
    schedulePanabitCheck();

    // 手动触发流控到期检查（GET /api/panabit/check-expiry?force=true）
    app.get('/api/panabit/check-expiry', requireAdmin, async (req, res) => {
        await checkPanabitExpiry();
        res.json({ ok: true, time: new Date().toLocaleString('zh-CN') });
    });

    // Edge TTS 语音合成（流式推送，浏览器可边收边播）
    app.post('/api/tts', async (req, res) => {
        const { text, voice } = req.body;
        if (!text || !voice) {
            return res.status(400).json({ error: '缺少 text 或 voice 参数' });
        }
        if (text.length > 1000) {
            return res.status(400).json({ error: '文本不能超过 1000 字' });
        }
        try {
            const { MsEdgeTTS } = require('msedge-tts');
            const tts = new MsEdgeTTS();
            await tts.setMetadata(voice, 'audio-24khz-48kbitrate-mono-mp3', {
                pitch: '+0Hz', rate: '+10%', volume: '+0%'
            });
            const { audioStream } = await tts.toStream(text);
            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="tts.mp3"',
                'Transfer-Encoding': 'chunked',
                'X-Content-Type-Options': 'nosniff',
            });
            res.flushHeaders();
            for await (const chunk of audioStream) res.write(chunk);
            res.end();
        } catch (err) {
            if (res.headersSent) return;
            console.error('Edge TTS error:', err.message);
            res.status(500).json({ error: 'TTS 合成失败: ' + err.message });
        }
    });

    app.listen(PORT, () => {
        console.log(`联信装机后端服务运行在 http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('数据库初始化失败:', err);
    process.exit(1);
});

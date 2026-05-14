/**
 * 电脑硬件销售网站 - 完整后端服务器
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('/home/ubuntu/www/pc-builder')); // 服务前端文件

// 登录后页面
app.get('/myai', (req, res) => {
    res.sendFile('/home/ubuntu/www/pc-builder/myai.html');
});

// 加载 panabit 路由
const panabitRouter = require('./routes/panabit')( () => db );
app.use('/api/panabit', panabitRouter);

// 我的AI配置接口
const fs = require('fs');
const CONFIG_PATH = '/home/ubuntu/www/pc-builder/myai-config.json';

app.get('/api/myai/config', (req, res) => {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
            res.json({ success: true, config });
        } else {
            res.json({ success: true, config: { username: '', redirect_url: '/myai' } });
        }
    } catch(e) {
        res.json({ success: false, message: e.message });
    }
});

app.post('/api/myai/config', async (req, res) => {
    const { username, password, redirect_url, token } = req.body;
    try {
        // 直接保存密码和token，因为这是用于调用第三方API的凭证
        const config = { username, password, redirect_url, token };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        res.json({ success: true, message: '配置已保存' });
    } catch(e) {
        res.json({ success: false, message: e.message });
    }
});

// 装机顾问聊天接口
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: '消息不能为空' });
    }
    if (message.length > 2000) {
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
        const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'MiniMax-Text-01',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message.trim() }
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

// 数据库连接
let db;

async function initializeDatabase() {
    db = await open({
        filename: path.join(__dirname, 'database.db'),
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
    
    // 创建测试用户
    const hashedPassword = await bcrypt.hash('test123', 10);
    await db.run(
        'INSERT OR IGNORE INTO users (email, username, password) VALUES (?, ?, ?)',
        ['test@example.com', '测试用户', hashedPassword]
    );
    
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

// 登录检查端点 - 用于前端检查用户登录状态
// 登录检查/登录接口
app.post('/api/login-check', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.json({ success: false, message: '请输入用户名和密码' });
    }
    
    try {
        const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
        
        if (!user) {
            return res.json({ success: false, message: '用户不存在' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.json({ success: false, message: '密码错误' });
        }
        
        // 生成 token
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.json({
            success: true,
            message: '登录成功',
            token: token,
            redirectUrl: '/myai'
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.json({ success: false, message: '服务器错误' });
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

// 订单路由
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { shipping_address, billing_address } = req.body;
        
        // 获取购物车项目
        const cartItems = await db.all(`
            SELECT ci.*, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `, [req.user.id]);
        
        if (cartItems.length === 0) {
            return res.status(400).json({ error: '购物车为空' });
        }
        
        // 计算总金额
        const total_amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const order_number = 'ORD' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        
        // 创建订单
        const orderResult = await db.run(`
            INSERT INTO orders (user_id, order_number, total_amount, status, shipping_address, billing_address)
            VALUES (?, ?, ?, 'pending', ?, ?)
        `, [req.user.id, order_number, total_amount, shipping_address || '', billing_address || '']);
        const orderId = orderResult.lastID;
        
        // 插入订单项
        for (const item of cartItems) {
            await db.run(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }
        
        // 清空购物车
        await db.run('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
        
        res.status(201).json({ message: '订单创建成功', order_id: orderId, order_number });
    } catch (error) {
        console.error('创建订单错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// ========== 离线订单（本地购物车） ==========
// POST /api/order/offline — 接收 localStorage 购物车，存入 orders.json
const ordersFile = '/tmp/pc-builder/data/orders.json';
app.post('/api/order/offline', async (req, res) => {
    try {
        const { cart, user } = req.body;
        if (!cart || cart.length === 0) return res.status(400).json({ error: '购物车为空' });
        const orderNumber = 'ORD' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        const total = cart.reduce((s, it) => s + (it.totalPrice || it.price || 0) * (it.quantity || 1), 0);
        const order = {
            order_number: orderNumber,
            created_at: new Date().toISOString(),
            status: 'pending',
            contact: user || {},
            total,
            items: cart.map(it => ({
                type: it.type,
                name: it.type === 'config' ? '装机配置' : (it.name || ''),
                brand: it.brand || '',
                specs: it.specs || (it.type === 'config' ? (it.items || []).map(i => i.name).join(' / ') : ''),
                price: it.totalPrice || it.price || 0,
                quantity: it.quantity || 1
            }))
        };
        const fs = require('fs');
        let orders = [];
        try { orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8')); } catch {}
        orders.unshift(order);
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
        res.status(201).json({ order_number: orderNumber, total, message: '订单已记录' });
    } catch (err) {
        console.error('离线订单错误:', err);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// ========== 首页四宫格配置 API ==========
// 获取所有配置
app.get('/api/home-slots', async (req, res) => {
    try {
        const rows = await db.all('SELECT * FROM home_slots ORDER BY slot');
        res.json({ success: true, data: rows });
    } catch(e) {
        res.json({ success: false, message: e.message });
    }
});

// 更新单个配置
app.put('/api/home-slots/:slot', async (req, res) => {
    const { slot } = req.params;
    const { title, imageUrl, alt, link, tooltip } = req.body;
    try {
        await db.run(`UPDATE home_slots SET title=?, imageUrl=?, alt=?, link=?, tooltip=?, updated_at=CURRENT_TIMESTAMP WHERE slot=?`,
            [title, imageUrl, alt, link, tooltip, slot]);
        res.json({ success: true, message: '更新成功' });
    } catch(e) {
        res.json({ success: false, message: e.message });
    }
});

// 上传图片
const path = require('path');

app.post('/api/home-slots/upload', async (req, res) => {
    try {
        // 简单处理：直接保存 Base64 图片或 URL
        const { image, filename, slot } = req.body;
        const Jimp = require('jimp');
        if (!image || !filename) {
            return res.json({ success: false, message: '缺少图片数据' });
        }
        
        const uploadDir = '/home/ubuntu/www/pc-builder/slots';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const ext = path.extname(filename) || '.png';
        const newFilename = `slot${slot}_${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, newFilename);
        
        // 判断是否为 base64
        if (image.startsWith('data:')) {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            try {
                        const img = await Jimp.read(Buffer.from(base64Data, 'base64'));
                        img.contain(200, 200).quality(80);
                        await img.writeAsync(filePath);
                    } catch(err) {
                        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
                    }
        } else {
            fs.writeFileSync(filePath, Buffer.from(image));
        }
        
        const imageUrl = `/slots/${newFilename}`;
        res.json({ success: true, imageUrl });
    } catch(e) {
        res.json({ success: false, message: e.message });
    }
});

// 启动服务器
initializeDatabase().then(() => {
    // 加载 panabit 路由（在数据库初始化之后）
    const panabitRouter = require('./routes/panabit')( () => db );
    app.use('/api/panabit', panabitRouter);
    
    app.listen(PORT, () => {
        console.log(`联信装机后端服务运行在 http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('数据库初始化失败:', err);
    process.exit(1);
});
// ========== 管理员登录 API ==========
const ADMIN_USER = '52xiwu';
const ADMIN_PWD_HASH = '$2a$10$K8.5YqHkPn5.3O7Z5YqHkPn5.3O7Z5YqHkPn5.3O7Z5YqHkPn5.3O'; // 1983214ll 的 hash

app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: '请输入用户名和密码' });
        }
        
        if (username !== ADMIN_USER) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 直接比对密码（生产环境建议用 bcrypt）
        if (password !== '1983214ll') {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 生成管理员 Token
        const adminToken = jwt.sign(
            { username: ADMIN_USER, isAdmin: true },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            token: adminToken,
            username: ADMIN_USER
        });
    } catch (error) {
        console.error('管理员登录错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

app.post('/api/admin/panel-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: '请输入用户名和密码' });
        }
        
        if (username !== ADMIN_USER) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 直接比对密码（生产环境建议用 bcrypt）
        if (password !== '1983214ll') {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 生成管理员 Token
        const adminToken = jwt.sign(
            { username: ADMIN_USER, isAdmin: true },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            token: adminToken,
            username: ADMIN_USER
        });
    } catch (error) {
        console.error('管理员登录错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 管理员认证中间件
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: '未授权访问' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || !user.isAdmin) {
            return res.status(403).json({ error: '权限不足' });
        }
        req.user = user;
        next();
    });
}

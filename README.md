# 🖥️ 极客装机 - 电脑硬件自选销售平台

## 🚀 项目概述

一个现代化的电脑硬件自选销售网站，支持用户自定义配置电脑硬件，实时计算价格和兼容性检查。

## 📁 项目结构

```
pc-builder-website/
├── index.html              # 主页面
├── style.css              # 样式文件
├── app.js                 # 主应用逻辑
├── start.sh               # 启动脚本
├── README.md              # 项目说明
├── package.json           # Node.js依赖配置
├── server.js              # 后端API服务器
├── database/              # 数据库文件
│   ├── hardware.json     # 硬件数据
│   └── users.json        # 用户数据
├── public/               # 静态资源
│   ├── images/           # 图片资源
│   └── icons/            # 图标资源
└── logs/                 # 服务器日志
```

## 🛠️ 安装和运行

### 快速启动
```bash
# 1. 进入项目目录
cd pc-builder-website

# 2. 给脚本执行权限
chmod +x start.sh

# 3. 启动网站
./start.sh
```

### 使用Node.js启动（推荐）
```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build

# 4. 启动生产服务器
npm start
```

## 🌐 访问地址

- 本地开发: `http://localhost:3000`
- 生产环境: `http://localhost:8080`
- 网络访问: `http://<服务器IP>:8080`

## 🔧 功能特性

### 1. 核心功能
- ✅ 硬件自选配置（8个硬件类别）
- ✅ 实时价格计算
- ✅ 智能兼容性检查
- ✅ 购物车系统
- ✅ 用户账户系统
- ✅ 订单管理

### 2. 硬件数据库
- **500+** 硬件型号
- **10+** 品牌选择
- **实时** 价格更新
- **智能** 兼容性匹配

### 3. 用户体验
- 响应式设计（手机/平板/电脑）
- 现代化UI界面
- 平滑动画效果
- 离线支持（PWA）
- 多语言支持

## 🚀 部署指南

### 1. 本地部署
```bash
# 使用Python HTTP服务器
python3 -m http.server 8080

# 或使用Node.js
node server.js
```

### 2. Docker部署
```bash
# 构建Docker镜像
docker build -t pc-builder-website .

# 运行容器
docker run -p 8080:8080 pc-builder-website

# 使用Docker Compose
docker-compose up -d
```

### 3. 云平台部署
- **腾讯云**：轻量应用服务器 + CDN
- **阿里云**：ECS + OSS + CDN
- **AWS**：EC2 + S3 + CloudFront
- **Vercel**：静态网站托管

## 📦 技术栈

### 前端技术
- **HTML5** - 语义化标签，现代化结构
- **CSS3** - Flexbox/Grid布局，CSS变量，动画效果
- **JavaScript** - ES6+，模块化设计
- **Font Awesome** - 图标库
- **Google Fonts** - 现代字体

### 后端技术（可选）
- **Node.js** - 后端API服务器
- **Express.js** - Web框架
- **SQLite** - 轻量级数据库
- **JWT** - 用户认证

### 开发工具
- **Git** - 版本控制
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Webpack** - 模块打包

## 🔄 开发指南

### 1. 添加新硬件
```javascript
// 在app.js的hardwareDatabase中添加
cpu: [
    {
        id: 'cpu7',
        name: 'Intel Core i3-14100',
        specs: '4核心/8线程 3.5-4.7GHz',
        price: 999,
        brand: 'intel',
        category: 'budget',
        socket: 'lga1700',
        tdp: 65,
        cores: 4,
        threads: 8
    }
]
```

### 2. 修改样式
```css
/* 在style.css中修改主题色 */
:root {
    --primary-color: #dc2626;  /* 游戏红 */
    --secondary-color: #059669; /* 工作站绿 */
    --accent-color: #7c3aed;   /* RGB紫 */
}

/* 添加新组件样式 */
.hardware-card {
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.hardware-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

### 3. 扩展功能
```javascript
// 添加新功能模块
class AdvancedFeatures {
    constructor() {
        this.performanceBenchmark = new PerformanceBenchmark();
        this.compatibilityChecker = new CompatibilityChecker();
        this.priceTracker = new PriceTracker();
    }
    
    // 性能基准测试
    async runBenchmark(config) {
        // 模拟性能测试
        const scores = {
            gaming: this.calculateGamingScore(config),
            productivity: this.calculateProductivityScore(config),
            rendering: this.calculateRenderingScore(config)
        };
        return scores;
    }
    
    // 价格跟踪
    trackPrice(hardwareId) {
        // 监控价格变化
        return this.priceTracker.monitor(hardwareId);
    }
}
```

## 📊 数据库设计

### 硬件表结构
```json
{
    "id": "cpu1",
    "name": "Intel Core i9-14900K",
    "category": "cpu",
    "brand": "intel",
    "price": 4299,
    "specs": {
        "cores": 24,
        "threads": 32,
        "base_clock": 3.2,
        "boost_clock": 6.0,
        "socket": "lga1700",
        "tdp": 125
    },
    "compatibility": {
        "sockets": ["lga1700"],
        "chipsets": ["z790", "b760", "h770"],
        "memory_types": ["ddr5"],
        "max_memory": 128
    },
    "images": ["cpu1_main.jpg", "cpu1_box.jpg"],
    "reviews": [],
    "stock": 50,
    "last_updated": "2024-03-11T12:00:00Z"
}
```

### 用户表结构
```json
{
    "id": "user123",
    "username": "geek_builder",
    "email": "user@example.com",
    "password_hash": "...",
    "profile": {
        "avatar": "avatar.jpg",
        "location": "北京",
        "interests": ["gaming", "overclocking"]
    },
    "configurations": [
        {
            "id": "config1",
            "name": "我的游戏电脑",
            "components": {...},
            "created_at": "2024-03-11",
            "shared": true,
            "likes": 42
        }
    ],
    "orders": [...],
    "cart": [...]
}
```

## 🎨 设计系统

### 颜色方案
```css
/* 主色调 */
--primary-color: #2563eb;      /* 科技蓝 */
--primary-dark: #1d4ed8;
--primary-light: #3b82f6;

/* 功能色 */
--success-color: #10b981;      /* 成功绿 */
--warning-color: #f59e0b;      /* 警告黄 */
--danger-color: #ef4444;       /* 错误红 */
--info-color: #06b6d4;         /* 信息蓝 */

/* 主题色 */
--gaming-color: #dc2626;       /* 游戏红 */
--workstation-color: #059669;  /* 工作站绿 */
--budget-color: #ea580c;       /* 性价比橙 */
--rgb-color: #7c3aed;          /* RGB紫 */
```

### 字体系统
```css
/* 字体家族 */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--font-display: 'Poppins', sans-serif;

/* 字体大小 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

## 🔒 安全考虑

### 1. 前端安全
- 输入验证和清理
- XSS防护
- CSRF令牌
- 内容安全策略（CSP）

### 2. 数据安全
- HTTPS强制
- 密码哈希（bcrypt）
- JWT令牌认证
- 数据加密存储

### 3. API安全
- 速率限制
- 请求验证
- 错误处理
- 日志记录

## 📈 性能优化

### 1. 前端优化
- 图片懒加载
- 代码分割
- 缓存策略
- 服务端渲染（SSR）

### 2. 后端优化
- 数据库索引
- 查询优化
- 缓存层（Redis）
- CDN加速

### 3. 监控指标
- 页面加载时间
- API响应时间
- 错误率
- 用户交互时间

## 🤝 贡献指南

### 1. 开发流程
```bash
# 1. Fork项目
git clone https://github.com/your-username/pc-builder-website.git

# 2. 创建分支
git checkout -b feature/new-hardware

# 3. 提交更改
git add .
git commit -m "添加新的硬件型号"

# 4. 推送分支
git push origin feature/new-hardware

# 5. 创建Pull Request
```

### 2. 代码规范
- 使用ESLint进行代码检查
- 遵循Airbnb JavaScript风格指南
- 提交信息使用约定式提交
- 添加适当的注释和文档

### 3. 测试要求
- 单元测试覆盖率 > 80%
- 集成测试关键路径
- 端到端测试用户流程
- 性能测试基准

## 📞 支持与联系

### 问题反馈
- GitHub Issues: https://github.com/your-username/pc-builder-website/issues
- 电子邮件: support@pcbuilder.com
- 社区论坛: https://community.pcbuilder.com

## 📦 硬件数据库与价格管理

> 位置：`data/` 目录

### 数据结构

| 文件 | 说明 |
|------|------|
| `data/hardware-v2.json` | 主数据文件，含所有硬件商品完整字段 |
| `data/hardware-schema.json` | JSON Schema 合同（用于验证） |
| `data/hardware-types.ts` | TypeScript 接口定义 |
| `data/price-update-template.csv` | 价格批量更新 CSV 模板 |
| `scripts/update-prices.js` | 价格更新脚本 |
| `data/price-history.jsonl` | 价格变更流水（自动生成） |

### 核心字段

每条记录包含：

```json
{
  "id": "cpu-001",
  "category": "cpu",
  "name": "AMD Ryzen 9 9850X3D",
  "brand": "amd",
  "brandName": "AMD",
  "specs": "16核32线程 / 4.5-6.0GHz / AM5",
  "tags": ["gaming", "rgb"],
  "price": 6999,
  "priceUpdatedAt": "2025-05-10T08:30:00.000Z",
  "priceSource": "manual",
  "listPrice": 7499,
  "stock": 18,
  "stockStatus": "in_stock",
  "images": [],
  "officialUrl": "https://...",
  "jdUrl": "https://search.jd.com/...",
  "taobaoUrl": "https://s.taobao.com/...",
  "flags": { "isFeatured": true },
  "publishedAt": "2024-12-01T00:00:00.000Z"
}
```

**价格元数据**：
- `priceUpdatedAt`：ISO 8601，最后一次价格变更时间
- `priceSource`：`manual`（手动录入）| `api`（开放平台同步）| `import`（批量导入）| `initial`（初始数据）
- `listPrice`：建议零售价（用于显示划线折扣）

### 批量更新流程（可重复执行）

**步骤 1**：复制 `data/price-update-template.csv`，填入新价格，保存为 `data/price-update-2025-06.csv`

**步骤 2**：预览（不写入任何文件）
```bash
node scripts/update-prices.js --dry-run data/price-update-2025-06.csv
```

**步骤 3**：确认无误后正式执行
```bash
node scripts/update-prices.js data/price-update-2025-06.csv
```

**步骤 4**：查看单品历史
```bash
node scripts/update-prices.js --show-history cpu-001
```

每次执行结果：
- `data/hardware-v2.json` 中对应记录的价格 + `priceUpdatedAt` + `priceSource` 更新
- `data/price-history.jsonl` 追加一条变更流水（操作人、时间戳、旧价、新价）

### 更新频率建议

| 场景 | 频率 | 方式 |
|------|------|------|
| 促销活动期间 | 每天 | 手动或 CSV |
| 日常维护 | 每周 | CSV 批量导入 |
| 实时价格（需企业资质）| 实时/每日 | 对接京东/淘宝开放平台 API |

### 价格免责声明

> ⚠️ **重要**：网站上展示的价格仅供参考，以电商平台结算页实际价格为准。
>
> 价格随市场波动，可能与京东、淘宝等平台存在短暂差异。建议用户在购买前自行到对应平台核实最新价格。本平台不对此差异承担任何责任。

### 京东 / 淘宝平台对接说明

#### 方案 A：官方开放平台（推荐，需企业资质）

**京东开放平台**
- 文档：https://open.jd.com（京东开放平台）
- 资质要求：企业营业执照、签署《京东开放平台服务协议》、具有店铺
- 关键接口：`JD_SUPPLIER_PRICE_GET`（获取商品价格）
- 配置项（**写入 `.env`，勿提交仓库**）：
  ```
  JD_APP_KEY=your_jd_app_key
  JD_APP_SECRET=your_jd_app_secret
  JD_ACCESS_TOKEN=your_oauth_token   # OAuth 2.0，需定期刷新
  ```

**淘宝开放平台（阿里开放平台）**
- 文档：https://open.taobao.com/
- 资质要求：淘宝商家账号、企业实名认证
- 关键接口：`taobao.item.seller.list`（获取卖家商品信息，含价格/库存）
- 配置项（**写入 `.env`，勿提交仓库**）：
  ```
  TAOBAO_APP_KEY=your_taobao_app_key
  TAOBAO_APP_SECRET=your_taobao_app_secret
  TAOBAO_SESSION_KEY=your_session_token
  ```

> 申请流程：联系京东/淘宝商务经理 → 签署合作协议 → 获取密钥 → 对接开发文档。

#### 方案 B：禁止事项（❌ 不要做）

> 🚫 **未经授权抓取电商平台商品页**
>
> - 技术风险：反爬、IP 封禁、验证码、数据不稳定
> - 法律风险：违反《反不正当竞争法》《数据安全法》《个人信息保护法》
> - 平台协议：京东/淘宝用户协议明确禁止未授权数据采集
>
> 即使出于比价目的，爬虫仍属违规，可能导致店铺被封禁或法律诉讼。

#### 方案 C：替代方案（无成本，零风险）

| 方案 | 说明 | 成本 |
|------|------|------|
| a) 运营导出导入 | 京东商家工作台/淘宝千牛导出 → 手动填 CSV → 脚本更新 | 低人力 |
| b) 第三方授权数据服务 | 购买已授权的比价数据 API（需核实数据来源合法性）| 中等 |
| c) 比价跳转链接 | 价格旁显示「去京东比价 →」按钮，跳转搜索页 | 零成本 |

**落地推荐**：在商品卡片价格下方展示「参考价，以电商结算页为准」+ 跳转链接：
```html
<span class="price-compare-link" onclick="window.open('https://search.jd.com/Search?keyword=AMD+Ryzen+9+9850X3D','_blank')">
  去京东比价 →
</span>
<span class="price-updated">价格更新于 2025-05-10</span>
```

## 📞 支持与联系
- API文档: https://docs.pcbuilder.com/api
- 用户指南: https://docs.pcbuilder.com/guide
- 开发文档: https://docs.pcbuilder.com/dev

### 社交媒体
- Twitter: @PCBuilder
- Discord: https://discord.gg/pcbuilder
- Reddit: r/PCBuilder

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和技术：
- [Font Awesome](https://fontawesome.com/) - 图标库
- [Google Fonts](https://fonts.google.com/) - 字体服务
- [Inter](https://rsms.me/inter/) - 字体设计
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - 编程字体

---

**🎉 祝您装机愉快！**

如果有任何问题或建议，请随时联系我们。我们致力于提供最好的电脑硬件购物体验。
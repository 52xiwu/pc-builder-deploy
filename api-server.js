/**
 * 电脑硬件销售网站 - 完整后端API服务器
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet()); // 安全头部
app.use(compression()); // 压缩响应
app.use(cors()); // 跨域支持
app.use(bodyParser.json()); // JSON解析
app.use(bodyParser.urlencoded({ extended: true }));

// 日志中间件
app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'logs', 'api-access.log'), { flags: 'a' })
}));

// 创建日志目录
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'pc-builder-secret-key-2024';

// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '需要认证令牌' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '无效的令牌' });
    }
    req.user = user;
    next();
  });
};

// 内存数据库
let users = [
  {
    id: 'user1',
    username: 'demo',
    email: 'demo@example.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // password: demo123
    name: '演示用户',
    phone: '13800138000',
    address: '北京市海淀区中关村',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

let orders = [];
let carts = {};
let configurations = [];

// 硬件数据库
const hardwareDatabase = {
  cpu: [
    { id: 'cpu1', name: 'Intel Core i9-14900K', specs: '24核心/32线程 3.2-6.0GHz', price: 4299, brand: 'intel', category: 'high-end', socket: 'lga1700', tdp: 125, cores: 24, threads: 32, stock: 50 },
    { id: 'cpu2', name: 'AMD Ryzen 9 7950X', specs: '16核心/32线程 4.5-5.7GHz', price: 3999, brand: 'amd', category: 'high-end', socket: 'am5', tdp: 170, cores: 16, threads: 32, stock: 45 },
    { id: 'cpu3', name: 'Intel Core i7-14700K', specs: '20核心/28线程 3.4-5.6GHz', price: 3299, brand: 'intel', category: 'mid-range', socket: 'lga1700', tdp: 125, cores: 20, threads: 28, stock: 60 },
    { id: 'cpu4', name: 'AMD Ryzen 7 7800X3D', specs: '8核心/16线程 4.2-5.0GHz', price: 2999, brand: 'amd', category: 'gaming', socket: 'am5', tdp: 120, cores: 8, threads: 16, stock: 55 },
    { id: 'cpu5', name: 'Intel Core i5-14600K', specs: '14核心/20线程 3.5-5.3GHz', price: 2299, brand: 'intel', category: 'mid-range', socket: 'lga1700', tdp: 125, cores: 14, threads: 20, stock: 70 },
    { id: 'cpu6', name: 'AMD Ryzen 5 7600X', specs: '6核心/12线程 4.7-5.3GHz', price: 1699, brand: 'amd', category: 'budget', socket: 'am5', tdp: 105, cores: 6, threads: 12, stock: 80 }
  ],
  gpu: [
    { id: 'gpu1', name: 'NVIDIA RTX 4090', specs: '24GB GDDR6X', price: 12999, brand: 'nvidia', category: 'high-end', vram: 24, power: 450, stock: 20 },
    { id: 'gpu2', name: 'NVIDIA RTX 4080 SUPER', specs: '16GB GDDR6X', price: 8499, brand: 'nvidia', category: 'high-end', vram: 16, power: 320, stock: 25 },
    { id: 'gpu3', name: 'AMD Radeon RX 7900 XTX', specs: '24GB GDDR6', price: 7999, brand: 'amd', category: 'high-end', vram: 24, power: 355, stock: 22 },
    { id: 'gpu4', name: 'NVIDIA RTX 4070 Ti SUPER', specs: '16GB GDDR6X', price: 6499, brand: 'nvidia', category: 'mid-range', vram: 16, power: 285, stock: 35 },
    { id: 'gpu5', name: 'AMD Radeon RX 7800 XT', specs: '16GB GDDR6', price: 4099, brand: 'amd', category: 'mid-range', vram: 16, power: 263, stock: 40 },
    { id: 'gpu6', name: 'NVIDIA RTX 4060 Ti', specs: '8GB GDDR6', price: 3299, brand: 'nvidia', category: 'budget', vram: 8, power: 160, stock: 50 }
  ],
  motherboard: [
    { id: 'mb1', name: 'ROG MAXIMUS Z790 HERO', specs: 'Intel Z790 ATX', price: 4999, brand: 'asus', socket: 'lga1700', chipset: 'z790', formFactor: 'atx', stock: 30 },
    { id: 'mb2', name: 'MSI MEG X670E GODLIKE', specs: 'AMD X670E E-ATX', price: 6999, brand: 'msi', socket: 'am5', chipset: 'x670e', formFactor: 'e-atx', stock: 15 },
    { id: 'mb3', name: 'ASUS TUF GAMING B760-PLUS', specs: 'Intel B760 ATX', price: 1499, brand: 'asus', socket: 'lga1700', chipset: 'b760', formFactor: 'atx', stock: 50 },
    { id: 'mb4', name: 'GIGABYTE B650 AORUS ELITE', specs: 'AMD B650 ATX', price: 1699, brand: 'gigabyte', socket: 'am5', chipset: 'b650', formFactor: 'atx', stock: 45 },
    { id: 'mb5', name: 'ASRock B760M Steel Legend', specs: 'Intel B760 mATX', price: 1199, brand: 'asrock', socket: 'lga1700', chipset: 'b760', formFactor: 'micro-atx', stock: 55 },
    { id: 'mb6', name: 'MSI PRO B650M-A WIFI', specs: 'AMD B650 mATX', price: 1299, brand: 'msi', socket: 'am5', chipset: 'b650', formFactor: 'micro-atx', stock: 50 }
  ],
  ram: [
    { id: 'ram1', name: 'G.SKILL Trident Z5 RGB', specs: '32GB (2x16GB) DDR5 6000MHz', price: 1099, brand: 'gskill', speed: 6000, capacity: 32, type: 'ddr5', rgb: true, stock: 40 },
    { id: 'ram2', name: 'CORSAIR Dominator Platinum', specs: '64GB (2x32GB) DDR5 5600MHz', price: 2299, brand: 'corsair', speed: 5600, capacity: 64, type: 'ddr5', rgb: true, stock: 25 },
    { id: 'ram3', name: 'Kingston FURY Beast', specs: '32GB (2x16GB) DDR5 5200MHz', price: 899, brand: 'kingston', speed: 5200, capacity: 32, type: 'ddr5', rgb: false, stock: 60 },
    { id: 'ram4', name: 'TeamGroup T-Force Delta RGB', specs: '16GB (2x8GB) DDR5 6000MHz', price: 699, brand: 'teamgroup', speed: 6000, capacity: 16, type: 'ddr5', rgb: true, stock: 70 },
    { id: 'ram5', name: 'Crucial Pro DDR5', specs: '32GB (2x16GB) DDR5 4800MHz', price: 799, brand: 'crucial', speed: 4800, capacity: 32, type: 'ddr5', rgb: false, stock: 65 },
    { id: 'ram6', name: 'ADATA XPG Lancer RGB', specs: '16GB (2x8GB) DDR5 5600MHz', price: 599, brand: 'adata', speed: 5600, capacity: 16, type: 'ddr5', rgb: true, stock: 75 }
  ],
  storage: [
    { id: 'ssd1', name: 'Samsung 990 PRO', specs: '2TB NVMe PCIe 4.0', price: 1299, brand: 'samsung', type: 'nvme', capacity: 2000, interface: 'pcie4', read: 7450, write: 6900, stock: 35 },
    { id: 'ssd2', name: 'WD Black SN850X', specs: '2TB NVMe PCIe 4.0', price: 1199, brand: 'wd', type: 'nvme', capacity: 2000, interface: 'pcie4', read: 7300, write: 6600, stock: 40 },
    { id: 'ssd3', name: 'Crucial P5 Plus', specs: '1TB NVMe PCIe 4.0', price: 599, brand: 'crucial', type: 'nvme', capacity: 1000, interface: 'pcie4', read: 6600, write: 5000, stock: 80 },
    { id: 'ssd4', name: 'Kingston KC3000', specs: '2TB NVMe PCIe 4.0', price: 1099, brand: 'kingston', type: 'nvme', capacity: 2000, interface: 'pcie4', read: 7000, write: 7000, stock: 38 },
    { id: 'ssd5', name: 'Seagate FireCuda 530', specs: '1TB NVMe PCIe 4.0', price: 699, brand: 'seagate', type: 'nvme', capacity: 1000, interface: 'pcie4', read: 7300, write: 6000, stock: 42 },
    { id: 'ssd6', name: 'TeamGroup Cardea Z440', specs: '2TB NVMe PCIe 4.0', price: 999, brand: 'teamgroup', type: 'nvme', capacity: 2000, interface: 'pcie4', read: 7000, write: 6850, stock: 45 }
  ],
  cooling: [
    { id: 'cool1', name: 'NZXT Kraken 360 RGB', specs: '360mm AIO 水冷', price: 1299, brand: 'nzxt', type: 'aio', radiatorSize: 360, rgb: true, fans: 3, stock: 25 },
    { id: 'cool2', name: 'Corsair iCUE H150i ELITE', specs: '360mm AIO 水冷', price: 1499, brand: 'corsair', type: 'aio', radiatorSize: 360, rgb: true, fans: 3, stock: 20 },
    { id: 'cool3', name: 'Noctua NH-D15', specs: '双塔风冷', price: 699, brand: 'noctua', type: 'air', height: 165, rgb: false, fans: 2, stock: 35 },
    { id: 'cool4', name: 'Deepcool AK620', specs: '双塔风冷', price: 399, brand: 'deepcool', type: 'air', height: 160, rgb: false, fans: 2, stock: 50 },
    { id: 'cool5', name: 'ARCTIC Liquid Freezer II', specs: '240mm AIO 水冷', price: 799, brand: 'arctic', type: 'aio', radiatorSize: 240, rgb: false, fans: 2, stock: 30 },
    { id: 'cool6', name: 'Cooler Master Hyper 212', specs: '单塔风冷', price: 199, brand: 'coolermaster', type: 'air', height: 159, rgb: false, fans: 1, stock: 100 }
  ],
  psu: [
    { id: 'psu1', name: 'Seasonic PRIME TX-1000', specs: '1000W 80+钛金', price: 1999, brand: 'seasonic', wattage: 1000, efficiency: 'titanium', modular: 'full', stock: 20 },
    { id: 'psu2', name: 'Corsair RM1000x SHIFT', specs: '1000W 80+金牌', price: 1499, brand: 'corsair', wattage: 1000, efficiency: 'gold', modular: 'full', stock: 25 },
    { id: 'psu3', name: 'be quiet! Dark Power 13', specs: '850W 80+钛金', price: 1699, brand: 'bequiet', wattage: 850, efficiency: 'titanium', modular: 'full', stock: 18 },
    { id: 'psu4', name: 'EVGA SuperNOVA 850 G6', specs: '850W 80+金牌', price: 999, brand: 'evga', wattage: 850, efficiency: 'gold', modular: 'full', stock: 30 },
    { id: 'psu5', name: 'Cooler Master V850', specs: '850W 80+金牌', price: 899, brand: 'coolermaster', wattage: 850, efficiency: 'gold', modular: 'full', stock: 35 },
    { id: 'psu6', name: 'Thermaltake Toughpower GF1', specs: '750W 80+金牌', price: 699, brand: 'thermaltake', wattage: 750, efficiency: 'gold', modular: 'full', stock: 40 }
  ],
  case: [
    { id: 'case1', name: 'Lian Li O11 Dynamic EVO', specs: '中塔机箱 RGB', price: 999, brand: 'lianli', size: 'mid-tower', formFactors: ['atx', 'micro-atx', 'mini-itx'], rgb: true, fans: 0, stock: 25 },
    { id: 'case2', name: 'NZXT H9 Flow', specs: '双腔中塔机箱', price: 1299, brand: 'nzxt', size: 'mid-tower', formFactors: ['atx', 'micro-atx', 'mini-itx'], rgb: true, fans: 3, stock: 20 },
    { id: 'case3', name: 'Fractal Design North', specs: '胡桃木中塔机箱', price: 1199, brand: 'fractal', size: 'mid-tower', formFactors: ['atx', 'micro-atx', 'mini-itx'], rgb: false, fans: 2, stock: 15 },
    { id: 'case4', name: 'Corsair 4000D Airflow', specs: '中塔机箱 网孔面板', price: 699, brand: 'corsair', size: 'mid-tower', formFactors: ['atx', 'micro-atx', 'mini-itx'], rgb: false, fans: 2, stock: 40 },
    { id: 'case5', name: 'Phanteks Eclipse G360A', specs: '中塔机箱 RGB', price: 599, brand: 'phanteks', size: 'mid-tower
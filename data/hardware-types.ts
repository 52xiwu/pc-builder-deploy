/**
 * hardware-types.ts
 * 联信装机 · 硬件数据 TypeScript 接口定义 v2
 * 对应 data/hardware-schema.json
 */

// ── 枚举 ───────────────────────────────────────────
export type HardwareCategory =
  | 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage'
  | 'cooling' | 'psu' | 'case' | 'monitor' | 'keyboard' | 'mouse' | 'headset';

export type PriceSource = 'manual' | 'api' | 'import' | 'initial';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export type FilterTag = 'gaming' | 'workstation' | 'budget' | 'rgb' | 'all-in-one' | 'all';

// ── 结构化规格 ──────────────────────────────────────
export interface SpecDetails {
  cores?:         number;   // CPU 核心
  threads?:       number;   // CPU 线程
  baseFreq?:      number;   // 基础频率 GHz
  boostFreq?:     number;   // 加速频率 GHz
  socket?:        string;   // 插槽
  chipset?:       string;   // 芯片组
  formFactor?:    string;   // 板型 atx | micro-atx | mini-itx | e-atx
  tdp?:           number;   // 功耗 W
  vram?:          number;   // 显存 GB
  vramType?:      string;   // 显存类型 GDDR6X
  busWidth?:      number;   // 位宽 bit
  power?:         number;   // 整卡功耗 W
  length?:        number;   // 显卡长度 mm
  height?:        number;   // 散热器高度 mm
  capacity?:      number;   // 容量 GB
  speed?:         number;   // 频率 MHz / 读写 MB/s
  type?:          string;   // ddr4 | ddr5 | nvme | sata | 2.5inch | 3.5inch
  interface_?:    string;   // 接口协议 pcie4 | pcie5 | usb3.2
  readSpeed?:     number;   // 顺序读取 MB/s
  writeSpeed?:    number;   // 顺序写入 MB/s
  rgb?:           boolean;  // 支持 RGB
  warrantyMonths?: number;  // 保修期 月
}

// ── 主数据类型 ──────────────────────────────────────
export interface HardwareItem {
  id:            string;          // 唯一标识 "cpu-001"
  category:      HardwareCategory;
  subCategory?:  string;          // gaming | workstation | budget

  name:          string;
  brand:         string;          // 品牌标识 nvidia | asus | corsair
  brandName:     string;          // 品牌中文名
  series?:       string;          // 系列 ROG | RTX 40

  specs:         string;          // 展示用规格摘要
  specDetails?:  SpecDetails;     // 结构化规格

  tags:          FilterTag[];     // ['gaming'] | ['budget','rgb']

  // 价格（核心）
  price:          number;          // 当前售价
  priceUpdatedAt:  string;         // ISO 8601 最后更新
  priceSource:    PriceSource;     // manual | api | import | initial
  listPrice?:     number;          // 划线价（建议零售）
  cost?:          number;          // 成本（管理后台）

  // 库存
  stock?:         number;
  stockStatus?:   StockStatus;

  // 媒体 & 链接
  images?:        string[];        // 商品图 URL[]
  officialUrl?:   string;
  jdUrl?:        string;
  taobaoUrl?:    string;

  // 标记
  flags?: {
    isBundle?:      boolean;       // 套装
    isRefurbished?: boolean;       // 官翻
    isFeatured?:    boolean;       // 精选
  };

  // 时间戳
  createdAt?:    string;
  updatedAt?:    string;
  publishedAt?:  string;
}

// ── API 响应封装 ───────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?:   T;
  error?:  string;
  meta?: {
    total?:   number;
    page?:    number;
    pageSize?: number;
    source?:  PriceSource;   // 本次数据来源
  };
}

// ── 价格更新记录 ───────────────────────────────────
export interface PriceHistoryEntry {
  id:         string;
  hardwareId: string;
  price:      number;
  source:     PriceSource;
  updatedAt:  string;      // ISO 8601
  operator?:  string;      // 操作人（manual 时记录）
}

// ── 批量导入 CSV 格式 ───────────────────────────────
// id,category,price,priceSource,stock,listPrice
// cpu-001,cpu,4299,manual,50,4999
// gpu-001,gpu,12999,import,20,13999

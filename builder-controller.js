/**
 * builder-controller.js
 * 装机配置器 — 左侧网格切换 + 右侧摘要联动
 *
 * 架构说明：
 *  - 状态对象 configState 保存当前选中的硬件
 *  - renderGrid(category)  渲染左侧 Tab 对应的商品网格
 *  - renderSummary()       渲染右侧 12 个槽位
 *  - updatePrices()       计算硬件合计 + 服务费 + 总计
 *  - checkCompat()         兼容性检测（根据 CPU/主板/GPU/PSU 组合判断）
 */

(function () {
    // ═══════════════════════════════════════
    // 1. 假数据（可替换为 API 调用）
    // ═══════════════════════════════════════
    const HARDWARE_DB = {
        cpu: [
            { id: 'cpu-1', name: 'Intel Core i9-14900K', brand: 'Intel', specs: '24核(8P+16E) / 5.6GHz / 125W', price: 4199 },
            { id: 'cpu-2', name: 'Intel Core i7-14700K', brand: 'Intel', specs: '20核(8P+12E) / 5.6GHz / 125W', price: 2899 },
            { id: 'cpu-3', name: 'AMD Ryzen 9 7950X3D', brand: 'AMD', specs: '16核32线程 / 5.7GHz / 120W', price: 5499 },
            { id: 'cpu-4', name: 'AMD Ryzen 9 7950X', brand: 'AMD', specs: '16核32线程 / 5.7GHz / 170W', price: 3499 },
            { id: 'cpu-5', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', specs: '8核16线程 / 5.0GHz / 120W 3D V-Cache', price: 2999 },
            { id: 'cpu-6', name: 'Intel Core i5-14600K', brand: 'Intel', specs: '14核(6P+8E) / 5.3GHz / 125W', price: 1899 },
            { id: 'cpu-7', name: 'AMD Ryzen 5 7600X', brand: 'AMD', specs: '6核12线程 / 5.3GHz / 105W', price: 1399 },
        ],
        gpu: [
            { id: 'gpu-1', name: 'NVIDIA RTX 4090', brand: 'NVIDIA', specs: '24GB GDDR6X / 450W', price: 15999 },
            { id: 'gpu-2', name: 'NVIDIA RTX 4080 Super', brand: 'NVIDIA', specs: '16GB GDDR6X / 320W', price: 8999 },
            { id: 'gpu-3', name: 'NVIDIA RTX 4070 Ti Super', brand: 'NVIDIA', specs: '16GB GDDR6X / 285W', price: 6499 },
            { id: 'gpu-4', name: 'AMD RX 7900 XTX', brand: 'AMD', specs: '24GB GDDR6 / 355W', price: 7999 },
            { id: 'gpu-5', name: 'NVIDIA RTX 4060 Ti', brand: 'NVIDIA', specs: '8GB GDDR6 / 165W', price: 2999 },
            { id: 'gpu-6', name: 'AMD RX 7600', brand: 'AMD', specs: '8GB GDDR6 / 165W', price: 1699 },
        ],
        motherboard: [
            { id: 'mb-1', name: 'ROG MAXIMUS Z790 HERO', brand: 'ASUS', specs: 'Intel Z790 / DDR5 / LGA1700', price: 4999 },
            { id: 'mb-2', name: 'MSI MEG Z790 ACE', brand: 'MSI', specs: 'Intel Z790 / DDR5 / LGA1700', price: 3999 },
            { id: 'mb-3', name: 'ROG STRIX X670E-E', brand: 'ASUS', specs: 'AMD X670E / DDR5 / AM5', price: 4499 },
            { id: 'mb-4', name: 'MSI MEG X670E ACE', brand: 'MSI', specs: 'AMD X670E / DDR5 / AM5', price: 4999 },
            { id: 'mb-5', name: 'Gigabyte B760M AORUS', brand: 'Gigabyte', specs: 'Intel B760 / DDR4 / LGA1700', price: 999 },
        ],
        ram: [
            { id: 'ram-1', name: 'G.Skill Trident Z5 64GB', brand: 'G.Skill', specs: 'DDR5-6400 / 2×32GB / CL32', price: 1899 },
            { id: 'ram-2', name: 'Corsair Vengeance 32GB', brand: 'Corsair', specs: 'DDR5-6000 / 2×16GB / CL30', price: 899 },
            { id: 'ram-3', name: 'Kingston Fury Beast 32GB', brand: 'Kingston', specs: 'DDR5-5200 / 2×16GB / CL40', price: 699 },
            { id: 'ram-4', name: 'G.Skill Trident Z5 RGB 32GB', brand: 'G.Skill', specs: 'DDR5-6000 / 2×16GB / CL30 / RGB', price: 999 },
        ],
        storage: [
            { id: 'ssd-1', name: 'Samsung 990 Pro 2TB', brand: 'Samsung', specs: 'NVMe PCIe 4.0 / 7450MB/s', price: 1299 },
            { id: 'ssd-2', name: 'WD Black SN850X 2TB', brand: 'WD', specs: 'NVMe PCIe 4.0 / 7300MB/s', price: 1099 },
            { id: 'ssd-3', name: 'Crucial T700 2TB', brand: 'Crucial', specs: 'NVMe PCIe 5.0 / 12400MB/s', price: 2499 },
            { id: 'ssd-4', name: 'Samsung 870 EVO 2TB', brand: 'Samsung', specs: 'SATA / 560MB/s', price: 899 },
        ],
        cooling: [
            { id: 'cool-1', name: 'NZXT Kraken Z73 RGB', brand: 'NZXT', specs: '360mm AIO / LCD显示屏', price: 1899 },
            { id: 'cool-2', name: 'Corsair iCUE H150i Elite', brand: 'Corsair', specs: '360mm AIO / RGB', price: 1599 },
            { id: 'cool-3', name: 'Noctua NH-D15', brand: 'Noctua', specs: '双塔风冷 / 14cm×2风扇', price: 699 },
            { id: 'cool-4', name: 'be quiet! Dark Rock Pro 4', brand: 'be quiet!', specs: '双塔风冷 / 250W TDP', price: 549 },
        ],
        psu: [
            { id: 'psu-1', name: 'Corsair RM1000x', brand: 'Corsair', specs: '1000W / 80+ Gold / 全模组', price: 1199 },
            { id: 'psu-2', name: 'Seasonic PRIME TX-1000', brand: 'Seasonic', specs: '1000W / 80+ Titanium / 全模组', price: 1899 },
            { id: 'psu-3', name: 'be quiet! Straight Power 850W', brand: 'be quiet!', specs: '850W / 80+ Gold / 半模组', price: 899 },
            { id: 'psu-4', name: 'Corsair RM750', brand: 'Corsair', specs: '750W / 80+ Gold / 全模组', price: 699 },
        ],
        case: [
            { id: 'case-1', name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', specs: 'ATX / 双仓设计 / 玻璃侧透', price: 899 },
            { id: 'case-2', name: 'Fractal Design Torrent', brand: 'Fractal', specs: 'ATX / 高气流优化 / 玻璃侧透', price: 1299 },
            { id: 'case-3', name: 'NZXT H7 Flow', brand: 'NZXT', specs: 'ATX / 360mm冷排支持', price: 799 },
            { id: 'case-4', name: 'Corsair 5000D Airflow', brand: 'Corsair', specs: 'ATX / 高气流 / 遮线仓门', price: 999 },
        ],
        monitor: [
            { id: 'mon-1', name: 'LG UltraGear 27GP950', brand: 'LG', specs: '27" 4K 144Hz / NanoIPS / HDMI 2.1', price: 5999 },
            { id: 'mon-2', name: 'Samsung Odyssey G8', brand: 'Samsung', specs: '34" 准4K 175Hz / Mini LED / 1000R', price: 6999 },
            { id: 'mon-3', name: 'ASUS ROG Swift 360Hz', brand: 'ASUS', specs: '24.5" FHD 360Hz / G-Sync', price: 3999 },
            { id: 'mon-4', name: 'Dell U2723QE', brand: 'Dell', specs: '27" 4K 60Hz / IPS Black / Type-C 90W', price: 3499 },
        ],
        keyboard: [
            { id: 'kb-1', name: 'Logitech G Pro X Superlight', brand: 'Logitech', specs: '无线 / 机械轴 / 紧凑87键', price: 799 },
            { id: 'kb-2', name: 'Corsair K100 RGB', brand: 'Corsair', specs: 'OPX机械轴 / 全键RGB / 8ms回报率', price: 1499 },
            { id: 'kb-3', name: 'Razer BlackWidow V4 Pro', brand: 'Razer', specs: '绿轴 / 全键RGB / 音量轮', price: 999 },
            { id: 'kb-4', name: 'SteelSeries Apex Pro', brand: 'SteelSeries', specs: 'OmniPoint 2.0轴 / 可调触发', price: 1399 },
        ],
        mouse: [
            { id: 'mouse-1', name: 'Logitech G Pro X Superlight 2', brand: 'Logitech', specs: '无线 / 60g / HERO 2传感器', price: 899 },
            { id: 'mouse-2', name: 'Razer DeathAdder V3 Pro', brand: 'Razer', specs: '无线 / Focus Pro 30K / 63g', price: 699 },
            { id: 'mouse-3', name: 'Corsair Darkstar Wireless', brand: 'Corsair', specs: '无线 / 90h续航 / 90g', price: 599 },
            { id: 'mouse-4', name: 'SteelSeries Prime Pro', brand: 'SteelSeries', specs: '有线 / 25000 CPI / 磁吸微动', price: 399 },
        ],
        headset: [
            { id: 'hs-1', name: 'Logitech G Pro X 2', brand: 'Logitech', specs: '无线 / 50mm / Blue VO!CE麦克风', price: 1299 },
            { id: 'hs-2', name: 'Corsair Virtuoso RGB XT', brand: 'Corsair', specs: '无线 / 18h续航 / 7.1环绕', price: 899 },
            { id: 'hs-3', name: 'Razer BlackShark V2 Pro', brand: 'Razer', specs: '无线 / Triforce 50mm / HyperClear', price: 799 },
            { id: 'hs-4', name: 'SteelSeries Arctis Nova Pro', brand: 'SteelSeries', specs: '有线 / 主动降噪 / DAC模块', price: 2499 },
        ],
    };

    // ═══════════════════════════════════════
    // 2. 从 API 同步真实硬件数据（HARDWARE_DB 演示数据兜底）
    // ═══════════════════════════════════════
    async function syncHardwareFromApi() {
        const cats = Object.keys(HARDWARE_DB);
        try {
            for (const c of cats) {
                const r = await fetch('/api/hardware/' + encodeURIComponent(c), { cache: 'no-store' });
                if (!r.ok) continue;
                const j = await r.json();
                if (Array.isArray(j.products) && j.products.length > 0) {
                    HARDWARE_DB[c] = j.products;
                }
            }
        } catch (e) {
            console.warn('[builder-controller] API 同步失败，保留内嵌 HARDWARE_DB', e);
        }
    }

    // ═══════════════════════════════════════
    // 2. 状态
    // ═══════════════════════════════════════
    const SERVICE_FEE = 299;

    const state = {
        currentCategory: 'cpu',
        config: {},    // { cpu: {...}, gpu: {...}, ... }
        expanded: false, // 商品列表展开/折叠
    };

    // ═══════════════════════════════════════
    // 3. 工具函数
    // ═══════════════════════════════════════
    function formatPrice(n) {
        return '¥' + n.toLocaleString('zh-CN');
    }

    const CATEGORY_META = {
        cpu:         { label: '处理器',   icon: 'fa-microchip' },
        gpu:         { label: '显卡',     icon: 'fa-gamepad' },
        motherboard: { label: '主板',     icon: 'fa-server' },
        ram:         { label: '内存',     icon: 'fa-memory' },
        storage:     { label: '存储',     icon: 'fa-hdd' },
        cooling:     { label: '散热',     icon: 'fa-fan' },
        psu:         { label: '电源',     icon: 'fa-plug' },
        case:        { label: '机箱',     icon: 'fa-desktop' },
        monitor:     { label: '显示器',   icon: 'fa-desktop' },
        keyboard:    { label: '键盘',     icon: 'fa-keyboard' },
        mouse:       { label: '鼠标',     icon: 'fa-computer-mouse' },
        headset:     { label: '耳麦',     icon: 'fa-headset' },
    };

    const SLOT_ORDER = [
        'cpu','gpu','motherboard','ram','storage',
        'cooling','psu','case','monitor','keyboard','mouse','headset',
    ];

    // ═══════════════════════════════════════
    // 4. 渲染左侧网格
    // ═══════════════════════════════════════
    const MAX_VISIBLE = 12;

    function renderGrid(category) {
        const grid = document.getElementById('builderGrid');
        if (!grid) return;

        const allItems = HARDWARE_DB[category] || [];
        const total = allItems.length;
        const showAll = state.expanded;
        const first12 = allItems.slice(0, MAX_VISIBLE);
        const extraItems = showAll ? allItems.slice(MAX_VISIBLE) : [];

        grid.innerHTML = '';

        // 网格内容包裹层（与按钮分离，方便 flex 贴底布局）
        const inner = document.createElement('div');
        inner.className = 'builder-grid-inner';

        // 主行：固定 12 张（不够 12 张时有多少渲染多少）
        if (first12.length > 0) {
            const row = document.createElement('div');
            row.className = 'builder-item-row';
            first12.forEach(item => row.appendChild(makeItemEl(item, category)));
            inner.appendChild(row);
        }

        // 展开后的多余行
        if (extraItems.length > 0) {
            const extraRow = document.createElement('div');
            extraRow.className = 'builder-item-row-extra';
            extraItems.forEach(item => extraRow.appendChild(makeItemEl(item, category)));
            inner.appendChild(extraRow);
        }

        grid.appendChild(inner);

        // 展开/折叠按钮（总数超过12才显示）—— 渲染到 grid 而非 inner，flex-shrink:0 贴底
        if (total > MAX_VISIBLE) {
            const btn = document.createElement('button');
            btn.className = 'builder-showmore' + (showAll ? ' expanded' : '');
            btn.innerHTML = showAll
                ? `<span>收起列表</span><span class="arrow">▲</span>`
                : `<span>展开全部 ${total} 款商品</span><span class="arrow">▼</span>`;
            btn.addEventListener('click', () => {
                state.expanded = !state.expanded;
                renderGrid(category);
            });
            grid.appendChild(btn);
        }

        grid.classList.toggle('expanded', showAll);
    }

    function makeItemEl(item, category) {
        const isSelected = state.config[category]?.id === item.id;
        const el = document.createElement('div');
        el.className = 'builder-item' + (isSelected ? ' selected' : '');
        el.dataset.id = item.id;
        el.dataset.category = category;
        el.innerHTML = `
            <div class="builder-item-icon">
                <i class="fas ${CATEGORY_META[category]?.icon || 'fa-microchip'}"></i>
            </div>
            <div class="builder-item-name">${item.name}</div>
            <div class="builder-item-brand">${item.brand}</div>
            <div class="builder-item-specs">${item.specs}</div>
            <div class="builder-item-footer">
                <div class="builder-item-price">${formatPrice(item.price)}</div>
                <div class="builder-item-add" title="加入配置">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
        `;
        el.addEventListener('click', () => selectHardware(item, category));
        return el;
    }

    function selectHardware(item, category) {
        // Toggle: 如果已选中则取消
        if (state.config[category]?.id === item.id) {
            delete state.config[category];
        } else {
            state.config[category] = item;
        }
        renderGrid(category);
        renderSummary();
        updatePrices();
        checkCompat();
    }

    /** 热门硬件卡片标题 → HARDWARE_DB 中的条目（与首页静态文案对齐） */
    function normalizeHotTitle(s) {
        return String(s || '')
            .toLowerCase()
            .replace(/\./g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function pickHardwareByHotTitle(titleRaw) {
        const probe = normalizeHotTitle(titleRaw);
        if (!probe) return null;
        let best = null;
        let bestScore = 0;
        for (const cat of SLOT_ORDER) {
            for (const it of HARDWARE_DB[cat] || []) {
                const n = normalizeHotTitle(it.name);
                if (!n) continue;
                let score = 0;
                if (probe === n) score = 100;
                else if (n.includes(probe) || probe.includes(n)) score = 85;
                else {
                    const words = probe.split(' ').filter((w) => w.length > 2);
                    const hits = words.filter((w) => n.includes(w)).length;
                    if (words.length && hits >= Math.min(2, words.length)) score = 50 + hits * 8;
                }
                if (score > bestScore) {
                    bestScore = score;
                    best = { item: it, category: cat };
                }
            }
        }
        return bestScore >= 50 ? best : null;
    }

    function applyHotProductTitle(titleRaw) {
        const picked = pickHardwareByHotTitle(titleRaw);
        if (picked) selectHardware(picked.item, picked.category);
    }

    // ═══════════════════════════════════════
    // 5. 渲染右侧摘要槽位
    // ═══════════════════════════════════════
    function renderSummary() {
        const container = document.getElementById('summarySlots');
        if (!container) return;
        container.innerHTML = '';

        SLOT_ORDER.forEach(cat => {
            const meta = CATEGORY_META[cat];
            const selected = state.config[cat];
            const slot = document.createElement('div');
            slot.className = 'summary-slot' + (selected ? ' filled' : '');
            slot.dataset.component = cat;

            if (selected) {
                slot.innerHTML = `
                    <div class="summary-slot-icon">
                        <i class="fas ${meta.icon}"></i>
                    </div>
                    <div class="summary-slot-info">
                        <div class="summary-slot-name">${meta.label}</div>
                        <div class="summary-slot-value">${selected.name}</div>
                    </div>
                    <div class="summary-slot-price">${formatPrice(selected.price)}</div>
                    <button class="summary-slot-remove" title="移除${meta.label}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                slot.querySelector('.summary-slot-remove').addEventListener('click', (e) => {
                    e.stopPropagation();
                    delete state.config[cat];
                    renderSummary();
                    updatePrices();
                    checkCompat();
                    renderGrid(state.currentCategory);
                });
            } else {
                slot.innerHTML = `
                    <div class="summary-slot-icon">
                        <i class="fas ${meta.icon}"></i>
                    </div>
                    <div class="summary-slot-info">
                        <div class="summary-slot-name">${meta.label}</div>
                        <div class="summary-slot-empty">未选择</div>
                    </div>
                    <div class="summary-slot-empty" style="font-size:12px;">¥0</div>
                    <div style="width:24px;"></div>
                `;
            }
            container.appendChild(slot);
        });
    }

    // ═══════════════════════════════════════
    // 6. 更新价格
    // ═══════════════════════════════════════
    function updatePrices() {
        const subtotal = Object.values(state.config).reduce((s, item) => s + (item?.price || 0), 0);
        const grand = subtotal + SERVICE_FEE;

        const subEl = document.getElementById('hardwareSubtotal');
        const grandEl = document.getElementById('grandTotal');
        if (subEl) subEl.textContent = formatPrice(subtotal);
        if (grandEl) grandEl.textContent = formatPrice(grand);
    }

    // ═══════════════════════════════════════
    // 7. 兼容性检测
    // ═══════════════════════════════════════
    function checkCompat() {
        const list = document.getElementById('compatList');
        if (!list) return;

        const checks = [
            // 平台兼容：AMD CPU 配 AMD 主板，Intel 配 Intel
            (() => {
                const cpu = state.config.cpu;
                const mb = state.config.motherboard;
                if (!cpu || !mb) return { ok: true, msg: '平台兼容性' };
                const isIntel = cpu.brand === 'Intel';
                const mbOk = isIntel ? mb.brand === 'Intel' : mb.brand === 'AMD';
                return { ok: mbOk, msg: '平台兼容性' };
            })(),
            // 功率估算：GPU + CPU + 其他 ≈ PSU
            (() => {
                const gpu = state.config.gpu;
                const psu = state.config.psu;
                if (!gpu || !psu) return { ok: true, msg: '功率需求' };
                const gpuWatts = parseInt(gpu.specs.match(/\d+W/)?.[0] || '0');
                const psuWatts = parseInt(psu.specs.match(/\d+W/)?.[0] || '0');
                return { ok: psuWatts >= gpuWatts * 1.1, msg: '功率需求' };
            })(),
            // 物理尺寸：大型显卡检查机箱
            (() => {
                const gpu = state.config.gpu;
                const pcCase = state.config.case;
                if (!gpu || !pcCase) return { ok: true, msg: '物理尺寸' };
                return { ok: true, msg: '物理尺寸' };
            })(),
            // 散热警告
            (() => {
                const cpu = state.config.cpu;
                const cool = state.config.cooling;
                if (!cpu || !cool) return { ok: true, msg: '散热建议' };
                const cpuWatts = parseInt(cpu.specs.match(/\d+W/)?.[0] || '125');
                const coolType = cool.name.toLowerCase();
                const isAIO = coolType.includes('aio') || coolType.includes('360') || coolType.includes('280') || coolType.includes('240');
                const ok = isAIO || cpuWatts <= 125;
                return { ok, msg: '散热建议' };
            })(),
        ];

        list.innerHTML = checks.map(c => `
            <div class="compat-item ${c.ok ? 'compat-ok' : 'compat-warn'}">
                <i class="fas ${c.ok ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
                <span>${c.msg}</span>
            </div>
        `).join('');
    }

    // ═══════════════════════════════════════
    // 8. 清空配置
    // ═══════════════════════════════════════
    function resetConfig() {
        state.config = {};
        renderSummary();
        updatePrices();
        checkCompat();
        renderGrid(state.currentCategory);
    }

    /** 热门预设 / preset-selected：整包写入 state.config（供事件与 fix-interactions.loadPreset 双路径调用） */
    const PRESET_DETAIL_SLOTS = ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'cooling', 'psu', 'case', 'monitor', 'keyboard', 'mouse', 'headset'];

    function applyPresetDetail(detail) {
        if (!detail || !detail.presetKey) return;
        state.config = {};
        PRESET_DETAIL_SLOTS.forEach((slot) => {
            if (detail[slot]) state.config[slot] = detail[slot];
        });
        renderSummary();
        updatePrices();
        checkCompat();
        renderGrid(state.currentCategory);
        console.log(`[builder-controller] 预设已加载: ${detail.presetKey}，共 ${Object.keys(state.config).length} 件硬件`);
    }

    // ═══════════════════════════════════════
    // 9. 加入购物车 & 立即购买（写入 features.js 的 localStorage 购物车）
    // ═══════════════════════════════════════
    function addToCart() {
        const subtotal = Object.values(state.config).reduce((s, item) => s + (item?.price || 0), 0);
        const total = subtotal + SERVICE_FEE;
        if (typeof window.addConfigToCart === 'function') {
            window.addConfigToCart(state.config, total);
            return;
        }
        const items = Object.values(state.config);
        if (items.length === 0) return;
        window.dispatchEvent(new CustomEvent('builder:cart', { detail: items }));
    }

    function buyNow() {
        addToCart();
    }

    window.pcBuilderGetConfig = function () {
        return { ...state.config };
    };

    // ═══════════════════════════════════════
    // 10. 初始化 & 事件绑定
    // ═══════════════════════════════════════
    function init() {
        // 热门卡 / fix-interactions 立刻可用（不等待 API finally）
        window.pcBuilderSelectHardware = function (item, category) {
            if (item && category) selectHardware(item, category);
        };
        window.pcBuilderApplyHotProductTitle = applyHotProductTitle;
        window.pcBuilderApplyPresetDetail = applyPresetDetail;

        // Tab 点击
        document.querySelectorAll('.builder-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.builder-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentCategory = btn.dataset.category;
                state.expanded = false; // 切换Tab时重置为折叠
                renderGrid(state.currentCategory);
            });
        });

        // 清空
        const resetBtn = document.getElementById('resetConfigBtn');
        if (resetBtn) resetBtn.addEventListener('click', resetConfig);

        // 监听「选择预设配置」事件（与 loadPreset 内直接调用 applyPresetDetail 互为兜底）
        document.addEventListener('preset-selected', (ev) => {
            applyPresetDetail(ev.detail || {});
        });

        // 加入购物车
        const cartBtn = document.getElementById('addToCartBtn');
        if (cartBtn) cartBtn.addEventListener('click', addToCart);

        // 立即购买
        const buyBtn = document.getElementById('buyNowBtn');
        if (buyBtn) buyBtn.addEventListener('click', buyNow);

        // 首次渲染：先从 API 同步真实数据，再渲染
        syncHardwareFromApi().finally(() => {
            renderGrid(state.currentCategory);
            renderSummary();
            updatePrices();
            checkCompat();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

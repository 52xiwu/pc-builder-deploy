/**
 * scripts/update-prices.js
 * ═══════════════════════════════════════════════
 * 价格批量更新脚本
 * 用法：
 *   node scripts/update-prices.js data/price-update-2025-05.csv
 *   node scripts/update-prices.js --dry-run data/price-update.csv
 *   node scripts/update-prices.js --show-history cpu-001
 * ═══════════════════════════════════════════════
 */

const fs   = require('fs');
const path = require('path');

// ── 命令行参数 ────────────────────────────────────
const args = process.argv.slice(2);
const dryRun   = args.includes('--dry-run');
const showHist = args.includes('--show-history');
const csvPath  = args.find(a => !a.startsWith('--') && a.endsWith('.csv'));
const targetId = showHist ? (args.find(a => !a.startsWith('--')) || '') : null;

if (!csvPath && !showHist) {
  console.error('用法:');
  console.error('  node scripts/update-prices.js data/price-update.csv    # 执行更新');
  console.error('  node scripts/update-prices.js --dry-run data/price-update.csv  # 预览');
  console.error('  node scripts/update-prices.js --show-history cpu-001 # 查看历史');
  process.exit(1);
}

// ── 路径 ──────────────────────────────────────────
const DATA_DIR   = path.join(__dirname, '..', 'data');
const JSON_FILE  = path.join(DATA_DIR, 'hardware-v2.json');
const HIST_FILE  = path.join(DATA_DIR, 'price-history.jsonl');

// ── 加载现有数据 ──────────────────────────────────
let hardware = { items: [] };
if (fs.existsSync(JSON_FILE)) {
  try {
    hardware = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  } catch (e) {
    console.error('❌ 无法解析 hardware-v2.json:', e.message);
    process.exit(1);
  }
}

const itemMap = new Map(hardware.items.map(i => [i.id, i]));

// ── 价格历史记录 ──────────────────────────────────
function appendHistory(record) {
  const line = JSON.stringify({
    ...record,
    operator: process.env.USER || 'system',
    timestamp: new Date().toISOString()
  }) + '\n';
  fs.appendFileSync(HIST_FILE, line, 'utf8');
}

function showHistory(id) {
  if (!fs.existsSync(HIST_FILE)) {
    console.log('暂无历史记录');
    return;
  }
  const lines = fs.readFileSync(HIST_FILE, 'utf8').trim().split('\n');
  const matches = lines
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(r => r && r.hardwareId === id);

  if (!matches.length) {
    console.log(`无 ${id} 的历史记录`);
    return;
  }

  console.log(`\n📊 ${id} 价格历史：`);
  console.log('─'.repeat(65));
  matches.slice(-10).forEach(r => {
    const date = r.timestamp ? r.timestamp.slice(0, 16) : '?';
    const src  = r.source || 'manual';
    console.log(`  ${date}  ¥${r.price}  [${src}]  by ${r.operator}`);
  });
}

// ── CSV 解析 ──────────────────────────────────────
/**
 * CSV 格式（带 BOM 容错、宽松空格）：
 * id,category,price,priceSource,stock,listPrice
 * cpu-001,cpu,4299,manual,50,4999
 * gpu-001,gpu,12999,import,20,13999
 */
function parseCSV(csvText) {
  // 去掉 BOM
  const text = csvText.replace(/^\uFEFF/, '');
  const lines = text.trim().split('\n');
  if (!lines.length) return [];

  const header = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < 3) continue;
    const row = {};
    header.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }
  return rows;
}

// ── 主流程：更新价格 ───────────────────────────────
if (csvPath) {
  const fullPath = path.isAbsolute(csvPath)
    ? csvPath
    : path.join(DATA_DIR, csvPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ 文件不存在: ${fullPath}`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(fullPath, 'utf8');
  const rows = parseCSV(csvText);

  console.log(`\n📋 读取到 ${rows.length} 条记录`);
  console.log(`   模式：${dryRun ? '🔍 预览（不写入）' : '✏️  正式更新'}\n`);

  const errors   = [];
  const updated  = [];
  const skipped  = [];

  for (const row of rows) {
    const { id, category, price, pricesource, stock, listprice } = row;

    if (!id || !price) {
      errors.push({ id: id || '?', reason: '缺少 id 或 price 字段' });
      continue;
    }

    const item = itemMap.get(id);
    if (!item) {
      errors.push({ id, reason: 'ID 在数据中不存在，跳过' });
      skipped.push(id);
      continue;
    }

    const newPrice   = parseFloat(price);
    const oldPrice   = item.price;
    const source     = (pricesource || 'manual').toLowerCase();
    const nowISO     = new Date().toISOString();

    if (isNaN(newPrice) || newPrice < 0) {
      errors.push({ id, reason: `price 不是有效数字: ${price}` });
      continue;
    }

    // 预览或写入
    if (!dryRun) {
      item.price           = newPrice;
      item.priceUpdatedAt   = nowISO;
      item.priceSource      = source;
      if (stock)       item.stock = parseInt(stock, 10);
      if (listprice)   item.listPrice = parseFloat(listprice);
      item.updatedAt    = nowISO;

      appendHistory({
        hardwareId: id,
        price: newPrice,
        source,
        oldPrice
      });
    }

    const diff = oldPrice !== newPrice
      ? `  ¥${oldPrice} → ¥${newPrice}  ${newPrice > oldPrice ? '↑' : '↓'} ${Math.abs(newPrice - oldPrice)}`
      : `  (价格不变)`;

    updated.push({ id, oldPrice, newPrice, source, diff });
  }

  // 输出
  console.log('─'.repeat(65));
  if (updated.length) {
    console.log(`\n✅ ${updated.length} 条将/已被更新：`);
    updated.forEach(u => {
      console.log(`  ${u.id.padEnd(12)} ¥${String(u.newPrice).padStart(6)} ${u.source.padEnd(8)} ${u.diff}`);
    });
  }
  if (skipped.length) {
    console.log(`\n⏭️  ${skipped.length} 条跳过（ID 不存在）：${skipped.join(', ')}`);
  }
  if (errors.length) {
    console.log(`\n❌ ${errors.length} 条错误：`);
    errors.forEach(e => console.log(`  ${e.id}: ${e.reason}`));
  }

  // 写回 JSON
  if (!dryRun && updated.length) {
    fs.writeFileSync(JSON_FILE, JSON.stringify(hardware, null, 2), 'utf8');
    console.log(`\n💾 hardware-v2.json 已保存（${updated.length} 条更新）`);
    console.log(`📝 价格历史已追加到 ${HIST_FILE}`);
  }

  if (dryRun) {
    console.log('\n🔍 以上为 dry-run 预览，不实际写入任何文件');
    console.log('   去掉 --dry-run 参数以正式执行');
  }
}

// ── 单品历史查询 ──────────────────────────────────
if (showHist && targetId) {
  showHistory(targetId);
}

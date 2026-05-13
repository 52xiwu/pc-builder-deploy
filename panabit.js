const $ = (id) => document.getElementById(id);

function parseDateLike(s) {
  if (!s) return null;
  const str = String(s).trim();
  const t = str.replace(" ", "T").replace(/\//g, "-");
  const d = new Date(t);
  if (!Number.isFinite(d.getTime())) return null;
  return d;
}

function daysLeft(endAt) {
  const d = parseDateLike(endAt);
  if (!d) return null;
  const now = new Date();
  const a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const b = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.ceil((b - a) / 86400000);
}

function fmtRange(startAt, endAt) {
  const s = startAt ? String(startAt).replace("T", " ") : "";
  const e = endAt ? String(endAt).replace("T", " ") : "";
  if (s && e) return `${s} -> ${e}`;
  return e || s || "";
}

function toLocalInputValue(s) {
  const d = parseDateLike(s);
  if (!d) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

async function api(path, opts) {
  const base = opts || {};
  const headers = { ...(base.headers || {}) };
  const t = sessionStorage.getItem('adminPanelToken');
  if (t && !headers.Authorization) headers.Authorization = "Bearer " + t;
  const res = await fetch(path, { ...base, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok === false) throw new Error(json.error || `请求失败: ${res.status}`);
  return json;
}

let editing = null;
let detailTextCache = "";

function makeShort(value, maxLen) {
  const s = value == null ? "" : String(value);
  if (s.length > maxLen) {
    return { short: s.slice(0, maxLen) + "…", full: s, more: true };
  }
  return { short: s, full: s, more: false };
}

function openModal(title, row) {
  $("modalTitle").textContent = title;
  $("modal").classList.add("open");
  editing = row || null;
  $("f_category").value = row?.category || "电竞网吧";
  $("f_shopName").value = row?.shopName || "";
  $("f_authCode").value = row?.authCode || "";
  $("f_authCode").disabled = !!row;
  $("f_startAt").value = toLocalInputValue(row?.startAt);
  $("f_endAt").value = toLocalInputValue(row?.endAt);
  $("f_maxOnlineIps").value = row?.maxOnlineIps ?? "";
  $("f_sysCode").value = row?.sysCode || "";
  $("f_remark").value = row?.remark || "";
}

function closeModal() {
  $("modal").classList.remove("open");
  editing = null;
}

function render(rows) {
  const catCount = {};
  rows.forEach(r => {
    const c = r.category || '其他';
    catCount[c] = (catCount[c] || 0) + 1;
  });
  const getCatWithCount = (cat) => {
    const c = cat || '其他';
    const cnt = catCount[c] || 0;
    return cnt > 0 ? c + '(' + cnt + '家)' : c;
  };
  const tbody = $("tbody");
  tbody.innerHTML = "";
  for (const r of rows) {
    const left = daysLeft(r.endAt);
    const sys = makeShort(r.sysCode || "", 18);
    const remark = makeShort(r.remark || "", 20);
    const tr = document.createElement("tr");
    if (left != null && left < 0) tr.classList.add("expired");
    else if (left != null && left <= 20) tr.classList.add("soon");

    const badge =
      left == null
        ? `<span class="pill">未知</span>`
        : left < 0
          ? `<span class="pill red">到期</span>`
          : left <= 20
            ? `<span class="pill yellow">快到期</span>`
            : `<span class="pill green">正常</span>`;

    tr.innerHTML = `
      <td class="col-cat">${getCatWithCount(r.category)}</td>
      <td class="col-shop">${r.shopName || ""}</td>
      <td><b>${r.authCode || ""}</b></td>
      <td class="col-range" style="color:#6b7280">${fmtRange(r.startAt, r.endAt)}</td>
      <td class="col-left">${badge} ${left == null ? "" : `${left} 天`}</td>
      <td class="col-max">${r.maxOnlineIps ?? ""}</td>
      <td class="col-sys" style="color:#6b7280">
        <span class="cell-clip">${sys.short}</span>
        ${sys.more ? '<button class="cell-more" data-type="sys">…</button>' : ""}
      </td>
      <td class="col-remark" style="color:#6b7280">
        <span class="cell-clip">${remark.short}</span>
        ${remark.more ? '<button class="cell-more" data-type="remark">…</button>' : ""}
      </td>
      <td style="white-space:nowrap">
        <button class="btn btn-outline btn-sm" data-act="edit">编辑</button>
        <button class="btn btn-danger btn-sm" data-act="del">删除</button>
      </td>
    `;

    const [tdCat, tdShop, , tdRange, tdLeft, tdMax, tdSys, tdRemark] = tr.children;
    const setFull = (td, label, value) => {
      if (!td) return;
      td.title = value || "";
      td.addEventListener("click", () => {
        if (!value) return;
        openDetail(label, value);
      });
    };
    setFull(tdCat, "分类", getCatWithCount(r.category));
    setFull(tdShop, "门店", r.shopName || "");
    setFull(tdRange, "许可时间", fmtRange(r.startAt, r.endAt));
    setFull(tdLeft, "剩余天数", left == null ? "" : `${left} 天（状态：${tdLeft.textContent.trim()}）`);
    setFull(tdMax, "最大在线IP", r.maxOnlineIps ?? "");
    setFull(tdSys, "系统编号", sys.full);
    setFull(tdRemark, "备注", remark.full);

    const moreBtns = tr.querySelectorAll(".cell-more");
    moreBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const type = btn.getAttribute("data-type");
        if (type === "sys") {
          openDetail("系统编号", sys.full);
        } else if (type === "remark") {
          openDetail("备注", remark.full);
        }
      });
    });

    tr.querySelector('[data-act="edit"]').addEventListener("click", () => openModal("编辑", r));
    tr.querySelector('[data-act="del"]').addEventListener("click", async () => {
      if (!confirm(`确认删除授权编号：${r.authCode}？`)) return;
      await api("/api/panabit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: r.id })
      });
      await load();
    });

    tbody.appendChild(tr);
  }
}

async function load() {
  const params = new URLSearchParams();
  const cat = $("category").value;
  const q = $("q").value.trim();
  if (cat) params.set("category", cat);
  if (q) params.set("q", q);
  const json = await api(`/api/panabit/list?${params.toString()}`);
  render(json.data || []);
}

async function save() {
  const payload = {
    id: editing ? editing.id : undefined,
    category: $("f_category").value,
    shopName: $("f_shopName").value.trim(),
    authCode: $("f_authCode").value.trim(),
    startAt: $("f_startAt").value ? $("f_startAt").value : "",
    endAt: $("f_endAt").value ? $("f_endAt").value : "",
    maxOnlineIps: $("f_maxOnlineIps").value,
    sysCode: $("f_sysCode").value.trim(),
    remark: $("f_remark").value.trim()
  };
  if (!payload.authCode) return alert("授权编号必填");

  await api(editing ? "/api/panabit/update" : "/api/panabit/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  closeModal();
  await load();
}

async function doImport() {
  const f = $("file").files?.[0];
  if (!f) return alert("请选择 xlsx/xls 文件");
  const fd = new FormData();
  fd.append("file", f);
  const json = await api("/api/panabit/import", { method: "POST", body: fd });
  alert(`导入完成：${json.imported} 条`);
  $("file").value = "";
  await load();
}

function splitBlocks(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function openDetail(title, text) {
  detailTextCache = text || "";
  $("detailTitle").textContent = title || "详情";
  $("detailText").value = detailTextCache;
  $("detailModal").classList.add("open");
  $("detailText").focus();
  $("detailText").select();
}

function closeDetail() {
  $("detailModal").classList.remove("open");
}

async function copyDetail() {
  const text = detailTextCache || $("detailText").value || "";
  if (!text) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = $("detailText");
      ta.focus();
      ta.select();
      document.execCommand("copy");
    }
    alert("已复制到剪贴板");
  } catch (e) {
    alert("复制失败，请手动 Ctrl + C");
  }
}

function matchFirst(text, patterns) {
  for (const re of patterns) {
    const m = text.match(re);
    if (m && m[1]) return String(m[1]).trim();
  }
  return "";
}

function parseLicenseBlock(block, fallbackCategory) {
  const t = String(block || "");

  const authCode = matchFirst(t, [
    /授权编号[:：]\s*([A-Za-z0-9_-]+)/i,
    /auth\s*code[:：]\s*([A-Za-z0-9_-]+)/i
  ]);

  const sysCode = matchFirst(t, [
    /系统编号[:：]\s*([A-Za-z0-9-]{20,})/i,
    /sys\s*code[:：]\s*([A-Za-z0-9-]{20,})/i
  ]);

  const maxOnlineIpsRaw = matchFirst(t, [
    /最大在线IP数[:：]\s*(\d+)/i,
    /最大在线\s*IP\s*数[:：]\s*(\d+)/i
  ]);
  const maxOnlineIps = maxOnlineIpsRaw ? Number(maxOnlineIpsRaw) : "";

  const maxConcurrentRaw = matchFirst(t, [
    /最大并发连接数[:：]\s*(\d+)/i,
    /最大并发[:：]\s*(\d+)/i
  ]);

  const upgradeRange = matchFirst(t, [
    /升级许可时间[:：]\s*([0-9:\-\s]+)\s*->\s*([0-9:\-\s]+)/,
  ]);

  const startAt = matchFirst(t, [
    /使用许可时间[:：]\s*([0-9:\-\s]+)\s*->\s*([0-9:\-\s]+)/,
    /许可时间[:：]\s*([0-9:\-\s]+)\s*->\s*([0-9:\-\s]+)/
  ]);
  // 上面 matchFirst 只能取一个 group，因此改用更稳解析
  let start = "";
  let end = "";
  const m1 = t.match(/使用许可时间[:：]\s*([0-9:\-\s]+)\s*->\s*([0-9:\-\s]+)/);
  const m2 = t.match(/许可时间[:：]\s*([0-9:\-\s]+)\s*->\s*([0-9:\-\s]+)/);
  const m = m1 || m2;
  if (m) {
    start = String(m[1]).trim();
    end = String(m[2]).trim();
  }

  // 分类从文本里识别
  let category = fallbackCategory || "电竞网吧";
  if (/电竞酒店|酒店/.test(t)) category = "电竞酒店";
  if (/电竞网吧|网吧/.test(t)) category = "电竞网吧";

  const extra = [];
  const currentTime = matchFirst(t, [/当前系统时间[:：]\s*([0-9:\-\s]+)/]);
  if (currentTime) extra.push(`采集时间：${currentTime}`);
  if (maxConcurrentRaw) extra.push(`最大并发连接数：${maxConcurrentRaw}`);

  // 升级许可时间提取
  const um = t.match(/升级许可时间[:：]\s*([0-9:\-\s]+)\s*->\s*([0-9:\-\s]+)/);
  if (um) extra.push(`升级许可：${String(um[1]).trim()}->${String(um[2]).trim()}`);

  // 剩余天数（可选记录）
  const leftDays = matchFirst(t, [/剩余\s*(\d+)\s*天/]);
  if (leftDays) extra.push(`原文剩余：${leftDays}天`);

  return {
    category,
    shopName: "",
    authCode,
    startAt: start,
    endAt: end,
    maxOnlineIps,
    sysCode,
    remark: extra.join("；")
  };
}

function formatPreview(items) {
  if (!items.length) return "未识别到数据（请确认包含：授权编号 / 使用许可时间 / 系统编号 等字段）";
  return items
    .map((it, idx) => {
      const ok = it.authCode ? "✅" : "❌";
      return (
        `【${idx + 1}】${ok}\n` +
        `分类: ${it.category || ""}\n` +
        `门店: ${it.shopName || ""}\n` +
        `授权编号: ${it.authCode || ""}\n` +
        `许可: ${it.startAt || ""} -> ${it.endAt || ""}\n` +
        `最大在线IP: ${it.maxOnlineIps || ""}\n` +
        `系统编号: ${it.sysCode || ""}\n` +
        `备注: ${it.remark || ""}`
      );
    })
    .join("\n\n");
}

function openPasteModal() {
  const modal = $("pasteModal");
  modal.classList.add("open");
  $("p_text").focus();
  parseAndPreview();
}

function closePasteModal() {
  $("pasteModal").classList.remove("open");
}

function parseAndPreview() {
  const blocks = splitBlocks($("p_text").value);
  const fallbackCategory = $("p_category").value;
  const items = blocks.map((b) => parseLicenseBlock(b, fallbackCategory));
  $("p_preview").textContent = formatPreview(items);
  return items;
}

async function submitPaste() {
  const items = parseAndPreview().filter((it) => it.authCode);
  if (!items.length) return alert("没有识别到有效授权编号，无法导入");

  for (const it of items) {
    await api("/api/panabit/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(it)
    });
  }
  closePasteModal();
  alert(`已添加/更新 ${items.length} 条`);
  await load();
}

$("refresh").addEventListener("click", () => load().catch((e) => alert(e.message)));
$("category").addEventListener("change", () => load().catch((e) => alert(e.message)));
$("q").addEventListener("keydown", (e) => {
  if (e.key === "Enter") load().catch((err) => alert(err.message));
});
$("add").addEventListener("click", () => openModal("新增", null));
$("cancel").addEventListener("click", closeModal);
$("modal").addEventListener("click", (e) => {
  if (e.target === $("modal")) closeModal();
});
$("save").addEventListener("click", () => save().catch((e) => alert(e.message)));
$("import").addEventListener("click", () => doImport().catch((e) => alert(e.message)));

// 粘贴识别导入
$("pasteImport").addEventListener("click", openPasteModal);
$("p_cancel").addEventListener("click", closePasteModal);
$("pasteModal").addEventListener("click", (e) => {
  if (e.target === $("pasteModal")) closePasteModal();
});
$("p_parse").addEventListener("click", () => parseAndPreview());
$("p_category").addEventListener("change", () => parseAndPreview());
$("p_text").addEventListener("input", () => {
  // 防抖：简单延迟
  clearTimeout(window.__panabitPasteT);
  window.__panabitPasteT = setTimeout(parseAndPreview, 200);
});
$("p_submit").addEventListener("click", () => submitPaste().catch((e) => alert(e.message)));

$("detailClose").addEventListener("click", closeDetail);
$("detailCopy").addEventListener("click", () => copyDetail().catch((e) => alert(e.message)));
$("detailModal").addEventListener("click", (e) => {
  if (e.target === $("detailModal")) closeDetail();
});

// 粘贴更新按钮 — 显示/隐藏粘贴区域
$("pasteUpdateBtn").addEventListener("click", () => {
  const area = $("pasteUpdateArea");
  area.style.display = area.style.display === "none" ? "block" : "none";
  if (area.style.display !== "none") $("f_pasteText").focus();
});

// 确认粘贴更新 — 解析文本并回填表单
$("doPasteUpdate").addEventListener("click", () => {
  const text = $("f_pasteText").value.trim();
  if (!text) return alert("请先粘贴授权信息原文");
  const parsed = parseLicenseBlock(text, $("f_category").value);
  if (!parsed.authCode) return alert("无法识别授权编号，请确认原文格式正确");

  // 回填各字段
  $("f_authCode").value = parsed.authCode || "";
  $("f_category").value = parsed.category || "电竞网吧";
  $("f_maxOnlineIps").value = parsed.maxOnlineIps || "";
  $("f_sysCode").value = parsed.sysCode || "";
  $("f_remark").value = parsed.remark || "";

  // 转换日期格式："2026-04-17 00:00:00" → "2026-04-17T00:00"
  if (parsed.startAt) {
    const s = parsed.startAt.replace(/(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}:\d{2}):?\d{0,2}/, "$1-$2-$3T$4");
    $("f_startAt").value = s;
  }
  if (parsed.endAt) {
    const e = parsed.endAt.replace(/(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}:\d{2}):?\d{0,2}/, "$1-$2-$3T$4");
    $("f_endAt").value = e;
  }

  $("pasteUpdateArea").style.display = "none";
  alert("已解析完成，确认后点击「保存」生效");
});

load().catch((e) => alert(e.message));


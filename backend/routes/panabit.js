const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function normalizeCategory(v) {
  if (!v) return "";
  const s = String(v).trim();
  if (s === "电竞网吧" || s === "网吧") return "电竞网吧";
  if (s === "电竞酒店" || s === "酒店") return "电竞酒店";
  return s;
}

function pickEndAt(row) {
  return (
    row.endAt ||
    row.expireDate ||
    row.结束时间 ||
    row.到期时间 ||
    row["使用许可结束时间"] ||
    row["许可结束时间"] ||
    ""
  );
}

function pickStartAt(row) {
  return (
    row.startAt ||
    row.开始时间 ||
    row["使用许可开始时间"] ||
    row["许可开始时间"] ||
    ""
  );
}

function asNum(v) {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

module.exports = function createPanabitRoutes(getDb) {
  // GET /api/panabit/list?category=&q=
  router.get("/list", async (req, res) => {
    try {
      const db = getDb();
      const { category, q } = req.query;
      const where = [];
      const params = {};
      if (category) {
        where.push("category = :category");
        params[":category"] = String(category);
      }
      if (q) {
        where.push(
          "(shopName LIKE :q OR authCode LIKE :q OR sysCode LIKE :q OR remark LIKE :q)"
        );
        params[":q"] = `%${String(q)}%`;
      }

      const rows = await db.all(
        `
        SELECT
          id, shopName, category, authCode,
          COALESCE(NULLIF(endAt,''), NULLIF(expireDate,''), '') AS endAt,
          COALESCE(NULLIF(startAt,''), '') AS startAt,
          maxOnlineIps, sysCode, remark,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM panabit
        ${where.length ? "WHERE " + where.join(" AND ") : ""}
        ORDER BY
          CASE WHEN COALESCE(NULLIF(endAt,''), NULLIF(expireDate,''), '') = '' THEN 1 ELSE 0 END,
          COALESCE(NULLIF(endAt,''), NULLIF(expireDate,''), '') ASC,
          id DESC
        `,
        params
      );
      res.json({ ok: true, data: rows });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });

  // POST /api/panabit/add or update
  async function upsert(req, res) {
    try {
      const db = getDb();
      const body = req.body || {};
      const authCode = String(body.authCode || "").trim();
      if (!authCode) return res.status(400).json({ ok: false, error: "authCode 必填" });

      const item = {
        shopName: String(body.shopName || "").trim(),
        category: normalizeCategory(body.category),
        authCode,
        startAt: String(body.startAt || "").trim(),
        endAt: String(body.endAt || body.expireDate || "").trim(),
        maxOnlineIps: asNum(body.maxOnlineIps),
        sysCode: String(body.sysCode || "").trim(),
        remark: String(body.remark || "").trim()
      };

      await db.run(
        `
        INSERT INTO panabit (shopName, category, authCode, startAt, endAt, maxOnlineIps, sysCode, remark, updated_at)
        VALUES (:shopName, :category, :authCode, :startAt, :endAt, :maxOnlineIps, :sysCode, :remark, CURRENT_TIMESTAMP)
        ON CONFLICT(authCode) DO UPDATE SET
          shopName=excluded.shopName,
          category=excluded.category,
          startAt=excluded.startAt,
          endAt=excluded.endAt,
          maxOnlineIps=excluded.maxOnlineIps,
          sysCode=excluded.sysCode,
          remark=excluded.remark,
          updated_at=CURRENT_TIMESTAMP
        `,
        {
          ":shopName": item.shopName,
          ":category": item.category,
          ":authCode": item.authCode,
          ":startAt": item.startAt,
          ":endAt": item.endAt,
          ":maxOnlineIps": item.maxOnlineIps,
          ":sysCode": item.sysCode,
          ":remark": item.remark
        }
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  }

  router.post("/add", upsert);
  router.post("/update", upsert);

  // POST /api/panabit/delete {id} or {authCode}
  router.post("/delete", async (req, res) => {
    try {
      const db = getDb();
      const { id, authCode } = req.body || {};
      if (!id && !authCode) {
        return res.status(400).json({ ok: false, error: "id 或 authCode 必填" });
      }
      if (id) await db.run("DELETE FROM panabit WHERE id = ?", [Number(id)]);
      else await db.run("DELETE FROM panabit WHERE authCode = ?", [String(authCode)]);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });

  // POST /api/panabit/import (xlsx) multipart/form-data file
  router.post("/import", upload.single("file"), async (req, res) => {
    try {
      const db = getDb();
      if (!req.file) return res.status(400).json({ ok: false, error: "缺少文件" });

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      let imported = 0;
      await db.run("BEGIN");
      try {
        for (const r of json) {
          const authCode = String(
            r.authCode || r.授权编号 || r["授权编号："] || ""
          ).trim();
          if (!authCode) continue;
          await db.run(
            `
            INSERT INTO panabit (shopName, category, authCode, startAt, endAt, maxOnlineIps, sysCode, remark, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(authCode) DO UPDATE SET
              shopName=excluded.shopName,
              category=excluded.category,
              startAt=excluded.startAt,
              endAt=excluded.endAt,
              maxOnlineIps=excluded.maxOnlineIps,
              sysCode=excluded.sysCode,
              remark=excluded.remark,
              updated_at=CURRENT_TIMESTAMP
            `,
            [
              String(r.shopName || r.门店名称 || r.客户名称 || "").trim(),
              normalizeCategory(r.category || r.分类 || ""),
              authCode,
              String(pickStartAt(r)).trim(),
              String(pickEndAt(r)).trim(),
              asNum(r.maxOnlineIps || r["最大在线IP数"] || r.最大在线IP数 || r.最大在线ip数 || ""),
              String(r.sysCode || r.系统编号 || "").trim(),
              String(r.remark || r.备注 || "").trim()
            ]
          );
          imported += 1;
        }
        await db.run("COMMIT");
      } catch (e) {
        await db.run("ROLLBACK");
        throw e;
      }

      res.json({ ok: true, imported });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });

  return router;
};


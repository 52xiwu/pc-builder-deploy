# 部署规则 (.cursor/rules/deploy.md)

## 适用场景
每次向 `ubuntu@101.42.41.210` 推送代码或修改配置前，先阅读本文件。

---

## 铁律

### 1. 部署只走一台机器
- 目标服务器：**仅限 `ubuntu@101.42.41.210`**
- 路径：`/tmp/pc-builder/`（线上）
- 本地改完后用 `scp -r` / `rsync` / `git push` 推到线上，再执行重启
- **禁止**在多台机器上同时修改同一份配置或文件

### 2. Node 版本锁定 v22
- 生产环境跑 **Node 22**，禁止在没有验证的情况下升级到 Node 23+
- `sqlite3` native binding 在 Node 24 上需要 `npm rebuild sqlite3`，耗时 2-3 分钟且容易超时
- 若需要升级：先在本地验证 `npm rebuild sqlite3` 成功，再告知用户
- 查看版本：`node --version`

### 3. SSL 证书必须包含完整 SAN
- 必须覆盖 `www.aixiwu.cn` + `aixiwu.cn`（裸域）两个域名
- **Certbot 申请命令**：`certbot --nginx -d www.aixiwu.cn -d aixiwu.cn`
- 验证证书 SAN：`openssl x509 -in /etc/letsencrypt/live/www.aixiwu.cn/fullchain.pem -text | grep -A1 "Subject Alternative Name"`
- 单域名证书会导致裸域报 `ERR_CERT_COMMON_NAME_INVALID`

### 4. Nginx 变更后必做两步
```bash
nginx -t           # 确认语法
systemctl reload nginx  # 重载配置
```

---

## 标准发版流程

1. 本地修改 → `scp -r /tmp/pc-builder/* ubuntu@101.42.41.210:/tmp/pc-builder/`
2. SSH 登录确认：`ssh -i ~/.ssh/id_ed25519 ubuntu@101.42.41.210`
3. 杀进程：`fuser -k 3000/tcp`
4. 重启：`cd /tmp/pc-builder && PORT=3000 /usr/bin/node server.js &`
5. 自检（见下方）
6. 打 tag（打在代码 commit，非 docs commit）

---

## 自检命令（发版后必执行）

```bash
# HTTP 状态
curl -s -o /dev/null -w "aixiwu.cn: %{http_code}\n" https://aixiwu.cn/
curl -s -o /dev/null -w "www.aixiwu.cn: %{http_code}\n" https://www.aixiwu.cn/

# API 验证
curl -s https://www.aixiwu.cn/api/hardware/cpu | python3 -c "import sys,json; d=json.load(sys.stdin); print('cpu products:', len(d.get('products',[])))"
```

---

## 常见故障

| 错误 | 原因 | 修复 |
|------|------|------|
| `ERR_CERT_COMMON_NAME_INVALID` | 证书缺裸域 SAN | `certbot --nginx -d www.aixiwu.cn -d aixiwu.cn` |
| 403 Forbidden | 文件缺失或 nginx root 错误 | 检查 `/tmp/pc-builder/` 是否存在 |
| Node 进程消失 | 端口被占或崩溃 | `fuser -k <端口>/tcp` 后重启 |
| API 500 | sqlite3 native binding 失效 | `ldd node_modules/sqlite3/build/Release/node_sqlite3.node` |

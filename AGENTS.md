# Aixiwu.cn 部署环境规则

## 服务器

- **线上服务器**: `ubuntu@101.42.41.210`
- **SSH 密钥**: `~/.ssh/id_ed25519`（已配置无密码登录）
- **代码目录**: `/tmp/pc-builder/`（线上），本地同路径

## 🚨 部署规则（必须遵守）

> 以下规则每次部署时强制检查，无需口述提醒。

### 1. 部署只走一台机器
- 所有线上改动必须在 `ubuntu@101.42.41.210` 上执行
- 本地改完后用 `scp` / `rsync` / `git push` 推到线上，再在线上执行重启
- 永远不要在多台机器上同时改同一份配置

### 2. Node.js 版本锁定 v22（当前生产环境）
- 生产环境**只跑 Node 22**（`sqlite3` native binding 在 v24 上需要完整 rebuild，耗时长且容易超时）
- Node 24 仅限**本地开发测试**使用
- 升级 Node 版本前必须：先在本地跑通 `npm rebuild sqlite3`，确认模块加载正常，再告知用户升级
- 查看版本：`node --version`

### 3. SSL 证书必须包含完整 SAN（Subject Alternative Name）
- 证书**必须**覆盖 `www.aixiwu.cn` 和 `aixiwu.cn`（裸域）两个域名
- **不要**只申请单域名证书，否则裸域 HTTPS 会报 `ERR_CERT_COMMON_NAME_INVALID`
- Certbot 申请命令：`certbot --nginx -d www.aixiwu.cn -d aixiwu.cn`
- 手动确认：`openssl x509 -in /path/to/cert.pem -text | grep -A1 "Subject Alternative Name"`

### 4. Nginx 配置变更后必须验证
- 每次 `nginx -t` 确认语法，再 `systemctl reload nginx`
- 验证命令（见下方自检）

---

## Node.js 升级流程（线上）

> 仅当用户明确要求升级 Node 版本时执行。

```bash
# 1. SSH 登录
ssh -i ~/.ssh/id_ed25519 ubuntu@101.42.41.210

# 2. 下载 Node（当前生产用 v22，不要升到 v24 除非 sqlite3 rebuild 通过）
curl -sL https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.gz -o /tmp/node.tar.gz
tar -xzf /tmp/node.tar.gz -C /tmp/
mkdir -p ~/bin
cp /tmp/node-v22.12.0-linux-x64/bin/node ~/bin/node
cp /tmp/node-v22.12.0-linux-x64/bin/npm ~/bin/npm
cp /tmp/node-v22.12.0-linux-x64/bin/npx ~/bin/npx

# 3. 确认生效
export PATH="$HOME/bin:$PATH"
node --version  # v22.x.x

# 4. 重启 Node 进程
fuser -k <端口>/tcp   # e.g. 3000
cd /tmp/pc-builder && PORT=<端口> ~/bin/node server.js &
curl -s -o /dev/null -w "%{http_code}" http://localhost:<端口>/
```

---

## 本地开发

- **代码目录**: `/tmp/pc-builder/`
- **重启（本地）**: `fuser -k 3000/tcp && cd /tmp/pc-builder && PORT=3000 node server.js &`
- **Node 服务端口**: `3000`（API），`6060`（Hermes Web UI）

---

## 发版 Tag 流程

- 本地 tag: `git tag -a v1.1.0 -m "说明"`
- 接远端后推送 tag: `git remote add origin <URL>` → `git push origin v1.1.0`
- `git fetch` 默认不拉 tag，需 `git fetch origin --tags`
- **健康检查**: `git rev-parse --short <tag>`（打在代码 commit，非 docs commit）

---

## HTTPS 自检命令（每次部署后执行）

```bash
# 同时检查双域名
curl -s -o /dev/null -w "aixiwu.cn: %{http_code}\n" https://aixiwu.cn/
curl -s -o /dev/null -w "www.aixiwu.cn: %{http_code}\n" https://www.aixiwu.cn/

# API 验证
curl -s https://www.aixiwu.cn/api/hardware/cpu | python3 -c "import sys,json; d=json.load(sys.stdin); print('cpu products:', len(d.get('products',[])))"
```

---

## 常见故障处理

| 现象 | 检查点 |
|------|--------|
| `ERR_CERT_COMMON_NAME_INVALID` | 证书是否只有 www，缺裸域 |
| 403 Forbidden | 检查 `/tmp/pc-builder/` 文件是否存在，nginx root 路径 |
| Node 进程消失 | `fuser -k <端口>/tcp` 后重启 |
| API 500 | 检查 `sqlite3` native binding，`ldd node_modules/sqlite3/build/Release/node_sqlite3.node` |

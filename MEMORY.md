**aixiwu.cn 发版前习惯**：全仓搜索 `#cartBtn` / `cartBtn` / `getElementById('cartBtn')`，确保同一按钮只有一处绑定（toggleCart 重绑会互相抵消）
§
**aixiwu.cn 发版闭环**：git tag（打在代码 commit，非 docs commit）→ 全仓搜 `#cartBtn`/`cartBtn`/`getElementById('cartBtn')` → curl 校验 → 写 HANDOFF。健康检查用 `git rev-parse --short <tag>` 而非 `git rev-parse HEAD`（后者可能是 docs commit）
§
**后台装机指南表**：链接=详情跳转（相对/绝对均可）；图片=封面图URL；正文改.html文件，不在表内；改后必点「保存修改」。
§
**流控到期提醒**：DB=/tmp/pc-builder/database.db（panabit表）；server.js 内 schedulePanabitCheck() 每天9点 + cron job `b45a3dca96fd` 双保险；REMIND_DAYS=[3,5,10]提前N天通知（每条只触发一次）；WEBHOOK硬编码fallback在server.js（不依赖PM2）；接口 localhost 白名单免认证（2026-05-14修复）；当前23条，距到期≤10天仅玖柒电竞(8天后，已notified10days=1)。
§
** Aixiwu.cn 网站**：与 Hermes Agent 宿主机同服务器；代码在 /tmp/pc-builder/；备份在 /home/ubuntu/（命名规则：aixiwu-backup-YYYYMMDD-HHMMSS.tar.gz）；每天凌晨2点定时备份（计划任务）
§
**Hermes 仓库地址**：Web UI → EKKOLearnAI/hermes-web-ui；Agent/CLI → NousResearch/hermes-agent（两者不同仓库）
§
**PC Builder**：101.42.41.210:/tmp/pc-builder/，PM2 name=pc-builder；发版 `pm2 restart pc-builder`；.env 含 key 禁止提交 Git
§
**记忆 Git 同步约定**：
- 仓库：52xiwu/pc-builder-deploy（站点代码+记忆混用）
- 分支：master（与 main 约定不同机器混用需注意）
- 远程：~/.hermes/memories/ 的 git remote 指向该库即可延续
- 敏感检查：推送前偶尔 git status/diff，避免 Token/口令/隐私写入 MEMORY.md
- 未来可拆：若仓库变乱，可建 hermes-memories 私有库，git remote set-url 改掉即可
- 定时任务 ID：记忆同步=07544d412f03，备份=f6f57a26ef38，流控=b45a3dca96fd
§
飞书：连接模式 websocket；用户 open_id=ou_4b6425330d6ba82fd770c59e8acd714e；连接状态 connected
§
后台入口已改为 /gluidcadmin（隐藏路由）；server.js 已配置，admin.html 保留不断链
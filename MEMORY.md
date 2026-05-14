**aixiwu.cn 发版前习惯**：全仓搜索 `#cartBtn` / `cartBtn` / `getElementById('cartBtn')`，确保同一按钮只有一处绑定（toggleCart 重绑会互相抵消）
§
**aixiwu.cn 发版闭环**：git tag（打在代码 commit，非 docs commit）→ 全仓搜 `#cartBtn`/`cartBtn`/`getElementById('cartBtn')` → curl 校验 → 写 HANDOFF。健康检查用 `git rev-parse --short <tag>` 而非 `git rev-parse HEAD`（后者可能是 docs commit）
§
**后台装机指南表**：链接=详情跳转（相对/绝对均可）；图片=封面图URL；正文改.html文件，不在表内；改后必点「保存修改」。
§
**「我的AI」聊天机器人**：2026-05-14 上线；大模型从 MiniMax 切换到 DeepSeek（key 额度耗尽）；页面 /myai.html；接口 POST /api/chat（server.js）；API Key 在 .env 的 MINIMAX_API_KEY（实际存 DeepSeek key）；聊天记录不持久化
§
**Aixiwu.cn 网站**：
- 代码在 /tmp/pc-builder/
- 备份在 /home/ubuntu/（命名规则：aixiwu-backup-YYYYMMDD-HHMMSS.tar.gz）
- 每天凌晨2点定时备份（计划任务）
- 发版闭环：git tag → 全仓搜 cartBtn → curl 校验 → 写 HANDOFF
- 健康检查：curl www.aixiwu.cn/myai → HTTP 200
- 版本号当前 v1.21.0（2026-05-15）
§
**Hermes 仓库地址**：Web UI → EKKOLearnAI/hermes-web-ui；Agent/CLI → NousResearch/hermes-agent（两者不同仓库）
§
**版本号**：当前 v1.20.2（2026-05-15）；发版前自动 `git tag -a v1.x.x -m "..."` 递增；git push + pm2 restart pc-builder
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
§
**定时检测任务**：每天凌晨1点检测「信装机顾问+语音」和网站状态，cron_id=b45a3dca96fd（已建）

检测清单：
1. curl www.aixiwu.cn → HTTP 200
2. curl www.aixiwu.cn/myai → HTTP 200
3. myai HTML 含 btn-mic（语音按钮存在）
4. POST /api/chat 返回非5xx（API存活）

检测结果推送至当前飞书会话（origin）
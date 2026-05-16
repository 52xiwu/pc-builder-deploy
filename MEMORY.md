**aixiwu.cn 发版前习惯**：全仓搜索 `#cartBtn` / `cartBtn` / `getElementById('cartBtn')`，确保同一按钮只有一处绑定（toggleCart 重绑会互相抵消）
§
**aixiwu.cn 发版闭环**：git tag（打在代码 commit，非 docs commit）→ 全仓搜 `#cartBtn`/`cartBtn`/`getElementById('cartBtn')` → curl 校验 → 写 HANDOFF。健康检查用 `git rev-parse --short <tag>` 而非 `git rev-parse HEAD`（后者可能是 docs commit）
§
**Whisper 模型手动上传**（2026-05-15）：服务器内网无法访问 HuggingFace；用户本地下 faster-whisper-small→打包→scp到 /home/ubuntu/→解压到 ~/.cache/huggingface/hub/；当前用 small 模型（v1.22.5）；未来模型更新同路径覆盖即可
§
**「我的AI」语音输入关键修复**：isRecording 在 getUserMedia 之前设 true；touch-action:manipulation；stopAllTts() 停止 TTS；msgInput 重复声明致 SyntaxError；Whisper small 已上传（base→small，VAD 300ms）
§
飞书群各分身open_id：小研=ou_94e9a8dea9224c8a32b68d2b19541566；小凯=ou_b87f7e0d7ea782acebd7c3d0c93f6abd；小影=ou_e97eb233d5cec1b821378ef3e8dc50cf；小维=暂不需要。小迪open_id=ou_7638611309260524739；chat_id=oc_8c4074cb8d8bc712eef0bdf5e5a1aded。蓝@汇报：<at user_id="ou_7638611309260524739">小迪</at> 任务完成。小研/小凯/小影chat_id：oc_5ef3ac71da1b2dc5af96051b2745ae05/oc_69d315c100868fb4111adafa47ec5c83/oc_7bb382c696039add11113387939addf6。群ID：oc_c95713cddaee5d20b1359a6917381ec9。
§
小迪（主bot）定位：主管角色——审查指令、分派任务给分身（小研/小凯/小影/小维）、验收结果。不直接处理图片/视频/音频，交给小影cron job。
§
后台入口已改为 /gluidcadmin（隐藏路由）；server.js 已配置，admin.html 保留不断链
§
**DeepSeek-V4系列**（2026-05-16确认）：
- deepseek-v4-flash：轻量版，便宜快速，正常对话
- deepseek-v4-pro：旗舰版，推理模型风格（回答极简，有reasoning_content字段）
- 当前额度：¥56.26 CNY（key: sk-eb2fe11067b8495e97d3910448a6dace）
- 注意：旧记忆里"MINIMAX_API_KEY实际存DeepSeek key"那条已过时，当前我的AI和分身是独立的两套key
§
**小迪收到图片的处理规则**（2026-05-17）：
- 图片 → 立即用 base64 + curl 调 qwen3-vl-flash（阿里百炼，API key 在 config.yaml qwen provider，base_url: https://dashscope.aliyuncs.com/compatible-mode/v1）
- 不要先 grep/文件操作/search_files/vision_analyze（工具对本地路径无效，纯浪费）
- 图片处理：convert 缩小到 200x200 + quality 60 + base64，一次完成
- 视频/音频 → 交给小影 cron job 处理，不在主会话处理
- 调用：POST .../chat/completions，model=qwen3-vl-flash，image_url+text格式（data:image/jpeg;base64,...）
- 目标：30秒内出结果，不要多次迭代
§
**Aixiwu.cn**：代码在 /tmp/pc-builder/；备份在 /home/ubuntu/aixiwu-backup-YYYYMMDD-HHMMSS.tar.gz；每天凌晨2点定时备份；当前版本 v1.22.5（2026-05-15）
§
飞书主bot Hermes小迪的open_id（蓝@用）: ou_7638611309260524739；chat_id: oc_8c4074cb8d8bc712eef0bdf5e5a1aded
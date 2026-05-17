**aixiwu.cn 发版闭环**：git tag → 全仓搜 `#cartBtn` → curl 校验 → 写 HANDOFF。健康检查用 `git rev-parse --short <tag>` 而非 `git rev-parse HEAD`
§
**Whisper 模型**（2026-05-15）：faster-whisper-small 已上传到 ~/.cache/huggingface/hub/；VAD 300ms；服务器内网无法访问 HuggingFace，更新同路径覆盖
§
**「我的AI」语音输入修复**：isRecording 在 getUserMedia 之前设 true；touch-action:manipulation；stopAllTts() 停止 TTS；msgInput 重复声明致 SyntaxError
§
**小迪收到图片**：convert 缩小 200x200 + quality 60 + base64 → 调 qwen3-vl-flash（data:image/jpeg;base64,...）；视频/音频 → 交给小影 cron job；目标30秒
§
**Aixiwu.cn**：代码 /tmp/pc-builder/；备份 /home/ubuntu/aixiwu-backup-YYYYMMDD-HHMMSS.tar.gz（每天凌晨2点）；当前版本 v1.22.5
§
**飞书蓝标@规则**（2026-05-18）：
- 回复@Hermes小迪：user_id=ou_b5b4ace3f40844a0a9c4dbc7cee0c5ec
- 回复@Hermes小研：7640536634244484299
- 回复@Hermes小凯：7640536865770048716
- 回复@Hermes小影：7640537027481439447
- 格式：正文+<at user_id="...">@对方</at>，每条必带
- 群ID：oc_c95713cddaee5d20b1359a6917381ec9（AIxiwu.com）
§
**DeepSeek-V4系列**：v4-flash（轻量快速）、v4-pro（推理模型风格，回答极简）；额度 ¥56.26；两套独立 key（我的AI vs 分身）
§
**后台入口**：/gluidcadmin（隐藏路由）；server.js 已配置，admin.html 保留不断链
§
**飞书指挥链（终版2026-05-18）**：分身→汇报@Hermes小迪（居中协调）→小迪汇总→汇报@飞书用户7883HM（Boss）；小迪居中汇总，不让Boss被刷屏；Boss open_id=ou_4b6425330d6ba82fd770c59e8acd714e
§
蓝标@格式补充（2026-05-18确认）：小迪用ou_b5b4ace3（主bot为open_id），小研/小凯/小影用纯数字bot_id（7640536634244484299等）。飞书蓝标@的user_id字段接受两种格式均可变蓝——ou_前缀open_id和纯数字bot_id均有效。
§
飞书蓝标格式（终版2026-05-17）：
- 回复@Hermes小迪：<at user_id="ou_b5b4ace3f40844a0a9c4dbc7cee0c5ec">@Hermes小迪</at>
- 回复@Hermes小研：<at user_id="ou_a714fe17">@Hermes小研</at>
- 回复@Hermes小凯：<at user_id="ou_f936744e">@Hermes小凯</at>
- 回复@Hermes小影：<at user_id="ou_e97eb233">@Hermes小影</at>
格式：正文 + 单层蓝标（不嵌套），汇报顺序：先@执行人，末尾@小迪

汇报链：分身→蓝标@小迪→小迪汇总→Boss @52xiwu（小迪居中，不让Boss被刷屏）
蓝标用ou格式，不是bot_id；单层不嵌套
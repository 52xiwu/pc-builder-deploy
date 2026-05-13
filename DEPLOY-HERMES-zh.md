# 部署说明（Hermes 覆盖后必读）

## 1. 环境变量

将 `.env.example` 复制为 `.env`，至少设置：

- `JWT_SECRET`：强随机字符串。
- `ADMIN_PANEL_PASSWORD`：管理后台 `admin.html` 登录密码；`ADMIN_PANEL_USER` 可选，默认 `admin`。
- 可选 `ADMIN_API_KEY`：用于带请求头 `X-Admin-Key` 的自动化；与面板 JWT 二选一即可调管理类 API。

可选：`ALLOWED_ORIGINS` 为生产站点域名列表（逗号分隔），以收紧 CORS。

## 2. 首次使用

1. 安装依赖：`npm install`（建议生成 `package-lock.json` 便于审计）。
2. 启动：`node server.js`。
3. 打开 `admin.html`，使用 `.env` 中的管理员账号登录；再维护硬件、四宫格、流控等（均需已登录或 `X-Admin-Key`）。
4. 在管理后台「我的AI设置」中填写跳转 URL（敏感字段写入 `data/myai-settings.json`，公开接口仅返回 `redirect_url`）。
5. 前台用户通过顶部「登录」走 `/api/auth/register` 与 `/api/auth/login`，订单与「我的订单」依赖 JWT。

## 3. 行为变更摘要

- 所有 `/api/admin/*`、Panabit、`POST /api/home-slots`、`POST /api/home-slots/upload`、`PUT /api/home-slots/:slot`、`POST /api/myai/config` 需管理员认证。
- `GET /api/orders/mine` 已关闭（410）；订单列表使用 `GET /api/orders/me` + JWT。
- 取消/修改订单状态需订单所属邮箱与 JWT 一致，或提供 `ADMIN_API_KEY`。

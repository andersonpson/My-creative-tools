# My-creative-tools

一个原料技法映射工具。前端为静态页面，Node/Express 后端只负责托管静态文件与代理 `/api/prefill` AI 请求。

## 本地运行

```bash
npm install
cp .env.example .env
npm start
```

打开 `http://localhost:3000`。

## 环境变量

复制 `.env.example` 为 `.env`，填入真实值：

```bash
PORT=3000
APP_ORIGIN=https://your-domain.example
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_API_KEY=replace-with-server-side-key
OPENAI_MODEL=deepseek-reasoner
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=20
```

说明：

- `OPENAI_API_KEY` 只放服务器 `.env`，不要写进前端文件。
- `APP_ORIGIN` 填你的正式域名，例如 `https://tools.example.com`。
- `RATE_LIMIT_MAX` 是每个 IP 在 `RATE_LIMIT_WINDOW_MS` 内允许调用 AI 的次数。

## 腾讯云 Linux 部署建议

适用：腾讯云轻量服务器，新加坡，2 核 2G，Ubuntu/Debian/CentOS 类 Linux。

1. 安装 Node.js 20 LTS 或更新版本。

```bash
node -v
npm -v
```

2. 上传项目到服务器，例如 `/opt/my-creative-tools`。

```bash
cd /opt/my-creative-tools
npm ci --omit=dev
cp .env.example .env
nano .env
```

3. 用 PM2 常驻运行。

```bash
npm install -g pm2
pm2 start server.js --name my-creative-tools
pm2 save
pm2 startup
```

4. 用 Nginx 反向代理到本机 `3000`。

```nginx
server {
    listen 80;
    server_name your-domain.example;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

5. 配置 HTTPS。

```bash
certbot --nginx -d your-domain.example
```

6. 腾讯云安全组只开放：

- `22`：SSH，最好限制为你的固定 IP。
- `80`：HTTP。
- `443`：HTTPS。

不要开放 `3000` 到公网。Node 服务只给 Nginx 本机访问。

## 上线前检查

```bash
curl http://127.0.0.1:3000/api/health
pm2 logs my-creative-tools
```

`/api/health` 里 `ok` 应为 `true`。若为 `false`，检查 `.env` 是否缺少 `OPENAI_API_KEY` 或 `OPENAI_BASE_URL`。

## 安全注意

- 当前 `/api/prefill` 会消耗 AI 额度，已加入基础 IP 限流；公开访问量变大时，应再加登录或访问密码。
- `.env` 不应提交到 Git。
- 若域名尚未准备好，可先用服务器 IP 测试，但正式使用应配置 HTTPS 域名。

## 自动部署

如果你想把当前的手动上传流程改成 GitHub push 自动部署，请看：

- `AUTO_DEPLOY_WEBHOOK.md`

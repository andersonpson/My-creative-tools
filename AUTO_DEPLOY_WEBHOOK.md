# My-creative-tools GitHub Auto Deploy

This guide converts your current manual deployment into GitHub push auto deploy.

Your target structure is:

- Local source: `/Users/puppyhome/Documents/GitHub/My-creative-tools`
- GitHub repo: `https://github.com/andersonpson/My-creative-tools`
- Server app path: `/opt/my-creative-tools`
- Public URL: `http://43.134.115.245`
- Runtime: `Nginx -> 127.0.0.1:3000 -> PM2`

After setup, your update flow becomes:

```bash
git add .
git commit -m "Update frontend"
git push
```

Then GitHub will notify the server, the server will pull the newest code, install dependencies if `package.json` changed, and restart the Node app automatically.

## 1. Important Idea

Right now your server folder `/opt/my-creative-tools` is only a manual upload copy.

Webhook auto deploy needs that folder to be a real Git clone.

So first you must convert `/opt/my-creative-tools` into a GitHub-based working copy.

## 2. Prepare The Server

SSH into the server and stop the current app first:

```bash
pm2 stop my-creative-tools
```

Back up the current folder:

```bash
sudo cp -a /opt/my-creative-tools /opt/my-creative-tools-backup-$(date +%Y%m%d-%H%M%S)
```

Rename the current runtime folder:

```bash
sudo mv /opt/my-creative-tools /opt/my-creative-tools-manual-backup
```

Clone the GitHub repo fresh:

```bash
cd /opt
sudo git clone https://github.com/andersonpson/My-creative-tools.git
```

Give the `ubuntu` user control of the folder:

```bash
sudo chown -R ubuntu:ubuntu /opt/my-creative-tools
```

## 3. Restore The Server Secret File

If your old runtime had a working `.env`, copy it into the new Git clone:

```bash
cp /opt/my-creative-tools-manual-backup/.env /opt/my-creative-tools/.env
```

If there was no old `.env`, create one:

```bash
cd /opt/my-creative-tools
cp .env.example .env
nano .env
```

Make sure these lines exist in `.env`:

```bash
PORT=3000
APP_ORIGIN=http://43.134.115.245
OPENAI_BASE_URL=your-real-base-url
OPENAI_API_KEY=your-real-key
OPENAI_MODEL=deepseek-reasoner
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=20
DEPLOY_REPO=andersonpson/My-creative-tools
DEPLOY_BRANCH=main
DEPLOY_WEBHOOK_SECRET=replace-with-long-random-secret
DEPLOY_RESTART=1
DEPLOY_INSTALL_ON_PACKAGE_CHANGE=1
```

Replace only these values with your real values:

- `OPENAI_BASE_URL`
- `OPENAI_API_KEY`
- `DEPLOY_WEBHOOK_SECRET`
- `APP_ORIGIN`

Do not share the real key or secret with anyone.

## 4. Install Dependencies In The New Clone

Run:

```bash
cd /opt/my-creative-tools
npm ci --omit=dev
```

## 5. Restart PM2 Using The Git Clone

Delete the old PM2 process:

```bash
pm2 delete my-creative-tools
```

Start it again from the Git clone:

```bash
cd /opt/my-creative-tools
pm2 start server.js --name my-creative-tools
pm2 save
```

Check health:

```bash
curl http://127.0.0.1:3000/api/health
```

You should see:

- `"ok": true`
- `"deployWebhookConfigured": true`
- `"deployRepo": "andersonpson/My-creative-tools"`

## 6. Confirm Git Pull Works On The Server

Still on the server, run:

```bash
cd /opt/my-creative-tools
git remote -v
git branch --show-current
git pull
```

Expected result:

- remote should point to `https://github.com/andersonpson/My-creative-tools.git`
- branch should be `main`
- `git pull` should complete without username/password prompts

If GitHub asks for username/password here, fix that first before continuing.

## 7. Add The GitHub Webhook

Open:

```text
https://github.com/andersonpson/My-creative-tools
```

Then:

1. Click `Settings`
2. Click `Webhooks`
3. Click `Add webhook`

Use these values:

- Payload URL:

```text
http://43.134.115.245/api/deploy-webhook
```

- Content type:

```text
application/json
```

- Secret:

Use the exact same value as `DEPLOY_WEBHOOK_SECRET` in `/opt/my-creative-tools/.env`

- Events:

```text
Just the push event
```

- Active:

Keep enabled

## 8. Test The Webhook

Make a tiny local change on your Mac, then push:

```bash
cd /Users/puppyhome/Documents/GitHub/My-creative-tools
git add .
git commit -m "Test auto deploy"
git push
```

Then check on the server:

```bash
pm2 logs my-creative-tools --lines 100
```

And:

```bash
cd /opt/my-creative-tools
git log --oneline -n 3
```

What should happen:

- GitHub webhook delivery becomes successful
- server pulls newest code
- app exits once
- PM2 starts it again automatically

## 9. If You Change Nginx

Most frontend or backend edits do not need any Nginx change.

Only if you edit Nginx config should you run:

```bash
sudo systemctl reload nginx
```

## 10. Common Problems

### Webhook says successful, but page did not update

Check:

```bash
pm2 logs my-creative-tools --lines 100
```

And:

```bash
cd /opt/my-creative-tools
git status
git log --oneline -n 5
```

### Webhook fails with signature error

The GitHub webhook secret and `.env` `DEPLOY_WEBHOOK_SECRET` are different.

They must match exactly.

### Webhook runs, but new dependency is missing

This guide already runs:

```bash
npm ci --omit=dev
```

automatically when `package.json` or `package-lock.json` changes.

### PM2 does not restart after deploy

Check:

```bash
pm2 list
pm2 logs my-creative-tools --lines 100
```

If needed, restart once manually:

```bash
pm2 restart my-creative-tools
pm2 save
```

## 11. Your New Daily Workflow

After setup is complete, your normal update workflow is only:

1. Edit locally on your Mac
2. `git add .`
3. `git commit -m "Your update"`
4. `git push`

You no longer need `scp` or `rsync` for normal updates.

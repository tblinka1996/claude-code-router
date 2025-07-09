# Claude Code Router - Now with Cloud Deployment! ☁️

> **NEW**: Deploy claude-code-router to cloud platforms like Render, Railway, Heroku, and use it as a remote API service for Claude Code!

## 🚀 Quick Cloud Setup

Instead of running locally, you can now:

1. **Deploy to cloud** (Render, Railway, Heroku, etc.)
2. **Set environment variables** for your preferred LLM provider
3. **Use with Claude Code** via `ANTHROPIC_BASE_URL`

### Example: 1-Minute Render Deployment

```bash
# 1. Fork this repo
# 2. Create Render Web Service from your fork
# 3. Set environment variables:
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-chat

# 4. Use with Claude Code:
export ANTHROPIC_BASE_URL=https://your-app.onrender.com
export ANTHROPIC_API_KEY=any-string
claude-code
```

## 💰 Cost Benefits

- **DeepSeek**: ~$0.14 per 1M tokens vs Claude's $3.00 (21x cheaper!)
- **No subscriptions**: Pay only for what you use
- **Better context**: 128K+ context window support
- **Always available**: No local resource usage

## 📁 Files for Cloud Deployment

- `cloud-server-simple.js` - Cloud deployment entry point
- `dockerfile` - Updated for cloud deployment
- `render.yaml` - Render platform configuration
- `CLOUD_DEPLOYMENT.md` - Complete deployment guide
- `test-deployment.js` - Test your deployment
- `example-config.json` - Multi-provider configuration

## 🔧 Local Usage (Original)

```shell
npm install -g @musistudio/claude-code-router
ccr code
```

## ☁️ Cloud Usage (New!)

1. **Deploy** to your preferred platform
2. **Configure** environment variables
3. **Use** with Claude Code:

```bash
export ANTHROPIC_BASE_URL=https://your-deployed-service.com
export ANTHROPIC_API_KEY=any-value
claude-code
```

## 📖 Full Documentation

- [Cloud Deployment Guide](CLOUD_DEPLOYMENT.md) - Complete setup instructions
- [Original README](README.md) - Local installation and usage

## 🎯 Why Cloud Deployment?

- **Team sharing**: Multiple developers use the same service
- **Always on**: No need to start/stop local services
- **Resource efficient**: No local CPU/memory usage
- **Centralized config**: Manage all API keys in one place
- **Scalable**: Cloud platforms handle traffic automatically

## 🧪 Test Your Deployment

```bash
node test-deployment.js your-domain.com 443
```

---

**Ready to save money and deploy to the cloud?** Check out the [Cloud Deployment Guide](CLOUD_DEPLOYMENT.md)!
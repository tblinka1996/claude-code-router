# Claude Code Router - Cloud Deployment Guide

This guide explains how to deploy claude-code-router to cloud platforms like Render, Railway, Heroku, etc., and use it as an API forwarding service for Claude Code.

## Overview

Instead of running `ccr code` locally, you can:
1. Deploy claude-code-router to a cloud platform as a web service
2. Configure Claude Code to use your deployed service via `ANTHROPIC_BASE_URL` and `ANTHROPIC_API_KEY`

## Deployment Options

### Option 1: Deploy to Render

1. **Fork this repository** to your GitHub account

2. **Create a new Web Service** on [Render](https://render.com):
   - Connect your GitHub repository
   - Use the following settings:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `node cloud-server.js`
     - **Environment**: Node

3. **Set Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   PORT=3456
   OPENAI_API_KEY=your-actual-api-key
   OPENAI_BASE_URL=https://api.deepseek.com  # or your preferred provider
   OPENAI_MODEL=deepseek-chat  # or your preferred model
   ```

4. **Deploy** and get your service URL (e.g., `https://your-app.onrender.com`)

### Option 2: Deploy to Railway

1. **Fork this repository** to your GitHub account

2. **Create a new project** on [Railway](https://railway.app):
   - Connect your GitHub repository
   - Railway will auto-detect the Node.js project

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=your-actual-api-key
   OPENAI_BASE_URL=https://api.deepseek.com
   OPENAI_MODEL=deepseek-chat
   ```

4. **Deploy** and get your service URL

### Option 3: Deploy to Heroku

1. **Fork this repository** to your GitHub account

2. **Create a new app** on [Heroku](https://heroku.com):
   - Connect your GitHub repository
   - Add Node.js buildpack

3. **Set Environment Variables** (Config Vars):
   ```
   NODE_ENV=production
   OPENAI_API_KEY=your-actual-api-key
   OPENAI_BASE_URL=https://api.deepseek.com
   OPENAI_MODEL=deepseek-chat
   ```

4. **Deploy** and get your service URL

### Option 4: Docker Deployment

Build and run the Docker container:

```bash
# Build the image
docker build -t claude-code-router .

# Run the container
docker run -p 3456:3456 \
  -e OPENAI_API_KEY=your-actual-api-key \
  -e OPENAI_BASE_URL=https://api.deepseek.com \
  -e OPENAI_MODEL=deepseek-chat \
  claude-code-router
```

## Using Your Deployed Service

Once deployed, configure Claude Code to use your cloud service:

### Method 1: Environment Variables

```bash
export ANTHROPIC_BASE_URL=https://your-deployed-service.com
export ANTHROPIC_API_KEY=any-string  # Can be any value
claude-code
```

### Method 2: Configuration File

Create or modify `~/.claude.json`:

```json
{
  "apiKey": "any-string",
  "apiUrl": "https://your-deployed-service.com"
}
```

## Advanced Configuration

### Custom Provider Configuration

You can create a more complex configuration by setting up a config file in your deployment. Create a `config.json` file in the deployment environment:

```json
{
  "LOG": true,
  "Providers": [
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "your-deepseek-key",
      "models": ["deepseek-chat", "deepseek-reasoner"],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": {
          "use": ["tooluse"]
        }
      }
    },
    {
      "name": "openrouter",
      "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
      "api_key": "your-openrouter-key",
      "models": [
        "anthropic/claude-3.5-sonnet",
        "google/gemini-2.5-pro-preview"
      ],
      "transformer": {
        "use": ["openrouter"]
      }
    }
  ],
  "Router": {
    "default": "deepseek,deepseek-chat",
    "background": "deepseek,deepseek-chat",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "openrouter,google/gemini-2.5-pro-preview"
  }
}
```

### Environment Variables for Multiple Providers

For complex setups, you can use environment variables:

```bash
# Primary provider
OPENAI_API_KEY=your-primary-key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-chat

# Additional providers (if supported by your deployment)
SECONDARY_API_KEY=your-secondary-key
SECONDARY_BASE_URL=https://openrouter.ai/api/v1
```

## Benefits of Cloud Deployment

1. **Always Available**: Your router service runs 24/7
2. **No Local Resources**: Doesn't consume local CPU/memory
3. **Team Sharing**: Multiple team members can use the same service
4. **Centralized Configuration**: Manage API keys and routing in one place
5. **Scalability**: Cloud platforms handle scaling automatically

## Cost Considerations

- Most cloud platforms offer free tiers suitable for personal use
- You only pay for the actual LLM API calls (DeepSeek, OpenRouter, etc.)
- The router service itself uses minimal resources

## Security Notes

- Never commit API keys to your repository
- Use environment variables for sensitive configuration
- Consider using secrets management for production deployments
- Restrict access to your deployed service if needed

## Troubleshooting

### Service Won't Start
- Check environment variables are set correctly
- Verify the build completed successfully
- Check logs for specific error messages

### Claude Code Can't Connect
- Verify your service URL is accessible
- Check that the service is running on the expected port
- Ensure ANTHROPIC_BASE_URL points to your deployed service

### API Errors
- Verify your LLM provider API keys are valid
- Check that the base URLs are correct
- Monitor your API usage and quotas

## Testing Your Deployment

Use the included test script to verify your deployment:

```bash
node test-deployment.js your-domain.com 443
# or for local testing:
node test-deployment.js localhost 3456
```

## Example: Complete Render Deployment

1. **Fork this repository** to your GitHub account

2. **Create Render Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your forked repository
   - Use these settings:
     - **Name**: `claude-code-router`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `node cloud-server-simple.js`

3. **Set Environment Variables** in Render:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=sk-your-deepseek-key-here
   OPENAI_BASE_URL=https://api.deepseek.com
   OPENAI_MODEL=deepseek-chat
   ```

4. **Deploy** and get your URL: `https://claude-code-router-abc123.onrender.com`

5. **Test the deployment**:
   ```bash
   node test-deployment.js claude-code-router-abc123.onrender.com 443
   ```

6. **Use with Claude Code**:
   ```bash
   export ANTHROPIC_BASE_URL=https://claude-code-router-abc123.onrender.com
   export ANTHROPIC_API_KEY=any-string-works
   claude-code
   ```

## Example: DeepSeek Configuration

For the best cost-effective experience, use DeepSeek:

**Environment Variables:**
```
OPENAI_API_KEY=sk-your-deepseek-api-key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-chat
```

**Cost Benefits:**
- DeepSeek is significantly cheaper than Claude
- Excellent performance for coding tasks
- Large context window (128K with some providers)

## Example: Multiple Providers Setup

For advanced routing, create a custom config file in your deployment:

```json
{
  "LOG": true,
  "Providers": [
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "sk-your-deepseek-key",
      "models": ["deepseek-chat", "deepseek-reasoner"],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": {
          "use": ["tooluse"]
        }
      }
    },
    {
      "name": "openrouter",
      "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
      "api_key": "sk-your-openrouter-key",
      "models": ["anthropic/claude-3.5-sonnet", "google/gemini-2.5-pro-preview"],
      "transformer": {
        "use": ["openrouter"]
      }
    }
  ],
  "Router": {
    "default": "deepseek,deepseek-chat",
    "background": "deepseek,deepseek-chat",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "openrouter,google/gemini-2.5-pro-preview"
  }
}
```

Now you can use Claude Code with DeepSeek (or any other provider) without running anything locally!

## Success Stories

Users report significant cost savings:
- **DeepSeek**: ~$0.14 per 1M input tokens vs Claude's $3.00
- **Context handling**: Better long conversation support
- **Performance**: Comparable coding assistance quality
- **Availability**: No subscription required, pay-per-use
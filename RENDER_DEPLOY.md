# Deploy to Render

## Quick Setup

1. **Fork this repository**

2. **Create Render Web Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your forked repository
   - Use these settings:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `node cloud-server-simple.js`

3. **Set Environment Variables** (in Render dashboard):
   - Go to your service → Environment
   - Add these variables:
     ```
     OPENAI_API_KEY=your-api-key-here
     OPENAI_BASE_URL=https://api.deepseek.com
     OPENAI_MODEL=deepseek-chat
     ```

4. **Deploy** and get your URL: `https://your-app.onrender.com`

5. **Use with Claude Code**:
   ```bash
   export ANTHROPIC_BASE_URL=https://your-app.onrender.com
   export ANTHROPIC_API_KEY=any-string
   claude-code
   ```

## Provider Examples

**DeepSeek (Recommended - very cheap):**
```
OPENAI_API_KEY=sk-your-deepseek-key
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_MODEL=deepseek-chat
```

**OpenAI:**
```
OPENAI_API_KEY=sk-your-openai-key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
```

**OpenRouter:**
```
OPENAI_API_KEY=sk-your-openrouter-key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=anthropic/claude-3.5-sonnet
```

That's it! Now you can use Claude Code with any provider without running anything locally.
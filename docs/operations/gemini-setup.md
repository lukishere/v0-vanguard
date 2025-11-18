# Gemini API Setup for CopilotKit

## Quick Setup Guide

### 1. Create Environment File
Create a `.env.local` file in your project root:

```bash
# .env.local
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 2. Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 3. Add API Key to Environment
Replace `your_actual_gemini_api_key_here` in `.env.local` with your actual API key:

```bash
GEMINI_API_KEY=AIzaSyD...your_actual_key_here
```

### 4. Restart Development Server
```bash
pnpm dev
```

## Testing the Setup

### Test URLs
- **Simple Test**: `http://localhost:3000/copilot-simple`
- **Advanced Test**: `http://localhost:3000/copilot-test`

### Test Commands
1. Open the chat assistant (floating button)
2. Try these test messages:
   - "What services does VANGUARD offer?"
   - "Select AI Solutions"
   - "What service is currently selected?"
   - "Show me completed projects"

## Troubleshooting

### Common Issues

#### 1. "Gemini API key not configured"
- **Solution**: Make sure `.env.local` exists and contains `GEMINI_API_KEY=your_key`
- **Check**: Restart the dev server after adding the key

#### 2. "Failed to generate response from Gemini API"
- **Solution**: Verify your API key is correct
- **Check**: Look at browser console for detailed error messages

#### 3. API Key Invalid
- **Solution**: Generate a new API key from Google AI Studio
- **Check**: Make sure there are no extra spaces in the `.env.local` file

### Debug Mode
Add this to `.env.local` for detailed logging:
```bash
DEBUG=copilotkit:*
NODE_ENV=development
```

## API Usage & Costs

### Gemini 1.5 Flash (Default Model)
- **Free Tier**: 15 requests per minute
- **Paid Tier**: Higher rate limits available
- **Cost**: Very affordable compared to OpenAI

### Rate Limits
- Free tier: 15 RPM (requests per minute)
- If you hit rate limits, the system will show error messages

## Configuration Options

### Model Selection
You can modify the model in `app/api/copilotkit/route.ts`:

```typescript
// Change this line to use different models:
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// Available models:
// - "gemini-1.5-flash" (fastest, cheapest)
// - "gemini-1.5-pro" (more capable, slower)
// - "gemini-1.0-pro" (older version)
```

### Custom Instructions
The AI assistant is configured with VANGUARD-specific instructions. You can modify these in the `systemPrompt` section of the API route.

## Security Notes

### Environment Variables
- ✅ **DO**: Keep API keys in `.env.local` (not committed to git)
- ❌ **DON'T**: Put API keys directly in code
- ❌ **DON'T**: Commit `.env.local` to version control

### API Key Permissions
- Your Gemini API key can only be used for text generation
- It cannot access your Google account or other services
- Monitor usage in Google AI Studio dashboard

## Next Steps

Once setup is complete:
1. Test both CopilotKit implementations
2. Compare with existing GUARDBOT
3. Evaluate which approach works best for your needs
4. Consider hybrid approach using both systems

---

**Need Help?** Check the browser console for detailed error messages or refer to the main `COPILOTKIT_TESTING.md` documentation. 
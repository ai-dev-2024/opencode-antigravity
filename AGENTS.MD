# OpenCode + Antigravity Manager Native Integration

## Project Vision

Enable OpenCode to natively integrate with Antigravity Manager Tool WITHOUT intercepting/modifying requests via a plugin. When Antigravity Manager is running, OpenCode should:

1. **Keep original free models** (MiniMax, Grok, etc.) working as-is
2. **Add Antigravity Manager as a custom provider** with its own models
3. **Use combined quota** from all Antigravity accounts with auto-rotation

## How This Works

```
┌───────────────┐
│   OpenCode    │──────────────────────────────┐
│   CLI/Desktop │                              │
└───────┬───────┘                              │
        │                                      │
        ├─── Free Models ──────────────────▶ OpenCode Zen
        │    (MiniMax, Grok, etc.)             (opencode.ai/zen)
        │
        └─── Antigravity Models ───────────▶ Antigravity Manager
             (claude, gemini-3-pro, etc.)      (localhost:8888)
                                                    │
                                              ┌─────┴─────┐
                                              │ Account 1 │
                                              │ Account 2 │
                                              │ Account 3 │
                                              │ Account 4 │
                                              └───────────┘
                                              (Auto-rotation)
```

## Antigravity Manager Tool

**GitHub**: https://github.com/lbjlaq/Antigravity-Manager

### API Endpoints (default port 8888)
- OpenAI format: `/v1/chat/completions`
- Anthropic format: `/v1/messages`
- Gemini format: Native Google SDK compatible

### Available Models
- `gemini-3-pro-high` - Gemini 3 Pro with high quota
- `gemini-3-flash` - Fast Gemini responses
- `claude-opus-4-5-thinking` - Claude Opus with thinking
- `claude-sonnet-4-5-thinking` - Claude Sonnet with thinking
- `gemini-2.5-flash` - Legacy Gemini

### Key Features
- Multi-account management (4+ accounts)
- Auto-rotation on 429/401 errors
- Real-time quota monitoring dashboard
- Protocol conversion (OpenAI/Anthropic/Gemini)

## OpenCode Custom Provider Method

OpenCode supports adding ANY OpenAI-compatible provider via `opencode.json`:

```json
{
  "provider": {
    "antigravity": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Antigravity Manager",
      "options": {
        "baseURL": "http://127.0.0.1:8888/v1",
        "apiKey": "sk-antigravity"
      },
      "models": {
        "gemini-3-pro-high": { "name": "Gemini 3 Pro (Antigravity)" },
        "gemini-3-flash": { "name": "Gemini 3 Flash (Antigravity)" },
        "claude-opus-4-5-thinking": { "name": "Claude Opus 4.5 Thinking" },
        "claude-sonnet-4-5-thinking": { "name": "Claude Sonnet 4.5 Thinking" }
      }
    }
  }
}
```

## Related Projects

- **Antigravity Manager Supreme** - Enhanced fork with OpenCode integration features
- **opencode-antigravity-auth** - Plugin approach (deprecated for this vision)

## Development Notes

- User cannot compile locally (Asus Zenbook 2018) - use GitHub Actions
- All builds via GitHub Actions workflows
- Upstream sync from `anomalyco/opencode` daily

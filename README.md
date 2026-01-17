# OpenCode + Antigravity Manager Integration

[![GitHub Release](https://img.shields.io/github/v/release/ai-dev-2024/opencode-antigravity)](https://github.com/ai-dev-2024/opencode-antigravity/releases)

Use [OpenCode](https://github.com/anomalyco/opencode) with [Antigravity Manager Tool](https://github.com/lbjlaq/Antigravity-Manager) for **combined quota from multiple AI accounts**.

## How It Works

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
                                              │ 4 Accounts│
                                              │ Auto-rotation │
                                              └───────────┘
```

## Quick Setup

### 1. Start Antigravity Manager

Download from [lbjlaq/Antigravity-Manager](https://github.com/lbjlaq/Antigravity-Manager/releases) and start the service on port 8888.

### 2. Configure OpenCode

Add to `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "antigravity": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Antigravity Manager",
      "options": {
        "baseURL": "http://127.0.0.1:8888/v1",
        "apiKey": "sk-antigravity"
      },
      "models": {
        "gemini-3-pro-high": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 }
        },
        "gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 }
        },
        "claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking",
          "limit": { "context": 200000, "output": 64000 }
        },
        "claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking",
          "limit": { "context": 200000, "output": 64000 }
        }
      }
    }
  }
}
```

### 3. Connect Provider

In OpenCode:
1. Run `/connect`
2. Select "Other"
3. Enter `antigravity` as provider ID
4. Enter `sk-antigravity` as API key

### 4. Select Model

Run `/models` and select any Antigravity model!

## Features

- ✅ **Combined Quota** - Use all accounts' quota from Antigravity Manager
- ✅ **Auto-Rotation** - Automatic account switching on rate limits
- ✅ **Free Models Work** - OpenCode's native free models (MiniMax, Grok) unaffected
- ✅ **No Plugin Required** - Uses OpenCode's native custom provider feature

## Available Models

| Model | Description |
|-------|-------------|
| `gemini-3-pro-high` | Gemini 3 Pro with high quota |
| `gemini-3-flash` | Fast Gemini responses |
| `claude-opus-4-5-thinking` | Claude Opus with extended thinking |
| `claude-sonnet-4-5-thinking` | Claude Sonnet with thinking |
| `gemini-2.5-flash` | Legacy Gemini 2.5 |

## Config Templates

See the [`config-templates/`](./config-templates/) folder for ready-to-use configuration files.

## Related Projects

- [Antigravity Manager](https://github.com/lbjlaq/Antigravity-Manager) - Multi-account AI quota manager
- [Antigravity Manager Supreme](https://github.com/ai-dev-2024/Antigravity-Manager-Supreme) - Enhanced version with additional features
- [OpenCode](https://github.com/anomalyco/opencode) - Open source AI coding agent

## License

MIT

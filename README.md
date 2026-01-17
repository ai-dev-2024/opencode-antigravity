# OpenCode + Antigravity Manager Integration

This is a fork of [OpenCode](https://github.com/anomalyco/opencode) with integrated support for [Antigravity Manager Tool](https://github.com/ai-dev-2024/Antigravity-Manager-Supreme).

## What This Does

Enables OpenCode (CLI + Desktop) to use **combined quota from multiple Google Cloud Code Assist accounts** managed by Antigravity Manager Tool - the same way Claude Code CLI works.

## Features

- ✅ **Combined Quota** - Use all 4 accounts' quota from Antigravity Manager
- ✅ **All Antigravity Models** - Claude and Gemini models via Antigravity proxy
- ✅ **CLI + Desktop** - Works with both OpenCode CLI and Desktop app
- ✅ **Free Models Too** - Native OpenCode free models (MiniMax, Grok, etc.) still work

## Prerequisites

1. **Antigravity Manager Tool** must be running on `http://127.0.0.1:8888`
2. Accounts authenticated in Antigravity Manager

## How It Works

```
┌──────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  OpenCode    │────▶│ Antigravity Mgr   │────▶│ Google Cloud    │
│  CLI/Desktop │     │ Proxy :8888       │     │ Code Assist API │
└──────────────┘     └───────────────────┘     └─────────────────┘
                           │
                     Combined quota from
                     4 authenticated accounts
```

## Installation

### Build from Source

```bash
# Clone this repo
git clone https://github.com/ai-dev-2024/opencode-antigravity.git
cd opencode-antigravity

# Install dependencies
bun install

# Build CLI
cd packages/opencode
bun run build

# Build Desktop (requires Tauri)
cd packages/desktop
bun run build
```

### GitHub Releases

Download pre-built binaries from the [Releases](https://github.com/ai-dev-2024/opencode-antigravity/releases) page.

## Configuration

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "provider": {
    "antigravity-manager": {
      "npm": "@ai-sdk/antigravity-manager",
      "models": {
        "claude-opus-4-5-thinking": { "name": "Claude Opus 4.5 Thinking" },
        "claude-sonnet-4-5": { "name": "Claude Sonnet 4.5" },
        "gemini-3-flash": { "name": "Gemini 3 Flash" },
        "gemini-3-pro-high": { "name": "Gemini 3 Pro High" }
      }
    }
  }
}
```

## Code Changes

The integration adds the `antigravity-manager` provider to OpenCode:

**File:** `packages/opencode/src/provider/provider.ts`

```typescript
// BUNDLED_PROVIDERS
"@ai-sdk/antigravity-manager": createAnthropic,

// CUSTOM_LOADERS
"antigravity-manager": async () => {
  return {
    autoload: true,
    options: {
      baseURL: "http://127.0.0.1:8888",
      apiKey: "antigravity-proxy",
      headers: {
        "anthropic-beta": "claude-code-20250219,interleaved-thinking-2025-05-14",
      },
      // Custom fetch ensures messages have non-empty content
    }
  }
}
```

## Related Projects

- [Antigravity Manager Supreme](https://github.com/ai-dev-2024/Antigravity-Manager-Supreme) - Account quota manager
- [OpenCode](https://github.com/anomalyco/opencode) - Original open source AI coding agent

## License

MIT - Same as original OpenCode

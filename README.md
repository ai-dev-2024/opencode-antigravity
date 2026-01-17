# OpenCode + Antigravity Manager Integration

[![CI](https://github.com/ai-dev-2024/opencode-antigravity/actions/workflows/ci.yml/badge.svg)](https://github.com/ai-dev-2024/opencode-antigravity/actions/workflows/ci.yml)
[![Upstream Sync](https://github.com/ai-dev-2024/opencode-antigravity/actions/workflows/sync-upstream.yml/badge.svg)](https://github.com/ai-dev-2024/opencode-antigravity/actions/workflows/sync-upstream.yml)

**[📦 Download Latest Release](https://github.com/ai-dev-2024/opencode-antigravity/releases/latest)**

This is a fork of [OpenCode](https://github.com/anomalyco/opencode) with integrated support for [Antigravity Manager Tool](https://github.com/lbjlaq/Antigravity-Manager).

> **Automatic Updates**: This repo automatically syncs with upstream OpenCode releases daily and applies Antigravity integration patches.

## What This Does

Enables OpenCode (CLI + Desktop) to use **combined quota from multiple AI accounts** managed by Antigravity Manager Tool.

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

### Download Pre-Built Releases (Recommended)

Download from [**GitHub Releases**](https://github.com/ai-dev-2024/opencode-antigravity/releases):

| Platform | CLI | Desktop |
|----------|-----|---------|
| Windows x64 | `opencode-windows-x64.exe` | `OpenCode_*_x64-setup.exe` |
| Linux x64 | `opencode-linux-x64` | `OpenCode_*_amd64.AppImage` |
| macOS Intel | `opencode-macos-x64` | `OpenCode_*_x64.dmg` |
| macOS ARM | `opencode-macos-arm64` | `OpenCode_*_aarch64.dmg` |

### Automated Updates

This repo automatically:
1. **Syncs daily** with upstream OpenCode releases
2. **Applies patches** for Antigravity integration and bug fixes
3. **Builds CLI + Desktop** for Windows and Linux
4. **Publishes releases** to GitHub

### Build from Source

```bash
git clone https://github.com/ai-dev-2024/opencode-antigravity.git
cd opencode-antigravity
bun install

# CLI
cd packages/opencode && bun run build

# Desktop (requires Rust)
cd packages/desktop && bunx tauri build
```

### GitHub Releases

Download pre-built binaries from the [Releases](https://github.com/ai-dev-2024/opencode-antigravity/releases) page.

## Configuration

Copy the example configs from the `config-templates/` folder or add manually to `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": { "name": "Gemini 3 Pro (Antigravity)" },
        "antigravity-gemini-3-flash": { "name": "Gemini 3 Flash (Antigravity)" },
        "antigravity-claude-sonnet-4-5": { "name": "Claude Sonnet 4.5 (Antigravity)" },
        "antigravity-claude-opus-4-5-thinking": { "name": "Claude Opus 4.5 Thinking (Antigravity)" }
      }
    }
  }
}
```

Then install the plugin:

```bash
cd ~/.config/opencode
npm install opencode-antigravity-auth@beta
```

## ⚠️ Important Notes

### Config File Locations

OpenCode may read from **two locations** (platform dependent):
- `~/.config/opencode/opencode.json` (Linux/macOS/Windows)
- `%APPDATA%\opencode\opencode.json` (Windows only)

Make sure the plugin is disabled/enabled in **both** if issues persist.

### Free Models Still Work

OpenCode's built-in free models (MiniMax, Grok, GLM-4.7, etc.) work **without** Antigravity Manager. The plugin only intercepts Antigravity-prefixed models.

### CLAUDE.md Warning

> ⚠️ Do NOT place a `CLAUDE.md` file in your home folder that mentions "Antigravity proxy" - it will be injected as context into ALL model responses, making every model claim it's using the proxy.


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

- [Antigravity Manager](https://github.com/lbjlaq/Antigravity-Manager) - Multi-account AI quota manager
- [OpenCode](https://github.com/anomalyco/opencode) - Original open source AI coding agent

## Support

If this project helps you, consider supporting development:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Development-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/ai_dev_2024)

## License

MIT - Same as original OpenCode

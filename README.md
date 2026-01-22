# OpenCode + Antigravity Manager Integration

[![GitHub Release](https://img.shields.io/github/v/release/ai-dev-2024/opencode-antigravity)](https://github.com/ai-dev-2024/opencode-antigravity/releases)
[![Auto-Update](https://github.com/ai-dev-2024/opencode-antigravity/actions/workflows/update-versions.yml/badge.svg)](https://github.com/ai-dev-2024/opencode-antigravity/actions/workflows/update-versions.yml)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Development-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/ai_dev_2024)

Use **[OpenCode](https://opencode.ai)** with **[Antigravity Manager Tool](https://github.com/lbjlaq/Antigravity-Manager)** for **combined quota from multiple AI accounts** with automatic rotation.

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| **Antigravity Manager Tool** | [Download](https://github.com/lbjlaq/Antigravity-Manager/releases) |
| **OpenCode CLI** | [Download](https://github.com/anomalyco/opencode/releases) |
| **OpenCode Desktop** | [Download](https://github.com/anomalyco/opencode/releases) |
| **Support Development** | [Ko-fi](https://ko-fi.com/ai_dev_2024) |

## ✅ Verified Working

This integration has been tested and confirmed working with:
- OpenCode CLI ✅
- OpenCode Desktop ✅
- Antigravity Manager Tool (port 8888) ✅

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
             (Claude, Gemini, GPT-OSS)         (localhost:8888)
                                                    │
                                              ┌─────┴─────┐
                                              │ 4 Accounts│
                                              │Auto-rotation│
                                              └───────────┘
```

## 🚀 Quick Setup

### Step 1: Start Antigravity Manager

Download from **[Antigravity Manager Releases](https://github.com/lbjlaq/Antigravity-Manager/releases)** and start it. The proxy runs on `http://127.0.0.1:8888`.

### Step 2: Configure OpenCode

Add to `~/.config/opencode/opencode.json` (Linux/macOS) or `%USERPROFILE%\.config\opencode\opencode.json` (Windows):

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
          "name": "Gemini 3 Pro High (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 }
        },
        "gemini-3-pro-low": {
          "name": "Gemini 3 Pro Low (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 }
        },
        "gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 }
        },
        "claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 }
        },
        "claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 }
        },
        "claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 }
        },
        "gpt-oss-120b-medium": {
          "name": "GPT-OSS 120B Medium (Antigravity)",
          "limit": { "context": 128000, "output": 16384 }
        }
      }
    }
  }
}
```

### Step 3: Connect Provider in OpenCode

**CLI:**
```bash
opencode
# Then type: /connect
# Select: Other
# Provider ID: antigravity
# API Key: sk-antigravity
```

**Desktop:**
Press `Ctrl+P` → type `/connect` → Select "Other" → Enter `antigravity` and `sk-antigravity`

### Step 4: Select Model

Run `/models` in OpenCode and select any Antigravity model!

## 📋 Available Models

| Model ID | Description |
|----------|-------------|
| `antigravity/gemini-3-pro-high` | Gemini 3 Pro with high quota |
| `antigravity/gemini-3-pro-low` | Gemini 3 Pro with low thinking |
| `antigravity/gemini-3-flash` | Fast Gemini 3 responses |
| `antigravity/gemini-2.5-flash` | Legacy Gemini 2.5 |
| `antigravity/claude-sonnet-4-5` | Claude Sonnet 4.5 |
| `antigravity/claude-sonnet-4-5-thinking` | Claude Sonnet with extended thinking |
| `antigravity/claude-opus-4-5-thinking` | Claude Opus with extended thinking |
| `antigravity/gpt-oss-120b-medium` | GPT-OSS 120B model |

## ⚙️ Important: Persistent Settings

These settings ensure proper routing **persists across updates** to OpenCode, Claude CLI, and Antigravity Manager:

### Environment Variable (Required)

Set this **once** at the User level - it persists across all app updates:

**Windows (PowerShell as Admin):**
```powershell
[System.Environment]::SetEnvironmentVariable('OPENCODE_DISABLE_CLAUDE_CODE_PROMPT', '1', 'User')
```

**Linux/macOS:**
```bash
echo 'export OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1' >> ~/.bashrc
source ~/.bashrc
```

**Why?** OpenCode normally reads `~/.claude/CLAUDE.md` for Claude CLI compatibility. This env var disables that, allowing:
- **Claude CLI** → Uses `~/.claude/CLAUDE.md` with Antigravity proxy ✅
- **OpenCode** → Ignores that file, free models work directly ✅

### What Persists Across Updates

| Component | Persists? | Location |
|-----------|-----------|----------|
| Environment variable | ✅ Yes | System User environment |
| OpenCode config | ✅ Yes | `~/.config/opencode/opencode.json` |
| Claude CLAUDE.md | ✅ Yes | `~/.claude/CLAUDE.md` |
| Antigravity accounts | ✅ Yes | Antigravity Manager data |

## 💡 Features

- ✅ **Combined Quota** - Use all accounts' quota from Antigravity Manager
- ✅ **Auto-Rotation** - Automatic account switching on rate limits (429/401)
- ✅ **Free Models Work** - OpenCode's native free models (MiniMax, Grok) unaffected
- ✅ **No Plugin Required** - Uses OpenCode's native custom provider feature
- ✅ **Claude + Gemini + GPT** - All models available through one proxy

## 📁 Config Templates

See the [`config-templates/`](./config-templates/) folder for ready-to-use configuration files.

## 🔗 Related Projects

| Project | Description |
|---------|-------------|
| [Antigravity Manager](https://github.com/lbjlaq/Antigravity-Manager) | Multi-account AI quota manager with auto-rotation |
| [OpenCode](https://github.com/anomalyco/opencode) | Open source AI coding agent (CLI + Desktop) |
| [OpenCode Website](https://opencode.ai) | Official OpenCode documentation |

## 🛡️ Antivirus Exclusions (Kaspersky/Windows Defender)

OpenCode spawns child processes and opens local ports, which may trigger antivirus software. Add these exclusions:

### Trusted Applications (Add both)

| Application | Path |
|-------------|------|
| **OpenCode Desktop** | `C:\Users\YOUR_USERNAME\AppData\Local\OpenCode\OpenCode.exe` |
| **Bun Runtime** | `C:\Users\YOUR_USERNAME\AppData\Local\OpenCode\bun.exe` |

### Kaspersky Setup

1. Open Kaspersky → Settings → Security Settings
2. Threats and Exclusions → Specify trusted applications
3. Add → Browse to `OpenCode.exe` and `bun.exe`
4. Enable all options:
   - Allow interaction with OS
   - Do not monitor application activity
   - Do not restrict application activity
   - Do not scan network traffic
5. Save and restart Kaspersky

### Optional: Network Trust

Add `127.0.0.1` and `localhost` to trusted addresses (Settings → Network Settings → Trusted addresses).

## ☕ Support

If this project helps you, consider supporting development:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Development-FF5E5B?logo=ko-fi&logoColor=white&style=for-the-badge)](https://ko-fi.com/ai_dev_2024)

## 📜 License

MIT

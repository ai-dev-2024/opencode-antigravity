# OpenCode + Antigravity Manager Integration 🚀

[![Website](https://img.shields.io/badge/Website-Live-brightgreen)](https://opencode-antigravity.vercel.app)
[![Version](https://img.shields.io/badge/Version-1.1.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Ko-Fi](https://img.shields.io/badge/Ko--Fi-Support-ff5e5b?logo=ko-fi)](https://ko-fi.com/ai_dev_2024)

![OpenCode + Antigravity Banner](release/banner.png)

> **Unlock Infinite AI Quota in OpenCode Desktop & CLI - With Clipboard Image Paste!**
> 
> 🌐 **[Visit Website](https://opencode-antigravity.vercel.app)** | 📖 **[Documentation](#-one-click-installation-windows)** | ☕ **[Support on Ko-Fi](https://ko-fi.com/ai_dev_2024)**

This project provides a seamless, **plug-in free** configuration to integrate **OpenCode** with **Antigravity Manager**. Bypass local quota limits by routing your AI requests through Antigravity's unified account pool.

---

## 🌟 Features

- **🔌 Plug-in Free**: No complex npm packages or risky plugins. Just pure, native configuration.
- **♾️ Infinite Quota**: Automatically rotates through your Google/Claude accounts managed by Antigravity Manager.
- **📋 Clipboard Image Paste**: Paste images directly with Ctrl+V - works on Windows, macOS, and Linux!
- **⚡ High Performance**: Direct HTTP connection to your local Manager proxy (Port 8888).
- **🛠️ Zero Config**: Pre-mapped model IDs for Gemini 3 Pro, Flash, and Claude models.
- **🆓 Free Models**: OpenCode's built-in free models (GitHub search, etc.) work as usual.

---

## 🏗️ Architecture

```text
+------------------+         +---------------------------+         +-------------------+
|                  |         |                           |         |                   |
| OpenCode Desktop | ------> |                           | ------> |     Account 1     |
|                  |         |    Antigravity Manager    |         |                   |
+------------------+         |        (Port 8888)        |         +-------------------+
                             |                           |
+------------------+         |     [ PRO / FLASH ]       |         +-------------------+
|                  | ------> |                           | ------> |     Account 2     |
|   OpenCode CLI   |         |    [ Token Rotation ]     |         |                   |
+------------------+         +---------------------------+         +-------------------+
```

---

## 🚀 One-Click Installation (Windows)

### Prerequisites
1. **Install [OpenCode](https://opencode.ai)** (Desktop & CLI).
2. **Install [Antigravity Manager](https://antigravity.tools)** and ensure it is running (Port 8888).
   - *Tip: Get [Antigravity Manager Supreme](https://antigravity.tools) for advanced features!*

### Installation
Run this simple command in PowerShell:

```powershell
irm https://raw.githubusercontent.com/ai-dev-2024/opencode-antigravity/main/release/install.ps1 | iex
```

Or clone and run locally:

```powershell
git clone https://github.com/ai-dev-2024/opencode-antigravity.git
cd opencode-antigravity
.\release\install.ps1
```

**That's it!** Restart OpenCode and enjoy your new models.

---

## 📋 Clipboard Image Paste

OpenCode now supports **direct clipboard image paste** via Ctrl+V:

| Platform | Method | Status |
|----------|--------|--------|
| **Windows** | PowerShell + System.Windows.Forms | ✅ Full support |
| **macOS** | osascript + sips | ✅ Full support |
| **Linux (Wayland)** | wl-paste | ✅ Full support |
| **Linux (X11)** | xclip | ✅ Full support |

### How It Works
1. Copy an image to your clipboard (screenshot, snipping tool, etc.)
2. In OpenCode CLI, press **Ctrl+V**
3. The image appears as `[Image 1]` in your prompt
4. Send your message - the AI will see your image!

### Configuration
Clipboard image paste is enabled by default. To disable:

```json
{
  "experimental": {
    "enableClipboardImages": false
  }
}
```

---

## 📋 Manual Installation

If you prefer to configure manually:

1. **Locate your config**: `~/.config/opencode/opencode.json` (Create if missing).
2. **Copy the Config**: Paste the contents of [`release/opencode.json`](release/opencode.json) into your file.
3. **Restart OpenCode**.

---

## 🛡️ Troubleshooting

### "Service Unavailable" / "Token Error"
If you see errors like `Token error: All accounts are currently...`:
1. Open **Antigravity Manager Dashboard**.
2. Go to **Accounts**.
3. **Delete and Re-Add** all your Google accounts (Refresh is sometimes insufficient).
4. Verify one account works in the Manager's own playground.

### Clipboard Image Paste Not Working
1. **Windows**: Ensure PowerShell is available in PATH.
2. **macOS**: Ensure `osascript` is available (default on macOS).
3. **Linux**: Install `wl-clipboard` (Wayland) or `xclip` (X11):
   ```bash
   # Wayland
   sudo apt install wl-clipboard
   
   # X11
   sudo apt install xclip
   ```

### Free Models Not Working
OpenCode's built-in free models should work normally. If they're being routed through Antigravity:
1. Check that your `opencode.json` doesn't override default providers.
2. The free models use separate provider configurations and aren't affected by this integration.

---

## 📦 What's Included?

| File | Description |
|------|-------------|
| `release/opencode.json` | The magic configuration file |
| `release/install.ps1` | Automated Windows installer |
| `packages/opencode/src/cli/cmd/tui/util/clipboard.ts` | Enhanced clipboard module |

---

## 🔗 Links

- **[OpenCode](https://opencode.ai)** - The open-source AI code editor.
- **[Antigravity Manager](https://antigravity.tools)** - The ultimate account management tool.
- **[Support / Supreme Access](https://antigravity.tools)** - Support the project!

---

## 📊 Changelog

### v1.1.0 (Current)
- ✨ **New**: Cross-platform clipboard image paste (Ctrl+V)
- ✨ **New**: Structured clipboard result types with error handling
- ✨ **New**: Runtime platform helper detection
- ✨ **New**: `enableClipboardImages` experimental config option
- 🔧 Maintained backwards compatibility with existing functionality

### v1.0.0
- Initial release with Antigravity Manager integration
- Zero-config model routing
- Infinite quota via account rotation

---

*Note: This configuration is a community integration and requires your own Antigravity Manager setup.*

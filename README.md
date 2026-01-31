<div align="center">

# ☕ OpenCode + Antigravity Integration

### Unlock **Infinite AI Quota** in OpenCode with Zero Configuration

<br>

[![Live Website](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-e8d5b7?style=for-the-badge)](https://opencode-antigravity.vercel.app)
[![Support on Ko-Fi](https://img.shields.io/badge/☕_Support-Ko--Fi-ff5e5b?style=for-the-badge)](https://ko-fi.com/ai_dev_2024)

<br>

[![Version](https://img.shields.io/badge/Version-1.2.0-1a1614?style=flat-square)](CHANGELOG.md)
[![License](https://img.shields.io/badge/License-MIT-1a1614?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/ai-dev-2024/opencode-antigravity?style=flat-square&color=e8d5b7)](https://github.com/ai-dev-2024/opencode-antigravity)

</div>

---

<div align="center">

## ✨ Why This Integration?

</div>

| Feature | Description |
|:---:|:---|
| ♾️ **Infinite Quota** | Automatically rotate through pooled Google/Claude accounts managed by Antigravity |
| 📋 **Clipboard Image Paste** | Press `Ctrl+V` to paste screenshots directly into your AI prompts |
| ⚡ **Zero Latency** | Direct HTTP connection to local proxy (Port 8888) - no cloud roundtrips |
| 🔒 **Privacy First** | All processing happens locally. Your code never leaves your machine |
| 🆓 **Free Models Included** | OpenCode's built-in free models continue working seamlessly |

---

## 🚀 One-Click Installation

Open **PowerShell as Administrator** and run:

```powershell
irm https://raw.githubusercontent.com/ai-dev-2024/opencode-antigravity/main/release/install.ps1 | iex
```

**Or clone manually:**

```bash
git clone https://github.com/ai-dev-2024/opencode-antigravity.git
cd opencode-antigravity
./release/install.ps1
```

Then **restart OpenCode** and select the Antigravity provider.

---

## 📋 Clipboard Image Paste (Windows Fix)

OpenCode v1.1.47+ supports clipboard image paste, but **Windows Terminal intercepts Ctrl+V** by default.

### Quick Fix:

1. Open **Windows Terminal Settings** (`Ctrl+,`)
2. Go to **Actions** → Find **Paste** (bound to `Ctrl+V`)
3. Change it to `Ctrl+Shift+V`
4. **Restart terminal** and run `opencode`
5. Now **Ctrl+V** will paste images!

> **Tip**: After this change, use `Ctrl+Shift+V` for regular text paste in terminal.

---

## 📸 Demo

<div align="center">

**Visit the live demo to see the integration in action:**

[![Website Screenshot](https://img.shields.io/badge/🖼️_View_Demo-opencode--antigravity.vercel.app-e8d5b7?style=for-the-badge)](https://opencode-antigravity.vercel.app)

</div>

---

## ☕ Support the Project

If this integration saves you time and API costs, please consider supporting development:

<div align="center">

[![Ko-Fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/ai_dev_2024)

</div>

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">
<sub>Built with ☕ by the community</sub>
</div>

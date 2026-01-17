# Configuration Templates

Copy these files to your OpenCode config directory to enable Antigravity Manager integration.

## Files

| File | Copy To | Description |
|------|---------|-------------|
| `opencode.json.example` | `~/.config/opencode/opencode.json` | Main OpenCode configuration with Antigravity models |
| `antigravity.json.example` | `~/.config/opencode/antigravity.json` | Antigravity plugin settings |

## Installation

### Windows

```powershell
# Copy config files
Copy-Item -Path "config-templates\opencode.json.example" -Destination "$env:USERPROFILE\.config\opencode\opencode.json"
Copy-Item -Path "config-templates\antigravity.json.example" -Destination "$env:USERPROFILE\.config\opencode\antigravity.json"

# Install the plugin
cd "$env:USERPROFILE\.config\opencode"
npm install opencode-antigravity-auth@beta
```

### Linux/macOS

```bash
# Copy config files
cp config-templates/opencode.json.example ~/.config/opencode/opencode.json
cp config-templates/antigravity.json.example ~/.config/opencode/antigravity.json

# Install the plugin
cd ~/.config/opencode
npm install opencode-antigravity-auth@beta
```

## ⚠️ Important Notes

1. **Antigravity Manager Required**: Make sure Antigravity Manager Tool is running on `http://localhost:8888` before using Antigravity models.

2. **Free Models Still Work**: OpenCode's built-in free models (MiniMax, Grok, GLM-4.7, etc.) will continue to work without the proxy.

3. **CLAUDE.md Warning**: Do NOT put a `CLAUDE.md` file in your home folder that mentions "Antigravity proxy" - it will be injected into ALL model responses.

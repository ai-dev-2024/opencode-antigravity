# Changelog

All notable changes to the OpenCode + Antigravity Integration project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-31

### Added
- **Windows Terminal Fix**: Automated workaround for Ctrl+V image paste on Windows.
  - Windows Terminal intercepts Ctrl+V by default, preventing image paste
  - Solution: Rebind terminal paste to `Ctrl+Shift+V`
  - Ctrl+V now correctly passes through to OpenCode for image paste
- **Caffeine Theme**: Modern dark theme with warm brown/cream color palette
- **SVG Icons**: Replaced emoji icons with proper vector graphics
- **Prominent Ko-Fi Support**: Dedicated support section on landing page

### Fixed
- Documented Windows Terminal Ctrl+V interception issue and solution
- Verified clipboard image paste works with OpenCode v1.1.47+

### Improved
- Enhanced Vercel landing page with glassmorphism design
- Better GitHub README with showcase table and badges
- Added troubleshooting section for clipboard issues

## [1.1.0] - 2026-01-31

### Added
- **Clipboard Image Paste**: Cross-platform support for pasting images directly via Ctrl+V.
  - Windows: PowerShell-based clipboard access
  - macOS: osascript-based clipboard access
  - Linux: wl-paste (Wayland) and xclip (X11) support
- **Vercel Landing Page**: Beautiful, responsive website at [opencode-antigravity.vercel.app](https://opencode-antigravity.vercel.app)
- **Enhanced Installation Script**: Now verifies clipboard support and displays feature summary.
- **Experimental Configuration**: Added `enableClipboardImages` option in config.
- **Ko-Fi Support**: Added donation link for community support.

### Improved
- Enhanced documentation with platform support matrix.
- Added troubleshooting guide for common issues.
- Updated README with one-click installation instructions.

## [1.0.0] - 2026-01-25

### Added
- **Plugin-Free Configuration**: Native `opencode.json` template that connects directly to Antigravity Manager.
- **Unified Quota System**: Integration now piggybacks on the Manager's combined account pool (4+ accounts).
- **Automated Installer**: `install.ps1` script for one-click configuration on Windows.
- **Model Support**: Mappings for `gemini-3-pro`, `gemini-2.5-flash`, and Claude interaction modes.

### Removed
- **Legacy Auth Plugin**: Removed dependency on `opencode-antigravity-auth` plugin which caused model ID conflict and duplication.
- **Thinking Headers**: Removed global `anthropic-beta` headers to ensure compatibility with Gemini models via the Manager.

### Fixed
- Resolved `Service Unavailable` errors by correctly mapping OpenCode model IDs to Antigravity Manager API IDs.
- Fixed duplicate model list entries in OpenCode Desktop.

# Changelog

All notable changes to the OpenCode + Antigravity Integration project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

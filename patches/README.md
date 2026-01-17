# Antigravity Integration Patches

This directory contains patches that are applied to upstream OpenCode to enable Antigravity Manager integration.

## Patch Files

- `001-model-bypass.patch` - Prevents built-in free models from being routed through Antigravity
- `002-antigravity-config.patch` - Adds Antigravity Manager proxy configuration

## How Patches Work

1. When a new upstream release is detected, the sync workflow merges upstream changes
2. Patches in this directory are applied in alphabetical order
3. If a patch fails to apply cleanly, the PR will indicate manual review is needed

## Creating New Patches

To create a patch for a modification:

```bash
# Make your changes, then:
git diff HEAD~1 > patches/XXX-description.patch
```

## Current Integration Features

- **Model Bypass**: OpenCode's built-in free models (Grok, MiniMax, etc.) work directly without Antigravity
- **Proxy Support**: Claude and Gemini models route through Antigravity Manager's local proxy
- **Quota Pooling**: Multiple authenticated accounts provide combined quota

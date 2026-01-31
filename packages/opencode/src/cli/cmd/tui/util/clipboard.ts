import { $ } from "bun"
import { platform, release } from "os"
import clipboardy from "clipboardy"
import { lazy } from "../../../../util/lazy.js"
import { tmpdir } from "os"
import path from "path"
import { fileURLToPath } from "url"

/**
 * Writes text to clipboard via OSC 52 escape sequence.
 * This allows clipboard operations to work over SSH by having
 * the terminal emulator handle the clipboard locally.
 */
function writeOsc52(text: string): void {
  if (!process.stdout.isTTY) return
  const base64 = Buffer.from(text).toString("base64")
  const osc52 = `\x1b]52;c;${base64}\x07`
  // tmux and screen require DCS passthrough wrapping
  const passthrough = process.env["TMUX"] || process.env["STY"]
  const sequence = passthrough ? `\x1bPtmux;\x1b${osc52}\x1b\\` : osc52
  process.stdout.write(sequence)
}

export namespace Clipboard {
  /**
   * Structured clipboard content with type information
   */
  export interface ClipboardContent {
    /** Content type: image, text, or file-path */
    type: "image" | "text" | "file-path"
    /** Base64 encoded data for images, raw string for text */
    data: string
    /** MIME type of the content */
    mime: string
    /** Image dimensions (only for images) */
    dimensions?: { width: number; height: number }
  }

  /**
   * Error codes for clipboard operations
   */
  export type ClipboardErrorCode =
    | "NO_ACCESS"
    | "NO_CONTENT"
    | "CONVERSION_FAILED"
    | "HELPER_MISSING"
    | "UNKNOWN"

  /**
   * Structured error for clipboard operations
   */
  export interface ClipboardError {
    code: ClipboardErrorCode
    message: string
    platform: "windows" | "darwin" | "linux" | "unknown"
  }

  /**
   * Result type for clipboard read operations
   */
  export type ClipboardResult =
    | { success: true; content: ClipboardContent }
    | { success: false; error: ClipboardError }

  /**
   * Legacy content interface for backwards compatibility
   */
  export interface Content {
    data: string
    mime: string
  }

  /**
   * Get current platform identifier
   */
  function getPlatform(): "windows" | "darwin" | "linux" | "unknown" {
    const os = platform()
    if (os === "win32" || release().includes("WSL")) return "windows"
    if (os === "darwin") return "darwin"
    if (os === "linux") return "linux"
    return "unknown"
  }

  /**
   * Check if platform clipboard helper is available
   */
  export async function checkHelperAvailable(): Promise<boolean> {
    const os = platform()

    if (os === "darwin") {
      return Bun.which("osascript") !== null
    }

    if (os === "win32" || release().includes("WSL")) {
      return Bun.which("powershell.exe") !== null || Bun.which("powershell") !== null
    }

    if (os === "linux") {
      const hasWayland = !!process.env["WAYLAND_DISPLAY"] && Bun.which("wl-paste") !== null
      const hasX11 = Bun.which("xclip") !== null
      return hasWayland || hasX11
    }

    return false
  }

  /**
   * Read clipboard content with structured result
   * Priority: image > text > file-path
   */
  export async function readStructured(): Promise<ClipboardResult> {
    const currentPlatform = getPlatform()

    try {
      // Try to read image first, then fall back to text
      if (currentPlatform === "darwin") {
        return await readDarwin()
      }

      if (currentPlatform === "windows") {
        return await readWindows()
      }

      if (currentPlatform === "linux") {
        return await readLinux()
      }

      // Fallback to clipboardy for text
      const text = await clipboardy.read().catch(() => null)
      if (text) {
        return {
          success: true,
          content: {
            type: "text",
            data: text,
            mime: "text/plain",
          },
        }
      }

      return {
        success: false,
        error: {
          code: "NO_CONTENT",
          message: "Clipboard is empty",
          platform: currentPlatform,
        },
      }
    } catch (err) {
      return {
        success: false,
        error: {
          code: "UNKNOWN",
          message: err instanceof Error ? err.message : String(err),
          platform: currentPlatform,
        },
      }
    }
  }

  /**
   * Read clipboard on macOS using osascript
   */
  async function readDarwin(): Promise<ClipboardResult> {
    const tmpfile = path.join(tmpdir(), `opencode-clipboard-${Date.now()}.png`)

    try {
      // Try to get image data
      const result = await $`osascript -e 'set imageData to the clipboard as "PNGf"' -e 'set fileRef to open for access POSIX file "${tmpfile}" with write permission' -e 'set eof fileRef to 0' -e 'write imageData to fileRef' -e 'close access fileRef'`
        .nothrow()
        .quiet()

      if (result.exitCode === 0) {
        const file = Bun.file(tmpfile)
        const exists = await file.exists()
        if (exists) {
          const buffer = await file.arrayBuffer()
          if (buffer.byteLength > 0) {
            // Try to get dimensions using sips
            let dimensions: { width: number; height: number } | undefined
            try {
              const widthResult = await $`sips -g pixelWidth "${tmpfile}"`.nothrow().quiet().text()
              const heightResult = await $`sips -g pixelHeight "${tmpfile}"`.nothrow().quiet().text()
              const widthMatch = widthResult.match(/pixelWidth:\s*(\d+)/)
              const heightMatch = heightResult.match(/pixelHeight:\s*(\d+)/)
              if (widthMatch && heightMatch) {
                dimensions = {
                  width: parseInt(widthMatch[1], 10),
                  height: parseInt(heightMatch[1], 10),
                }
              }
            } catch {
              // Dimensions are optional
            }

            return {
              success: true,
              content: {
                type: "image",
                data: Buffer.from(buffer).toString("base64"),
                mime: "image/png",
                dimensions,
              },
            }
          }
        }
      }
    } catch {
      // Image extraction failed, try text
    } finally {
      await $`rm -f "${tmpfile}"`.nothrow().quiet()
    }

    // Fallback to text using pbpaste
    try {
      const text = await $`pbpaste`.nothrow().text()
      if (text && text.trim()) {
        return {
          success: true,
          content: {
            type: "text",
            data: text,
            mime: "text/plain",
          },
        }
      }
    } catch {
      // Text extraction failed
    }

    return {
      success: false,
      error: {
        code: "NO_CONTENT",
        message: "Clipboard is empty or contains unsupported content",
        platform: "darwin",
      },
    }
  }

  /**
   * Read clipboard on Windows using PowerShell
   */
  async function readWindows(): Promise<ClipboardResult> {
    // PowerShell script to read clipboard image
    const imageScript = `
Add-Type -AssemblyName System.Windows.Forms
$result = @{ success = $false; type = "none" }

$img = [System.Windows.Forms.Clipboard]::GetImage()
if ($img) {
    $ms = New-Object System.IO.MemoryStream
    $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $result = @{
        success = $true
        type = "image"
        mime = "image/png"
        data = [System.Convert]::ToBase64String($ms.ToArray())
        width = $img.Width
        height = $img.Height
    }
    $ms.Dispose()
    $img.Dispose()
} elseif ([System.Windows.Forms.Clipboard]::ContainsFileDropList()) {
    $files = [System.Windows.Forms.Clipboard]::GetFileDropList()
    if ($files.Count -gt 0) {
        $result = @{
            success = $true
            type = "file-path"
            mime = "text/plain"
            data = $files[0]
        }
    }
} elseif ([System.Windows.Forms.Clipboard]::ContainsText()) {
    $text = [System.Windows.Forms.Clipboard]::GetText()
    $result = @{
        success = $true
        type = "text"
        mime = "text/plain"
        data = $text
    }
}

$result | ConvertTo-Json -Compress
`.trim()

    try {
      const output = await $`powershell.exe -NonInteractive -NoProfile -command "${imageScript}"`
        .nothrow()
        .text()

      if (output && output.trim()) {
        try {
          const parsed = JSON.parse(output.trim())
          if (parsed.success) {
            const content: ClipboardContent = {
              type: parsed.type as "image" | "text" | "file-path",
              data: parsed.data,
              mime: parsed.mime,
            }
            if (parsed.type === "image" && parsed.width && parsed.height) {
              content.dimensions = {
                width: parsed.width,
                height: parsed.height,
              }
            }
            return { success: true, content }
          }
        } catch {
          // JSON parse failed, try legacy method
        }
      }
    } catch {
      // PowerShell execution failed
    }

    // Legacy fallback: try simple image extraction
    try {
      const legacyScript =
        "Add-Type -AssemblyName System.Windows.Forms; $img = [System.Windows.Forms.Clipboard]::GetImage(); if ($img) { $ms = New-Object System.IO.MemoryStream; $img.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); [System.Convert]::ToBase64String($ms.ToArray()) }"
      const base64 = await $`powershell.exe -NonInteractive -NoProfile -command "${legacyScript}"`
        .nothrow()
        .text()

      if (base64 && base64.trim()) {
        const imageBuffer = Buffer.from(base64.trim(), "base64")
        if (imageBuffer.length > 0) {
          return {
            success: true,
            content: {
              type: "image",
              data: imageBuffer.toString("base64"),
              mime: "image/png",
            },
          }
        }
      }
    } catch {
      // Legacy image extraction failed
    }

    // Text fallback
    try {
      const text = await clipboardy.read()
      if (text) {
        return {
          success: true,
          content: {
            type: "text",
            data: text,
            mime: "text/plain",
          },
        }
      }
    } catch {
      // clipboardy failed
    }

    return {
      success: false,
      error: {
        code: "NO_CONTENT",
        message: "Clipboard is empty or contains unsupported content",
        platform: "windows",
      },
    }
  }

  /**
   * Read clipboard on Linux using wl-paste or xclip
   */
  async function readLinux(): Promise<ClipboardResult> {
    const isWayland = !!process.env["WAYLAND_DISPLAY"]

    // Try Wayland first if available
    if (isWayland && Bun.which("wl-paste")) {
      try {
        // Try image
        const imageData = await $`wl-paste -t image/png`.nothrow().arrayBuffer()
        if (imageData && imageData.byteLength > 0) {
          return {
            success: true,
            content: {
              type: "image",
              data: Buffer.from(imageData).toString("base64"),
              mime: "image/png",
            },
          }
        }
      } catch {
        // Image not available
      }

      try {
        // Try text
        const text = await $`wl-paste`.nothrow().text()
        if (text && text.trim()) {
          return {
            success: true,
            content: {
              type: "text",
              data: text,
              mime: "text/plain",
            },
          }
        }
      } catch {
        // Text not available
      }
    }

    // Try X11 with xclip
    if (Bun.which("xclip")) {
      try {
        // Try image
        const imageData = await $`xclip -selection clipboard -t image/png -o`.nothrow().arrayBuffer()
        if (imageData && imageData.byteLength > 0) {
          return {
            success: true,
            content: {
              type: "image",
              data: Buffer.from(imageData).toString("base64"),
              mime: "image/png",
            },
          }
        }
      } catch {
        // Image not available
      }

      try {
        // Try text
        const text = await $`xclip -selection clipboard -o`.nothrow().text()
        if (text && text.trim()) {
          return {
            success: true,
            content: {
              type: "text",
              data: text,
              mime: "text/plain",
            },
          }
        }
      } catch {
        // Text not available
      }
    }

    // Final fallback with clipboardy
    try {
      const text = await clipboardy.read()
      if (text) {
        return {
          success: true,
          content: {
            type: "text",
            data: text,
            mime: "text/plain",
          },
        }
      }
    } catch {
      // clipboardy failed
    }

    return {
      success: false,
      error: {
        code: isWayland ? "HELPER_MISSING" : "NO_CONTENT",
        message: isWayland
          ? "wl-paste not available for Wayland clipboard access"
          : "Clipboard is empty or contains unsupported content",
        platform: "linux",
      },
    }
  }

  /**
   * Legacy read function for backwards compatibility
   * Returns simple Content interface
   */
  export async function read(): Promise<Content | undefined> {
    const result = await readStructured()

    if (result.success) {
      return {
        data: result.content.data,
        mime: result.content.mime,
      }
    }

    // For backwards compatibility, return undefined on error
    return undefined
  }

  const getCopyMethod = lazy(() => {
    const os = platform()

    if (os === "darwin" && Bun.which("osascript")) {
      console.log("clipboard: using osascript")
      return async (text: string) => {
        const escaped = text.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
        await $`osascript -e 'set the clipboard to "${escaped}"'`.nothrow().quiet()
      }
    }

    if (os === "linux") {
      if (process.env["WAYLAND_DISPLAY"] && Bun.which("wl-copy")) {
        console.log("clipboard: using wl-copy")
        return async (text: string) => {
          const proc = Bun.spawn(["wl-copy"], { stdin: "pipe", stdout: "ignore", stderr: "ignore" })
          proc.stdin.write(text)
          proc.stdin.end()
          await proc.exited.catch(() => {})
        }
      }
      if (Bun.which("xclip")) {
        console.log("clipboard: using xclip")
        return async (text: string) => {
          const proc = Bun.spawn(["xclip", "-selection", "clipboard"], {
            stdin: "pipe",
            stdout: "ignore",
            stderr: "ignore",
          })
          proc.stdin.write(text)
          proc.stdin.end()
          await proc.exited.catch(() => {})
        }
      }
      if (Bun.which("xsel")) {
        console.log("clipboard: using xsel")
        return async (text: string) => {
          const proc = Bun.spawn(["xsel", "--clipboard", "--input"], {
            stdin: "pipe",
            stdout: "ignore",
            stderr: "ignore",
          })
          proc.stdin.write(text)
          proc.stdin.end()
          await proc.exited.catch(() => {})
        }
      }
    }

    if (os === "win32") {
      console.log("clipboard: using powershell")
      return async (text: string) => {
        // need to escape backticks because powershell uses them as escape code
        const escaped = text.replace(/"/g, '""').replace(/`/g, "``")
        await $`powershell -NonInteractive -NoProfile -Command "Set-Clipboard -Value \"${escaped}\""`.nothrow().quiet()
      }
    }

    console.log("clipboard: no native support")
    return async (text: string) => {
      await clipboardy.write(text).catch(() => {})
    }
  })

  export async function copy(text: string): Promise<void> {
    writeOsc52(text)
    await getCopyMethod()(text)
  }
}

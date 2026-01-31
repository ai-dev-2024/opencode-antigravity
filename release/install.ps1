
Write-Host "🚀 Installing OpenCode + Antigravity Integration..." -ForegroundColor Cyan
Write-Host "   With Clipboard Image Paste Support!" -ForegroundColor Gray

# Define Paths
$ConfigDir = "$env:USERPROFILE\.config\opencode"
$TargetFile = "$ConfigDir\opencode.json"
$SourceFile = "$PSScriptRoot\opencode.json"

# Check Source
if (-not (Test-Path $SourceFile)) {
    Write-Error "❌ Error: opencode.json template not found in script directory!"
    exit 1
}

# Create Config Directory
if (-not (Test-Path $ConfigDir)) {
    New-Item -ItemType Directory -Force -Path $ConfigDir | Out-Null
    Write-Host "Created directory: $ConfigDir" -ForegroundColor Gray
}

# Backup Existing
if (Test-Path $TargetFile) {
    $Backup = "$TargetFile.bak.$(Get-Date -Format 'yyyyMMddHHmmss')"
    Rename-Item -Path $TargetFile -NewName $Backup
    Write-Host "⚠️  Backed up existing config to: $Backup" -ForegroundColor Yellow
}

# Copy Config
Copy-Item -Path $SourceFile -Destination $TargetFile
Write-Host "✅ Configuration installed to: $TargetFile" -ForegroundColor Green

# Check Clipboard Helper Availability
Write-Host "`nChecking clipboard image paste support..." -ForegroundColor Cyan
try {
    Add-Type -AssemblyName System.Windows.Forms
    Write-Host "✅ Clipboard image paste: Fully supported" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Clipboard image paste: Limited support (text only)" -ForegroundColor Yellow
}

# Check Antigravity Connection
Write-Host "`nTesting connection to Antigravity Manager (Port 8888)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8888/v1/models" -Method Get -ErrorAction Stop
    $count = $response.data.Count
    Write-Host "✅ Connected! Found $count models available." -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not connect to Antigravity Manager on port 8888." -ForegroundColor Yellow
    Write-Host "   Please ensure Antigravity Manager is running and the API Proxy is enabled."
}

Write-Host "`n🎉 Installation Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Features enabled:" -ForegroundColor Cyan
Write-Host "  ✅ Antigravity Manager integration (infinite quota)" -ForegroundColor White
Write-Host "  ✅ Clipboard image paste (Ctrl+V)" -ForegroundColor White
Write-Host "  ✅ OpenCode free models (unchanged)" -ForegroundColor White
Write-Host ""
Write-Host "Restart OpenCode to see your new models." -ForegroundColor Cyan

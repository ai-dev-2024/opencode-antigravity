
Write-Host "🚀 Installing OpenCode + Antigravity Integration..." -ForegroundColor Cyan

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

# Check Antigravity Connection
Write-Host "`nTesting connection to Antigravity Manager (Port 8888)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8888/v1/models" -Method Get -ErrorAction Stop
    $count = $response.data.Count
    Write-Host "✅ Connected! Found $count models available." -ForegroundColor Green
    Write-Host "`n installation Complete! Restart OpenCode to see your new models." -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Could not connect to Antigravity Manager on port 8888." -ForegroundColor Yellow
    Write-Host "   Please ensure Antigravity Manager is running and the API Proxy is enabled."
}

# install-protocol-handler.ps1
# Registriert den claudecode:// URL-Handler fuer den aktuellen Windows-Benutzer.
# Kein Admin-Recht notwendig (HKCU).
# Einmalig ausfuehren: Rechtsklick -> "Mit PowerShell ausfuehren"

$batPath = Join-Path $PSScriptRoot "claude-code-launcher.bat"

if (-not (Test-Path $batPath)) {
    Write-Host "FEHLER: claude-code-launcher.bat nicht gefunden in: $PSScriptRoot" -ForegroundColor Red
    pause
    exit 1
}

$regBase = "HKCU:\SOFTWARE\Classes\claudecode"

# Protokoll-Root
New-Item -Path $regBase -Force | Out-Null
Set-ItemProperty -Path $regBase -Name "(Default)" -Value "URL:Claude Code Protocol"
Set-ItemProperty -Path $regBase -Name "URL Protocol"  -Value ""

# Shell-Befehl
$regCmd = "$regBase\shell\open\command"
New-Item -Path $regCmd -Force | Out-Null
Set-ItemProperty -Path $regCmd -Name "(Default)" -Value "`"$batPath`" `"%1`""

Write-Host ""
Write-Host "✓ claudecode:// Protokoll-Handler installiert!" -ForegroundColor Green
Write-Host "  Launcher: $batPath" -ForegroundColor Gray
Write-Host ""
Write-Host "Browser neu starten, dann funktioniert der Claude Code Link auf der Startseite." -ForegroundColor Cyan
pause

# install-protocol-handler.ps1
# Registriert den claudecode:// URL-Handler fuer den aktuellen Windows-Benutzer.
# Kein Admin-Recht notwendig (HKCU).
# Einmalig ausfuehren: Rechtsklick -> "Mit PowerShell ausfuehren"

try {
    $batPath = Join-Path $PSScriptRoot "claude-code-launcher.bat"

    Write-Host ""
    Write-Host "Pruefe Voraussetzungen..." -ForegroundColor Cyan

    # BAT-Datei pruefen
    if (-not (Test-Path $batPath)) {
        throw "claude-code-launcher.bat nicht gefunden in: $PSScriptRoot"
    }
    Write-Host "  [OK] Launcher gefunden: $batPath" -ForegroundColor Green

    # Registrierung schreiben
    $regBase = "HKCU:\SOFTWARE\Classes\claudecode"

    New-Item -Path $regBase -Force | Out-Null
    Set-ItemProperty -Path $regBase -Name "(Default)" -Value "URL:Claude Code Protocol"
    Set-ItemProperty -Path $regBase -Name "URL Protocol" -Value ""
    Write-Host "  [OK] Protokoll-Schluessel angelegt" -ForegroundColor Green

    $regCmd = "$regBase\shell\open\command"
    New-Item -Path $regCmd -Force | Out-Null
    Set-ItemProperty -Path $regCmd -Name "(Default)" -Value "`"$batPath`" `"%1`""
    Write-Host "  [OK] Shell-Befehl registriert" -ForegroundColor Green

    # Ergebnis aus Registry lesen und anzeigen
    $registeredCmd = (Get-ItemProperty -Path $regCmd)."(Default)"
    Write-Host ""
    Write-Host "Registrierter Befehl:" -ForegroundColor Gray
    Write-Host "  $registeredCmd" -ForegroundColor Gray

    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host "  FERTIG! claudecode:// erfolgreich installiert" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Naechste Schritte:" -ForegroundColor Cyan
    Write-Host "  1. Browser (Edge/Chrome) neu starten" -ForegroundColor White
    Write-Host "  2. Auf der KI-Startseite Claude Code anklicken" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "FEHLER: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Details:" -ForegroundColor Yellow
    Write-Host $_.ScriptStackTrace -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Druecke eine Taste zum Beenden..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

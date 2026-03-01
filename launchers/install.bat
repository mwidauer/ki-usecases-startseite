@echo off
echo.
echo =============================================
echo  localapp:// Protokoll-Handler installieren
echo =============================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-protocol-handler.ps1"
echo.
if %ERRORLEVEL% NEQ 0 (
    echo FEHLER: PowerShell-Skript mit Fehlercode %ERRORLEVEL% beendet.
    echo Bitte Screenshot machen und an Claude Code schicken.
) else (
    echo Skript erfolgreich abgeschlossen.
)
echo.
pause

@echo off
setlocal
set "VBS=%~dp0..\start-hidden.vbs"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "TARGET=%STARTUP%\KI-Usecases-Server.vbs"

echo.
echo ==========================================
echo  KI-Usecases – Autostart einrichten
echo ==========================================
echo.

if not exist "%VBS%" (
    echo FEHLER: start-hidden.vbs nicht gefunden.
    echo Erwartet unter: %VBS%
    echo.
    pause
    exit /b 1
)

copy /Y "%VBS%" "%TARGET%" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Autostart-Eintrag erstellt:
    echo      %TARGET%
    echo.
    echo Der Server startet ab sofort automatisch beim naechsten
    echo Windows-Login unsichtbar im Hintergrund.
    echo.
    echo Danach einfach den Browser-Favoriten oeffnen:
    echo      http://localhost:8080
) else (
    echo [FEHLER] Konnte Autostart-Eintrag nicht erstellen.
)

echo.
pause

@echo off
echo.
echo ==========================================
echo  KI-Usecases Startseite starten
echo ==========================================
echo.

python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo FEHLER: Python nicht gefunden.
    echo Bitte Python 3 installieren: https://www.python.org
    echo.
    pause
    exit /b 1
)

python "%~dp0server.py"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo FEHLER: Server konnte nicht gestartet werden.
    echo.
    pause
)

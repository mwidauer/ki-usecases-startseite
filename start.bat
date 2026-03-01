@echo off
setlocal
set "DIR=%~dp0"
set "PYTHON_LOCAL=%DIR%python\python.exe"

echo.
echo ==========================================
echo  KI-Usecases Startseite
echo ==========================================
echo.

:: Priorität 1: Eingebettetes Python (python\python.exe)
if exist "%PYTHON_LOCAL%" (
    echo Starte Server...
    "%PYTHON_LOCAL%" "%DIR%server.py"
    goto :eof
)

:: Priorität 2: System-Python
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starte Server (System-Python)...
    python "%DIR%server.py"
    goto :eof
)

:: Priorität 3: Kein Python gefunden – anbieten herunterzuladen
echo Python nicht gefunden.
echo.
echo Das Tool benoetigt Python 3. Optionen:
echo   [1] Python automatisch herunterladen (~10 MB, einmalig)
echo   [2] Python manuell installieren: https://www.python.org
echo.
set /p "CHOICE=Auswahl [1/2]: "

if "%CHOICE%"=="1" (
    echo.
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%DIR%setup\get-python.ps1"
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo FEHLER beim Herunterladen. Bitte Python manuell installieren.
        echo https://www.python.org
        echo.
        pause
        exit /b 1
    )
    echo Starte Server...
    "%PYTHON_LOCAL%" "%DIR%server.py"
) else (
    echo.
    echo Bitte Python 3 installieren und start.bat erneut ausfuehren.
    echo https://www.python.org
    echo.
    pause
)

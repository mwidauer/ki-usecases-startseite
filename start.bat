@echo off
setlocal
set "DIR=%~dp0"
set "PYTHON_LOCAL=%DIR%python\python.exe"

echo.
echo ==========================================
echo  KI-Usecases Startseite
echo ==========================================
echo.

:: server.py vorhanden?
if not exist "%DIR%server.py" (
    echo FEHLER: server.py nicht gefunden.
    echo Bitte sicherstellen, dass start.bat im Projektordner liegt.
    echo Aktueller Ordner: %DIR%
    echo.
    pause
    exit /b 1
)

:: Priorität 1: Eingebettetes Python (python\python.exe)
if exist "%PYTHON_LOCAL%" (
    echo Starte Server (eingebettetes Python)...
    "%PYTHON_LOCAL%" "%DIR%server.py"
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Server beendet mit Fehlercode %ERRORLEVEL%
        pause
    )
    goto :eof
)

:: Priorität 2: System-Python
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starte Server (System-Python)...
    python "%DIR%server.py"
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Server beendet mit Fehlercode %ERRORLEVEL%
        pause
    )
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
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo Server beendet mit Fehlercode %ERRORLEVEL%
        pause
    )
) else (
    echo.
    echo Bitte Python 3 installieren und start.bat erneut ausfuehren.
    echo https://www.python.org
    echo.
    pause
)

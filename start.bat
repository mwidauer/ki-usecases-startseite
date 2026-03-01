@echo off
setlocal
set "DIR=%~dp0"
set "PYTHON_LOCAL=%DIR%python\python.exe"

echo.
echo ==========================================
echo  KI-Usecases Startseite
echo ==========================================
echo.
echo Projektordner: %DIR%
echo.

:: server.py vorhanden?
if not exist "%DIR%server.py" (
    echo FEHLER: server.py nicht gefunden in:
    echo %DIR%
    echo.
    pause
    exit /b 1
)

:: Priorität 1: Eingebettetes Python
if exist "%PYTHON_LOCAL%" (
    echo Python: eingebettet [%PYTHON_LOCAL%]
    echo.
    echo Server laeuft auf http://localhost:8080
    echo Browser-Favorit oeffnen oder URL manuell eingeben.
    echo.
    "%PYTHON_LOCAL%" "%DIR%server.py" --no-browser
    echo.
    echo Server beendet. Exitcode: %ERRORLEVEL%
    pause
    goto :eof
)

:: Priorität 2: System-Python
python --version 2>&1
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Python: System
    echo.
    echo Server laeuft auf http://localhost:8080
    echo Browser-Favorit oeffnen oder URL manuell eingeben.
    echo.
    python "%DIR%server.py" --no-browser
    echo.
    echo Server beendet. Exitcode: %ERRORLEVEL%
    pause
    goto :eof
)

:: Priorität 3: Kein Python gefunden
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
        echo FEHLER beim Herunterladen.
        pause
        exit /b 1
    )
    echo.
    echo Server laeuft auf http://localhost:8080
    echo Browser-Favorit oeffnen oder URL manuell eingeben.
    echo.
    "%PYTHON_LOCAL%" "%DIR%server.py" --no-browser
    echo.
    echo Server beendet. Exitcode: %ERRORLEVEL%
    pause
) else (
    echo.
    echo Bitte Python 3 installieren und start.bat erneut ausfuehren.
    echo https://www.python.org
    echo.
    pause
)

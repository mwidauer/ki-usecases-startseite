@echo off
REM Claude Code Launcher – öffnet ein Terminal und startet claude
REM npm-Pfade zum PATH hinzufügen, damit "claude" gefunden wird
SET "PATH=%APPDATA%\npm;%PATH%"
SET "PATH=%LOCALAPPDATA%\npm;%PATH%"

where wt >nul 2>&1
if %ERRORLEVEL% == 0 (
    wt new-tab --title "Claude Code" cmd /k "claude"
) else (
    start "Claude Code" cmd /k "claude"
)

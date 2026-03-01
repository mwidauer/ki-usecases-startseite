@echo off
REM Claude Code Launcher – öffnet ein Terminal und startet claude
where wt >nul 2>&1
if %ERRORLEVEL% == 0 (
    wt new-tab --title "Claude Code" cmd /k "claude"
) else (
    start "Claude Code" cmd /k "claude"
)

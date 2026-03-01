@echo off
REM localapp-launcher.bat
REM Wrapper: Ruft universal-launcher.ps1 mit dem uebergebenen localapp://-Link auf.
REM Wird vom Windows-Protokoll-Handler aufgerufen.
SET "PS1=%~dp0universal-launcher.ps1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%PS1%" -Url "%1"

# setup/get-python.ps1
# Lädt Python Embeddable Package herunter und entpackt es nach ../python/
# Kein Admin-Recht erforderlich. Einmalig bei Ersteinrichtung aufgerufen.

$ErrorActionPreference = 'Stop'

$PythonVersion = "3.12.8"
$Is64Bit       = [System.Environment]::Is64BitOperatingSystem
$Arch          = if ($Is64Bit) { "amd64" } else { "win32" }
$Url           = "https://www.python.org/ftp/python/$PythonVersion/python-$PythonVersion-embed-$Arch.zip"

$ProjectRoot = Split-Path $PSScriptRoot -Parent
$ZipPath     = Join-Path $ProjectRoot "python-embed.zip"
$PythonDir   = Join-Path $ProjectRoot "python"

try {
    Write-Host ""
    Write-Host "  Python $PythonVersion ($Arch) wird heruntergeladen..." -ForegroundColor Cyan
    Write-Host "  Quelle : $Url" -ForegroundColor Gray
    Write-Host "  Ziel   : $PythonDir" -ForegroundColor Gray
    Write-Host ""

    # Download
    $wc = New-Object System.Net.WebClient
    $wc.DownloadFile($Url, $ZipPath)
    Write-Host "  [OK] Download abgeschlossen" -ForegroundColor Green

    # Entpacken
    Write-Host "  Entpacke..." -ForegroundColor Cyan
    if (Test-Path $PythonDir) { Remove-Item $PythonDir -Recurse -Force }
    Expand-Archive -Path $ZipPath -DestinationPath $PythonDir -Force
    Remove-Item $ZipPath

    Write-Host "  [OK] Python bereit" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "  FEHLER: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }
    exit 1
}

# universal-launcher.ps1
# Wird vom localapp://-Protokoll-Handler aufgerufen.
# Liest apps.json und startet die passende App.

param([string]$Url)

# Hilfsfunktion: Fehlerdialog
function Show-Error([string]$msg) {
    Add-Type -AssemblyName PresentationFramework | Out-Null
    [System.Windows.MessageBox]::Show($msg, "Lokaler App-Launcher", 'OK', 'Error') | Out-Null
}

# PATH um npm-Verzeichnisse erweitern (damit CLI-Tools wie 'claude' gefunden werden)
$env:PATH = "$env:APPDATA\npm;$env:LOCALAPPDATA\npm;$env:PATH"

# localapp://appname  →  appname extrahieren
$appName = ($Url -replace '^localapp:/+', '').Trim('/')

if (-not $appName) {
    Show-Error "Kein App-Name in der URL angegeben.`nErwartet: localapp://app-name"
    exit 1
}

# apps.json laden
$configPath = Join-Path $PSScriptRoot "apps.json"

if (-not (Test-Path $configPath)) {
    Show-Error "Konfigurationsdatei nicht gefunden:`n$configPath`n`nBitte apps.json im launchers-Ordner anlegen."
    exit 1
}

try {
    $apps = Get-Content $configPath -Raw | ConvertFrom-Json
} catch {
    Show-Error "Fehler beim Lesen von apps.json:`n$_"
    exit 1
}

$app = $apps.$appName

if (-not $app) {
    # Alle eingetragenen (nicht mit _ beginnenden) Keys anzeigen
    $available = $apps.PSObject.Properties.Name | Where-Object { -not $_.StartsWith('_') }
    Show-Error "App '$appName' nicht in apps.json eingetragen.`n`nVerfuegbare Apps:`n  - $($available -join "`n  - ")`n`nBitte apps.json im launchers-Ordner ergaenzen."
    exit 1
}

# App starten
switch ($app.type) {

    'terminal' {
        $cmd   = $app.command
        $title = if ($app.title) { $app.title } else { $appName }
        if (Get-Command 'wt' -ErrorAction SilentlyContinue) {
            Start-Process 'wt' -ArgumentList @('new-tab', '--title', $title, 'cmd', '/k', $cmd)
        } else {
            Start-Process 'cmd' -ArgumentList @('/k', $cmd)
        }
    }

    'exe' {
        $exePath = [System.Environment]::ExpandEnvironmentVariables($app.path)
        if (Test-Path $exePath) {
            Start-Process $exePath
        } else {
            Show-Error "Programm nicht gefunden:`n$exePath`n`nBitte den Pfad in apps.json pruefen."
        }
    }

    default {
        Show-Error "Unbekannter App-Typ: '$($app.type)'`nErlaubt: 'exe' oder 'terminal'"
    }
}

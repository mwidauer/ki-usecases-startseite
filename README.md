# KI-Usecases Startseite

Eine lokale Browser-Startseite, die KI-Anwendungsfälle visuell aufbereitet und den schnellen Aufruf passender Tools ermöglicht – direkt als `file://`-URL im Browser, ohne Server oder Build-Tools.

---

## Zweck

Die Startseite dient als persönliches Launchpad für KI-Werkzeuge. Zehn vorkonfigurierte Anwendungsfälle (Recherche, Texterstellung, Automatisierung, Entwicklung u. a.) sind als klickbare Kacheln dargestellt. Ein Klick öffnet ein Auswahlmenü mit den zugehörigen Tools – entweder als direkter Browser-Link (Web-Apps) oder als Start einer lokal installierten Desktop-Anwendung.

Die Konfiguration wird vollständig im Browser (`localStorage`) gespeichert und kann über eine integrierte Wartungsoberfläche angepasst werden.

---

## Features

- **Icon-Kacheln** mit Hover-Effekt und Modal-Tool-Auswahl
- **Web-Tools** öffnen direkt im neuen Tab (NotebookLM, Claude, Perplexity Web, …)
- **Lokale Desktop-Apps** starten per Klick (Comet Browser, Perplexity Desktop, Claude Desktop, …)
- **Wartungsoberfläche** (`settings.html`): Anwendungsfälle und Tools hinzufügen, bearbeiten, sortieren, löschen
- **Export / Import** der Konfiguration als JSON
- **Kein Server** erforderlich – läuft vollständig als `file://`-URL
- **Dark-Mode-Design** mit Cyan/Purple/Mint-Akzenten

---

## Technologie

| Bereich | Technologie |
|---------|-------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Datenspeicher | `localStorage` im Browser |
| Icons | PNG (DALL·E 3), generiert via `generate_icons.py` |
| Lokale Apps | Windows-Protokoll-Handler (`localapp://`) + PowerShell-Launcher |

---

## Ersteinrichtung

### 1. Repository klonen oder herunterladen

```bash
git clone https://github.com/mwidauer/ki-usecases-startseite.git
```

### 2. Startseite öffnen

`index.html` direkt im Browser öffnen (Doppelklick oder Drag & Drop in die Adressleiste).

### 3. Protokoll-Handler installieren *(einmalig, nur Windows)*

Damit lokale Desktop-Apps per Klick gestartet werden können, muss einmalig ein Windows-Protokoll-Handler registriert werden:

→ **Doppelklick auf `launchers/install.bat`**

Das Fenster zeigt den Fortschritt und bleibt offen. Nach erfolgreichem Abschluss (`FERTIG!`) den Browser neu starten.

> Der Handler registriert das Protokoll `localapp://` in der Windows-Registry (HKCU, kein Admin-Recht erforderlich).

### 4. Icons generieren *(optional)*

Eigene Icons mit DALL·E 3 generieren:

```bash
# .env-Datei mit OpenAI-API-Key anlegen:
OPENAI_API_KEY=sk-...

pip install openai python-dotenv
python generate_icons.py
```

Icons werden unter `icons/` gespeichert.

---

## Bedienung

### Startseite

1. Browser-Favorit auf `index.html` setzen
2. **Kachel anklicken** → Modal mit verfügbaren Tools öffnet sich
3. **Web-Tool** anklicken → öffnet in neuem Tab
4. **Lokale App** → „Starten ↗" anklicken → Desktop-App startet

### Einstellungen (`settings.html`)

Erreichbar über das **Zahnrad-Icon** oben rechts auf der Startseite.

- **Anwendungsfall hinzufügen/bearbeiten:** Name, Beschreibung, Icon-Pfad, Tools
- **Tool hinzufügen:** Name eingeben, dann entweder
  - URL eingeben (Web-Tool), oder
  - „Lokale App" ankreuzen → App aus Dropdown wählen
- **Reihenfolge ändern:** ↑ / ↓ Buttons
- **Export:** Konfiguration als JSON-Backup sichern
- **Import:** JSON-Backup wiederherstellen
- **Reset:** Auf Standardkonfiguration zurücksetzen

---

## Lokale Desktop-Apps hinzufügen

Das System unterstützt zwei App-Typen:

| Typ | Beschreibung |
|-----|-------------|
| `exe` | Normale Windows-Desktop-Anwendung (`.exe`-Datei) |
| `appid` | Windows Store / MSIX-App (App-ID aus der Registry) |

### Schritt 1 – Exe-Pfad in `launchers/apps.json` eintragen

```json
{
  "meine-app": {
    "type": "exe",
    "path": "%LOCALAPPDATA%\\Programs\\MeineApp\\MeineApp.exe"
  }
}
```

Umgebungsvariablen wie `%LOCALAPPDATA%` und `%APPDATA%` werden unterstützt.

### Schritt 2 – Anzeigename in `launchers/local-apps.js` eintragen

```js
const LOCAL_APPS = [
  { key: 'meine-app', name: 'Meine App', icon: '🚀' },
  // ... bestehende Einträge
];
```

Der `key` muss in beiden Dateien identisch sein.

### Schritt 3 – App in den Einstellungen zuweisen

1. Einstellungen öffnen → Anwendungsfall bearbeiten
2. „+ Tool hinzufügen"
3. Name eingeben, „Lokale App" ankreuzen
4. App aus dem Dropdown wählen → Speichern

> **Kein Neustart des Protokoll-Handlers erforderlich.** Neue Apps können jederzeit zu `apps.json` und `local-apps.js` hinzugefügt werden.

### Aktuell konfigurierte lokale Apps

| Key | App | Typ |
|-----|-----|-----|
| `claude-desktop` | Claude Desktop | MSIX (Store) |
| `perplexity` | Perplexity | exe |
| `comet` | Comet Browser | exe |

---

## Projektstruktur

```
/
├── index.html                    # Startseite
├── settings.html                 # Wartungsoberfläche
├── app.js                        # Startseiten-Logik
├── settings.js                   # Einstellungs-Logik
├── style.css                     # Stylesheet (Dark Mode)
├── data.json                     # Standard-Konfiguration
├── favicon.svg                   # Browser-Tab-Icon
├── generate_icons.py             # Icon-Generator (DALL·E 3)
├── .env                          # OpenAI API Key (nicht eingecheckt)
├── launchers/
│   ├── local-apps.js             # App-Liste für das Browser-Dropdown
│   ├── apps.json                 # Exe-Pfade für den PowerShell-Launcher
│   ├── universal-launcher.ps1    # Startet Apps anhand von apps.json
│   ├── localapp-launcher.bat     # Wrapper für den Registry-Handler
│   ├── install-protocol-handler.ps1  # Registriert localapp:// (Windows)
│   └── install.bat               # Starter für den Installer (empfohlen)
└── icons/
    ├── icon_01_dokumente.png
    └── ...                       # (nicht eingecheckt, lokal generiert)
```

---

## Hinweise

- `.env` und `icons/` sind in `.gitignore` eingetragen und werden nicht eingecheckt
- Die Konfiguration liegt im `localStorage` des Browsers; `data.json` dient nur als Initialzustand beim ersten Aufruf
- Der `localapp://`-Protokoll-Handler wird nur unter **Windows** benötigt
- Bei einem neuen Rechner: `install.bat` erneut ausführen

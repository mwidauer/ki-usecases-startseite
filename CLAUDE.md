# CLAUDE.md – KI-Usecases Startseite

## Projektziel

Lokale Browser-Startseite, die KI-Anwendungsfälle visuell in den Vordergrund stellt und den schnellen Aufruf passender Tools ermöglicht. Die Seite läuft auf einem lokalen Python-Server und wird über `http://localhost:8080` im Browser geöffnet.

Tools sind entweder **Web-Apps** (direkter URL-Aufruf im Browser) oder **lokale Desktop-Apps** (Windows-Programme, die über einen einmalig installierten Protokoll-Handler gestartet werden). Terminal-Anwendungen (CLI-Tools) sind nicht Teil des Projekts.

---

## Technologie-Stack

- **Frontend:** Reines HTML5 + CSS3 + Vanilla JavaScript (keine Build-Tools, kein Framework)
- **Server:** Python 3 (`http.server` Standardbibliothek) – keine externen Pakete
- **Datenhaltung:** `user-config.json` (via `POST /api/config`), Fallback auf `data.json`
- **Einstiegspunkt:** `start.bat` → startet `server.py` → öffnet Browser auf `http://localhost:8080`
- **Python-Bereitstellung:** System-Python falls vorhanden, sonst eingebettetes Python in `python/` (automatisch heruntergeladen durch `setup/get-python.ps1`)
- **Icons:** PNG-Dateien (1024×1024), generiert mit DALL·E 3, gespeichert unter `./icons/`
- **Icon-Generierung:** Python-Skript (`generate_icons.py`) ruft OpenAI Images API auf
- **Lokale Apps:** `launchers/local-apps.js` (Browser-Liste) + `launchers/apps.json` (Exe-Pfade) + `launchers/universal-launcher.ps1` (Startskript)

---

## Projektstruktur

```
/
├── index.html              # Startseite (Haupteinstieg)
├── settings.html           # Wartungsoberfläche
├── app.js                  # Hauptlogik (Laden via /api/config, Rendern, Navigation)
├── settings.js             # Logik der Wartungsoberfläche (async fetch)
├── style.css               # Gemeinsames Stylesheet
├── server.py               # HTTP-Server: statische Dateien + GET/POST /api/config
├── start.bat               # Starter: prüft Python, lädt es ggf. herunter, startet server.py
├── data.json               # Standard-Konfiguration (Vorlage beim ersten Start)
├── user-config.json        # Persönliche Konfiguration (nicht eingecheckt, von server.py geschrieben)
├── generate_icons.py       # Icon-Generator (DALL·E 3)
├── favicon.svg             # Browser-Tab-Icon
├── .env                    # OPENAI_API_KEY (nicht einchecken)
├── .gitignore
├── setup/
│   └── get-python.ps1      # Lädt Python Embeddable Package (~10 MB) nach python/ herunter
├── python/                 # Eingebettetes Python (nicht eingecheckt, automatisch heruntergeladen)
├── icons/
│   ├── icon_01_dokumente.png
│   └── ... (bis icon_10_praesentation.png)
└── launchers/
    ├── local-apps.js           # Browser-Liste der lokalen Apps (als <script> geladen)
    ├── apps.json               # Exe-Pfade für den PowerShell-Launcher
    ├── universal-launcher.ps1  # Startet lokale Apps anhand von apps.json
    ├── localapp-launcher.bat   # Wrapper: ruft universal-launcher.ps1 auf
    ├── install-protocol-handler.ps1  # Registriert localapp:// in der Windows-Registry
    └── install.bat             # Starter für den Protokoll-Handler-Installer
```

---

## Server (`server.py`)

### Endpunkte

| Methode | Pfad | Funktion |
|---------|------|----------|
| `GET` | `/api/config` | Liefert `user-config.json` (falls vorhanden), sonst `data.json` |
| `POST` | `/api/config` | Speichert Body als `user-config.json` (JSON-Validierung vorab) |
| `GET` | `/*` | Statische Dateien (SimpleHTTPRequestHandler) |

### Python-Priorität beim Start

1. `python/python.exe` (eingebettetes Python, falls vorhanden)
2. System-Python (`python` im PATH)
3. Angebot: eingebettetes Python automatisch herunterladen via `setup/get-python.ps1`

---

## Startseite (`index.html`)

### Layout
- Dunkler Hintergrund (passend zum Icon-Stil: Deep Navy)
- Große Icon-Kacheln im Grid-Layout (3–4 Spalten, responsive)
- Jede Kachel zeigt: Icon + Name des Anwendungsfalls
- Hover-Effekt: kurze Beschreibung + verfügbare Tools einblenden
- Klick auf Kachel → öffnet Tool-Auswahl (Modal)

### Tool-Auswahl im Modal
- **Web-Tools:** Name + Favicon + direkter Link (öffnet in neuem Tab)
- **Lokale Apps:** Name + Emoji-Icon + „Starten"-Button → startet via `localapp://` Protokoll

### Fehlerbehandlung
- Wenn `/api/config` nicht erreichbar: Fehlermeldung im Grid mit Hinweis auf `start.bat`

### Navigation
- Oben rechts: Zahnrad-Icon → Link zu `settings.html`

---

## Wartungsoberfläche (`settings.html`)

### Funktionen
- **Anwendungsfälle verwalten:** Hinzufügen, umbenennen, löschen, Reihenfolge ändern
- **Tools verwalten:** Pro Anwendungsfall Tools hinzufügen, entfernen
  - **Web-Tool:** Name + URL eingeben
  - **Lokale App:** Checkbox „Lokale App" aktivieren → Dropdown mit verfügbaren Desktop-Apps (aus `LOCAL_APPS`)
- **Icon zuweisen:** Pfad zu einer PNG-Datei unter `./icons/` eintragen
- **Speichern:** `POST /api/config` mit aktuellem config-Objekt
- **Export/Import:** Konfiguration als JSON exportieren/importieren (Backup)
- **Reset:** Auf Standard-Konfiguration zurücksetzen (schreibt DEFAULT_DATA via POST)

### Zugang
- Link auf der Startseite: Zahnrad-Icon oben rechts → `settings.html`

---

## Lokale Desktop-Apps

### Konzept

| Typ | Merkmal | Beispiel |
|-----|---------|---------|
| Web-Tool | URL (https://...) | NotebookLM, Claude, Perplexity Web |
| Lokale App | `"local": true` + URL `localapp://key` | Perplexity Desktop, Claude Desktop, Comet |

### Zwei-Datei-Prinzip

| Datei | Geladen von | Inhalt |
|-------|-------------|--------|
| `launchers/local-apps.js` | Browser (als `<script>`-Tag) | Name, Key, Emoji-Icon aller Apps |
| `launchers/apps.json` | PowerShell-Launcher | Exe-Pfade und App-IDs |

Beide Dateien synchron halten wenn eine neue App hinzugefügt wird.

### Unterstützte App-Typen in `apps.json`

- `"type": "exe"` – direkter Start einer `.exe`-Datei; `%APPDATA%`, `%LOCALAPPDATA%` etc. werden expandiert
- `"type": "appid"` – Start einer Windows Store/MSIX-App über AppUserModelId

### Protokoll-Handler (`localapp://`)

Ablauf: `Browser → localapp://key → Windows-Registry → localapp-launcher.bat → universal-launcher.ps1 → App`

Einmalig installieren: **Doppelklick auf `launchers/install.bat`**

### Neue App hinzufügen

1. Exe-Pfad/AppId herausfinden
2. Eintrag in `launchers/apps.json` ergänzen
3. Eintrag in `launchers/local-apps.js` ergänzen (key, name, icon)
4. In den Einstellungen: Tool hinzufügen → „Lokale App" → App aus Dropdown wählen

---

## Anwendungsfälle und Tools

| # | Anwendungsfall | KI-Tool |
|---|---------------|---------|
| 1 | Dokumenten-Recherche & Lernen | NotebookLM |
| 2 | Web-Recherche & Daten-Scraping | Perplexity |
| 3 | Texterstellung & Automatisierung | Claude |
| 4 | Prozess-Automatisierung | n8n |
| 5 | Prototyping & MVPs (ohne Code) | Google AI Studio |
| 6 | App-Entwicklung & Programmierung | Cursor |
| 7 | Lokale Corporate LLMs (Datenschutz) | Ollama |
| 8 | Voice AI & KI-Sprachagenten | ElevenLabs |
| 9 | Videogenerierung & Werbefilme | Google Flow (Veo) |
| 10 | Präsentationserstellung | Gamma |

---

## Icon-Generierung

### DALL·E 3 Stil

> Isometric dark mode illustration. Deep navy background. Small 3D human figures
> with oversized tech objects. Neon accents: cyan, purple, mint green with soft glow.
> Dark slate objects with bright highlights. No text. Consistent style across all icons.

### Icon-Generator (`generate_icons.py`)

- Liest `OPENAI_API_KEY` aus `.env`
- Ruft OpenAI Images API auf: Modell `dall-e-3`, Size `1024x1024`, Quality `standard`
- Speichert Bilder als `icons/icon_NN_name.png`

---

## Design-Richtlinien

| Eigenschaft | Wert |
|------------|------|
| Hintergrundfarbe | `#0a0f1e` (Deep Navy) |
| Akzentfarben | Cyan `#00d4ff`, Purple `#8b5cf6`, Mint `#10d9a0` |
| Schriftart | System-Font oder `Inter` |
| Kachel-Größe | 180×180px (Desktop), responsive |
| Kachel-Stil | Abgerundete Ecken, leichter Glow-Effekt |
| Hover | Sanfte Vergrößerung + Tool-Namen einblenden |

---

## Wichtige Hinweise

- `.env` enthält den OpenAI API Key → **nicht in Git einchecken**
- `user-config.json` enthält persönliche Konfiguration → in `.gitignore` für `main`, im `personal`-Branch committen
- `python/` enthält eingebettetes Python → immer in `.gitignore`, automatisch heruntergeladen
- Alle externen Tool-Links öffnen in `target="_blank"`
- Der `localapp://`-Protokoll-Handler muss **einmalig pro Rechner** installiert werden
- Terminal-Apps (CLI-Tools) werden **nicht unterstützt** – nur Desktop-Apps mit GUI
- Wenn eine neue lokale App hinzugefügt wird: **beide Dateien aktualisieren** (`apps.json` UND `local-apps.js`)

# CLAUDE.md – KI-Usecases Startseite

## Projektziel

Lokale Browser-Startseite, die KI-Anwendungsfälle visuell in den Vordergrund stellt und den schnellen Aufruf passender Tools ermöglicht. Die Seite läuft vollständig lokal (kein Server erforderlich) und wird über einen Browser-Favoriten geöffnet.

Tools sind entweder **Web-Apps** (direkter URL-Aufruf im Browser) oder **lokale Desktop-Apps** (Windows-Programme, die über einen einmalig installierten Protokoll-Handler gestartet werden).

---

## Technologie-Stack

- **Frontend:** Reines HTML5 + CSS3 + Vanilla JavaScript (keine Build-Tools, kein Framework)
- **Datenhaltung:** `localStorage` für Konfiguration (Anwendungsfälle, Tools, Links)
- **Einstiegspunkt:** `index.html` – direkt als `file://`-URL im Browser öffnen
- **Icons:** PNG-Dateien (1024×1024), generiert mit DALL·E 3, gespeichert unter `./icons/`
- **Icon-Generierung:** Python-Skript (`generate_icons.py`) ruft OpenAI Images API auf
- **Konfiguration:** `.env`-Datei mit `OPENAI_API_KEY`
- **Lokale Apps:** `launchers/local-apps.js` (Browser-Liste) + `launchers/apps.json` (Exe-Pfade) + `launchers/universal-launcher.ps1` (Startskript)

---

## Projektstruktur

```
/
├── index.html              # Startseite (Haupteinstieg)
├── settings.html           # Wartungsoberfläche
├── app.js                  # Hauptlogik (Laden, Rendern, Navigation)
├── settings.js             # Logik der Wartungsoberfläche
├── style.css               # Gemeinsames Stylesheet
├── data.json               # Standard-Konfiguration (Anwendungsfälle + Tools)
├── generate_icons.py       # Icon-Generator (DALL·E 3)
├── favicon.svg             # Browser-Tab-Icon
├── .env                    # OPENAI_API_KEY (nicht einchecken)
├── .gitignore
├── icons/
│   ├── icon_01_dokumente.png
│   └── ... (bis icon_10_praesentation.png)
└── launchers/
    ├── local-apps.js           # Browser-Liste der lokalen Apps (als <script> geladen)
    ├── apps.json               # Exe-Pfade für den PowerShell-Launcher
    ├── universal-launcher.ps1  # Startet lokale Apps anhand von apps.json
    ├── localapp-launcher.bat   # Wrapper: ruft universal-launcher.ps1 auf
    └── install-protocol-handler.ps1  # Registriert localapp:// in der Windows-Registry (einmalig)
```

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
- **Lokale Apps:** Name + Desktop-Icon (💻) + „Starten"-Button → startet das Programm via `localapp://` Protokoll

### Navigation
- Oben rechts: Zahnrad-Icon → Link zu `settings.html` ("Einstellungen")

---

## Wartungsoberfläche (`settings.html`)

### Funktionen
- **Anwendungsfälle verwalten:** Hinzufügen, umbenennen, löschen, Reihenfolge ändern
- **Tools verwalten:** Pro Anwendungsfall Tools hinzufügen, entfernen
  - **Web-Tool:** Name + URL eingeben
  - **Lokale App:** Checkbox „Lokale App" aktivieren → Dropdown mit verfügbaren Desktop-Apps erscheint
- **Icon zuweisen:** Pfad zu einer PNG-Datei unter `./icons/` eintragen
- **Speichern:** Konfiguration in `localStorage` persistieren
- **Export/Import:** Konfiguration als JSON exportieren/importieren (Backup)
- **Reset:** Auf Standard-Konfiguration zurücksetzen

### Zugang
- Link auf der Startseite: Zahnrad-Icon oben rechts → `settings.html`

---

## Lokale Desktop-Apps

### Konzept

Das System unterscheidet zwei Tool-Typen:

| Typ | Merkmal | Beispiel |
|-----|---------|---------|
| Web-Tool | URL (https://...) | NotebookLM, Claude, Perplexity Web |
| Lokale App | `"local": true` + URL `localapp://key` | Perplexity Desktop, Claude Desktop, Comet |

Terminal-Anwendungen (CLI-Tools) sind **nicht Teil des Projekts**.

### Zwei-Datei-Prinzip

**Problem:** Browser-`file://`-Seiten können keine lokalen Dateien per `fetch()` laden.

**Lösung:** Zwei getrennte Dateien mit unterschiedlichen Rollen:

| Datei | Geladen von | Inhalt |
|-------|-------------|--------|
| `launchers/local-apps.js` | Browser (als `<script>`-Tag) | Name, Key, Emoji-Icon aller Apps – für das Dropdown in den Einstellungen |
| `launchers/apps.json` | PowerShell-Launcher | Exe-Pfade und App-IDs – für den tatsächlichen Start |

Beide Dateien müssen synchron gehalten werden, wenn eine neue App hinzugefügt wird.

### `launchers/local-apps.js` (Browser-Liste)

```javascript
// Globale Variable – wird von index.html und settings.html als <script> geladen
const LOCAL_APPS = [
  { key: 'claude-desktop', name: 'Claude Desktop', icon: '🤖' },
  { key: 'perplexity',     name: 'Perplexity',      icon: '🔍' },
  { key: 'comet',          name: 'Comet Browser',   icon: '🌐' }
];
```

### `launchers/apps.json` (Exe-Pfade für Launcher)

```json
{
  "claude-desktop": {
    "type": "appid",
    "appid": "Claude_pzs8sxrjxfjjc!Claude"
  },
  "perplexity": {
    "type": "exe",
    "path": "%LOCALAPPDATA%\\Programs\\Perplexity\\Perplexity.exe"
  },
  "comet": {
    "type": "exe",
    "path": "%LOCALAPPDATA%\\Perplexity\\Comet\\Application\\comet.exe"
  }
}
```

Unterstützte Typen in `apps.json`:
- `"type": "exe"` – direkter Start einer `.exe`-Datei; `%APPDATA%`, `%LOCALAPPDATA%` etc. werden expandiert
- `"type": "appid"` – Start einer Windows Store/MSIX-App über ihre AppUserModelId

### Protokoll-Handler (`localapp://`)

- Einmalig auf dem Rechner zu installieren: **Rechtsklick auf `launchers/install-protocol-handler.ps1` → „Mit PowerShell ausführen"**
- Registriert den Schlüssel `HKCU\SOFTWARE\Classes\localapp` (kein Admin-Recht nötig)
- Der Handler ruft `localapp-launcher.bat` auf, das `universal-launcher.ps1 -Url "%1"` aufruft
- `universal-launcher.ps1` liest `apps.json`, findet den passenden Eintrag und startet die App

### Ablauf: Klick auf lokale App

```
Browser (index.html)
  → Klick auf "Starten" (a href="localapp://perplexity")
  → Windows-Registry: localapp:// → localapp-launcher.bat
  → localapp-launcher.bat → powershell.exe universal-launcher.ps1 -Url "localapp://perplexity"
  → universal-launcher.ps1 → liest apps.json → Start-Process Perplexity.exe
```

### Neue App hinzufügen (Workflow)

1. Exe-Pfad herausfinden (z. B. per Windows Explorer oder Suchbefehl)
2. Eintrag in `launchers/apps.json` ergänzen
3. Eintrag in `launchers/local-apps.js` ergänzen (key, name, icon)
4. In den Einstellungen der Startseite: Tool hinzufügen → „Lokale App" ankreuzen → App aus Dropdown wählen

---

## Anwendungsfälle und Tools

### Übersicht

| # | Anwendungsfall | KI-Tool | DALL·E Prompt-Begriff |
|---|---------------|---------|----------------------|
| 1 | Tiefe Dokumenten-Recherche & Lernen | NotebookLM | deep document research and learning |
| 2 | Web-Recherche & Daten-Scraping | Perplexity (Comet) | web research and data scraping |
| 3 | Texterstellung & Schnittstellen-Automatisierung | Claude | text creation and workflow automation |
| 4 | Prozess-Automatisierung | n8n | process automation workflow |
| 5 | Prototyping & MVPs (ohne Code) | Google AI Studio | rapid prototyping no code |
| 6 | App-Entwicklung & Programmierung | Cursor | app development and programming |
| 7 | Lokale Corporate LLMs (Datenschutz) | Ollama | local private AI data protection |
| 8 | Voice AI & KI-Sprachagenten | ElevenLabs | voice AI speech agent |
| 9 | Videogenerierung & Werbefilme | Google Flow (mit Veo) | video generation advertising |
| 10 | Präsentationserstellung | Gamma (gamma.app) | AI presentation creation |

### Tool-Objekt-Format in `data.json`

```json
// Web-Tool:
{ "name": "NotebookLM", "url": "https://notebooklm.google.com" }

// Lokale App:
{ "name": "Perplexity Desktop", "url": "localapp://perplexity", "local": true }
```

---

## Icon-Generierung

### DALL·E 3 Stil (für alle Icons einheitlich)

> Isometric dark mode illustration. Deep navy background. Small 3D human figures
> with oversized tech objects. Neon accents: cyan, purple, mint green with soft glow.
> Dark slate objects with bright highlights. No text. Consistent style across all icons.

### DALL·E 3 Prompts (alle 10 Anwendungsfälle)

```
icon_01 – Dokumenten-Recherche & Lernen:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
reading oversized glowing documents and PDFs with magnifying glass. Neon accents:
cyan, purple, mint green with soft glow. Dark slate objects with bright highlights.
No text.

icon_02 – Web-Recherche & Daten-Scraping:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
navigating oversized web browser windows with data flowing into a structured table.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.

icon_03 – Texterstellung & Automatisierung:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
operating oversized keyboard with automated workflow gears and text streams.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.

icon_04 – Prozess-Automatisierung:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
connecting oversized automation nodes in a flowing pipeline with robotic arms.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.

icon_05 – Prototyping & MVPs:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
assembling oversized app wireframe blocks and UI components like building bricks.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.

icon_06 – App-Entwicklung & Programmierung:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
beside oversized monitor with code lines and AI robot co-pilot writing code.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.

icon_07 – Lokale Corporate LLMs:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
standing inside a secure server vault with a brain and shield icon on local server.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.

icon_08 – Voice AI & KI-Sprachagenten:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
speaking into an oversized microphone with AI waveforms and phone agent headset.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.

icon_09 – Videogenerierung & Werbefilme:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
directing an oversized cinematic camera with AI-generated film frames floating
around. Neon accents: cyan, purple, mint green with soft glow. Dark slate objects
with bright highlights. No text.

icon_10 – Präsentationserstellung:
Isometric dark mode illustration. Deep navy background. Small 3D human figure
presenting oversized glowing slides with charts auto-assembling from notes and
data. Neon accents: cyan, purple, mint green with soft glow. Dark slate objects
with bright highlights. No text.
```

### Icon-Generator (`generate_icons.py`)

- Liest `OPENAI_API_KEY` aus `.env`
- Generiert für jeden Anwendungsfall einen DALL·E-3-Prompt
- Ruft OpenAI Images API auf: Modell `dall-e-3`, Size `1024x1024`, Quality `standard`
- Speichert Bilder als `icons/icon_NN_name.png`

---

## Design-Richtlinien

| Eigenschaft | Wert |
|------------|------|
| Hintergrundfarbe | `#0a0f1e` (Deep Navy) |
| Akzentfarben | Cyan `#00d4ff`, Purple `#8b5cf6`, Mint `#10d9a0` |
| Schriftart | System-Font oder `Inter` (Google Fonts) |
| Kachel-Größe | 180×180px (Desktop), responsive kleinere Breakpoints |
| Kachel-Stil | Abgerundete Ecken, leichter Glow-Effekt |
| Hover | Sanfte Vergrößerung + Tool-Namen einblenden |
| Lokale App (Modal) | Lila Akzent (`--purple`), Badge „Starten ↗" |

---

## Implementierungsreihenfolge

1. **`data.json`** – Aus CLAUDE.md übernehmen (alle 10 Anwendungsfälle)
2. **`generate_icons.py`** – Icon-Generator erstellen und alle Icons generieren
3. **`style.css`** – Gemeinsames Stylesheet mit Dark-Mode-Design
4. **`index.html` + `app.js`** – Startseite mit Kacheln und Tool-Modal
5. **`settings.html` + `settings.js`** – Wartungsoberfläche
6. **`launchers/local-apps.js`** – Browser-Liste der lokalen Apps
7. **`launchers/apps.json`** – Exe-Pfade (manuell oder per Skript ermittelt)
8. **`launchers/universal-launcher.ps1`** + **`localapp-launcher.bat`** – Launcher-Skripte
9. **`launchers/install-protocol-handler.ps1`** – Protokoll-Handler registrieren (einmalig)
10. **Testing** – Öffnen als `file://`, Favorit im Browser anlegen

---

## Wichtige Hinweise

- `.env` enthält den OpenAI API Key → **nicht in Git einchecken** (in `.gitignore`)
- `icons/` wird ebenfalls nicht eingecheckt (groß, generiert)
- Die Seite funktioniert als `file://`-URL ohne lokalen Webserver
- `localStorage` wird als Datenspeicher genutzt; `data.json` ist nur der Initialzustand
- Alle externen Tool-Links öffnen in `target="_blank"`
- Der `localapp://`-Protokoll-Handler muss **einmalig pro Rechner** installiert werden
- Terminal-Apps (CLI-Tools) werden **nicht unterstützt** – nur Desktop-Apps mit GUI
- Wenn eine neue lokale App hinzugefügt wird: **beide Dateien aktualisieren** (`apps.json` UND `local-apps.js`)

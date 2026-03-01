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
- **Lokale Desktop-Apps** starten per Klick (beliebige Windows-Apps konfigurierbar)
- **Wartungsoberfläche** (`settings.html`): Anwendungsfälle und Tools hinzufügen, bearbeiten, sortieren, löschen
- **Export / Import** der Konfiguration als JSON
- **Kein Server** erforderlich – läuft vollständig als `file://`-URL
- **Dark-Mode-Design** mit Cyan/Purple/Mint-Akzenten

---

## Technologie

| Bereich | Technologie |
|---------|-------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Datenspeicher | `user-config.json` (via lokalem Python-Server) |
| Server | Python 3 Standardbibliothek (`http.server`), keine externen Pakete |
| Icons | PNG (DALL·E 3), generiert via `generate_icons.py` |
| Lokale Apps | Windows-Protokoll-Handler (`localapp://`) + PowerShell-Launcher |

---

## Ersteinrichtung

### 1. Repository klonen oder herunterladen

```bash
git clone https://github.com/mwidauer/ki-usecases-startseite.git
```

### 2. Server starten

→ **Doppelklick auf `start.bat`**

Der Server startet auf `http://localhost:8080`. Danach Browser-Favorit öffnen oder URL manuell eingeben.

**Python wird automatisch bereitgestellt** – keine manuelle Installation nötig:
- Falls Python bereits installiert ist, wird es direkt verwendet
- Falls nicht, bietet `start.bat` an, ein eingebettetes Python (~10 MB) automatisch herunterzuladen

> Die Konfiguration wird als `user-config.json` im Projektordner gespeichert.
> Beim ersten Start wird `data.json` als Vorlage verwendet.

### 3. Autostart einrichten *(empfohlen)*

Damit der Server bei jedem Windows-Login automatisch und unsichtbar im Hintergrund startet:

→ **Doppelklick auf `setup/install-autostart.bat`**

Ab dem nächsten Login läuft der Server automatisch – einfach den Browser-Favoriten `http://localhost:8080` anklicken.

> Der Autostart-Eintrag wird unter `shell:startup` angelegt (kein Admin-Recht erforderlich).
> Zum Entfernen: `Win+R` → `shell:startup` → `KI-Usecases-Server.vbs` löschen.

### 4. Protokoll-Handler installieren *(einmalig, nur Windows)*

Damit lokale Desktop-Apps per Klick gestartet werden können, muss einmalig ein Windows-Protokoll-Handler registriert werden:

→ **Doppelklick auf `launchers/install.bat`**

Das Fenster zeigt den Fortschritt und bleibt offen. Nach erfolgreichem Abschluss (`FERTIG!`) den Browser neu starten.

> Der Handler registriert das Protokoll `localapp://` in der Windows-Registry (HKCU, kein Admin-Recht erforderlich).

### 4. Icons generieren *(optional)*

Die Icons sind bereits im Repository enthalten. Wer eigene Icons generieren möchte:

```bash
# .env-Datei mit OpenAI-API-Key anlegen:
OPENAI_API_KEY=sk-...

pip install openai python-dotenv
python generate_icons.py
```

Icons werden unter `icons/` gespeichert und überschreiben die vorhandenen Dateien.

---

## Bedienung

### Startseite

1. `start.bat` ausführen → Browser öffnet automatisch
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

### Schritt 1 – Eintrag in `launchers/apps.json`

```json
{
  "meine-app": {
    "type": "exe",
    "path": "%LOCALAPPDATA%\\Programs\\MeineApp\\MeineApp.exe"
  },
  "meine-store-app": {
    "type": "appid",
    "appid": "PublisherName.AppName_hash!App"
  }
}
```

Umgebungsvariablen wie `%LOCALAPPDATA%` und `%APPDATA%` werden unterstützt.

### Schritt 2 – Anzeigename in `launchers/local-apps.js`

```js
const LOCAL_APPS = [
  { key: 'meine-app', name: 'Meine App', icon: '🚀' },
];
```

Der `key` muss in beiden Dateien identisch sein.

### Schritt 3 – App in den Einstellungen zuweisen

1. Einstellungen öffnen → Anwendungsfall bearbeiten
2. „+ Tool hinzufügen"
3. Name eingeben, „Lokale App" ankreuzen
4. App aus dem Dropdown wählen → Speichern

> **Kein Neustart des Protokoll-Handlers erforderlich.** Neue Apps können jederzeit zu `apps.json` und `local-apps.js` hinzugefügt werden.

---

## Icons

### Enthaltene Icons

Das Repository enthält zehn fertige Icons im Stil „Isometric Dark Mode" (DALL·E 3, 1024×1024 px).

### Eigene Icons mit DALL·E 3 generieren

Der einheitliche Stil für alle Icons:

> Isometric dark mode illustration. Deep navy background. Small 3D human figures with oversized tech objects. Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with bright highlights. No text. Consistent style across all icons.

### DALL·E 3 Prompts – alle 10 Anwendungsfälle

**icon_01 – Dokumenten-Recherche & Lernen**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
reading oversized glowing documents and PDFs with magnifying glass. Neon accents:
cyan, purple, mint green with soft glow. Dark slate objects with bright highlights.
No text.
```

**icon_02 – Web-Recherche & Daten-Scraping**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
navigating oversized web browser windows with data flowing into a structured table.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.
```

**icon_03 – Texterstellung & Automatisierung**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
operating oversized keyboard with automated workflow gears and text streams.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.
```

**icon_04 – Prozess-Automatisierung**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
connecting oversized automation nodes in a flowing pipeline with robotic arms.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.
```

**icon_05 – Prototyping & MVPs**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
assembling oversized app wireframe blocks and UI components like building bricks.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.
```

**icon_06 – App-Entwicklung & Programmierung**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
beside oversized monitor with code lines and AI robot co-pilot writing code.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.
```

**icon_07 – Lokale Corporate LLMs**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
standing inside a secure server vault with a brain and shield icon on local server.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.
```

**icon_08 – Voice AI & KI-Sprachagenten**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
speaking into an oversized microphone with AI waveforms and phone agent headset.
Neon accents: cyan, purple, mint green with soft glow. Dark slate objects with
bright highlights. No text.
```

**icon_09 – Videogenerierung & Werbefilme**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
directing an oversized cinematic camera with AI-generated film frames floating
around. Neon accents: cyan, purple, mint green with soft glow. Dark slate objects
with bright highlights. No text.
```

**icon_10 – Präsentationserstellung**
```
Isometric dark mode illustration. Deep navy background. Small 3D human figure
presenting oversized glowing slides with charts auto-assembling from notes and
data. Neon accents: cyan, purple, mint green with soft glow. Dark slate objects
with bright highlights. No text.
```

---

## Projektstruktur

```
/
├── index.html                    # Startseite
├── settings.html                 # Wartungsoberfläche
├── app.js                        # Startseiten-Logik
├── settings.js                   # Einstellungs-Logik
├── style.css                     # Stylesheet (Dark Mode)
├── server.py                     # Lokaler HTTP-Server (Konfiguration lesen/schreiben)
├── start.bat                     # Server starten (Doppelklick, lädt Python falls nötig)
├── data.json                     # Standard-Konfiguration (Vorlage)
├── user-config.json              # Persönliche Konfiguration (nicht eingecheckt)
├── setup/
│   └── get-python.ps1            # Lädt eingebettetes Python herunter (von start.bat aufgerufen)
├── python/                       # Eingebettetes Python (nicht eingecheckt, auto-heruntergeladen)
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
    └── ...
```

---

## Hinweise

- `.env`, `user-config.json` und `python/` sind in `.gitignore` und werden nicht eingecheckt
- `user-config.json` enthält die persönliche Konfiguration; `data.json` ist die Vorlage beim ersten Start
- `python/` wird automatisch durch `start.bat` heruntergeladen wenn kein System-Python gefunden wird
- Der `localapp://`-Protokoll-Handler wird nur unter **Windows** benötigt
- Bei einem neuen Rechner: `launchers/install.bat` und `start.bat` einmalig ausführen

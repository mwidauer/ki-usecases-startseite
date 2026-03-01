# CLAUDE.md – KI-Usecases Startseite

## Projektziel

Lokale Browser-Startseite, die KI-Anwendungsfälle visuell in den Vordergrund stellt und den schnellen Aufruf passender Tools ermöglicht. Die Seite läuft vollständig lokal (kein Server erforderlich) und wird über einen Browser-Favoriten geöffnet.

---

## Technologie-Stack

- **Frontend:** Reines HTML5 + CSS3 + Vanilla JavaScript (keine Build-Tools, kein Framework)
- **Datenhaltung:** `localStorage` für Konfiguration (Anwendungsfälle, Tools, Links)
- **Einstiegspunkt:** `index.html` – direkt als `file://`-URL im Browser öffnen
- **Icons:** PNG-Dateien (1024×1024), generiert mit DALL·E 3, gespeichert unter `./icons/`
- **Icon-Generierung:** Python-Skript (`generate_icons.py`) ruft OpenAI Images API auf
- **Konfiguration:** `.env`-Datei mit `OPENAI_API_KEY`

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
├── .env                    # OPENAI_API_KEY (nicht einchecken)
├── .gitignore
└── icons/
    ├── icon_01.png
    ├── icon_02.png
    └── ... (bis icon_10.png)
```

---

## Startseite (`index.html`)

### Layout
- Dunkler Hintergrund (passend zum Icon-Stil: Deep Navy)
- Große Icon-Kacheln im Grid-Layout (3–4 Spalten, responsive)
- Jede Kachel zeigt: Icon + Name des Anwendungsfalls
- Hover-Effekt: kurze Beschreibung + verfügbare Tools einblenden
- Klick auf Kachel → öffnet Tool-Auswahl (Modal oder Submenu)

### Tool-Auswahl
- Klick auf einen Anwendungsfall → Modal mit allen verknüpften Tools
- Jedes Tool: Name + Icon (Favicon) + direkter Link (öffnet in neuem Tab)

### Navigation
- Oben rechts: Zahnrad-Icon → Link zu `settings.html` ("Einstellungen")

---

## Wartungsoberfläche (`settings.html`)

### Funktionen
- **Anwendungsfälle verwalten:** Hinzufügen, umbenennen, löschen, Reihenfolge ändern
- **Tools verwalten:** Pro Anwendungsfall Tools hinzufügen (Name + URL), entfernen
- **Icon zuweisen:** Upload eigener Icons oder Auswahl aus vorhandenen `./icons/`-Dateien
- **Speichern:** Konfiguration in `localStorage` persistieren
- **Export/Import:** Konfiguration als JSON exportieren/importieren (Backup)

### Zugang
- Link auf der Startseite: Zahnrad-Icon oben rechts → `settings.html`

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

### Vollständige `data.json` Struktur

```json
{
  "usecases": [
    {
      "id": 1,
      "name": "Dokumenten-Recherche & Lernen",
      "icon": "icons/icon_01.png",
      "description": "Analyse von Branchenreports und PDFs, Mustererkennung in Call-Transkripten, Zusammenfassen von Podcasts/Videos zu Audio-Overviews, quellenbasiertes Arbeiten ohne Halluzinationen",
      "tools": [
        { "name": "NotebookLM", "url": "https://notebooklm.google.com" }
      ]
    },
    {
      "id": 2,
      "name": "Web-Recherche & Daten-Scraping",
      "icon": "icons/icon_02.png",
      "description": "Schnelle Faktenprüfung im Web, Zusammenfassen von Webseiten via Browser-Assistent, Firmen recherchieren sowie Kontaktdaten scrapen und strukturiert in Tabellen aufbereiten",
      "tools": [
        { "name": "Perplexity", "url": "https://www.perplexity.ai" }
      ]
    },
    {
      "id": 3,
      "name": "Texterstellung & Automatisierung",
      "icon": "icons/icon_03.png",
      "description": "Schreiben natürlicher Texte, Erstellen spezialisierter Workflows (\"Skills\") für Textprüfungen, automatische Datenbank- und CRM-Anbindung via Model Context Protocol (MCP) und On-the-fly-Code-Generierung",
      "tools": [
        { "name": "Claude", "url": "https://claude.ai" }
      ]
    },
    {
      "id": 4,
      "name": "Prozess-Automatisierung",
      "icon": "icons/icon_04.png",
      "description": "Lokale und quelloffene Automatisierung von Workflows, z. B. CRM-Updates, Leadgenerierung, Datenanreicherung, Social Media Automatisierung, Onboarding-Prozesse und Belegerkennung",
      "tools": [
        { "name": "n8n", "url": "https://n8n.io" }
      ]
    },
    {
      "id": 5,
      "name": "Prototyping & MVPs (ohne Code)",
      "icon": "icons/icon_05.png",
      "description": "Schnelles visuelles Testen und Bauen von App-Prototypen (z. B. für Projektmanagement) in einer Sandbox, Erstellung von Frontends zur Kundenpräsentation ohne Programmierkenntnisse",
      "tools": [
        { "name": "Google AI Studio", "url": "https://aistudio.google.com" }
      ]
    },
    {
      "id": 6,
      "name": "App-Entwicklung & Programmierung",
      "icon": "icons/icon_06.png",
      "description": "Aus Prototypen voll funktionsfähige Apps bauen, automatisiertes Coden und Bug-Fixing durch KI-Agenten (\"Agent Mode\"), ohne selbst Code schreiben zu müssen",
      "tools": [
        { "name": "Cursor", "url": "https://www.cursor.com" }
      ]
    },
    {
      "id": 7,
      "name": "Lokale Corporate LLMs (Datenschutz)",
      "icon": "icons/icon_07.png",
      "description": "Aufbau von KI-Systemen für internes Firmenwissen, lokale und komplett DSGVO-konforme Verarbeitung sensibler Daten (z. B. Patienten- oder Finanzdaten) auf eigenen Servern",
      "tools": [
        { "name": "Ollama", "url": "https://ollama.com" }
      ]
    },
    {
      "id": 8,
      "name": "Voice AI & KI-Sprachagenten",
      "icon": "icons/icon_08.png",
      "description": "Vertonung von Videos mit mehreren Sprechern und Soundeffekten (\"Voiceover Studio\"), Erstellung natürlich klingender KI-Telefon-Agenten für z. B. Rezeptionen, Outbound-Sales, Leads-Generierung oder Terminverwaltung",
      "tools": [
        { "name": "ElevenLabs", "url": "https://elevenlabs.io" }
      ]
    },
    {
      "id": 9,
      "name": "Videogenerierung & Werbefilme",
      "icon": "icons/icon_09.png",
      "description": "Erstellung von cinematischen Clips, Werbespots und Erklärvideos aus einfachen Storyboards oder Fotos, Sicherstellung von Charakter- und Produktkonsistenz über mehrere Szenen hinweg",
      "tools": [
        { "name": "Google Flow (Veo)", "url": "https://flow.google" }
      ]
    },
    {
      "id": 10,
      "name": "Präsentationserstellung",
      "icon": "icons/icon_10.png",
      "description": "Automatische Generierung von Pitch-Decks, Exposés oder Marketingunterlagen aus Notizen, Reports oder Meeting-Transkripten inklusive visuellem Design in wenigen Minuten",
      "tools": [
        { "name": "Gamma", "url": "https://gamma.app" }
      ]
    }
  ]
}
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
- Liest alle Anwendungsfälle aus `data.json`
- Generiert für jeden Anwendungsfall einen DALL·E-3-Prompt
- Ruft OpenAI Images API auf: Modell `dall-e-3`, Size `1024x1024`, Quality `standard`
- Speichert Bilder als `icons/icon_01.png` bis `icons/icon_10.png`

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

---

## Implementierungsreihenfolge

1. **`data.json`** – Aus CLAUDE.md übernehmen (alle 10 Anwendungsfälle vollständig definiert)
2. **`generate_icons.py`** – Icon-Generator erstellen und alle Icons generieren
3. **`style.css`** – Gemeinsames Stylesheet mit Dark-Mode-Design
4. **`index.html` + `app.js`** – Startseite mit Kacheln und Tool-Modal
5. **`settings.html` + `settings.js`** – Wartungsoberfläche
6. **Testing** – Öffnen als `file://`, Favorit im Browser anlegen

---

## Wichtige Hinweise

- `.env` enthält den OpenAI API Key → **nicht in Git einchecken** (in `.gitignore`)
- Die Seite funktioniert als `file://`-URL ohne lokalen Webserver
- `localStorage` wird als Datenspeicher genutzt; `data.json` ist nur der Initialzustand
- Alle externen Tool-Links öffnen in `target="_blank"`

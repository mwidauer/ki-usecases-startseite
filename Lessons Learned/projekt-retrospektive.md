# Projekt-Retrospektive: KI-Usecases Startseite

> Erstellt nach Abschluss des Projekts als persönliche Lessons-Learned-Dokumentation.
> Diese Datei ist lokal und nicht in git eingecheckt.

---

## 1. Wo wir gestartet sind – wo wir gelandet sind

### Ursprüngliche Idee (vereinfacht)
Eine lokale HTML-Seite im Browser, die KI-Tools übersichtlich darstellt und schnell erreichbar ist.

### Endergebnis
Ein vollständiges lokales Webprojekt mit:
- Python HTTP-Server (`server.py`) für config-Persistenz
- Dateibasierter Konfiguration (`user-config.json`) statt localStorage
- Eingebettetem Python (~10 MB, automatisch heruntergeladen) ohne Installationspflicht
- Unsichtbarem Windows-Autostart via VBScript
- `localapp://`-Protokoll-Handler für Desktop-Apps
- Konfigurierbarem Port via `server.json`
- Zweigliedrigem Git-Workflow: `main` (öffentlich) + `personal` (persönliche Daten)
- Vollständiger Einstellungsoberfläche mit Drawer-UI

### Fazit
Das Endprodukt ist um ein Vielfaches komplexer als ursprünglich gedacht – und deutlich nützlicher. Jede Erweiterung war sinnvoll, aber zusammengenommen haben sie mehrere Komplettüberarbeitungen erzwungen.

---

## 2. Die Evolutionsstufen – was wann geändert wurde

### Stufe 1: Statische HTML-Seite mit localStorage
**Was war das:** Startseite als einfache HTML-Datei, Einstellungen im Browser-localStorage
**Problem erkannt:** localStorage ist browserspezifisch, nicht sicherbar, nicht teilbar

### Stufe 2: Server-basiertes System mit Python
**Auslöser:** "Ich möchte die Konfiguration in einer Datei im Repository ablegen"
**Was das erforderte:**
- Kompletten neuen Python-Server (`server.py`)
- Umschreiben von `app.js` und `settings.js` (fetch statt localStorage)
- Neues Startskript (`start.bat`)
- `.gitignore`-Anpassungen

**Vollständige Richtungsänderung #1:** Von statischer Datei zu Server-Architektur

### Stufe 3: Kein Python installieren müssen
**Auslöser:** "Was muss jemand machen, der das Tool nutzen will?"
**Was das erforderte:**
- PowerShell-Skript für automatischen Python-Download (`setup/get-python.ps1`)
- Prioritätskette in `start.bat`: embedded → system → download-angebot
- `.gitignore` für `python/`-Ordner

### Stufe 4: Unsichtbarer Hintergrundstart
**Auslöser:** "Wenn ich das in den Autostart gebe, hüpft jedesmal die Website auf. Das will ich nicht."
**Was das erforderte:**
- `--no-browser`-Flag in `server.py`
- Neues `start-hidden.vbs` (Window-Style 0)
- `setup/install-autostart.bat`
- Anpassung von `start.bat` (kein Browser-Start mehr)

### Stufe 5: Konfigurierbarer Port
**Auslöser:** "Was wenn jemand schon einen localhost hat? Wie reagieren Firewalls?"
**Was das erforderte:**
- Optionale `server.json` für Port-Konfiguration
- Dokumentation dazu in README

### Stufe 6: Zwei-Branch-Git-Strategie
**Auslöser:** Persönliche Apps (Claude Desktop, Perplexity) sollen im Repo sein, aber nicht öffentlich
**Was das erforderte:**
- `main`-Branch: öffentliche Vorlage ohne persönliche Daten
- `personal`-Branch: persönliche Konfiguration
- Wiederholte cherry-pick/rebase-Operationen
- Klare Trennung: `apps.json` und `local-apps.js` nur auf `personal`

**Vollständige Richtungsänderung #2:** Projektstrategie von Einzelentwickler zu "teilbar + privat"

### Stufe 7: Bugfixing am Ende
**Auslöser:** Settings-Seite war von Beginn an leer (nie aufgefallen, weil localStorage vorhanden)
**Ursache:** `throw;` ohne Argument = JavaScript Syntax-Fehler → Script lud nie
**Dauer der Fehlersuche:** Mehrere Iterationen, Branch-Wechsel, Server-Neustart, file://-Theorie, CSS-Analyse – alles falsch. Lösung: Browser-DevTools Console

---

## 3. Was beim ersten Prompt nicht bedacht wurde

### Deployment & Verteilung
- Läuft das nur bei mir oder soll es teilbar sein?
- Auf welchem Betriebssystem?
- Was darf öffentlich ins Repository, was nicht?
- Wird das Projekt irgendwann weitergegeben?

### Abhängigkeiten
- Ist Python vorhanden? Soll es vorhanden sein müssen?
- Welche Systemvoraussetzungen sind akzeptabel?

### Startverhalten
- Wie soll die Seite gestartet werden? Manuell, automatisch, im Hintergrund?
- Soll beim Start ein Fenster erscheinen?
- Soll der Browser automatisch öffnen?

### Konfigurierbarkeit
- Sollen Einstellungen lokal bleiben oder syncbar/teilbar sein?
- Welche Parameter müssen anpassbar sein (Port, Pfade, Apps)?

### App-Typen
- Nur Web-Apps oder auch lokale Desktop-Apps?
- Wenn Desktop-Apps: wie werden sie gestartet?

### Git-Strategie
- Soll das Projekt versioniert werden?
- Was gehört in die öffentliche Version, was ist persönlich?
- Wie sollen persönliche Anpassungen gepflegt werden?

---

## 4. Was beim ersten Prompt hätte stehen sollen

### Schlechter erster Prompt (vereinfacht):
> "Erstelle mir eine lokale Browser-Startseite für KI-Tools."

### Guter erster Prompt:

```
Ich möchte eine lokale Browser-Startseite für KI-Tools entwickeln.

ZIEL: Schneller Zugriff auf meine meist genutzten KI-Tools (Web-Apps +
lokale Desktop-Apps) in einem ansprechenden Dark-Mode-Dashboard.

NUTZUNGSKONTEXT:
- Nur ich benutze das täglich auf meinem Windows-11-Rechner
- Die Seite soll als Browser-Favorit auf localhost erreichbar sein
- Server soll unsichtbar im Windows-Autostart laufen (kein CMD-Fenster)
- Ich möchte das Projekt auf GitHub teilen, aber persönliche App-Pfade
  privat halten

TECHNISCHE RANDBEDINGUNGEN:
- Kein Build-System, kein Framework – nur HTML/CSS/Vanilla JS
- Python falls verfügbar, sonst automatisch eingebettet bereitstellen
- Keine Cloud, keine externen Dienste, alles lokal
- Windows-only (kein Linux/Mac-Support nötig)

APPS:
- Web-Tools: direkter Link (z.B. Claude.ai, Perplexity)
- Lokale Desktop-Apps: Starten über Protokoll-Handler (z.B. claude://)
- Lokale Apps sollen nicht öffentlich im Repo stehen

KONFIGURATION:
- Anwendungsfälle + Tools über eine UI-Seite verwaltbar
- Konfiguration in Datei speichern (nicht localStorage)
- Einfach auf andere Rechner übertragbar

GIT-STRATEGIE:
- main: saubere öffentliche Vorlage
- personal: main + meine persönlichen Apps und Einstellungen
```

---

## 5. Prompt-gestützte Anforderungsanalyse: die Fragen vorher

Eine KI hätte folgende Fragen zur Anforderungsklärung stellen können (oder sollen):

### Block A: Nutzungskontext
1. Wer benutzt das – nur du, oder sollen andere es auch nutzen?
2. Auf welchem Betriebssystem läuft es? Nur Windows, oder auch Mac/Linux?
3. Wie technisch versiert sind die Nutzer? (Können sie Python installieren?)
4. Wie oft wird die Konfiguration geändert?

### Block B: Startverhalten & Infrastruktur
5. Soll die Seite automatisch beim PC-Start verfügbar sein?
6. Darf beim Start ein Fenster/Terminal erscheinen?
7. Soll der Browser automatisch öffnen oder nur der Server starten?
8. Was passiert, wenn Port 8080 schon belegt ist?

### Block C: App-Typen
9. Nur Web-Apps (URLs) oder auch lokale Desktop-Programme?
10. Wenn Desktop-Apps: wie werden die derzeit gestartet?
11. Gibt es Terminal-/CLI-Tools (würde die Architektur ändern)?

### Block D: Daten & Konfiguration
12. Wo sollen Einstellungen gespeichert werden? (localStorage / Datei / Datenbank)
13. Sollen Einstellungen zwischen Geräten sync-bar sein?
14. Gibt es Daten, die privat bleiben müssen?

### Block E: Versionierung & Weitergabe
15. Wird das Projekt in einem Git-Repository versioniert?
16. Soll es öffentlich (GitHub) oder privat bleiben?
17. Was darf öffentlich stehen, was nicht? (App-Pfade, persönliche URLs)
18. Soll es für andere einfach zu installieren/forken sein?

### Block F: Wartung & Zukunft
19. Wer pflegt das langfristig?
20. Wie oft kommen neue Apps/Tools hinzu?
21. Sollen neue Apps ohne Code-Änderungen hinzufügbar sein?

---

## 6. Die teuersten Annahmen (was am meisten Nacharbeit kostete)

| Annahme | Realität | Aufwand |
|---------|----------|---------|
| "localStorage reicht für Konfiguration" | Dateibasierter Server nötig | Komplette Architekturumstellung |
| "Python ist vorhanden" | Embedded Python für Null-Installation nötig | Neues Setup-System |
| "Start = Browser öffnet sich" | Autostart = unsichtbar im Hintergrund | Neues VBS-Launcher-System |
| "Alles ins Repo" | Persönliche Daten müssen raus | Zwei-Branch-Strategie, mehrfache cherry-picks |
| "Statische Datei im Browser öffnen" | Server-URL nötig | Settings-Seite lief nie (file://-Problem + SyntaxError) |

---

## 7. Erkenntnisse für KI-gestützte Entwicklung

### Was gut funktioniert hat
- Schnelle Umsetzung einzelner Features ohne Boilerplate-Overhead
- Konsistenter Code-Stil über das gesamte Projekt
- Saubere Trennung von Zuständigkeiten (server.py / app.js / settings.js)
- Gute Debugging-Unterstützung (DevTools-Hinweis hat das Problem sofort gelöst)

### Was schwierig war
- **Scope Creep ohne Gesamtbild:** Jede Erweiterung war für sich sinnvoll, aber
  das Gesamtsystem wurde nie vorab entworfen
- **Branch-Management mit KI:** Mehrfach versehentlich auf falschem Branch committed.
  KI vergisst Kontext, Branches existieren nur als Text, nicht als sichtbarer Zustand
- **Stille Fehler:** Der SyntaxError war von Beginn an da, fiel aber wochenlang
  nicht auf, weil localStorage-Fallback vorhanden war → **immer DevTools öffnen**
- **Kontextverlust:** Lange Sessions mit Komprimierung bedeuten, dass frühere
  Entscheidungen unbekannt werden → wichtige Entscheidungen in CLAUDE.md dokumentieren

### Workflow-Empfehlungen für nächste Projekte
1. **Erst Anforderungen, dann Code:** 15 Minuten Fragenkatalog sparen Stunden Nacharbeit
2. **CLAUDE.md von Anfang an pflegen:** Architekturentscheidungen sofort dokumentieren
3. **Deployment-Konzept zuerst:** Wie wird es gestartet? Wer benutzt es? Wo läuft es?
4. **Browser-DevTools standardmäßig öffnen** beim Testen von Web-UIs
5. **Syntax-Checks einbauen:** `node --check datei.js` als Gewohnheit vor jedem Commit
6. **Branch-Strategie früh festlegen:** Nicht erst wenn persönliche Daten committet wurden
7. **Kleine Commits mit klaren Messages:** Macht cherry-pick/rebase deutlich einfacher

---

## 8. Vorlage: Anforderungs-Prompt für lokale Tools

Für ähnliche Projekte in der Zukunft – als Ausgangspunkt:

```markdown
## Projektbeschreibung
[Was soll das Tool tun? Für wen?]

## Nutzungskontext
- Betriebssystem: [Windows / Mac / Linux / alle]
- Nutzerkreis: [nur ich / Team / öffentlich]
- Technisches Niveau der Nutzer: [Entwickler / normal / minimal]

## Startverhalten
- Start: [manuell / automatisch beim Login]
- Sichtbarkeit: [Fenster ok / unsichtbar im Hintergrund]
- Voraussetzungen: [Python installiert / keine Installation erlaubt]

## Konfiguration & Daten
- Speicherort: [lokal / cloud / beides]
- Was ist persönlich/privat: [...]
- Git/Versionierung: [ja/nein, öffentlich/privat]

## Funktionen (Muss/Kann/Nicht)
MUSS: [...]
KANN: [...]
NICHT: [...]

## Technische Einschränkungen
- Kein Build-System: [ja/nein]
- Keine externen Dependencies: [ja/nein]
- Maximale Komplexität: [einfach / mittel / komplex ok]
```

---

*Erstellt: März 2026 | Projekt: KI-Usecases Startseite*

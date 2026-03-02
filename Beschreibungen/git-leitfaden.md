# Git-Leitfaden: KI-Usecases Startseite

Dieser Leitfaden erklärt die Git-Grundlagen, die für die Pflege dieses Projekts
benötigt werden – angepasst auf die konkrete Zwei-Branch-Strategie (`main` / `personal`)
und die typischen Weiterentwicklungsszenarien des Projekts.

---

## Teil 1: Git-Grundlagen

### Was ist Git?

Git ist ein Versionskontrollsystem. Es speichert nicht nur den aktuellen Stand von
Dateien, sondern die gesamte Geschichte aller Änderungen – wer wann was geändert hat,
warum, und wie der Stand zu jedem früheren Zeitpunkt aussah.

### Die wichtigsten Konzepte

#### Repository
Der Projektordner, den Git überwacht. Erkennbar am versteckten `.git/`-Unterordner.
Alles innerhalb dieses Ordners kann versioniert werden.

#### Branch (Ast)
Eine unabhängige Entwicklungslinie innerhalb des Repositories. Änderungen auf einem
Branch beeinflussen andere Branches nicht, bis sie explizit zusammengeführt werden.

Dieses Projekt nutzt zwei Branches:
- **`main`** – öffentliche, saubere Version ohne persönliche Daten
- **`personal`** – enthält alles aus `main` plus deine persönlichen Einstellungen

```
main:      A ── B ── C ── D
                          │
personal:                 └── E   (E = persönliche Apps, user-config.json)
```

#### Commit
Eine gespeicherte Änderung mit Nachricht, Zeitstempel und Autor. Jeder Commit ist
ein Schnappschuss des Projekts zu einem bestimmten Zeitpunkt.

```bash
git commit -m "Beschreibung der Änderung"
```

Gute Commit-Messages sind kurz und beschreiben das **Warum**, nicht das **Was**:
- ✅ `fix: Einstellungsseite zeigte keine Daten`
- ❌ `settings.js geändert`

#### Staging (Index)
Bevor ein Commit entsteht, werden Dateien „gestaged" – also zur nächsten Änderung
vorgemerkt. Das erlaubt es, nur einen Teil der geänderten Dateien zu committen.

```bash
git add dateiname.js        # Eine Datei stagen
git add icons/              # Einen ganzen Ordner stagen
git add -f user-config.json # Gitignorierte Datei force-stagen
```

#### Remote / Origin
Eine Kopie des Repositories auf einem Server (hier: GitHub). `origin` ist der
Standardname für diese Fernkopie.

```bash
git push origin main        # Lokalen main zu GitHub hochladen
git pull origin main        # Änderungen von GitHub herunterladen
```

#### .gitignore
Eine Datei, die festlegt welche Dateien Git ignoriert und nie committet:
- `user-config.json` – persönliche Konfiguration (gitignored auf `main`)
- `server.json` – lokaler Port
- `python/` – eingebettetes Python (~10 MB)
- `.env` – API-Keys

---

### Die wichtigsten Befehle auf einen Blick

| Befehl | Bedeutung |
|--------|-----------|
| `git status` | Welche Dateien sind neu/geändert/gestaged? |
| `git log --oneline` | Commit-Historie kompakt anzeigen |
| `git branch` | Alle lokalen Branches anzeigen |
| `git branch --show-current` | Welcher Branch ist aktiv? |
| `git checkout main` | Zum `main`-Branch wechseln |
| `git checkout personal` | Zum `personal`-Branch wechseln |
| `git add datei` | Datei stagen |
| `git commit -m "..."` | Gestagede Änderungen committen |
| `git push origin main` | Commits zu GitHub hochladen |
| `git push --force-with-lease origin personal` | personal nach Rebase hochladen |
| `git rebase main` | personal auf aktuellen main-Stand bringen |
| `git cherry-pick <hash>` | Einzelnen Commit auf aktuellen Branch übertragen |

---

### Was bedeutet Rebase?

`personal` basiert auf `main`. Wenn `main` neue Commits bekommt (z. B. einen Bugfix),
ist `personal` veraltet. `git rebase main` hängt die persönlichen Commits ans neue
Ende von `main`:

```
Vorher:
main:      A ── B ── C ── D (neu)
personal:  A ── B ── C ── E (veraltet)

Nachher (nach git rebase main auf personal):
main:      A ── B ── C ── D
personal:  A ── B ── C ── D ── E
```

Der persönliche Commit `E` ist jetzt auf dem neuesten Stand von `main`.

Nach einem Rebase muss mit `--force-with-lease` gepusht werden, weil sich die
Commit-Historie verändert hat:

```bash
git push --force-with-lease origin personal
```

---

## Teil 2: Konkrete Handlungsempfehlungen

### Usecase A: Neue Kategorie + Icon in den Einstellungen hinzufügen

**Was sich ändert:**
- `user-config.json` – wird automatisch durch die App gespeichert
- `icons/icon_11_*.png` – neues Icon-Bild

**Vorgehen:**

```bash
# 1. Auf personal wechseln
git checkout personal

# 2. Neues Icon stagen
git add icons/icon_11_mein-usecase.png

# 3. Persönliche Konfiguration mitsichern (force nötig wegen .gitignore)
git add -f user-config.json

# 4. Alles in einem Commit
git commit -m "personal: Neue Kategorie 'Mein Usecase' + Icon hinzugefügt"

# 5. Zu GitHub pushen
git push origin personal
```

> **Hinweis:** `user-config.json` auf `main` bleibt davon unberührt – dort landet
> nie persönliche Konfiguration.

---

### Usecase B: Links / Tools in bestehenden Kategorien ändern

**Was sich ändert:**
- `user-config.json` – automatisch gespeichert durch Einstellungsseite

**Vorgehen:**

```bash
git checkout personal
git add -f user-config.json
git commit -m "personal: n8n-URL auf eigenen Server geändert"
git push origin personal
```

Das ist der minimalste mögliche Commit – nur die Konfigurationsdatei.

---

### Usecase C: Neue lokale Desktop-App hinzufügen

**Was sich ändert:**
- `launchers/apps.json` – Exe-Pfad oder AppId eintragen
- `launchers/local-apps.js` – Anzeigename und Emoji eintragen
- `user-config.json` – App einem Anwendungsfall zuweisen (über Einstellungen)

**Vorgehen:**

```bash
git checkout personal

# Beide Launcher-Dateien stagen
git add launchers/apps.json launchers/local-apps.js

# Optional: Konfiguration mitsichern
git add -f user-config.json

git commit -m "personal: Obsidian als lokale App hinzugefügt"
git push origin personal
```

> **Wichtig:** `apps.json` und `local-apps.js` müssen synchron gehalten werden –
> der `key` muss in beiden Dateien identisch sein.

---

### Usecase D: Bugfix oder neue Funktion (Code-Verbesserung)

Wenn du in `app.js`, `settings.js`, `server.py` o. ä. einen Fehler findest oder
etwas verbessern möchtest, gehört das auf **`main`** – und danach wird `personal`
auf den neuen Stand gebracht.

**Vorgehen:**

```bash
# 1. Auf main wechseln und Änderung machen
git checkout main

# ... Datei bearbeiten ...

git add settings.js
git commit -m "fix: Drawer schließt sich nach Speichern nicht mehr von alleine"
git push origin main

# 2. personal auf neuen main-Stand bringen
git checkout personal
git rebase main
git push --force-with-lease origin personal
```

---

### Usecase E: Auf einem neuen Rechner einrichten

Das Projekt ist auf GitHub – auf einem neuen Rechner reicht:

```bash
# Repository holen
git clone https://github.com/mwidauer/ki-usecases-startseite.git
cd ki-usecases-startseite

# Personal-Branch aktivieren (enthält persönliche Apps)
git checkout personal

# Server starten (lädt Python automatisch falls nötig)
start.bat   # Doppelklick im Explorer

# Einmalig: Protokoll-Handler für lokale Apps installieren
launchers\install.bat   # Doppelklick

# Einmalig: Autostart einrichten
setup\install-autostart.bat   # Doppelklick
```

`user-config.json` ist nicht im Repository. Nach dem ersten Start wird `data.json`
als Vorlage geladen. Eigene Kategorien und Tools müssen einmalig über die
Einstellungsseite neu angelegt werden – oder die gesicherte `user-config.json`
vom alten Rechner kopieren.

---

### Usecase F: user-config.json vom alten auf neuen Rechner übertragen

Wenn `user-config.json` zuletzt auf `personal` committet wurde:

```bash
# Auf neuem Rechner nach dem Clone:
git checkout personal
git log --oneline | head -5   # Letzten Commit mit user-config finden
```

Falls die Datei im Repository ist, liegt sie nach dem Checkout automatisch im
Ordner. Falls nicht: Datei manuell kopieren (USB, Cloud-Ordner, E-Mail).

> **Tipp:** Regelmäßig `git add -f user-config.json && git commit` auf `personal`
> macht genau das überflüssig.

---

### Usecase G: Änderungen von main in personal übernehmen (Rebase)

Immer wenn `main` neue Commits bekommt (z. B. nach Bugfixes), sollte `personal`
nachgezogen werden:

```bash
git checkout personal
git rebase main

# Falls es Konflikte gibt:
# → Konflikte in den Dateien manuell lösen
# → git add konflikt-datei.js
# → git rebase --continue

git push --force-with-lease origin personal
```

In der Praxis passiert das selten, weil `main` und `personal` fast identisch sind
und sich nur in `apps.json`, `local-apps.js` und `user-config.json` unterscheiden.

---

### Usecase H: Versehentlich auf falschem Branch committet

Passiert leicht. Prüfen: Auf welchem Branch bin ich?

```bash
git branch --show-current
```

**Fall 1: Commit gehört auf `main`, ist aber auf `personal` gelandet**

```bash
# Hash des versehentlichen Commits merken
git log --oneline -3

# Zu main wechseln, Commit übertragen
git checkout main
git cherry-pick <hash>
git push origin main

# personal zurücksetzen (Commit dort entfernen)
git checkout personal
git rebase main
git push --force-with-lease origin personal
```

**Fall 2: Persönlicher Commit ist auf `main` gelandet**

```bash
git checkout main
git log --oneline -3   # Hash des falschen Commits notieren

# main einen Commit zurücksetzen
git reset --hard HEAD~1
git push --force-with-lease origin main

# personal hat den Commit bereits → alles gut
```

---

## Teil 3: Dieses Dokument als Beispiel

Die Git-Empfehlungen in diesem Dokument entstammen direkt aus der Entwicklung
dieses Projekts. Das folgende Beispiel zeigt, wie die Frage nach dem git-Workflow
in der Praxis gestellt wurde und was die Antwort war.

### Originalfrage (sinngemäß):

> „Wenn ich in den Einstellungen eine neue Kategorie hinzufüge und dafür ein
> neues Bild erzeuge, ändert sich der Code – genauso wenn ich Links ändere.
> Wie behandle ich das in Git / GitHub?"

### Analyse der betroffenen Dateien:

| Aktion | Datei | Gitignored? | Branch |
|--------|-------|-------------|--------|
| Neue Kategorie anlegen | `user-config.json` | ✅ Ja | `personal` (force-add) |
| Links ändern | `user-config.json` | ✅ Ja | `personal` (force-add) |
| Neues Icon generiert | `icons/icon_NN_*.png` | ❌ Nein | `personal` |
| Neue lokale App | `apps.json` + `local-apps.js` | ❌ Nein | `personal` |
| Bugfix im Code | `app.js` / `settings.js` | ❌ Nein | `main` → rebase `personal` |

### Schlüsselerkenntnis:

`user-config.json` ist bewusst gitignored, weil sie auf `main` nie öffentlich
werden darf. Auf `personal` kann sie mit `git add -f` trotzdem gesichert werden.
Das `-f` steht für `--force` und überschreibt die .gitignore-Regel lokal.

---

## Schnellreferenz: Die häufigsten Befehle

```bash
# Status prüfen
git status
git branch --show-current

# Auf Branch wechseln
git checkout main
git checkout personal

# Änderungen committen (normal)
git add datei.js
git commit -m "Beschreibung"
git push origin main

# Persönliche Konfiguration sichern
git checkout personal
git add -f user-config.json
git add icons/
git commit -m "personal: Beschreibung"
git push origin personal

# personal nach main-Update aktualisieren
git checkout personal
git rebase main
git push --force-with-lease origin personal
```

---

*Erstellt: März 2026 | Projekt: KI-Usecases Startseite*

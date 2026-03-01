/**
 * app.js – KI-Usecases Startseite
 * Daten sind direkt eingebettet (kein fetch, funktioniert mit file://)
 * Konfiguration wird in localStorage gespeichert und von settings.js gewartet.
 */

const STORAGE_KEY = 'ki_usecases_config';

// ── Initiale Daten (eingebettet, kein Server nötig) ──────────
const DEFAULT_DATA = {
  "usecases": [
    {
      "id": 1,
      "name": "Dokumenten-Recherche & Lernen",
      "icon": "icons/icon_01_dokumente.png",
      "description": "Analyse von Branchenreports und PDFs, Mustererkennung in Call-Transkripten, Zusammenfassen von Podcasts/Videos zu Audio-Overviews, quellenbasiertes Arbeiten ohne Halluzinationen",
      "tools": [
        { "name": "NotebookLM", "url": "https://notebooklm.google.com" }
      ]
    },
    {
      "id": 2,
      "name": "Web-Recherche & Daten-Scraping",
      "icon": "icons/icon_02_web-recherche.png",
      "description": "Schnelle Faktenprüfung im Web, Zusammenfassen von Webseiten via Browser-Assistent, Firmen recherchieren sowie Kontaktdaten scrapen und strukturiert in Tabellen aufbereiten",
      "tools": [
        { "name": "Perplexity", "url": "https://www.perplexity.ai" }
      ]
    },
    {
      "id": 3,
      "name": "Texterstellung & Automatisierung",
      "icon": "icons/icon_03_texterstellung.png",
      "description": "Schreiben natürlicher Texte, Erstellen spezialisierter Workflows für Textprüfungen, automatische Datenbank- und CRM-Anbindung via Model Context Protocol (MCP) und On-the-fly-Code-Generierung",
      "tools": [
        { "name": "Claude", "url": "https://claude.ai" }
      ]
    },
    {
      "id": 4,
      "name": "Prozess-Automatisierung",
      "icon": "icons/icon_04_automatisierung.png",
      "description": "Lokale und quelloffene Automatisierung von Workflows, z. B. CRM-Updates, Leadgenerierung, Datenanreicherung, Social Media Automatisierung, Onboarding-Prozesse und Belegerkennung",
      "tools": [
        { "name": "n8n", "url": "https://n8n.io" }
      ]
    },
    {
      "id": 5,
      "name": "Prototyping & MVPs (ohne Code)",
      "icon": "icons/icon_05_prototyping.png",
      "description": "Schnelles visuelles Testen und Bauen von App-Prototypen in einer Sandbox, Erstellung von Frontends zur Kundenpräsentation ohne Programmierkenntnisse",
      "tools": [
        { "name": "Google AI Studio", "url": "https://aistudio.google.com" }
      ]
    },
    {
      "id": 6,
      "name": "App-Entwicklung & Programmierung",
      "icon": "icons/icon_06_programmierung.png",
      "description": "Aus Prototypen voll funktionsfähige Apps bauen, automatisiertes Coden und Bug-Fixing durch KI-Agenten, ohne selbst Code schreiben zu müssen",
      "tools": [
        { "name": "Cursor", "url": "https://www.cursor.com" },
        { "name": "Claude Code", "url": "claudecode://launch", "local": true }
      ]
    },
    {
      "id": 7,
      "name": "Lokale Corporate LLMs (Datenschutz)",
      "icon": "icons/icon_07_corporate-llm.png",
      "description": "Aufbau von KI-Systemen für internes Firmenwissen, lokale und komplett DSGVO-konforme Verarbeitung sensibler Daten auf eigenen Servern",
      "tools": [
        { "name": "Ollama", "url": "https://ollama.com" }
      ]
    },
    {
      "id": 8,
      "name": "Voice AI & KI-Sprachagenten",
      "icon": "icons/icon_08_voice-ai.png",
      "description": "Vertonung von Videos mit mehreren Sprechern und Soundeffekten, Erstellung natürlich klingender KI-Telefon-Agenten für Rezeptionen, Outbound-Sales, Leads-Generierung oder Terminverwaltung",
      "tools": [
        { "name": "ElevenLabs", "url": "https://elevenlabs.io" }
      ]
    },
    {
      "id": 9,
      "name": "Videogenerierung & Werbefilme",
      "icon": "icons/icon_09_video.png",
      "description": "Erstellung von cinematischen Clips, Werbespots und Erklärvideos aus einfachen Storyboards oder Fotos, Sicherstellung von Charakter- und Produktkonsistenz über mehrere Szenen hinweg",
      "tools": [
        { "name": "Google Flow (Veo)", "url": "https://flow.google" }
      ]
    },
    {
      "id": 10,
      "name": "Präsentationserstellung",
      "icon": "icons/icon_10_praesentation.png",
      "description": "Automatische Generierung von Pitch-Decks, Exposés oder Marketingunterlagen aus Notizen, Reports oder Meeting-Transkripten inklusive visuellem Design in wenigen Minuten",
      "tools": [
        { "name": "Gamma", "url": "https://gamma.app" }
      ]
    }
  ]
};

// ── Daten laden ───────────────────────────────────────────────
function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Selbstreparatur: leere usecases → Standarddaten wiederherstellen
      if (parsed.usecases && parsed.usecases.length > 0) {
        return parsed;
      }
    } catch { /* fall through */ }
  }
  // Erststart oder leerer Storage: Standarddaten schreiben
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
  return DEFAULT_DATA;
}

// ── Favicon-URL ───────────────────────────────────────────────
function faviconUrl(toolUrl) {
  try {
    const origin = new URL(toolUrl).origin;
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`;
  } catch {
    return null;
  }
}

// ── Icon-Element (img oder Emoji-Placeholder) ─────────────────
function makeIcon(src, cssClass, placeholderClass) {
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.className = cssClass;
    img.onerror = () => {
      const ph = document.createElement('div');
      ph.className = placeholderClass;
      ph.textContent = '🤖';
      img.replaceWith(ph);
    };
    return img;
  }
  const ph = document.createElement('div');
  ph.className = placeholderClass;
  ph.textContent = '🤖';
  return ph;
}

// ── Kachel rendern ────────────────────────────────────────────
function renderCard(uc) {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', uc.name);

  card.appendChild(makeIcon(uc.icon, 'card__icon', 'card__icon--placeholder'));

  const name = document.createElement('div');
  name.className = 'card__name';
  name.textContent = uc.name;
  card.appendChild(name);

  if (uc.tools && uc.tools.length > 0) {
    const badges = document.createElement('div');
    badges.className = 'card__tools';
    uc.tools.forEach(t => {
      const b = document.createElement('span');
      b.className = 'card__tool-badge';
      b.textContent = t.name;
      badges.appendChild(b);
    });
    card.appendChild(badges);
  }

  card.addEventListener('click', () => openModal(uc));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openModal(uc);
  });

  return card;
}

// ── Grid befüllen ─────────────────────────────────────────────
function renderGrid(usecases) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  usecases.forEach(uc => grid.appendChild(renderCard(uc)));
}

// ── Modal öffnen ──────────────────────────────────────────────
function openModal(uc) {
  document.getElementById('modalTitle').textContent = uc.name;
  document.getElementById('modalDescription').textContent = uc.description || '';

  const iconEl = document.getElementById('modalIcon');
  iconEl.innerHTML = '';
  iconEl.appendChild(makeIcon(uc.icon, 'modal__icon', 'modal__icon--placeholder'));

  const toolList = document.getElementById('modalToolList');
  toolList.innerHTML = '';

  if (!uc.tools || uc.tools.length === 0) {
    const empty = document.createElement('p');
    empty.style.cssText = 'color:var(--text-muted);font-size:0.8rem';
    empty.textContent = 'Keine Tools konfiguriert.';
    toolList.appendChild(empty);
  } else {
    uc.tools.forEach(tool => {
      // Lokale App → mit URL klickbar, ohne URL nur Badge
      if (tool.local) {
        const el = tool.url
          ? document.createElement('a')
          : document.createElement('div');

        el.className = 'modal__tool-link modal__tool-link--local';

        if (tool.url) {
          el.href   = tool.url;
          el.title  = 'Lokale App starten';
        }

        const icon = document.createElement('span');
        icon.className   = 'local-icon';
        icon.textContent = '💻';
        el.appendChild(icon);

        const label = document.createElement('span');
        label.textContent = tool.name;
        el.appendChild(label);

        const badge = document.createElement('span');
        badge.className   = 'local-badge';
        badge.textContent = tool.url ? 'Starten ↗' : 'Lokale App';
        el.appendChild(badge);

        toolList.appendChild(el);
        return;
      }

      // Web-Tool → klickbarer Link
      const a = document.createElement('a');
      a.className = 'modal__tool-link';
      a.href = tool.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      const fav = faviconUrl(tool.url);
      if (fav) {
        const img = document.createElement('img');
        img.src = fav;
        img.alt = '';
        img.width = 18;
        img.height = 18;
        a.appendChild(img);
      }

      const label = document.createElement('span');
      label.textContent = tool.name;
      a.appendChild(label);

      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '↗';
      a.appendChild(arrow);

      toolList.appendChild(a);
    });
  }

  document.getElementById('modalOverlay').classList.add('active');
  document.getElementById('modalClose').focus();
}

// ── Modal schließen ───────────────────────────────────────────
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Start ─────────────────────────────────────────────────────
const data = loadData();
renderGrid(data.usecases);

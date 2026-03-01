/**
 * settings.js – Wartungsoberfläche für KI-Usecases
 * Liest/schreibt in localStorage, Export/Import als JSON.
 */

const STORAGE_KEY = 'ki_usecases_config';
let config = { usecases: [] };
let editingId = null; // null = neuer Eintrag

// Gleiche Standarddaten wie in app.js (kein fetch bei file://)
const DEFAULT_DATA = {
  "usecases": [
    { "id": 1, "name": "Dokumenten-Recherche & Lernen", "icon": "icons/icon_01_dokumente.png", "description": "Analyse von Branchenreports und PDFs, Mustererkennung in Call-Transkripten, Zusammenfassen von Podcasts/Videos zu Audio-Overviews, quellenbasiertes Arbeiten ohne Halluzinationen", "tools": [{ "name": "NotebookLM", "url": "https://notebooklm.google.com" }] },
    { "id": 2, "name": "Web-Recherche & Daten-Scraping", "icon": "icons/icon_02_web-recherche.png", "description": "Schnelle Faktenprüfung im Web, Zusammenfassen von Webseiten via Browser-Assistent, Firmen recherchieren sowie Kontaktdaten scrapen und strukturiert in Tabellen aufbereiten", "tools": [{ "name": "Perplexity", "url": "https://www.perplexity.ai" }] },
    { "id": 3, "name": "Texterstellung & Automatisierung", "icon": "icons/icon_03_texterstellung.png", "description": "Schreiben natürlicher Texte, Erstellen spezialisierter Workflows für Textprüfungen, automatische Datenbank- und CRM-Anbindung via Model Context Protocol (MCP) und On-the-fly-Code-Generierung", "tools": [{ "name": "Claude", "url": "https://claude.ai" }] },
    { "id": 4, "name": "Prozess-Automatisierung", "icon": "icons/icon_04_automatisierung.png", "description": "Lokale und quelloffene Automatisierung von Workflows, z. B. CRM-Updates, Leadgenerierung, Datenanreicherung, Social Media Automatisierung, Onboarding-Prozesse und Belegerkennung", "tools": [{ "name": "n8n", "url": "https://n8n.io" }] },
    { "id": 5, "name": "Prototyping & MVPs (ohne Code)", "icon": "icons/icon_05_prototyping.png", "description": "Schnelles visuelles Testen und Bauen von App-Prototypen in einer Sandbox, Erstellung von Frontends zur Kundenpräsentation ohne Programmierkenntnisse", "tools": [{ "name": "Google AI Studio", "url": "https://aistudio.google.com" }] },
    { "id": 6, "name": "App-Entwicklung & Programmierung", "icon": "icons/icon_06_programmierung.png", "description": "Aus Prototypen voll funktionsfähige Apps bauen, automatisiertes Coden und Bug-Fixing durch KI-Agenten, ohne selbst Code schreiben zu müssen", "tools": [{ "name": "Cursor", "url": "https://www.cursor.com" }, { "name": "Claude Code", "url": "claudecode://launch", "local": true }] },
    { "id": 7, "name": "Lokale Corporate LLMs (Datenschutz)", "icon": "icons/icon_07_corporate-llm.png", "description": "Aufbau von KI-Systemen für internes Firmenwissen, lokale und komplett DSGVO-konforme Verarbeitung sensibler Daten auf eigenen Servern", "tools": [{ "name": "Ollama", "url": "https://ollama.com" }] },
    { "id": 8, "name": "Voice AI & KI-Sprachagenten", "icon": "icons/icon_08_voice-ai.png", "description": "Vertonung von Videos mit mehreren Sprechern und Soundeffekten, Erstellung natürlich klingender KI-Telefon-Agenten für Rezeptionen, Outbound-Sales, Leads-Generierung oder Terminverwaltung", "tools": [{ "name": "ElevenLabs", "url": "https://elevenlabs.io" }] },
    { "id": 9, "name": "Videogenerierung & Werbefilme", "icon": "icons/icon_09_video.png", "description": "Erstellung von cinematischen Clips, Werbespots und Erklärvideos aus einfachen Storyboards oder Fotos, Sicherstellung von Charakter- und Produktkonsistenz über mehrere Szenen hinweg", "tools": [{ "name": "Google Flow (Veo)", "url": "https://flow.google" }] },
    { "id": 10, "name": "Präsentationserstellung", "icon": "icons/icon_10_praesentation.png", "description": "Automatische Generierung von Pitch-Decks, Exposés oder Marketingunterlagen aus Notizen, Reports oder Meeting-Transkripten inklusive visuellem Design in wenigen Minuten", "tools": [{ "name": "Gamma", "url": "https://gamma.app" }] }
  ]
};

// ── Daten laden ──────────────────────────────────────────────
function loadConfig() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      config = JSON.parse(stored);
      return;
    } catch { /* fall through */ }
  }
  config = JSON.parse(JSON.stringify(DEFAULT_DATA)); // deep copy
  saveConfig();
}

function saveConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ── Render Liste ─────────────────────────────────────────────
function renderList() {
  const list = document.getElementById('usecaseList');
  list.innerHTML = '';

  config.usecases.forEach((uc, idx) => {
    const item = document.createElement('div');
    item.className = 'usecase-item';

    // Icon
    const iconWrap = document.createElement('div');
    if (uc.icon) {
      const img = document.createElement('img');
      img.src = uc.icon;
      img.alt = '';
      img.className = 'usecase-item__icon';
      img.onerror = () => { img.replaceWith(placeholderIcon()); };
      iconWrap.appendChild(img);
    } else {
      iconWrap.appendChild(placeholderIcon());
    }
    item.appendChild(iconWrap);

    // Content
    const content = document.createElement('div');
    content.className = 'usecase-item__content';

    const name = document.createElement('div');
    name.className = 'usecase-item__name';
    name.textContent = `${uc.id}. ${uc.name}`;
    content.appendChild(name);

    if (uc.tools && uc.tools.length > 0) {
      const tags = document.createElement('div');
      tags.className = 'tool-tags';
      uc.tools.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tool-tag';
        tag.textContent = t.name;
        tags.appendChild(tag);
      });
      content.appendChild(tags);
    }
    item.appendChild(content);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'usecase-item__actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary';
    editBtn.style.cssText = 'font-size:0.78rem;padding:0.35rem 0.7rem';
    editBtn.textContent = 'Bearbeiten';
    editBtn.addEventListener('click', () => openDrawer(uc.id));
    actions.appendChild(editBtn);

    if (idx > 0) {
      const upBtn = makeIconBtn('↑', 'Nach oben', () => moveUsecase(idx, -1));
      actions.appendChild(upBtn);
    }
    if (idx < config.usecases.length - 1) {
      const downBtn = makeIconBtn('↓', 'Nach unten', () => moveUsecase(idx, 1));
      actions.appendChild(downBtn);
    }

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger';
    delBtn.style.cssText = 'font-size:0.78rem;padding:0.35rem 0.7rem';
    delBtn.textContent = 'Löschen';
    delBtn.addEventListener('click', () => deleteUsecase(uc.id));
    actions.appendChild(delBtn);

    item.appendChild(actions);
    list.appendChild(item);
  });
}

function placeholderIcon() {
  const ph = document.createElement('div');
  ph.className = 'usecase-item__icon--placeholder';
  ph.textContent = '🤖';
  return ph;
}

function makeIconBtn(symbol, label, onClick) {
  const btn = document.createElement('button');
  btn.className = 'btn btn-secondary';
  btn.style.cssText = 'font-size:0.78rem;padding:0.35rem 0.6rem';
  btn.textContent = symbol;
  btn.title = label;
  btn.addEventListener('click', onClick);
  return btn;
}

// ── Reihenfolge ändern ───────────────────────────────────────
function moveUsecase(idx, direction) {
  const arr = config.usecases;
  const swapIdx = idx + direction;
  [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
  saveConfig();
  renderList();
}

// ── Löschen ──────────────────────────────────────────────────
function deleteUsecase(id) {
  const uc = config.usecases.find(u => u.id === id);
  if (!uc) return;
  if (!confirm(`"${uc.name}" wirklich löschen?`)) return;
  config.usecases = config.usecases.filter(u => u.id !== id);
  saveConfig();
  renderList();
  showToast('Anwendungsfall gelöscht.');
}

// ── Drawer ───────────────────────────────────────────────────
function openDrawer(id = null) {
  editingId = id;
  const drawer = document.getElementById('drawerOverlay');
  const title = document.getElementById('drawerTitle');

  if (id !== null) {
    title.textContent = 'Anwendungsfall bearbeiten';
    const uc = config.usecases.find(u => u.id === id);
    document.getElementById('editId').value = uc.id;
    document.getElementById('editName').value = uc.name;
    document.getElementById('editDescription').value = uc.description || '';
    document.getElementById('editIcon').value = uc.icon || '';
    renderToolsEditor(uc.tools || []);
  } else {
    title.textContent = 'Anwendungsfall hinzufügen';
    document.getElementById('editId').value = '';
    document.getElementById('editName').value = '';
    document.getElementById('editDescription').value = '';
    document.getElementById('editIcon').value = '';
    renderToolsEditor([]);
  }

  drawer.classList.add('active');
  document.getElementById('editName').focus();
}

function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('active');
  editingId = null;
}

// ── Tools-Editor im Drawer ───────────────────────────────────
function renderToolsEditor(tools) {
  const container = document.getElementById('toolsContainer');
  container.innerHTML = '';
  tools.forEach((t, i) => addToolRow(t.name, t.url, t.local || false, i));
}

function addToolRow(name = '', url = '', local = false, idx = null) {
  const container = document.getElementById('toolsContainer');

  const row = document.createElement('div');
  row.className = 'tool-row';
  row.style.cssText = 'display:flex;flex-direction:column;gap:0.35rem;margin-bottom:0.75rem;padding:0.6rem 0.75rem;background:var(--bg);border:1px solid var(--border);border-radius:8px';

  // Zeile 1: Name + URL
  const inputRow = document.createElement('div');
  inputRow.style.cssText = 'display:flex;gap:0.5rem;align-items:center';

  const nameInput = document.createElement('input');
  nameInput.className = 'form-input';
  nameInput.placeholder = 'Name (z. B. Claude Code)';
  nameInput.value = name;
  nameInput.style.flex = '1';

  const urlInput = document.createElement('input');
  urlInput.className = 'form-input';
  urlInput.placeholder = local ? 'claudecode:// (optional)' : 'URL (https://...)';
  urlInput.value = url;
  urlInput.style.flex = '2';
  if (local) urlInput.style.opacity = '0.6';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = '✕';
  removeBtn.className = 'btn btn-danger';
  removeBtn.style.cssText = 'padding:0.35rem 0.6rem;font-size:0.8rem;flex-shrink:0';
  removeBtn.addEventListener('click', () => row.remove());

  inputRow.appendChild(nameInput);
  inputRow.appendChild(urlInput);
  inputRow.appendChild(removeBtn);

  // Zeile 2: Lokal-Checkbox
  const checkRow = document.createElement('label');
  checkRow.style.cssText = 'display:flex;align-items:center;gap:0.45rem;font-size:0.78rem;color:var(--text-muted);cursor:pointer;user-select:none';

  const checkbox = document.createElement('input');
  checkbox.type    = 'checkbox';
  checkbox.checked = local;
  checkbox.style.cssText = 'accent-color:var(--purple);cursor:pointer';

  const hint = document.createElement('span');
  hint.textContent = local
    ? '💻 Lokale App – URL optional (z. B. claudecode://launch)'
    : '💻 Lokale Desktop-App (kein Web-Link erforderlich)';

  checkbox.addEventListener('change', () => {
    const isLocal = checkbox.checked;
    urlInput.placeholder = isLocal ? 'claudecode:// (optional)' : 'URL (https://...)';
    urlInput.style.opacity = isLocal ? '0.6' : '1';
    hint.textContent = isLocal
      ? '💻 Lokale App – URL optional (z. B. claudecode://launch)'
      : '💻 Lokale Desktop-App (kein Web-Link erforderlich)';
  });

  checkRow.appendChild(checkbox);
  checkRow.appendChild(hint);

  row.appendChild(inputRow);
  row.appendChild(checkRow);
  container.appendChild(row);
}

function collectTools() {
  const rows = document.querySelectorAll('.tool-row');
  const tools = [];
  rows.forEach(row => {
    const inputs   = row.querySelectorAll('input[type="text"], input:not([type])');
    const checkbox = row.querySelector('input[type="checkbox"]');
    const name     = inputs[0]?.value.trim();
    const url      = inputs[1]?.value.trim() || '';
    const local    = checkbox?.checked || false;
    if (!name) return;
    const tool = { name, url };
    if (local) tool.local = true;
    tools.push(tool);
  });
  return tools;
}

// ── Formular speichern ───────────────────────────────────────
document.getElementById('editForm').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('editName').value.trim();
  if (!name) { alert('Bitte einen Namen eingeben.'); return; }

  const description = document.getElementById('editDescription').value.trim();
  const icon = document.getElementById('editIcon').value.trim();
  const tools = collectTools();

  if (editingId !== null) {
    const uc = config.usecases.find(u => u.id === editingId);
    uc.name = name;
    uc.description = description;
    uc.icon = icon || null;
    uc.tools = tools;
  } else {
    const newId = config.usecases.length > 0
      ? Math.max(...config.usecases.map(u => u.id)) + 1
      : 1;
    config.usecases.push({ id: newId, name, description, icon: icon || null, tools });
  }

  saveConfig();
  renderList();
  closeDrawer();
  showToast('Gespeichert.');
});

// ── Export ───────────────────────────────────────────────────
document.getElementById('btnExport').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ki_usecases_backup.json';
  a.click();
  URL.revokeObjectURL(url);
});

// ── Import ───────────────────────────────────────────────────
document.getElementById('importFile').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!imported.usecases) throw new Error('Ungültiges Format');
      config = imported;
      saveConfig();
      renderList();
      showToast('Import erfolgreich.');
    } catch {
      alert('Fehler beim Importieren: Ungültige JSON-Datei.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// ── Reset ────────────────────────────────────────────────────
document.getElementById('btnReset').addEventListener('click', () => {
  if (!confirm('Alle Änderungen verwerfen und auf Standard-Konfiguration zurücksetzen?')) return;
  config = JSON.parse(JSON.stringify(DEFAULT_DATA)); // deep copy
  saveConfig();
  renderList();
  showToast('Auf Standard zurückgesetzt.');
});

// ── Drawer Buttons ────────────────────────────────────────────
document.getElementById('btnAdd').addEventListener('click', () => openDrawer(null));
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
document.getElementById('drawerCancelBtn').addEventListener('click', closeDrawer);
document.getElementById('drawerOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('drawerOverlay')) closeDrawer();
});
document.getElementById('btnAddTool').addEventListener('click', () => addToolRow());
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
});

// ── Start ────────────────────────────────────────────────────
loadConfig();
renderList();

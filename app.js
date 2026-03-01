/**
 * app.js – KI-Usecases Startseite
 * Konfiguration wird via GET /api/config vom lokalen Python-Server geladen.
 * Server starten: start.bat (oder python server.py)
 */

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

// ── Fehlermeldung wenn Server nicht läuft ─────────────────────
function showServerError() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const box = document.createElement('div');
  box.style.cssText = [
    'grid-column:1/-1',
    'padding:2.5rem',
    'background:var(--card)',
    'border:1px solid var(--border)',
    'border-radius:12px',
    'text-align:center',
    'color:var(--text-muted)',
    'max-width:480px',
    'margin:2rem auto',
  ].join(';');
  box.innerHTML = `
    <div style="font-size:2.5rem;margin-bottom:1rem">⚠️</div>
    <div style="font-size:1.1rem;font-weight:600;color:var(--text);margin-bottom:0.75rem">
      Server nicht erreichbar
    </div>
    <div style="font-size:0.9rem;line-height:1.6">
      Bitte <strong>start.bat</strong> im Projektordner ausführen,<br>
      dann diese Seite neu laden (<kbd>F5</kbd>).
    </div>
  `;
  grid.appendChild(box);
}

// ── Daten laden ───────────────────────────────────────────────
async function loadData() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    showServerError();
    return null;
  }
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
      // Lokale App → einfacher Anchor mit localapp://-Protokoll
      if (tool.local) {
        const el = document.createElement('a');
        el.className = 'modal__tool-link modal__tool-link--local';

        if (tool.url) {
          el.href  = tool.url;   // z. B. localapp://perplexity
          el.title = 'Lokale App starten';
        }

        const apps = (typeof LOCAL_APPS !== 'undefined') ? LOCAL_APPS : [];
        const key  = (tool.url || '').replace('localapp://', '');
        const meta = apps.find(a => a.key === key);

        const icon = document.createElement('span');
        icon.className   = 'local-icon';
        icon.textContent = (meta && meta.icon) ? meta.icon : '💻';
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
async function init() {
  const data = await loadData();
  if (data) renderGrid(data.usecases);
}

init();

/**
 * local-apps.js – Browser-seitige Liste der verfügbaren lokalen Desktop-Apps.
 * Wird von index.html und settings.html als <script> geladen.
 *
 * Exe-Pfade und App-IDs stehen in launchers/apps.json (für den PowerShell-Launcher).
 * Beide Dateien synchron halten, wenn eine neue App hinzugefügt wird!
 *
 * Tool-URL auf der Startseite: localapp://<key>
 */

const LOCAL_APPS = [
  { key: 'claude-desktop', name: 'Claude Desktop', icon: '🤖' },
  { key: 'perplexity',     name: 'Perplexity',     icon: '🔍' },
  { key: 'comet',          name: 'Comet Browser',  icon: '🌐' }
];

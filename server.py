#!/usr/bin/env python3
"""
server.py – Lokaler Server für KI-Usecases Startseite
Keine externen Abhängigkeiten – nur Python 3 Standardbibliothek.

Endpunkte:
  GET  /api/config  → liefert user-config.json (oder data.json als Fallback)
  POST /api/config  → speichert Body als user-config.json
  *                 → alle anderen Pfade werden als statische Dateien ausgeliefert
"""

import json
import os
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

BASE_DIR    = Path(__file__).parent
CONFIG_FILE = BASE_DIR / 'user-config.json'
DEFAULT_CFG = BASE_DIR / 'data.json'
PORT        = 8080


class Handler(SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    # ── CORS-Header ───────────────────────────────────────────────
    def _cors_headers(self):
        self.send_header('Access-Control-Allow-Origin',  '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    # ── GET /api/config ───────────────────────────────────────────
    def do_GET(self):
        if self.path == '/api/config':
            src = CONFIG_FILE if CONFIG_FILE.exists() else DEFAULT_CFG
            try:
                data = src.read_text(encoding='utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self._cors_headers()
                self.end_headers()
                self.wfile.write(data.encode('utf-8'))
            except Exception as e:
                self.send_error(500, str(e))
        else:
            super().do_GET()

    # ── POST /api/config ──────────────────────────────────────────
    def do_POST(self):
        if self.path == '/api/config':
            try:
                length = int(self.headers.get('Content-Length', 0))
                body   = self.rfile.read(length)
                json.loads(body)  # JSON-Validierung
                CONFIG_FILE.write_bytes(body)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self._cors_headers()
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
            except json.JSONDecodeError:
                self.send_error(400, 'Ungültiges JSON')
            except Exception as e:
                self.send_error(500, str(e))
        else:
            self.send_error(404)

    # ── Logging: nur Fehler ausgeben ──────────────────────────────
    def log_message(self, fmt, *args):
        if len(args) >= 2 and str(args[1]) not in ('200', '304'):
            super().log_message(fmt, *args)


if __name__ == '__main__':
    os.chdir(BASE_DIR)
    httpd = HTTPServer(('localhost', PORT), Handler)
    url   = f'http://localhost:{PORT}'

    print()
    print('=' * 50)
    print('  KI-Usecases Startseite')
    print(f'  Adresse : {url}')
    print('  Beenden : Strg+C')
    print('=' * 50)
    print()

    webbrowser.open(url)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nServer beendet.')

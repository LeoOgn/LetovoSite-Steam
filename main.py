import http.server
import socketserver
import webbrowser
import os
import subprocess
import sys

PORT = 8000

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Завершить процесс, занимающий порт, если он есть
try:
    result = subprocess.run(["lsof", "-ti", f":{PORT}"], capture_output=True, text=True)
    pids = result.stdout.strip()
    if pids:
        subprocess.run(["kill", "-9"] + pids.split(), check=False)
        print(f"Завершён старый процесс на порту {PORT}")
except Exception:
    pass

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

handler = NoCacheHandler
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"Сайт запущен: http://localhost:{PORT}")
    webbrowser.open(f"http://localhost:{PORT}")
    httpd.serve_forever()

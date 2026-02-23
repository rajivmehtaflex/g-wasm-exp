import http.server
import socketserver
from pathlib import Path
import os

os.chdir(Path(__file__).parent / 'www')
with socketserver.TCPServer(('', 8000), http.server.SimpleHTTPRequestHandler) as httpd:
    print('Serving at http://localhost:8000')
    httpd.serve_forever()

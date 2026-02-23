import http.server
import socketserver
import os
from pathlib import Path

PORT = 8000

# Change to www directory to serve files from there
os.chdir(Path(__file__).parent / "www")

Handler = http.server.SimpleHTTPRequestHandler

# Set WASM MIME type - critical for browser to accept WASM
Handler.extensions_map[".wasm"] = "application/wasm"

def main():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == "__main__":
    main()

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**g-wasm-exp** is a Calculator web application where Python math functions run directly in the browser via **Pyodide** (Python compiled to WebAssembly). No server-side API — math is computed in-browser by calling Python functions from JavaScript, just like the original Rust/WASM architecture. It supports 8 operations (add, subtract, multiply, divide, square root, power, percentage, modulo) with live result formatting and error handling for edge cases.

## Tech Stack

- **Math logic**: Python (`www/calculator.py`) — runs in-browser via Pyodide
- **WASM runtime**: [Pyodide](https://pyodide.org) loaded from CDN at runtime — no build step
- **Frontend**: HTML5, CSS3, vanilla JavaScript (ES6 modules)
- **Server**: Python `http.server` (static files only)
- **Runtime Requirements**: Python 3.12+ (for the static server only)

## Common Commands

```bash
# Start local dev server (http://localhost:8000)
python main.py

# Tunnel to public URL via Cloudflare
./cloudflared tunnel --url http://localhost:8000
```

## Project Structure

- **www/calculator.py**: Python math functions (fetched and executed by Pyodide in the browser)
  - 8 functions: `add`, `subtract`, `multiply`, `divide`, `sqrt_a`, `power`, `percentage`, `modulo`
  - Error cases return `float('nan')` which propagates as `NaN` to JS
- **www/index.js**: Loads Pyodide from CDN, fetches `calculator.py`, calls Python functions directly
  - No HTTP API calls — Python functions are called synchronously from JS
  - Live recalculation on every input change
- **www/index.html**: Calculator UI (two number inputs, 8 operation buttons, result display)
- **www/style.css**: UI styling (card layout, blue buttons, responsive)
- **main.py**: Simple `http.server` static file server — serves `www/` directory on port 8000

## Architecture

The flow is:
1. Browser loads `index.html` → `index.js` (ES module)
2. `index.js` dynamically imports Pyodide from CDN and awaits initialization
3. `index.js` fetches `calculator.py` and runs it inside Pyodide (`pyodide.runPython(code)`)
4. JS caches references to each Python function via `pyodide.globals.get(name)`
5. User enters numbers and clicks an operation button (or changes an input)
6. `calculate()` calls the cached Python function directly: `pyFn(a, b)` or `pyFn(a)`
7. Python `float('nan')` becomes JS `NaN`; `formatResult()` uses `Number.isFinite()` to detect errors
8. Result is displayed; non-finite values show red "Error"

When changes are needed:
- **Math logic**: Edit `www/calculator.py` — reload browser to pick up changes
- **Frontend (HTML/CSS/JS)**: Edit files — reload browser (no server restart needed)
- **Static server**: Edit `main.py` — restart with `python main.py`

## Build Artifacts (git-ignored)

- `/www/pkg/` — Legacy WASM directory (no longer used, can be safely deleted)

See README.md for detailed usage and troubleshooting.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**g-wasm-exp** is a complete Calculator web application. The calculator runs in the browser with a Python FastAPI backend handling all math operations. It supports 8 operations (add, subtract, multiply, divide, square root, power, percentage, modulo) with live result formatting and error handling for edge cases.

## Tech Stack

- **Backend Math**: Python FastAPI (8 functions via HTTP API)
- **Frontend**: HTML5, CSS3, vanilla JavaScript (ES6 modules)
- **Server**: FastAPI + uvicorn
- **Runtime Requirements**: Python 3.12+, FastAPI, uvicorn

## Common Commands

```bash
# Start local dev server (http://localhost:8000)
python main.py

# Tunnel to public URL via Cloudflare
./cloudflared tunnel --url http://localhost:8000

# API documentation
# Open http://localhost:8000/docs in browser for interactive API docs
```

## Project Structure

- **main.py**: FastAPI application with 8 calculation endpoints
  - `POST /calculate` endpoint accepts JSON: `{"op": "add|subtract|multiply|divide|sqrt_a|power|percentage|modulo", "a": float, "b": float}`
  - Returns `{"result": float}` on success or `{"error": "message"}` on error
  - Operations:
    - `add(a, b)` = `a + b`
    - `subtract(a, b)` = `a - b`
    - `multiply(a, b)` = `a * b`
    - `divide(a, b)` = `a / b` (error if `b == 0`)
    - `sqrt_a(a, -)` = `sqrt(a)` (error if `a < 0`)
    - `power(a, b)` = `a ** b`
    - `percentage(a, b)` = `a * b / 100`
    - `modulo(a, b)` = `a % b` (error if `b == 0`)
- **www/index.html**: Calculator UI (two number inputs, 8 operation buttons, result display)
- **www/index.js**: Event handlers and async fetch calls to `/calculate` endpoint
- **www/style.css**: UI styling (card layout, blue buttons, responsive)

## Architecture

The flow is:
1. User enters numbers in the HTML form
2. User clicks an operation button
3. `index.js` sends async `POST /calculate` request with operation and operands
4. FastAPI backend performs calculation with Python `math` module
5. Backend returns `{"result": <value>}` or `{"error": "<message>"}`
6. Frontend checks for error field; if present, displays red "Error"; otherwise formats and displays numeric result
7. `formatResult()` applies 10-digit precision formatting

When changes are needed:
- Backend changes: Modify `main.py` operations logic
- Frontend changes (HTML/CSS/JS): No restart needed; just refresh the browser
- After modifying `main.py`: Restart the server (`python main.py`)

## Build Artifacts (git-ignored)

- `/www/pkg/` — Legacy WASM directory (no longer used, can be safely deleted)

See README.md for detailed usage, troubleshooting, and API reference.

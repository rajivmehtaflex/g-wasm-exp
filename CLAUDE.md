# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**g-wasm-exp** is a complete WASM Calculator web application. The calculator runs in the browser with Rust-compiled WebAssembly handling all math operations, and a Python dev server for local hosting. It supports 8 operations (add, subtract, multiply, divide, square root, power, percentage, modulo) with live result formatting and error handling for edge cases.

## Tech Stack

- **Backend Math**: Rust (8 functions compiled to WASM via wasm-pack)
- **Frontend**: HTML5, CSS3, vanilla JavaScript (ES6 modules)
- **Build**: wasm-pack 0.13.1
- **Server**: Python 3.12 (http.server)
- **Runtime Requirements**: Rust 1.93.1+, wasm-pack 0.13.1+, Python 3.12+

## Common Commands

```bash
# Build WASM module (run after modifying calculator/src/lib.rs)
bash build.sh

# Start local dev server (http://localhost:8000)
python main.py

# Tunnel to public URL via Cloudflare
./cloudflared tunnel --url http://localhost:8000
```

## Project Structure

- **calculator/src/lib.rs**: 8 Rust functions marked with `#[wasm_bindgen]`
  - `add(a, b)`, `subtract(a, b)`, `multiply(a, b)`, `divide(a, b)` (division by zero → NaN)
  - `sqrt_a(a)` (negative values → NaN), `power(a, b)`, `percentage(a, b)`, `modulo(a, b)` (modulo by zero → NaN)
- **calculator/Cargo.toml**: Rust project config (wasm-bindgen dependency, release profile optimized for size)
- **www/index.html**: Calculator UI (two number inputs, 8 operation buttons, result display)
- **www/index.js**: Event handlers and WASM initialization (imports all 8 functions from generated `pkg/calculator.js`)
- **www/style.css**: UI styling (card layout, blue buttons, responsive)
- **build.sh**: Builds WASM with `wasm-pack build calculator --target web --out-dir ../www/pkg --release`
- **main.py**: Serves `www/` on port 8000 with WASM MIME type fix

## Architecture

The flow is:
1. User enters numbers in the HTML form
2. User clicks an operation button
3. `index.js` calls the corresponding WASM function (e.g., `divide(a, b)`)
4. Rust function returns `f64` (returns `NaN` for errors like division by zero)
5. `formatResult()` formats the value, checks if finite, applies 10-digit precision
6. Result displayed in UI; "Error" in red for non-finite values

When to rebuild:
- After modifying `calculator/src/lib.rs`
- After updating `calculator/Cargo.toml` dependencies
- Frontend changes (HTML/CSS/JS) don't require rebuild; just refresh the browser

## Build Artifacts (git-ignored)

- `/calculator/target/` — Rust intermediate build files
- `/www/pkg/` — Generated WASM and JS glue code (auto-created by `build.sh`)

See README.md for detailed usage, troubleshooting, and API reference.

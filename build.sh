#!/usr/bin/env bash
set -e
source "$HOME/.cargo/env"
wasm-pack build calculator --target web --out-dir ../www/pkg --release
echo "Build complete. Run: python main.py"

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**g-wasm-exp** is a WASM Calculator project. The goal is to create a web-based calculator application that uses WebAssembly for computation. The UI reference (ref.png) shows a calculator interface with two input fields (Number A, Number B) and four operation buttons (+, −, ×, ÷).

## Development Setup

- **Python Version**: 3.12 (configured in `.python-version`)
- **Package Manager**: uv (uses `pyproject.toml` and `uv.lock`)
- **Virtual Environment**: `.venv` (already created)

## Common Commands

```bash
# Run the main application
python main.py

# (Add build/test/lint commands as the project develops)
```

## Architecture Notes

Currently, the project structure is minimal:
- **main.py**: Entry point with a basic "Hello" message. This will likely be expanded or replaced with WASM compilation tooling and a development server.
- **ref.png**: UI reference showing the target calculator design

As the project grows, expect:
- Frontend code (HTML/CSS/JavaScript for the calculator UI)
- WebAssembly module(s) containing calculator logic
- Build configuration (likely Makefile, build script, or task runner for compiling WASM)
- Potential language choice for WASM source (e.g., Go, Rust, C)

## Next Steps for Development

- Define the tech stack: Choose the language for WASM compilation (e.g., Go, Rust, C)
- Set up build tooling for compiling to WASM
- Implement the calculator operations (add, subtract, multiply, divide)
- Create the web UI matching the ref.png design
- Add testing infrastructure

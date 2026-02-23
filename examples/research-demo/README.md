# Research Demo — Task Tracker

A small task tracker application used as a research target for the AI Workflows workshop. The project has enough moving parts (frontend, backend, docs) to make agent-driven research non-trivial.

## What's Here

- **backend/** — Express API with SQLite storage and JWT auth
- **frontend/** — Vanilla JS SPA with custom state management
- **docs/** — Architecture and API documentation

## Workshop Usage

This project is a **research target**, not a running application. It exists so agents can read through it and produce findings. The demo shows:

1. **Single-agent research** — one agent reads everything sequentially, burning context
2. **Multi-agent research** — three parallel agents, each focused on one slice:
   - Backend agent: routes, middleware, DB schema
   - Frontend agent: components, state management, API client
   - Docs agent: what's documented, gaps vs actual code

The multi-agent approach is faster and keeps each agent's context window focused.

## Interesting Properties

- Auth flow spans frontend → backend (traces across `api.js` → `middleware/auth.js` → `routes/auth.js`)
- DB schema lives in code (`db.js`), not in docs
- Docs are slightly out of date vs the actual code — realistic research finding
- State management is custom, not a library — requires reading to understand

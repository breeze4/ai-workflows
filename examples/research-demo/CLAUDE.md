# Task Tracker

A task tracking application with an Express/SQLite backend and vanilla JS frontend.

## Project Structure

- `backend/` — Express API server with SQLite storage
- `frontend/` — Vanilla JS single-page app (Vite dev server)
- `docs/` — Architecture and API documentation

## Running

```bash
# Backend
cd backend && npm install && npm start  # runs on :3001

# Frontend
cd frontend && npm install && npm run dev  # runs on :5173
```

## Key Patterns

- Auth uses JWT tokens — see `backend/middleware/auth.js`
- Frontend state is managed by a custom store (`frontend/src/store.js`), not a library
- SQLite database is created automatically on first run
- API client in `frontend/src/api.js` handles token storage and request formatting

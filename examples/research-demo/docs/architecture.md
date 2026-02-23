# Architecture

## Overview

The Task Tracker is a two-tier web application: a REST API backend and a single-page frontend. They run as separate processes during development and could be deployed independently.

## Backend

- **Runtime:** Node.js + Express
- **Storage:** SQLite via `better-sqlite3` (file-based, no external DB dependency)
- **Auth:** JWT-based token authentication
- **Port:** 3001 (configurable via `PORT` env var)

The backend is structured around Express router modules. Each route file in `routes/` handles a resource. Middleware in `middleware/` provides cross-cutting concerns like authentication.

Database initialization happens on startup in `db.js`. The schema is created if it doesn't exist (tables are created with `CREATE TABLE IF NOT EXISTS`).

## Frontend

- **Bundler:** Vite
- **Framework:** None — vanilla JS with a custom state management pattern
- **Port:** 5173 (Vite default)

The frontend uses a simple publish/subscribe store for state management. Components render into the DOM manually. There is no virtual DOM or component lifecycle — just functions that produce HTML and attach event listeners.

## Communication

Frontend talks to the backend via `fetch()` calls in `src/api.js`. The API client:
1. Prepends the backend base URL (`http://localhost:3001/api`)
2. Attaches the JWT token from localStorage to every request
3. Parses JSON responses and handles errors

## Deployment

Not yet defined. The intent is to containerize both services and run behind a reverse proxy. For now it's local development only.

## Authentication Flow

1. User submits credentials via the Login component
2. Frontend POSTs to `/api/auth/login`
3. Backend validates credentials, returns a JWT
4. Frontend stores the JWT in localStorage
5. All subsequent API requests include the token in the `Authorization` header
6. Backend middleware validates the token and attaches `req.user` before route handlers run

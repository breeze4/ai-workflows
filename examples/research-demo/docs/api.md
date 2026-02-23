# API Reference

Base URL: `http://localhost:3001/api`

All endpoints except login require a valid JWT in the `Authorization: Bearer <token>` header.

## Authentication

### POST /auth/login

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "username": "string"
  }
}
```

**Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

## Tasks

### GET /tasks

Retrieve all tasks for the authenticated user.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "string",
    "description": "string",
    "status": "pending | completed",
    "created_at": "ISO 8601 string",
    "updated_at": "ISO 8601 string"
  }
]
```

### POST /tasks

Create a new task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string (optional)"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "status": "pending",
  "created_at": "ISO 8601 string",
  "updated_at": "ISO 8601 string"
}
```

### PUT /tasks/:id

Update an existing task.

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "pending | completed (optional)"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "status": "string",
  "created_at": "ISO 8601 string",
  "updated_at": "ISO 8601 string"
}
```

### DELETE /tasks/:id

Delete a task.

**Response (204):** No content.

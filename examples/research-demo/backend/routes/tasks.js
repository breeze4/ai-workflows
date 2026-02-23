const express = require('express');
const { getDb } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(requireAuth);

// GET /api/tasks — list tasks for the authenticated user
// Supports ?status=pending|completed to filter by status
router.get('/', (req, res) => {
  const db = getDb();
  const { status } = req.query;

  let query = 'SELECT * FROM tasks WHERE user_id = ?';
  const params = [req.user.id];

  if (status && ['pending', 'completed'].includes(status)) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';

  const tasks = db.prepare(query).all(...params);
  res.json(tasks);
});

// POST /api/tasks — create a new task
router.post('/', (req, res) => {
  const db = getDb();
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const result = db.prepare(
    'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)'
  ).run(req.user.id, title.trim(), description || '');

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

// PUT /api/tasks/:id — update a task
router.put('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { title, description, status } = req.body;

  // Verify task belongs to user
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updates = [];
  const params = [];

  if (title !== undefined) {
    updates.push('title = ?');
    params.push(title.trim());
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (status !== undefined) {
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push("updated_at = datetime('now')");
  params.push(id, req.user.id);

  db.prepare(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`
  ).run(...params);

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(task);
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;

  const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(204).send();
});

module.exports = router;

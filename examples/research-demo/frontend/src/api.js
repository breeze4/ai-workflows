import { getState, setState } from './store.js';

const BASE_URL = 'http://localhost:3001/api';

async function request(path, options = {}) {
  const { token } = getState();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// Auth

export async function login(username, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  localStorage.setItem('token', data.token);
  setState({ token: data.token, user: data.user, error: null });
  return data;
}

// Tasks

export async function fetchTasks() {
  setState({ loading: true });
  try {
    const tasks = await request('/tasks');
    setState({ tasks, loading: false, error: null });
    return tasks;
  } catch (err) {
    setState({ loading: false, error: err.message });
    throw err;
  }
}

export async function createTask(title, description) {
  const task = await request('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });

  const { tasks } = getState();
  setState({ tasks: [task, ...tasks], error: null });
  return task;
}

export async function updateTask(id, updates) {
  const task = await request(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

  const { tasks } = getState();
  setState({
    tasks: tasks.map((t) => (t.id === id ? task : t)),
    error: null,
  });
  return task;
}

export async function deleteTask(id) {
  await request(`/tasks/${id}`, { method: 'DELETE' });

  const { tasks } = getState();
  setState({
    tasks: tasks.filter((t) => t.id !== id),
    error: null,
  });
}

import { subscribe, isAuthenticated, getState, logout } from './store.js';
import { fetchTasks } from './api.js';
import { renderLogin } from './components/Login.js';
import { renderTaskList } from './components/TaskList.js';
import { renderTaskForm } from './components/TaskForm.js';

const root = document.getElementById('app');

function render() {
  if (!isAuthenticated()) {
    root.innerHTML = `<h1>Task Tracker</h1>`;
    root.appendChild(renderLogin());
    return;
  }

  const { error } = getState();

  root.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h1>Task Tracker</h1>
      <button id="logout-btn" class="secondary">Logout</button>
    </div>
    ${error ? `<div class="error">${error}</div>` : ''}
  `;

  root.appendChild(renderTaskForm());
  root.appendChild(renderTaskList());

  root.querySelector('#logout-btn').addEventListener('click', () => {
    logout();
  });
}

// Re-render on state change
subscribe(() => render());

// Initial render
render();

// If already authenticated, fetch tasks
if (isAuthenticated()) {
  fetchTasks();
}

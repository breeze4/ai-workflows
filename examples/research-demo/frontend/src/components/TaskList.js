import { getState } from '../store.js';
import { updateTask, deleteTask } from '../api.js';

export function renderTaskList() {
  const container = document.createElement('div');
  const { tasks, loading } = getState();

  if (loading) {
    container.innerHTML = '<p>Loading tasks...</p>';
    return container;
  }

  if (tasks.length === 0) {
    container.innerHTML = '<p>No tasks yet. Create one above.</p>';
    return container;
  }

  tasks.forEach((task) => {
    const item = document.createElement('div');
    item.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;

    item.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        ${task.description ? `<p>${task.description}</p>` : ''}
      </div>
      <div class="actions">
        <button class="toggle-btn secondary">
          ${task.status === 'completed' ? 'Undo' : 'Done'}
        </button>
        <button class="delete-btn danger">Delete</button>
      </div>
    `;

    item.querySelector('.toggle-btn').addEventListener('click', () => {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      updateTask(task.id, { status: newStatus });
    });

    item.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTask(task.id);
    });

    container.appendChild(item);
  });

  return container;
}

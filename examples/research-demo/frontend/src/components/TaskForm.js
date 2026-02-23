import { createTask } from '../api.js';

export function renderTaskForm() {
  const container = document.createElement('div');
  container.style.marginBottom = '1.5rem';

  container.innerHTML = `
    <form id="task-form">
      <div class="form-group">
        <input type="text" id="task-title" placeholder="Task title" required />
      </div>
      <div class="form-group">
        <textarea id="task-desc" placeholder="Description (optional)" rows="2"></textarea>
      </div>
      <button type="submit">Add Task</button>
    </form>
  `;

  container.querySelector('#task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = container.querySelector('#task-title').value;
    const description = container.querySelector('#task-desc').value;

    try {
      await createTask(title, description);
      container.querySelector('#task-title').value = '';
      container.querySelector('#task-desc').value = '';
    } catch (err) {
      // Error is set in store by the api module
    }
  });

  return container;
}

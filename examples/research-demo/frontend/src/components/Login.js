import { login } from '../api.js';
import { getState } from '../store.js';

export function renderLogin() {
  const container = document.createElement('div');

  const { error } = getState();

  container.innerHTML = `
    <form id="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required />
      </div>
      ${error ? `<div class="error">${error}</div>` : ''}
      <button type="submit">Log In</button>
    </form>
  `;

  container.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = container.querySelector('#username').value;
    const password = container.querySelector('#password').value;

    try {
      await login(username, password);
    } catch (err) {
      // Error is set in store by the api module
    }
  });

  return container;
}

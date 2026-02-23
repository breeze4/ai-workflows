// Simple publish/subscribe state management.
// Components subscribe to state changes and re-render when relevant state updates.

const state = {
  user: null,
  token: localStorage.getItem('token'),
  tasks: [],
  error: null,
  loading: false,
};

const listeners = new Set();

function getState() {
  return { ...state };
}

function setState(updates) {
  Object.assign(state, updates);
  notify();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((fn) => fn(getState()));
}

// Convenience: check if user is authenticated
function isAuthenticated() {
  return !!state.token;
}

// Clear auth state on logout
function logout() {
  localStorage.removeItem('token');
  setState({ user: null, token: null, tasks: [] });
}

export { getState, setState, subscribe, isAuthenticated, logout };

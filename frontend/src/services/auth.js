export const auth = {
  set(token, role) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  },
  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  },
  token() { return localStorage.getItem('token'); },
  role() { return localStorage.getItem('role'); },
  is(role) { return localStorage.getItem('role') === role; },
  loggedIn() { return !!localStorage.getItem('token'); }
};

import client, { clearAuth } from './client';

export async function login({ email, password }) {
  const { data } = await client.post('/auth/login', { email, password });
  // Expect: { token, user: { id, email, role, name } }
  localStorage.setItem('auth', JSON.stringify(data));
  return data;
}

export function logout() {
  clearAuth();
  window.location.replace('/login');
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem('auth')) || null;
  } catch {
    return null;
  }
}

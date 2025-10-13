import client, { authStorage } from './client';

export async function login({ email, password }) {
  const { data } = await client.post('/auth/login', { email, password });
  // { token, user: { id, email, role, name } }
  authStorage.set(data);
  return data;
}

export function getCurrentUser() {
  return authStorage.get()?.user || null;
}

export function logout() {
  authStorage.clear();
  location.replace('/login');
}

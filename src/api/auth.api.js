// src/api/auth.api.js
import { API } from './api';

/**
 * Login endpoint
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: { id, email, role, name } }>}
 */
export async function login(email, password) {
  const { data } = await API.post('/auth/login', { email, password });
  return data; // { token, user }
}

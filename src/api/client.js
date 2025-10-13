import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const authStorage = {
  get() {
    try {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(auth) {
    localStorage.setItem('auth', JSON.stringify(auth));
  },
  clear() {
    localStorage.removeItem('auth');
  },
};

const client = axios.create({ baseURL, timeout: 15000 });

client.interceptors.request.use((config) => {
  const auth = authStorage.get();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      authStorage.clear();
      // hard redirect keeps it simple and robust
      if (location.pathname !== '/login') location.replace('/login');
    }
    return Promise.reject(err);
  }
);

export default client;

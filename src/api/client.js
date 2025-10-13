import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const getToken = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth?.token || null;
  } catch {
    return null;
  }
};

export const getUser = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth'));
    return auth?.user || null;
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem('auth');
};

const client = axios.create({
  baseURL,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

// Request auth header
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response normalization + 401 handling
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      clearAuth();
      // Hard redirect ensures app state resets
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    // Normalize error shape
    const apiMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Request failed';
    return Promise.reject({
      status,
      message: apiMsg,
      data: err?.response?.data,
    });
  }
);

export default client;

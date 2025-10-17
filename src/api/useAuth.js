import { useEffect, useState } from 'react';
import { setAuthToken } from './api';
const KEY = 'auth';
export function useAuth() {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  });
  useEffect(() => { auth?.token ? setAuthToken(auth.token) : setAuthToken(); }, [auth]);
  function signIn(payload) { localStorage.setItem(KEY, JSON.stringify(payload)); setAuth(payload); }
  function signOut() { localStorage.removeItem(KEY); setAuth(null); }
  return { auth, signIn, signOut, isLoggedIn: !!auth?.token, role: auth?.user?.role };
}

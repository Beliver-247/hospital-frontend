import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../api/auth';
import { useState } from 'react';

export default function Topbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [q, setQ] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/patients?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4">
      <div className="hidden md:block">
        <div className="text-sm text-gray-500">Good Afternoon, {user?.name || 'Doctor'}</div>
        <div className="font-semibold">Welcome to your dashboard</div>
      </div>

      <form onSubmit={onSearch} className="flex-1 max-w-xl mx-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search patients…"
          className="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 ring-emerald-600"
        />
      </form>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-gray-600">{user?.role}</span>
        <button onClick={logout} className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm">Logout</button>
      </div>
    </header>
  );
}

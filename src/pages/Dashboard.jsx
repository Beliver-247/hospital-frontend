import { getSession, logout } from '../api/auth';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const session = getSession();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={logout}
          className="px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black"
        >
          Logout
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/patients/new"
          className="block rounded-xl border bg-white p-6 hover:shadow"
        >
          <div className="text-lg font-medium">Create New Patient</div>
          <div className="text-gray-600 text-sm">Start a new record</div>
        </Link>
        <div className="rounded-xl border bg-white p-6 opacity-60">
          <div className="text-lg font-medium">Search Patients</div>
          <div className="text-gray-600 text-sm">Coming next</div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Logged in as <span className="font-medium">{session?.user?.name}</span> (
        <span className="font-mono">{session?.user?.role}</span>)
      </div>
    </div>
  );
}

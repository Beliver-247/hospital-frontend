import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../api/auth';

export default function ProtectedRoute({ roles = null }) {
  const session = getSession();
  const token = session?.token;
  const role = session?.user?.role;

  if (!token) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(role)) {
    // Explicit block for PATIENT or any unauthorized role
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border p-6 bg-white shadow">
          <h1 className="text-xl font-semibold mb-2">Insufficient permissions</h1>
          <p className="text-gray-600">
            Your role (<span className="font-mono">{role}</span>) is not allowed to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

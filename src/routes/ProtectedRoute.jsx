import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';

export default function ProtectedRoute({ roles }) {
  const user = getCurrentUser();
  const hasToken = !!user || !!localStorage.getItem('auth');
  if (!hasToken) return <Navigate to="/login" replace />;

  if (roles?.length) {
    const role = user?.role;
    if (!roles.includes(role)) {
      return (
        <div className="p-10 text-center">
          <h1 className="text-xl font-semibold">Insufficient permissions</h1>
          <p className="text-gray-600 mt-2">
            Your role doesn’t allow this action.
          </p>
        </div>
      );
    }
  }
  return <Outlet />;
}

import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import PatientsNew from './pages/PatientsNew';
import Dashboard from './pages/Dashboard';
import './styles/index.css';

const qc = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
    mutations: { retry: 0 },
  },
});

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto p-4 flex items-center gap-4">
          <Link to="/" className="font-semibold">Hospital</Link>
          <nav className="text-sm text-gray-600 flex gap-4">
            <Link to="/">Dashboard</Link>
            <Link to="/patients/new">Create Patient</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <Shell>
                  <Dashboard />
                </Shell>
              }
            />
          </Route>

          {/* Only DOCTOR or STAFF can access patient creation */}
          <Route element={<ProtectedRoute roles={['DOCTOR', 'STAFF']} />}>
            <Route
              path="/patients/new"
              element={
                <Shell>
                  <PatientsNew />
                </Shell>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

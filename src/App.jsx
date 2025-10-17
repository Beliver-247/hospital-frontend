import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AppLayout from './layout/AppLayout.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PatientsNew from './pages/PatientsNew.jsx';
import PatientsDetail from './pages/PatientsDetail.jsx';
import PatientsEdit from './pages/PatientsEdit.jsx';
import PatientsSearch from './pages/PatientsSearch.jsx';
import Payments from './pages/Payments/Payments.jsx';
import CreditCardPayment from './pages/Payments/CreditCardPayment.jsx';
import InsurancePayment from './pages/Payments/InsurancePayment.jsx';
import HospitalSelection from './pages/HospitalSelection.jsx';

const qc = new QueryClient();

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
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
          </Route>

          <Route element={<ProtectedRoute roles={['DOCTOR','STAFF']} />}>
            <Route
              path="/patients/new"
              element={
                <AppLayout>
                  <PatientsNew />
                </AppLayout>
              }
            />
            <Route
              path="/hospital-selection"
              element={
                <AppLayout>
                  <HospitalSelection />
                </AppLayout>
              }
            />
            <Route
              path="/patients"
              element={
                <AppLayout>
                  <PatientsSearch />
                </AppLayout>
              }
            />
            <Route
              path="/patients/:idOrPid"
              element={
                <AppLayout>
                  <PatientsDetail />
                </AppLayout>
              }
            />
            <Route
              path="/patients/:idOrPid/edit"
              element={
                <AppLayout>
                  <PatientsEdit />
                </AppLayout>
              }
            />
            <Route
              path="/billing"
              element={
                <AppLayout>
                  <Payments />
                </AppLayout>
              }
            />
            <Route
              path="/billing/credit-card"
              element={
                <AppLayout>
                  <CreditCardPayment />
                </AppLayout>
              }
            />
            <Route
              path="/billing/insurance"
              element={
                <AppLayout>
                  <InsurancePayment />
                </AppLayout>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

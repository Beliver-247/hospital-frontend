import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AppLayout from "./layout/AppLayout.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PatientsNew from "./pages/PatientsNew.jsx";
import PatientsDetail from "./pages/PatientsDetail.jsx";
import PatientsEdit from "./pages/PatientsEdit.jsx";
import PatientsSearch from "./pages/PatientsSearch.jsx";
import ReportsLayout from "./layout/ReportsLayout.jsx";
import Reports from "./pages/Reports.jsx";
import ReportHistory from "./pages/ReportHistory.jsx";
import DoctorsNew from "./pages/DoctorsNew.jsx";
import DoctorsList from "./pages/DoctorsList.jsx";

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

          <Route element={<ProtectedRoute roles={["STAFF"]} />}>
            <Route
              path="/doctors"
              element={
                <AppLayout>
                  <DoctorsList />
                </AppLayout>
              }
            />
            <Route
              path="/doctors/new"
              element={
                <AppLayout>
                  <DoctorsNew />
                </AppLayout>
              }
            />
          </Route>

          <Route element={<ProtectedRoute roles={["DOCTOR", "STAFF"]} />}>
            <Route
              path="/patients/new"
              element={
                <AppLayout>
                  <PatientsNew />
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
              path="/reports"
              element={
                <ReportsLayout>
                  <Reports />
                </ReportsLayout>
              }
            />
            <Route
              path="/reports/history"
              element={
                <ReportsLayout>
                  <ReportHistory />
                </ReportsLayout>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

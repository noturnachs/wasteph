import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inquiries from "./pages/Inquiries";
import Leads from "./pages/Leads";
import Potentials from "./pages/Potentials";
import Clients from "./pages/Clients";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="leads" element={<Leads />} />
              <Route path="potentials" element={<Potentials />} />
              <Route path="clients" element={<Clients />} />
            </Route>
          </Route>

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

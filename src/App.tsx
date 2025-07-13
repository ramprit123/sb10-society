import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TenantProvider } from "./contexts/TenantContext";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import AllSocieties from "./pages/AllSocieties";
import Residents from "./pages/Residents";
import MaintenanceBills from "./pages/MaintenanceBills";
import Complaints from "./pages/Complaints";
import Facilities from "./pages/Facilities";
import Security from "./pages/Security";
import EventsNotices from "./pages/EventsNotices";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Payments from "./pages/Payments";
import FinancialReports from "./pages/FinancialReports";
import Announcements from "./pages/Announcements";
import Meetings from "./pages/Meetings";
import VisitorLogs from "./pages/VisitorLogs";
import AccessControl from "./pages/AccessControl";
import UserManagement from "./pages/UserManagement";
import SystemSettings from "./pages/SystemSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import TenantRoute from "./components/TenantRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route index element={<Navigate to="login" replace />} />
            </Route>

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Global Routes (Multi-tenant overview) */}
              <Route index element={<Dashboard />} />
              <Route path="societies" element={<AllSocieties />} />
              <Route path="analytics" element={<Analytics />} />

              {/* Tenant-specific Routes */}
              <Route path="tenant/:tenantId" element={<TenantRoute />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="residents" element={<Residents />} />
                <Route path="maintenance" element={<MaintenanceBills />} />
                <Route path="payments" element={<Payments />} />
                <Route
                  path="financial-reports"
                  element={<FinancialReports />}
                />
                <Route path="complaints" element={<Complaints />} />
                <Route path="facilities" element={<Facilities />} />
                <Route path="security" element={<Security />} />
                <Route path="visitor-logs" element={<VisitorLogs />} />
                <Route path="access-control" element={<AccessControl />} />
                <Route path="events" element={<EventsNotices />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="meetings" element={<Meetings />} />
                <Route path="settings" element={<Settings />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="system-settings" element={<SystemSettings />} />
              </Route>
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import TenantRoute from "./components/TenantRoute";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AccessControl from "./pages/AccessControl";
import AllSocieties from "./pages/AllSocieties";
import Analytics from "./pages/Analytics";
import Announcements from "./pages/Announcements";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Complaints from "./pages/Complaints";
import Dashboard from "./pages/Dashboard";
import EventsNotices from "./pages/EventsNotices";
import Facilities from "./pages/Facilities";
import FinancialReports from "./pages/FinancialReports";
import MaintenanceBills from "./pages/MaintenanceBills";
import Meetings from "./pages/Meetings";
import Payments from "./pages/Payments";
import PollsSurveys from "./pages/PollsSurveys";
import Residents from "./pages/Residents";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import SystemSettings from "./pages/SystemSettings";
import UserManagement from "./pages/UserManagement";
import VisitorLogs from "./pages/VisitorLogs";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Router>
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
              <Route path="financial-reports" element={<FinancialReports />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="security" element={<Security />} />
              <Route path="visitor-logs" element={<VisitorLogs />} />
              <Route path="access-control" element={<AccessControl />} />
              <Route path="events" element={<EventsNotices />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="polls-surveys" element={<PollsSurveys />} />
              <Route path="meetings" element={<Meetings />} />
              <Route path="settings" element={<Settings />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="system-settings" element={<SystemSettings />} />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "./context/AuthContext";

import AppLayout     from "./components/layout/AppLayout";
import LoginPage     from "./pages/LoginPage";
import RegisterPage  from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BillsPage     from "./pages/BillsPage";
import RemindersPage from "./pages/RemindersPage";
import ScanPage      from "./pages/ScanPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage  from "./pages/SettingsPage";
import LandingPage  from "./pages/LandingPage";
import ContactPage  from "./pages/ContactPage";
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index            element={<DashboardPage />} />
          <Route path="bills"     element={<BillsPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="scan"      element={<ScanPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings"  element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
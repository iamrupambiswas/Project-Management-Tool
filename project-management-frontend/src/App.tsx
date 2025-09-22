import './App.css';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import './index.css'

function App() {
  const isAuthenticated = useAuthStore((state) => state.token);
  const location = useLocation();

  const hideLayout = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex h-screen bg-background-dark text-text-base">
      {isAuthenticated && !hideLayout && <Sidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {isAuthenticated && !hideLayout && <Topbar />}

        <main className="flex-1 overflow-y-auto bg-background-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <ProtectedRoute>
                  <Teams />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

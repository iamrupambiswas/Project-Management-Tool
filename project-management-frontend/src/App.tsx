import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import './index.css'

function App() {
  const isAuthenticated = true; // Placeholder: Replace with your actual auth check

  return (
    <div className="flex h-screen bg-background-dark text-text-base">
      {isAuthenticated && <Sidebar />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {isAuthenticated && <Topbar />}

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
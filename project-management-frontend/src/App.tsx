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
import Members from './pages/Members';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import { Analytics } from "@vercel/analytics/react";
import Tasks from './pages/Task';
import TaskDetails from './pages/TaskDetails';

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
            <Route 
              path="/members" 
              element={<Members />} 
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetails />
                </ProtectedRoute>
              }
            />

          </Routes>

          <Analytics />
          
        </main>
      </div>
    </div>
  );
}

export default App;

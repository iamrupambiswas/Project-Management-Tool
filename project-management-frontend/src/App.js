import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import './index.css';
import Members from './pages/Members';
import Projects from './pages/Projects';
function App() {
    const isAuthenticated = useAuthStore((state) => state.token);
    const location = useLocation();
    const hideLayout = location.pathname === "/login" || location.pathname === "/register";
    return (_jsxs("div", { className: "flex h-screen bg-background-dark text-text-base", children: [isAuthenticated && !hideLayout && _jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [isAuthenticated && !hideLayout && _jsx(Topbar, {}), _jsx("main", { className: "flex-1 overflow-y-auto bg-background-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard" }) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/teams", element: _jsx(ProtectedRoute, { children: _jsx(Teams, {}) }) }), _jsx(Route, { path: "/members", element: _jsx(Members, {}) }), _jsx(Route, { path: "/projects", element: _jsx(ProtectedRoute, { children: _jsx(Projects, {}) }) })] }) })] })] }));
}
export default App;

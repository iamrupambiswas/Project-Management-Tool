import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
export default function ProtectedRoute({ children }) {
    const token = useAuthStore((s) => s.token);
    if (!token)
        return _jsx(Navigate, { to: "/login", replace: true });
    return children;
}

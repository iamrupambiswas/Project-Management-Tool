import { useAuthStore } from "../store/authStore";
import AdminDashboard from "./dashboard/AdminDashboard";
import UserDashboard from "./dashboard/UserDashboard";

export default function DashboardWidgets() {
  const { user } = useAuthStore();

  const roles = Array.isArray(user?.roles)
    ? user.roles.map((r: any) => (typeof r === "string" ? r : r.name))
    : [];

  if (roles.includes("ADMIN")) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}

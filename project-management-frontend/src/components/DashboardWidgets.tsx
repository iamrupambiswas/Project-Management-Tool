import { useAuthStore } from "../store/authStore";
import AdminDashboard from "./dashboard/AdminDashboard";
import UserDashboard from "./dashboard/UserDashboard";

export default function DashboardWidgets() {
  const { user } = useAuthStore();

  const roles = Array.isArray(user?.roles)
    ? user.roles.map((r: any) => (typeof r === "string" ? r : r.name))
    : [];

  const firstName = user?.username?.split(" ")[0] || "User";

  const isAdmin = roles.includes("ADMIN");

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* --- Welcome Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Welcome back, <span className="text-accent-blue">{firstName}</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {isAdmin
              ? "Here’s a quick overview of your company’s activity."
              : "Here’s your personal productivity summary."}
          </p>
        </div>
      </div>

      {/* --- Dashboard --- */}
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

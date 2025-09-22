import { Home, FolderKanban, Users, CheckSquare, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import NavItem from "./NavItem";

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <aside className="w-64 flex-shrink-0 bg-background-dark text-text-muted font-sans shadow-xl flex flex-col border-r border-background-light transition-all duration-300">
      <div className="p-4 text-xl md:text-2xl font-bold text-accent-blue bg-background-light border-b border-background-dark">
        Project<span className="text-white">Flow</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 md:p-4 md:space-y-2">
        <NavItem
          icon={<Home size={16} md:size={18} />}
          label="Dashboard"
          onClick={() => navigate("/")}
        />
        <NavItem
          icon={<Users size={16} md:size={18} />}
          label="Teams"
          onClick={() => navigate("/teams")}
        />
        <NavItem
          icon={<FolderKanban size={16} md:size={18} />}
          label="Projects"
          onClick={() => navigate("/projects")}
        />
        <NavItem
          icon={<CheckSquare size={16} md:size={18} />}
          label="Tasks"
          onClick={() => navigate("/tasks")}
        />
        <NavItem
          icon={<User size={16} />}
          label="Members"
          onClick={() => navigate("/members")}
        />
      </nav>
      <div className="p-3 md:p-4">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center justify-center w-full gap-2 p-2 md:p-3 text-xs md:text-sm font-semibold text-white transition-colors duration-200 bg-error-red rounded-lg hover:bg-red-700"
        >
          <LogOut size={16} md:size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
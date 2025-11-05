import { Home, FolderKanban, Users, CheckSquare, LogOut, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import NavItem from "./NavItem";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ open = false, onClose }: SidebarProps) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-background-dark text-text-muted font-sans shadow-xl flex-col border-r border-background-light">
        <div className="p-4 text-xl md:text-2xl font-bold text-accent-blue bg-background-light border-b border-background-dark">
          Project<span className="text-white">Flow</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 md:p-4 md:space-y-2">
          <NavItem
            icon={<Home className="w-4 h-4 md:w-5 md:h-5" />}
            label="Dashboard"
            onClick={() => navigate("/")}
          />
          <NavItem
            icon={<Users className="w-4 h-4 md:w-5 md:h-5" />}
            label="Teams"
            onClick={() => navigate("/teams")}
          />
          <NavItem
            icon={<FolderKanban className="w-4 h-4 md:w-5 md:h-5" />}
            label="Projects"
            onClick={() => navigate("/projects")}
          />
          <NavItem
            icon={<CheckSquare className="w-4 h-4 md:w-5 md:h-5" />}
            label="Tasks"
            onClick={() => navigate("/tasks")}
          />
          <NavItem
            icon={<User size={16} />}
            label="Members"
            onClick={() => navigate("/members")}
          />
        </nav>
      </aside>

      {/* Mobile overlay sidebar */}
      <div className={`md:hidden ${open ? 'fixed inset-0 z-50' : 'hidden'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        {/* Panel */}
        <div className={`absolute inset-y-0 left-0 w-64 bg-background-dark text-text-muted font-sans shadow-xl border-r border-background-light transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex items-center justify-between text-xl font-bold text-accent-blue bg-background-light border-b border-background-dark">
            <span>
              Project<span className="text-white">Flow</span>
            </span>
            <button aria-label="Close sidebar" onClick={onClose} className="text-text-muted hover:text-text-base">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            <NavItem
              icon={<Home className="w-4 h-4" />}
              label="Dashboard"
              onClick={() => { navigate("/"); onClose && onClose(); }}
            />
            <NavItem
              icon={<Users className="w-4 h-4" />}
              label="Teams"
              onClick={() => { navigate("/teams"); onClose && onClose(); }}
            />
            <NavItem
              icon={<FolderKanban className="w-4 h-4" />}
              label="Projects"
              onClick={() => { navigate("/projects"); onClose && onClose(); }}
            />
            <NavItem
              icon={<CheckSquare className="w-4 h-4" />}
              label="Tasks"
              onClick={() => { navigate("/tasks"); onClose && onClose(); }}
            />
            <NavItem
              icon={<User size={16} />}
              label="Members"
              onClick={() => { navigate("/members"); onClose && onClose(); }}
            />
          </nav>
        </div>
      </div>
    </>
  );
}
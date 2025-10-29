import {
  Bell,
  LayoutDashboard,
  Users,
  User,
  Folder,
  ListChecks,
  LogOut,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ComponentType, useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

type LucideIcon = ComponentType<{ size: number; className?: string }>;

const routeMaps: { path: RegExp; title: string; Icon: LucideIcon }[] = [
  { path: /^\/projects\/\d+$/, title: "Project Details", Icon: Folder },
  { path: /^\/tasks\/\d+$/, title: "Task Details", Icon: ListChecks },
  { path: /^\/teams\/\d+$/, title: "Team Details", Icon: Users },
  { path: /^\/dashboard$/, title: "Dashboard", Icon: LayoutDashboard },
  { path: /^\/teams$/, title: "Teams", Icon: Users },
  { path: /^\/members$/, title: "Members", Icon: User },
  { path: /^\/projects$/, title: "Projects", Icon: Folder },
  { path: /^\/tasks$/, title: "Tasks", Icon: ListChecks },
  { path: /^\/profile$/, title: "User Profile", Icon: User },
  { path: /.*/, title: "Page", Icon: LayoutDashboard },
];

export default function Topbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const activeRoute = routeMaps.find((map) => map.path.test(currentPath));
  const title = activeRoute?.title || "Page";
  const PageIcon = activeRoute?.Icon || LayoutDashboard;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="h-14 md:h-16 bg-background-light text-text-base font-sans shadow-md flex items-center justify-between px-4 md:px-6 border-b border-background-dark">
      <div className="flex items-center gap-3">
        <PageIcon size={24} className="text-accent-blue" />
        <h1 className="text-xl md:text-2xl font-bold text-accent-blue">{title}</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <div className="relative">
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-text-muted cursor-pointer hover:text-accent-blue transition-colors duration-200" />
          <span className="absolute -top-1 right-0 block h-2 w-2 rounded-full ring-2 ring-background-light bg-error-red"></span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue rounded-full"
          >
            <img
              src="https://i.pravatar.cc/40?u=a_user_id"
              alt="User profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-accent-blue cursor-pointer"
            />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-3 w-44 bg-background-light 
              border border-background-dark rounded-xl shadow-lg py-2 z-50 animate-fadeIn
              transition-all duration-200"
            >
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-base 
                hover:bg-accent-blue hover:text-white transition-colors rounded-md mx-2"
              >
                <User size={16} /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-base 
                hover:bg-accent-blue hover:text-white transition-colors rounded-md mx-2"
              >
                <Settings size={16} /> Settings
              </Link>
              <button
                onClick={()=>{
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text-base 
                hover:bg-error-red hover:text-white transition-colors rounded-md mx-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
import { Bell, LayoutDashboard, Users, User, Folder, ListChecks, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom"; 
import { ComponentType } from "react";

// Define the type for the icons from Lucide
type LucideIcon = ComponentType<{ size: number; className?: string }>;

// --- 1. Define Route Mappings ---
// Use a structured array to manage path patterns, titles, and icons.
// The order matters: specific dynamic paths should come before general paths.
const routeMaps: {
  path: RegExp;
  title: string;
  Icon: LucideIcon;
}[] = [
  // Dynamic Routes (Check these first)
  { path: /^\/projects\/\d+$/, title: "Project Details", Icon: Folder },
  { path: /^\/tasks\/\d+$/, title: "Task Details", Icon: ListChecks },

  // Static Routes
  { path: /^\/dashboard$/, title: "Dashboard", Icon: LayoutDashboard },
  { path: /^\/teams$/, title: "Teams", Icon: Users },
  { path: /^\/members$/, title: "Members", Icon: User },
  { path: /^\/projects$/, title: "Projects", Icon: Folder },
  { path: /^\/tasks$/, title: "Tasks", Icon: ListChecks },
  
  // Profile (Add any other specific static pages here)
  { path: /^\/profile$/, title: "User Profile", Icon: User },

  // Fallback
  { path: /.*/, title: "Page", Icon: LayoutDashboard },
];

export default function Topbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // --- 2. Path Matching Logic ---
  // Find the first matching route in the map
  const activeRoute = routeMaps.find(map => map.path.test(currentPath));

  const title = activeRoute?.title || "Page";
  const PageIcon = activeRoute?.Icon || LayoutDashboard;

  return (
    <header className="h-14 md:h-16 bg-background-light text-text-base font-sans shadow-md flex items-center justify-between px-4 md:px-6 border-b border-background-dark">
      <div className="flex items-center gap-3">
        <PageIcon size={24} className="text-accent-blue" />
        <h1 className="text-xl md:text-2xl font-bold text-accent-blue">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <div className="relative">
          <Bell className="w-5 h-5 md:w-6 md:h-6 text-text-muted cursor-pointer hover:text-accent-blue transition-colors duration-200" />
          <span className="absolute -top-1 right-0 block h-2 w-2 rounded-full ring-2 ring-background-light bg-error-red"></span>
        </div>
        
        {/* Profile Link */}
        <Link to="/profile" className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue rounded-full">
          <img
            src="https://i.pravatar.cc/40?u=a_user_id"
            alt="User profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-accent-blue cursor-pointer"
          />
        </Link>
      </div>
    </header>
  );
}
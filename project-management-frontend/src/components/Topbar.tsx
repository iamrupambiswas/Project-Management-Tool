import {
  Bell,
  LayoutDashboard,
  Users,
  User,
  Folder,
  ListChecks,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ComponentType, useState, useRef, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "../store/notificationStore";

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

type TopbarProps = {
  onMenuClick?: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const activeRoute = routeMaps.find((map) => map.path.test(currentPath));
  const title = activeRoute?.title || "Page";
  const PageIcon = activeRoute?.Icon || LayoutDashboard;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("https://ui-avatars.com/api/?name=User");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const notifications = useNotificationStore((s) => s.notifications);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Node;
    if (dropdownRef.current && !dropdownRef.current.contains(target)) {
      setOpen(false);
    }
    if (notifRef.current && !notifRef.current.contains(target)) {
      setNotifOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (user) {
      const imageUrl = user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "User")}`;
      setProfileImageUrl(imageUrl);
    } else {
      setProfileImageUrl("https://ui-avatars.com/api/?name=User");
    }
  }, [user]);

  useEffect(() => {
    if (notifOpen && token) {
      fetchNotifications(token);
    }
  }, [notifOpen, token, fetchNotifications]);

  const handleNotificationClick = async (n: { id: number }) => {
    if (token) {
      await markAsRead(n.id, token);
    }
    setNotifOpen(false);
  };

  return (
    <header className="h-14 md:h-16 bg-background-light text-text-base font-sans shadow-md flex items-center justify-between px-4 md:px-6 border-b border-background-dark">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md text-text-muted hover:text-text-base hover:bg-background-dark/40 focus:outline-none focus:ring-2 focus:ring-accent-blue"
        >
          <Menu className="w-5 h-5" />
        </button>
        <PageIcon size={24} className="text-accent-blue" />
        <h1 className="text-xl md:text-2xl font-bold text-accent-blue">{title}</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            aria-haspopup="menu"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative focus:outline-none focus:ring-2 focus:ring-accent-blue rounded-md p-1"
          >
            <Bell className="w-5 h-5 md:w-6 md:h-6 text-text-muted hover:text-accent-blue transition-colors duration-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-error-red text-white text-[10px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-3 w-72 sm:w-80 bg-background-light border border-background-dark rounded-xl shadow-lg py-2 z-50 animate-fadeIn max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-3 pb-2 border-b border-background-dark">
                <span className="text-sm text-text-base">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    className="text-xs text-accent-blue hover:underline"
                    onClick={async () => {
                      if (user?.id && token) {
                        await markAllAsRead(user.id, token);
                      }
                      setNotifOpen(false);
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400">No new notifications</div>
              ) : (
                <ul className="divide-y divide-background-dark">
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <button
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          !n.read ? 'text-text-base hover:bg-background-dark/60' : 'text-gray-500 hover:bg-background-dark/40'
                        }`}
                        onClick={() => handleNotificationClick(n)}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-1 inline-block h-2 w-2 rounded-full ${!n.read ? 'bg-accent-blue' : 'bg-gray-600'}`} />
                          <div>
                            <p className="leading-snug">{n.message}</p>
                            <p className="mt-1 text-[11px] text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue rounded-full"
          >
            <img
              src={profileImageUrl}
              alt="User profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-accent-blue cursor-pointer object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=User";
                setProfileImageUrl("https://ui-avatars.com/api/?name=User");
              }}
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
                onClick={() => {
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
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

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const { user, token } = useAuthStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentPath = location.pathname;
  const activeRoute = routeMaps.find((map) => map.path.test(currentPath));
  const title = activeRoute?.title || "Page";
  const PageIcon = activeRoute?.Icon || LayoutDashboard;

  const handleNotificationClick = async (notification: any) => {
    console.log("📩 Notification clicked:", notification);

    await markAsRead(notification.id, token!);
  
    setNotifOpen(false);
  
    if (notification.type === "TASK_ASSIGNED" && notification.relatedEntityId) {
      navigate(`/tasks/${notification.relatedEntityId}`);
    } else if (notification.type === "PROJECT_ASSIGNED" && notification.relatedEntityId) {
      navigate(`/projects/${notification.relatedEntityId}`);
    } else {
      navigate("/dashboard");
    }
  };  

  useEffect(() => {
    if (user?.id && token) {
      fetchNotifications(token);
      console.log("🔔 Notifications fetched:", notifications);
    }
  }, [token, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="h-14 md:h-16 bg-background-light text-text-base shadow-md flex items-center justify-between px-4 md:px-6 border-b border-background-dark">
      {/* Left side: Page title */}
      <div className="flex items-center gap-3">
        <PageIcon size={24} className="text-accent-blue" />
        <h1 className="text-xl md:text-2xl font-bold text-accent-blue">{title}</h1>
      </div>

      {/* Right side: Notifications + Profile */}
      <div className="flex items-center gap-4 md:gap-6" ref={dropdownRef}>
        {/* 🔔 Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative focus:outline-none"
          >
            <Bell className="w-6 h-6 text-text-muted cursor-pointer hover:text-accent-blue transition-colors duration-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-error-red text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-background-light border border-background-dark rounded-xl shadow-lg z-50 animate-fadeIn max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold">Notifications</h3>

                {/* ✅ Show Clear All only if there are notifications */}
                {notifications.length > 0 && (
                  <button
                    onClick={async () => {
                      await markAllAsRead(user?.id!, token!);
                      setNotifOpen(false); // ✅ Close dropdown after clearing
                    }}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-text-muted text-center">
                  No new notifications 🎉
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                        !n.read ? "font-semibold" : "text-gray-500"
                      }`}
                    >
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-text-muted">{n.createdAt}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* 👤 Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue rounded-full"
          >
            <img
              src={
                (() => {
                  const storedUser = localStorage.getItem("user");
                  if (storedUser) {
                    const user = JSON.parse(storedUser);
                    return (
                      user.profileImageUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "User")}`
                    );
                  }
                  return "https://ui-avatars.com/api/?name=User";
                })()
              }
              alt="User profile"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-accent-blue cursor-pointer object-cover"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-background-light border border-background-dark rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent-blue hover:text-white rounded-md mx-2"
              >
                <User size={16} /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent-blue hover:text-white rounded-md mx-2"
              >
                <Settings size={16} /> Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-error-red hover:text-white rounded-md mx-2"
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

import { ReactNode, MouseEventHandler } from "react";
import { useLocation } from "react-router-dom";

interface NavItemProps {
  icon: ReactNode; // any valid JSX / component
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>; // optional click handler
}

export default function NavItem({ icon, label, onClick }: NavItemProps) {
  const location = useLocation();
  const isActive =
    location.pathname === `/${label.toLowerCase()}` ||
    (label === "Dashboard" && location.pathname === "/");

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg w-full text-left
        transition-all duration-200
        ${isActive
          ? "bg-accent-blue text-text-base shadow-lg"
          : "text-text-muted hover:bg-background-light hover:text-text-base"
        }
      `}
    >
      <div className="text-sm md:text-xl">{icon}</div>
      <span className="text-xs md:text-sm font-medium">{label}</span>
    </button>
  );
}

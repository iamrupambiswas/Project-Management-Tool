import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
export default function NavItem({ icon, label, onClick }) {
    const location = useLocation();
    const isActive = location.pathname === `/${label.toLowerCase()}` ||
        (label === "Dashboard" && location.pathname === "/");
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg w-full text-left
        transition-all duration-200
        ${isActive
            ? "bg-accent-blue text-text-base shadow-lg"
            : "text-text-muted hover:bg-background-light hover:text-text-base"}
      `, children: [_jsx("div", { className: "text-sm md:text-xl", children: icon }), _jsx("span", { className: "text-xs md:text-sm font-medium", children: label })] }));
}

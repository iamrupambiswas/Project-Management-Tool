import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function Topbar() {
    const location = useLocation();
    const pageTitles = {
        "/dashboard": "Dashboard",
        "/teams": "Teams",
        "/members": "Members",
        "/projects": "Projects",
        "/tasks": "Tasks"
    };
    const title = pageTitles[location.pathname] || "Page";
    return (_jsxs("header", { className: "h-14 md:h-16 bg-background-light text-text-base font-sans shadow-md flex items-center justify-between px-4 md:px-6 border-b border-background-dark", children: [_jsx("h1", { className: "text-xl md:text-2xl font-bold text-accent-blue", children: title }), _jsxs("div", { className: "flex items-center gap-4 md:gap-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Bell, { className: "w-5 h-5 md:w-6 md:h-6 text-text-muted cursor-pointer hover:text-accent-blue transition-colors duration-200" }), _jsx("span", { className: "absolute -top-1 right-0 block h-2 w-2 rounded-full ring-2 ring-background-light bg-error-red" })] }), _jsx(Link, { to: "/profile", className: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue rounded-full", children: _jsx("img", { src: "https://i.pravatar.cc/40?u=a_user_id", alt: "User profile", className: "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-accent-blue cursor-pointer" }) })] })] }));
}

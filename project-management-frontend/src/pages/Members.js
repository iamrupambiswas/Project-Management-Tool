import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
const LoadingSpinner = () => (_jsxs(motion.div, { className: "flex flex-col items-center justify-center text-text-muted text-sm", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: {
                duration: 1,
                ease: "linear",
                repeat: Infinity,
            }, children: _jsx(Loader2, { size: 24, className: "text-accent-blue" }) }), _jsx("p", { className: "mt-2", children: "Loading members..." })] }));
export default function Members() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getAllUsers().then((data) => {
            setMembers(data);
            setLoading(false);
        });
    }, []);
    if (loading) {
        return (_jsx("div", { className: "p-6 min-h-screen flex justify-center items-center", children: _jsx(LoadingSpinner, {}) }));
    }
    return (_jsx("div", { className: "p-6 text-text-base font-sans", children: members.length === 0 ? (_jsx("p", { className: "text-text-muted text-sm", children: "No members found." })) : (_jsx("div", { className: "overflow-x-auto rounded-xl border border-background-light", children: _jsxs("table", { className: "min-w-full bg-background-light", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-background-dark text-left text-text-muted text-xs uppercase tracking-wider", children: [_jsx("th", { className: "py-3 px-4 rounded-tl-xl", children: "User ID" }), _jsx("th", { className: "py-3 px-4", children: "Name" }), _jsx("th", { className: "py-3 px-4", children: "Roles" })] }) }), _jsx("tbody", { children: members.map((member, index) => (_jsxs("tr", { className: `${index % 2 === 0 ? "bg-background-light" : "bg-background-light"} border-b border-background-dark`, children: [_jsx("td", { className: "py-3 px-4 text-sm font-mono text-accent-blue", children: member.id }), _jsx("td", { className: "py-3 px-4 text-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-8 w-8 rounded-full bg-background-dark flex items-center justify-center text-xs font-semibold uppercase text-accent-blue mr-3", children: member.username.charAt(0) }), _jsxs("div", { className: "text-text-base", children: [_jsx("div", { className: "font-medium text-sm", children: member.username }), _jsx("div", { className: "text-text-muted text-xs", children: member.email })] })] }) }), _jsx("td", { className: "py-3 px-4 text-sm", children: _jsx("div", { className: "flex gap-2 flex-wrap", children: member.roles.map((role) => (_jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-background-dark text-text-muted", children: role }, role))) }) })] }, member.id))) })] }) })) }));
}

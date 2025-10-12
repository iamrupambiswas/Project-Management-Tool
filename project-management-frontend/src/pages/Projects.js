import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { PlusCircle, Loader2, FolderOpen, CheckCircle, BarChart2, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { getAllProjects } from "../services/projectService";
import CreateProjectModal from "../components/modals/CreateProjectModal";
const LoadingSpinner = () => (_jsxs(motion.div, { className: "flex flex-col items-center justify-center text-text-muted text-sm", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: {
                duration: 1,
                ease: "linear",
                repeat: Infinity,
            }, children: _jsx(Loader2, { size: 24, className: "text-accent-green" }) }), _jsx("p", { className: "mt-2", children: "Fetching project list..." })] }));
export default function Projects() {
    // State is now strictly typed to the imported DTO
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    useEffect(() => {
        getAllProjects().then((data) => {
            setProjects(data);
            setLoading(false);
        });
    }, []);
    const getStatusClasses = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'text-green-400 bg-green-900/50 border-green-700/50';
            case 'COMPLETED':
                return 'text-blue-400 bg-blue-900/50 border-blue-700/50';
            case 'ON_HOLD':
                return 'text-yellow-400 bg-yellow-900/50 border-yellow-700/50';
            default:
                return 'text-text-muted bg-background-dark';
        }
    };
    const handleProjectCreated = (newProject) => {
        setProjects((prev) => [newProject, ...prev]);
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-[50vh] bg-background-dark", children: _jsx(LoadingSpinner, {}) }));
    }
    return (_jsxs("div", { className: "p-6 min-h-screen text-text-base font-sans bg-background-dark", children: [_jsxs("div", { className: "flex justify-between items-center mb-6 border-b border-background-light pb-4", children: [_jsxs("h1", { className: "text-xl md:text-2xl font-bold text-text-base flex items-center gap-2", children: [_jsx(BarChart2, { size: 24, className: "text-accent-green hidden sm:block" }), "Project Overview"] }), _jsxs("button", { onClick: () => setShowCreateModal(true), className: "flex items-center gap-2 bg-accent-green text-background-light px-4 py-2 rounded-xl transition-transform duration-200 hover:scale-[1.03] shadow-md hover:shadow-lg text-sm font-semibold", children: [_jsx(PlusCircle, { size: 18 }), _jsx("span", { className: "hidden md:inline", children: "Start New Project" })] })] }), projects.length === 0 ? (_jsx("p", { className: "text-text-muted text-sm text-center py-10", children: "No projects found. Use the \"Start New Project\" button above to get started!" })) : (_jsx("ul", { className: "space-y-4", children: projects.map((project) => (_jsx(motion.li, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "p-4 bg-background-light border border-background-light rounded-xl shadow-lg transition-all duration-300 hover:border-accent-green/80 hover:shadow-xl cursor-pointer", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "flex flex-col gap-2 flex-grow", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(FolderOpen, { size: 36, className: "text-accent-green flex-shrink-0 hidden sm:block" }), _jsxs("div", { children: [_jsx("h2", { className: "text-base md:text-lg font-semibold text-text-base mb-0.5", children: project.name }), _jsxs("p", { className: "text-xs text-text-muted", children: ["Team: ", _jsx("span", { className: "font-medium text-text-base", children: project.team?.name ?? "N/A" })] })] })] }), _jsx("p", { className: "text-xs text-text-muted mt-1 md:ml-14 line-clamp-2", children: project.description })] }), _jsxs("div", { className: "flex items-center justify-between md:justify-start gap-6 flex-wrap text-sm md:min-w-[400px]", children: [_jsx("span", { className: `px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(project.status)} min-w-[75px] text-center`, children: project.status?.replace('_', ' ') }), _jsxs("div", { className: "flex items-center gap-1 text-text-muted text-xs", children: [_jsx(CheckCircle, { size: 14, className: "text-accent-green" }), _jsx("span", { className: "font-semibold text-text-base", children: project.taskCount }), " Tasks"] }), _jsxs("div", { className: "flex items-center gap-1 text-text-muted text-xs", children: [_jsx(Users, { size: 14, className: "text-accent-green" }), _jsx("span", { className: "font-semibold text-text-base", children: project.memberCount }), " Members"] }), _jsxs("div", { className: "text-xs text-text-muted flex items-center gap-1", children: [_jsx(Calendar, { size: 14, className: "text-text-muted" }), "Start: ", _jsx("span", { className: "font-medium text-text-base", children: project.startDate?.toDateString() })] })] }), _jsx("button", { className: "px-3 py-1 bg-background-dark md:bg-transparent text-accent-green rounded-lg transition-colors hover:bg-accent-green/20 text-xs font-semibold flex-shrink-0 w-full md:w-auto", children: "View Details" })] }) }, project.id))) })), showCreateModal && (_jsx(CreateProjectModal, { onClose: () => setShowCreateModal(false), onProjectCreated: handleProjectCreated }))] }));
}

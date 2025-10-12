import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getTeams } from "../services/teamService";
import InviteMember from "../components/modals/InviteMember";
import { PlusCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CreateTeamModal from "../components/modals/CreateTeamModal";
const LoadingSpinner = () => (_jsxs(motion.div, { className: "flex flex-col items-center justify-center text-text-muted text-sm", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: {
                duration: 1,
                ease: "linear",
                repeat: Infinity,
            }, children: _jsx(Loader2, { size: 24, className: "text-accent-blue" }) }), _jsx("p", { className: "mt-2", children: "Loading teams..." })] }));
export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    useEffect(() => {
        getTeams().then((data) => {
            setTeams(data);
            setLoading(false);
        });
    }, []);
    const handleOpenInvite = (teamId) => {
        setSelectedTeamId(teamId);
        setShowInviteModal(true);
    };
    const handleCloseInvite = () => {
        setShowInviteModal(false);
        setSelectedTeamId(null);
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-[50vh]", children: _jsx(LoadingSpinner, {}) }));
    }
    return (_jsxs("div", { className: "p-6 min-h-screen text-text-base font-sans relative", children: [_jsxs("div", { className: "flex justify-end items-center mb-6", children: [_jsxs("button", { onClick: () => setShowCreateModal(true), className: "flex items-center gap-2 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm", children: [_jsx(PlusCircle, { size: 16 }), _jsx("span", { className: "hidden md:inline", children: "Create Team" })] }), showCreateModal && (_jsx(CreateTeamModal, { onClose: () => setShowCreateModal(false), onTeamCreated: (newTeam) => setTeams((prev) => [...prev, newTeam]) }))] }), teams.length === 0 ? (_jsx("p", { className: "text-text-muted text-sm text-center", children: "No teams available. Create one to get started!" })) : (_jsx("ul", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: teams.map((team) => {
                    const membersArray = Array.from(team.members || []);
                    return (_jsxs("li", { className: "p-4 bg-background-light border border-background-dark rounded-xl shadow-lg transition-colors hover:border-accent-blue duration-300", children: [_jsx("h2", { className: "text-base md:text-lg font-semibold text-text-base mb-1", children: team.name }), _jsx("p", { className: "text-xs md:text-sm text-text-muted mb-2", children: team.description }), _jsxs("p", { className: "text-xs text-accent-blue mb-2", children: ["Members: ", membersArray.length] }), _jsxs("ul", { className: "flex flex-wrap gap-2 text-xs text-text-muted", children: [membersArray.slice(0, 3).map((name, idx) => (_jsx("li", { className: "px-2 py-1 bg-background-dark rounded-md", children: name }, idx))), membersArray.length > 3 && (_jsxs("li", { className: "px-2 py-1 text-accent-blue", children: ["+", membersArray.length - 3, " more"] }))] }), _jsx("button", { onClick: () => handleOpenInvite(team.id), className: "mt-3 px-3 py-1 bg-accent-blue text-text-base rounded-md transition-colors hover:bg-opacity-80 text-xs font-semibold w-full", children: "Invite Members" })] }, team.id));
                }) })), showInviteModal && selectedTeamId !== null && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-background-darker/70 backdrop-blur-sm z-50", children: _jsx(InviteMember, { teamId: selectedTeamId.toString(), onClose: handleCloseInvite, onMemberAdded: (newMemberName) => {
                        setTeams((prev) => prev.map((t) => t.id === selectedTeamId
                            ? { ...t, members: new Set([...(t.members || []), newMemberName]) }
                            : t));
                        handleCloseInvite();
                    } }) }))] }));
}

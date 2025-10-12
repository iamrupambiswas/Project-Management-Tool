import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { addTeamMember } from "../../services/teamService";
import { getAllUsers } from "../../services/userService";
import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
export default function InviteMember({ teamId, onClose, onMemberAdded }) {
    const [allUsers, setAllUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [role, setRole] = useState("MEMBER");
    const [loading, setLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(true);
    const [inviteError, setInviteError] = useState("");
    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true);
            try {
                const users = await getAllUsers();
                setAllUsers(users);
            }
            catch (err) {
                console.error("Failed to fetch users:", err);
            }
            finally {
                setUsersLoading(false);
            }
        };
        fetchUsers();
    }, []);
    const handleSelectMember = (user) => {
        setSelectedMembers((prev) => prev.some((m) => m.email === user.email)
            ? prev.filter((m) => m.email !== user.email)
            : [...prev, user]);
    };
    const handleInvite = async (e) => {
        e.preventDefault();
        if (selectedMembers.length === 0) {
            setInviteError("Please select at least one user.");
            return;
        }
        setInviteError("");
        try {
            setLoading(true);
            for (const user of selectedMembers) {
                const result = await addTeamMember(teamId, { email: user.email, role });
                const newMemberName = result.username || user.email;
                onMemberAdded(newMemberName);
            }
            toast.success("Invitations sent!");
            setSelectedMembers([]);
            setRole("MEMBER");
            onClose();
        }
        catch (error) {
            console.error("Invite failed:", error);
            const errorMessage = error.response?.data?.message || "Failed to invite members. Please try again.";
            setInviteError(errorMessage);
            toast.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    };
    const filteredUsers = allUsers.filter((user) => user.username?.toLowerCase().includes(searchQuery.toLowerCase()));
    const formVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 },
    };
    return (_jsxs(motion.form, { variants: formVariants, initial: "hidden", animate: "visible", exit: "exit", onSubmit: handleInvite, className: "relative flex flex-col gap-4 p-6 rounded-xl shadow-lg w-full max-w-md\n                 bg-background-light border border-accent-red", children: [_jsx("button", { type: "button", onClick: onClose, className: "absolute top-4 right-4 text-text-muted hover:text-text-base transition-colors", children: _jsx(X, { size: 20 }) }), _jsx("h3", { className: "text-lg font-semibold text-text-base", children: "Invite Members" }), inviteError && (_jsx("p", { className: "text-sm text-center text-accent-red", children: inviteError })), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Search, { size: 18, className: "text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Search users by name...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full p-3 pl-10 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none" })] }), _jsx("div", { className: "max-h-48 overflow-y-auto border rounded-md p-2 space-y-2", children: usersLoading ? (_jsx("p", { className: "text-center text-gray-500", children: "Loading users..." })) : filteredUsers.length > 0 ? (filteredUsers.map((user) => (_jsxs("div", { className: "flex items-center p-2 rounded-md hover:bg-gray-200 cursor-pointer", onClick: () => handleSelectMember(user), children: [_jsx("input", { type: "checkbox", checked: selectedMembers.some((m) => m.email === user.email), onChange: () => handleSelectMember(user), className: "mr-2" }), _jsx("span", { className: "text-sm font-medium", children: user.username })] }, user.id)))) : (_jsx("p", { className: "text-center text-gray-500", children: "No users found." })) }), selectedMembers.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Selected Members" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedMembers.map((m) => (_jsxs("span", { className: "flex items-center gap-1 px-3 py-1 bg-accent-blue text-white rounded-full text-xs", children: [m.username, _jsx("button", { type: "button", onClick: () => handleSelectMember(m), className: "ml-1 text-white hover:text-gray-200", children: _jsx(X, { size: 12 }) })] }, m.id))) })] })), _jsxs("select", { value: role, onChange: (e) => setRole(e.target.value), className: "border p-2 rounded-md text-text-base bg-background-dark focus:border-accent-blue outline-none", children: [_jsx("option", { value: "MEMBER", children: "Member" }), _jsx("option", { value: "PM", children: "Project Manager" }), _jsx("option", { value: "ADMIN", children: "Admin" })] }), _jsx(motion.button, { type: "submit", disabled: loading, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: "bg-accent-blue text-white py-2 rounded-md hover:bg-opacity-80 disabled:bg-gray-400 transition-colors font-semibold", children: loading ? "Inviting..." : "Send Invites" })] }));
}

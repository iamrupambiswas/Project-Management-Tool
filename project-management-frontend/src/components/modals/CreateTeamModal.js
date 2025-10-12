import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { createTeam } from "../../services/teamService";
import { getAllUsers } from "../../services/userService";
import { X, Search } from "lucide-react";
export default function CreateTeamModal({ onClose, onTeamCreated }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(true);
    const modalRef = useRef(null);
    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true);
            try {
                const users = await getAllUsers();
                setAllUsers(users);
                console.log(users);
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
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);
    const handleCreate = async () => {
        if (!name)
            return alert("Team name is required!");
        setLoading(true);
        try {
            const memberEmails = selectedMembers.map((m) => m.email);
            const newTeam = await createTeam({ name, description, members: memberEmails });
            onTeamCreated(newTeam);
            onClose();
        }
        catch (err) {
            console.error(err);
            alert("Failed to create team");
        }
        finally {
            setLoading(false);
        }
    };
    const filteredUsers = allUsers.filter((user) => {
        if (!user)
            return false;
        const userName = user.username ? user.username.toLowerCase() : '';
        return userName.includes(searchQuery.toLowerCase());
    });
    const handleSelectMember = (user) => {
        setSelectedMembers((prevMembers) => prevMembers.some((m) => m.email === user.email)
            ? prevMembers.filter((m) => m.email !== user.email)
            : [...prevMembers, user]);
    };
    return (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-50 p-4", children: _jsxs("div", { ref: modalRef, className: "bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[80vh] overflow-y-auto", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1", "aria-label": "Close modal", children: _jsx(X, { size: 20 }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6 text-center", children: "Create New Team \uD83D\uDE80" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "team-name", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Team Name" }), _jsx("input", { id: "team-name", type: "text", placeholder: "e.g., Project Alpha Squad", className: "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500", value: name, onChange: (e) => setName(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Description (Optional)" }), _jsx("textarea", { id: "description", placeholder: "Briefly describe the team's purpose...", className: "w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]", value: description, onChange: (e) => setDescription(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "member-search", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Add Team Members" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Search, { size: 18, className: "text-gray-400" }) }), _jsx("input", { id: "member-search", type: "text", placeholder: "Search users by name...", className: "w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] })] })] }), _jsx("div", { className: "mt-4 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-2 space-y-2", children: usersLoading ? (_jsx("p", { className: "text-center text-gray-500 dark:text-gray-400 py-4", children: "Loading users..." })) : filteredUsers.length > 0 ? (filteredUsers.map((user) => (_jsxs("div", { className: "flex items-center p-3 rounded-lg transition-colors duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600", children: [_jsx("input", { type: "checkbox", checked: selectedMembers.some((m) => m.email === user.email), onChange: () => handleSelectMember(user), className: "mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }), _jsx("div", { className: "flex-1 font-medium text-gray-900 dark:text-gray-50 truncate", children: user.username })] }, user.id)))) : (_jsx("p", { className: "text-center text-gray-500 dark:text-gray-400 py-4", children: "No users found." })) }), selectedMembers.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Selected Members" }), _jsx("div", { className: "flex flex-wrap gap-2 min-h-[40px]", children: selectedMembers.map((m) => (_jsxs("span", { className: "flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium", children: [m.username, _jsx("button", { type: "button", onClick: () => handleSelectMember(m), className: "text-white hover:text-blue-200 transition-colors duration-200", "aria-label": `Remove ${m.username}`, children: _jsx(X, { size: 14 }) })] }, m.id))) })] })), _jsx("button", { onClick: handleCreate, className: "w-full bg-blue-600 text-white rounded-lg py-3 mt-6 font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed", disabled: loading || !name, children: loading ? "Creating..." : "Create Team" })] }) }));
}

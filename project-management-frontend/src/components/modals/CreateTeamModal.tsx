import { useState, useEffect, useRef } from "react";
import { createTeam } from "../../services/teamService";
import { getAllUsers } from "../../services/userService";
import { X, Search } from "lucide-react";
import { TeamDto, UserDto } from "../../@api";
import { useAuthStore } from "../../store/authStore";

interface CreateTeamModalProps {
  onClose: () => void;
  onTeamCreated: (newTeam: TeamDto) => void;
}

export default function CreateTeamModal({ onClose, onTeamCreated }: CreateTeamModalProps) {
  const { companyId } = useAuthStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<UserDto[]>([]);
  const [allUsers, setAllUsers] = useState<UserDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        if (companyId !== null) {
          const users: UserDto[] = await getAllUsers(companyId);
          setAllUsers(users);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleCreate = async () => {
    if (!name) return alert("Team name is required!");
    setLoading(true);

    try {
      const memberEmails: string[] = selectedMembers
      .map((m) => m.email)
      .filter((email): email is string => !!email); 

      const teamData: TeamDto = {
        name: name,
        description: description || undefined,
        memberEmails: memberEmails,
        companyId: companyId ?? undefined
      };

      const newTeam = await createTeam(teamData);
      onTeamCreated(newTeam);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    if (!user) return false;
    const userName = user.username ? user.username.toLowerCase() : '';
    return userName.includes(searchQuery.toLowerCase());
  });

  const handleSelectMember = (user: UserDto) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.some((m) => m.email === user.email)
        ? prevMembers.filter((m) => m.email !== user.email)
        : [...prevMembers, user]
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative max-h-[80vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6 text-center">Create New Team 🚀</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team Name
            </label>
            <input
              id="team-name"
              type="text"
              placeholder="e.g., Project Alpha Squad"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Briefly describe the team's purpose..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="member-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add Team Members
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                id="member-search"
                type="text"
                placeholder="Search users by name..."
                className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-2 space-y-2">
          {usersLoading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading users...</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-3 rounded-lg transition-colors duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.some((m) => m.email === user.email)}
                  onChange={() => handleSelectMember(user)}
                  className="mr-3 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1 font-medium text-gray-900 dark:text-gray-50 truncate">{user.username}</div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No users found.</p>
          )}
        </div>

        {selectedMembers.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Members</h3>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {selectedMembers.map((m) => (
                <span key={m.id} className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                  {m.username}
                  <button
                    type="button"
                    onClick={() => handleSelectMember(m)}
                    className="text-white hover:text-blue-200 transition-colors duration-200"
                    aria-label={`Remove ${m.username}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 text-white rounded-lg py-3 mt-6 font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={loading || !name}
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </div>
    </div>
  );
}
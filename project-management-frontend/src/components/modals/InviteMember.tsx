import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { addTeamMember } from "../../services/teamService";
import { getAllUsers } from "../../services/userService";
import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

interface User {
  id: string;
  username: string;
  email: string;
}

interface InviteMemberProps {
  teamId: string;
  onClose: () => void;
  onMemberAdded: (newMemberName: string) => void;
}

export default function InviteMember({ teamId, onClose, onMemberAdded }: InviteMemberProps) {
  const { companyId } = useAuthStore();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        if (companyId !== null) {
          const users = await getAllUsers(companyId);
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

  const handleSelectMember = (user: User) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.email === user.email)
        ? prev.filter((m) => m.email !== user.email)
        : [...prev, user]
    );
  };

  const handleInvite = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      console.error("Invite failed:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to invite members. Please try again.";
      setInviteError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={handleInvite}
      className="relative flex flex-col gap-4 p-6 rounded-xl shadow-lg w-full max-w-md
                 bg-background-light border border-accent-red"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-text-base transition-colors"
      >
        <X size={20} />
      </button>

      <h3 className="text-lg font-semibold text-text-base">Invite Members</h3>

      {inviteError && (
        <p className="text-sm text-center text-accent-red">{inviteError}</p>
      )}

      {/* Search box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-10 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none"
        />
      </div>

      {/* User list */}
      <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
        {usersLoading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-2 rounded-md hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectMember(user)}
            >
              <input
                type="checkbox"
                checked={selectedMembers.some((m) => m.email === user.email)}
                onChange={() => handleSelectMember(user)}
                className="mr-2"
              />
              <span className="text-sm font-medium">{user.username}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}
      </div>

      {/* Selected members preview */}
      {selectedMembers.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Selected Members</h4>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((m) => (
              <span
                key={m.id}
                className="flex items-center gap-1 px-3 py-1 bg-accent-blue text-white rounded-full text-xs"
              >
                {m.username}
                <button
                  type="button"
                  onClick={() => handleSelectMember(m)}
                  className="ml-1 text-white hover:text-gray-200"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Role select */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded-md text-text-base bg-background-dark focus:border-accent-blue outline-none"
      >
        <option value="MEMBER">Member</option>
        <option value="PM">Project Manager</option>
        <option value="ADMIN">Admin</option>
      </select>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-accent-blue text-white py-2 rounded-md hover:bg-opacity-80 disabled:bg-gray-400 transition-colors font-semibold"
      >
        {loading ? "Inviting..." : "Send Invites"}
      </motion.button>
    </motion.form>
  );
}

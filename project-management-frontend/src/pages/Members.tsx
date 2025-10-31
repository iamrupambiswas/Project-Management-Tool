import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getAllUsers } from "../services/userService";
import type { UserDto } from "../@api/models";
import { User, Search, PlusCircle, Crown, Briefcase, Users } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import InviteMemberModal from "../components/modals/InviteMember";
import { useAuthStore } from "../store/authStore";

const ROLE_ADMIN = "ADMIN";
const ROLE_PROJECT_MANAGER = "PROJECT_MANAGER";
const ROLE_TEAM_LEAD = "TEAM_LEAD";
const ROLE_USER = "USER";

const ROLE_PRIORITY = [
  ROLE_ADMIN,
  ROLE_PROJECT_MANAGER,
  ROLE_TEAM_LEAD,
  ROLE_USER,
];

type RoleInput = string[] | Set<string> | undefined;

const getHighestPriorityRoleName = (roles: RoleInput): string | undefined => {
  if (!roles) return undefined;
  const roleArray = Array.isArray(roles) ? roles : Array.from(roles);
  for (const priorityRole of ROLE_PRIORITY) {
    if (roleArray.includes(priorityRole)) {
      return priorityRole;
    }
  }
  return roleArray.length > 0 ? roleArray[0] : undefined;
};

const getRoleClasses = (roles: Set<string>) => {
  const highestRoleName = getHighestPriorityRoleName(roles);
  switch (highestRoleName) {
    case ROLE_ADMIN:
      return "text-accent-red bg-red-900/50 border-red-700/50";
    case ROLE_PROJECT_MANAGER:
      return "text-accent-orange bg-yellow-900/50 border-yellow-700/50";
    case ROLE_TEAM_LEAD:
      return "text-accent-blue bg-blue-900/50 border-blue-700/50";
    case ROLE_USER:
    default:
      return "text-text-muted bg-gray-600/50 border-gray-700/50";
  }
};

const getRoleIcon = (roles: Set<string>) => {
  const highestRoleName = getHighestPriorityRoleName(roles);
  switch (highestRoleName) {
    case ROLE_ADMIN:
      return <Crown size={14} />;
    case ROLE_PROJECT_MANAGER:
      return <Briefcase size={14} />;
    case ROLE_TEAM_LEAD:
      return <Users size={14} />;
    case ROLE_USER:
    default:
      return <User size={14} />;
  }
};

const formatRoleName = (roleName: string) => {
  return roleName
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatAllRoles = (roles: Set<string> | undefined) => {
  if (!roles || roles.size === 0) return "No Roles";
  return Array.from(roles)
    .map(formatRoleName)
    .join(", ");
};

export default function Members() {
  const { companyId, user } = useAuthStore();
  const roles = Array.isArray(user?.roles)
  ? user.roles
  : Array.from(user?.roles || []);
  const [members, setMembers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        if (companyId !== null) {
          const usersData = await getAllUsers(companyId);
          setMembers(usersData as UserDto[]);
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
        toast.error("Failed to load member list.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "ALL" ||
      (member.roles && Array.from(member.roles).includes(filterRole));
    return matchesSearch && matchesRole;
  });

  const handleMemberAdded = (newMember: UserDto) => {
    setMembers((prev) => [...prev, newMember]);
    setShowInviteModal(false);
    toast.success(`${newMember.username} invited successfully!`);
  };

  if (loading) return <LoadingSpinner message="Loading team members..." />;

  const availableRoleNames = [
    ROLE_ADMIN,
    ROLE_PROJECT_MANAGER,
    ROLE_TEAM_LEAD,
    ROLE_USER,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen text-text-base font-sans"
    >
      <div className="bg-background-light p-4 rounded-xl shadow-inner mb-6 flex flex-wrap gap-4 items-center">
        {roles.some((r) => r === "ADMIN" || r === "PROJECT_MANAGER" || r === "TEAM_LEAD") && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1 bg-accent-green text-white px-4 py-1.5 rounded-md transition-colors hover:bg-opacity-80 text-sm font-semibold"
          >
            <PlusCircle size={18} /> Invite New
          </button>
        )}

        <div className="relative flex-grow min-w-[200px] ml-auto">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="p-2 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none"
        >
          <option value="ALL">All Roles</option>
          {availableRoleNames.map((roleName) => (
            <option key={roleName} value={roleName}>
              {formatRoleName(roleName)}
            </option>
          ))}
        </select>

        <span className="text-sm text-text-muted">
          Showing {filteredMembers.length} of {members.length} members
        </span>
      </div>

      <div className="space-y-4">
        {filteredMembers.length === 0 ? (
          <p className="text-center text-text-muted py-10 bg-background-light rounded-xl">
            No members match your current filters.
          </p>
        ) : (
          filteredMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/members/${member.id}`)}
              className="p-4 bg-background-light rounded-xl flex justify-between items-center gap-4 cursor-pointer hover:shadow-lg hover:border-accent-blue transition-all border border-background-dark"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    member.profileImageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      member.username ?? "User"
                    )}&background=E0E7FF&color=3730A3`
                  }
                  alt={member.username}
                  className="w-10 h-10 rounded-full border-2 border-accent-blue/50"
                />
                <div>
                  <h2 className="text-lg font-semibold hover:text-accent-green transition-colors">
                    {member.username}
                  </h2>
                  <p className="text-sm text-text-muted">{member.email}</p>
                  <p className="text-sm text-text-muted">
                    ID: {member.id ?? "N/A"}
                  </p>
                  <p className="text-sm text-text-muted">
                    All Roles: {formatAllRoles(member.roles)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getRoleClasses(
                    member.roles ?? new Set()
                  )}`}
                >
                  {getRoleIcon(member.roles ?? new Set())}
                  {formatRoleName(
                    getHighestPriorityRoleName(member.roles) || "No Role"
                  )}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
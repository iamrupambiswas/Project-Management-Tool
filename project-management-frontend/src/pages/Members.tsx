import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getAllUsers } from "../services/userService";
import type { UserDto } from "../@api/models";
import { User, Search, Users, PlusCircle, Crown, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import InviteMemberModal from "../components/modals/InviteMember";

// --- DTO Interfaces (Remain the same from the previous step) ---
interface RoleDto {
    id: number;
    name: string; // e.g., "ADMIN", "USER", "PROJECT_MANAGER", "TEAM_LEAD"
}

interface MemberDto extends Omit<UserDto, 'roles'> {
  id: number;
  username: string;
  email: string;
  // Now we define the correct structure for roles
  roles: RoleDto[]; 
  projectCount?: number;
}

// --- UPDATED Role Constants ---
const ROLE_ADMIN = "ADMIN";
const ROLE_USER = "USER";
const ROLE_PROJECT_MANAGER = "PROJECT_MANAGER";
const ROLE_TEAM_LEAD = "TEAM_LEAD";

// UPDATED: Define the order of priority for display and styling.
// Assuming the hierarchy is: ADMIN > PROJECT_MANAGER > TEAM_LEAD > USER
const ROLE_PRIORITY = [
    ROLE_ADMIN,
    ROLE_PROJECT_MANAGER,
    ROLE_TEAM_LEAD,
    ROLE_USER
];


// --- Helper Functions ---

/**
 * Finds the highest-priority role name (string) from the member's list of roles.
 */
const getHighestPriorityRoleName = (roles: RoleDto[]): string | undefined => {
    // Check roles against the defined priority list
    for (const priorityRole of ROLE_PRIORITY) {
        if (roles.some(r => r.name === priorityRole)) {
            return priorityRole;
        }
    }
    // Fallback if none of the explicit roles are found
    return roles.length > 0 ? roles[0].name : undefined;
};

// UPDATED: Styling now includes new roles.
const getRoleClasses = (roles: RoleDto[]) => {
  const highestRoleName = getHighestPriorityRoleName(roles);

  switch (highestRoleName) {
    case ROLE_ADMIN: return 'text-accent-red bg-red-900/50 border-red-700/50';
    case ROLE_PROJECT_MANAGER: return 'text-accent-orange bg-yellow-900/50 border-yellow-700/50';
    case ROLE_TEAM_LEAD: return 'text-accent-blue bg-blue-900/50 border-blue-700/50';
    case ROLE_USER:
    default: return 'text-text-muted bg-gray-600/50 border-gray-700/50';
  }
};

// UPDATED: Icon logic now includes new roles.
const getRoleIcon = (roles: RoleDto[]) => {
    const highestRoleName = getHighestPriorityRoleName(roles);
    switch (highestRoleName) {
        case ROLE_ADMIN: return <Crown size={14} />;
        case ROLE_PROJECT_MANAGER: return <Briefcase size={14} />; // Using Briefcase for PM
        case ROLE_TEAM_LEAD: return <Users size={14} />; // Using Users for Team Lead
        case ROLE_USER:
        default: return <User size={14} />;
    }
}

// Helper to format role names (e.g., "PROJECT_MANAGER" -> "Project Manager")
const formatRoleName = (roleName: string) => {
    // Replace underscores with spaces, convert to lowercase, and capitalize each word
    return roleName.replace(/_/g, ' ').toLowerCase().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


// --- Component ---

export default function Members() {
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL'); // Filter by role name string

  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);

  // --- Data Fetching (Unchanged) ---
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        setMembers(usersData as MemberDto[]);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        toast.error("Failed to load member list.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // --- Filtering Logic (Unchanged, correctly handles array of roles) ---
  const filteredMembers = members.filter(member => {
    // 1. Search filter
    const matchesSearch = member.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Role filter: Checks if any role name matches the filterRole string
    const matchesRole = filterRole === 'ALL' || member.roles?.some(role => role.name === filterRole);

    return matchesSearch && matchesRole;
  });

  // Handler for when a new member is invited via the modal (Unchanged)
  const handleMemberAdded = (newMember: MemberDto) => {
      setMembers(prev => [...prev, newMember]);
      setShowInviteModal(false);
      toast.success(`${newMember.username} invited successfully!`);
  }

  if (loading) return <LoadingSpinner message="Loading team members..." />;

  // UPDATED: Include all four new role names for the filter dropdown
  const availableRoleNames = [
    ROLE_ADMIN,
    ROLE_PROJECT_MANAGER,
    ROLE_TEAM_LEAD,
    ROLE_USER
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen text-text-base font-sans"
    >

      {/* Filtering and Search Controls */}
      <div className="bg-background-light p-4 rounded-xl shadow-inner mb-6 flex flex-wrap gap-4 items-center">

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1 bg-accent-green text-white px-4 py-1.5 rounded-md transition-colors hover:bg-opacity-80 text-sm font-semibold"
        >
          <PlusCircle size={18} /> Invite New
        </button>

        <div className="relative flex-grow min-w-[200px] ml-auto">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none"
          />
        </div>

        {/* Role Filter Dropdown */}
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="p-2 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none"
        >
          <option value="ALL">All Roles</option>
          {availableRoleNames.map((roleName) => (
            <option key={roleName} value={roleName}>
              {/* Formats "PROJECT_MANAGER" to "Project Manager" */}
              {formatRoleName(roleName)}
            </option>
          ))}
        </select>

        <span className="text-sm text-text-muted">
            Showing {filteredMembers.length} of {members.length} members
        </span>
      </div>

      {/* Member List */}
      <div className="space-y-4">
        {filteredMembers.length === 0 ? (
            <p className="text-center text-text-muted py-10 bg-background-light rounded-xl">
                No members match your current filters.
            </p>
        ) : (
            filteredMembers.map(member => (
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
                            src={`https://i.pravatar.cc/40?u=${member.id}`}
                            alt={member.username}
                            className="w-10 h-10 rounded-full border-2 border-accent-blue/50"
                        />
                        <div>
                            <h2 className="text-lg font-semibold hover:text-accent-green transition-colors">{member.username}</h2>
                            <p className="text-sm text-text-muted">{member.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getRoleClasses(member.roles)}`}>
                            {getRoleIcon(member.roles)}
                            {/* Display the formatted highest-priority role name */}
                            {formatRoleName(getHighestPriorityRoleName(member.roles) || 'No Role')}
                        </span>
                        <span className="text-xs text-text-muted">
                            Projects: {member.projectCount ?? 'N/A'}
                        </span>
                    </div>
                </motion.div>
            ))
        )}
      </div>

      {/* Invite Member Modal */}
      {/* {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <InviteMemberModal
            onClose={() => setShowInviteModal(false)}
            onMemberAdded={handleMemberAdded}
            teamId={1}
          />
        </div>
      )} */}
    </motion.div>
  );
}
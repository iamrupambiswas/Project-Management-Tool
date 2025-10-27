import { useEffect, useState } from "react";
import { getTeam, updateTeam } from "../services/teamService";
import { updateUserRoles } from "../services/userService";
import InviteMember from "../components/modals/InviteMember";
import { PlusCircle, Edit, Users } from "lucide-react";
import type { TeamDto, UserDto } from "../@api/models";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import EditTeamModal from "../components/modals/EditTeamModal";
import EditRolesModal from "../components/modals/EditRolesModal";
import LoadingSpinner from "../components/common/LoadingSpinner"; // ensure this exists

export default function TeamDetails() {
  const { id } = useParams<{ id: string }>();
  const teamId = Number(id);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const roles = Array.isArray(user?.roles)
    ? user.roles
    : Array.from(user?.roles || []);

  const hasEditPermission = roles.some(
    (r) => r === "ADMIN" || r === "PROJECT_MANAGER"
  );

  const [team, setTeam] = useState<TeamDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [editRolesMember, setEditRolesMember] = useState<UserDto | null>(null);

  useEffect(() => {
    getTeam(teamId).then((data) => {
      setTeam(data);
      setLoading(false);
    });
  }, [teamId]);

  const handleUpdateTeam = async (newName: string, newDesc: string) => {
    const updated = await updateTeam(teamId, {
      name: newName,
      description: newDesc,
    });
    setTeam(updated);
  };

  const handleUpdateRoles = async (newRoles: string[]) => {
    if (editRolesMember?.id !== undefined) {
      await updateUserRoles(editRolesMember.id, newRoles);
  
      setTeam((prev) => {
        if (!prev) return null;
  
        const updatedTeam: TeamDto = {
          ...prev,
          members:
            prev.members?.map((m) =>
              m.id === editRolesMember.id
                ? { ...m, roles: new Set(newRoles) } // ✅ convert to Set
                : m
            ) ?? [],
        };
  
        return updatedTeam;
      });
    } else {
      console.warn("User ID is undefined — cannot update roles");
    }
  };
  
  

  if (loading || !team) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-text-base font-sans relative">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-accent-blue hover:underline"
        >
          ← Back
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-base">{team.name}</h1>
        {hasEditPermission && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm"
            >
              <PlusCircle size={16} />
              Invite Member
            </button>
            <button
              onClick={() => setShowEditTeamModal(true)}
              className="flex items-center gap-2 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm"
            >
              <Edit size={16} />
              Edit Team
            </button>
          </div>
        )}
      </div>

      <p className="text-text-muted mb-8">{team.description}</p>

      <h2 className="text-lg font-semibold text-text-base mb-4">Members</h2>
      {!team.members || team.members.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-4 bg-background-light rounded-md">
          No members in this team.
        </p>
      ) : (
        <ul className="space-y-4">
          {team.members.map((member) => (
            <li
              key={member.id}
              className="p-4 bg-background-light border border-background-dark rounded-lg flex items-center justify-between gap-4 hover:border-accent-blue hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <Users size={20} className="text-accent-blue flex-shrink-0" />
                <div>
                  <h3 className="text-base font-medium text-text-base">
                    {member.email}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                  {Array.from(member.roles ?? []).map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 text-xs bg-background-dark text-text-muted rounded-md"
                    >
                      {role}
                    </span>
                  ))}
                  </div>
                </div>
              </div>
              {hasEditPermission && (
                <button
                  onClick={() => setEditRolesMember(member)}
                  className="flex items-center gap-1 text-accent-blue text-sm hover:underline"
                >
                  <Edit size={16} />
                  Edit Roles
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {showInviteModal && (
        <InviteMember
          teamId={teamId.toString()}
          onClose={() => setShowInviteModal(false)}
          onMemberAdded={(newMemberEmail: string) => {
            setTeam((prev) =>
              prev
                ? {
                    ...prev,
                    members: [
                      ...(prev.members ?? []),
                      {
                        id: Date.now(),
                        email: newMemberEmail,
                        roles: new Set(["USER"]),
                      },
                    ],
                  }
                : null
            );
          }}
        />
      )}

      {showEditTeamModal && (
        <EditTeamModal
          team={team}
          onClose={() => setShowEditTeamModal(false)}
          onSave={handleUpdateTeam}
        />
      )}

      {editRolesMember && (
        <EditRolesModal
          email={editRolesMember.email ?? ""}
          currentRoles={Array.from(editRolesMember.roles ?? [])}
          onClose={() => setEditRolesMember(null)}
          onSave={handleUpdateRoles}
        />
      )}
    </div>
  );
}

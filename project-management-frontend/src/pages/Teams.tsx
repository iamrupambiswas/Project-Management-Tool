import { useEffect, useState } from "react";
import { getTeams } from "../services/teamService";
import InviteMember from "../components/modals/InviteMember";
import { PlusCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import CreateTeamModal from "../components/modals/CreateTeamModal";
import type { TeamDto } from "../@api/models";


const LoadingSpinner = () => (
  <motion.div
    className="flex flex-col items-center justify-center text-text-muted text-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Infinity,
      }}
    >
      <Loader2 size={24} className="text-accent-blue" />
    </motion.div>
    <p className="mt-2">Loading teams...</p>
  </motion.div>
);

export default function Teams() {
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    getTeams().then((data) => {
      setTeams(data);
      setLoading(false);
    });
  }, []);

  const handleOpenInvite = (teamId: number) => {
    setSelectedTeamId(teamId);
    setShowInviteModal(true);
  };

  const handleCloseInvite = () => {
    setShowInviteModal(false);
    setSelectedTeamId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-text-base font-sans relative">
      <div className="flex justify-end items-center mb-6">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm"
        >
          <PlusCircle size={16} />
          <span className="hidden md:inline">Create Team</span>
        </button>

        {showCreateModal && (
          <CreateTeamModal
            onClose={() => setShowCreateModal(false)}
            onTeamCreated={(newTeam: TeamDto) => setTeams((prev) => [...prev, newTeam])}
          />
        )}
      </div>

      {teams.length === 0 ? (
        <p className="text-text-muted text-sm text-center">
          No teams available. Create one to get started!
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const membersArray = Array.from(team.members || []);
            return (
              <li
                key={team.id}
                className="p-4 bg-background-light border border-background-dark rounded-xl shadow-lg transition-colors hover:border-accent-blue duration-300"
              >
                <h2 className="text-base md:text-lg font-semibold text-text-base mb-1">
                  {team.name}
                </h2>
                <p className="text-xs md:text-sm text-text-muted mb-2">
                  {team.description}
                </p>
                <p className="text-xs text-accent-blue mb-2">
                  Members: {membersArray.length}
                </p>
                <ul className="flex flex-wrap gap-2 text-xs text-text-muted">
                  {membersArray.slice(0, 3).map((name: string, idx: number) => (
                    <li key={idx} className="px-2 py-1 bg-background-dark rounded-md">
                      {name}
                    </li>
                  ))}
                  {membersArray.length > 3 && (
                    <li className="px-2 py-1 text-accent-blue">+{membersArray.length - 3} more</li>
                  )}
                </ul>
                <button
                  onClick={() => handleOpenInvite(team.id!)}
                  className="mt-3 px-3 py-1 bg-accent-blue text-text-base rounded-md transition-colors hover:bg-opacity-80 text-xs font-semibold w-full"
                >
                  Invite Members
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showInviteModal && selectedTeamId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-background-darker/70 backdrop-blur-sm z-50">
          <InviteMember
            teamId={selectedTeamId.toString()}
            onClose={handleCloseInvite}
            onMemberAdded={(newMemberName: string) => {
              setTeams((prev) =>
                prev.map((t) =>
                  t.id === selectedTeamId
                    ? { ...t, members: new Set([...(t.members || []), newMemberName]) }
                    : t
                )
              );
              handleCloseInvite();
            }}
          />
        </div>
      )}
    </div>
  );
}

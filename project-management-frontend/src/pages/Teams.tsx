import { useEffect, useState } from "react";
import { getTeams } from "../services/teamService";
import InviteMember from "../components/InviteMember";
import { PlusCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Team {
  id: number;
  name: string;
  description: string;
  members: number;
}

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
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-text-base">Teams</h1>
        <button className="flex items-center gap-2 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm">
          <PlusCircle size={16} />
          <span className="hidden md:inline">Create Team</span>
        </button>
      </div>
      {teams.length === 0 ? (
        <p className="text-text-muted text-sm text-center">
          No teams available. Create one to get started!
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <li
              key={team.id}
              className="p-4 bg-background-light border border-background-dark rounded-xl shadow-lg transition-transform hover:scale-[1.02] duration-300"
            >
              <h2 className="text-base md:text-lg font-semibold text-text-base mb-1">
                {team.name}
              </h2>
              <p className="text-xs md:text-sm text-text-muted mb-2">
                {team.description}
              </p>
              <p className="text-xs text-accent-blue">
                Members: {team.members}
              </p>
              <button
                onClick={() => handleOpenInvite(team.id)}
                className="mt-3 px-3 py-1 bg-accent-blue text-text-base rounded-md transition-colors hover:bg-opacity-80 text-xs font-semibold w-full"
              >
                Invite Members
              </button>
            </li>
          ))}
        </ul>
      )}

      {showInviteModal && selectedTeamId && (
        <div className="fixed inset-0 flex items-center justify-center bg-background-darker/70 backdrop-blur-sm z-50">
          <InviteMember
            teamId={selectedTeamId.toString()}
            onClose={handleCloseInvite}
            onMemberAdded={() => {
              setTeams((prev) =>
                prev.map((t) =>
                  t.id === selectedTeamId
                    ? { ...t, members: t.members + 1 }
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
import { useState } from "react";
import { toast } from "react-hot-toast";
import { addTeamMember } from "../services/teamService";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface InviteMemberProps {
  teamId: string;
  onClose: () => void;
  onMemberAdded: (newMemberName: string) => void;
}

export default function InviteMember({ teamId, onClose, onMemberAdded }: InviteMemberProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setInviteError("Please enter a valid email address.");
      return;
    }

    setInviteError("");
    try {
      setLoading(true);
      const result = await addTeamMember(teamId, { email, role });
      const newMemberName = result.username || email;
      toast.success("Invitation sent!");
      setEmail("");
      setRole("MEMBER");
      onMemberAdded(newMemberName);
    } catch (error: any) {
      console.error("Invite failed:", error);
      const errorMessage = error.response?.data?.message || "Failed to invite member. Please try again.";
      setInviteError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      className="relative flex flex-col gap-4 p-6 rounded-xl shadow-lg w-full max-w-sm
                 bg-background-light border border-accent-red"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-text-base transition-colors"
      >
        <X size={20} />
      </button>
      <h3 className="text-base font-semibold text-text-base">
        Invite Member
      </h3>

      {inviteError && (
        <p className="text-sm text-center text-accent-red mt-[-8px] mb-2">
          {inviteError}
        </p>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter member email"
        className="border p-2 rounded-md text-text-base bg-background-dark border-background-dark focus:border-accent-blue outline-none transition-colors"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded-md text-text-base bg-background-dark border-background-dark focus:border-accent-blue outline-none transition-colors"
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
        className="bg-accent-blue text-text-base py-2 rounded-md hover:bg-opacity-80 disabled:bg-background-dark disabled:text-text-muted transition-colors font-semibold"
      >
        {loading ? "Inviting..." : "Send Invite"}
      </motion.button>
    </motion.form>
  );
}
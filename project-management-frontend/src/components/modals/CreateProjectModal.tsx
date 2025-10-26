import React, { useState, useEffect } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { ProjectDto as Project, TeamDto } from "../../@api/models";
import { createProject } from "../../services/projectService";
import { getTeams } from "../../services/teamService";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

interface CreateProjectModalProps {
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
}

export default function CreateProjectModal({ onClose, onProjectCreated }: CreateProjectModalProps) {
  const { companyId, user } = useAuthStore();
  const currentUserId = user?.id ?? 0;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  useEffect(() => {
    if (companyId !== null) {
      setIsLoadingTeams(true);
      getTeams(companyId)
        .then((data) => {
          setTeams(data);
          setIsLoadingTeams(false);
        })
        .catch((err) => {
          console.error("Failed to fetch teams:", err);
          toast.error("Failed to load teams");
          setIsLoadingTeams(false);
        });
    }
  }, [companyId]);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedTeam = teams.find((team) => team.id === selectedTeamId) || undefined;
      const newProject: Project = {
        id: undefined, // Backend assigns ID
        name: name.trim(),
        description: description.trim() || undefined,
        status: "PLANNING",
        startDate: new Date(),
        endDate: undefined,
        createdById: currentUserId,
        team: selectedTeam,
        memberCount: 0,
        members: [],
        taskCount: 0,
        companyId: companyId ?? undefined,
      };

      const createdProject = await createProject(newProject);
      onProjectCreated(createdProject);
      toast.success("Project created successfully");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-darker/70 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background-light p-6 rounded-xl shadow-2xl w-full max-w-md border border-accent-green/30"
      >
        <h2 className="text-xl font-bold text-text-base mb-4 border-b pb-2 border-background-dark">
          Start New Project
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-text-muted mb-1">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website V3 Redesign"
              className="w-full px-3 py-2 bg-background-dark border border-background-dark rounded-lg text-text-base focus:ring-accent-green focus:border-accent-green outline-none transition duration-150"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="projectDesc" className="block text-sm font-medium text-text-muted mb-1">
              Description
            </label>
            <textarea
              id="projectDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project goals."
              rows={3}
              className="w-full px-3 py-2 bg-background-dark border border-background-dark rounded-lg text-text-base focus:ring-accent-green focus:border-accent-green outline-none transition duration-150"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="teamSelect" className="block text-sm font-medium text-text-muted mb-1">
              Team
            </label>
            <select
              id="teamSelect"
              value={selectedTeamId ?? ""}
              onChange={(e) => setSelectedTeamId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 bg-background-dark border border-background-dark rounded-lg text-text-base focus:ring-accent-green focus:border-accent-green outline-none transition duration-150"
              disabled={isSubmitting || isLoadingTeams}
            >
              <option value="">Select a team (optional)</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {isLoadingTeams && (
              <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                <Loader2 size={14} className="animate-spin" /> Loading teams...
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-text-muted border border-background-dark rounded-lg hover:bg-background-dark transition duration-150"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              className="px-4 py-2 text-sm font-semibold bg-accent-green text-background-light rounded-lg transition duration-150 flex items-center justify-center disabled:opacity-50"
              disabled={isSubmitting || isLoadingTeams}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <PlusCircle size={18} className="mr-2" />}
              Create Project
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
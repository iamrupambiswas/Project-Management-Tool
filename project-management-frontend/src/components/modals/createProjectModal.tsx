import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, PlusCircle } from "lucide-react";
import type { ProjectDto as Project } from "../../@api/models";

interface CreateProjectModalProps {
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leadName, setLeadName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: API call to create project
    // Simulated creation for now
    const newProject: Project = {
      id: Date.now(),
      name,
      description,
      status: 'PLANNING',
      team: { id: 1, name: leadName },
      taskCount: 0,
      memberCount: 1,
      startDate: new Date(),
    };
    onProjectCreated(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-darker/70 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background-light p-6 rounded-xl shadow-2xl w-full max-w-md border border-accent-green/30"
      >
        <h2 className="text-xl font-bold text-text-base mb-4 border-b pb-2 border-background-dark">Start New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-text-muted mb-1">Project Name</label>
            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Website V3 Redesign"
              className="w-full px-3 py-2 bg-background-dark border border-background-dark rounded-lg text-text-base focus:ring-accent-green focus:border-accent-green outline-none transition duration-150"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="projectDesc" className="block text-sm font-medium text-text-muted mb-1">Description</label>
            <textarea
              id="projectDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Brief description of the project goals."
              rows={3}
              className="w-full px-3 py-2 bg-background-dark border border-background-dark rounded-lg text-text-base focus:ring-accent-green focus:border-accent-green outline-none transition duration-150"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="teamLead" className="block text-sm font-medium text-text-muted mb-1">Project Creator (Simulated)</label>
            <input
              id="teamLead"
              type="text"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              required
              placeholder="e.g. Jane Doe"
              className="w-full px-3 py-2 bg-background-dark border border-background-dark rounded-lg text-text-base focus:ring-accent-green focus:border-accent-green outline-none transition duration-150"
              disabled={isSubmitting}
            />
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
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-accent-green text-background-light rounded-lg transition duration-150 flex items-center justify-center disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin mr-2" />
              ) : (
                <PlusCircle size={18} className="mr-2" />
              )}
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProjectModal;

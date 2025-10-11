import React, { useEffect, useState } from "react";
import { PlusCircle, Loader2, FolderOpen, CheckCircle, BarChart2, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { ProjectDto as Project } from "../api/models/ProjectDto";
import { getAllProjects } from "../services/projectService";


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
      <Loader2 size={24} className="text-accent-green" />
    </motion.div>
    <p className="mt-2">Fetching project list...</p>
  </motion.div>
);

interface CreateProjectModalProps {
  onClose: () => void;
  onProjectCreated: (newProject: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leadName, setLeadName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
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

export default function Projects() {
  // State is now strictly typed to the imported DTO
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    getAllProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const getStatusClasses = (status: Project['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-400 bg-green-900/50 border-green-700/50';
      case 'COMPLETED':
        return 'text-blue-400 bg-blue-900/50 border-blue-700/50';
      case 'ON_HOLD':
        return 'text-yellow-400 bg-yellow-900/50 border-yellow-700/50';
      default:
        return 'text-text-muted bg-background-dark';
    }
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] bg-background-dark">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-text-base font-sans bg-background-dark">
      <div className="flex justify-between items-center mb-6 border-b border-background-light pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-text-base flex items-center gap-2">
            <BarChart2 size={24} className="text-accent-green hidden sm:block"/>
            Project Overview
        </h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-accent-green text-background-light px-4 py-2 rounded-xl transition-transform duration-200 hover:scale-[1.03] shadow-md hover:shadow-lg text-sm font-semibold"
        >
          <PlusCircle size={18} />
          <span className="hidden md:inline">Start New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-10">
          No projects found. Use the "Start New Project" button above to get started!
        </p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-background-light border border-background-light rounded-xl shadow-lg transition-all duration-300 hover:border-accent-green/80 hover:shadow-xl cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="flex items-center gap-4">
                    <FolderOpen size={36} className="text-accent-green flex-shrink-0 hidden sm:block" />
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-text-base mb-0.5">{project.name}</h2>
                        <p className="text-xs text-text-muted">Team: <span className="font-medium text-text-base">{project.team.name}</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-1 md:ml-14 line-clamp-2">{project.description}</p>
                </div>

                <div className="flex items-center justify-between md:justify-start gap-6 flex-wrap text-sm md:min-w-[400px]">
                  
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(project.status)} min-w-[75px] text-center`}>
                    {/* The replace is necessary because the status is likely ALL_CAPS with underscores from the Java enum */}
                    {project.status.replace('_', ' ')}
                  </span>
                  
                  <div className="flex items-center gap-1 text-text-muted text-xs">
                    <CheckCircle size={14} className="text-accent-green" />
                    <span className="font-semibold text-text-base">{project.taskCount}</span> Tasks
                  </div>

                   <div className="flex items-center gap-1 text-text-muted text-xs">
                    <Users size={14} className="text-accent-green" />
                    <span className="font-semibold text-text-base">{project.memberCount}</span> Members
                  </div>
                  
                  <div className="text-xs text-text-muted flex items-center gap-1">
                    <Calendar size={14} className="text-text-muted"/>
                    Start: <span className="font-medium text-text-base">{project.startDate}</span>
                  </div>

                </div>
                
                <button
                  className="px-3 py-1 bg-background-dark md:bg-transparent text-accent-green rounded-lg transition-colors hover:bg-accent-green/20 text-xs font-semibold flex-shrink-0 w-full md:w-auto"
                >
                  View Details
                </button>

              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}
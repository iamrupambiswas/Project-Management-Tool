import { useEffect, useState } from "react";
import { PlusCircle, Loader2, FolderOpen, CheckCircle, BarChart2, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { ProjectDto as Project } from "../@api/models";
import { getAllProjects } from "../services/projectService";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  // State is now strictly typed to the imported DTO
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProjects().then((data) => {

      const normalizedProjects = data.map((p: any) => ({
        ...p,
        startDate: p.startDate ? new Date(p.startDate) : null,
        endDate: p.endDate ? new Date(p.endDate) : null,
      }));
  
      setProjects(normalizedProjects);
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
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner message="Fetching project list..." />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-text-base font-sans">
      <div className="flex justify-end items-center mb-6">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm"
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
                        <p className="text-xs text-text-muted">Team: <span className="font-medium text-text-base">{project.team?.name ?? "N/A"}</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-1 md:ml-14 line-clamp-2">{project.description}</p>
                </div>

                <div className="flex items-center justify-between md:justify-start gap-6 flex-wrap text-sm md:min-w-[400px]">
                  
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(project.status)} min-w-[75px] text-center`}>
                    {/* The replace is necessary because the status is likely ALL_CAPS with underscores from the Java enum */}
                    {project.status?.replace('_', ' ')}
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
                    Start: <span className="font-medium text-text-base">{project.startDate?.toDateString()}</span>
                  </div>

                </div>
                
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
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
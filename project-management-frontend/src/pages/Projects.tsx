import { useEffect, useState } from "react";
import { PlusCircle, FolderOpen, CheckCircle, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { ProjectDto as Project } from "../@api/models";
import { getAllProjects } from "../services/projectService";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Projects() {
  const { companyId, user } = useAuthStore();
  const roles = Array.isArray(user?.roles) ? user.roles : Array.from(user?.roles || []);
  const username = user?.username || "";
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyId !== null) {
      getAllProjects(companyId).then((data) => {
        const normalizedProjects = data.map((p: any) => ({
          ...p,
          startDate: p.startDate ? new Date(p.startDate) : null,
          endDate: p.endDate ? new Date(p.endDate) : null,
        }));
        setProjects(normalizedProjects);
        setLoading(false);
      });
    }
  }, [companyId]);

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

  const myProjects = projects.filter((project) =>
    project.members?.some((member) => member.username && member.username === username)
  );

  return (
    <div className="p-6 min-h-screen text-text-base font-sans">
      <div className="flex justify-end items-center mb-6">
        {roles.some((r) => r === "ADMIN" || r === "PROJECT_MANAGER") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm"
          >
            <PlusCircle size={18} />
            <span className="hidden md:inline">Start New Project</span>
          </button>
        )}
      </div>

      {/* My Projects Section (Unchanged) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-base mb-4 text-center">My Projects</h2>
        {myProjects.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4 bg-background-light rounded-md">
            You are not a member of any projects.
          </p>
        ) : (
          <ul className="space-y-3">
            {myProjects.map((project) => (
              <li
                key={project.id}
                className="p-4 bg-background-light border border-background-dark rounded-lg flex items-center gap-4 hover:border-accent-green hover:shadow-md transition-all duration-300"
              >
                <FolderOpen size={20} className="text-accent-green flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-text-base">{project.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(project.status)}`}>
                        {project.status?.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-accent-green">
                        Members: {project.members ? Array.from(project.members).length : 0}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-1">{project.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-text-muted flex items-center gap-1">
                      <CheckCircle size={14} className="text-accent-green" />
                      <span>{project.taskCount} Tasks</span>
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-1">
                      <Calendar size={14} className="text-text-muted" />
                      <span>Start: {project.startDate?.toDateString() ?? "N/A"}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Projects Section (Card Layout, Left-Aligned Heading) */}
      <div>
        <h2 className="text-lg font-semibold text-text-base mb-4 text-left">All Projects</h2>
        {projects.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-10">
            No projects found. Use the "Start New Project" button above to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-background-light border border-background-light rounded-xl shadow-lg transition-all duration-300 hover:border-accent-green/80 hover:shadow-xl cursor-pointer"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <FolderOpen size={24} className="text-accent-green flex-shrink-0" />
                    <h3 className="text-base font-semibold text-text-base">{project.name}</h3>
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2">{project.description}</p>
                  {/* <div className="flex flex-wrap gap-3 items-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(project.status)}`}
                    >
                      {project.status?.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-text-muted text-xs">
                      <CheckCircle size={14} className="text-accent-green" />
                      <span className="font-semibold">{project.taskCount}</span> Tasks
                    </div>
                    <div className="flex items-center gap-1 text-text-muted text-xs">
                      <Users size={14} className="text-accent-green" />
                      <span className="font-semibold">{project.memberCount}</span> Members
                    </div>
                    <div className="flex items-center gap-1 text-text-muted text-xs">
                      <Calendar size={14} className="text-text-muted" />
                      Start: <span className="font-medium">{project.startDate?.toDateString() ?? "N/A"}</span>
                    </div>
                  </div> */}
                  <p className="text-xs text-text-muted">
                    Team: <span className="font-medium text-text-base">{project.team?.name ?? "N/A"}</span>
                  </p>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="mt-2 px-3 py-1 bg-background-dark text-accent-green rounded-lg transition-colors hover:bg-accent-green/20 text-xs font-semibold w-full"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}
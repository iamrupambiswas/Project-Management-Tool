import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getProjectById } from "../services/projectService";
import { getTasksByProjectId } from "../services/taskService"; // Import the task service
import type { ProjectDto as Project, TaskDto } from "../@api/models";
import { TaskDtoStatusEnum } from "../@api/models";
import { 
  ArrowLeft, Calendar, CheckCircle, FolderOpen, Tag, Users,
  ListChecks, PlusCircle, User, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import InviteMemberModal from "../components/modals/InviteMember"; 
import CreateTaskModal from "../components/modals/CreateTaskModal";
import UpdateProjectStatusModal from "../components/modals/UpdateProjectStatusModal";


type Tab = 'overview' | 'tasks' | 'members';

// Helper to get task status colors
const getTaskStatusClasses = (status?: TaskDto['status']) => {
  // Assuming your enum values are PascalCase (e.g., Completed, InProgress)
  switch (status) {
    case TaskDtoStatusEnum.Done: 
      return 'bg-green-600/50 text-green-300';
    case TaskDtoStatusEnum.InProgress: 
      return 'bg-blue-600/50 text-blue-300';
    case TaskDtoStatusEnum.ToDo:
    case TaskDtoStatusEnum.Review: 
      return 'bg-gray-600/50 text-gray-300';
    default: 
      return 'bg-gray-600/50 text-gray-300';
  }
};

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id); // Convert to number once
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]); 
  const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = currentUser?.id ?? 0;

  // Combined fetch logic
  useEffect(() => {
    if (id) {
      Promise.all([
        getProjectById(projectId),
        getTasksByProjectId(projectId)
      ])
      .then(([projectData, tasksData]) => {
          setProject({
            ...projectData,
            startDate: projectData.startDate ? new Date(projectData.startDate) : undefined,
            endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
          });
          setTasks(tasksData);
          setLoading(false);
      })
      .catch((error) => {
          console.error("Error fetching project data:", error);
          setLoading(false);
      });
    }
  }, [id, projectId]);

  const getStatusClasses = (status: Project['status']) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-900/50 border-green-700/50';
      case 'COMPLETED': return 'text-blue-400 bg-blue-900/50 border-blue-700/50';
      case 'ON_HOLD': return 'text-yellow-400 bg-yellow-900/50 border-yellow-700/50';
      default: return 'text-text-muted bg-background-dark border-background-light';
    }
  };

  const handleMemberAdded = (newMemberName: string) => {
    // In a real app, you'd re-fetch the project to update memberCount/list
    console.log(`${newMemberName} added to project team.`);
  };

  const handleTaskCreated = (newTask: TaskDto) => {
    setTasks(prev => [...prev, newTask]);
    // Also update project task count if necessary
    setProject(prev => prev ? { ...prev, taskCount: (prev.taskCount || 0) + 1 } : null);
  };
  
  const handleStatusUpdated = (newStatus: Project['status']) => {
      setProject(prev => prev ? { ...prev, status: newStatus } : null);
      setShowStatusModal(false);
  }

  if (loading) return <LoadingSpinner message="Loading project details..." />;
  if (!project) return <p className="text-center py-10">Project not found</p>;

  // Component to display project key dates and team name
  const ProjectOverview = () => (
    <div className="mt-6 pt-4 border-t border-background-dark flex flex-wrap gap-6">
        <div className="flex items-center gap-2 text-sm">
            <Calendar size={18} className="text-accent-green" />
            <span className="font-semibold">Start Date:</span>
            <span className="text-text-base">{project.startDate?.toDateString() ?? "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
            <Calendar size={18} className="text-accent-green" />
            <span className="font-semibold">Target End Date:</span>
            <span className="text-text-base">{project.endDate?.toDateString() ?? "N/A"}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
            <Tag size={18} className="text-accent-blue" />
            <span className="font-semibold">Team:</span>
            <span className="text-text-base">{project.team?.name ?? "N/A"}</span>
        </div>
    </div>
  );
  
  // Component to list and manage tasks
  const ProjectTasks = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tasks ({tasks.length})</h3>
        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-1 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm"
        >
          <PlusCircle size={16} /> Create Task
        </button>
      </div>
      
      <ul className="space-y-3">
        {tasks.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No tasks yet. Start creating one!</p>
        ) : (
            tasks.map(task => (
                <motion.li 
                    key={task.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-background-dark rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm border border-background-dark hover:border-accent-green/50 transition-colors cursor-pointer"
                >
                    <span className="font-medium flex-grow truncate">{task.title}</span>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        {/* Placeholder for assignee name lookup - assuming a helper is needed */}
                        <span className="text-xs text-text-muted flex items-center gap-1">
                            <User size={14} className="text-accent-blue/70" />
                            Assigned to: <span className="text-text-base font-semibold">{task.assigneeId ?? 'N/A'}</span>
                        </span>
                        
                        {task.priority === 'HIGH' && (
                             <span className="text-xs font-medium text-accent-red flex items-center gap-1">
                                <AlertTriangle size={14} /> High
                            </span>
                        )}

                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTaskStatusClasses(task.status)}`}>
                            {task.status?.replace('_', ' ')}
                        </span>
                    </div>
                </motion.li>
            ))
        )}
      </ul>
    </div>
  );

  // Component to list and manage members
  const ProjectMembers = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Team Members ({project.memberCount ?? 0})</h3>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1 bg-accent-blue text-text-base px-3 py-1 rounded-md transition-colors hover:bg-opacity-80 text-sm"
        >
          <Users size={16} /> Invite Member
        </button>
      </div>
      
      <ul className="space-y-3">
        {/* Iterate over actual project members if available, falling back to placeholders */}
        {project.team?.members && project.team.members.size > 0 ? (
            Array.from(project.team.members).map((member: any) => (
                <li key={member.id} className="p-3 bg-background-dark rounded-lg flex justify-between items-center text-sm">
                    <span className="font-medium">{member.username ?? member.email}</span>
                    <span className="text-text-muted text-xs">{member.role?.replace('_', ' ') ?? 'Member'}</span>
                </li>
            ))
        ) : (
            <>
                <li className="p-3 bg-background-dark rounded-lg flex justify-between items-center text-sm">
                    <span className="font-medium">User A (PM)</span>
                    <span className="text-text-muted text-xs">Project Manager</span>
                </li>
                <li className="p-3 bg-background-dark rounded-lg flex justify-between items-center text-sm">
                    <span className="font-medium">User B</span>
                    <span className="text-text-muted text-xs">Member</span>
                </li>
            </>
        )}
      </ul>
    </div>
  );

  // --- Main Render ---

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen text-text-base font-sans"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-accent-green hover:text-accent-green/80 transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={18} />
        Back to Projects
      </button>

      {/* Project Header and Main Info Card */}
      <div className="bg-background-light p-6 rounded-xl shadow-lg border border-background-light">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <FolderOpen size={48} className="text-accent-green flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-text-base">{project.name}</h1>
              <p className="text-sm text-text-muted mt-1 line-clamp-2">{project.description}</p>
            </div>
          </div>
          
          {/* Status and Update Button */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(project.status)} text-center min-w-[70px]`}>
              {project.status?.replace('_', ' ') || 'N/A'}
            </span>
            <button
                onClick={() => setShowStatusModal(true)}
                className="text-xs text-accent-yellow hover:text-accent-yellow/80 font-semibold"
            >
                Update Status
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-background-dark mt-4">
          <nav className="flex space-x-4">
            {[{ key: 'overview', label: 'Overview', icon: FolderOpen }, 
              { key: 'tasks', label: `Tasks (${tasks.length})`, icon: ListChecks }, 
              { key: 'members', label: `Members (${project.memberCount ?? 0})`, icon: Users }]
              .map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as Tab)}
                  className={`flex items-center gap-1 py-2 px-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'border-b-2 border-accent-green text-accent-green'
                      : 'text-text-muted hover:text-text-base'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && <ProjectOverview />}
          {activeTab === 'tasks' && <ProjectTasks />}
          {activeTab === 'members' && <ProjectMembers />}
        </div>
      </div>
      
      {/* Modals */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <InviteMemberModal 
            teamId={String(project.team?.id ?? projectId)}
            onClose={() => setShowInviteModal(false)}
            onMemberAdded={handleMemberAdded}
          />
        </div>
      )}

// 1. You would need to define this state/variable, perhaps fetching it from context:
// const currentUserId = 1; // Placeholder: Replace with actual logged-in user's ID

// ... inside the ProjectDetails render function

    {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <CreateTaskModal
                projectId={projectId}
                creatorId={currentUserId} 
                teamMembers={
                    project.team?.members 
                    ? Array.from(project.team.members) as any 
                    : []
                } 
                onClose={() => setShowTaskModal(false)}
                onTaskCreated={handleTaskCreated}
            />
        </div>
    )}
      
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <UpdateProjectStatusModal
            projectId={projectId}
            currentStatus={project.status ?? 'UNKNOWN'}
            onClose={() => setShowStatusModal(false)}
            onStatusUpdated={handleStatusUpdated}
          />
        </div>
      )}

    </motion.div>
  );
}
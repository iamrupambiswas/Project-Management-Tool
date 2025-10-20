import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getAllTasks } from "../services/taskService";
import type { TaskDto } from "../@api/models";
import { TaskDtoStatusEnum, TaskDtoPriorityEnum } from "../@api/models"; // Import Enums as values
import { 
  PlusCircle, ListChecks, Search, Clock, AlertTriangle 
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Import the modal component
import CreateTaskModal from "../components/modals/CreateTaskModal"; // Assuming this path is correct

// --- Helper Functions (Reusable) ---

const getStatusClasses = (status?: TaskDtoStatusEnum) => {
  switch (status) {
    case TaskDtoStatusEnum.Done: return 'bg-green-600/50 text-green-300';
    case TaskDtoStatusEnum.InProgress: return 'bg-blue-600/50 text-blue-300';
    case TaskDtoStatusEnum.Review: return 'bg-purple-600/50 text-purple-300';
    case TaskDtoStatusEnum.ToDo: return 'bg-gray-600/50 text-gray-300';
    default: return 'bg-gray-600/50 text-gray-300';
  }
};

const getPriorityColor = (priority?: TaskDtoPriorityEnum) => {
    switch (priority) {
        case TaskDtoPriorityEnum.High: return 'text-accent-red';
        case TaskDtoPriorityEnum.Medium: return 'text-accent-yellow';
        case TaskDtoPriorityEnum.Low: 
        default: return 'text-text-muted';
    }
}

// --- Placeholder/Mock Data (Replace with real context/API calls) ---
// In a real app, this data would come from context or a global team API.
const MOCK_TEAM_MEMBERS = [
    { id: 101, username: 'Alice Smith' },
    { id: 102, username: 'Bob Johnson' },
    { id: 103, username: 'Charlie Brown' },
];
const CURRENT_USER_ID = 101; // Alice is creating the task
const DEFAULT_PROJECT_ID = 1; // Since this is a global task list, we need a default project ID

// --- Component ---

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false); // New state for modal
  
  const navigate = useNavigate();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const tasksData = await getAllTasks();
        const normalizedTasks = tasksData.map(t => ({
            ...t,
            createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        }));
        setTasks(normalizedTasks);
      } catch (error) {
        console.error("Failed to fetch all tasks:", error);
        toast.error("Failed to load task list.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);
  
  // Handler to update the list after a new task is successfully created
  const handleTaskCreated = (newTask: TaskDto) => {
      setTasks(prev => [...prev, newTask]);
      setShowCreateTaskModal(false); // Close the modal
  };

  // --- Filtering Logic ---
  const filteredTasks = tasks.filter(task => {
    // 1. Search filter
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Status filter
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner message="Loading all tasks..." />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen text-text-base font-sans"
    >
      
      {/* Filtering and Search Controls */}
      <div className="bg-background-light p-4 rounded-xl shadow-inner mb-6 flex flex-wrap gap-4 items-center">
        
        {/* New Task Button - Now opens the modal */}
        <button
          onClick={() => setShowCreateTaskModal(true)}
          className="flex items-center gap-1 bg-accent-blue text-white px-4 py-1.5 rounded-md transition-colors hover:bg-opacity-80 text-sm font-semibold"
        >
          <PlusCircle size={18} /> New Task
        </button>

        {/* Search Input */}
        <div className="relative flex-grow min-w-[200px] ml-auto">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-md bg-background-dark text-text-base focus:border-accent-green outline-none"
          />
        </div>

        {/* Status Filter Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded-md bg-background-dark text-text-base focus:border-accent-green outline-none"
        >
          <option value="ALL">All Statuses</option>
          {Object.values(TaskDtoStatusEnum).map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ')}
            </option>
          ))}
        </select>
        
        <span className="text-sm text-text-muted">
            Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
            <p className="text-center text-text-muted py-10 bg-background-light rounded-xl">
                No tasks match your current filters.
            </p>
        ) : (
            filteredTasks.map(task => (
                <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/tasks/${task.id}`)} // Navigate to the Task Detail Screen
                    className="p-4 bg-background-light rounded-xl flex justify-between items-start gap-4 cursor-pointer hover:shadow-lg hover:border-accent-blue transition-all border border-background-dark"
                >
                    <div className="flex-grow">
                        <h2 className="text-lg font-semibold hover:text-accent-green transition-colors">{task.title}</h2>
                        <p className="text-xs text-text-muted mt-1 line-clamp-1">
                            Project ID: {task.projectId ?? 'N/A'} | Created: {task.createdAt?.toDateString() ?? 'N/A'}
                        </p>
                        <p className={`text-xs mt-2 flex items-center gap-1 ${getPriorityColor(task.priority as TaskDtoPriorityEnum)}`}>
                            <AlertTriangle size={14} /> Priority: {task.priority?.replace('_', ' ') ?? 'N/A'}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(task.status as TaskDtoStatusEnum)}`}>
                            {task.status?.replace('_', ' ') || 'N/A'}
                        </span>
                        {task.dueDate && (
                            <span className="text-xs text-accent-yellow flex items-center gap-1">
                                <Clock size={12} /> Due: {task.dueDate.toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </motion.div>
            ))
        )}
      </div>
      
      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <CreateTaskModal
            projectId={DEFAULT_PROJECT_ID} // Using a default/placeholder project ID
            creatorId={CURRENT_USER_ID}   // Using placeholder current user ID
            teamMembers={MOCK_TEAM_MEMBERS} // Using mock members for assignment
            onClose={() => setShowCreateTaskModal(false)}
            onTaskCreated={handleTaskCreated}
          />
        </div>
      )}
    </motion.div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getAllTasks } from "../services/taskService";
import { TaskDtoStatusEnum, TaskDtoPriorityEnum } from "../@api/models";
import type { TaskDto } from "../@api/models";
import { PlusCircle, Clock, AlertTriangle, Search } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import { useAuthStore } from "../store/authStore";

const getStatusClasses = (status?: TaskDtoStatusEnum) => {
  switch (status) {
    case TaskDtoStatusEnum.Done: return "bg-green-600/50 text-green-300";
    case TaskDtoStatusEnum.InProgress: return "bg-blue-600/50 text-blue-300";
    case TaskDtoStatusEnum.Review: return "bg-purple-600/50 text-purple-300";
    case TaskDtoStatusEnum.ToDo: return "bg-gray-600/50 text-gray-300";
    default: return "bg-gray-600/50 text-gray-300";
  }
};

const getPriorityColor = (priority?: TaskDtoPriorityEnum) => {
  switch (priority) {
    case TaskDtoPriorityEnum.High: return "text-accent-red";
    case TaskDtoPriorityEnum.Medium: return "text-accent-yellow";
    case TaskDtoPriorityEnum.Low:
    default: return "text-text-muted";
  }
};

// Mock data for modal (replace with real data in your app)
const MOCK_TEAM_MEMBERS = [
  { id: 101, username: "Alice Smith" },
  { id: 102, username: "Bob Johnson" },
  { id: 103, username: "Charlie Brown" },
];
const CURRENT_USER_ID = 101;
const DEFAULT_PROJECT_ID = 1;

export default function Tasks() {
  const { companyId, user } = useAuthStore();
  const roles = Array.isArray(user?.roles) ? user.roles : Array.from(user?.roles || []);
  const userId = user?.id || 0;
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        if (companyId !== null) {
          const tasksData = await getAllTasks(companyId);
          const normalizedTasks = tasksData.map((t) => ({
            ...t,
            createdAt: t.createdAt ? new Date(t.createdAt) : undefined,
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
          }));
          setTasks(normalizedTasks);
        }
      } catch (error) {
        console.error("Failed to fetch all tasks:", error);
        toast.error("Failed to load task list.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [companyId]);

  const handleTaskCreated = (newTask: TaskDto) => {
    const normalizedTask = {
      ...newTask,
      createdAt: newTask.createdAt ? new Date(newTask.createdAt) : undefined,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
    };
    setTasks((prev) => [...prev, normalizedTask]);
    setShowCreateTaskModal(false);
  };

  const myTasks = tasks.filter((task) => task.assigneeId === userId);
  const filteredTasks = myTasks.filter((task) => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner message="Loading all tasks..." />;

  return (
    <div className="p-6 min-h-screen text-text-base font-sans">
      {/* Filtering and Search Controls */}
      {/* <div className="bg-background-light p-4 rounded-xl shadow-inner mb-6 flex flex-wrap gap-4 items-center">
        {roles.some((r) => r === "ADMIN" || r === "PROJECT_MANAGER" || r === "TEAM_LEAD") && (
          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="flex items-center gap-1 bg-accent-blue text-white px-4 py-1.5 rounded-md transition-colors hover:bg-opacity-80 text-sm font-semibold"
          >
            <PlusCircle size={18} /> New Task
          </button>
        )}
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded-md bg-background-dark text-text-base focus:border-accent-green outline-none"
        >
          <option value="ALL">All Statuses</option>
          {Object.values(TaskDtoStatusEnum).map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
        <span className="text-sm text-text-muted">
          Showing {filteredTasks.length} of {myTasks.length} tasks
        </span>
      </div> */}

      {/* My Tasks Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-base mb-4 text-center">My Tasks</h2>
        {filteredTasks.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4 bg-background-light rounded-md">
            You have no assigned tasks.
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="p-4 bg-background-light border border-background-dark rounded-lg flex items-center gap-4 hover:border-accent-green hover:shadow-md transition-all duration-300"
                onClick={() => navigate(`/tasks/${task.id}`, { state: { from: 'tasks' } })}
              >
                <Clock size={20} className="text-accent-green flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-text-base">{task.title}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(task.status)}`}>
                      {task.status?.replace("_", " ") ?? "N/A"}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                    <AlertTriangle size={14} /> Priority: {task.priority?.replace("_", " ") ?? "N/A"}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-text-muted">
                      Project: {task.projectId ?? "N/A"}
                    </p>
                    <p className="text-xs text-text-muted">
                      Created: {task.createdAt?.toDateString() ?? "N/A"}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-accent-yellow flex items-center gap-1">
                        <Clock size={12} /> Due: {task.dueDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All Tasks Section (Simplified) */}
      <div>
        <h2 className="text-lg font-semibold text-text-base mb-4 text-left">All Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-10">
            No tasks found. Create one to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-background-light border border-background-light rounded-xl shadow-lg transition-all duration-300 hover:border-accent-green/80 hover:shadow-xl cursor-pointer"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-accent-green flex-shrink-0" />
                    <h3 className="text-base font-semibold text-text-base">{task.title}</h3>
                  </div>
                  <span
                    className={`self-start inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusClasses(task.status)}`}
                  >
                    {task.status?.replace("_", " ") ?? "N/A"}
                  </span>
                  <button
                    onClick={() => navigate(`/tasks/${task.id}`, { state: { from: 'tasks' } })}
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

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <CreateTaskModal
            projectId={DEFAULT_PROJECT_ID}
            creatorId={CURRENT_USER_ID}
            teamMembers={MOCK_TEAM_MEMBERS}
            onClose={() => setShowCreateTaskModal(false)}
            onTaskCreated={handleTaskCreated}
          />
        </div>
      )}
    </div>
  );
}
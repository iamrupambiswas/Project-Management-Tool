import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getTaskById, updateTask } from "../services/taskService";
import type { TaskDto } from "../@api/models";
import { TaskDtoStatusEnum, TaskDtoPriorityEnum } from "../@api/models"; 
import { getUserById } from "../services/userService"; 
import { 
  ArrowLeft, CheckCircle, Clock, User, AlertTriangle, Calendar, Edit3, Save, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import FloatingAIAssistant from "../components/common/FloatingAiAssistant";

// Utility to get Tailwind classes based on task status
const getStatusClasses = (status?: TaskDtoStatusEnum) => {
  switch (status) {
    case TaskDtoStatusEnum.Done: return 'text-green-400 bg-green-900/50 border-green-700/50';
    case TaskDtoStatusEnum.InProgress: return 'text-blue-400 bg-blue-900/50 border-blue-700/50';
    case TaskDtoStatusEnum.Review: return 'text-purple-400 bg-purple-900/50 border-purple-700/50';
    case TaskDtoStatusEnum.ToDo: return 'text-yellow-400 bg-yellow-900/50 border-yellow-700/50';
    default: return 'text-text-muted bg-background-dark border-background-light';
  }
};

// Utility to get Tailwind classes based on task priority
const getPriorityClasses = (priority?: TaskDtoPriorityEnum) => {
    switch (priority) {
        case TaskDtoPriorityEnum.High: return 'text-accent-red font-bold';
        case TaskDtoPriorityEnum.Medium: return 'text-accent-yellow';
        case TaskDtoPriorityEnum.Low: 
        default: return 'text-text-muted';
    }
}

// --- Component ---

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser?.role === "ADMIN";
  const taskId = Number(id);
  const [task, setTask] = useState<TaskDto | null>(null);
  const [assigneeName, setAssigneeName] = useState('Loading...');
  const [creatorName, setCreatorName] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  
  const from = (location.state as { from?: string; projectId?: number })?.from;
  const projectIdFromState = (location.state as { projectId?: number })?.projectId;
  const canUpdateStatus = 
  currentUser?.role === 'ADMIN' || currentUser?.id === task?.assigneeId;


  // --- Data Fetching ---
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const taskData = await getTaskById(taskId);
        
        // Normalize dates
        const normalizedTask = {
            ...taskData,
            createdAt: taskData.createdAt ? new Date(taskData.createdAt) : undefined,
            dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        };
        
        setTask(normalizedTask);
        setEditedDescription(normalizedTask.description || '');

        // Fetch assignee and creator names (Assuming getUserById returns an object with a 'username' property)
        const [assigneeUser, creatorUser] = await Promise.all([
          taskData.assigneeId ? getUserById(taskData.assigneeId) : Promise.resolve(null),
          taskData.creatorId ? getUserById(taskData.creatorId) : Promise.resolve(null)
        ]);
        
        setAssigneeName(assigneeUser?.username || 'Unassigned');
        setCreatorName(creatorUser?.username || 'System');
        
      } catch (error) {
        console.error("Failed to fetch task data:", error);
        toast.error("Failed to load task.");
      } finally {
        setLoading(false);
      }
    };
    fetchTaskData();
  }, [id, taskId]);


  // --- Update Handlers ---

  const handleUpdate = async (field: 'status' | 'priority', value: TaskDtoStatusEnum | TaskDtoPriorityEnum) => {
    if (!task) return;

    setIsUpdating(true);
    const updatedTaskData: TaskDto = {
        ...task,
        [field]: value
    };

    try {
        // Optimistic update
        setTask(prev => prev ? { ...prev, [field]: value } : null);
        
        await updateTask(taskId, updatedTaskData);
        toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated!`);
    } catch (error) {
        console.error(`Failed to update ${field}:`, error);
        toast.error(`Failed to update ${field}.`);
        // Rollback on failure (optional but good practice)
        setTask(task); 
    } finally {
        setIsUpdating(false);
    }
  };

  const handleDescriptionSave = async () => {
    if (!task) return;
    setIsUpdating(true);
    
    try {
        await updateTask(taskId, { ...task, description: editedDescription });
        setTask(prev => prev ? { ...prev, description: editedDescription } : null);
        setIsEditing(false);
        toast.success("Description saved!");
    } catch (error) {
        console.error("Failed to save description:", error);
        toast.error("Failed to save description.");
    } finally {
        setIsUpdating(false);
    }
  };


  if (loading) return <LoadingSpinner message="Loading task details..." />;
  if (!task) return <p className="text-center py-10">Task not found</p>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 min-h-screen text-text-base font-sans"
    >
      <button
        onClick={() => {
          if (from === 'project' && projectIdFromState) {
            navigate(`/projects/${projectIdFromState}`);
          } else if (from === 'tasks') {
            navigate('/tasks');
          } else if (task.project?.id) {
            // fallback — if user came via direct URL or unknown source
            navigate(`/projects/${task.project?.id}`);
          } else {
            navigate('/tasks');
          }
        }}
        className="flex items-center gap-2 text-accent-green hover:text-accent-green/80 transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={18} />
        {from === 'project' ? 'Back to Project' : 'Back to Tasks'}
      </button>


      {/* Task Header */}
      <div className="bg-background-light p-6 rounded-xl shadow-lg border border-accent-blue/50 mb-6">
        <div className="flex items-center justify-between gap-4">
          
          {/* Title and ID */}
          <div>
            <h1 className="text-2xl font-bold text-text-base mb-1">{task.title}</h1>
            <p className="text-sm text-text-muted">Task ID: {task.id}</p>
          </div>

          {/* Status Badge */}
          <span className={`px-4 py-2 text-xs font-medium rounded-lg border min-w-[100px] text-center ${getStatusClasses(task.status as TaskDtoStatusEnum)}`}>
            {task.status?.replace('_', ' ') || 'N/A'}
          </span>
        </div>
      </div>
      
      {/* Task Metadata and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Details & Description */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Metadata Card */}
            <div className="bg-background-light p-6 rounded-xl shadow-md border border-background-dark">
                <h2 className="text-lg font-semibold mb-4 border-b border-background-dark pb-2">Task Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    {/* Assignee */}
                    <div className="flex items-center gap-2 text-sm">
                        <User size={18} className="text-accent-blue" />
                        <span className="font-semibold">Assignee:</span>
                        <span className="text-text-base font-medium">{assigneeName}</span>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-2 text-sm">
                        <User size={18} className="text-accent-green" />
                        <span className="font-semibold">Created By:</span>
                        <span className="text-text-base font-medium">{creatorName}</span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={18} className="text-accent-yellow" />
                        <span className="font-semibold">Due Date:</span>
                        <span className="text-text-base font-medium">
                            {task.dueDate?.toDateString() ?? "Not Set"}
                        </span>
                    </div>

                    {/* Creation Date */}
                    <div className="flex items-center gap-2 text-sm">
                        <Clock size={18} className="text-text-muted" />
                        <span className="font-semibold">Created At:</span>
                        <span className="text-text-base font-medium">
                            {task.createdAt?.toDateString() ?? "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description Card */}
            <div className="bg-background-light p-6 rounded-xl shadow-md border border-background-dark">
                <div className="flex justify-between items-center mb-4 border-b border-background-dark pb-2">
                    <h2 className="text-lg font-semibold">Description</h2>
                    <button
                        onClick={() => {
                            if (isEditing) {
                                handleDescriptionSave();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                        disabled={isUpdating}
                        className={`p-2 rounded-full transition-colors ${
                            isEditing ? 'bg-accent-green hover:bg-green-700' : 'text-text-muted hover:text-accent-blue'
                        }`}
                    >
                        {isUpdating ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : isEditing ? (
                            <Save size={18} />
                        ) : (
                            <Edit3 size={18} />
                        )}
                    </button>
                </div>
                
                {isEditing ? (
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full p-3 border rounded-md bg-background-dark text-text-base resize-y min-h-[150px] focus:border-accent-blue outline-none"
                        placeholder="Enter detailed task description..."
                        disabled={isUpdating}
                    />
                ) : (
                    <p className="text-text-muted whitespace-pre-wrap min-h-[100px]">
                        {task.description || "No detailed description provided for this task."}
                    </p>
                )}
            </div>

        </div>

        {/* RIGHT COLUMN: Quick Status/Priority Updates */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Status Update */}
            <div className="bg-background-light p-4 rounded-xl shadow-md border border-background-dark">
                <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle size={18} className="text-accent-green" /> Update Status
                </h3>
                <select
                    value={task.status || ''}
                    onChange={(e) => handleUpdate('status', e.target.value as TaskDtoStatusEnum)}
                    disabled={isUpdating || !canUpdateStatus}
                    className="w-full p-2 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none disabled:opacity-50"
                >
                    {/* Map over enum values for options */}
                    {Object.values(TaskDtoStatusEnum).map((s) => (
                        <option key={s} value={s}>
                            {s.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            </div>

            {/* Priority Update */}
            <div className="bg-background-light p-4 rounded-xl shadow-md border border-background-dark">
                <h3 className="text-md font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-accent-yellow" /> Change Priority
                </h3>
                <select
                    value={task.priority || ''}
                    onChange={(e) => handleUpdate('priority', e.target.value as TaskDtoPriorityEnum)}
                    disabled={isUpdating || !isAdmin}
                    className={`w-full p-2 border rounded-md bg-background-dark outline-none disabled:opacity-50 ${getPriorityClasses(task.priority as TaskDtoPriorityEnum)}`}
                >
                    {/* Map over enum values for options */}
                    {Object.values(TaskDtoPriorityEnum).map((p) => (
                        <option key={p} value={p}>
                            {p.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            </div>

            {/* Project Link */}
            {task.project?.id && (
                <button
                    onClick={() => navigate(`/projects/${task.project?.id}`)}
                    className="w-full bg-accent-blue/80 text-white py-2 rounded-md hover:bg-accent-blue transition-colors font-semibold text-sm"
                >
                    View Project ({task.project?.id})
                </button>
            )}

        </div>
      </div>

      <FloatingAIAssistant taskId={task.id ?? 0} />

    </motion.div>
  );
}
import { useState } from "react";
import { X, Loader2, Calendar, AlertTriangle, User } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  TaskDto,
  TaskDtoStatusEnum,
  TaskDtoPriorityEnum,
} from "../../@api/models";
import { createTask } from "../../services/taskService";
import { useAuthStore } from "../../store/authStore";

interface TeamMember {
  id: number;
  username: string;
  email?: string;
}

interface CreateTaskProps {
  projectId: number;
  creatorId: number;
  teamMembers: TeamMember[];
  onClose: () => void;
  onTaskCreated: (newTask: TaskDto) => void;
}

export default function CreateTaskModal({
  projectId,
  creatorId,
  teamMembers,
  onClose,
  onTaskCreated,
}: CreateTaskProps) {
  const { companyId } = useAuthStore();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedMemberId, setAssignedMemberId] = useState<string>("");
  const [priority, setPriority] = useState<TaskDtoPriorityEnum>(
    TaskDtoPriorityEnum.Low
  );
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedAssigneeId = assignedMemberId
    ? Number(assignedMemberId)
    : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      toast.error("Please enter a task title.");
      return;
    }

    setLoading(true);

    const taskData: TaskDto = {
      title: taskName.trim(),
      description: description?.trim() || undefined,
      project: { id: projectId },
      creatorId,
      assigneeId: selectedAssigneeId,
      status: TaskDtoStatusEnum.ToDo,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      companyId: companyId ?? undefined,
      createdAt: new Date(),
    };

    try {
      const newTask = await createTask(taskData);

      const normalizedTask: TaskDto = {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      };

      if (selectedAssigneeId) {
        toast.success(
          `Task "${normalizedTask.title}" created and assigned successfully!`
        );
      } else {
        toast.success(`Task "${normalizedTask.title}" created successfully!`);
      }

      onTaskCreated(normalizedTask);
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-4 p-6 rounded-xl shadow-2xl w-full max-w-lg bg-background-light border border-background-dark text-text-base"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-text-base transition-colors"
      >
        <X size={20} />
      </button>

      <h3 className="text-lg font-semibold border-b border-background-dark pb-2">
        Create New Task (Project: {projectId})
      </h3>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="task-name"
          className="text-sm font-medium text-text-muted"
        >
          Task Title
        </label>
        <input
          id="task-name"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="e.g., Implement dark mode toggle"
          className="w-full p-2 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none"
          disabled={loading}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="task-description"
          className="text-sm font-medium text-text-muted"
        >
          Description (Optional)
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed steps or context for the task..."
          rows={3}
          className="w-full p-2 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none resize-none"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="assign-member"
            className="text-sm font-medium text-text-muted flex items-center gap-1"
          >
            <User size={14} /> Assign To
          </label>
          <select
            id="assign-member"
            value={assignedMemberId}
            onChange={(e) => {
              setAssignedMemberId(e.target.value);
            }}
            className="border p-2 rounded-md text-text-base bg-background-dark focus:border-accent-blue outline-none"
            disabled={loading}
            required
          >
            <option value="" disabled>
              Select a member
            </option>
            {teamMembers
              .filter((member) => typeof member !== "string" && member.id)
              .map((member) => (
                <option key={member.id} value={String(member.id)}>
                  {member.username || member.email || `User ${member.id}`}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="priority"
            className="text-sm font-medium text-text-muted flex items-center gap-1"
          >
            <AlertTriangle size={14} /> Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as TaskDtoPriorityEnum)
            }
            className="border p-2 rounded-md text-text-base bg-background-dark focus:border-accent-blue outline-none"
            disabled={loading}
          >
            <option value={TaskDtoPriorityEnum.Low}>Low</option>
            <option value={TaskDtoPriorityEnum.Medium}>Medium</option>
            <option value={TaskDtoPriorityEnum.High}>High</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 col-span-2">
          <label
            htmlFor="due-date"
            className="text-sm font-medium text-text-muted flex items-center gap-1"
          >
            <Calendar size={14} /> Due Date (Optional)
          </label>
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded-md bg-background-dark text-text-base focus:border-accent-blue outline-none"
            disabled={loading}
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading || !taskName}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-accent-green text-white py-2 rounded-md hover:bg-opacity-80 disabled:bg-gray-400 transition-colors font-semibold flex justify-center items-center gap-2 mt-2"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Creating...
          </>
        ) : (
          "Create Task"
        )}
      </motion.button>
    </motion.form>
  );
}

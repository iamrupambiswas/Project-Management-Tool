import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ProjectDtoStatusEnum } from "../../@api/models";
import { updateProjectStatus } from "../../services/projectService"; // ✅ import your real API

const statusOptions: string[] = Object.values(ProjectDtoStatusEnum);

interface UpdateProjectStatusProps {
  projectId: number;
  currentStatus: ProjectDtoStatusEnum | string;
  onClose: () => void;
  onStatusUpdated: (newStatus: ProjectDtoStatusEnum) => void;
}

export default function UpdateProjectStatusModal({
  projectId,
  currentStatus,
  onClose,
  onStatusUpdated,
}: UpdateProjectStatusProps) {
  const [newStatus, setNewStatus] = useState<ProjectDtoStatusEnum | string>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus === currentStatus) {
      toast("No changes detected");
      return;
    }

    setLoading(true);

    try {
      // ✅ Call the actual API
      await updateProjectStatus(projectId, newStatus as ProjectDtoStatusEnum);

      toast.success(`Project status updated to ${newStatus.replace("_", " ")}!`);
      onStatusUpdated(newStatus as ProjectDtoStatusEnum);
      onClose();
    } catch (err) {
      console.error("Error updating project status:", err);
      toast.error("Failed to update project status.");
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
      className="relative flex flex-col gap-4 p-6 rounded-xl shadow-2xl w-full max-w-sm
                 bg-background-light border border-background-dark text-text-base"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-text-base transition-colors"
      >
        <X size={20} />
      </button>

      <h3 className="text-lg font-semibold border-b border-background-dark pb-2">
        Update Project Status
      </h3>

      <div className="flex flex-col gap-2">
        <label htmlFor="status-select" className="text-sm font-medium text-text-muted">
          Select New Status
        </label>
        <select
          id="status-select"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as ProjectDtoStatusEnum)}
          className="border p-2 rounded-md text-text-base bg-background-dark focus:border-accent-blue outline-none"
          disabled={loading}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <motion.button
        type="submit"
        disabled={loading || newStatus === currentStatus}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-accent-yellow text-text-base py-2 rounded-md hover:bg-opacity-80 disabled:bg-gray-400 transition-colors font-semibold flex justify-center items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Saving...
          </>
        ) : (
          "Save Status"
        )}
      </motion.button>
    </motion.form>
  );
}

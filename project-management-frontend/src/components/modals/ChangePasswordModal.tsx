import { useState } from "react";
import { X } from "lucide-react";
import { changePassword } from "../../services/authService";
import LoadingSpinner from "../common/LoadingSpinner";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const message = await changePassword(oldPassword, newPassword);
      setSuccess(message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background-light rounded-xl border border-background-dark shadow-xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-white mb-4">
          Change Password
        </h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-3">{success}</p>}
        {loading && (
          <div className="flex justify-center mt-3">
            <LoadingSpinner />
          </div>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

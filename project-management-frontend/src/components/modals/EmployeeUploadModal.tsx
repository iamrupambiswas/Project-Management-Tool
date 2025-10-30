import { useState } from "react";
import { X, Info, UploadCloud } from "lucide-react";
import { uploadUserCSV } from "../../services/adminService"; //
import LoadingSpinner from "../common/LoadingSpinner"; //

interface UserUploadModalProps {
  onClose: () => void;
}

export default function UserUploadModal({ onClose }: UserUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith(".csv")) {
        setError("Please upload a valid .csv file");
        setFile(null);
      } else {
        setFile(selected);
        setError(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    setUploading(true);
    try {
      const message = await uploadUserCSV(file); // ✅ Call service function
      alert("✅ " + message);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload the file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background-light rounded-xl border border-background-dark shadow-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-white mb-3">Upload User CSV</h2>
        <div className="flex items-start gap-2 text-gray-400 text-sm mb-4">
          <Info size={16} className="mt-0.5 text-blue-400" />
          <p>
            Upload a CSV file with the following columns: <br />
            <span className="text-gray-300">
              <strong>username,email,role</strong>
            </span>
            <br />
            Example:
            <br />
            <code className="block bg-gray-900 p-2 rounded mt-1 text-xs text-gray-300">
              Rupam Biswas,rupam@company.com,DEVELOPER
              <br />
              Priya Sen,priya@company.com,MANAGER
            </code>
          </p>
        </div>

        {/* File Input */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csvFileInput"
          />
          <label
            htmlFor="csvFileInput"
            className="cursor-pointer flex flex-col items-center text-gray-300 hover:text-blue-400"
          >
            <UploadCloud className="w-10 h-10 mb-2 text-blue-400" />
            {file ? (
              <span className="text-sm">{file.name}</span>
            ) : (
              <span className="text-sm">Click to select CSV file</span>
            )}
          </label>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
              uploading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import {
  Clipboard,
  Check,
  ArrowLeft,
  Pencil,
  Trash2,
  Upload,
  LogOut,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCompany } from "../services/companyService";
import { uploadProfileImage, deleteProfileImage } from "../services/commonService";
import { CompanyDto, UserDto } from "../@api/models";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";

export default function ProfilePage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const companyId = localStorage.getItem("companyId");

    if (storedUser) {
      const parsedUser: UserDto = JSON.parse(storedUser);
      setUser(parsedUser);
      if (companyId) {
        fetchCompany(parseInt(companyId));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCompany = async (companyId: number) => {
    try {
      const data = await getCompany(companyId);
      setCompany(data);
    } catch (err) {
      console.error("Failed to fetch company:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.error("Failed to copy text");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const updatedUser = await uploadProfileImage(file);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to upload image:", err);
    } finally {
      setUploading(false);
    }
  };
  
  const handleImageDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await deleteProfileImage();
      const updatedUser = { ...user, profileImageUrl: "" };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to delete image:", err);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };  

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading)
    return <div className="p-6 text-center text-text-muted">Loading profile details...</div>;

  if (!user)
    return <div className="p-6 text-center text-text-muted">No user data available.</div>;

  const isAdmin = Array.from(user.roles ?? []).includes("ADMIN");

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-accent-blue hover:text-accent-blue/80 font-medium transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <section>
        <h2 className="text-xl font-semibold text-accent-blue mb-6">
          User Information
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 relative">
          <div className="relative group w-28 h-28">
            <img
              src={
                user.profileImageUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.username ?? "User"
                )}&background=E0E7FF&color=3730A3`
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border border-gray-300 shadow-md"
            />

            {(uploading || deleting) && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center z-10">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!uploading && !deleting && (
              <>
                {user.profileImageUrl ? (
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white/90 rounded-full hover:bg-white"
                      title="Edit Image"
                    >
                      <Pencil size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white"
                      title="Delete Image"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center text-white"
                    >
                      <Upload size={18} />
                      <span className="text-xs mt-1 font-medium">Upload</span>
                    </button>
                  </div>
                )}
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={uploading || deleting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-text-base flex-1">
            <ProfileField label="Username" value={user.username ?? ""} />
            <ProfileField label="Email" value={user.email ?? ""} />
            <ProfileField label="Roles" value={Array.from(user.roles ?? []).join(", ")} />
            <ProfileField label="User ID" value={String(user.id)} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-accent-blue text-white text-sm rounded-md hover:bg-accent-blue/90 transition"
          >
            Change Password
          </button>
        </div>
      </section>

      {company && (
        <section>
          <h2 className="text-xl font-semibold text-accent-blue mb-6">
            Company Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-text-base">
            <ProfileField label="Company Name" value={company.name ?? ""} />
            <ProfileField label="Domain" value={company.domain || "—"} />

            {isAdmin && (
              <div className="flex flex-col">
                <span className="text-sm text-text-muted">Join Code</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium break-all">
                    {company.joinCode || "—"}
                  </span>
                  <button
                    onClick={() => handleCopy(String(company.joinCode ?? ""))}
                    className={`p-1.5 rounded-md border text-sm transition-all ${
                      copied
                        ? "bg-green-50 border-green-400 text-green-600"
                        : "bg-background-light border-gray-300 hover:bg-accent-blue/10 hover:text-accent-blue"
                    }`}
                    title="Copy Join Code"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- Logout Button at bottom --- */}
      <div className="pt-6 mt-10 flex justify-center relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* --- Password Modal --- */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your profile image? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleImageDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

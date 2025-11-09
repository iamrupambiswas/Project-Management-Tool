import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getUserById, updateUser, updateUserRoles, adminChangeUserPassword } from "../../services/userService";
import { useAuthStore } from "../../store/authStore";
import type { UserDto } from "../../@api/models";
import { ArrowLeft } from "lucide-react";

const ROLE_OPTIONS = ["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "USER"];

export default function MemberDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();

  const [member, setMember] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    roles: [] as string[],
  });
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });

  const isAdmin = currentUser?.roles ? (currentUser.roles instanceof Set ? currentUser.roles.has("ADMIN") : false) : false;

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const data = await getUserById(id);
        setMember(data);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          roles: Array.from((data as any).roles || []),
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load member details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      username: member?.username || "",
      email: member?.email || "",
      roles: Array.from((member as any)?.roles || []),
    });
    setPasswords({ newPassword: "", confirmPassword: "" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUser(member!.id!, {
        username: formData.username,
        email: formData.email,
      });
      await updateUserRoles(member!.id!, formData.roles);

      if (passwords.newPassword || passwords.confirmPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          toast.error("Passwords do not match");
          setSaving(false);
          return;
        }
        await adminChangeUserPassword(member!.id!, passwords.newPassword);
      }
      toast.success("User updated successfully!");
      setEditing(false);
      setPasswords({ newPassword: "", confirmPassword: "" });
      const updated = await getUserById(member!.id!);
      setMember(updated);
      setFormData({
        username: updated.username || "",
        email: updated.email || "",
        roles: Array.from((updated as any).roles || []),
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading user details..." />;
  if (!member) return <p className="text-center text-text-muted mt-10">User not found.</p>;

  return (
    <div className="p-6 min-h-screen text-text-base">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-sm text-accent-blue hover:underline"
      >
        <ArrowLeft size={16} /> Back to Members
      </button>

      <div className="bg-background-light p-6 rounded-xl shadow-md max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Member Details</h2>

        {!editing ? (
          <>
            <div className="space-y-2">
              <p><strong>Username:</strong> {member.username}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Roles:</strong> {Array.from(member.roles || []).join(", ") || "No Roles"}</p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setEditing(true)}
                className="mt-6 bg-accent-green px-4 py-2 text-white rounded-md hover:bg-opacity-80"
              >
                Edit User
              </button>
            )}
          </>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full border p-2 rounded bg-background-dark"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border p-2 rounded bg-background-dark"
              />
            </div>

             <div>
              <label className="block mb-1 text-sm">Roles</label>
              <select
                multiple
                value={formData.roles}
                 onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                   setFormData({
                     ...formData,
                     roles: Array.from(e.currentTarget.selectedOptions as any).map((opt: any) => (opt as HTMLOptionElement).value),
                   })
                 }
                className="w-full border p-2 rounded bg-background-dark h-24"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {isAdmin && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full border p-2 rounded bg-background-dark"
                    placeholder="Leave blank to keep unchanged"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">Confirm Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full border p-2 rounded bg-background-dark"
                    placeholder="Retype new password"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border rounded-md text-text-muted hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 bg-accent-blue text-white rounded-md ${saving ? "opacity-60 cursor-not-allowed" : "hover:bg-opacity-80"}`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

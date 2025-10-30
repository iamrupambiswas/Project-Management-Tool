import React, { useEffect, useState } from "react";
import { Clipboard, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCompany } from "../services/companyService";
import { CompanyDto } from "../@api/models";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  companyId: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<CompanyDto | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const companyId =  localStorage.getItem("companyId");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (companyId) {
        fetchCompany(parseInt(companyId));
      } else {
        console.log("Not called!!!");
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

  if (loading)
    return (
      <div className="p-6 text-center text-text-muted">
        Loading profile details...
      </div>
    );

  if (!user)
    return (
      <div className="p-6 text-center text-text-muted">
        No user data available.
      </div>
    );

  const isAdmin = user.roles.includes("ADMIN");

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-accent-blue hover:text-accent-blue/80 font-medium transition"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* --- User Info --- */}
      <section>
        <h2 className="text-xl font-semibold text-accent-blue mb-6">
          User Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-text-base">
          <ProfileField label="Username" value={user.username} />
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Roles" value={user.roles.join(", ")} />
          <ProfileField label="User ID" value={String(user.id)} />
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-accent-blue text-white text-sm rounded-md hover:bg-accent-blue/90 transition"
          >
            Change Password
          </button>
        </div>

      </section>

      {/* --- Company Info --- */}
      {company && (
        <section>
          <h2 className="text-xl font-semibold text-accent-blue mb-6">
            Company Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-text-base">
            <ProfileField label="Company Name" value={company.name ?? ""} />
            <ProfileField label="Domain" value={company.domain || "—"} />

            {isAdmin && (
              <>
                {/* Join Code (Admin only + copyable) */}
                <div className="flex flex-col">
                  <span className="text-sm text-text-muted">Join Code</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium break-all">
                      {company.joinCode || "—"}
                    </span>
                    <button
                      onClick={() => handleCopy(String(company.joinCode))}
                      className={`p-1.5 rounded-md border text-sm transition-all ${
                        copied
                          ? "bg-green-50 border-green-400 text-green-600"
                          : "bg-background-light border-gray-300 hover:bg-accent-blue/10 hover:text-accent-blue"
                      }`}
                      title="Copy Join Code"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Clipboard className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </section>
      )}

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
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

import { useState } from "react";

const possibleRoles = ["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "USER"];

interface EditRolesModalProps {
  email: string;
  currentRoles: string[];
  onClose: () => void;
  onSave: (newRoles: string[]) => void;
}

export default function EditRolesModal({
  email,
  currentRoles,
  onClose,
  onSave,
}: EditRolesModalProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = () => {
    onSave(selectedRoles);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-darker/70 backdrop-blur-sm z-50">
      <div className="bg-background-light p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Edit Roles for {email}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {possibleRoles.map((role) => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={`px-3 py-1 rounded-md text-xs ${
                selectedRoles.includes(role)
                  ? "bg-accent-blue text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-accent-blue text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

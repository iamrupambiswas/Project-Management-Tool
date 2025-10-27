import { useState } from "react";
import type { TeamDto } from "../../@api/models";

interface EditTeamModalProps {
  team: TeamDto;
  onClose: () => void;
  onSave: (newName: string, newDesc: string) => void;
}

export default function EditTeamModal({ team, onClose, onSave }: EditTeamModalProps) {
  const [name, setName] = useState(team.name ?? "");
  const [description, setDescription] = useState(team.description ?? "");

  const handleSave = () => {
    onSave(name, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-darker/70 backdrop-blur-sm z-50">
      <div className="bg-background-light p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Team</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded-md"
          placeholder="Team Name"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded-md"
          placeholder="Team Description"
        />
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

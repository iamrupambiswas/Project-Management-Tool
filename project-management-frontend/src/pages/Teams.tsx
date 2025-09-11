import { useEffect, useState } from "react";
import { getTeams } from "../services/teamService";

interface Team {
  id: number;
  name: string;
  description: string;
  members: number;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeams().then((data) => {
      setTeams(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading teams...</p>;

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Teams</h1>
    {teams.length === 0 ? (
      <p>No teams available. Create one to get started!</p>
    ) : (
      <ul className="space-y-4">
        {teams.map((team) => (
          <li key={team.id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <p>{team.description}</p>
            <p className="text-sm text-gray-500">
              Members: {team.members}
            </p>
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Invite Members
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);
}

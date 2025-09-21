import api from "./api";

// ✅ Fetch all teams
export const getTeams = async () => {
  const res = await api.get("/teams");
  return res.data;
};

// ✅ Invite member to a team
export const addTeamMember = async (
  teamId: string,
  data: { email: string; role: string }
) => {
  const res = await api.post(`/teams/${teamId}/members`, data);
  return res.data;
};

// ✅ Get members of a team
export const getTeamMembers = async (teamId: string) => {
  const res = await api.get(`/teams/${teamId}/members`);
  return res.data;
};

// ✅ Remove member from a team
export const removeTeamMember = async (teamId: string, memberId: string) => {
  const res = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return res.data;
};

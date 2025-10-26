import { TeamDto } from "../@api";
import api from "./api";

// create team
export const createTeam = async (
  teamDto: TeamDto
) => {
  try {
    const res = await api.post("/teams", teamDto);
    return res.data;
  } catch (err) {
    console.error("Error creating team:", err);
    throw err;
  }
}

// Fetch all teams
export const getTeams = async (companyId: number) => {
  const res = await api.get(`/teams/company/${companyId}`);
  return res.data;
};

// Invite member to a team
export const addTeamMember = async (
  teamId: string,
  data: { email: string; role: string }
) => {
  const res = await api.post(`/teams/${teamId}/members`, data);
  return res.data;
};

// Get members of a team
export const getTeamMembers = async (teamId: string) => {
  const res = await api.get(`/teams/${teamId}/members`);
  return res.data;
};

// Remove member from a team
export const removeTeamMember = async (teamId: string, memberId: string) => {
  const res = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return res.data;
};

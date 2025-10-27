import { TeamDto } from "../@api";
import api from "./api";

export const createTeam = async (teamDto: TeamDto) => {
  try {
    const res = await api.post("/teams", teamDto);
    return res.data;
  } catch (err) {
    console.error("Error creating team:", err);
    throw err;
  }
};

export const getTeams = async (companyId: number) => {
  const res = await api.get(`/teams/company/${companyId}`);
  return res.data;
};

export const getTeam = async (teamId: string | number) => {
  const res = await api.get(`/teams/${teamId}`);
  return res.data;
};

export const updateTeam = async (teamId: string | number, teamDto: TeamDto) => {
  const res = await api.put(`/teams/${teamId}`, teamDto);
  return res.data;
};

export const addTeamMember = async (
  teamId: string | number,
  data: { email: string; role: string }
) => {
  const res = await api.post(`/teams/${teamId}/members`, data);
  return res.data;
};

export const getTeamMembers = async (teamId: string | number) => {
  const res = await api.get(`/teams/${teamId}/members`);
  return res.data;
};

export const removeTeamMember = async (
  teamId: string | number,
  memberId: string | number
) => {
  const res = await api.delete(`/teams/${teamId}/members/${memberId}`);
  return res.data;
};

import { UserDto } from "../@api";
import api from "./api";

export const getAllUsers = async (companyId: number) => {
  try {
    const res = await api.get(`/users/company/${companyId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return [];
  }
};

export const getUserById = async (id: number): Promise<UserDto> => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching user with id ${id}:`, err);
    throw err;
  }
};

export const updateUserRoles = async (userId: number, roles: string[]) => {
  const res = await api.put(`/users/${userId}/roles`, roles);
  return res.data;
};

export const getUserAnalytics = async (companyId: number) => {
  const res = await api.get(`/users/analytics`, { params: { companyId } });
  return res.data;
};

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

export const getUserById = async (id: number | string): Promise<UserDto> => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching user with id ${id}:`, err);
    throw err;
  }
};

export const updateUser = async (userId: string | number, userDto: UserDto) => {
  const res = await api.put(`/users/${userId}`, userDto);
  return res.data;
};

export const updateUserRoles = async (userId: number | string, roles: string[]) => {
  const res = await api.put(`/users/${userId}/roles`, roles);
  return res.data;
};

export const getUserAnalytics = async (companyId: number) => {
  const res = await api.get(`/users/analytics`, { params: { companyId } });
  return res.data;
};

export const adminChangeUserPassword = async (userId: number | string, newPassword: string) => {
  const res = await api.put(`/users/${userId}/password`, { newPassword });
  return res.data;
};
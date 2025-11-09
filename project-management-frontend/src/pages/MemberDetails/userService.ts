import api from "../../services/api";
import type { UserDto } from "../../@api/models";

export const getUserById = async (id: string | number): Promise<UserDto> => {
  const res = await api.get<UserDto>(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id: string | number, data: { username: string; email: string }) => {
  const res = await api.put<UserDto>(`/users/${id}`, data);
  return res.data;
};

// Keep API shape consistent with global service: roles array as body
export const updateUserRoles = async (id: string | number, roles: string[]) => {
  const res = await api.put<UserDto>(`/users/${id}/roles`, roles);
  return res.data;
};


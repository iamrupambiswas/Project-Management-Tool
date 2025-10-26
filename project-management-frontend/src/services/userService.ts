import { UserDto } from "../@api";
import api from "./api";

// Fetch all users
export const getAllUsers = async (companyId: number) => {
    try {
    const response = await api.get(`/users/company/${companyId}`);
    return response.data;
    } catch (err) {
        console.error("Failed to fetch users:", err);
        return [];
    }
}

// Fetch a task by ID
export const getUserById = async (id: number): Promise<UserDto> => {
    try {
      const res = await api.get(`/users/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching user with id ${id}:`, err);
      throw err;
    }
  };
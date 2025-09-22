import api from "./api";

// Fetch all users
export const getAllUsers = async () => {
    const res = await api.get("/users");
    return res.data;
}
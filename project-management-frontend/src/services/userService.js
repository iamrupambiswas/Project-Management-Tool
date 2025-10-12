import api from "./api";
// Fetch all users
export const getAllUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data;
    }
    catch (err) {
        console.error("Failed to fetch users:", err);
        return [];
    }
};

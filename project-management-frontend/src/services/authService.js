import api from "./api";
export const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};
export const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

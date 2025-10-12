import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
// Optional: attach auth token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // or Zustand store
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export default api;

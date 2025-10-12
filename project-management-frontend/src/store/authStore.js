import { create } from "zustand";
export const useAuthStore = create((set) => ({
    token: localStorage.getItem("token"),
    setToken: (token) => {
        if (token) {
            localStorage.setItem("token", token);
        }
        else {
            localStorage.removeItem("token");
        }
        set({ token });
    },
    logout: () => {
        localStorage.removeItem("token");
        set({ token: null });
    },
}));

import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { UserDto } from "../@api";

interface DecodedToken {
    companyId?: number;
    sub?: string;
    exp?: number;
    iat?: number;
  }

interface AuthState {
    token: string | null;
    user: UserDto | null;
    companyId: number | null;
    setToken: (token: string | null) => void;
    setUser: (user: UserDto | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem("token"),
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
    companyId: localStorage.getItem("companyId") ? Number(localStorage.getItem("companyId")) : null,
    
    setToken: (token) => {
        if (token) {
            localStorage.setItem("token", token);
            const decoded: DecodedToken = jwtDecode(token as string);
            if (decoded.companyId) {
                localStorage.setItem("companyId", String(decoded.companyId));
                set({ companyId: decoded.companyId });
            }
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("companyId");
            set({ token: null, companyId: null });
        }
        set({ token });
    },

    setUser: (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
        set({ user });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("companyId");
        set({ token: null, user: null, companyId: null });
    },
}));

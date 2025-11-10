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
  token: string | null;        // access token
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
      set({ token, companyId: decoded.companyId ?? null });
      if (decoded.companyId) {
        localStorage.setItem("companyId", String(decoded.companyId));
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("companyId");
      set({ token: null, companyId: null });
    }
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
    // clear store
    set({ token: null, user: null, companyId: null });
    // clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");

    // call backend logout endpoint to delete HTTP-only refresh token cookie
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include", // send cookies
    }).finally(() => {
      window.location.href = "/login";
    });
  },
}));

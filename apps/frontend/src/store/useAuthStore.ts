// apps/frontend/src/store/useAuthStore.ts
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  nativeLanguage: string;
  targetLanguage: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isInitialized: false,

  setAuth: (token, user) => {
    set({ token, user });
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  clearAuth: () => {
    set({ token: null, user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  initialize: () => {
    if (typeof window === "undefined") return; // prevent SSR errors

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user, isInitialized: true });
      } catch {
        set({ token: null, user: null, isInitialized: true });
      }
    } else {
      set({ token: null, user: null, isInitialized: true });
    }
  },
}));
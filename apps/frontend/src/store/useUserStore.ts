import { create } from "zustand";

interface UserState {
  token: string | null;
  profile: {
    bio?: string;
    timezone?: string;
    discord?: string;
    zoom?: string;
  } | null;
  setToken: (token: string | null) => void;
  setProfile: (profile: UserState["profile"]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  profile: null,
  setToken: (token) => set({ token }),
  setProfile: (profile) => set({ profile }),
}));
import { create } from "zustand";

/* =======================
   Types
======================= */

export interface AuthType {
    is_login: boolean;
    role: string;
    user: any; // you can strongly type later
}

interface AuthState {
    authData: AuthType | null;
    temLogin: any | null;
    // actions
    setUserAuth: (data: AuthType) => void;
    clearUserAuth: () => void;
    setTemLogin: (data: any) => void;
}

/* =======================
   Store
======================= */

export const useAuthStore = create<AuthState>((set) => ({
    authData: null,
    temLogin: null,
    setUserAuth: (data) => set({ authData: data }),
    clearUserAuth: () => set({ authData: null, }),
    setTemLogin: (data) => set({ temLogin: data }),
}));

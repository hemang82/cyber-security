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

    // actions
    setUserAuth: (data: AuthType) => void;
    clearUserAuth: () => void;
}

/* =======================
   Store
======================= */

export const useAuthStore = create<AuthState>((set) => ({
    authData: null,
    setUserAuth: (data) => set({ authData: data }),
    clearUserAuth: () => set({ authData: null, }),

}));

import { create } from 'zustand';
import { User } from '@/src/types/auth.types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    userLoading: boolean;
    
    // Setters
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    setUserLoading: (loading: boolean) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    userLoading: true,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setAccessToken: (accessToken) => set({ accessToken, isAuthenticated: !!accessToken }),
    setUserLoading: (userLoading) => set({ userLoading }),
    clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false, userLoading: false }),
}));
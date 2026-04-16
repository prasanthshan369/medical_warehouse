import { create } from 'zustand';
import { authService } from '../api/authServices';
import { storage } from '../utils/storage';
import { User } from '../api/types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    initialize: () => Promise<void>;
    refreshAccessToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,

    login: async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            if (response.success && response.data) {
                const { accessToken } = response.data;

                // 1. Save access token
                await storage.saveToken(accessToken);
                set({ accessToken, isAuthenticated: true });

                // 2. Fetch full user profile from the live API
                try {
                    const userResponse = await authService.getMe();
                    if (userResponse.success) {
                        set({ user: userResponse.data });
                        console.log('👤 Live User Data Loaded:', userResponse.data.roles);
                    }
                } catch (userError) {
                    console.error('Could not fetch full profile:', userError);
                }

            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            const apiMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong. Please try again.';
            throw new Error(apiMessage);
        }
    },

    initialize: async () => {
        try {
            const accessToken = await storage.getAccessToken();

            if (accessToken) {
                set({ accessToken, isAuthenticated: true });

                try {
                    // Verify session on app start
                    const userResponse = await authService.getMe();
                    if (userResponse.success) {
                        set({ user: userResponse.data });
                    }
                } catch (e) {
                    console.warn('Session check failed, attempting silent refresh...');
                    await get().refreshAccessToken();
                }
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
            get().logout();
        }
    },

    refreshAccessToken: async () => {
        try {
            const response = await authService.refreshToken();
            if (response.success && response.data) {
                const { accessToken } = response.data;

                await storage.saveToken(accessToken);
                set({
                    accessToken,
                    isAuthenticated: true
                });

                // Refresh user info from profile API
                const userResponse = await authService.getMe();
                if (userResponse.success) {
                    set({ user: userResponse.data });
                }

                return accessToken;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            get().logout();
        }
        return null;
    },

    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.warn('Logout API call failed, clearing local session anyway.', error);
        } finally {
            await storage.clearToken();
            set({ user: null, accessToken: null, isAuthenticated: false });
        }
    }
}));
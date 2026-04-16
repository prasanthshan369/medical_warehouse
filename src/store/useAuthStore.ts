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

let refreshPromise: Promise<string | null> | null = null;

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
                    // Verify session on app start. 
                    // This call will automatically trigger a refresh via axios interceptors if it returns 401.
                    const userResponse = await authService.getMe();
                    if (userResponse.success) {
                        set({ user: userResponse.data });
                    }
                } catch (e) {
                    // If getMe fails even after axios interceptor refresh, or for other reasons, clear session.
                    console.warn('Session verification failed on init. User likely logged out or network issue.');
                }
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
            get().logout();
        }
    },

    refreshAccessToken: async () => {
        // Simple lock to avoid multiple simultaneous refreshes
        if (refreshPromise) return refreshPromise;

        refreshPromise = (async () => {
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
            } catch (error: any) {
                console.error('Token refresh failed:', error);

                // If it's a 401 or specific security error, logout user
                const isTokenError = error?.status === 401 || error?.message?.includes('Token reuse');
                if (isTokenError) {
                    get().logout();
                }
            } finally {
                refreshPromise = null;
            }
            return null;
        })();

        return refreshPromise;
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
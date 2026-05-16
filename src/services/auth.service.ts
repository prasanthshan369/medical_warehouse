import { authApi } from '../api/auth.api';
import { tokenStorage as storage } from '../lib/storage';
import { useAuthStore } from '@/src/store/useAuthStore';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await authApi.login({ email, password });
        if (response.success && response.data) {
            const { accessToken } = response.data;

            // 1. Save access token
            await storage.saveToken(accessToken);
            useAuthStore.getState().setAccessToken(accessToken);

            // 2. Fetch full user profile
            try {
                const userResponse = await authApi.getMe();
                if (userResponse.success) {
                    useAuthStore.getState().setUser(userResponse.data);
                }
            } catch (userError) {
                console.error('Could not fetch full profile:', userError);
            }
        }
        return response;
    },

    initialize: async () => {
        try {
            const accessToken = await storage.getAccessToken();
            if (accessToken) {
                useAuthStore.getState().setAccessToken(accessToken);
                try {
                    const userResponse = await authApi.getMe();
                    if (userResponse.success) {
                        useAuthStore.getState().setUser(userResponse.data);
                    }
                } catch (e) {
                    console.warn('Session verification failed on init.');
                }
            }
        } finally {
            useAuthStore.getState().setUserLoading(false);
        }
    },

    logout: async () => {
        try {
            useAuthStore.getState().clearAuth();
            await storage.clearToken();
            await authApi.logout().catch(e => console.warn('Backend logout failed:', e.message));
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
};

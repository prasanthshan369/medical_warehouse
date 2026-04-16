import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';

export const storage = {
    saveToken: async (accessToken: string) => {
        try {
            if (typeof accessToken !== 'string') {
                console.warn('⚠️ storage.saveToken: accessToken is required and must be a string');
                return;
            }
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    },

    getAccessToken: async () => {
        try {
            return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    },

    clearToken: async () => {
        try {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        } catch (error) {
            console.error('Error clearing token:', error);
        }
    }
};

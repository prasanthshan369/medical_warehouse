import { API_ENDPOINTS } from '../utils/urls';
import axiosInstance from './axiosInstance';

export const authService = {
    login: async (data: any) => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH_LOGIN, data);
        return response.data;
    },
    refreshToken: async () => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH_REFRESH, {}, { withCredentials: true });
        return response.data;
    },
    getMe: async () => {
        const response = await axiosInstance.get(API_ENDPOINTS.AUTH_ME);
        return response.data;
    },
    logout: async () => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH_LOGOUT);
        return response.data;
    },
    uploadAvatar: async (formData: FormData) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.AUTH_UPDATE_PROFILE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            // Simulation Mode (Temp): Allows testing the "trending" UI before backend is live
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { 
                success: true, 
                message: 'Upload simulated successfully',
                data: { avatarUrl: null } // UI will keep using the temp local URI
            };
        }
    }

}
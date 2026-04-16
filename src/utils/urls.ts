export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://care-sure-api-gateway.onrender.com';
export const SITE_URL = API_BASE_URL;
export const IMAGE_BASE_URL = API_BASE_URL;


export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: '/api/v1/auth/login',
    AUTH_REGISTER: '/api/v1/auth/register',
    AUTH_REFRESH: '/api/v1/auth/refresh',
    AUTH_LOGOUT: '/api/v1/auth/logout',
    AUTH_ME: '/api/v1/users/me',
    AUTH_UPDATE_PROFILE: '/api/v1/users',
    AUTH_UPLOAD_AVATAR: '/api/v1/storage/upload',
    GET_PICKER_QUEUE: '/api/v1/orders/staff/picker-queue',

}

const URLS = {
    SITE_URL,
    API_BASE_URL,
    IMAGE_BASE_URL,
    API_ENDPOINTS
};
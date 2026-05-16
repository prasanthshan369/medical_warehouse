export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://care-sure-api-gateway.onrender.com';
export const SITE_URL = API_BASE_URL;
export const IMAGE_BASE_URL = API_BASE_URL;
export const API_TIMEOUT = 15000;


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
    GET_PICKER_QUEUE_DETAILED: '/api/v1/orders/staff/picker-queue/detailed',
    GET_ORDER_BY_ID: (id: string) => `/api/v1/orders/staff/${id}`,
    UPDATE_ORDER_STATUS: (id: string) => `/api/v1/orders/staff/${id}/status`,

    // Fulfillment / Picking locks
    FULFILLMENT_CLAIM: (orderId: string) => `/api/v1/fulfillment/orders/${orderId}/claim`,
    FULFILLMENT_RELEASE: (orderId: string) => `/api/v1/fulfillment/orders/${orderId}/release`,
    FULFILLMENT_EXTEND: (orderId: string) => `/api/v1/fulfillment/orders/${orderId}/extend`,
    FULFILLMENT_ACTIVE_LOCKS: '/api/v1/fulfillment/active-locks',
}

const URLS = {
    SITE_URL,
    API_BASE_URL,
    IMAGE_BASE_URL,
    API_ENDPOINTS
};
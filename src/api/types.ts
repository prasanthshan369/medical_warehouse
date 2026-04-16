export type OrderStatus = 'new' | 'partial' | 'completed';

export interface WarehouseStat {
    id: string;
    title: string;
    badge: string | null;
    value: number;
    label: string;
    itemsPerHr: number;
    activeHours: number;
    medsDelta: number;
    gradient: [string, string];
    illustration: 'picks' | 'packs';
}

export interface OrderItem {
    id: string;
    name: string;
    manufacturer: string;
    batchNo?: string;
    expiryDate?: string;
    requiredQty: number;
    pickedQty: number;
    description?: string;
    status: 'pending' | 'partial' | 'completed' | 'picked' | 'packed';
}

export interface Order {
    id: string;
    items?: string[];
    extraItems?: number;
    timeAgo?: string;
    status: OrderStatus;
    // Fields for partial orders
    date?: string;
    outOfStockMeds?: string[];
    pickedCount?: number;
    totalCount?: number;
    stockStatus?: 'available' | 'waiting';
    // Fields for completed orders
    customerName?: string;
    completionDate?: string;
    deliveryDate?: string;
    totalItems?: number;
    // Field for full picking list
    pickingItems?: OrderItem[];
}

export interface User {
    id: string;
    email: string;
    phone?: string;
    createdAt?: string;
    profile?: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        avatarUrl?: string | null;
    };
    roles: any[];
    permissions?: string[];
}

export interface JWTPayload {
    sub: string;
    email: string;
    roles: string[];
    permissions: string[];
    exp: number;
    iat: number;
}

export interface ApiOrder {
    id: string;
    orderNumber: string;
    customerId: string;
    status: number;
    paymentStatus: string;
    deliveryType: string;
    deliveryAddress: {
        city: string;
        line1: string;
        line2?: string;
        state: string;
        country: string;
        pincode: string;
        landmark?: string;
    };
    total: string;
    createdAt: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}

export interface ApiPickerQueueResponse {
    success: boolean;
    data: ApiOrder[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

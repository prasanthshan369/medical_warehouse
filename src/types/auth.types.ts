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

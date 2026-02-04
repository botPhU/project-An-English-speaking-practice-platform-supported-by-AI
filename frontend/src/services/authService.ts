import api from './api';

export interface LoginData {
    user_name: string;
    password: string;
}

export interface RegisterData {
    user_name: string;
    email: string;
    password: string;
    full_name?: string;
    role?: string;
}

export interface User {
    id: number;
    user_name: string;
    email: string;
    full_name: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export const authService = {
    login: (user_name: string, password: string) =>
        api.post<AuthResponse>('/auth/login', { user_name, password }),

    register: (data: RegisterData) =>
        api.post<AuthResponse>('/auth/register', data),

    logout: () =>
        api.post('/auth/logout'),

    refreshToken: (refresh_token: string) =>
        api.post('/auth/refresh', { refresh_token }),

    getCurrentUser: () =>
        api.get<User>('/auth/me'),

    changePassword: (old_password: string, new_password: string) =>
        api.post('/auth/change-password', { old_password, new_password }),
};

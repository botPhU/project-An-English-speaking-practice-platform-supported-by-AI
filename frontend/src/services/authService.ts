import api from './api';

export const authService = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    register: (data: { email: string; password: string; name: string }) =>
        api.post('/auth/register', data),

    logout: () =>
        api.post('/auth/logout'),

    refreshToken: () =>
        api.post('/auth/refresh'),

    getCurrentUser: () =>
        api.get('/auth/me'),
};

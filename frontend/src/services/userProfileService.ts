import api from './api';

export interface ProfileData {
    full_name: string;
    phone_number: string;
    date_of_birth: string; // YYYY-MM-DD format
    gender?: 'male' | 'female' | 'other';
    address?: string;
    city?: string;
    country?: string;
    avatar_url?: string;
    bio?: string;
}

export interface UserProfile {
    id: number;
    user_name: string;
    email: string;
    full_name: string;
    role: string;
    phone_number: string | null;
    date_of_birth: string | null;
    gender: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    avatar_url: string | null;
    bio: string | null;
    profile_completed: boolean;
    created_at: string | null;
}

export interface ProfileStatusResponse {
    profile_completed: boolean;
    user_id: number;
    role: string;
}

export const userProfileService = {
    /**
     * Get current user's full profile
     */
    getProfile: () =>
        api.get<UserProfile>('/user/profile'),

    /**
     * Update user profile with required fields
     * Automatically sets profile_completed to true
     */
    updateProfile: (data: ProfileData) =>
        api.put<{ message: string; profile_completed: boolean; user: UserProfile }>('/user/profile', data),

    /**
     * Quick check if user has completed their profile
     */
    getProfileStatus: () =>
        api.get<ProfileStatusResponse>('/user/profile/status'),
};

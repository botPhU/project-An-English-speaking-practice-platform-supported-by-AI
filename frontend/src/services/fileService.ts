import api from './api';

export const fileService = {
    /**
     * Upload avatar image
     * @param file - Image file to upload
     * @param userId - Optional user ID to associate
     * @returns Promise with uploaded file URL
     */
    uploadAvatar: async (file: File, userId?: number): Promise<{ url: string; filename: string }> => {
        const formData = new FormData();
        formData.append('file', file);
        if (userId) {
            formData.append('user_id', userId.toString());
        }

        const response = await api.post('/files/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    /**
     * Delete avatar image
     * @param filename - Filename to delete
     */
    deleteAvatar: async (filename: string): Promise<void> => {
        await api.delete(`/files/avatars/${filename}`);
    },

    /**
     * Get avatar URL
     * @param filename - Filename
     * @returns Full URL to avatar
     */
    getAvatarUrl: (filename: string): string => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        return `${baseUrl}/api/files/avatars/${filename}`;
    },
};

export default fileService;

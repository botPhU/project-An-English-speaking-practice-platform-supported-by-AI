/**
 * Video Call Service
 * Frontend API calls for video call room management
 */

import api from './api';

export interface VideoRoom {
    room_name: string;
    jitsi_domain: string;
    join_url: string;
    booking_id?: number;
    status?: string;
}

export const videoService = {
    createRoom: async (bookingId: number, mentorId: number, learnerId: number): Promise<VideoRoom> => {
        const response = await api.post('/video/create-room', {
            booking_id: bookingId,
            mentor_id: mentorId,
            learner_id: learnerId
        });
        return response.data;
    },

    getRoom: async (bookingId: number): Promise<VideoRoom | null> => {
        try {
            const response = await api.get(`/video/room/${bookingId}`);
            return response.data;
        } catch (error) {
            return null;
        }
    },

    endRoom: async (bookingId: number) => {
        const response = await api.post(`/video/room/${bookingId}/end`);
        return response.data;
    }
};

export default videoService;

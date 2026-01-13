import { useState, useEffect } from 'react';
import { assignmentService } from '../services/assignmentService';
import { feedbackService } from '../services/feedbackService';
import type { Feedback } from '../services/feedbackService';
import ChatModal from './ChatModal';
import { socketService } from '../services/socketService';

interface Assignment {
    id: number;
    mentor_id: number;
    learner_id: number;
    mentor_name: string;
    mentor_email: string;
    mentor_avatar: string | null;
    mentor_online: boolean;
    learner_name: string;
    learner_email: string;
    learner_avatar: string | null;
    assigned_by: number;
    admin_name: string;
    status: string;
    notes: string | null;
    assigned_at: string;
    ended_at: string | null;
}

interface MyMentorCardProps {
    learnerId: number;
}

const MyMentorCard = ({ learnerId }: MyMentorCardProps) => {
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [showChatModal, setShowChatModal] = useState(false);
    const [mentorOnline, setMentorOnline] = useState(false);

    useEffect(() => {
        fetchData();
    }, [learnerId]);

    // Subscribe to mentor's online status via WebSocket
    useEffect(() => {
        if (assignment?.mentor_id) {
            // Set initial status from API data
            setMentorOnline(assignment.mentor_online);

            // Subscribe to real-time status updates
            socketService.subscribeToUserStatus(
                String(assignment.mentor_id),
                (isOnline) => setMentorOnline(isOnline)
            );

            return () => {
                socketService.unsubscribeFromUserStatus(String(assignment.mentor_id));
            };
        }
    }, [assignment?.mentor_id, assignment?.mentor_online]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const assignmentData = await assignmentService.getMyMentor(learnerId);
            setAssignment(assignmentData);

            // Fetch recent feedbacks
            const feedbacks = await feedbackService.getLearnerFeedbacks(learnerId, 3);
            setRecentFeedback(feedbacks);
        } catch (error) {
            console.error('Error fetching mentor data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = () => {
        // Open chat modal directly
        setShowChatModal(true);
    };

    if (loading) {
        return (
            <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 w-32 bg-[#3e4854] rounded"></div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#3e4854] rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-40 bg-[#3e4854] rounded"></div>
                            <div className="h-3 w-32 bg-[#3e4854] rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="rounded-xl bg-gradient-to-br from-[#283039] to-[#1a2230] border border-[#3e4854]/30 p-6">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-gray-500">support_agent</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Chưa có mentor</h3>
                    <p className="text-sm text-gray-400">Bạn sẽ được gán một mentor sớm nhất</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-gradient-to-br from-[#283039] to-[#1a2230] border border-primary/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">support_agent</span>
                    Mentor của tôi
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${mentorOnline ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {mentorOnline ? 'Online' : 'Offline'}
                </span>
            </div>

            {/* Mentor Info */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                    {assignment.mentor_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'M'}
                </div>
                <div className="flex-1">
                    <p className="text-lg font-bold text-white">{assignment.mentor_name}</p>
                    <p className="text-sm text-gray-400">{assignment.mentor_email}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                        <span className="text-sm text-yellow-400 font-medium">4.9</span>
                        <span className="text-xs text-gray-500">• Expert Mentor</span>
                    </div>
                </div>
            </div>

            {/* Recent Feedback */}
            {recentFeedback.length > 0 && (
                <div className="bg-[#3e4854]/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-2">Phản hồi gần đây</p>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="text-center">
                                <p className="text-xl font-bold text-purple-400">{recentFeedback[0].pronunciation_score || '-'}</p>
                                <p className="text-xs text-gray-500">Phát âm</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-blue-400">{recentFeedback[0].grammar_score || '-'}</p>
                                <p className="text-xs text-gray-500">Ngữ pháp</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-green-400">{recentFeedback[0].vocabulary_score || '-'}</p>
                                <p className="text-xs text-gray-500">Từ vựng</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-yellow-400">{recentFeedback[0].fluency_score || '-'}</p>
                                <p className="text-xs text-gray-500">Lưu loát</p>
                            </div>
                        </div>
                    </div>
                    {recentFeedback[0].improvements && (
                        <p className="text-xs text-gray-400 mt-2 italic">"{recentFeedback[0].improvements.slice(0, 100)}..."</p>
                    )}
                </div>
            )}

            {/* Action Button */}
            <button
                onClick={handleSendMessage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
                <span className="material-symbols-outlined text-sm">chat</span>
                Nhắn tin cho Mentor
            </button>
            {/* Chat Modal */}
            {showChatModal && assignment && (
                <ChatModal
                    otherUser={{
                        id: assignment.mentor_id,
                        name: assignment.mentor_name,
                        full_name: assignment.mentor_name,
                        avatar: assignment.mentor_avatar || undefined,
                        isOnline: assignment.mentor_online
                    }}
                    onClose={() => setShowChatModal(false)}
                />
            )}
        </div>
    );
};

export default MyMentorCard;

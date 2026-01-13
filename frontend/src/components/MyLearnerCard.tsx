import { useState, useEffect, useCallback } from 'react';
import { assignmentService } from '../services/assignmentService';
import { feedbackService } from '../services/feedbackService';
import type { LearnerProgress } from '../services/feedbackService';
import { videoService } from '../services/videoService';
import VideoCallModal from './VideoCallModal';
import FeedbackForm from './FeedbackForm';
import ChatModal from './ChatModal';

interface Assignment {
    id: number;
    mentor_id: number;
    learner_id: number;
    mentor_name: string;
    mentor_email: string;
    mentor_avatar: string | null;
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

interface MyLearnerCardProps {
    mentorId: number;
    mentorName: string;
}

const MyLearnerCard = ({ mentorId, mentorName }: MyLearnerCardProps) => {
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [roomName, setRoomName] = useState('');

    const fetchData = useCallback(async () => {
        if (mentorId <= 0) return;

        try {
            setLoading(true);
            const assignmentData = await assignmentService.getMyLearner(mentorId);
            setAssignment(assignmentData);

            if (assignmentData?.learner_id) {
                const progressData = await feedbackService.getLearnerProgress(assignmentData.learner_id);
                setProgress(progressData);
            }
        } catch (error) {
            console.error('Error fetching learner data:', error);
            // Assignment will remain null, component will show "Chưa có học viên" state
        } finally {
            setLoading(false);
        }
    }, [mentorId]);

    useEffect(() => {
        if (mentorId > 0) {
            fetchData();
        }
    }, [mentorId, fetchData]);

    const handleStartCall = async () => {
        if (!assignment) return;
        try {
            const room = await videoService.createRoom(0, mentorId, assignment.learner_id);
            setRoomName(room.room_name);
            setShowVideoCall(true);
        } catch (error) {
            console.error('Error creating video room:', error);
        }
    };

    const handleFeedbackSubmit = async (data: any) => {
        try {
            await feedbackService.createFeedback(data);
            // Refresh progress after feedback
            if (assignment?.learner_id) {
                const progressData = await feedbackService.getLearnerProgress(assignment.learner_id);
                setProgress(progressData);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
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
                        <span className="material-symbols-outlined text-3xl text-gray-500">person_off</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Chưa có học viên</h3>
                    <p className="text-sm text-gray-400">Admin sẽ gán học viên cho bạn sớm nhất</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-xl bg-gradient-to-br from-[#283039] to-[#1a2230] border border-primary/30 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">school</span>
                        Học viên của tôi
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                        Đang hoạt động
                    </span>
                </div>

                {/* Learner Info */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                        {assignment.learner_name ? assignment.learner_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'L'}
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-bold text-white">{assignment.learner_name || 'Học viên'}</p>
                        <p className="text-sm text-gray-400">{assignment.learner_email || ''}</p>
                        <p className="text-xs text-gray-500">Gán từ {assignment.assigned_at ? new Date(assignment.assigned_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>
                </div>

                {/* Progress Stats */}
                {progress && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#3e4854]/30 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{progress.total_sessions}</p>
                            <p className="text-xs text-gray-400">Phiên luyện tập</p>
                        </div>
                        <div className="bg-[#3e4854]/30 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-yellow-400">{progress.skill_averages?.overall || '-'}</p>
                            <p className="text-xs text-gray-400">Điểm TB</p>
                        </div>
                        <div className="bg-[#3e4854]/30 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-green-400">{progress.streak_days}</p>
                            <p className="text-xs text-gray-400">Streak days</p>
                        </div>
                        <div className="bg-[#3e4854]/30 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-purple-400">{progress.current_level}</p>
                            <p className="text-xs text-gray-400">Trình độ</p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleStartCall}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">videocam</span>
                        Gọi video
                    </button>
                    <button
                        onClick={() => setShowChatModal(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/80 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        Nhắn tin
                    </button>
                    <button
                        onClick={() => setShowFeedback(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#3e4854]/50 text-white rounded-lg font-medium hover:bg-[#3e4854] transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">rate_review</span>
                        Đánh giá
                    </button>
                </div>
            </div>

            {/* Video Call Modal */}
            <VideoCallModal
                isOpen={showVideoCall}
                roomName={roomName}
                userName={mentorName}
                onClose={() => setShowVideoCall(false)}
            />

            {/* Feedback Form Modal */}
            <FeedbackForm
                isOpen={showFeedback}
                learnerId={assignment.learner_id}
                learnerName={assignment.learner_name}
                mentorId={mentorId}
                onSubmit={handleFeedbackSubmit}
                onClose={() => setShowFeedback(false)}
            />

            {/* Chat Modal */}
            {showChatModal && assignment && (
                <ChatModal
                    otherUser={{
                        id: assignment.learner_id,
                        name: assignment.learner_name,
                        full_name: assignment.learner_name,
                        avatar: assignment.learner_avatar || undefined,
                        isOnline: true // TODO: Add learner_online to assignment interface when API supports it
                    }}
                    onClose={() => setShowChatModal(false)}
                />
            )}
        </>
    );
};

export default MyLearnerCard;

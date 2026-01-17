import { useState, useEffect, useCallback } from 'react';
import { assignmentService } from '../services/assignmentService';
import { feedbackService } from '../services/feedbackService';
import type { LearnerProgress } from '../services/feedbackService';
import { videoService } from '../services/videoService';
import { socketService } from '../services/socketService';
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
    mentorAvatar?: string;
}

const MyLearnerCard = ({ mentorId, mentorName, mentorAvatar }: MyLearnerCardProps) => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedLearner, setSelectedLearner] = useState<Assignment | null>(null);
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [calling, setCalling] = useState(false);

    const fetchData = useCallback(async () => {
        if (mentorId <= 0) return;

        try {
            setLoading(true);
            const assignmentData = await assignmentService.getMyLearner(mentorId);

            // API now returns array
            if (Array.isArray(assignmentData) && assignmentData.length > 0) {
                setAssignments(assignmentData);
                // Auto-select first learner
                setSelectedLearner(assignmentData[0]);
                const progressData = await feedbackService.getLearnerProgress(assignmentData[0].learner_id);
                setProgress(progressData);
            } else {
                setAssignments([]);
                setSelectedLearner(null);
                setProgress(null);
            }
        } catch (error) {
            console.error('Error fetching learner data:', error);
            setAssignments([]);
            setSelectedLearner(null);
            setProgress(null);
        } finally {
            setLoading(false);
        }
    }, [mentorId]);

    // Fetch progress when selected learner changes
    const handleSelectLearner = async (assignment: Assignment) => {
        setSelectedLearner(assignment);
        try {
            const progressData = await feedbackService.getLearnerProgress(assignment.learner_id);
            setProgress(progressData);
        } catch (error) {
            console.error('Error fetching progress:', error);
            setProgress(null);
        }
    };

    useEffect(() => {
        if (mentorId > 0) {
            fetchData();
        }
    }, [mentorId, fetchData]);

    // Register call event listeners
    useEffect(() => {
        socketService.onCallAccepted((data) => {
            console.log('[MyLearnerCard] Call accepted:', data);
            setCalling(false);
            setRoomName(data.roomName);
            setShowVideoCall(true);
        });

        socketService.onCallDeclined((data) => {
            console.log('[MyLearnerCard] Call declined:', data);
            setCalling(false);
            alert('Học viên đã từ chối cuộc gọi');
        });

        socketService.onCallFailed((data) => {
            console.log('[MyLearnerCard] Call failed:', data);
            setCalling(false);
            alert('Học viên hiện không trực tuyến');
        });

        return () => {
            socketService.removeCallCallbacks();
        };
    }, []);

    const handleStartCall = async () => {
        if (!selectedLearner) return;

        try {
            setCalling(true);
            const room = await videoService.createRoom(0, mentorId, selectedLearner.learner_id);

            socketService.callUser(
                String(mentorId),
                mentorName,
                mentorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentorName}`,
                String(selectedLearner.learner_id),
                room.room_name
            );

            setRoomName(room.room_name);
            console.log('[MyLearnerCard] Calling learner:', selectedLearner.learner_id);
        } catch (error) {
            console.error('Error creating video room:', error);
            setCalling(false);
        }
    };

    const handleFeedbackSubmit = async (data: any) => {
        try {
            await feedbackService.createFeedback(data);
            if (selectedLearner?.learner_id) {
                const progressData = await feedbackService.getLearnerProgress(selectedLearner.learner_id);
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

    if (assignments.length === 0) {
        return (
            <div className="rounded-xl bg-gradient-to-br from-[#283039] to-[#1a2230] border border-[#3e4854]/30 p-6">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-gray-500">person_off</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Chưa có học viên</h3>
                    <p className="text-sm text-gray-400">Khi bạn xác nhận lịch hẹn, học viên sẽ xuất hiện ở đây</p>
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
                        Học viên của tôi ({assignments.length})
                    </h3>
                </div>

                {/* Learner Tabs - show when multiple learners */}
                {assignments.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {assignments.map((a) => (
                            <button
                                key={a.id}
                                onClick={() => handleSelectLearner(a)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedLearner?.id === a.id
                                        ? 'bg-primary text-white'
                                        : 'bg-[#3e4854]/50 text-gray-300 hover:bg-[#3e4854]'
                                    }`}
                            >
                                <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center text-xs">
                                    {a.learner_name?.charAt(0) || 'L'}
                                </div>
                                {a.learner_name || 'Học viên'}
                            </button>
                        ))}
                    </div>
                )}

                {selectedLearner && (
                    <>
                        {/* Learner Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                                {selectedLearner.learner_name ? selectedLearner.learner_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'L'}
                            </div>
                            <div className="flex-1">
                                <p className="text-lg font-bold text-white">{selectedLearner.learner_name || 'Học viên'}</p>
                                <p className="text-sm text-gray-400">{selectedLearner.learner_email || ''}</p>
                                <p className="text-xs text-gray-500">Gán từ {selectedLearner.assigned_at ? new Date(selectedLearner.assigned_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                                Đang hoạt động
                            </span>
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
                                disabled={calling}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors ${calling
                                    ? 'bg-yellow-600/80 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-sm ${calling ? 'animate-pulse' : ''}`}>
                                    {calling ? 'call' : 'videocam'}
                                </span>
                                {calling ? 'Đang gọi...' : 'Gọi video'}
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
                    </>
                )}
            </div>

            {/* Video Call Modal */}
            <VideoCallModal
                isOpen={showVideoCall}
                roomName={roomName}
                userName={mentorName}
                onClose={() => setShowVideoCall(false)}
            />

            {/* Feedback Form Modal */}
            {selectedLearner && (
                <FeedbackForm
                    isOpen={showFeedback}
                    learnerId={selectedLearner.learner_id}
                    learnerName={selectedLearner.learner_name}
                    mentorId={mentorId}
                    onSubmit={handleFeedbackSubmit}
                    onClose={() => setShowFeedback(false)}
                />
            )}

            {/* Chat Modal */}
            {showChatModal && selectedLearner && (
                <ChatModal
                    otherUser={{
                        id: selectedLearner.learner_id,
                        name: selectedLearner.learner_name,
                        full_name: selectedLearner.learner_name,
                        avatar: selectedLearner.learner_avatar || undefined,
                        isOnline: true
                    }}
                    onClose={() => setShowChatModal(false)}
                />
            )}
        </>
    );
};

export default MyLearnerCard;

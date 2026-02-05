import { useState, useEffect } from 'react';
import { assignmentService } from '../services/assignmentService';
import { feedbackService } from '../services/feedbackService';
import { mentorService } from '../services/mentorService';
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

    // Review states
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

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

    const handleOpenReview = () => {
        setReviewRating(5);
        setReviewComment('');
        setShowReviewModal(true);
    };

    const handleSubmitReview = async () => {
        if (!assignment) return;

        try {
            setSubmittingReview(true);
            await mentorService.submitReview({
                learner_id: learnerId,
                mentor_id: assignment.mentor_id,
                rating: reviewRating,
                comment: reviewComment
            });

            setShowReviewModal(false);
            alert('Đánh giá đã được gửi thành công! Cảm ơn bạn đã đánh giá.');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Có lỗi khi gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setSubmittingReview(false);
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

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={handleSendMessage}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    Nhắn tin
                </button>
                <button
                    onClick={handleOpenReview}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg font-medium hover:bg-yellow-500 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">star</span>
                    Đánh giá
                </button>
            </div>

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

            {/* Review Modal */}
            {showReviewModal && assignment && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#283039] rounded-2xl p-6 max-w-md w-full border border-[#3e4854]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Đánh giá Mentor</h3>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Mentor Info */}
                        <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 rounded-xl">
                            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {assignment.mentor_name?.charAt(0) || 'M'}
                            </div>
                            <div>
                                <p className="font-bold text-white">{assignment.mentor_name}</p>
                                <p className="text-sm text-gray-400">{assignment.mentor_email}</p>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-3">Đánh giá của bạn</label>
                            <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <span className={`material-symbols-outlined text-4xl ${star <= reviewRating ? 'text-yellow-500' : 'text-gray-600'}`}>
                                            {star <= reviewRating ? 'star' : 'star_border'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-400 mt-2">
                                {reviewRating === 5 && 'Xuất sắc!'}
                                {reviewRating === 4 && 'Rất tốt'}
                                {reviewRating === 3 && 'Tốt'}
                                {reviewRating === 2 && 'Trung bình'}
                                {reviewRating === 1 && 'Cần cải thiện'}
                            </p>
                        </div>

                        {/* Comment */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Nhận xét (tùy chọn)</label>
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Chia sẻ trải nghiệm của bạn với Mentor..."
                                className="w-full h-24 px-4 py-3 rounded-xl bg-[#1a2230] border border-[#3e4854] text-white placeholder-gray-500 focus:border-primary outline-none resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                disabled={submittingReview}
                                className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submittingReview ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Gửi đánh giá
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyMentorCard;

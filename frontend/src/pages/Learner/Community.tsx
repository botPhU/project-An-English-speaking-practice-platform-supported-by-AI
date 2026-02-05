import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import { learnerService } from '../../services/learnerService';
import { mentorService } from '../../services/mentorService';
import BookingModal from '../../components/BookingModal';
import ChatModal from '../../components/ChatModal';

export default function Community() {
    const { user: authUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<'practice' | 'reviews' | 'mentors'>('practice');
    const [mentors, setMentors] = useState<any[]>([]);
    const [mentorSessions, setMentorSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<any>(null);

    // Review states
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewSession, setReviewSession] = useState<any>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);


    useEffect(() => {
        if (authUser?.id) {
            fetchData();
        }
    }, [authUser?.id]);

    // Handle URL query param for chat modal
    useEffect(() => {
        const chatMentorId = searchParams.get('chat');
        if (chatMentorId && chatMentorId !== 'undefined') {
            // First try to find in mentors list
            let mentor = mentors.find(m => m.id === Number(chatMentorId));

            // If not found in mentors list, create a basic mentor object to open chat
            // Don't wait for loading - open chat immediately
            if (!mentor) {
                // This handles the case when navigating from MyMentorCard
                // We'll use the mentor ID directly for the chat
                mentor = {
                    id: Number(chatMentorId),
                    full_name: 'Mentor',
                    name: 'Mentor'
                };
            }

            setSelectedMentor(mentor);
            setShowChatModal(true);
            setActiveTab('mentors');
            // Clear the query param
            setSearchParams({}, { replace: true });
        }
    }, [searchParams]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [mentorsRes, sessionsRes] = await Promise.all([
                learnerService.getMentors(),
                learnerService.getMentorSessions(Number(authUser?.id))
            ]);
            setMentors(mentorsRes.data);
            setMentorSessions(sessionsRes.data);
        } catch (error) {
            console.error('Error fetching community data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Online learners - fetched from API when available
    const [onlineLearners, setOnlineLearners] = useState<any[]>([]);

    // Note: API for online learners not yet implemented
    // When implemented, add API call to fetch online learners

    // Open review modal for a session
    const openReviewModal = (session: any) => {
        setReviewSession(session);
        setReviewRating(5);
        setReviewComment('');
        setShowReviewModal(true);
    };

    // Submit mentor review
    const handleSubmitReview = async () => {
        if (!reviewSession || !authUser?.id) return;

        try {
            setSubmittingReview(true);
            await mentorService.submitReview({
                learner_id: Number(authUser.id),
                mentor_id: reviewSession.mentor_id,
                rating: reviewRating,
                comment: reviewComment,
                booking_id: reviewSession.id
            });

            setShowReviewModal(false);
            setReviewSession(null);
            fetchData(); // Refresh sessions
            alert('Đánh giá đã được gửi thành công!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Có lỗi khi gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <LearnerLayout title="Cộng đồng">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                {/* Chat Modal - render even during loading */}
                {showChatModal && selectedMentor && (
                    <ChatModal
                        otherUser={selectedMentor}
                        onClose={() => {
                            setShowChatModal(false);
                            setSelectedMentor(null);
                        }}
                    />
                )}
            </LearnerLayout>
        );
    }

    return (
        <LearnerLayout title="Cộng đồng">
            <div className="max-w-7xl mx-auto space-y-8 pb-12">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Cộng đồng học tập</h1>
                        <p className="text-text-secondary mt-1">Luyện tập cùng bạn bè và kết nối với Mentor</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 bg-surface-dark p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('practice')}
                        className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'practice'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'text-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">group</span>
                        Luyện tập cùng nhau
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'reviews'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'text-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">rate_review</span>
                        Đánh giá & Lịch sử
                    </button>
                    <button
                        onClick={() => setActiveTab('mentors')}
                        className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'mentors'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'text-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">supervisor_account</span>
                        Mentor
                    </button>
                </div>

                {/* Practice with Others Tab */}
                {activeTab === 'practice' && (
                    <div className="space-y-6">
                        {/* Quick Match */}
                        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-2xl p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-xl bg-primary/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl">record_voice_over</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Tìm bạn luyện tập ngay</h3>
                                        <p className="text-text-secondary text-sm">Ghép cặp ngẫu nhiên với học viên cùng trình độ</p>
                                    </div>
                                </div>
                                <button className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                                    <span className="material-symbols-outlined">bolt</span>
                                    Tìm kiếm nhanh
                                </button>
                            </div>
                        </div>

                        {/* Online Learners */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500">circle</span>
                                    Đang trực tuyến ({onlineLearners.filter(l => l.status === 'online').length})
                                </h2>
                                <select className="bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none">
                                    <option>Tất cả trình độ</option>
                                    <option>A1-A2</option>
                                    <option>B1-B2</option>
                                    <option>C1-C2</option>
                                </select>
                            </div>
                            {onlineLearners.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {onlineLearners.map((learner) => (
                                        <div
                                            key={learner.id}
                                            className={`p-4 rounded-xl border transition-all ${learner.status === 'online'
                                                ? 'bg-white/5 border-border-dark hover:border-primary/50 cursor-pointer'
                                                : 'bg-white/[0.02] border-border-dark/50 opacity-60'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="size-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">
                                                            {learner.avatar}
                                                        </div>
                                                        <span className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-surface-dark ${learner.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                                                            }`}></span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">{learner.name}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">{learner.level}</span>
                                                            <span>•</span>
                                                            <span>{learner.topic}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {learner.status === 'online' ? (
                                                    <button className="px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary text-primary hover:text-white font-bold text-xs transition-all">
                                                        Mời luyện tập
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-yellow-500 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                                                        Đang bận
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border border-dashed border-border-dark rounded-xl">
                                    <span className="material-symbols-outlined text-4xl text-text-secondary opacity-20 mb-2">group_off</span>
                                    <p className="text-text-secondary">Chưa có học viên nào đang trực tuyến.</p>
                                    <p className="text-xs text-text-secondary mt-2">Tính năng luyện tập cùng bạn bè đang được phát triển.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6">
                        {/* Mentor Sessions */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                Lịch học với Mentor
                            </h2>
                            <div className="space-y-4">
                                {mentorSessions.length > 0 ? mentorSessions.map((session) => (
                                    <div key={session.id} className="p-4 rounded-xl bg-white/5 border border-border-dark flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-white">Buổi học với {session.mentor_name}</h4>
                                            <p className="text-sm text-text-secondary">
                                                {session.scheduled_at} • <span className={`font-bold ${session.is_completed ? 'text-green-500' : 'text-blue-500'}`}>
                                                    {session.status || (session.is_completed ? 'Hoàn thành' : 'Đang chờ')}
                                                </span>
                                            </p>
                                        </div>
                                        {!session.is_completed && (
                                            <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all">
                                                Vào học
                                            </button>
                                        )}
                                        {session.is_completed && !session.rating && (
                                            <button
                                                onClick={() => openReviewModal(session)}
                                                className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-500 border border-orange-500/30 hover:bg-orange-500 hover:text-white font-bold text-sm transition-all flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-lg">star</span>
                                                Đánh giá
                                            </button>
                                        )}
                                    </div>
                                )) : (
                                    <div className="text-center py-12 border border-dashed border-border-dark rounded-xl">
                                        <p className="text-text-secondary">Bạn chưa có buổi học nào với Mentor.</p>
                                        <button
                                            onClick={() => setActiveTab('mentors')}
                                            className="mt-4 text-primary font-bold hover:underline"
                                        >
                                            Tìm Mentor ngay
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mentors Tab */}
                {activeTab === 'mentors' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mentors.length > 0 ? mentors.map((mentor) => (
                                <div key={mentor.id} className="bg-surface-dark border border-border-dark rounded-xl p-6 hover:border-primary/50 transition-all flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={mentor.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(mentor.full_name || mentor.name) + "&background=2b8cee&color=fff"}
                                            className="size-16 rounded-full border-2 border-primary object-cover"
                                            alt={mentor.full_name}
                                        />
                                        <div>
                                            <h3 className="font-bold text-white">{mentor.full_name || mentor.name}</h3>
                                            <p className="text-sm text-primary">{mentor.specialty || 'General English'}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4 flex-1">
                                        <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                                            {mentor.bio || 'Chưa có thông tin giới thiệu.'}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                                                <span className="font-bold text-white">{mentor.rating || 5.0}</span>
                                            </div>
                                            <span className="text-text-secondary">({mentor.review_count || 0} đánh giá)</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-4 border-t border-border-dark/50">
                                        <button
                                            onClick={() => {
                                                setSelectedMentor(mentor);
                                                setShowBookingModal(true);
                                            }}
                                            className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">video_call</span>
                                            Đặt lịch
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedMentor(mentor);
                                                setShowChatModal(true);
                                            }}
                                            className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center bg-surface-dark rounded-xl border border-dashed border-border-dark">
                                    <p className="text-text-secondary">Hiện tại chưa có Mentor nào sẵn sàng.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedMentor && (
                <BookingModal
                    mentor={selectedMentor}
                    onClose={() => {
                        setShowBookingModal(false);
                        setSelectedMentor(null);
                    }}
                    onSuccess={() => {
                        fetchData();
                    }}
                />
            )}

            {/* Chat Modal */}
            {showChatModal && selectedMentor && (
                <ChatModal
                    otherUser={selectedMentor}
                    onClose={() => {
                        setShowChatModal(false);
                        setSelectedMentor(null);
                    }}
                />
            )}

            {/* Review Modal */}
            {showReviewModal && reviewSession && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-dark rounded-2xl p-6 max-w-md w-full border border-border-dark">
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
                                {reviewSession.mentor_name?.charAt(0) || 'M'}
                            </div>
                            <div>
                                <p className="font-bold text-white">{reviewSession.mentor_name}</p>
                                <p className="text-sm text-text-secondary">Buổi học ngày {reviewSession.scheduled_at}</p>
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-text-secondary mb-3">Đánh giá của bạn</label>
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
                            <p className="text-center text-sm text-text-secondary mt-2">
                                {reviewRating === 5 && 'Xuất sắc!'}
                                {reviewRating === 4 && 'Rất tốt'}
                                {reviewRating === 3 && 'Tốt'}
                                {reviewRating === 2 && 'Trung bình'}
                                {reviewRating === 1 && 'Cần cải thiện'}
                            </p>
                        </div>

                        {/* Comment */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-text-secondary mb-2">Nhận xét (tùy chọn)</label>
                            <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Chia sẻ trải nghiệm của bạn với Mentor..."
                                className="w-full h-24 px-4 py-3 rounded-xl bg-background-dark border border-border-dark text-white placeholder-gray-500 focus:border-primary outline-none resize-none"
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
        </LearnerLayout>
    );
}

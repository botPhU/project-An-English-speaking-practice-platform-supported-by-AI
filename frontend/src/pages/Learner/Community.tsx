import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import { learnerService } from '../../services/learnerService';
import { mentorService } from '../../services/mentorService';
import { socketService } from '../../services/socketService';
import type { MatchFoundData, PracticeInviteData } from '../../services/socketService';
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

    // Matchmaking states
    const [isSearching, setIsSearching] = useState(false);
    const [searchPosition, setSearchPosition] = useState(0);
    const [matchedBuddy, setMatchedBuddy] = useState<any>(null);
    const [matchRoomName, setMatchRoomName] = useState('');
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [pendingInvite, setPendingInvite] = useState<PracticeInviteData | null>(null);
    const [invitingUser, setInvitingUser] = useState<number | null>(null);
    const [levelFilter, setLevelFilter] = useState('');
    const navigate = useNavigate();


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

    // Online learners - fetched from API
    const [onlineLearners, setOnlineLearners] = useState<any[]>([]);
    const [loadingOnline, setLoadingOnline] = useState(false);

    // Fetch online learners
    const fetchOnlineLearners = useCallback(async () => {
        if (!authUser?.id) return;
        try {
            setLoadingOnline(true);
            const res = await learnerService.getOnlineLearners(Number(authUser.id), levelFilter || undefined);
            setOnlineLearners(res.data || []);
        } catch (error) {
            console.error('Error fetching online learners:', error);
        } finally {
            setLoadingOnline(false);
        }
    }, [authUser?.id, levelFilter]);

    // Fetch online learners on mount and when tab changes to practice
    useEffect(() => {
        if (activeTab === 'practice' && authUser?.id) {
            fetchOnlineLearners();
            // Refresh every 30 seconds
            const interval = setInterval(fetchOnlineLearners, 30000);
            return () => clearInterval(interval);
        }
    }, [activeTab, authUser?.id, fetchOnlineLearners]);

    // Initialize socket matchmaking events
    useEffect(() => {
        socketService.initMatchmakingEvents();

        // Handle match found
        socketService.onMatchFound((data: MatchFoundData) => {
            console.log('Match found!', data);
            setIsSearching(false);
            setMatchedBuddy(data.buddy);
            setMatchRoomName(data.room_name);
            setShowMatchModal(true);
        });

        // Handle queued
        socketService.onMatchmakingQueued((data) => {
            setSearchPosition(data.position || 1);
        });

        // Handle practice invite
        socketService.onPracticeInvite((data: PracticeInviteData) => {
            console.log('Practice invite received!', data);
            setPendingInvite(data);
            setShowInviteModal(true);
        });

        // Handle invite accepted
        socketService.onInviteAccepted((data) => {
            console.log('Invite accepted!', data);
            setInvitingUser(null);
            setMatchedBuddy({ id: data.userId, full_name: data.userName, avatar_url: data.userAvatar });
            setMatchRoomName(data.roomName);
            setShowMatchModal(true);
        });

        // Handle invite declined
        socketService.onInviteDeclined((data) => {
            console.log('Invite declined', data);
            setInvitingUser(null);
            alert('Người dùng đã từ chối lời mời.');
        });

        // Handle session starting (when we accept an invite)
        socketService.onSessionStarting((data) => {
            console.log('Session starting', data);
            setShowInviteModal(false);
            setPendingInvite(null);
            // Navigate to video call
            navigate(`/learner/video-call?room=${data.roomName}`);
        });

        return () => {
            socketService.removeMatchmakingCallbacks();
        };
    }, [navigate]);

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
                                        <p className="text-text-secondary text-sm">
                                            {isSearching
                                                ? `Đang tìm kiếm... Vị trí hàng đợi: ${searchPosition}`
                                                : 'Ghép cặp ngẫu nhiên với học viên cùng trình độ'
                                            }
                                        </p>
                                    </div>
                                </div>
                                {isSearching ? (
                                    <button
                                        onClick={() => {
                                            socketService.cancelMatchmaking(String(authUser?.id));
                                            setIsSearching(false);
                                        }}
                                        className="px-8 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Hủy tìm kiếm
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsSearching(true);
                                            setSearchPosition(1);
                                            socketService.requestMatchmaking(
                                                String(authUser?.id),
                                                authUser?.name || 'User',
                                                authUser?.avatar || '',
                                                levelFilter || undefined
                                            );
                                        }}
                                        className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">bolt</span>
                                        Tìm kiếm nhanh
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Online Learners */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500">circle</span>
                                    Đang trực tuyến ({onlineLearners.length})
                                </h2>
                                <select
                                    value={levelFilter}
                                    onChange={(e) => setLevelFilter(e.target.value)}
                                    className="bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none"
                                >
                                    <option value="">Tất cả trình độ</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="elementary">Elementary</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="upper-intermediate">Upper-Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            {loadingOnline ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : onlineLearners.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {onlineLearners.map((learner) => (
                                        <div
                                            key={learner.id}
                                            className="p-4 rounded-xl border transition-all bg-white/5 border-border-dark hover:border-primary/50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img
                                                            src={learner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(learner.full_name || 'User')}&background=2b8cee&color=fff`}
                                                            className="size-12 rounded-full border-2 border-primary object-cover"
                                                            alt={learner.full_name}
                                                        />
                                                        <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-surface-dark bg-green-500"></span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white">{learner.full_name}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                                                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">
                                                                {learner.level || 'Beginner'}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{learner.xp_points || 0} XP</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setInvitingUser(learner.id);
                                                        socketService.sendPracticeInvite(
                                                            String(authUser?.id),
                                                            authUser?.name || 'User',
                                                            authUser?.avatar || '',
                                                            String(learner.id)
                                                        );
                                                        setTimeout(() => {
                                                            if (invitingUser === learner.id) {
                                                                setInvitingUser(null);
                                                            }
                                                        }, 30000); // 30s timeout
                                                    }}
                                                    disabled={invitingUser === learner.id}
                                                    className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${invitingUser === learner.id
                                                        ? 'bg-yellow-500/20 text-yellow-400 cursor-wait'
                                                        : 'bg-primary/20 hover:bg-primary text-primary hover:text-white'
                                                        }`}
                                                >
                                                    {invitingUser === learner.id ? (
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-sm animate-pulse">hourglass_empty</span>
                                                            Đang chờ...
                                                        </span>
                                                    ) : (
                                                        'Mời luyện tập'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border border-dashed border-border-dark rounded-xl">
                                    <span className="material-symbols-outlined text-4xl text-text-secondary opacity-20 mb-2">group_off</span>
                                    <p className="text-text-secondary">Chưa có học viên nào đang trực tuyến.</p>
                                    <p className="text-xs text-text-secondary mt-2">Hãy thử "Tìm kiếm nhanh" để được ghép đôi tự động!</p>
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

            {/* Practice Invite Modal */}
            {showInviteModal && pendingInvite && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-dark rounded-2xl p-6 max-w-md w-full border border-border-dark animate-pulse-slow">
                        <div className="text-center">
                            <div className="size-20 rounded-full bg-primary/20 border-4 border-primary mx-auto mb-4 flex items-center justify-center">
                                <img
                                    src={pendingInvite.fromUserAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pendingInvite.fromUserName)}&background=2b8cee&color=fff`}
                                    className="size-full rounded-full object-cover"
                                    alt={pendingInvite.fromUserName}
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Lời mời luyện tập</h3>
                            <p className="text-text-secondary mb-6">
                                <span className="text-primary font-bold">{pendingInvite.fromUserName}</span> muốn luyện tập tiếng Anh cùng bạn!
                                {pendingInvite.topic && (<span className="block mt-1 text-sm">Chủ đề: {pendingInvite.topic}</span>)}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        socketService.respondPracticeInvite(
                                            String(authUser?.id),
                                            pendingInvite.fromUserId,
                                            false
                                        );
                                        setShowInviteModal(false);
                                        setPendingInvite(null);
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors"
                                >
                                    Từ chối
                                </button>
                                <button
                                    onClick={() => {
                                        socketService.respondPracticeInvite(
                                            String(authUser?.id),
                                            pendingInvite.fromUserId,
                                            true
                                        );
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">videocam</span>
                                    Chấp nhận
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Match Found Modal */}
            {showMatchModal && matchedBuddy && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-dark rounded-2xl p-6 max-w-md w-full border border-primary/50 shadow-lg shadow-primary/20">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="size-16 rounded-full bg-primary/20 border-2 border-primary overflow-hidden">
                                    <img
                                        src={authUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || 'User')}&background=2b8cee&color=fff`}
                                        className="size-full object-cover"
                                        alt="You"
                                    />
                                </div>
                                <div className="text-2xl text-primary animate-pulse">⚡</div>
                                <div className="size-16 rounded-full bg-primary/20 border-2 border-primary overflow-hidden">
                                    <img
                                        src={matchedBuddy.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(matchedBuddy.full_name || 'User')}&background=2b8cee&color=fff`}
                                        className="size-full object-cover"
                                        alt={matchedBuddy.full_name}
                                    />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Đã tìm thấy bạn luyện tập!</h3>
                            <p className="text-text-secondary mb-6">
                                Bạn được ghép đôi với <span className="text-primary font-bold">{matchedBuddy.full_name}</span>
                            </p>
                            <button
                                onClick={() => {
                                    setShowMatchModal(false);
                                    navigate(`/learner/video-call?room=${matchRoomName}`);
                                }}
                                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-2xl">videocam</span>
                                Bắt đầu luyện tập
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </LearnerLayout>
    );
}

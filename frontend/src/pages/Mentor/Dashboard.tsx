import { useState, useEffect, useCallback, useRef } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { mentorService } from '../../services/mentorService';
import { videoService } from '../../services/videoService';
import api from '../../services/api';
import MyLearnerCard from '../../components/MyLearnerCard';
import VideoCallModal from '../../components/VideoCallModal';
import { useAuth } from '../../context/AuthContext';
import ErrorBoundary from '../../components/ErrorBoundary';
import BookingRequestsModal from '../../components/mentor/BookingRequestsModal';
import ResourceManagementModal from '../../components/mentor/ResourceManagementModal';

interface DashboardStats {
    label: string;
    value: string;
    icon: string;
    change: string;
    up: boolean;
}

interface ConfirmedBooking {
    id: number;
    learner_id: number;
    learner_name: string;
    learner_email?: string;
    learner_avatar?: string;
    learner_level?: string;
    topic?: string;
    scheduled_date: string;
    scheduled_time: string;
    duration_minutes: number;
    status: string;
}

interface RecentFeedback {
    id?: number;
    learner: string;
    type: string;
    issue: string;
    status: 'pending' | 'reviewed';
}

interface MentorReview {
    id: number;
    learner_id: number;
    learner_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export default function MentorDashboard() {
    const { user: authUser } = useAuth();
    const [stats, setStats] = useState<DashboardStats[]>([]);
    const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedBooking[]>([]);
    const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([]);
    const [mentorReviews, setMentorReviews] = useState<MentorReview[]>([]);
    const [avgRating, setAvgRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [currentRoomName, setCurrentRoomName] = useState('');
    const [startingCall, setStartingCall] = useState<number | null>(null);

    // Ref to trigger MyLearnerCard refresh
    const learnerCardRefreshKey = useRef(0);

    const mentorId = Number(authUser?.id) || 0;
    const mentorName = authUser?.name || 'Mentor';



    const fetchDashboardData = useCallback(async () => {
        if (mentorId <= 0) return;

        try {
            setLoading(true);

            // Auto-sync assignments from confirmed bookings (runs silently)
            try {
                await api.post('/assignments/sync-from-bookings');
            } catch {
                // Silent fail - this is just a sync operation
            }

            const response = await mentorService.getDashboard(mentorId);
            const data = response.data;

            // Map stats from API
            setStats([
                {
                    label: 'Học viên đang hướng dẫn',
                    value: data.total_learners?.toString() || '0',
                    icon: 'school',
                    change: data.total_learners > 0 ? 'Đang hoạt động' : 'Chưa có học viên',
                    up: data.total_learners > 0
                },
                {
                    label: 'Phiên trong tuần',
                    value: data.sessions_this_week?.toString() || '0',
                    icon: 'event',
                    change: data.sessions_today ? `${data.sessions_today} hôm nay` : 'Chưa có phiên',
                    up: data.sessions_this_week > 0
                },
                {
                    label: 'Đánh giá trung bình',
                    value: data.avg_rating?.toString() || '-',
                    icon: 'star',
                    change: data.total_reviews ? `${data.total_reviews} đánh giá` : 'Chưa có đánh giá',
                    up: data.avg_rating >= 4
                },
                {
                    label: 'Giờ hướng dẫn',
                    value: data.hours_this_month?.toString() || '0',
                    icon: 'schedule',
                    change: 'Tháng này',
                    up: data.hours_this_month > 0
                },
            ]);

            // Map feedback
            if (data.recent_feedback) {
                setRecentFeedback(data.recent_feedback.map((f: any) => ({
                    id: f.id,
                    learner: f.learner_name || f.learner,
                    type: f.type || f.feedback_type,
                    issue: f.issue || f.description,
                    status: f.status || 'pending'
                })));
            }
        } catch (err) {
            console.error('Error fetching mentor dashboard:', err);
            // Set fallback data when API fails
            setStats([
                { label: 'Học viên đang hướng dẫn', value: '0', icon: 'school', change: 'Chưa có dữ liệu', up: false },
                { label: 'Phiên trong tuần', value: '0', icon: 'event', change: 'Chưa có dữ liệu', up: false },
                { label: 'Đánh giá trung bình', value: '-', icon: 'star', change: 'Chưa có dữ liệu', up: false },
                { label: 'Giờ hướng dẫn', value: '0', icon: 'schedule', change: 'Chưa có dữ liệu', up: false },
            ]);
        } finally {
            setLoading(false);
        }
    }, [mentorId]);

    // Fetch confirmed bookings for "Phiên sắp tới"
    const fetchConfirmedBookings = useCallback(async () => {
        if (mentorId <= 0) return;

        try {
            const response = await mentorService.getBookings(mentorId);
            const bookings = Array.isArray(response.data) ? response.data : [];

            // Filter only confirmed bookings (upcoming sessions)
            const confirmed = bookings.filter((b: any) => b.status === 'confirmed');

            // Sort by date and time
            confirmed.sort((a: any, b: any) => {
                const dateA = new Date(`${a.scheduled_date} ${a.scheduled_time}`);
                const dateB = new Date(`${b.scheduled_date} ${b.scheduled_time}`);
                return dateA.getTime() - dateB.getTime();
            });

            setConfirmedBookings(confirmed);
        } catch (err) {
            console.error('Error fetching confirmed bookings:', err);
            setConfirmedBookings([]);
        }
    }, [mentorId]);

    // Fetch mentor reviews
    const fetchMentorReviews = useCallback(async () => {
        if (mentorId <= 0) return;

        try {
            const response = await mentorService.getMentorReviews(mentorId);
            const data = response.data;
            setMentorReviews(data.reviews || []);
            setAvgRating(data.avg_rating || null);
        } catch (err) {
            console.error('Error fetching mentor reviews:', err);
            setMentorReviews([]);
        }
    }, [mentorId]);

    useEffect(() => {
        if (mentorId > 0) {
            fetchDashboardData();
            fetchConfirmedBookings();
            fetchMentorReviews();
        }
    }, [mentorId, fetchDashboardData, fetchConfirmedBookings, fetchMentorReviews]);

    // Handle booking update (refresh both bookings and learner card)
    const handleBookingUpdate = useCallback(() => {
        fetchDashboardData();
        fetchConfirmedBookings();
        // Trigger MyLearnerCard refresh by changing its key
        learnerCardRefreshKey.current += 1;
    }, [fetchDashboardData, fetchConfirmedBookings]);

    // Start video call for a booking
    const handleStartCall = async (booking: ConfirmedBooking) => {
        try {
            setStartingCall(booking.id);
            const room = await videoService.createRoom(booking.id, mentorId, booking.learner_id);
            setCurrentRoomName(room.room_name);
            setShowVideoCall(true);
        } catch (error) {
            console.error('Error creating video room:', error);
            alert('Có lỗi khi tạo phòng video. Vui lòng thử lại.');
        } finally {
            setStartingCall(null);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (date.toDateString() === today.toDateString()) {
                return 'Hôm nay';
            } else if (date.toDateString() === tomorrow.toDateString()) {
                return 'Ngày mai';
            }
            return date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });
        } catch {
            return dateStr;
        }
    };

    return (
        <MentorLayout
            title="Tổng quan"
            icon="dashboard"
            actions={
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowResourceModal(true)}
                        className="hidden lg:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined mr-2 text-lg">library_books</span>
                        <span className="truncate">Tài liệu & Bài tập</span>
                    </button>
                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="hidden lg:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#3e4854] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4e5a69] transition-colors"
                    >
                        <span className="material-symbols-outlined mr-2 text-lg">calendar_month</span>
                        <span className="truncate">Yêu cầu đặt lịch</span>
                    </button>
                </div>
            }
        >
            <BookingRequestsModal
                mentorId={mentorId}
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onBookingUpdate={handleBookingUpdate}
            />

            <ResourceManagementModal
                mentorId={mentorId}
                isOpen={showResourceModal}
                onClose={() => setShowResourceModal(false)}
                onSuccess={() => learnerCardRefreshKey.current += 1}
            />

            {/* Video Call Modal */}
            <VideoCallModal
                isOpen={showVideoCall}
                roomName={currentRoomName}
                userName={mentorName}
                onClose={() => setShowVideoCall(false)}
            />

            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30">
                                <div className="h-4 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                                <div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                            </div>
                        ))
                    ) : (
                        stats.map((stat, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-[#9dabb9] text-sm font-medium">{stat.label}</p>
                                    <span className="material-symbols-outlined text-primary text-xl">{stat.icon}</span>
                                </div>
                                <div>
                                    <p className="text-white text-3xl font-bold leading-tight">{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[#0bda5b] text-base">trending_up</span>
                                        <p className="text-[#0bda5b] text-xs font-medium leading-normal">{stat.change}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Sessions - Show Confirmed Bookings */}
                    <div className="lg:col-span-2 flex flex-col rounded-xl bg-[#283039] border border-[#3e4854]/30">
                        <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                            <div>
                                <h3 className="text-white text-lg font-bold">Phiên sắp tới</h3>
                                <p className="text-[#9dabb9] text-sm">Các buổi học đã xác nhận</p>
                            </div>
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Xem tất cả →
                            </button>
                        </div>
                        <div className="divide-y divide-[#3e4854]/30">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-[#3e4854] animate-pulse"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                                <div className="h-3 w-40 bg-[#3e4854] animate-pulse rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : confirmedBookings.length === 0 ? (
                                <div className="p-8 text-center">
                                    <span className="material-symbols-outlined text-5xl text-[#3b4754] mb-3 block">event_available</span>
                                    <p className="text-[#9dabb9]">Chưa có phiên học nào được xác nhận</p>
                                    <button
                                        onClick={() => setShowBookingModal(true)}
                                        className="mt-3 text-sm text-primary hover:text-primary/80"
                                    >
                                        Xem yêu cầu đặt lịch →
                                    </button>
                                </div>
                            ) : (
                                confirmedBookings.slice(0, 5).map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-5 hover:bg-[#3e4854]/20 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            {booking.learner_avatar ? (
                                                <img
                                                    src={booking.learner_avatar}
                                                    alt={booking.learner_name}
                                                    className="size-12 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                    {booking.learner_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'HV'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-white group-hover:text-primary transition-colors">
                                                    {booking.learner_name || 'Học viên'}
                                                </p>
                                                <p className="text-sm text-[#9dabb9]">{booking.topic || 'Chưa có chủ đề'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${booking.learner_level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                                booking.learner_level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {booking.learner_level?.toUpperCase() || 'A1'}
                                            </span>
                                            <div className="text-right">
                                                <p className="font-bold text-primary">{booking.scheduled_time}</p>
                                                <p className="text-xs text-[#9dabb9]">{formatDate(booking.scheduled_date)}</p>
                                            </div>
                                            <button
                                                onClick={() => handleStartCall(booking)}
                                                disabled={startingCall === booking.id}
                                                className={`px-4 py-2 rounded-lg text-white text-sm font-bold transition-all flex items-center gap-2 ${startingCall === booking.id
                                                    ? 'bg-gray-500 cursor-not-allowed'
                                                    : 'bg-primary hover:bg-primary/90'
                                                    }`}
                                            >
                                                {startingCall === booking.id ? (
                                                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-lg">videocam</span>
                                                        Bắt đầu
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* My Learner & Quick Actions */}
                    <div className="space-y-4">
                        {/* My Learner Card - with refresh key */}
                        <ErrorBoundary>
                            <MyLearnerCard
                                key={learnerCardRefreshKey.current}
                                mentorId={mentorId}
                                mentorName={mentorName}
                            />
                        </ErrorBoundary>

                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="font-bold text-white mb-4">Hành động nhanh</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowBookingModal(true)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary hover:text-white transition-colors text-left"
                                >
                                    <span className="material-symbols-outlined">calendar_month</span>
                                    <span className="text-sm font-medium">Xem yêu cầu đặt lịch</span>
                                </button>
                                <button
                                    onClick={() => setShowResourceModal(true)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#3e4854]/30 hover:bg-[#3e4854]/50 text-[#9dabb9] hover:text-white transition-colors text-left"
                                >
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <span className="text-sm font-medium">Tạo bài tập mới</span>
                                </button>
                                <button
                                    onClick={() => setShowResourceModal(true)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#3e4854]/30 hover:bg-[#3e4854]/50 text-[#9dabb9] hover:text-white transition-colors text-left"
                                >
                                    <span className="material-symbols-outlined">upload_file</span>
                                    <span className="text-sm font-medium">Tải tài liệu lên</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Reviews */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500">star</span>
                                    Đánh giá từ học viên
                                </h3>
                                <p className="text-sm text-[#9dabb9]">
                                    {avgRating ? (
                                        <span className="flex items-center gap-2">
                                            Điểm trung bình: <span className="text-yellow-500 font-bold">{avgRating.toFixed(1)}/5</span>
                                            <span className="text-[#9dabb9]">({mentorReviews.length} đánh giá)</span>
                                        </span>
                                    ) : 'Chưa có đánh giá nào'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="p-4 bg-white/5 rounded-lg animate-pulse">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-[#3e4854] rounded-full"></div>
                                            <div className="h-4 w-32 bg-[#3e4854] rounded"></div>
                                        </div>
                                        <div className="h-4 w-full bg-[#3e4854] rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : mentorReviews.length === 0 ? (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-5xl text-[#3b4754] mb-3 block">rate_review</span>
                                <p className="text-[#9dabb9]">Chưa có đánh giá nào từ học viên</p>
                                <p className="text-xs text-[#6d7a88] mt-2">Đánh giá sẽ xuất hiện sau khi học viên hoàn thành buổi học</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {mentorReviews.map((review) => (
                                    <div key={review.id} className="p-4 bg-white/5 rounded-xl border border-[#3e4854]/50 hover:border-[#3e4854] transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {review.learner_name?.charAt(0) || 'L'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{review.learner_name}</p>
                                                    <p className="text-xs text-[#9dabb9]">
                                                        {new Date(review.created_at).toLocaleDateString('vi-VN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`material-symbols-outlined text-lg ${star <= review.rating ? 'text-yellow-500' : 'text-gray-600'}`}
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-[#9dabb9] text-sm pl-13 italic">"{review.comment}"</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

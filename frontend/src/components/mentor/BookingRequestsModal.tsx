import { useState, useEffect } from 'react';
import { mentorService } from '../../services/mentorService';
import LearnerProfileModal from './LearnerProfileModal';

interface Booking {
    id: number;
    learner_id: number;
    learner_name: string;
    learner_email?: string;
    learner_avatar?: string;
    learner_level?: string;
    learner_total_sessions?: number;
    learner_overall_score?: number;
    learner_current_streak?: number;
    mentor_name?: string;
    scheduled_date: string;
    scheduled_time: string;
    duration_minutes: number;
    topic?: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
    created_at: string;
}


interface BookingRequestsModalProps {
    mentorId: number;
    isOpen: boolean;
    onClose: () => void;
    onBookingUpdate?: () => void;
    // Optional: show specific booking by ID
    focusBookingId?: number;
}

export default function BookingRequestsModal({
    mentorId,
    isOpen,
    onClose,
    onBookingUpdate,
    focusBookingId
}: BookingRequestsModalProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [selectedLearner, setSelectedLearner] = useState<Booking | null>(null);

    useEffect(() => {
        if (isOpen && mentorId) {
            fetchBookings();
        }
    }, [isOpen, mentorId]);

    const fetchBookings = async () => {
        setLoading(true);
        console.log('[BookingRequestsModal] Fetching bookings for mentorId:', mentorId);
        try {
            const response = await mentorService.getBookings(mentorId);
            console.log('[BookingRequestsModal] API Response:', response);
            let bookingsData: Booking[] = [];

            if (Array.isArray(response.data)) {
                bookingsData = response.data;
            } else if (response.data?.bookings) {
                bookingsData = response.data.bookings;
            }

            console.log('[BookingRequestsModal] Processed bookings:', bookingsData.length);

            // Sort by created_at descending, put focused booking first if specified
            bookingsData.sort((a, b) => {
                if (focusBookingId) {
                    if (a.id === focusBookingId) return -1;
                    if (b.id === focusBookingId) return 1;
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setBookings(bookingsData);
        } catch (error) {
            console.error('[BookingRequestsModal] Error fetching bookings:', error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId: number, status: 'confirmed' | 'rejected') => {
        setProcessingId(bookingId);
        try {
            await mentorService.updateBookingStatus(bookingId, status);
            // Update local state
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status } : b
            ));
            onBookingUpdate?.();
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Có lỗi khi cập nhật trạng thái');
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">Chờ xác nhận</span>;
            case 'confirmed':
                return <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">Đã xác nhận</span>;
            case 'completed':
                return <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">Hoàn thành</span>;
            case 'cancelled':
                return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-500/20 text-gray-400">Đã hủy</span>;
            case 'rejected':
                return <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">Từ chối</span>;
            default:
                return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-500/20 text-gray-400">{status}</span>;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-[#1a222a] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-border-dark flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Yêu cầu đặt lịch</h2>
                                <p className="text-text-secondary text-sm">Quản lý các lịch hẹn với học viên</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <span className="material-symbols-outlined text-gray-400">close</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                                <p className="text-text-secondary">Đang tải...</p>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <span className="material-symbols-outlined text-5xl text-[#3b4754] mb-4">event_busy</span>
                                <p className="text-text-secondary">Không có yêu cầu đặt lịch nào</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className={`rounded-xl bg-[#283039] border p-5 transition-all ${focusBookingId === booking.id
                                            ? 'border-primary ring-2 ring-primary/30'
                                            : 'border-[#3e4854]/50 hover:border-[#3e4854]'
                                            }`}
                                    >
                                        {/* Booking Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {booking.learner_avatar ? (
                                                    <img
                                                        src={booking.learner_avatar}
                                                        alt={booking.learner_name}
                                                        className="size-12 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                        {booking.learner_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'HV'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-white">{booking.learner_name || 'Học viên'}</p>
                                                        <button
                                                            onClick={() => setSelectedLearner(booking)}
                                                            className="text-xs text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded transition-colors"
                                                        >
                                                            Xem hồ sơ
                                                        </button>
                                                    </div>
                                                    {booking.learner_email && (
                                                        <p className="text-sm text-text-secondary">{booking.learner_email}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>

                                        {/* Learner Stats */}
                                        {(booking.learner_level || booking.learner_total_sessions !== undefined) && (
                                            <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-white/5 rounded-lg">
                                                <div className="text-center">
                                                    <p className="text-lg font-bold text-primary">{booking.learner_level?.toUpperCase() || 'A1'}</p>
                                                    <p className="text-xs text-text-secondary">Trình độ</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-bold text-green-400">{booking.learner_total_sessions || 0}</p>
                                                    <p className="text-xs text-text-secondary">Phiên học</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-bold text-yellow-400">{booking.learner_overall_score || 0}%</p>
                                                    <p className="text-xs text-text-secondary">Điểm TB</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-lg font-bold text-orange-400">{booking.learner_current_streak || 0}🔥</p>
                                                    <p className="text-xs text-text-secondary">Streak</p>
                                                </div>
                                            </div>
                                        )}


                                        {/* Booking Details */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                                                <span className="text-white">{formatDate(booking.scheduled_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                                                <span className="text-white">{booking.scheduled_time} ({booking.duration_minutes} phút)</span>
                                            </div>
                                        </div>

                                        {booking.topic && (
                                            <div className="mb-3">
                                                <p className="text-xs text-text-secondary mb-1">Chủ đề:</p>
                                                <p className="text-white text-sm bg-white/5 px-3 py-2 rounded-lg">{booking.topic}</p>
                                            </div>
                                        )}

                                        {booking.notes && (
                                            <div className="mb-4">
                                                <p className="text-xs text-text-secondary mb-1">Ghi chú từ học viên:</p>
                                                <p className="text-gray-300 text-sm bg-white/5 px-3 py-2 rounded-lg italic">{booking.notes}</p>
                                            </div>
                                        )}

                                        {/* Actions - only for pending bookings */}
                                        {booking.status === 'pending' && (
                                            <div className="flex gap-3 pt-3 border-t border-[#3e4854]/50">
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                    disabled={processingId === booking.id}
                                                    className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {processingId === booking.id ? (
                                                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-lg">check_circle</span>
                                                            Xác nhận
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                                    disabled={processingId === booking.id}
                                                    className="flex-1 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-lg">cancel</span>
                                                    Từ chối
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Learner Profile Modal */}
            {selectedLearner && (
                <LearnerProfileModal
                    learnerId={selectedLearner.learner_id}
                    learnerName={selectedLearner.learner_name}
                    learnerEmail={selectedLearner.learner_email}
                    learnerAvatar={selectedLearner.learner_avatar}
                    isOpen={!!selectedLearner}
                    onClose={() => setSelectedLearner(null)}
                />
            )}
        </>
    );
}

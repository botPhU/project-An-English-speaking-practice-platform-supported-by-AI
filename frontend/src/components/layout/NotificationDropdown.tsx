import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { learnerService } from '../../services/learnerService';
import { socketService } from '../../services/socketService';
import api from '../../services/api';
import BookingRequestsModal from '../mentor/BookingRequestsModal';
import VideoCallModal from '../VideoCallModal';

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'info' | 'error' | 'booking' | 'session' | 'assignment' | 'video_call';
    title: string;
    message: string;
    time: string;
    read: boolean;
    avatar?: string;
    action_url?: string;
    notification_type?: string;
}

interface VideoCallInvite {
    room_name: string;
    join_url: string;
    mentor_id: number;
    mentor_name: string;
    booking_id: number;
}

const NotificationDropdown: React.FC = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Booking modal state
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Video call invite state
    const [showVideoInvite, setShowVideoInvite] = useState(false);
    const [videoInvite, setVideoInvite] = useState<VideoCallInvite | null>(null);
    const [showVideoCall, setShowVideoCall] = useState(false);
    const [currentRoomName, setCurrentRoomName] = useState('');

    const unreadCount = notifications.filter(n => !n.read).length;

    // Fetch notifications from API
    const fetchNotifications = async () => {
        if (!authUser?.id) {
            setLoading(false);
            return;
        }
        try {
            const response = await learnerService.getNotifications(Number(authUser.id), 10);
            // Handle various API response formats
            let notificationData: any[] = [];
            if (Array.isArray(response.data)) {
                notificationData = response.data;
            } else if (response.data?.notifications && Array.isArray(response.data.notifications)) {
                notificationData = response.data.notifications;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                notificationData = response.data.data;
            }

            // Map API response to Notification format
            const mappedNotifications = notificationData.map((n: any) => ({
                id: String(n.id),
                type: n.notification_type || n.type || 'info',
                title: n.title || 'Thông báo',
                message: n.message || n.content || '',
                time: n.created_at ? formatTimeAgo(n.created_at) : '',
                read: n.is_read || false,
                avatar: n.avatar_url,
                action_url: n.action_url,
                notification_type: n.notification_type
            }));
            setNotifications(mappedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(() => {
            if (authUser?.id) {
                fetchNotifications();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [authUser?.id]);

    // Listen for real-time video call invites via WebSocket
    useEffect(() => {
        if (!authUser?.id) return;

        // Connect to socket if not connected
        socketService.connect();
        socketService.emitUserOnline(authUser.id.toString());

        // Listen for video call invite
        const handleVideoInvite = (data: any) => {
            console.log('[Notification] Video call invite received:', data);
            setVideoInvite({
                room_name: data.room_name,
                join_url: data.join_url,
                mentor_id: data.mentor_id,
                mentor_name: data.mentor_name,
                booking_id: data.booking_id
            });
            setShowVideoInvite(true);

            // Play notification sound
            try {
                const audio = new Audio('/notification.mp3');
                audio.volume = 0.5;
                audio.play().catch(() => { });
            } catch (e) { }
        };

        socketService.on('video_call_invite', handleVideoInvite);

        return () => {
            socketService.off('video_call_invite', handleVideoInvite);
        };
    }, [authUser?.id]);

    // Helper to format relative time
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read first
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );

        // Call API to persist
        try {
            await learnerService.markNotificationRead(Number(notification.id));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }

        // Handle navigation based on notification type
        const notifType = notification.notification_type || notification.type;

        if (notifType === 'booking') {
            // For booking notifications, show the booking modal
            setIsOpen(false);
            setShowBookingModal(true);
        } else if (notifType === 'video_call' && notification.action_url) {
            // For video call notifications, extract room name and open video call
            setIsOpen(false);
            const roomMatch = notification.action_url.match(/room=([^&]+)/);
            if (roomMatch) {
                setCurrentRoomName(roomMatch[1]);
                setShowVideoCall(true);
            } else {
                navigate(notification.action_url);
            }
        } else if (notification.action_url) {
            // For other types with action_url, navigate
            setIsOpen(false);
            navigate(notification.action_url);
        }
    };

    const handleJoinVideoCall = () => {
        if (videoInvite) {
            setCurrentRoomName(videoInvite.room_name);
            setShowVideoInvite(false);
            setShowVideoCall(true);
        }
    };

    const handleDeclineCall = () => {
        setShowVideoInvite(false);
        setVideoInvite(null);
    };

    const markAllAsRead = async () => {
        // Update local state immediately
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        // Call API to persist
        if (authUser?.id) {
            try {
                await api.put(`/notifications/user/${authUser.id}/read-all`);
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
            }
        }
    };

    const getTypeStyles = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: 'check_circle' };
            case 'warning':
                return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: 'warning' };
            case 'error':
                return { bg: 'bg-rose-500/20', text: 'text-rose-400', icon: 'error' };
            case 'booking':
                return { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: 'calendar_month' };
            case 'session':
                return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', icon: 'mic' };
            case 'assignment':
                return { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: 'person_add' };
            case 'video_call':
                return { bg: 'bg-green-500/20', text: 'text-green-400', icon: 'videocam' };
            case 'info':
            default:
                return { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: 'info' };
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 text-white transition-all relative
                    ${isOpen ? 'bg-primary/20 ring-2 ring-primary/50' : 'bg-[#283039] hover:bg-[#3b4754]'}`}
            >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full border-2 border-[#111418] flex items-center justify-center text-[10px] font-bold animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-[#1a222a] border border-[#3b4754] rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[#3b4754] bg-[#283039]/50">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">notifications</span>
                            <h3 className="text-white font-bold">Thông báo</h3>
                            {unreadCount > 0 && (
                                <span className="bg-primary/20 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                                    {unreadCount} mới
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-primary hover:underline font-medium"
                            >
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-[360px] divide-y divide-[#3b4754]/50">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-[#9dabb9] text-sm">Đang tải...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <span className="material-symbols-outlined text-5xl text-[#3b4754] mb-2">notifications_off</span>
                                <p className="text-[#9dabb9] text-sm">Không có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const styles = getTypeStyles(notification.type);
                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-[#283039]/70
                                            ${!notification.read ? 'bg-primary/5' : ''}`}
                                    >
                                        {/* Icon or Avatar */}
                                        {notification.avatar ? (
                                            <div
                                                className="size-10 rounded-full bg-cover bg-center shrink-0 ring-2 ring-[#3b4754]"
                                                style={{ backgroundImage: `url("${notification.avatar}")` }}
                                            />
                                        ) : (
                                            <div className={`size-10 rounded-full ${styles.bg} flex items-center justify-center shrink-0`}>
                                                <span className={`material-symbols-outlined text-xl ${styles.text}`}>
                                                    {styles.icon}
                                                </span>
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-medium truncate ${!notification.read ? 'text-white' : 'text-[#9dabb9]'}`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <span className="size-2 bg-primary rounded-full shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                            <p className="text-xs text-[#9dabb9] mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-[#64748b] mt-1.5 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">schedule</span>
                                                {notification.time}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-[#3b4754] bg-[#283039]/50">
                        <button className="w-full py-2 text-center text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            Xem tất cả thông báo
                        </button>
                    </div>
                </div>
            )}

            {/* Video Call Invite Popup */}
            {showVideoInvite && videoInvite && ReactDOM.createPortal(
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
                    <div className="bg-[#1a222a] rounded-2xl p-6 max-w-sm w-full mx-4 border border-[#3b4754] animate-in zoom-in duration-300">
                        <div className="text-center">
                            {/* Calling Animation */}
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                                <div className="absolute inset-2 bg-green-500/30 rounded-full animate-pulse"></div>
                                <div className="absolute inset-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-4xl">videocam</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                📹 {videoInvite.mentor_name} đang gọi bạn!
                            </h3>
                            <p className="text-[#9dabb9] mb-6">
                                Mentor muốn bắt đầu phiên học ngay bây giờ
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeclineCall}
                                    className="flex-1 py-3 rounded-xl bg-red-600/20 text-red-400 font-bold hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">call_end</span>
                                    Từ chối
                                </button>
                                <button
                                    onClick={handleJoinVideoCall}
                                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">videocam</span>
                                    Tham gia
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Video Call Modal */}
            {showVideoCall && ReactDOM.createPortal(
                <VideoCallModal
                    isOpen={showVideoCall}
                    roomName={currentRoomName}
                    userName={authUser?.name || 'User'}
                    onClose={() => setShowVideoCall(false)}
                />,
                document.body
            )}

            {/* Booking Requests Modal - rendered via portal to escape relative container */}
            {authUser?.role === 'mentor' && showBookingModal && ReactDOM.createPortal(
                <BookingRequestsModal
                    mentorId={Number(authUser.id)}
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    onBookingUpdate={fetchNotifications}
                />,
                document.body
            )}
        </div>
    );
};

export default NotificationDropdown;

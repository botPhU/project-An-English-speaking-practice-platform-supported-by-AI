import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Notification {
    id: number;
    title: string;
    message: string;
    notification_type: string;
    action_url?: string;
    is_read: boolean;
    created_at: string;
}

export default function Notifications() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [page, setPage] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
        }
    }, [user?.id, filter, page]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                limit: String(pageSize),
                offset: String(page * pageSize),
                unread_only: filter === 'unread' ? 'true' : 'false'
            });
            const response = await api.get(`/api/notifications/user/${user?.id}?${params}`);
            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await api.put(`/api/notifications/${notificationId}/read?user_id=${user?.id}`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await api.put(`/api/notifications/user/${user?.id}/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleDelete = async (notificationId: number) => {
        try {
            await api.delete(`/api/notifications/${notificationId}?user_id=${user?.id}`);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'achievement': return '🏆';
            case 'assignment': return '📝';
            case 'reminder': return '⏰';
            case 'session': return '📅';
            case 'message': return '💬';
            case 'system': return '⚙️';
            default: return '🔔';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'achievement': return 'bg-yellow-100 text-yellow-700';
            case 'assignment': return 'bg-blue-100 text-blue-700';
            case 'reminder': return 'bg-orange-100 text-orange-700';
            case 'session': return 'bg-green-100 text-green-700';
            case 'message': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <LearnerLayout>
            <div className="max-w-3xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">🔔 Thông báo</h1>
                        <p className="text-gray-600">
                            {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Tất cả thông báo đã đọc'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                        >
                            ✓ Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => { setFilter('all'); setPage(0); }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => { setFilter('unread'); setPage(0); }}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Chưa đọc
                    </button>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <span className="text-6xl">📭</span>
                            <p className="mt-4 text-gray-500">Không có thông báo nào</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition ${!notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${getTypeColor(notification.notification_type)}`}>
                                            {getTypeIcon(notification.notification_type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className={`font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    {notification.message && (
                                                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                                    {formatTime(notification.created_at)}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-4 mt-3">
                                                {notification.action_url && (
                                                    <a
                                                        href={notification.action_url}
                                                        className="text-sm text-blue-600 hover:underline"
                                                    >
                                                        Xem chi tiết →
                                                    </a>
                                                )}
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="text-sm text-gray-500 hover:text-gray-700"
                                                    >
                                                        Đánh dấu đã đọc
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="text-sm text-red-500 hover:text-red-700"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {notifications.length >= pageSize && (
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            ← Trước
                        </button>
                        <span className="px-4 py-2 text-gray-600">Trang {page + 1}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-gray-100 rounded-lg"
                        >
                            Tiếp →
                        </button>
                    </div>
                )}
            </div>
        </LearnerLayout>
    );
}

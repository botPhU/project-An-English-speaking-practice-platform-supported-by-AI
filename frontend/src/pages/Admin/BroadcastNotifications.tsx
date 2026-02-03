import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

interface Notification {
    id: number;
    title: string;
    message: string;
    target_audience: 'all' | 'learners' | 'mentors' | 'premium';
    notification_type: string;
    is_sent: boolean;
    sent_at?: string;
    recipients_count: number;
    created_at: string;
}

export default function BroadcastNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        target_audience: 'all' as const,
        notification_type: 'system'
    });

    const audiences = [
        { id: 'all', label: 'Tất cả người dùng', icon: '👥', count: 1250 },
        { id: 'learners', label: 'Học viên', icon: '📚', count: 980 },
        { id: 'mentors', label: 'Mentor', icon: '👨‍🏫', count: 45 },
        { id: 'premium', label: 'Premium users', icon: '⭐', count: 225 }
    ];

    const notificationTypes = [
        { id: 'system', label: 'Hệ thống', icon: '⚙️' },
        { id: 'announcement', label: 'Thông báo', icon: '📢' },
        { id: 'promotion', label: 'Khuyến mãi', icon: '🎁' },
        { id: 'update', label: 'Cập nhật', icon: '🔄' },
        { id: 'reminder', label: 'Nhắc nhở', icon: '⏰' }
    ];

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/notifications/broadcast');
            setNotifications(response.data.notifications || []);
        } catch (error) {
            // Mock data
            setNotifications([
                {
                    id: 1,
                    title: '🎉 Ra mắt tính năng Study Buddy',
                    message: 'Tính năng ghép cặp luyện nói đã có mặt! Hãy thử ngay để luyện tập với bạn học khác.',
                    target_audience: 'learners',
                    notification_type: 'announcement',
                    is_sent: true,
                    sent_at: '2026-02-01T10:00:00',
                    recipients_count: 980,
                    created_at: '2026-02-01'
                },
                {
                    id: 2,
                    title: '⏰ Nhắc nhở: Hoàn thành bài tập tuần',
                    message: 'Đừng quên hoàn thành các bài tập đã được giao trong tuần này nhé!',
                    target_audience: 'learners',
                    notification_type: 'reminder',
                    is_sent: true,
                    sent_at: '2026-01-28T09:00:00',
                    recipients_count: 650,
                    created_at: '2026-01-28'
                },
                {
                    id: 3,
                    title: '🎁 Giảm 30% gói Premium tháng 2',
                    message: 'Nhân dịp Tết, giảm giá 30% cho tất cả gói Premium. Áp dụng đến hết 15/02.',
                    target_audience: 'all',
                    notification_type: 'promotion',
                    is_sent: false,
                    recipients_count: 0,
                    created_at: '2026-02-02'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (notification: Notification) => {
        if (!confirm(`Gửi thông báo đến ${audiences.find(a => a.id === notification.target_audience)?.count || 0} người dùng?`)) return;

        setNotifications(notifications.map(n =>
            n.id === notification.id
                ? {
                    ...n,
                    is_sent: true,
                    sent_at: new Date().toISOString(),
                    recipients_count: audiences.find(a => a.id === n.target_audience)?.count || 0
                }
                : n
        ));
    };

    const handleCreate = () => {
        if (!newNotification.title || !newNotification.message) return;

        const notification: Notification = {
            id: notifications.length + 1,
            ...newNotification,
            is_sent: false,
            recipients_count: 0,
            created_at: new Date().toISOString().split('T')[0]
        };

        setNotifications([notification, ...notifications]);
        setShowCreate(false);
        setNewNotification({ title: '', message: '', target_audience: 'all', notification_type: 'system' });
    };

    const deleteNotification = (id: number) => {
        if (!confirm('Xóa thông báo này?')) return;
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getAudienceLabel = (id: string) => audiences.find(a => a.id === id)?.label || id;
    const getTypeIcon = (id: string) => notificationTypes.find(t => t.id === id)?.icon || '📢';

    const stats = {
        total: notifications.length,
        sent: notifications.filter(n => n.is_sent).length,
        pending: notifications.filter(n => !n.is_sent).length,
        totalRecipients: notifications.reduce((sum, n) => sum + n.recipients_count, 0)
    };

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">📢 Thông báo Hệ thống</h1>
                        <p className="text-gray-600">Gửi thông báo đến người dùng</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        ➕ Tạo thông báo
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-sm text-gray-500">Tổng thông báo</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
                        <p className="text-sm text-gray-500">Đã gửi</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                        <p className="text-sm text-gray-500">Chờ gửi</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                        <p className="text-3xl font-bold text-purple-600">{stats.totalRecipients.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Tổng người nhận</p>
                    </div>
                </div>

                {/* Audience Quick Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {audiences.map((audience) => (
                        <div key={audience.id} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{audience.icon}</span>
                                <div>
                                    <p className="text-2xl font-bold">{audience.count.toLocaleString()}</p>
                                    <p className="text-sm opacity-80">{audience.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="font-bold text-gray-800">Danh sách thông báo</h2>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <span className="text-4xl">📭</span>
                            <p className="mt-2 text-gray-500">Chưa có thông báo</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <span className="text-3xl">{getTypeIcon(notification.notification_type)}</span>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{notification.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <div className="flex items-center gap-3 mt-2 text-sm">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                        {getAudienceLabel(notification.target_audience)}
                                                    </span>
                                                    {notification.is_sent ? (
                                                        <span className="text-green-600">
                                                            ✓ Đã gửi {notification.recipients_count.toLocaleString()} người
                                                        </span>
                                                    ) : (
                                                        <span className="text-yellow-600">⏳ Chờ gửi</span>
                                                    )}
                                                    <span className="text-gray-400">{notification.created_at}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {!notification.is_sent && (
                                                <button
                                                    onClick={() => handleSend(notification)}
                                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                                >
                                                    📤 Gửi ngay
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Modal */}
                {showCreate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">📢 Tạo thông báo mới</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Tiêu đề thông báo"
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification(n => ({ ...n, title: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <textarea
                                    placeholder="Nội dung thông báo"
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification(n => ({ ...n, message: e.target.value }))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows={4}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng</label>
                                        <select
                                            value={newNotification.target_audience}
                                            onChange={(e) => setNewNotification(n => ({ ...n, target_audience: e.target.value as Notification['target_audience'] }))}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        >
                                            {audiences.map(a => (
                                                <option key={a.id} value={a.id}>{a.icon} {a.label} ({a.count})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                                        <select
                                            value={newNotification.notification_type}
                                            onChange={(e) => setNewNotification(n => ({ ...n, notification_type: e.target.value }))}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        >
                                            {notificationTypes.map(t => (
                                                <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreate(false)}
                                    className="flex-1 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Tạo thông báo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

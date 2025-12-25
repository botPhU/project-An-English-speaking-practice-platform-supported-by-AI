import React, { useState, useRef, useEffect } from 'react';

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    time: string;
    read: boolean;
    avatar?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'info',
        title: 'Mentor mới đăng ký',
        message: 'Sarah Miller vừa gửi yêu cầu trở thành Mentor.',
        time: '2 phút trước',
        read: false,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8-Eo_MZ8WPVPA1qk3vY00TcpllNvPS2eu7M5g9xohVSZcF1i7xhIFzlu0pAzcMf3Oo13j5i4vmDwNbaqLxdKRxYZ2K92baFN_jwJeIH3tye9z-0spDpN96trJ3uU9jM_2Myzyb603haYi3DJAikts_nJZBaqWcRIxjm02oD3oa_n5wAye6cbkIWXWJC65Ssm9kvPP45mxg1uBZonLUM176mIWRl2H02A2AQ6u8YTGKCpf8Ux95xxtvpTVdM0pnnwmVLTljNb7g-4'
    },
    {
        id: '2',
        type: 'success',
        title: 'Thanh toán thành công',
        message: 'Gói Pro Yearly đã được mua bởi Nguyễn Văn A.',
        time: '15 phút trước',
        read: false
    },
    {
        id: '3',
        type: 'warning',
        title: 'Cảnh báo hệ thống',
        message: 'CPU Server đang ở mức 85%. Cần kiểm tra.',
        time: '1 giờ trước',
        read: false
    },
    {
        id: '4',
        type: 'error',
        title: 'Báo cáo nội dung',
        message: 'Một bình luận vi phạm đã được báo cáo.',
        time: '3 giờ trước',
        read: true
    },
    {
        id: '5',
        type: 'info',
        title: 'Phản hồi mới',
        message: 'Trần Thị B đã đánh giá 5 sao cho hệ thống.',
        time: 'Hôm qua',
        read: true
    }
];

const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

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

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getTypeStyles = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: 'check_circle' };
            case 'warning':
                return { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: 'warning' };
            case 'error':
                return { bg: 'bg-rose-500/20', text: 'text-rose-400', icon: 'error' };
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
                        {notifications.length === 0 ? (
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
                                        onClick={() => markAsRead(notification.id)}
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
        </div>
    );
};

export default NotificationDropdown;

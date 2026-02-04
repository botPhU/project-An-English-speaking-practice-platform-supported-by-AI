import { useState, useEffect } from 'react';
import { messageService, type Conversation } from '../services/messageService';

interface MessagesSidebarProps {
    userId: number;
    onSelectConversation: (userId: number, userName: string) => void;
}

const MessagesSidebar = ({ userId, onSelectConversation }: MessagesSidebarProps) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadTotal, setUnreadTotal] = useState(0);

    useEffect(() => {
        fetchConversations();
        fetchUnreadCount();
    }, [userId]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const data = await messageService.getConversations(userId);
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const count = await messageService.getUnreadCount(userId);
            setUnreadTotal(count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút`;
        if (diffHours < 24) return `${diffHours} giờ`;
        if (diffDays < 7) return `${diffDays} ngày`;
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 p-4">
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#3e4854] rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-24 bg-[#3e4854] rounded"></div>
                                <div className="h-2 w-32 bg-[#3e4854] rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#3e4854]/30 flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">chat</span>
                    Tin nhắn
                    {unreadTotal > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                            {unreadTotal}
                        </span>
                    )}
                </h3>
                <button className="p-1.5 hover:bg-[#3e4854]/50 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-gray-400 text-sm">edit_square</span>
                </button>
            </div>

            {/* Conversations List */}
            <div className="max-h-[300px] overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-6 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">forum</span>
                        <p className="text-sm text-gray-400">Chưa có cuộc trò chuyện nào</p>
                    </div>
                ) : (
                    conversations.map(conv => (
                        <button
                            key={conv.user_id}
                            onClick={() => onSelectConversation(conv.user_id, conv.user_name)}
                            className="w-full p-3 flex items-center gap-3 hover:bg-[#3e4854]/30 transition-colors text-left border-b border-[#3e4854]/20 last:border-0"
                        >
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                    {conv.user_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                {conv.unread_count > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                                        {conv.unread_count}
                                    </span>
                                )}
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className={`font-medium truncate ${conv.unread_count > 0 ? 'text-white' : 'text-gray-300'}`}>
                                        {conv.user_name}
                                    </p>
                                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                        {formatTime(conv.last_message_time)}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${conv.unread_count > 0 ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {conv.last_message}
                                </p>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[#3e4854]/30">
                <button className="w-full py-2 text-sm text-primary font-medium hover:bg-primary/10 rounded-lg transition-colors">
                    Xem tất cả tin nhắn
                </button>
            </div>
        </div>
    );
};

export default MessagesSidebar;

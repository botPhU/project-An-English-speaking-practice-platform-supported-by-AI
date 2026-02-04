import { useState, useEffect, useRef } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { io, Socket } from 'socket.io-client';

interface Conversation {
    user_id: number;
    user_name: string;
    avatar: string | null;
    last_message: string;
    last_message_time: string;
    unread_count: number;
}

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    sender_name?: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export default function MentorMessages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            if (!user) return;
            try {
                const data = await messageService.getConversations(Number(user.id));
                setConversations(data || []);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [user]);

    // Setup WebSocket for real-time messages
    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
        socketRef.current = io(wsUrl, {
            transports: ['websocket', 'polling']
        });

        socketRef.current.on('new_message', (data) => {
            if (data.message) {
                // Add to messages if in current conversation
                if (selectedConversation &&
                    (data.message.sender_id === selectedConversation.user_id)) {
                    setMessages(prev => [...prev, data.message]);
                }
                // Refresh conversations list
                fetchConversationsQuiet();
            }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [selectedConversation]);

    // Quiet refresh (no loading state)
    const fetchConversationsQuiet = async () => {
        if (!user) return;
        try {
            const data = await messageService.getConversations(Number(user.id));
            setConversations(data || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Fetch messages when conversation selected
    const handleSelectConversation = async (conv: Conversation) => {
        if (!user) return;
        setSelectedConversation(conv);
        setLoadingMessages(true);
        try {
            const data = await messageService.getMessages(Number(user.id), conv.user_id);
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !user || !selectedConversation) return;

        setSending(true);
        try {
            const result = await messageService.sendMessage(
                Number(user.id),
                selectedConversation.user_id,
                newMessage.trim()
            );

            if (result?.id) {
                setMessages(prev => [...prev, {
                    id: result.id,
                    sender_id: Number(user.id),
                    receiver_id: selectedConversation.user_id,
                    sender_name: user.name,
                    content: newMessage.trim(),
                    is_read: false,
                    created_at: new Date().toISOString()
                }]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        if (hours < 24) return `${hours}h trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <MentorLayout
            title="Tin nhắn"
            icon="chat"
            subtitle="Trò chuyện với học viên"
        >
            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <div className="w-80 bg-[#283039] rounded-xl border border-[#3e4854]/30 flex flex-col">
                    <div className="p-4 border-b border-[#3e4854]/30">
                        <h3 className="font-bold text-white">Hội thoại</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <span className="material-symbols-outlined text-4xl mb-2">chat</span>
                                <p>Chưa có tin nhắn</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.user_id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`p-4 cursor-pointer border-b border-[#3e4854]/20 hover:bg-[#3e4854]/20 transition-colors ${selectedConversation?.user_id === conv.user_id ? 'bg-purple-600/20' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={conv.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.user_name}`}
                                                className="size-12 rounded-full"
                                                alt=""
                                            />
                                            {conv.unread_count > 0 && (
                                                <span className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-white truncate">{conv.user_name}</p>
                                            <p className="text-sm text-gray-400 truncate">{conv.last_message}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {conv.last_message_time ? formatTime(conv.last_message_time) : ''}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-[#283039] rounded-xl border border-[#3e4854]/30 flex flex-col">
                    {!selectedConversation ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-6xl mb-4">forum</span>
                                <p>Chọn một hội thoại để bắt đầu</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-[#3e4854]/30 flex items-center gap-3">
                                <img
                                    src={selectedConversation.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation.user_name}`}
                                    className="size-10 rounded-full"
                                    alt=""
                                />
                                <div>
                                    <p className="font-bold text-white">{selectedConversation.user_name}</p>
                                    <p className="text-xs text-gray-400">Học viên</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <span className="material-symbols-outlined animate-spin text-4xl text-purple-500">progress_activity</span>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <p>Chưa có tin nhắn. Hãy bắt đầu trò chuyện!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMe = msg.sender_id === Number(user?.id);
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[70%]`}>
                                                    <div className={`px-4 py-2.5 rounded-2xl ${isMe
                                                        ? 'bg-purple-600 text-white rounded-br-md'
                                                        : 'bg-[#3e4854] text-white rounded-bl-md'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    <p className={`text-[10px] text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {formatTime(msg.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-[#3e4854]/30">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 px-4 py-3 rounded-xl bg-[#1a222a] text-white border border-[#3e4854] focus:border-purple-500 outline-none"
                                        disabled={sending}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!newMessage.trim() || sending}
                                        className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MentorLayout>
    );
}

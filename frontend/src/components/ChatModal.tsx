import { useState, useEffect, useRef } from 'react';
import { messageService } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';

interface ChatModalProps {
    otherUser: {
        id: number;
        name?: string;
        full_name?: string;
        avatar?: string;
        isOnline?: boolean;
    };
    onClose: () => void;
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

export default function ChatModal({ otherUser, onClose }: ChatModalProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            if (!user) return;
            try {
                const data = await messageService.getMessages(Number(user.id), otherUser.id);
                setMessages(data || []);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [user, otherUser.id]);

    // Setup WebSocket for real-time messages
    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
        socketRef.current = io(wsUrl, {
            transports: ['websocket', 'polling']
        });

        socketRef.current.on('new_message', (data) => {
            if (data.message &&
                (data.message.sender_id === otherUser.id || data.message.receiver_id === otherUser.id)) {
                setMessages(prev => [...prev, data.message]);
            }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [otherUser.id]);

    // Scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !user) return;

        setSending(true);
        try {
            const result = await messageService.sendMessage(
                Number(user.id),
                otherUser.id,
                newMessage.trim()
            );

            if (result?.id) {
                // Add message optimistically
                setMessages(prev => [...prev, {
                    id: result.id,
                    sender_id: Number(user.id),
                    receiver_id: otherUser.id,
                    sender_name: user.name,
                    content: newMessage.trim(),
                    is_read: false,
                    created_at: new Date().toISOString()
                }]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Không thể gửi tin nhắn');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a222a] rounded-2xl w-full max-w-lg h-[600px] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-border-dark flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <img
                            src={otherUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name || otherUser.full_name}`}
                            className="size-10 rounded-full border-2 border-primary"
                            alt="Avatar"
                        />
                        <div>
                            <h3 className="font-bold text-white">{otherUser.full_name || otherUser.name}</h3>
                            <p className={`text-xs flex items-center gap-1 ${otherUser.isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                                <span className={`size-2 rounded-full ${otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                {otherUser.isOnline ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined text-gray-400">close</span>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <span className="material-symbols-outlined text-5xl mb-2">chat</span>
                            <p>Chưa có tin nhắn</p>
                            <p className="text-sm">Bắt đầu cuộc trò chuyện!</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender_id === Number(user?.id);
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] ${isMe ? 'order-1' : 'order-2'}`}>
                                        <div className={`px-4 py-2.5 rounded-2xl ${isMe
                                            ? 'bg-primary text-white rounded-br-md'
                                            : 'bg-[#283039] text-white rounded-bl-md'
                                            }`}>
                                            {msg.content}
                                        </div>
                                        <p className={`text-[10px] text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                            {formatTime(msg.created_at)}
                                            {isMe && msg.is_read && ' ✓✓'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border-dark shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-4 py-3 rounded-xl bg-[#283039] text-white border border-border-dark focus:border-primary outline-none"
                            disabled={sending}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim() || sending}
                            className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined">send</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';

interface TicketDetailModalProps {
    ticketId: string;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange?: () => void;
}

interface TicketMessage {
    from: 'user' | 'admin' | 'system';
    message: string;
    time: string;
    sender_name?: string;
}

interface TicketDetails {
    id: string;
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    created_at: string;
    updated_at: string;
    messages: TicketMessage[];
}

const PRIORITY_COLORS = {
    low: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Thấp' },
    medium: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Trung bình' },
    high: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Cao' },
    urgent: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Khẩn cấp' }
};

const STATUS_OPTIONS = [
    { value: 'open', label: 'Mở', color: 'bg-blue-500' },
    { value: 'in_progress', label: 'Đang xử lý', color: 'bg-yellow-500' },
    { value: 'resolved', label: 'Đã giải quyết', color: 'bg-green-500' },
    { value: 'closed', label: 'Đã đóng', color: 'bg-gray-500' }
];

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
    ticketId,
    isOpen,
    onClose,
    onStatusChange
}) => {
    const [ticket, setTicket] = useState<TicketDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && ticketId) {
            fetchTicketDetails();
        }
    }, [isOpen, ticketId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket?.messages]);

    const fetchTicketDetails = async () => {
        try {
            setLoading(true);
            const response = await adminService.getTicketDetails(ticketId);
            setTicket(response.data);
        } catch (error) {
            console.error('Error fetching ticket details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!ticket) return;

        try {
            setUpdatingStatus(true);
            await adminService.updateTicketStatus(ticketId, newStatus);
            setTicket(prev => prev ? { ...prev, status: newStatus as TicketDetails['status'] } : null);
            onStatusChange?.();
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim() || !ticket) return;

        try {
            setSending(true);
            // Get admin ID from localStorage or context
            const adminId = localStorage.getItem('user_id') || '1';
            await adminService.replyToTicket(ticketId, adminId, replyMessage);

            // Add message to local state
            const newMessage: TicketMessage = {
                from: 'admin',
                message: replyMessage,
                time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                sender_name: 'Admin'
            };
            setTicket(prev => prev ? {
                ...prev,
                messages: [...prev.messages, newMessage],
                status: prev.status === 'open' ? 'in_progress' : prev.status
            } : null);
            setReplyMessage('');
        } catch (error) {
            console.error('Error sending reply:', error);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#1a222a] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#3e4854]/50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#3e4854] shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-white">
                            Ticket #{ticketId.slice(-4)}
                        </h2>
                        {ticket && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_COLORS[ticket.priority].bg} ${PRIORITY_COLORS[ticket.priority].text}`}>
                                {PRIORITY_COLORS[ticket.priority].label}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#283039] rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-[#9dabb9]">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : ticket ? (
                        <>
                            {/* Left Panel - Conversation */}
                            <div className="flex-1 flex flex-col border-r border-[#3e4854]">
                                {/* Ticket Info */}
                                <div className="p-4 border-b border-[#3e4854] bg-[#283039]/50">
                                    <h3 className="text-white font-semibold mb-2">{ticket.subject}</h3>
                                    <p className="text-[#9dabb9] text-sm">{ticket.description}</p>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {ticket.messages.length > 0 ? (
                                        ticket.messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[80%] ${msg.from === 'admin'
                                                        ? 'bg-primary/20 rounded-2xl rounded-br-sm'
                                                        : msg.from === 'system'
                                                            ? 'bg-yellow-500/10 rounded-xl border border-yellow-500/20'
                                                            : 'bg-[#283039] rounded-2xl rounded-bl-sm'
                                                    } p-4`}>
                                                    {msg.from !== 'admin' && (
                                                        <p className={`text-xs font-medium mb-1 ${msg.from === 'system' ? 'text-yellow-400' : 'text-primary'
                                                            }`}>
                                                            {msg.from === 'system' ? 'Hệ thống' : ticket.user.name}
                                                        </p>
                                                    )}
                                                    <p className="text-white text-sm">{msg.message}</p>
                                                    <p className="text-[#9dabb9] text-xs mt-1 text-right">{msg.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-[#9dabb9] py-8">
                                            <span className="material-symbols-outlined text-3xl opacity-30 mb-2">forum</span>
                                            <p>Chưa có tin nhắn nào</p>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Reply Input */}
                                <div className="p-4 border-t border-[#3e4854] shrink-0">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                                            placeholder="Nhập tin nhắn trả lời..."
                                            className="flex-1 bg-[#283039] border border-[#3e4854] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                            disabled={ticket.status === 'closed'}
                                        />
                                        <button
                                            onClick={handleSendReply}
                                            disabled={sending || !replyMessage.trim() || ticket.status === 'closed'}
                                            className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {sending ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            ) : (
                                                <span className="material-symbols-outlined">send</span>
                                            )}
                                        </button>
                                    </div>
                                    {ticket.status === 'closed' && (
                                        <p className="text-sm text-[#9dabb9] mt-2">Ticket đã đóng. Không thể gửi tin nhắn.</p>
                                    )}
                                </div>
                            </div>

                            {/* Right Panel - Details */}
                            <div className="w-80 p-6 space-y-6 overflow-y-auto">
                                {/* User Info */}
                                <div>
                                    <h4 className="text-[#9dabb9] text-xs uppercase font-semibold mb-3">Người gửi</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                                            {ticket.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{ticket.user.name}</p>
                                            <p className="text-[#9dabb9] text-sm">{ticket.user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <h4 className="text-[#9dabb9] text-xs uppercase font-semibold mb-3">Trạng thái</h4>
                                    <div className="space-y-2">
                                        {STATUS_OPTIONS.map(status => (
                                            <button
                                                key={status.value}
                                                onClick={() => handleStatusChange(status.value)}
                                                disabled={updatingStatus}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${ticket.status === status.value
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-[#3e4854] hover:bg-[#283039]'
                                                    }`}
                                            >
                                                <span className={`size-3 rounded-full ${status.color}`} />
                                                <span className={`text-sm ${ticket.status === status.value ? 'text-white font-medium' : 'text-[#9dabb9]'
                                                    }`}>
                                                    {status.label}
                                                </span>
                                                {ticket.status === status.value && (
                                                    <span className="material-symbols-outlined text-primary ml-auto text-lg">check</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <h4 className="text-[#9dabb9] text-xs uppercase font-semibold mb-3">Danh mục</h4>
                                    <div className="bg-[#283039] rounded-lg p-3 border border-[#3e4854]">
                                        <p className="text-white capitalize">{ticket.category || 'Chung'}</p>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div>
                                    <h4 className="text-[#9dabb9] text-xs uppercase font-semibold mb-3">Thời gian</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#9dabb9]">Tạo lúc:</span>
                                            <span className="text-white">{ticket.created_at}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#9dabb9]">Cập nhật:</span>
                                            <span className="text-white">{ticket.updated_at || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="pt-4 border-t border-[#3e4854]">
                                    <h4 className="text-[#9dabb9] text-xs uppercase font-semibold mb-3">Hành động nhanh</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleStatusChange('resolved')}
                                            disabled={ticket.status === 'resolved' || ticket.status === 'closed'}
                                            className="w-full flex items-center gap-2 p-3 bg-[#0bda5b]/10 text-[#0bda5b] rounded-lg hover:bg-[#0bda5b]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined">check_circle</span>
                                            <span className="text-sm font-medium">Đánh dấu đã giải quyết</span>
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('closed')}
                                            disabled={ticket.status === 'closed'}
                                            className="w-full flex items-center gap-2 p-3 bg-[#283039] text-[#9dabb9] rounded-lg hover:bg-[#3e4854] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined">cancel</span>
                                            <span className="text-sm font-medium">Đóng ticket</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[#9dabb9]">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-4xl opacity-30 mb-2">error</span>
                                <p>Không tìm thấy ticket</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketDetailModal;

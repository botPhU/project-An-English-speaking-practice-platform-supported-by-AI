import { useState } from 'react';

// Mock data for support tickets
const mockTickets = [
    { id: 'TKT001', user: 'Nguyễn Văn A', email: 'nguyenvana@email.com', subject: 'Không thể truy cập bài học', category: 'technical', priority: 'high', status: 'open', date: '2024-12-20 14:30', messages: 3 },
    { id: 'TKT002', user: 'Trần Thị B', email: 'tranthib@email.com', subject: 'Hỏi về gói Premium', category: 'billing', priority: 'medium', status: 'in-progress', date: '2024-12-20 10:15', messages: 5 },
    { id: 'TKT003', user: 'Lê Văn C', email: 'levanc@email.com', subject: 'Đề xuất thêm chủ đề mới', category: 'feature', priority: 'low', status: 'open', date: '2024-12-19 16:45', messages: 1 },
    { id: 'TKT004', user: 'Phạm Thị D', email: 'phamthid@email.com', subject: 'Lỗi thanh toán', category: 'billing', priority: 'urgent', status: 'open', date: '2024-12-19 09:20', messages: 2 },
    { id: 'TKT005', user: 'Hoàng Văn E', email: 'hoangvane@email.com', subject: 'Cảm ơn đội ngũ hỗ trợ', category: 'feedback', priority: 'low', status: 'resolved', date: '2024-12-18 11:00', messages: 4 },
];

const mockFAQs = [
    { id: 1, question: 'Làm sao để nâng cấp gói học?', answer: 'Bạn có thể vào mục Gói học & Thanh toán để nâng cấp...', views: 1250 },
    { id: 2, question: 'Chính sách hoàn tiền như thế nào?', answer: 'AESP hỗ trợ hoàn tiền trong vòng 7 ngày...', views: 890 },
    { id: 3, question: 'Làm sao để đặt lịch với Mentor?', answer: 'Truy cập trang Mentor và chọn lịch phù hợp...', views: 756 },
];

export default function LearnerSupport() {
    const [tickets] = useState(mockTickets);
    const [faqs] = useState(mockFAQs);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'tickets' | 'faq'>('tickets');

    const filteredTickets = tickets.filter(t => {
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
        return matchesStatus && matchesPriority;
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500/10 text-red-600 dark:text-red-400';
            case 'high': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
            case 'medium': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
            default: return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'bg-green-500/10 text-green-600 dark:text-green-400';
            case 'in-progress': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
            default: return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#111418] p-6 font-[Manrope,sans-serif]">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#111418] dark:text-white mb-2">
                    Hỗ Trợ Người Học
                </h1>
                <p className="text-[#637588] dark:text-[#9dabb9]">
                    Quản lý yêu cầu hỗ trợ và FAQ cho người học
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-500">inbox</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {tickets.filter(t => t.status === 'open').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Chờ xử lý</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-500">priority_high</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {tickets.filter(t => t.priority === 'urgent').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Khẩn cấp</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-500">pending</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {tickets.filter(t => t.status === 'in-progress').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Đang xử lý</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {tickets.filter(t => t.status === 'resolved').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Đã giải quyết</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('tickets')}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'tickets'
                            ? 'bg-[#2b8cee] text-white'
                            : 'bg-white dark:bg-[#1c2127] text-[#637588] hover:bg-gray-50 dark:hover:bg-[#111418] border border-[#dce0e5] dark:border-[#3b4754]'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined">support_agent</span>
                        Yêu cầu hỗ trợ
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('faq')}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'faq'
                            ? 'bg-[#2b8cee] text-white'
                            : 'bg-white dark:bg-[#1c2127] text-[#637588] hover:bg-gray-50 dark:hover:bg-[#111418] border border-[#dce0e5] dark:border-[#3b4754]'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined">help</span>
                        Quản lý FAQ
                    </span>
                </button>
            </div>

            {activeTab === 'tickets' ? (
                <>
                    {/* Filters */}
                    <div className="bg-white dark:bg-[#1c2127] rounded-xl p-4 mb-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                        <div className="flex flex-col md:flex-row gap-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418] text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="open">Chờ xử lý</option>
                                <option value="in-progress">Đang xử lý</option>
                                <option value="resolved">Đã giải quyết</option>
                            </select>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-4 py-3 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-[#f6f7f8] dark:bg-[#111418] text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50"
                            >
                                <option value="all">Tất cả độ ưu tiên</option>
                                <option value="urgent">Khẩn cấp</option>
                                <option value="high">Cao</option>
                                <option value="medium">Trung bình</option>
                                <option value="low">Thấp</option>
                            </select>
                        </div>
                    </div>

                    {/* Tickets List */}
                    <div className="bg-white dark:bg-[#1c2127] rounded-xl shadow-sm border border-[#dce0e5] dark:border-[#3b4754] overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#f6f7f8] dark:bg-[#111418] border-b border-[#dce0e5] dark:border-[#3b4754]">
                                    <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Ticket</th>
                                    <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Người gửi</th>
                                    <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Danh mục</th>
                                    <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Độ ưu tiên</th>
                                    <th className="text-left px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Trạng thái</th>
                                    <th className="text-right px-6 py-4 text-sm font-bold text-[#637588] dark:text-[#9dabb9]">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-[#dce0e5] dark:border-[#3b4754] hover:bg-[#f6f7f8] dark:hover:bg-[#111418]/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-mono text-sm text-[#2b8cee] font-semibold">{ticket.id}</p>
                                                <p className="font-semibold text-[#111418] dark:text-white">{ticket.subject}</p>
                                                <p className="text-sm text-[#637588] dark:text-[#9dabb9]">{ticket.date}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-[#111418] dark:text-white">{ticket.user}</p>
                                                <p className="text-sm text-[#637588] dark:text-[#9dabb9]">{ticket.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full bg-[#f6f7f8] dark:bg-[#111418] text-sm font-medium text-[#637588] dark:text-[#9dabb9] capitalize">
                                                {ticket.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority === 'urgent' ? 'Khẩn cấp' :
                                                    ticket.priority === 'high' ? 'Cao' :
                                                        ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status === 'resolved' ? 'Đã giải quyết' :
                                                    ticket.status === 'in-progress' ? 'Đang xử lý' : 'Chờ xử lý'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedTicket(ticket)}
                                                    className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]"
                                                >
                                                    <span className="material-symbols-outlined">chat</span>
                                                </button>
                                                <span className="text-sm text-[#637588] dark:text-[#9dabb9]">{ticket.messages}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                /* FAQ Management */
                <div className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <button className="px-6 py-3 bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined">add</span>
                            Thêm FAQ
                        </button>
                    </div>
                    {faqs.map((faq) => (
                        <div key={faq.id} className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#111418] dark:text-white mb-2">{faq.question}</h3>
                                    <p className="text-[#637588] dark:text-[#9dabb9]">{faq.answer}</p>
                                    <div className="flex items-center gap-2 mt-3 text-sm text-[#637588] dark:text-[#9dabb9]">
                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        {faq.views} lượt xem
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-[#2b8cee]/10 rounded-lg transition-colors text-[#637588] hover:text-[#2b8cee]">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-[#637588] hover:text-red-500">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Chat Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1c2127] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#dce0e5] dark:border-[#3b4754]">
                            <div>
                                <h2 className="text-xl font-bold text-[#111418] dark:text-white">{selectedTicket.subject}</h2>
                                <p className="text-sm text-[#637588] dark:text-[#9dabb9]">{selectedTicket.id} • {selectedTicket.user}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-[#111418] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#637588]">close</span>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-auto space-y-4">
                            <div className="flex gap-3">
                                <div className="size-10 rounded-full bg-gradient-to-br from-[#2b8cee] to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                                    {selectedTicket.user.charAt(0)}
                                </div>
                                <div className="flex-1 bg-[#f6f7f8] dark:bg-[#111418] rounded-lg p-4">
                                    <p className="text-[#111418] dark:text-white">Xin chào, tôi gặp vấn đề với {selectedTicket.subject.toLowerCase()}. Mong được hỗ trợ!</p>
                                    <p className="text-xs text-[#637588] mt-2">{selectedTicket.date}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reply */}
                        <div className="p-6 border-t border-[#dce0e5] dark:border-[#3b4754]">
                            <div className="flex gap-3">
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Nhập phản hồi..."
                                    className="flex-1 p-4 rounded-lg border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-[#111418] text-[#111418] dark:text-white resize-none focus:ring-2 focus:ring-[#2b8cee]/50"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-between mt-4">
                                <button className="px-4 py-2 text-green-600 font-medium hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors">
                                    Đánh dấu đã giải quyết
                                </button>
                                <button className="px-6 py-3 bg-[#2b8cee] text-white rounded-lg font-bold hover:bg-[#2b8cee]/90 transition-colors">
                                    Gửi phản hồi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';

// Mock data for feedbacks
const mockFeedbacks = [
    { id: 1, user: 'Nguyễn Văn A', type: 'comment', content: 'Mentor rất nhiệt tình, giúp tôi cải thiện phát âm rất nhiều!', target: 'Mentor Trần B', date: '2024-12-20 14:30', status: 'pending' },
    { id: 2, user: 'Lê Thị C', type: 'review', content: 'Ứng dụng rất tốt, giao diện đẹp và dễ sử dụng. Tuy nhiên cần thêm nhiều chủ đề hơn.', target: 'App', date: '2024-12-20 10:15', status: 'pending' },
    { id: 3, user: 'Phạm Văn D', type: 'comment', content: 'Nội dung không phù hợp...', target: 'Bài học Daily Conversation', date: '2024-12-19 16:45', status: 'flagged' },
    { id: 4, user: 'Hoàng Thị E', type: 'review', content: 'Buổi học 1-1 với mentor rất hiệu quả!', target: 'Mentor Nguyễn F', date: '2024-12-19 09:20', status: 'approved' },
    { id: 5, user: 'Trần Văn G', type: 'feedback', content: 'Đề xuất thêm tính năng luyện tập nhóm', target: 'Feature Request', date: '2024-12-18 11:00', status: 'pending' },
];

export default function FeedbackModeration() {
    const [feedbacks] = useState(mockFeedbacks);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [selectedFeedback, setSelectedFeedback] = useState<typeof mockFeedbacks[0] | null>(null);

    const filteredFeedbacks = feedbacks.filter(f =>
        filterStatus === 'all' || f.status === filterStatus
    );

    const handleAction = (id: number, action: 'approve' | 'reject' | 'flag') => {
        console.log(`Action ${action} for feedback ${id}`);
        setSelectedFeedback(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-500/10 text-green-600 dark:text-green-400';
            case 'rejected': return 'bg-red-500/10 text-red-600 dark:text-red-400';
            case 'flagged': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
            default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved': return 'Đã duyệt';
            case 'rejected': return 'Từ chối';
            case 'flagged': return 'Cần xem xét';
            default: return 'Chờ duyệt';
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#111418] p-6 font-[Manrope,sans-serif]">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#111418] dark:text-white mb-2">
                    Kiểm Duyệt Phản Hồi
                </h1>
                <p className="text-[#637588] dark:text-[#9dabb9]">
                    Kiểm duyệt các phản hồi và bình luận của người dùng trong hệ thống
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-500">pending_actions</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {feedbacks.filter(f => f.status === 'pending').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Chờ duyệt</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-yellow-500">flag</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">
                                {feedbacks.filter(f => f.status === 'flagged').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Cần xem xét</p>
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
                                {feedbacks.filter(f => f.status === 'approved').length}
                            </p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Đã duyệt</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754]">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-[#2b8cee]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#2b8cee]">rate_review</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[#111418] dark:text-white">{feedbacks.length}</p>
                            <p className="text-sm text-[#637588] dark:text-[#9dabb9]">Tổng phản hồi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white dark:bg-[#1c2127] rounded-xl p-2 mb-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754] inline-flex">
                {['pending', 'flagged', 'approved', 'rejected', 'all'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === status
                                ? 'bg-[#2b8cee] text-white'
                                : 'text-[#637588] hover:bg-[#f6f7f8] dark:hover:bg-[#111418]'
                            }`}
                    >
                        {status === 'pending' ? 'Chờ duyệt' :
                            status === 'flagged' ? 'Cần xem xét' :
                                status === 'approved' ? 'Đã duyệt' :
                                    status === 'rejected' ? 'Từ chối' : 'Tất cả'}
                    </button>
                ))}
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
                {filteredFeedbacks.map((feedback) => (
                    <div
                        key={feedback.id}
                        className="bg-white dark:bg-[#1c2127] rounded-xl p-6 shadow-sm border border-[#dce0e5] dark:border-[#3b4754] hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="size-10 rounded-full bg-gradient-to-br from-[#2b8cee] to-purple-500 flex items-center justify-center text-white font-bold">
                                        {feedback.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#111418] dark:text-white">{feedback.user}</p>
                                        <p className="text-sm text-[#637588] dark:text-[#9dabb9]">{feedback.date}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                                        {getStatusText(feedback.status)}
                                    </span>
                                    <span className="px-2 py-1 rounded bg-[#f6f7f8] dark:bg-[#111418] text-xs text-[#637588] dark:text-[#9dabb9]">
                                        {feedback.type}
                                    </span>
                                </div>
                                <p className="text-[#111418] dark:text-white mb-2">{feedback.content}</p>
                                <p className="text-sm text-[#637588] dark:text-[#9dabb9]">
                                    <span className="font-medium">Đối tượng:</span> {feedback.target}
                                </p>
                            </div>
                            {feedback.status === 'pending' || feedback.status === 'flagged' ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAction(feedback.id, 'approve')}
                                        className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-600 transition-colors"
                                        title="Duyệt"
                                    >
                                        <span className="material-symbols-outlined">check</span>
                                    </button>
                                    <button
                                        onClick={() => handleAction(feedback.id, 'reject')}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-600 transition-colors"
                                        title="Từ chối"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedFeedback(feedback)}
                                        className="p-2 bg-[#2b8cee]/10 hover:bg-[#2b8cee]/20 rounded-lg text-[#2b8cee] transition-colors"
                                        title="Xem chi tiết"
                                    >
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setSelectedFeedback(feedback)}
                                    className="p-2 hover:bg-[#f6f7f8] dark:hover:bg-[#111418] rounded-lg text-[#637588] transition-colors"
                                >
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-[#1c2127] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-[#111418] dark:text-white">Chi tiết Phản hồi</h2>
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-[#111418] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#637588]">close</span>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-[#637588] dark:text-[#9dabb9] mb-1">Người gửi</p>
                                <p className="font-semibold text-[#111418] dark:text-white">{selectedFeedback.user}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#637588] dark:text-[#9dabb9] mb-1">Nội dung</p>
                                <p className="text-[#111418] dark:text-white bg-[#f6f7f8] dark:bg-[#111418] p-4 rounded-lg">
                                    {selectedFeedback.content}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <p className="text-sm text-[#637588] dark:text-[#9dabb9] mb-1">Loại</p>
                                    <p className="font-medium text-[#111418] dark:text-white capitalize">{selectedFeedback.type}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-[#637588] dark:text-[#9dabb9] mb-1">Đối tượng</p>
                                    <p className="font-medium text-[#111418] dark:text-white">{selectedFeedback.target}</p>
                                </div>
                            </div>
                        </div>
                        {(selectedFeedback.status === 'pending' || selectedFeedback.status === 'flagged') && (
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => handleAction(selectedFeedback.id, 'reject')}
                                    className="flex-1 py-3 border border-red-500 text-red-500 rounded-lg font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                >
                                    Từ chối
                                </button>
                                <button
                                    onClick={() => handleAction(selectedFeedback.id, 'approve')}
                                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
                                >
                                    Duyệt
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

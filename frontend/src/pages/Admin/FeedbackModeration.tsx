import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';

// Types
interface Feedback {
    id: string;
    user: {
        name: string;
        role: 'learner' | 'mentor';
        avatar: string;
    };
    content: string;
    context: string;
    status: 'pending' | 'reviewed' | 'reported' | 'approved';
    aiAnalysis?: {
        type: 'constructive' | 'toxic' | 'neutral';
        label: string;
    };
    timestamp: string;
    isFlagged?: boolean;
}

// Mock data - sẽ được thay thế bằng API call
const mockFeedbacks: Feedback[] = [
    {
        id: '1',
        user: {
            name: 'Nguyễn Văn A',
            role: 'learner',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpWYVxzQ3oxSnlrPAkpGeJ77l3AbGRwdN0jEr-eIJYfZCBjj0nF_oxGsdECqT_Sle6sWUNcsDxc10kWjBYO7NMnep7DQbE4MMN2sXuAJa3xjbQNnsXNC29k-AkSMftXjOCBOax_Gn8uGSCO6A-uDZvBRwyk5oTN6kiNmopc1pcYXj1b-IF1B-1G6bPJrxApCduJBy3Mat4JS7WEQAptpW7FZSGns2pOzsk3omPPc-OpOTD3PN6-tPXSXbpU2PfJOZNXtA87vexnHI'
        },
        content: 'Bài học này AI nhận diện giọng nói chưa tốt lắm, mình đọc đúng mà vẫn báo sai.',
        context: 'Lesson 4 - Speaking',
        status: 'pending',
        aiAnalysis: { type: 'constructive', label: 'AI Analysis: Constructive' },
        timestamp: '10 phút trước'
    },
    {
        id: '2',
        user: {
            name: 'Trần Thị B',
            role: 'mentor',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqBJhnsqJE1vNAxT1k7xHm3LTS3WNaS8onEpj2NH5Vt6z3X_w0OiTr6oqqRj6FQ8ugzt20M83tqaSpFy4sw-hoXOeVfIvDNTgz13zpAJacnVdckNOL8G3qA6CDGyo2OO5fDnR0tPGrkMLv_Wm8rMZ2q0q4kqMHQXuCCiinF9Cr_NXwe-LRuhnjnZLkJr3oQraGyH11hOPHSSmLWY8VaA6yXz4iznMPmT8C8e9ah3guPH6qyoH8jhJ8DRyPa97WAuLtmGafWEZQORE'
        },
        content: 'Nội dung phần này cần cập nhật thêm ví dụ thực tế hơn.',
        context: 'Grammar - Unit 2',
        status: 'reviewed',
        timestamp: '35 phút trước'
    },
    {
        id: '3',
        user: {
            name: 'Lê Văn C',
            role: 'learner',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZOICKJyWlQ3HixPWCIQLoGbaimRiJt47ngr0kRp1xIbPl8x8RpszQ3JQ9yR4GdlgZoSXiGvelYtOzYLpKy7bkyxFEjVuQBHNJh5iA7LXa-pfJNbOGRi2fU2oHWiN_PP9Zo9aRWIBhnQmxs4S5QSAhIibRFSxSAWCCze686ZGsBE6tKSn8UPYrvEnpkr47Bd7xAj2DvQ7XqTAk8D63NH-FkVGNfA3m7k1PsCdDK3lKzfCjy6FbEngfsliHBerre15z2tV2tRomkIQ'
        },
        content: '**** **** cái ứng dụng này.',
        context: 'General Feedback',
        status: 'reported',
        aiAnalysis: { type: 'toxic', label: 'AI Analysis: Toxic' },
        timestamp: '1 giờ trước',
        isFlagged: true
    },
    {
        id: '4',
        user: {
            name: 'Phạm Thu H',
            role: 'learner',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJOZikFFyKPO6TXQmgm_B9abe3ZXkuYXKjqgH4VmSX4MIPP0JjSo7e4C6sTU7q-gKSpHL1s05omEDFm20wRDdEMkJfQ7o5ZZ04thDbWA2i_DbqwUn5DL-MESv-Mi0G99fhvVSlBZ6yXK6tobTIQwxMxOiQBYr_pDSjKTpX51XiNY6sY0MA_mSwyTlp1UiYWlO3nKpB8o4VTGZNg5xEZdzfDA6E2mfC-JqQZKZw5pEo0mwjvWu9wjEukF-iFXcXoaulYwo2g1wdsLk'
        },
        content: 'Làm sao để đăng ký học thêm khóa nâng cao ạ?',
        context: 'FAQ Section',
        status: 'pending',
        timestamp: '2 giờ trước'
    },
    {
        id: '5',
        user: {
            name: 'Hoàng K',
            role: 'mentor',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtysR2HatDZREc01vgAaUV-IyWQca7hYZSQMw5JPWJqXgeQGbldTf3LE2DeTtfFpFqfqqoYsckAogbQfx95N-GPQuUlxUOdGfXDhtTIhiofcdF7SaRwfQdqKMBtfkMmmGfE8Mon3gDD6qnW0J-JSRcA978shwL9LnoPRPfBfeRJt2zJ8jkB2JAnGsFDONvBTlYGrPkHrhTare6dx-L3lAKraY65Q-tOUct83n5Z8-qufISOwxykwq5ivaa_IFioJtSaSfzD7cgKtI'
        },
        content: 'Học viên này đã tiến bộ rất nhiều, cần cập nhật level.',
        context: 'User Profile: ID #8291',
        status: 'approved',
        timestamp: 'Hôm qua'
    }
];

// Stats data - sẽ được thay thế bằng API call
const mockStats = {
    pending: { count: 124, change: '+12%' },
    reported: { count: 5, change: '+2%' },
    approvedToday: { count: 450, change: '+8%' },
    totalFeedback: { count: 1208, change: '+5%' }
};

type FilterType = 'all' | 'pending' | 'reported';

const FeedbackModeration: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(mockFeedbacks[0]);
    const [internalNote, setInternalNote] = useState('');

    // Filter feedbacks based on search and filter
    const filteredFeedbacks = mockFeedbacks.filter(feedback => {
        const matchesSearch = feedback.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feedback.user.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeFilter === 'all') return matchesSearch;
        if (activeFilter === 'pending') return matchesSearch && feedback.status === 'pending';
        if (activeFilter === 'reported') return matchesSearch && feedback.status === 'reported';
        return matchesSearch;
    });

    const getStatusBadge = (status: Feedback['status']) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', label: 'Chờ duyệt' },
            reviewed: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', label: 'Đã xem' },
            reported: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', label: 'Đã báo cáo' },
            approved: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', label: 'Đã duyệt' }
        };
        const config = statusConfig[status];
        return (
            <span className={`${config.bg} ${config.text} px-2 py-1 rounded text-xs font-medium border ${config.border}`}>
                {config.label}
            </span>
        );
    };

    const handleApprove = (id: string) => {
        console.log('Approve feedback:', id);
        // TODO: API call to approve feedback
    };

    const handleReject = (id: string) => {
        console.log('Reject feedback:', id);
        // TODO: API call to reject feedback
    };

    const handleEdit = (id: string) => {
        console.log('Edit feedback:', id);
        // TODO: Open edit modal
    };

    return (
        <AdminLayout
            title="Kiểm Duyệt Phản Hồi & Bình Luận"
            icon="verified_user"
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Tạo báo cáo
                </button>
            }
        >
            <div className="flex gap-6 h-full">
                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Header Banner */}
                    <div
                        className="rounded-xl overflow-hidden relative min-h-[160px] flex items-end"
                        style={{
                            backgroundImage: 'linear-gradient(0deg, rgba(17, 20, 24, 0.9) 0%, rgba(17, 20, 24, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBbTmWL5RAD_KJmmvxd9ATMUYaiAXoJ8WjuzBS2BmLP7OQg8H6mVYWWOipKYycPUm4TEexTsfVLlw1XDeBUII2PfloWrCcHijS0UIKIMntsLoQJxdzV5wOCAi4tWABrU0Zg8zbjzEbM4JFpNcd3eB3c6KLs64OLri4SKCgpBaso52jRZnzZuVitjcYphuFe4DcLVU4j8geCqyKycMwmNhNzT8Ur0k6tkXwkMrYj7js6IbBh18mI2sVCHWB3JywaNlIVUlH6hjlcgfs")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div className="p-6 w-full">
                            <h3 className="text-2xl font-bold text-white mb-2">Trung tâm Kiểm duyệt</h3>
                            <p className="text-[#9dabb9] text-sm max-w-2xl">
                                Quản lý và kiểm soát chất lượng nội dung từ cộng đồng người học và giảng viên để đảm bảo môi trường học tập an toàn.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#1a222a] border border-[#283039] p-5 rounded-xl flex flex-col gap-1">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                                    <span className="material-symbols-outlined">pending</span>
                                </div>
                                <span className="text-[#0bda5b] text-xs font-medium bg-[#0bda5b]/10 px-2 py-1 rounded">
                                    {mockStats.pending.change}
                                </span>
                            </div>
                            <p className="text-[#9dabb9] text-sm">Chờ xử lý</p>
                            <p className="text-2xl font-bold text-white">{mockStats.pending.count}</p>
                        </div>
                        <div className="bg-[#1a222a] border border-[#283039] p-5 rounded-xl flex flex-col gap-1">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                                    <span className="material-symbols-outlined">flag</span>
                                </div>
                                <span className="text-[#0bda5b] text-xs font-medium bg-[#0bda5b]/10 px-2 py-1 rounded">
                                    {mockStats.reported.change}
                                </span>
                            </div>
                            <p className="text-[#9dabb9] text-sm">Đã báo cáo</p>
                            <p className="text-2xl font-bold text-white">{mockStats.reported.count}</p>
                        </div>
                        <div className="bg-[#1a222a] border border-[#283039] p-5 rounded-xl flex flex-col gap-1">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <span className="text-[#0bda5b] text-xs font-medium bg-[#0bda5b]/10 px-2 py-1 rounded">
                                    {mockStats.approvedToday.change}
                                </span>
                            </div>
                            <p className="text-[#9dabb9] text-sm">Đã duyệt hôm nay</p>
                            <p className="text-2xl font-bold text-white">{mockStats.approvedToday.count}</p>
                        </div>
                        <div className="bg-[#1a222a] border border-[#283039] p-5 rounded-xl flex flex-col gap-1">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                                    <span className="material-symbols-outlined">forum</span>
                                </div>
                                <span className="text-[#0bda5b] text-xs font-medium bg-[#0bda5b]/10 px-2 py-1 rounded">
                                    {mockStats.totalFeedback.change}
                                </span>
                            </div>
                            <p className="text-[#9dabb9] text-sm">Tổng phản hồi</p>
                            <p className="text-2xl font-bold text-white">{mockStats.totalFeedback.count.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-[#9dabb9]">search</span>
                            </div>
                            <input
                                type="text"
                                className="w-full bg-[#1a222a] border border-[#283039] text-white text-sm rounded-lg focus:ring-primary focus:border-primary block pl-10 p-2.5 placeholder-[#9dabb9] transition-all"
                                placeholder="Tìm kiếm theo ID, nội dung hoặc tên người dùng..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeFilter === 'all'
                                        ? 'bg-primary text-white'
                                        : 'bg-[#283039] text-[#9dabb9] hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">list</span>
                                Tất cả
                            </button>
                            <button
                                onClick={() => setActiveFilter('pending')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeFilter === 'pending'
                                        ? 'bg-primary text-white'
                                        : 'bg-[#283039] text-[#9dabb9] hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                Chờ duyệt
                            </button>
                            <button
                                onClick={() => setActiveFilter('reported')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${activeFilter === 'reported'
                                        ? 'bg-primary text-white'
                                        : 'bg-[#283039] text-[#9dabb9] hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">flag</span>
                                Đã báo cáo
                            </button>
                            <button className="bg-[#283039] text-[#9dabb9] hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                Bộ lọc khác
                            </button>
                        </div>
                    </div>

                    {/* Content Table */}
                    <div className="bg-[#1a222a] border border-[#283039] rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-[#9dabb9] uppercase bg-[#283039] border-b border-[#3b4754]">
                                    <tr>
                                        <th className="px-6 py-4 font-medium" scope="col">Người dùng</th>
                                        <th className="px-6 py-4 font-medium" scope="col">Nội dung</th>
                                        <th className="px-6 py-4 font-medium" scope="col">Ngữ cảnh</th>
                                        <th className="px-6 py-4 font-medium" scope="col">Trạng thái</th>
                                        <th className="px-6 py-4 font-medium" scope="col">Thời gian</th>
                                        <th className="px-6 py-4 font-medium text-right" scope="col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#283039]">
                                    {filteredFeedbacks.map((feedback) => (
                                        <tr
                                            key={feedback.id}
                                            className={`bg-[#1a222a] hover:bg-[#283039]/50 transition-colors group cursor-pointer ${feedback.isFlagged ? 'border-l-2 border-l-red-500' : ''
                                                }`}
                                            onClick={() => setSelectedFeedback(feedback)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="bg-cover bg-center rounded-full size-8 shrink-0"
                                                        style={{ backgroundImage: `url("${feedback.user.avatar}")` }}
                                                    />
                                                    <div>
                                                        <div className="text-white font-medium">{feedback.user.name}</div>
                                                        <div className="text-[#9dabb9] text-xs">
                                                            {feedback.user.role === 'learner' ? 'Học viên' : 'Giảng viên'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-[300px]">
                                                <p className={`truncate ${feedback.isFlagged ? 'text-red-300 italic' : 'text-[#e2e8f0]'}`}>
                                                    {feedback.content}
                                                </p>
                                                {feedback.aiAnalysis && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${feedback.aiAnalysis.type === 'toxic'
                                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                            }`}>
                                                            <span className="material-symbols-outlined text-[10px]">
                                                                {feedback.aiAnalysis.type === 'toxic' ? 'warning' : 'smart_toy'}
                                                            </span>
                                                            {feedback.aiAnalysis.label}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-[#9dabb9]">{feedback.context}</td>
                                            <td className="px-6 py-4">{getStatusBadge(feedback.status)}</td>
                                            <td className="px-6 py-4 text-[#9dabb9]">{feedback.timestamp}</td>
                                            <td className="px-6 py-4 text-right">
                                                {feedback.status === 'reported' ? (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleApprove(feedback.id); }}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-lg shadow-red-500/20"
                                                    >
                                                        Xử lý ngay
                                                    </button>
                                                ) : feedback.status === 'approved' ? (
                                                    <span className="text-[#9dabb9] text-sm">Đã xử lý bởi Admin</span>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(feedback.id); }}
                                                            className="bg-[#283039] hover:bg-[#3b4754] text-[#9dabb9] hover:text-white p-1.5 rounded-lg transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleReject(feedback.id); }}
                                                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-1.5 rounded-lg border border-red-500/20 transition-colors"
                                                            title="Từ chối"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleApprove(feedback.id); }}
                                                            className="bg-primary hover:bg-primary/80 text-white p-1.5 rounded-lg shadow-lg shadow-primary/20 transition-colors"
                                                            title="Chấp thuận"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">check</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-[#283039] px-6 py-4 border-t border-[#3b4754] flex items-center justify-between">
                            <span className="text-sm text-[#9dabb9]">
                                Hiển thị <span className="font-medium text-white">1-{filteredFeedbacks.length}</span> trong{' '}
                                <span className="font-medium text-white">{mockStats.pending.count}</span> kết quả
                            </span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-[#1a222a] border border-[#3b4754] rounded text-[#9dabb9] hover:text-white hover:border-[#9dabb9] disabled:opacity-50 text-sm">
                                    Trước
                                </button>
                                <button className="px-3 py-1 bg-[#1a222a] border border-[#3b4754] rounded text-[#9dabb9] hover:text-white hover:border-[#9dabb9] text-sm">
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Panel - Detail View */}
                {selectedFeedback && (
                    <div className="w-[380px] bg-[#1a222a] border border-[#283039] rounded-xl hidden 2xl:flex flex-col overflow-hidden shrink-0">
                        <div className="p-6 border-b border-[#283039]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Chi tiết phản hồi</h3>
                                <button
                                    onClick={() => setSelectedFeedback(null)}
                                    className="text-[#9dabb9] hover:text-white"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className="bg-cover bg-center rounded-full size-12"
                                    style={{ backgroundImage: `url("${selectedFeedback.user.avatar}")` }}
                                />
                                <div>
                                    <h4 className="text-white font-bold text-lg">{selectedFeedback.user.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#9dabb9] text-sm">
                                            {selectedFeedback.user.role === 'learner' ? 'Học viên' : 'Giảng viên'}
                                        </span>
                                        <span className="size-1 bg-[#9dabb9] rounded-full" />
                                        <span className="text-[#9dabb9] text-sm">ID: #{selectedFeedback.id}921</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                                    <span className="material-symbols-outlined text-[14px]">verified</span>
                                    Trust Score: 98%
                                </div>
                                <div className="flex items-center gap-1 text-xs text-[#9dabb9] bg-[#283039] px-2 py-1 rounded">
                                    <span className="material-symbols-outlined text-[14px]">history</span>
                                    Tham gia: 2 năm
                                </div>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
                            <div>
                                <label className="text-[#9dabb9] text-xs uppercase font-bold mb-2 block tracking-wider">
                                    Trạng thái
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-md text-sm font-medium border border-yellow-500/20 flex items-center gap-2 w-fit">
                                        <span className="size-2 bg-yellow-500 rounded-full animate-pulse" />
                                        {selectedFeedback.status === 'pending' ? 'Chờ duyệt' :
                                            selectedFeedback.status === 'approved' ? 'Đã duyệt' :
                                                selectedFeedback.status === 'reported' ? 'Đã báo cáo' : 'Đã xem'}
                                    </span>
                                    <span className="text-[#9dabb9] text-sm ml-auto">{selectedFeedback.timestamp}</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-[#9dabb9] text-xs uppercase font-bold mb-2 block tracking-wider">
                                    Nội dung gốc
                                </label>
                                <div className="bg-[#283039] p-4 rounded-lg border border-[#3b4754]">
                                    <p className="text-white text-base leading-relaxed">"{selectedFeedback.content}"</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-[#9dabb9] text-xs uppercase font-bold mb-2 block tracking-wider">
                                    Ngữ cảnh
                                </label>
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#3b4754] bg-[#111418]">
                                    <div className="bg-blue-500/20 p-2 rounded text-blue-500">
                                        <span className="material-symbols-outlined">book</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">{selectedFeedback.context}</p>
                                        <p className="text-[#9dabb9] text-xs">Section: Practice</p>
                                    </div>
                                    <button className="ml-auto text-primary hover:text-white text-sm">Xem</button>
                                </div>
                            </div>

                            {selectedFeedback.aiAnalysis && (
                                <div>
                                    <label className="text-[#9dabb9] text-xs uppercase font-bold mb-2 block tracking-wider">
                                        AI Gợi ý
                                    </label>
                                    <div className={`p-3 rounded-lg border ${selectedFeedback.aiAnalysis.type === 'toxic'
                                            ? 'bg-red-500/10 border-red-500/20'
                                            : 'bg-purple-500/10 border-purple-500/20'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`material-symbols-outlined text-[18px] ${selectedFeedback.aiAnalysis.type === 'toxic' ? 'text-red-400' : 'text-purple-400'
                                                }`}>
                                                psychology
                                            </span>
                                            <span className={`font-medium text-sm ${selectedFeedback.aiAnalysis.type === 'toxic' ? 'text-red-400' : 'text-purple-400'
                                                }`}>
                                                Phân tích cảm xúc
                                            </span>
                                        </div>
                                        <p className="text-[#e2e8f0] text-sm">
                                            {selectedFeedback.aiAnalysis.type === 'toxic'
                                                ? 'Phát hiện nội dung không phù hợp. Gợi ý: Từ chối và cảnh báo người dùng.'
                                                : 'Bình luận mang tính xây dựng. Không phát hiện từ ngữ thù địch. Gợi ý: Chấp thuận.'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-[#9dabb9] text-xs uppercase font-bold mb-2 block tracking-wider">
                                    Ghi chú nội bộ
                                </label>
                                <textarea
                                    className="w-full bg-[#111418] border border-[#3b4754] rounded-lg p-3 text-white text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-24"
                                    placeholder="Thêm ghi chú cho admin khác..."
                                    value={internalNote}
                                    onChange={(e) => setInternalNote(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-[#283039] bg-[#1a222a]">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <button
                                    onClick={() => handleEdit(selectedFeedback.id)}
                                    className="flex items-center justify-center gap-2 bg-[#283039] hover:bg-[#3b4754] text-white py-2.5 rounded-lg font-medium transition-colors border border-[#3b4754]"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleReject(selectedFeedback.id)}
                                    className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 rounded-lg font-medium transition-colors border border-red-500/20"
                                >
                                    <span className="material-symbols-outlined text-[20px]">block</span>
                                    Từ chối
                                </button>
                            </div>
                            <button
                                onClick={() => handleApprove(selectedFeedback.id)}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-bold text-base shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">check_circle</span>
                                Chấp thuận &amp; Xuất bản
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default FeedbackModeration;

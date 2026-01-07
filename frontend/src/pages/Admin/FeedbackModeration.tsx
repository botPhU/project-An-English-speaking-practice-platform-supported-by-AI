import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';

interface Feedback {
    id: string;
    user: {
        name: string;
        role: string;
        avatar?: string;
    };
    content: string;
    context: string;
    status: 'pending' | 'approved' | 'rejected' | 'helpful';
    aiAnalysis?: { type: string; label: string };
    timestamp: string;
}

interface FeedbackStats {
    pending: { count: number; change: string };
    reported: { count: number; change: string };
    approvedToday: { count: number; change: string };
    totalFeedback: { count: number; change: string };
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected' | 'helpful';

const FeedbackModeration: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [stats, setStats] = useState<FeedbackStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getFeedbacks();

            const feedbackData = response.data.feedbacks || response.data || [];
            const mappedFeedbacks = feedbackData.map((fb: any) => ({
                id: fb.id?.toString(),
                user: {
                    name: fb.user?.name || fb.user_name || 'Unknown',
                    role: fb.user?.role || fb.user_role || 'learner',
                    avatar: fb.user?.avatar || fb.avatar
                },
                content: fb.content || fb.message,
                context: fb.context || fb.lesson || 'General',
                status: fb.status || 'pending',
                aiAnalysis: fb.ai_analysis ? { type: fb.ai_analysis.type, label: fb.ai_analysis.label } : undefined,
                timestamp: fb.timestamp || fb.created_at || 'N/A'
            }));

            setFeedbacks(mappedFeedbacks);

            const pendingCount = mappedFeedbacks.filter((f: Feedback) => f.status === 'pending').length;
            setStats({
                pending: { count: pendingCount, change: '+12% so với hôm qua' },
                reported: { count: response.data.reported_count || 5, change: '+2% tuần này' },
                approvedToday: { count: response.data.approved_today || 450, change: '+8% tháng này' },
                totalFeedback: { count: mappedFeedbacks.length, change: '+5% tháng này' }
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setError('Không thể tải phản hồi');
            setStats({
                pending: { count: 0, change: 'Chưa có dữ liệu' },
                reported: { count: 0, change: 'Chưa có dữ liệu' },
                approvedToday: { count: 0, change: 'Chưa có dữ liệu' },
                totalFeedback: { count: 0, change: 'Chưa có dữ liệu' }
            });
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (id: string, action: 'approve' | 'reject') => {
        try {
            await adminService.moderateFeedback(id, action);
            setFeedbacks(prev => prev.map(fb =>
                fb.id === id ? { ...fb, status: action === 'approve' ? 'approved' : 'rejected' } : fb
            ));
        } catch (err) {
            console.error('Error moderating feedback:', err);
        }
    };

    const filteredFeedbacks = feedbacks.filter(fb => {
        const matchesSearch = fb.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fb.user.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && fb.status === statusFilter;
    });

    const getStatusBadge = (status: Feedback['status']) => {
        const badges = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            approved: 'bg-green-500/20 text-green-400',
            rejected: 'bg-red-500/20 text-red-400',
            helpful: 'bg-blue-500/20 text-blue-400'
        };
        const labels = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối', helpful: 'Hữu ích' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>{labels[status]}</span>;
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <AdminLayout
            title="Kiểm Duyệt Phản Hồi"
            subtitle="Quản lý ý kiến từ người học và giáo viên"
            icon="rate_review"
            actions={
                <div className="flex gap-3">
                    <button className="bg-[#283039] hover:bg-[#3e4854] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Xuất báo cáo
                    </button>
                </div>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Chờ duyệt</p>
                            <span className="material-symbols-outlined text-yellow-500 bg-yellow-500/10 p-1 rounded-md text-[20px]">pending</span>
                        </div>
                        {loading ? <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div> : (
                            <>
                                <p className="text-white text-3xl font-bold">{stats?.pending.count}</p>
                                <p className="text-yellow-500 text-xs font-medium">{stats?.pending.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Báo cáo vi phạm</p>
                            <span className="material-symbols-outlined text-red-500 bg-red-500/10 p-1 rounded-md text-[20px]">flag</span>
                        </div>
                        {loading ? <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div> : (
                            <>
                                <p className="text-white text-3xl font-bold">{stats?.reported.count}</p>
                                <p className="text-red-500 text-xs font-medium">{stats?.reported.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đã duyệt hôm nay</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">check_circle</span>
                        </div>
                        {loading ? <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div> : (
                            <>
                                <p className="text-white text-3xl font-bold">{stats?.approvedToday.count}</p>
                                <p className="text-[#0bda5b] text-xs font-medium">{stats?.approvedToday.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng phản hồi</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">forum</span>
                        </div>
                        {loading ? <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div> : (
                            <>
                                <p className="text-white text-3xl font-bold">{stats?.totalFeedback.count}</p>
                                <p className="text-primary text-xs font-medium">{stats?.totalFeedback.change}</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4 bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">search</span>
                        <input
                            type="text"
                            className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Tìm kiếm phản hồi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        className="bg-[#1a222a] border border-[#3b4754] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">Tất cả</option>
                        <option value="pending">Chờ duyệt</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="rejected">Từ chối</option>
                    </select>
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="rounded-xl bg-[#283039] border border-[#3b4754] p-5">
                                <div className="flex items-start gap-4">
                                    <div className="size-10 rounded-full bg-[#3e4854] animate-pulse"></div>
                                    <div className="flex-1 space-y-3">
                                        <div className="h-4 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                        <div className="h-16 w-full bg-[#3e4854] animate-pulse rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredFeedbacks.length === 0 ? (
                        <div className="text-center text-[#9dabb9] py-8">
                            {error || 'Không tìm thấy phản hồi nào'}
                        </div>
                    ) : (
                        filteredFeedbacks.map((fb) => (
                            <div key={fb.id} className="rounded-xl bg-[#283039] border border-[#3b4754] p-5 hover:border-primary/30 transition-colors">
                                <div className="flex items-start gap-4">
                                    {fb.user.avatar ? (
                                        <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${fb.user.avatar}")` }} />
                                    ) : (
                                        <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                            {getInitials(fb.user.name)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-medium text-white">{fb.user.name}</h4>
                                            <span className="text-xs text-[#9dabb9]">{fb.user.role}</span>
                                            {getStatusBadge(fb.status)}
                                            {fb.aiAnalysis && (
                                                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{fb.aiAnalysis.label}</span>
                                            )}
                                        </div>
                                        <p className="text-[#9dabb9] text-sm mb-2">{fb.content}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[#9dabb9]">{fb.context} • {fb.timestamp}</span>
                                            {fb.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleModerate(fb.id, 'reject')} className="px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                                                        Từ chối
                                                    </button>
                                                    <button onClick={() => handleModerate(fb.id, 'approve')} className="px-3 py-1.5 text-xs font-medium text-[#0bda5b] hover:bg-[#0bda5b]/20 rounded-lg transition-colors">
                                                        Duyệt
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default FeedbackModeration;

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';

interface SupportTicket {
    id: string;
    user: {
        name: string;
        avatar?: string;
        plan: string;
    };
    subject: string;
    preview: string;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    createdAt: string;
}

interface SupportStats {
    newRequests: { count: number; change: string };
    processing: { count: number; change: string };
    pendingFeedback: { count: number; change: string; isNegative?: boolean };
    resolved: { count: number; change: string; isNeutral?: boolean };
}

type StatusFilter = 'all' | 'new' | 'in_progress' | 'resolved' | 'closed';

const LearnerSupport: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [stats, setStats] = useState<SupportStats | null>(null);
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
            const [ticketsResponse, statsResponse] = await Promise.all([
                adminService.getSupportTickets(),
                adminService.getSupportStats()
            ]);

            const ticketData = ticketsResponse.data.tickets || ticketsResponse.data || [];
            const mappedTickets = ticketData.map((ticket: any) => ({
                id: ticket.id?.toString() || `#${ticket.ticket_id}`,
                user: {
                    name: ticket.user?.name || ticket.user_name || 'Unknown',
                    avatar: ticket.user?.avatar || ticket.avatar,
                    plan: ticket.user?.plan || ticket.subscription || 'Free'
                },
                subject: ticket.subject || ticket.title,
                preview: ticket.preview || ticket.description?.slice(0, 100) || '',
                status: ticket.status || 'new',
                createdAt: ticket.created_at || ticket.createdAt || 'N/A'
            }));

            setTickets(mappedTickets);

            const apiStats = statsResponse.data;
            setStats({
                newRequests: { count: apiStats.new_count || 12, change: apiStats.new_change || '+20% so với hôm qua' },
                processing: { count: apiStats.in_progress_count || 45, change: apiStats.processing_change || '+5% tuần này' },
                pendingFeedback: { count: apiStats.pending_count || 8, change: 'Chậm trễ nhẹ', isNegative: true },
                resolved: { count: apiStats.resolved_count || 1203, change: 'Tổng cộng tháng này', isNeutral: true }
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError('Không thể tải yêu cầu hỗ trợ');
            setStats({
                newRequests: { count: 0, change: 'Chưa có dữ liệu' },
                processing: { count: 0, change: 'Chưa có dữ liệu' },
                pendingFeedback: { count: 0, change: 'Chưa có dữ liệu', isNegative: false },
                resolved: { count: 0, change: 'Chưa có dữ liệu', isNeutral: true }
            });
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && ticket.status === statusFilter;
    });

    const getStatusBadge = (status: SupportTicket['status']) => {
        const badges = {
            new: 'bg-blue-500/20 text-blue-400',
            in_progress: 'bg-yellow-500/20 text-yellow-400',
            resolved: 'bg-green-500/20 text-green-400',
            closed: 'bg-gray-500/20 text-gray-400'
        };
        const labels = { new: 'Mới', in_progress: 'Đang xử lý', resolved: 'Đã giải quyết', closed: 'Đã đóng' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>{labels[status]}</span>;
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <AdminLayout
            title="Hỗ Trợ Người Học"
            subtitle="Quản lý yêu cầu hỗ trợ từ học viên"
            icon="support_agent"
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tạo ticket
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Yêu cầu mới</p>
                            <span className="material-symbols-outlined text-blue-500 bg-blue-500/10 p-1 rounded-md text-[20px]">add_circle</span>
                        </div>
                        {loading ? <div className="h-9 w-12 bg-[#3e4854] animate-pulse rounded"></div> : (
                            <>
                                <p className="text-white text-3xl font-bold">{stats?.newRequests.count}</p>
                                <p className="text-blue-400 text-xs font-medium">{stats?.newRequests.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đang xử lý</p>
                            <span className="material-symbols-outlined text-yellow-500 bg-yellow-500/10 p-1 rounded-md text-[20px]">pending</span>
                        </div>
                        {loading ? <div className="h-9 w-12 bg-[#3e4854] animate-pulse rounded"></div> : (
                            <>
                                <p className="text-white text-3xl font-bold">{stats?.processing.count}</p>
                                <p className="text-yellow-400 text-xs font-medium">{stats?.processing.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Chờ phản hồi</p>
                            <span className="material-symbols-outlined text-orange-500 bg-orange-500/10 p-1 rounded-md text-[20px]">schedule</span>
                        </div>
                        {loading ? <div className="h-9 w-12 bg-[#3e4854] animate-pulse rounded"></div> : (
                            <>
                                <p className="text-white text-3xl font-bold">{stats?.pendingFeedback.count}</p>
                                <p className="text-orange-400 text-xs font-medium">{stats?.pendingFeedback.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đã giải quyết</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">check_circle</span>
                        </div>
                        {loading ? <div className="h-9 w-20 bg-[#3e4854] animate-pulse rounded"></div> : (
                            <>
                                <p className="text-white text-3xl font-bold">{stats?.resolved.count.toLocaleString()}</p>
                                <p className="text-[#9dabb9] text-xs font-medium">{stats?.resolved.change}</p>
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
                            placeholder="Tìm kiếm ticket..."
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
                        <option value="new">Mới</option>
                        <option value="in_progress">Đang xử lý</option>
                        <option value="resolved">Đã giải quyết</option>
                        <option value="closed">Đã đóng</option>
                    </select>
                </div>

                {/* Tickets Table */}
                <div className="rounded-xl border border-[#3b4754] bg-[#1a222a] overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#283039] border-b border-[#3b4754]">
                            <tr>
                                <th className="p-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">ID</th>
                                <th className="p-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Người dùng</th>
                                <th className="p-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Chủ đề</th>
                                <th className="p-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Trạng thái</th>
                                <th className="p-4 text-left text-xs font-semibold text-[#9dabb9] uppercase">Ngày tạo</th>
                                <th className="p-4 text-right text-xs font-semibold text-[#9dabb9] uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3b4754]">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-4"><div className="h-4 w-16 bg-[#3e4854] animate-pulse rounded"></div></td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-[#3e4854] animate-pulse"></div>
                                                <div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                                            </div>
                                        </td>
                                        <td className="p-4"><div className="h-4 w-48 bg-[#3e4854] animate-pulse rounded"></div></td>
                                        <td className="p-4"><div className="h-6 w-20 bg-[#3e4854] animate-pulse rounded-full"></div></td>
                                        <td className="p-4"><div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div></td>
                                        <td className="p-4"><div className="h-8 w-16 bg-[#3e4854] animate-pulse rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#9dabb9]">
                                        {error || 'Không tìm thấy yêu cầu hỗ trợ nào'}
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="group hover:bg-[#283039] transition-colors">
                                        <td className="p-4 text-primary font-medium">{ticket.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {ticket.user.avatar ? (
                                                    <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${ticket.user.avatar}")` }} />
                                                ) : (
                                                    <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                                        {getInitials(ticket.user.name)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-white">{ticket.user.name}</p>
                                                    <p className="text-xs text-[#9dabb9]">{ticket.user.plan}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-white font-medium">{ticket.subject}</p>
                                            <p className="text-xs text-[#9dabb9] truncate max-w-[300px]">{ticket.preview}</p>
                                        </td>
                                        <td className="p-4">{getStatusBadge(ticket.status)}</td>
                                        <td className="p-4 text-[#9dabb9]">{ticket.createdAt}</td>
                                        <td className="p-4 text-right">
                                            <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100">
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default LearnerSupport;

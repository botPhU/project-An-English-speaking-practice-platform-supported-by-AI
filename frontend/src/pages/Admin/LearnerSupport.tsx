import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';

// Types
interface SupportTicket {
    id: string;
    user: {
        name: string;
        avatar: string;
        plan: string;
    };
    subject: string;
    preview: string;
    status: 'new' | 'processing' | 'pending' | 'resolved';
    assignee?: {
        name: string;
        initials: string;
        color: string;
    };
    createdAt: string;
}

// Mock data - sẽ được thay thế bằng API call
const mockTickets: SupportTicket[] = [
    {
        id: '#2024',
        user: {
            name: 'Nguyễn Văn A',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmIYz43nvRKjaXa_Uc9AJMyF4BK2ktSRTOuR15uTwMahlBosgYyZtt_qvYO1LJbh-0tiPtSb3Ene5HPOVoz4FvBPcXLj_vIWuYlAORj-yPd4itBixfmTbYwgOctpEY9jf--P8OalzkVzIvZARPxvVTUsVGfZYedK12WAzCcn2Lxe4HWhT2Pa_2HBoFhSbmy8d_HCCJHRSX8mwtw8SvS_tuyf1TvyUYg7pM3OzwANJ8lRrkGjYwXGFUwgOmOzpf_ouFyUzTVVfHSn8',
            plan: 'Premium Student'
        },
        subject: 'Lỗi kết nối AI khi luyện nói',
        preview: 'Tôi không thể kết nối với trợ lý ảo...',
        status: 'new',
        createdAt: '20/10/2023'
    },
    {
        id: '#2023',
        user: {
            name: 'Trần Thị B',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzuIo9vR1wFAz38nKj8F0AuSZlBbloNu3mJCRnp42u69fYgheGxW3jk7tO38K9v4punJ7hc_NNL7XZzSxnXZrMMpw6tQcaC7Nl5DMGATMsQOnd9NbSAKQtaMiFrkMTRgvH9tTO3_B-X8DzgtHpqlUJOESA3kL7MQCEPY3jYkff5xDI3m8cAA6qIZTDMohyUZKqphT3jEw17h2q81T2MqJIS7eYo8ynMNfS-Y48aDgy8N83syQ2CTEJO_xdDyt9Ips2axwJttmwgws',
            plan: 'Free Plan'
        },
        subject: 'Gia hạn gói học IELTS',
        preview: 'Làm sao để thanh toán qua MoMo?',
        status: 'processing',
        assignee: { name: 'Admin Hùng', initials: 'AH', color: 'bg-purple-500' },
        createdAt: '19/10/2023'
    },
    {
        id: '#2021',
        user: {
            name: 'Phạm Minh D',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdqduTjzhsp_AK0Fh9fDOCrt63IOinAn1gU30Qx-NL7sPWvJhOSbz_VwAfOUjnGrb7zHhC1eVLITV8hec0YunK68c1MlW6FKHeJeJ5NAGqaNQOZ6awjc-3FBOZIpXJOS2FbfRl3eEuPKjRwHqOGp6iirQFG8KQ0DX3-wf4KSYPWvITlHVHHzA6B9NHhKfOaTrMk_NNfCo8-Wdn1YaWfLiJBOm8md9kmcI8uwS_FT0ZUPTHN3jOxv42Ig99fDT4na4L3v3rYrIPTAU',
            plan: 'Standard Plan'
        },
        subject: 'Lỗi hiển thị bài tập #45',
        preview: 'Hình ảnh không tải được...',
        status: 'pending',
        assignee: { name: 'Kỹ thuật', initials: 'KT', color: 'bg-teal-500' },
        createdAt: '18/10/2023'
    },
    {
        id: '#2020',
        user: {
            name: 'Hoàng Anh E',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCudK_uvceJOiB02GiQo1jVJuiAUilVxVK7nrhidhJRy4NOzumXVzfhxpMO_MraxnjUtdXoeVA6DYOkOcMTLlisxNQOXFEvGy3PtilELskpg_WFX1opr09OQY3B6tEBW5k9YnyVzTkdGtWCGObbKgM4OZVnHftaPoWFpjNWXSrWBWlGPjcTcPhO06RTdCVTq6faliFaN7RWOSXgyzuvRYhzuV_PFvK-zqAFxFTs3DR5vEJfKBltdBu-uCDgq9PTKQDA216O729h188',
            plan: 'Standard Plan'
        },
        subject: 'Câu hỏi về thì hiện tại hoàn thành',
        preview: 'Đã giải thích chi tiết...',
        status: 'resolved',
        assignee: { name: 'GV AI', initials: 'AI', color: 'bg-indigo-500' },
        createdAt: '17/10/2023'
    },
    {
        id: '#2019',
        user: {
            name: 'Lê Văn C',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Q_3QFv50C65tHSL6uNIL9qvupvbf5nWAA5Ugo-fhobVioZ--PQsR-5dSLSxrNTfQA19xkUFq0WT_kNGJ49yZIZhu7D1XWvypkTHGPkE05V9Uq3FVOHSG-vwFtPiwq0gfQmK5-ONSGBDK91emvp5wKPxkiUsgJhaBk_PzQZhwbO6OeDfDmmMwNwRKldHjf37LE61VqPe5eEnoatsf5dtxwtuQA301-btDknCJB1CSAo0ds0WZH-QlvDs05IHpIsPZLxyZGnAhD5Y',
            plan: 'Premium Student'
        },
        subject: 'Góp ý về giao diện bài học',
        preview: 'Nút bấm hơi nhỏ trên mobile...',
        status: 'resolved',
        assignee: { name: 'Admin Lan', initials: 'AL', color: 'bg-pink-500' },
        createdAt: '16/10/2023'
    }
];

const mockStats = {
    newRequests: { count: 12, change: '+20% so với hôm qua' },
    processing: { count: 45, change: '+5% tuần này' },
    pendingFeedback: { count: 8, change: 'Chậm trễ nhẹ', isNegative: true },
    resolved: { count: 1203, change: 'Tổng cộng tháng này', isNeutral: true }
};

type StatusFilter = 'all' | 'new' | 'processing' | 'pending' | 'resolved';

const LearnerSupport: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    // Filter tickets
    const filteredTickets = mockTickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && ticket.status === statusFilter;
    });

    const getStatusBadge = (status: SupportTicket['status']) => {
        const config = {
            new: { bg: 'bg-primary/20', text: 'text-primary', ring: 'ring-primary/30', label: 'Mới' },
            processing: { bg: 'bg-blue-400/20', text: 'text-blue-400', ring: 'ring-blue-400/30', label: 'Đang xử lý' },
            pending: { bg: 'bg-[#fa6238]/20', text: 'text-[#fa6238]', ring: 'ring-[#fa6238]/30', label: 'Chờ phản hồi' },
            resolved: { bg: 'bg-[#0bda5b]/20', text: 'text-[#0bda5b]', ring: 'ring-[#0bda5b]/30', label: 'Đã giải quyết' }
        };
        const c = config[status];
        return (
            <span className={`inline-flex items-center rounded-full ${c.bg} px-2.5 py-0.5 text-xs font-medium ${c.text} ring-1 ring-inset ${c.ring}`}>
                {c.label}
            </span>
        );
    };

    const handleViewTicket = (id: string) => {
        console.log('View ticket:', id);
        // TODO: Open ticket detail modal
    };

    const handleAssignTicket = (id: string) => {
        console.log('Assign ticket:', id);
        // TODO: Open assign dialog
    };

    return (
        <AdminLayout
            title="Hỗ Trợ Người Học"
            subtitle="Quản lý các yêu cầu và phản hồi học viên"
            icon="support_agent"
            actions={
                <>
                    <button className="bg-[#283039] hover:bg-[#3b4754] border border-[#3b4754] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Xuất Excel
                    </button>
                    <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Tạo vé hỗ trợ
                    </button>
                </>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Yêu cầu mới</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">
                                mark_email_unread
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{mockStats.newRequests.count}</p>
                        <div className="flex items-center gap-1 text-[#0bda5b] text-xs font-medium">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            <span>{mockStats.newRequests.change}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đang xử lý</p>
                            <span className="material-symbols-outlined text-blue-400 bg-blue-400/10 p-1 rounded-md text-[20px]">
                                pending_actions
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{mockStats.processing.count}</p>
                        <div className="flex items-center gap-1 text-[#0bda5b] text-xs font-medium">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            <span>{mockStats.processing.change}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Chờ phản hồi</p>
                            <span className="material-symbols-outlined text-[#fa6238] bg-[#fa6238]/10 p-1 rounded-md text-[20px]">
                                schedule
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{mockStats.pendingFeedback.count}</p>
                        <div className="flex items-center gap-1 text-[#fa6238] text-xs font-medium">
                            <span className="material-symbols-outlined text-[16px]">trending_down</span>
                            <span>{mockStats.pendingFeedback.change}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đã giải quyết</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">
                                check_circle
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{mockStats.resolved.count.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-[#9dabb9] text-xs font-medium">
                            <span>{mockStats.resolved.change}</span>
                        </div>
                    </div>
                </div>

                {/* Actions Bar (Search & Filter) */}
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="flex flex-1 w-full gap-4 flex-col md:flex-row">
                        <div className="relative flex-1 min-w-[240px]">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                search
                            </span>
                            <input
                                type="text"
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-[#9dabb9]/60"
                                placeholder="Tìm theo ID, tên người học hoặc nội dung..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative w-full md:w-48">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                filter_list
                            </span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="new">Mới</option>
                                <option value="processing">Đang xử lý</option>
                                <option value="pending">Chờ phản hồi</option>
                                <option value="resolved">Đã giải quyết</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="rounded-xl border border-[#3b4754] bg-[#1a222a] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#283039] border-b border-[#3b4754]">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[100px]">ID</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider min-w-[200px]">Người học</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider min-w-[250px]">Chủ đề</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[140px]">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider min-w-[180px]">Người phụ trách</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[140px]">Ngày tạo</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[120px] text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3b4754]">
                                {filteredTickets.map((ticket) => {
                                    const isResolved = ticket.status === 'resolved';
                                    return (
                                        <tr
                                            key={ticket.id}
                                            className={`group hover:bg-[#283039] transition-colors ${isResolved ? 'bg-[#1a222a]/50' : ''}`}
                                        >
                                            <td className="p-4 text-[#9dabb9] text-sm font-mono">{ticket.id}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`size-8 rounded-full bg-cover bg-center bg-gray-600 ${isResolved ? 'grayscale opacity-70' : ''}`}
                                                        style={{ backgroundImage: `url("${ticket.user.avatar}")` }}
                                                    />
                                                    <div className={isResolved ? 'opacity-70' : ''}>
                                                        <span className="text-white text-sm font-medium">{ticket.user.name}</span>
                                                        <span className="text-[#9dabb9] text-xs block">{ticket.user.plan}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className={`flex flex-col ${isResolved ? 'opacity-70' : ''}`}>
                                                    <span className="text-white text-sm font-medium truncate max-w-[250px]">{ticket.subject}</span>
                                                    <span className="text-[#9dabb9] text-xs truncate max-w-[250px]">{ticket.preview}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">{getStatusBadge(ticket.status)}</td>
                                            <td className="p-4">
                                                {ticket.assignee ? (
                                                    <div className={`flex items-center gap-2 ${isResolved ? 'opacity-70' : ''}`}>
                                                        <div className={`size-6 rounded-full ${ticket.assignee.color} flex items-center justify-center text-[10px] text-white font-bold`}>
                                                            {ticket.assignee.initials}
                                                        </div>
                                                        <span className="text-white text-sm">{ticket.assignee.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[#9dabb9] text-sm italic">-- Chưa gán --</span>
                                                )}
                                            </td>
                                            <td className={`p-4 text-[#9dabb9] text-sm ${isResolved ? 'opacity-70' : ''}`}>{ticket.createdAt}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleViewTicket(ticket.id)}
                                                        className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    {ticket.status === 'new' && (
                                                        <button
                                                            onClick={() => handleAssignTicket(ticket.id)}
                                                            className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                            title="Nhận xử lý"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">person_add</span>
                                                        </button>
                                                    )}
                                                    {ticket.status === 'processing' && (
                                                        <button
                                                            className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                            title="Phản hồi"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">reply</span>
                                                        </button>
                                                    )}
                                                    {ticket.status === 'pending' && (
                                                        <button
                                                            className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                            title="Gửi nhắc nhở"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                                                        </button>
                                                    )}
                                                    {ticket.status === 'resolved' && (
                                                        <button
                                                            className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                            title="Mở lại"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-[#3b4754] bg-[#1a222a] px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-[#9dabb9]">
                                    Hiển thị <span className="font-medium text-white">1</span> đến{' '}
                                    <span className="font-medium text-white">{filteredTickets.length}</span> trong số{' '}
                                    <span className="font-medium text-white">1268</span> kết quả
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                    <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                    </button>
                                    <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white">
                                        1
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                        2
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                        3
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9dabb9] ring-1 ring-inset ring-[#3b4754]">
                                        ...
                                    </span>
                                    <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                        10
                                    </button>
                                    <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default LearnerSupport;

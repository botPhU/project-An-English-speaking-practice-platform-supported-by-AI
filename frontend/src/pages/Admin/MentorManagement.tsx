import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';

// Types
interface Mentor {
    id: string;
    name: string;
    avatar: string;
    email: string;
    specialty: string;
    rating: number;
    students: number;
    status: 'active' | 'pending' | 'inactive';
    joinedDate: string;
}

// Mock data
const mockMentors: Mentor[] = [
    {
        id: '#MT001',
        name: 'Nguyễn Văn A',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmIYz43nvRKjaXa_Uc9AJMyF4BK2ktSRTOuR15uTwMahlBosgYyZtt_qvYO1LJbh-0tiPtSb3Ene5HPOVoz4FvBPcXLj_vIWuYlAORj-yPd4itBixfmTbYwgOctpEY9jf--P8OalzkVzIvZARPxvVTUsVGfZYedK12WAzCcn2Lxe4HWhT2Pa_2HBoFhSbmy8d_HCCJHRSX8mwtw8SvS_tuyf1TvyUYg7pM3OzwANJ8lRrkGjYwXGFUwgOmOzpf_ouFyUzTVVfHSn8',
        email: 'nguyenvana@aesp.edu.vn',
        specialty: 'IELTS Speaking',
        rating: 4.9,
        students: 156,
        status: 'active',
        joinedDate: '15/03/2023'
    },
    {
        id: '#MT002',
        name: 'Trần Thị B',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzuIo9vR1wFAz38nKj8F0AuSZlBbloNu3mJCRnp42u69fYgheGxW3jk7tO38K9v4punJ7hc_NNL7XZzSxnXZrMMpw6tQcaC7Nl5DMGATMsQOnd9NbSAKQtaMiFrkMTRgvH9tTO3_B-X8DzgtHpqlUJOESA3kL7MQCEPY3jYkff5xDI3m8cAA6qIZTDMohyUZKqphT3jEw17h2q81T2MqJIS7eYo8ynMNfS-Y48aDgy8N83syQ2CTEJO_xdDyt9Ips2axwJttmwgws',
        email: 'tranthib@aesp.edu.vn',
        specialty: 'Business English',
        rating: 4.8,
        students: 98,
        status: 'active',
        joinedDate: '22/05/2023'
    },
    {
        id: '#MT003',
        name: 'Phạm Minh C',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdqduTjzhsp_AK0Fh9fDOCrt63IOinAn1gU30Qx-NL7sPWvJhOSbz_VwAfOUjnGrb7zHhC1eVLITV8hec0YunK68c1MlW6FKHeJeJ5NAGqaNQOZ6awjc-3FBOZIpXJOS2FbfRl3eEuPKjRwHqOGp6iirQFG8KQ0DX3-wf4KSYPWvITlHVHHzA6B9NHhKfOaTrMk_NNfCo8-Wdn1YaWfLiJBOm8md9kmcI8uwS_FT0ZUPTHN3jOxv42Ig99fDT4na4L3v3rYrIPTAU',
        email: 'phamminhc@aesp.edu.vn',
        specialty: 'Pronunciation',
        rating: 4.7,
        students: 67,
        status: 'pending',
        joinedDate: '10/11/2024'
    },
    {
        id: '#MT004',
        name: 'Hoàng Anh D',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCudK_uvceJOiB02GiQo1jVJuiAUilVxVK7nrhidhJRy4NOzumXVzfhxpMO_MraxnjUtdXoeVA6DYOkOcMTLlisxNQOXFEvGy3PtilELskpg_WFX1opr09OQY3B6tEBW5k9YnyVzTkdGtWCGObbKgM4OZVnHftaPoWFpjNWXSrWBWlGPjcTcPhO06RTdCVTq6faliFaN7RWOSXgyzuvRYhzuV_PFvK-zqAFxFTs3DR5vEJfKBltdBu-uCDgq9PTKQDA216O729h188',
        email: 'hoanganhd@aesp.edu.vn',
        specialty: 'TOEIC',
        rating: 4.6,
        students: 45,
        status: 'inactive',
        joinedDate: '08/01/2023'
    },
    {
        id: '#MT005',
        name: 'Lê Văn E',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Q_3QFv50C65tHSL6uNIL9qvupvbf5nWAA5Ugo-fhobVioZ--PQsR-5dSLSxrNTfQA19xkUFq0WT_kNGJ49yZIZhu7D1XWvypkTHGPkE05V9Uq3FVOHSG-vwFtPiwq0gfQmK5-ONSGBDK91emvp5wKPxkiUsgJhaBk_PzQZhwbO6OeDfDmmMwNwRKldHjf37LE61VqPe5eEnoatsf5dtxwtuQA301-btDknCJB1CSAo0ds0WZH-QlvDs05IHpIsPZLxyZGnAhD5Y',
        email: 'levane@aesp.edu.vn',
        specialty: 'Daily Conversation',
        rating: 4.5,
        students: 89,
        status: 'active',
        joinedDate: '30/07/2023'
    }
];

const mockStats = {
    totalMentors: { count: 48, change: '+5 tháng này' },
    activeMentors: { count: 42, change: '87.5% hoạt động' },
    pendingApproval: { count: 3, change: 'Cần phê duyệt' },
    avgRating: { count: 4.7, change: 'Trung bình' }
};

type StatusFilter = 'all' | 'active' | 'pending' | 'inactive';

const MentorManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

    // Filter mentors
    const filteredMentors = mockMentors.filter(mentor => {
        const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && mentor.status === statusFilter;
    });

    const getStatusBadge = (status: Mentor['status']) => {
        const config = {
            active: { bg: 'bg-[#0bda5b]/20', text: 'text-[#0bda5b]', ring: 'ring-[#0bda5b]/30', label: 'Hoạt động' },
            pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', ring: 'ring-yellow-500/30', label: 'Chờ duyệt' },
            inactive: { bg: 'bg-gray-500/20', text: 'text-gray-500', ring: 'ring-gray-500/30', label: 'Ngừng hoạt động' }
        };
        const c = config[status];
        return (
            <span className={`inline-flex items-center rounded-full ${c.bg} px-2.5 py-0.5 text-xs font-medium ${c.text} ring-1 ring-inset ${c.ring}`}>
                {c.label}
            </span>
        );
    };

    const handleViewMentor = (id: string) => {
        console.log('View mentor:', id);
    };

    const handleApproveMentor = (id: string) => {
        console.log('Approve mentor:', id);
    };

    return (
        <AdminLayout
            title="Quản Lý Mentor"
            subtitle="Phê duyệt và quản lý đội ngũ giảng viên"
            icon="verified"
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Thêm Mentor
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng Mentor</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">
                                groups
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{mockStats.totalMentors.count}</p>
                        <div className="flex items-center gap-1 text-[#0bda5b] text-xs font-medium">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            <span>{mockStats.totalMentors.change}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đang hoạt động</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">
                                check_circle
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{mockStats.activeMentors.count}</p>
                        <div className="flex items-center gap-1 text-[#9dabb9] text-xs font-medium">
                            <span>{mockStats.activeMentors.change}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Chờ phê duyệt</p>
                            <span className="material-symbols-outlined text-yellow-500 bg-yellow-500/10 p-1 rounded-md text-[20px]">
                                hourglass_empty
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{mockStats.pendingApproval.count}</p>
                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                            <span className="material-symbols-outlined text-[16px]">priority_high</span>
                            <span>{mockStats.pendingApproval.change}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Rating TB</p>
                            <span className="material-symbols-outlined text-yellow-400 bg-yellow-400/10 p-1 rounded-md text-[20px]">
                                star
                            </span>
                        </div>
                        <p className="text-white tracking-tight text-3xl font-bold">{mockStats.avgRating.count}</p>
                        <div className="flex items-center gap-1 text-[#9dabb9] text-xs font-medium">
                            <span>{mockStats.avgRating.change}</span>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="flex flex-1 w-full gap-4 flex-col md:flex-row">
                        <div className="relative flex-1 min-w-[240px]">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                search
                            </span>
                            <input
                                type="text"
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-[#9dabb9]/60"
                                placeholder="Tìm theo tên, email hoặc chuyên môn..."
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
                                <option value="active">Hoạt động</option>
                                <option value="pending">Chờ duyệt</option>
                                <option value="inactive">Ngừng hoạt động</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mentors Table */}
                <div className="rounded-xl border border-[#3b4754] bg-[#1a222a] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#283039] border-b border-[#3b4754]">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[80px]">ID</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider min-w-[220px]">Mentor</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider min-w-[150px]">Chuyên môn</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[100px]">Rating</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[100px]">Học viên</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[130px]">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[120px]">Ngày tham gia</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider w-[120px] text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3b4754]">
                                {filteredMentors.map((mentor) => (
                                    <tr key={mentor.id} className="group hover:bg-[#283039] transition-colors">
                                        <td className="p-4 text-[#9dabb9] text-sm font-mono">{mentor.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-10 rounded-full bg-cover bg-center bg-gray-600 ring-2 ring-[#3b4754]"
                                                    style={{ backgroundImage: `url("${mentor.avatar}")` }}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-white text-sm font-medium">{mentor.name}</span>
                                                    <span className="text-[#9dabb9] text-xs">{mentor.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-md text-xs font-medium">
                                                {mentor.specialty}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                                <span className="text-white text-sm font-medium">{mentor.rating}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-white text-sm">{mentor.students}</td>
                                        <td className="p-4">{getStatusBadge(mentor.status)}</td>
                                        <td className="p-4 text-[#9dabb9] text-sm">{mentor.joinedDate}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleViewMentor(mentor.id)}
                                                    className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                </button>
                                                {mentor.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleApproveMentor(mentor.id)}
                                                        className="p-1.5 hover:bg-[#0bda5b]/20 text-[#9dabb9] hover:text-[#0bda5b] rounded-lg transition-colors"
                                                        title="Phê duyệt"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                    </button>
                                                )}
                                                <button
                                                    className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    className="p-1.5 hover:bg-red-500/20 text-[#9dabb9] hover:text-red-500 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-[#3b4754] bg-[#1a222a] px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-[#9dabb9]">
                                    Hiển thị <span className="font-medium text-white">1</span> đến{' '}
                                    <span className="font-medium text-white">{filteredMentors.length}</span> trong số{' '}
                                    <span className="font-medium text-white">{mockStats.totalMentors.count}</span> mentor
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

export default MentorManagement;

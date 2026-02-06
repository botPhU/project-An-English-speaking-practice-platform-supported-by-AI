import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';

// Types
interface Mentor {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    specialty: string;
    rating: number;
    students: number;
    status: 'active' | 'pending' | 'inactive';
    joinedDate: string;
}

interface MentorStats {
    totalMentors: { count: number; change: string };
    activeMentors: { count: number; change: string };
    pendingApproval: { count: number; change: string };
    avgRating: { count: number; change: string };
}

type StatusFilter = 'all' | 'active' | 'pending' | 'inactive';

const MentorManagement: React.FC = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [stats, setStats] = useState<MentorStats | null>(null);
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
            const [mentorsResponse, statsResponse, pendingResponse] = await Promise.all([
                adminService.getMentors(),
                adminService.getMentorStats(),
                adminService.getPendingMentors()
            ]);

            // Handle various API response formats for mentors
            let mentorData: any[] = [];
            if (Array.isArray(mentorsResponse.data)) {
                mentorData = mentorsResponse.data;
            } else if (mentorsResponse.data?.mentors && Array.isArray(mentorsResponse.data.mentors)) {
                mentorData = mentorsResponse.data.mentors;
            } else if (mentorsResponse.data?.data && Array.isArray(mentorsResponse.data.data)) {
                mentorData = mentorsResponse.data.data;
            }

            // Handle pending mentors response
            let pendingData: any[] = [];
            if (Array.isArray(pendingResponse.data)) {
                pendingData = pendingResponse.data;
            }

            const mappedMentors = mentorData.map((mentor: any) => ({
                id: String(mentor.id || mentor.mentor_id || ''),
                name: String(mentor.name || mentor.full_name || mentor.user_name || 'Unknown'),
                avatar: mentor.avatar || mentor.profile_picture || '',
                email: String(mentor.email || ''),
                specialty: String(mentor.specialty || mentor.specialization || 'General'),
                rating: Number(mentor.rating || mentor.average_rating || 0),
                students: Number(mentor.students || mentor.student_count || 0),
                status: (mentor.status || 'active') as 'active' | 'pending' | 'inactive',
                joinedDate: String(mentor.joined_date || mentor.created_at || 'N/A')
            }));

            // Map pending mentors (from mentor_applications table)
            const mappedPending = pendingData.map((app: any) => ({
                id: String(app.id || app.user_id || ''),
                name: String(app.name || app.full_name || 'Unknown'),
                avatar: '',
                email: String(app.email || ''),
                specialty: String(app.specialty || app.motivation || 'Chờ phê duyệt'),
                rating: 0,
                students: 0,
                status: 'pending' as const,
                joinedDate: String(app.applied_date || app.created_at || 'N/A')
            }));

            // Merge both lists - pending first for visibility
            setMentors([...mappedPending, ...mappedMentors]);

            // Map stats response safely
            const apiStats = statsResponse.data || {};
            setStats({
                totalMentors: { count: Number(apiStats.total_mentors || apiStats.totalMentors || 0), change: String(apiStats.total_change || '+0 tháng này') },
                activeMentors: { count: Number(apiStats.active_mentors || apiStats.activeMentors || 0), change: String(apiStats.active_percentage || '0% hoạt động') },
                pendingApproval: { count: Number(apiStats.pending_count || apiStats.pendingApproval || 0), change: 'Cần phê duyệt' },
                avgRating: { count: Number(apiStats.avg_rating || apiStats.avgRating || 0), change: 'Trung bình' }
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching mentors:', err);
            setError('Không thể tải danh sách mentor');
            // Set empty stats instead of mock data
            setStats({
                totalMentors: { count: 0, change: 'Chưa có dữ liệu' },
                activeMentors: { count: 0, change: '0% hoạt động' },
                pendingApproval: { count: 0, change: 'Không có' },
                avgRating: { count: 0, change: 'N/A' }
            });
            setMentors([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter mentors
    const filteredMentors = mentors.filter(mentor => {
        const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.specialty.toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && mentor.status === statusFilter;
    });

    const getStatusBadge = (status: Mentor['status']) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center rounded-full bg-[#0bda5b]/20 px-2.5 py-0.5 text-xs font-medium text-[#0bda5b] ring-1 ring-inset ring-[#0bda5b]/30">
                        Hoạt động
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-400 ring-1 ring-inset ring-yellow-500/30">
                        Chờ duyệt
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center rounded-full bg-gray-500/20 px-2.5 py-0.5 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-500/30">
                        Không hoạt động
                    </span>
                );
        }
    };

    const handleViewMentor = (id: string) => {
        console.log('View mentor:', id);
    };

    const handleApproveMentor = async (id: string) => {
        try {
            await adminService.approveMentor(id);
            // Refresh data to get updated list
            fetchData();
            alert('Đã phê duyệt mentor thành công! Tài khoản đã được chuyển sang role Mentor.');
        } catch (err) {
            console.error('Error approving mentor:', err);
            alert('Lỗi khi phê duyệt mentor');
        }
    };

    const handleRejectMentor = async (id: string) => {
        const reason = prompt('Nhập lý do từ chối (tùy chọn):');
        try {
            await adminService.rejectMentor(id, reason || undefined);
            // Refresh data to get updated list
            fetchData();
            alert('Đã từ chối đơn đăng ký mentor.');
        } catch (err) {
            console.error('Error rejecting mentor:', err);
            alert('Lỗi khi từ chối đơn đăng ký');
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <AdminLayout
            title="Quản Lý Mentor"
            subtitle="Quản lý đội ngũ hướng dẫn viên và giáo viên"
            icon="supervisor_account"
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Thêm Mentor
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng Mentor</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">
                                groups
                            </span>
                        </div>
                        {loading ? (
                            <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <>
                                <p className="text-white tracking-tight text-3xl font-bold">{stats?.totalMentors.count}</p>
                                <p className="text-[#0bda5b] text-xs font-medium">{stats?.totalMentors.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đang hoạt động</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">
                                check_circle
                            </span>
                        </div>
                        {loading ? (
                            <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <>
                                <p className="text-white tracking-tight text-3xl font-bold">{stats?.activeMentors.count}</p>
                                <p className="text-[#0bda5b] text-xs font-medium">{stats?.activeMentors.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Chờ phê duyệt</p>
                            <span className="material-symbols-outlined text-yellow-500 bg-yellow-500/10 p-1 rounded-md text-[20px]">
                                pending
                            </span>
                        </div>
                        {loading ? (
                            <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <>
                                <p className="text-white tracking-tight text-3xl font-bold">{stats?.pendingApproval.count}</p>
                                <p className="text-yellow-500 text-xs font-medium">{stats?.pendingApproval.change}</p>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đánh giá TB</p>
                            <span className="material-symbols-outlined text-yellow-400 bg-yellow-400/10 p-1 rounded-md text-[20px]">
                                star
                            </span>
                        </div>
                        {loading ? (
                            <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <>
                                <p className="text-white tracking-tight text-3xl font-bold">{stats?.avgRating.count}</p>
                                <p className="text-[#9dabb9] text-xs font-medium">{stats?.avgRating.change}</p>
                            </>
                        )}
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
                                <option value="inactive">Không hoạt động</option>
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
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Mentor</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Chuyên môn</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">Đánh giá</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">Học viên</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Ngày tham gia</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3b4754]">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-[#3e4854] animate-pulse"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                                        <div className="h-3 w-40 bg-[#3e4854] animate-pulse rounded"></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4"><div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div></td>
                                            <td className="p-4"><div className="h-4 w-12 bg-[#3e4854] animate-pulse rounded mx-auto"></div></td>
                                            <td className="p-4"><div className="h-4 w-12 bg-[#3e4854] animate-pulse rounded mx-auto"></div></td>
                                            <td className="p-4"><div className="h-6 w-20 bg-[#3e4854] animate-pulse rounded-full"></div></td>
                                            <td className="p-4"><div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div></td>
                                            <td className="p-4"><div className="h-8 w-20 bg-[#3e4854] animate-pulse rounded ml-auto"></div></td>
                                        </tr>
                                    ))
                                ) : filteredMentors.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-[#9dabb9]">
                                            {error || 'Không tìm thấy mentor nào'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMentors.map((mentor) => (
                                        <tr key={mentor.id} className="group hover:bg-[#283039] transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {mentor.avatar ? (
                                                        <div
                                                            className="size-10 rounded-full bg-cover bg-center bg-gray-600"
                                                            style={{ backgroundImage: `url("${mentor.avatar}")` }}
                                                        />
                                                    ) : (
                                                        <div className="size-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                                                            {getInitials(mentor.name)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-white">{mentor.name}</p>
                                                        <p className="text-xs text-[#9dabb9]">{mentor.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[#9dabb9]">{mentor.specialty}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span className="material-symbols-outlined text-yellow-400 text-[16px]">star</span>
                                                    <span className="text-white font-medium">{mentor.rating}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center text-white">{mentor.students}</td>
                                            <td className="p-4">{getStatusBadge(mentor.status)}</td>
                                            <td className="p-4 text-[#9dabb9]">{mentor.joinedDate}</td>
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
                                                        <>
                                                            <button
                                                                onClick={() => handleApproveMentor(mentor.id)}
                                                                className="p-1.5 hover:bg-[#0bda5b]/20 text-[#9dabb9] hover:text-[#0bda5b] rounded-lg transition-colors"
                                                                title="Chấp nhận"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectMentor(mentor.id)}
                                                                className="p-1.5 hover:bg-red-500/20 text-[#9dabb9] hover:text-red-500 rounded-lg transition-colors"
                                                                title="Từ chối"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between border-t border-[#3b4754] bg-[#1a222a] px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-[#9dabb9]">
                                    Hiển thị <span className="font-medium text-white">1</span> đến{' '}
                                    <span className="font-medium text-white">{filteredMentors.length}</span> của{' '}
                                    <span className="font-medium text-white">{mentors.length}</span> kết quả
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

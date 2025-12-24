import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'learner' | 'teacher';
    lastActive: string;
    package: string;
    status: boolean;
}

// Mock data
const mockUsers: User[] = [
    {
        id: 'USR001',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoazDRh-6QNX7KlaT8oAZbkK8BjhKdyxP2aajF5Q1FLuQexSUo01EOJfqDNZN5vbmR_eFdGlcLfc61Jzq2TvkE1jaI2yJoxtA3WmamyKEyG0zcP6uOIRZE0zU60s75tlTYLN0nQR5fdCmGlWHMHpuXt4ugLXNnfa89Sxk8nT2ma_G9o_dEfROmgqqJmqmJjnnACKDR4ReVVN9241TsRE6jC3GJ5IwNrmSaJ62Rs5RbQkfzBTU3pSxKAqj2QO3tw1pea29LlUXplzg',
        role: 'learner',
        lastActive: '2 phút trước',
        package: 'Pro (Năm)',
        status: true
    },
    {
        id: 'USR002',
        name: 'Trần Thị B',
        email: 'tranthib@edu.vn',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9h_-R-Do7kBOsaP5Jv9XVgZryKTxttF5uVMMBusEtZjcz0MIIIhaPZNWyzzGhbaXhH0QkCHOeROtKouiamBwkvF-o83jTsw5DHccHb8DP1Br38vkQ0qYjlQ7Ie-Dv72A0a5oWbPYgU9qxRusOee3bmPdhoLh8A6rZVjV-dRlUOap1WVKOQUlnSJOCW4Beadw4eDrfKwIHMWYbMQuxNvNyroBXaO1mEz7GwXV0dP03nQJWdvarQLwy7cBHH_-oMsAQ5gMFY4tO3SY',
        role: 'teacher',
        lastActive: '1 ngày trước',
        package: '--',
        status: true
    },
    {
        id: 'USR003',
        name: 'Lê Văn C',
        email: 'levanc_student@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi-63mXDMJ6GgoAnoaZR3ks-Gcnc4PPkm9EKrN4OA-UNc6G00SFgWVTxWeQscWG_gU_3zfNTW-bnC1VATjb-PnFLVEKK_oIw8bVt6gaxUnSCq21UIuVQWZcQEmlm9axTbaee_8jzhKWfb_-bM5VoS5slErIaHkl_fxtv6hxQcQIw8CWF3S7UrURnggA_Sz_R47wo6aE4xD3LeChA4Gdo_329VHb3T2OtzAdWeWp_JGPoKnd_vSUucR81CzrO6fvIRv01AnWgAAzys',
        role: 'learner',
        lastActive: '3 giờ trước',
        package: 'Cơ bản (Tháng)',
        status: false
    },
    {
        id: 'USR004',
        name: 'Phạm Đức D',
        email: 'ducdpham@outlook.com',
        avatar: '',
        role: 'learner',
        lastActive: '15 tháng 10, 2023',
        package: 'Miễn phí',
        status: true
    },
    {
        id: 'USR005',
        name: 'Sarah Miller',
        email: 'sarah.teacher@aesp.com',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8-Eo_MZ8WPVPA1qk3vY00TcpllNvPS2eu7M5g9xohVSZcF1i7xhIFzlu0pAzcMf3Oo13j5i4vmDwNbaqLxdKRxYZ2K92baFN_jwJeIH3tye9z-0spDpN96trJ3uU9jM_2Myzyb603haYi3DJAikts_nJZBaqWcRIxjm02oD3oa_n5wAye6cbkIWXWJC65Ssm9kvPP45mxg1uBZonLUM176mIWRl2H02A2AQ6u8YTGKCpf8Ux95xxtvpTVdM0pnnwmVLTljNb7g-4',
        role: 'teacher',
        lastActive: 'Vừa xong',
        package: '--',
        status: true
    }
];

const mockStats = {
    totalUsers: { count: 1240, change: '+12%' },
    activeLearners: { count: 850, change: '+5%' },
    teachers: { count: 45, change: '+2%' }
};

type RoleFilter = 'all' | 'learner' | 'teacher';
type StatusFilter = 'all' | 'active' | 'inactive';

const UserManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [users, setUsers] = useState(mockUsers);

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && user.status) ||
            (statusFilter === 'inactive' && !user.status);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const toggleUserStatus = (userId: string) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: !user.status } : user
        ));
    };

    const getRoleBadge = (role: User['role']) => {
        if (role === 'learner') {
            return (
                <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Học viên
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                Giáo viên
            </span>
        );
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <AdminLayout
            title="Quản Lý Người Dùng"
            subtitle="Quản lý học viên, giáo viên và trạng thái hoạt động trên hệ thống"
            icon="group"
            actions={
                <div className="flex gap-3">
                    <button className="bg-[#283039] hover:bg-[#3b4754] border border-[#3b4754] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Xuất dữ liệu
                    </button>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Thêm mới
                    </button>
                </div>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng người dùng</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">
                                groups
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-white tracking-tight text-3xl font-bold">{mockStats.totalUsers.count.toLocaleString()}</p>
                            <span className="text-[#0bda5b] text-sm font-medium bg-[#0bda5b]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                {mockStats.totalUsers.change}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Học viên hoạt động</p>
                            <span className="material-symbols-outlined text-[#a0e8af] bg-[#a0e8af]/10 p-1 rounded-md text-[20px]">
                                school
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-white tracking-tight text-3xl font-bold">{mockStats.activeLearners.count}</p>
                            <span className="text-[#0bda5b] text-sm font-medium bg-[#0bda5b]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                {mockStats.activeLearners.change}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Giáo viên</p>
                            <span className="material-symbols-outlined text-[#e8cba0] bg-[#e8cba0]/10 p-1 rounded-md text-[20px]">
                                cast_for_education
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-white tracking-tight text-3xl font-bold">{mockStats.teachers.count}</p>
                            <span className="text-[#0bda5b] text-sm font-medium bg-[#0bda5b]/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                {mockStats.teachers.change}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center justify-between bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="flex flex-1 w-full gap-4 flex-col lg:flex-row">
                        <div className="relative flex-1 min-w-[240px]">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                                search
                            </span>
                            <input
                                type="text"
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-[#9dabb9]/60"
                                placeholder="Tìm theo tên, email hoặc ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative w-full lg:w-48">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-4 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                <option value="all">Tất cả vai trò</option>
                                <option value="learner">Học viên</option>
                                <option value="teacher">Giáo viên</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                        <div className="relative w-full lg:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                                className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-4 pr-8 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Vô hiệu hóa</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="rounded-xl border border-[#3b4754] bg-[#1a222a] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#283039] border-b border-[#3b4754]">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Người dùng</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Vai trò</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Hoạt động cuối</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Gói dịch vụ</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3b4754]">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-[#283039] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <div
                                                        className="size-10 rounded-full bg-cover bg-center ring-2 ring-[#3b4754]"
                                                        style={{ backgroundImage: `url("${user.avatar}")` }}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center size-10 rounded-full bg-[#283039] text-white font-bold ring-2 ring-[#3b4754]">
                                                        {getInitials(user.name)}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium text-sm">{user.name}</span>
                                                    <span className="text-[#9dabb9] text-xs">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">{getRoleBadge(user.role)}</td>
                                        <td className="p-4 text-white text-sm">{user.lastActive}</td>
                                        <td className={`p-4 text-sm ${user.package === '--' ? 'text-[#9dabb9] italic' : 'text-white'}`}>
                                            {user.package}
                                        </td>
                                        <td className="p-4 text-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={user.status}
                                                    onChange={() => toggleUserStatus(user.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-[#3b4754] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                                            </label>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                    title="Đặt lại mật khẩu"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
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
                                    <span className="font-medium text-white">{filteredUsers.length}</span> trong số{' '}
                                    <span className="font-medium text-white">{mockStats.totalUsers.count.toLocaleString()}</span> kết quả
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <button className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white rounded">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039] rounded">
                                    2
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039] rounded">
                                    3
                                </button>
                                <span className="text-[#9dabb9]">...</span>
                                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039] rounded">
                                    12
                                </button>
                                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-[#9dabb9] ring-1 ring-inset ring-[#3b4754] hover:bg-[#283039]">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;

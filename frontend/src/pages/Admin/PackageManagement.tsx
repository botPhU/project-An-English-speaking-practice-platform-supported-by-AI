import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';

// Types
interface Package {
    id: string;
    name: string;
    tier: string;
    price: string;
    cycle: string;
    features: string[];
    users: number;
    status: 'active' | 'inactive';
    isHot?: boolean;
    icon: string;
    iconColor: string;
    iconBg: string;
}

// Mock data
const mockPackages: Package[] = [
    {
        id: 'PKG001',
        name: 'Gói Cơ Bản',
        tier: 'Free Tier',
        price: '0 ₫',
        cycle: 'Vĩnh viễn',
        features: ['Chat AI cơ bản'],
        users: 10500,
        status: 'active',
        icon: 'emoji_objects',
        iconColor: 'text-gray-400',
        iconBg: 'bg-gray-700/50'
    },
    {
        id: 'PKG002',
        name: 'Gói Tiêu Chuẩn',
        tier: 'Standard Tier',
        price: '199.000 ₫',
        cycle: 'Tháng',
        features: ['Không giới hạn AI', '2 buổi GV/tháng'],
        users: 3200,
        status: 'active',
        icon: 'rocket_launch',
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-500/10'
    },
    {
        id: 'PKG003',
        name: 'Gói Cao Cấp',
        tier: 'Premium Tier',
        price: '499.000 ₫',
        cycle: 'Tháng',
        features: ['Full tính năng AI', '8 buổi GV/tháng'],
        users: 850,
        status: 'active',
        isHot: true,
        icon: 'diamond',
        iconColor: 'text-primary',
        iconBg: 'bg-primary/20'
    },
    {
        id: 'PKG004',
        name: 'Gói Doanh Nghiệp',
        tier: 'B2B Tier',
        price: 'Liên hệ',
        cycle: 'Năm',
        features: ['Tùy chỉnh theo yêu cầu'],
        users: 50,
        status: 'active',
        icon: 'domain',
        iconColor: 'text-purple-400',
        iconBg: 'bg-purple-500/10'
    },
    {
        id: 'PKG005',
        name: 'Gói Thử Nghiệm',
        tier: 'Legacy 2023',
        price: '99.000 ₫',
        cycle: 'Tuần',
        features: ['Giới hạn tính năng'],
        users: 0,
        status: 'inactive',
        icon: 'history',
        iconColor: 'text-gray-500',
        iconBg: 'bg-gray-700/50'
    }
];

const mockStats = {
    totalPackages: 5,
    avgRevenue: '150.000 ₫',
    totalSubscribers: 1240
};

type StatusFilter = 'all' | 'active' | 'inactive';

const PackageManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const packages = mockPackages;

    // Filter packages
    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.tier.toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && pkg.status === statusFilter;
    });

    const getStatusBadge = (status: Package['status']) => {
        if (status === 'active') {
            return (
                <span className="inline-flex items-center rounded-full bg-[#0bda5b]/20 px-2.5 py-0.5 text-xs font-medium text-[#0bda5b] ring-1 ring-inset ring-[#0bda5b]/30">
                    Hoạt động
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full bg-gray-500/20 px-2.5 py-0.5 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-500/30">
                Vô hiệu hóa
            </span>
        );
    };

    return (
        <AdminLayout
            title="Quản Lý Gói Dịch Vụ & Định Giá"
            subtitle="Quản lý các cấp độ đăng ký, tính năng và chiến lược giá"
            icon="payments"
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tạo gói mới
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng gói hoạt động</p>
                            <span className="material-symbols-outlined text-primary bg-primary/10 p-1 rounded-md text-[20px]">
                                inventory_2
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-white tracking-tight text-3xl font-bold">{mockStats.totalPackages}</p>
                            <span className="text-[#0bda5b] text-sm font-medium bg-[#0bda5b]/10 px-1.5 py-0.5 rounded">
                                Active
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Doanh thu TB/Người dùng</p>
                            <span className="material-symbols-outlined text-[#0bda5b] bg-[#0bda5b]/10 p-1 rounded-md text-[20px]">
                                trending_up
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-white tracking-tight text-3xl font-bold">{mockStats.avgRevenue}</p>
                            <span className="text-[#0bda5b] text-xs font-medium">+5% tháng này</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng người đăng ký</p>
                            <span className="material-symbols-outlined text-blue-400 bg-blue-500/10 p-1 rounded-md text-[20px]">
                                groups
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-white tracking-tight text-3xl font-bold">{mockStats.totalSubscribers.toLocaleString()}</p>
                            <span className="text-blue-400 text-xs font-medium">+12% tháng này</span>
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
                                placeholder="Tìm kiếm tên gói..."
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
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Vô hiệu hóa</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#9dabb9] pointer-events-none text-sm">
                                expand_more
                            </span>
                        </div>
                    </div>
                </div>

                {/* Packages Table */}
                <div className="rounded-xl border border-[#3b4754] bg-[#1a222a] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#283039] border-b border-[#3b4754]">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Tên gói</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Giá (VND)</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Chu kỳ</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Tính năng nổi bật</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">Người dùng</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Trạng thái</th>
                                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3b4754]">
                                {filteredPackages.map((pkg) => (
                                    <tr
                                        key={pkg.id}
                                        className={`group hover:bg-[#283039] transition-colors ${pkg.isHot ? 'bg-primary/5' : ''} ${pkg.status === 'inactive' ? 'opacity-60' : ''}`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${pkg.iconBg} ${pkg.iconColor} border border-white/10`}>
                                                    <span className="material-symbols-outlined">{pkg.icon}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-white">{pkg.name}</p>
                                                        {pkg.isHot && (
                                                            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                                                Hot
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-[#9dabb9]">{pkg.tier}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-white">{pkg.price}</td>
                                        <td className="p-4 text-[#9dabb9]">{pkg.cycle}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                {pkg.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-1.5 text-[#9dabb9]">
                                                        <span className={`material-symbols-outlined text-[16px] ${pkg.status === 'active' ? 'text-primary' : 'text-gray-500'}`}>
                                                            {pkg.status === 'active' ? 'check_circle' : 'do_not_disturb_on'}
                                                        </span>
                                                        <span className="text-xs">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-white">{pkg.users.toLocaleString()}</td>
                                        <td className="p-4">{getStatusBadge(pkg.status)}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                {pkg.status === 'inactive' ? (
                                                    <button
                                                        className="p-1.5 hover:bg-[#0bda5b]/20 text-[#9dabb9] hover:text-[#0bda5b] rounded-lg transition-colors"
                                                        title="Khôi phục"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">restore</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="p-1.5 hover:bg-red-500/20 text-[#9dabb9] hover:text-red-500 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                )}
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
                                    <span className="font-medium text-white">{filteredPackages.length}</span> của{' '}
                                    <span className="font-medium text-white">{packages.length}</span> kết quả
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

export default PackageManagement;

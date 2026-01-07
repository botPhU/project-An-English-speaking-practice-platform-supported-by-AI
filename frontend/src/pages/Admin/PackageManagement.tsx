import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';

interface Package {
    id: string;
    name: string;
    tier: string;
    price: string;
    cycle: string;
    features: string[];
    users: number;
    status: 'active' | 'inactive';
    icon: string;
    iconColor: string;
    iconBg: string;
}

interface PackageStats {
    totalPackages: number;
    avgRevenue: string;
    totalSubscribers: number;
}

type StatusFilter = 'all' | 'active' | 'inactive';

const PackageManagement: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [stats, setStats] = useState<PackageStats | null>(null);
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
            const response = await adminService.getPackages();

            const packagesData = response.data.packages || response.data || [];
            const mappedPackages = packagesData.map((pkg: any, index: number) => {
                const icons = ['emoji_objects', 'star', 'diamond', 'workspace_premium', 'military_tech'];
                const colors = ['text-gray-400', 'text-blue-400', 'text-purple-400', 'text-yellow-400', 'text-primary'];
                const bgs = ['bg-gray-700/50', 'bg-blue-500/20', 'bg-purple-500/20', 'bg-yellow-500/20', 'bg-primary/20'];

                return {
                    id: pkg.id?.toString() || `PKG${index + 1}`,
                    name: pkg.name,
                    tier: pkg.tier || pkg.package_type || 'Standard',
                    price: pkg.price ? `${pkg.price.toLocaleString()} ₫` : '0 ₫',
                    cycle: pkg.cycle || pkg.billing_cycle || 'Tháng',
                    features: pkg.features || [],
                    users: pkg.users || pkg.subscriber_count || 0,
                    status: pkg.status || 'active',
                    icon: icons[index % icons.length],
                    iconColor: colors[index % colors.length],
                    iconBg: bgs[index % bgs.length]
                };
            });

            setPackages(mappedPackages);

            setStats({
                totalPackages: mappedPackages.length,
                avgRevenue: response.data.avg_revenue || '150.000 ₫',
                totalSubscribers: mappedPackages.reduce((sum: number, pkg: Package) => sum + pkg.users, 0)
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching packages:', err);
            setError('Không thể tải danh sách gói');
            // Set empty state instead of fallback
            setStats({
                totalPackages: 0,
                avgRevenue: '0 ₫',
                totalSubscribers: 0
            });
            setPackages([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.tier.toLowerCase().includes(searchQuery.toLowerCase());
        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && pkg.status === statusFilter;
    });

    return (
        <AdminLayout
            title="Quản Lý Gói Dịch Vụ"
            subtitle="Quản lý các gói subscription và pricing"
            icon="inventory_2"
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tạo gói mới
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <p className="text-[#9dabb9] text-sm font-medium">Tổng số gói</p>
                        {loading ? (
                            <div className="h-9 w-12 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <p className="text-white text-3xl font-bold">{stats?.totalPackages}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <p className="text-[#9dabb9] text-sm font-medium">Doanh thu TB/gói</p>
                        {loading ? (
                            <div className="h-9 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <p className="text-white text-3xl font-bold">{stats?.avgRevenue}</p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-5 bg-[#283039] border border-[#3b4754]">
                        <p className="text-[#9dabb9] text-sm font-medium">Tổng người đăng ký</p>
                        {loading ? (
                            <div className="h-9 w-20 bg-[#3e4854] animate-pulse rounded"></div>
                        ) : (
                            <p className="text-white text-3xl font-bold">{stats?.totalSubscribers?.toLocaleString()}</p>
                        )}
                    </div>
                </div>

                {/* Search */}
                <div className="flex gap-4 bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">search</span>
                        <input
                            type="text"
                            className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Tìm kiếm gói..."
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
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-xl bg-[#283039] border border-[#3b4754] p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="size-12 rounded-lg bg-[#3e4854] animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-5 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                                        <div className="h-4 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-8 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                    <div className="h-4 w-20 bg-[#3e4854] animate-pulse rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : filteredPackages.length === 0 ? (
                        <div className="col-span-full text-center text-[#9dabb9] py-8">
                            {error || 'Không tìm thấy gói nào'}
                        </div>
                    ) : (
                        filteredPackages.map((pkg) => (
                            <div key={pkg.id} className="rounded-xl bg-[#283039] border border-[#3b4754] p-6 hover:border-primary/50 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`size-12 rounded-lg ${pkg.iconBg} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined ${pkg.iconColor}`}>{pkg.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{pkg.name}</h3>
                                            <p className="text-xs text-[#9dabb9]">{pkg.tier}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${pkg.status === 'active' ? 'bg-[#0bda5b]/20 text-[#0bda5b]' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {pkg.status === 'active' ? 'Hoạt động' : 'Tắt'}
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <p className="text-2xl font-bold text-white">{pkg.price}</p>
                                    <p className="text-sm text-[#9dabb9]">/{pkg.cycle}</p>
                                </div>
                                <div className="mb-4 space-y-2">
                                    {pkg.features.slice(0, 3).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-[#9dabb9]">
                                            <span className="material-symbols-outlined text-[#0bda5b] text-[16px]">check</span>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-[#3b4754]">
                                    <span className="text-sm text-[#9dabb9]">{pkg.users.toLocaleString()} users</span>
                                    <button className="text-primary text-sm font-medium hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                        Chỉnh sửa →
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default PackageManagement;

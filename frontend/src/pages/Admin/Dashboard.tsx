import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';

interface DashboardStats {
    total_users: number;
    users_change: string;
    total_revenue: number;
    revenue_change: string;
    ai_lessons: number;
    lessons_change: string;
    active_mentors: number;
    mentors_change: string;
}

interface Activity {
    id: number;
    type: string;
    user: string;
    action: string;
    context?: string;
    timestamp: string;
    icon: string;
    color: string;
}

interface RevenueByPackage {
    name: string;
    amount: number;
    percentage: number;
}

interface SystemStatus {
    api_gateway: { status: string; label: string };
    ai_inference: { status: string; label: string };
    database: { status: string; label: string };
    server_load: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [revenueByPackage, setRevenueByPackage] = useState<RevenueByPackage[]>([]);
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsResponse, activitiesResponse] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getRecentActivities(5)
                ]);
                setStats(statsResponse.data);
                setActivities(activitiesResponse.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Không thể tải dữ liệu dashboard');
                // Set empty stats instead of mock data
                setStats({
                    total_users: 0,
                    users_change: '+0%',
                    total_revenue: 0,
                    revenue_change: '+0%',
                    ai_lessons: 0,
                    lessons_change: '+0%',
                    active_mentors: 0,
                    mentors_change: '+0%'
                });
                setActivities([]);
                setRevenueByPackage([]);
                setSystemStatus(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <AdminLayout
            title="Tổng quan hệ thống"
            icon="monitor_heart"
            actions={
                <button className="hidden lg:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                    <span className="truncate">Xuất báo cáo</span>
                </button>
            }
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Người học đang hoạt động</p>
                            <span className="material-symbols-outlined text-primary text-xl">school</span>
                        </div>
                        <div>
                            {loading ? (
                                <div className="h-9 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                            ) : (
                                <>
                                    <p className="text-white text-3xl font-bold leading-tight">
                                        {stats?.total_users?.toLocaleString() || '0'}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className={`material-symbols-outlined text-base ${stats?.users_change?.startsWith('+') ? 'text-[#0bda5b]' : 'text-[#fa6238]'}`}>
                                            {stats?.users_change?.startsWith('+') ? 'trending_up' : 'trending_down'}
                                        </span>
                                        <p className={`text-xs font-medium leading-normal ${stats?.users_change?.startsWith('+') ? 'text-[#0bda5b]' : 'text-[#fa6238]'}`}>
                                            {stats?.users_change} so với tháng trước
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Doanh thu hàng tháng</p>
                            <span className="material-symbols-outlined text-primary text-xl">payments</span>
                        </div>
                        <div>
                            {loading ? (
                                <div className="h-9 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                            ) : (
                                <>
                                    <p className="text-white text-3xl font-bold leading-tight">
                                        {formatCurrency(stats?.total_revenue || 0)}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className={`material-symbols-outlined text-base ${stats?.revenue_change?.startsWith('+') ? 'text-[#0bda5b]' : 'text-[#fa6238]'}`}>
                                            {stats?.revenue_change?.startsWith('+') ? 'trending_up' : 'trending_down'}
                                        </span>
                                        <p className={`text-xs font-medium leading-normal ${stats?.revenue_change?.startsWith('+') ? 'text-[#0bda5b]' : 'text-[#fa6238]'}`}>
                                            {stats?.revenue_change} so với tháng trước
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Gói đã bán (Tháng này)</p>
                            <span className="material-symbols-outlined text-primary text-xl">shopping_cart</span>
                        </div>
                        <div>
                            {loading ? (
                                <div className="h-9 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                            ) : (
                                <>
                                    <p className="text-white text-3xl font-bold leading-tight">
                                        {stats?.ai_lessons?.toLocaleString() || '0'}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className={`material-symbols-outlined text-base ${stats?.lessons_change?.startsWith('+') ? 'text-[#0bda5b]' : 'text-[#fa6238]'}`}>
                                            {stats?.lessons_change?.startsWith('+') ? 'trending_up' : 'trending_down'}
                                        </span>
                                        <p className={`text-xs font-medium leading-normal ${stats?.lessons_change?.startsWith('+') ? 'text-[#0bda5b]' : 'text-[#fa6238]'}`}>
                                            {stats?.lessons_change} so với tháng trước
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tải phiên AI</p>
                            <span className="material-symbols-outlined text-primary text-xl">memory</span>
                        </div>
                        <div>
                            {loading ? (
                                <div className="h-9 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                            ) : (
                                <>
                                    <p className="text-white text-3xl font-bold leading-tight">
                                        {stats?.active_mentors}%
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className={`material-symbols-outlined text-base ${stats?.mentors_change?.startsWith('+') ? 'text-[#0bda5b]' : 'text-[#fa6238]'}`}>
                                            {stats?.mentors_change?.startsWith('+') ? 'trending_up' : 'trending_down'}
                                        </span>
                                        <p className={`text-xs font-medium leading-normal ${stats?.mentors_change?.startsWith('+') ? 'text-[#0bda5b]' : 'text-[#fa6238]'}`}>
                                            {stats?.mentors_change} dung lượng trống
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Growth Chart */}
                    <div className="lg:col-span-2 flex flex-col rounded-xl bg-[#283039] p-6 border border-[#3e4854]/30">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white text-lg font-bold">Tăng trưởng người dùng vs Sử dụng AI</h3>
                                <p className="text-[#9dabb9] text-sm">Theo dõi phiên thời gian thực (24h)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-3 rounded-full bg-primary" />
                                <span className="text-xs text-[#9dabb9]">Phiên</span>
                            </div>
                        </div>
                        <div className="relative h-64 w-full flex items-center justify-center">
                            <div className="text-center text-[#9dabb9]">
                                <span className="material-symbols-outlined text-4xl opacity-30 mb-2">show_chart</span>
                                <p>Chưa có dữ liệu biểu đồ</p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 px-2">
                            <p className="text-[#9dabb9] text-xs">00:00</p>
                            <p className="text-[#9dabb9] text-xs">06:00</p>
                            <p className="text-[#9dabb9] text-xs">12:00</p>
                            <p className="text-[#9dabb9] text-xs">18:00</p>
                            <p className="text-[#9dabb9] text-xs">Hiện tại</p>
                        </div>
                    </div>

                    {/* Revenue by Package */}
                    <div className="flex flex-col rounded-xl bg-[#283039] p-6 border border-[#3e4854]/30">
                        <h3 className="text-white text-lg font-bold mb-1">Doanh thu gói</h3>
                        <p className="text-[#9dabb9] text-sm mb-6">Phân bổ theo hạng</p>
                        <div className="flex-1 flex flex-col justify-end gap-4">
                            {revenueByPackage.length > 0 ? (
                                revenueByPackage.map((pkg, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-white w-16">{pkg.name}</span>
                                        <div className="flex-1 h-3 bg-[#111418] rounded-full overflow-hidden">
                                            <div className={`h-full bg-primary rounded-full`} style={{ width: `${pkg.percentage}%`, opacity: 1 - idx * 0.2 }} />
                                        </div>
                                        <span className="text-xs text-[#9dabb9]">{formatCurrency(pkg.amount)}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-[#9dabb9] py-4">
                                    <span className="material-symbols-outlined text-3xl opacity-30 mb-2">pie_chart</span>
                                    <p>Chưa có dữ liệu doanh thu</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 pt-4 border-t border-[#3e4854]/50 flex justify-between items-end">
                            <div>
                                <p className="text-xs text-[#9dabb9]">Tổng doanh thu</p>
                                <p className="text-xl font-bold text-white">{formatCurrency(stats?.total_revenue || 0)}</p>
                            </div>
                            <button className="text-primary text-sm font-medium hover:text-white transition-colors">
                                Xem báo cáo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pending Actions & System Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Actions */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-white text-xl font-bold">Hành động chờ xử lý</h3>
                            <a className="text-sm text-primary hover:text-white transition-colors" href="#">
                                Xem tất cả
                            </a>
                        </div>
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 overflow-hidden">
                            {loading ? (
                                <div className="p-4 space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-[#3e4854] animate-pulse"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-[#3e4854] animate-pulse rounded w-3/4"></div>
                                                <div className="h-3 bg-[#3e4854] animate-pulse rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <div key={activity.id || index} className={`flex items-center justify-between p-4 ${index < activities.length - 1 ? 'border-b border-[#3e4854]/30' : ''} hover:bg-[#2f3844] transition-colors group`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`size-10 rounded-full flex items-center justify-center ${activity.color || 'bg-purple-500/20 text-purple-400'}`}>
                                                <span className="material-symbols-outlined">{activity.icon || 'notifications'}</span>
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{activity.action}</p>
                                                <p className="text-[#9dabb9] text-xs">{activity.user} {activity.context ? `- ${activity.context}` : ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors">
                                                Xem xét
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-4xl opacity-30 mb-2">inbox</span>
                                    <p>Không có hành động chờ xử lý</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-xl font-bold px-2">Trạng thái hệ thống</h3>
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 p-5 flex flex-col gap-5 h-full">
                            {systemStatus ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`material-symbols-outlined ${systemStatus.api_gateway.status === 'healthy' ? 'text-[#0bda5b]' : 'text-yellow-500'}`}>check_circle</span>
                                            <span className="text-white text-sm font-medium">Cổng API</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${systemStatus.api_gateway.status === 'healthy' ? 'text-[#0bda5b] bg-[#0bda5b]/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                                            {systemStatus.api_gateway.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`material-symbols-outlined ${systemStatus.ai_inference.status === 'healthy' ? 'text-[#0bda5b]' : 'text-yellow-500'}`}>smart_toy</span>
                                            <span className="text-white text-sm font-medium">Công cụ suy luận AI</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${systemStatus.ai_inference.status === 'healthy' ? 'text-[#0bda5b] bg-[#0bda5b]/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                                            {systemStatus.ai_inference.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`material-symbols-outlined ${systemStatus.database.status === 'healthy' ? 'text-[#0bda5b]' : 'text-yellow-500'}`}>database</span>
                                            <span className="text-white text-sm font-medium">Cụm cơ sở dữ liệu</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${systemStatus.database.status === 'healthy' ? 'text-[#0bda5b] bg-[#0bda5b]/10' : 'text-yellow-500 bg-yellow-500/10'}`}>
                                            {systemStatus.database.label}
                                        </span>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-[#3e4854]/30">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-[#9dabb9]">Tải máy chủ</span>
                                            <span className="text-xs text-white font-mono">{systemStatus.server_load}%</span>
                                        </div>
                                        <div className="w-full bg-[#111418] h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full" style={{ width: `${systemStatus.server_load}%` }} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-[#9dabb9] py-8">
                                    <span className="material-symbols-outlined text-3xl opacity-30 mb-2">monitoring</span>
                                    <p>Chưa có dữ liệu trạng thái</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

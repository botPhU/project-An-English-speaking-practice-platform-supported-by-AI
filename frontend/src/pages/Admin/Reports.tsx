import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';

interface ReportStats {
    totalRevenue: { value: string; change: string; changeType: 'up' | 'down' };
    activeUsers: { value: string; change: string; changeType: 'up' | 'down' };
    newSubscriptions: { value: string; change: string; changeType: 'up' | 'down' };
    avgSessionTime: { value: string; change: string; changeType: 'up' | 'down' };
}

interface PackageDistribution {
    name: string;
    count: number;
    color: string;
    percentage: number;
}

const Reports: React.FC = () => {
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [packageDistribution, setPackageDistribution] = useState<PackageDistribution[]>([]);
    const [chartData, setChartData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState('30days');

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getReports();

            const data = response.data || {};
            setStats({
                totalRevenue: {
                    value: data.total_revenue ? `₫${(data.total_revenue / 1000000000).toFixed(2)} Tỷ` : 'N/A',
                    change: data.revenue_change || 'Chưa có dữ liệu',
                    changeType: (data.revenue_change || '+0%').startsWith('+') ? 'up' : 'down'
                },
                activeUsers: {
                    value: data.active_users != null ? data.active_users.toLocaleString() : '0',
                    change: data.users_change || 'Chưa có dữ liệu',
                    changeType: (data.users_change || '+0%').startsWith('+') ? 'up' : 'down'
                },
                newSubscriptions: {
                    value: data.new_subscriptions != null ? data.new_subscriptions.toLocaleString() : '0',
                    change: data.subscriptions_change || 'Chưa có dữ liệu',
                    changeType: (data.subscriptions_change || '+0%').startsWith('+') ? 'up' : 'down'
                },
                avgSessionTime: {
                    value: data.avg_session_time || 'N/A',
                    change: data.session_change || 'Chưa có dữ liệu',
                    changeType: (data.session_change || '+0%').startsWith('+') ? 'up' : 'down'
                }
            });

            // Set package distribution from API or empty array
            const colors = ['bg-gray-500', 'bg-blue-500', 'bg-purple-500', 'bg-primary'];
            const pkgData = data.package_distribution || [];
            setPackageDistribution(pkgData.map((pkg: any, i: number) => ({
                name: pkg.name || 'Unknown',
                count: pkg.count || 0,
                color: colors[i % colors.length],
                percentage: pkg.percentage || 0
            })));

            // Set chart data from API or empty array
            setChartData(data.user_growth || []);

            setError(null);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Không thể tải báo cáo');
            // Set empty stats instead of mock data
            setStats({
                totalRevenue: { value: 'N/A', change: 'Chưa có dữ liệu', changeType: 'up' },
                activeUsers: { value: '0', change: 'Chưa có dữ liệu', changeType: 'up' },
                newSubscriptions: { value: '0', change: 'Chưa có dữ liệu', changeType: 'up' },
                avgSessionTime: { value: 'N/A', change: 'Chưa có dữ liệu', changeType: 'up' }
            });
            setPackageDistribution([]);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout
            title="Báo Cáo & Thống Kê"
            subtitle="Phân tích hiệu suất và doanh thu"
            icon="analytics"
            actions={
                <div className="flex gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-[#283039] border border-[#3b4754] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="7days">7 ngày qua</option>
                        <option value="30days">30 ngày qua</option>
                        <option value="90days">90 ngày qua</option>
                        <option value="1year">1 năm qua</option>
                    </select>
                    <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Xuất báo cáo
                    </button>
                </div>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="flex flex-col p-5 rounded-xl bg-[#283039] border border-[#3b4754] hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-green-500">payments</span>
                            </div>
                            {loading ? (
                                <div className="h-6 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                            ) : (
                                <span className={`flex items-center px-2 py-0.5 rounded text-xs font-medium ${stats?.totalRevenue.changeType === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                    <span className="material-symbols-outlined text-[14px] mr-1">{stats?.totalRevenue.changeType === 'up' ? 'trending_up' : 'trending_down'}</span>
                                    {stats?.totalRevenue.change}
                                </span>
                            )}
                        </div>
                        <p className="text-[#9dabb9] text-sm font-medium">Tổng doanh thu</p>
                        {loading ? (
                            <div className="h-8 w-24 bg-[#3e4854] animate-pulse rounded mt-1"></div>
                        ) : (
                            <h3 className="text-white text-2xl font-bold mt-1">{stats?.totalRevenue.value}</h3>
                        )}
                        <p className="text-[#64748b] text-xs mt-2">So với 30 ngày trước</p>
                    </div>

                    <div className="flex flex-col p-5 rounded-xl bg-[#283039] border border-[#3b4754] hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-blue-500">group</span>
                            </div>
                            {loading ? (
                                <div className="h-6 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                            ) : (
                                <span className={`flex items-center px-2 py-0.5 rounded text-xs font-medium ${stats?.activeUsers.changeType === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                    <span className="material-symbols-outlined text-[14px] mr-1">{stats?.activeUsers.changeType === 'up' ? 'trending_up' : 'trending_down'}</span>
                                    {stats?.activeUsers.change}
                                </span>
                            )}
                        </div>
                        <p className="text-[#9dabb9] text-sm font-medium">Người dùng hoạt động</p>
                        {loading ? (
                            <div className="h-8 w-20 bg-[#3e4854] animate-pulse rounded mt-1"></div>
                        ) : (
                            <h3 className="text-white text-2xl font-bold mt-1">{stats?.activeUsers.value}</h3>
                        )}
                        <p className="text-[#64748b] text-xs mt-2">Người dùng unique tháng này</p>
                    </div>

                    <div className="flex flex-col p-5 rounded-xl bg-[#283039] border border-[#3b4754] hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-purple-500">card_membership</span>
                            </div>
                            {loading ? (
                                <div className="h-6 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                            ) : (
                                <span className={`flex items-center px-2 py-0.5 rounded text-xs font-medium ${stats?.newSubscriptions.changeType === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                    <span className="material-symbols-outlined text-[14px] mr-1">{stats?.newSubscriptions.changeType === 'up' ? 'trending_up' : 'trending_down'}</span>
                                    {stats?.newSubscriptions.change}
                                </span>
                            )}
                        </div>
                        <p className="text-[#9dabb9] text-sm font-medium">Đăng ký mới</p>
                        {loading ? (
                            <div className="h-8 w-16 bg-[#3e4854] animate-pulse rounded mt-1"></div>
                        ) : (
                            <h3 className="text-white text-2xl font-bold mt-1">{stats?.newSubscriptions.value}</h3>
                        )}
                        <p className="text-[#64748b] text-xs mt-2">Subscription mới tháng này</p>
                    </div>

                    <div className="flex flex-col p-5 rounded-xl bg-[#283039] border border-[#3b4754] hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-orange-500">schedule</span>
                            </div>
                            {loading ? (
                                <div className="h-6 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                            ) : (
                                <span className={`flex items-center px-2 py-0.5 rounded text-xs font-medium ${stats?.avgSessionTime.changeType === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                    <span className="material-symbols-outlined text-[14px] mr-1">{stats?.avgSessionTime.changeType === 'up' ? 'trending_up' : 'trending_down'}</span>
                                    {stats?.avgSessionTime.change}
                                </span>
                            )}
                        </div>
                        <p className="text-[#9dabb9] text-sm font-medium">Thời gian phiên TB</p>
                        {loading ? (
                            <div className="h-8 w-20 bg-[#3e4854] animate-pulse rounded mt-1"></div>
                        ) : (
                            <h3 className="text-white text-2xl font-bold mt-1">{stats?.avgSessionTime.value}</h3>
                        )}
                        <p className="text-[#64748b] text-xs mt-2">Trung bình mỗi người dùng</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="rounded-xl bg-[#283039] border border-[#3b4754] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white text-lg font-bold">Doanh thu theo thời gian</h3>
                                <p className="text-[#9dabb9] text-sm">Biểu đồ doanh thu {period === '30days' ? '30 ngày qua' : period}</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-center justify-center">
                            <svg className="w-full h-full" fill="none" viewBox="0 0 400 200">
                                <defs>
                                    <linearGradient id="revenueGradient" x1={0} x2={0} y1={0} y2={1}>
                                        <stop offset="0%" stopColor="#2b8cee" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#2b8cee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <line stroke="#3e4854" strokeWidth={1} x1={0} x2={400} y1={199} y2={199} />
                                <line stroke="#3e4854" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={400} y1={150} y2={150} />
                                <line stroke="#3e4854" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={400} y1={100} y2={100} />
                                <line stroke="#3e4854" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={400} y1={50} y2={50} />
                                <path d="M0 150 Q 50 120, 100 140 T 200 100 T 300 80 T 400 60 V 200 H 0 Z" fill="url(#revenueGradient)" />
                                <path d="M0 150 Q 50 120, 100 140 T 200 100 T 300 80 T 400 60" fill="none" stroke="#2b8cee" strokeWidth={2} />
                            </svg>
                        </div>
                    </div>

                    {/* User Growth Chart */}
                    <div className="rounded-xl bg-[#283039] border border-[#3b4754] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white text-lg font-bold">Tăng trưởng người dùng</h3>
                                <p className="text-[#9dabb9] text-sm">Số lượng đăng ký mới</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end gap-2 px-4">
                            {chartData.length > 0 ? (
                                chartData.map((height, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div
                                            className="w-full bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                                            style={{ height: `${Math.min(height * 2, 180)}px` }}
                                        />
                                        <span className="text-xs text-[#9dabb9]">{i + 1}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-[#9dabb9]">
                                    <p>Chưa có dữ liệu biểu đồ</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Package Distribution */}
                <div className="rounded-xl bg-[#283039] border border-[#3b4754] p-6">
                    <h3 className="text-white text-lg font-bold mb-6">Phân bổ gói đăng ký</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {packageDistribution.length > 0 ? (
                            packageDistribution.map((pkg) => (
                                <div key={pkg.name} className="p-4 bg-[#1a222a] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-medium">{pkg.name}</span>
                                        <span className="text-[#9dabb9] text-sm">{pkg.percentage}%</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white mb-2">{pkg.count.toLocaleString()}</p>
                                    <div className="w-full h-2 bg-[#3b4754] rounded-full overflow-hidden">
                                        <div className={`h-full ${pkg.color} rounded-full`} style={{ width: `${pkg.percentage}%` }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-4 p-8 text-center text-[#9dabb9]">
                                <span className="material-symbols-outlined text-4xl opacity-30 mb-2">inventory_2</span>
                                <p>Chưa có dữ liệu phân bổ gói đăng ký</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Reports;

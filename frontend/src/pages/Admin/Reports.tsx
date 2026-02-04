import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout';
import { adminService } from '../../services/adminService';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

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

interface ChartDataPoint {
    name: string;
    value: number;
    revenue?: number;
    users?: number;
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#f97316', '#0bda5b'];

const Reports: React.FC = () => {
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [packageDistribution, setPackageDistribution] = useState<PackageDistribution[]>([]);
    const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
    const [userGrowthData, setUserGrowthData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [period, setPeriod] = useState('30days');

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [reportsResponse, revenueResponse, userGrowthResponse, revenueByPackageResponse] = await Promise.all([
                adminService.getReports().catch(() => ({ data: {} })),
                adminService.getRevenueChart(period).catch(() => ({ data: [] })),
                adminService.getUserGrowth().catch(() => ({ data: [] })),
                adminService.getRevenueByPackage().catch(() => ({ data: [] }))
            ]);

            const data = reportsResponse.data || {};
            setStats({
                totalRevenue: {
                    value: data.total_revenue ? `$${(data.total_revenue / 1000).toFixed(1)}K` : '$0',
                    change: data.revenue_change || '+0%',
                    changeType: (data.revenue_change || '+0%').startsWith('+') ? 'up' : 'down'
                },
                activeUsers: {
                    value: data.active_users != null ? data.active_users.toLocaleString() : '0',
                    change: data.users_change || '+0%',
                    changeType: (data.users_change || '+0%').startsWith('+') ? 'up' : 'down'
                },
                newSubscriptions: {
                    value: data.new_subscriptions != null ? data.new_subscriptions.toLocaleString() : '0',
                    change: data.subscriptions_change || '+0%',
                    changeType: (data.subscriptions_change || '+0%').startsWith('+') ? 'up' : 'down'
                },
                avgSessionTime: {
                    value: data.avg_session_time || '0m',
                    change: data.session_change || '+0%',
                    changeType: (data.session_change || '+0%').startsWith('+') ? 'up' : 'down'
                }
            });

            // Revenue chart data
            const revenueChartData = (revenueResponse.data || []).map((item: any) => ({
                name: item.week || item.date || 'N/A',
                revenue: item.revenue || 0
            }));
            setRevenueData(revenueChartData);

            // User growth data
            const userChartData = (userGrowthResponse.data || []).map((item: any) => ({
                name: item.date || 'N/A',
                users: item.count || 0
            }));
            setUserGrowthData(userChartData);

            // Package distribution from revenue by package
            const pkgData = revenueByPackageResponse.data || [];
            setPackageDistribution(pkgData.map((pkg: any, i: number) => ({
                name: pkg.name || 'Package',
                count: pkg.amount || 0,
                color: COLORS[i % COLORS.length],
                percentage: pkg.percentage || 0
            })));

            setError(null);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Không thể tải báo cáo');
            setStats({
                totalRevenue: { value: '$0', change: '+0%', changeType: 'up' },
                activeUsers: { value: '0', change: '+0%', changeType: 'up' },
                newSubscriptions: { value: '0', change: '+0%', changeType: 'up' },
                avgSessionTime: { value: '0m', change: '+0%', changeType: 'up' }
            });
            setPackageDistribution([]);
            setRevenueData([]);
            setUserGrowthData([]);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => `$${(value / 1000).toFixed(1)}K`;

    // Prepare pie chart data
    const pieData = packageDistribution.map((pkg, idx) => ({
        name: pkg.name,
        value: pkg.count,
        color: COLORS[idx % COLORS.length]
    }));

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
                        <div className="h-64">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : revenueData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#3e4854" />
                                        <XAxis dataKey="name" stroke="#9dabb9" fontSize={12} />
                                        <YAxis stroke="#9dabb9" fontSize={12} tickFormatter={(v) => `$${v}`} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1a222a',
                                                border: '1px solid #3e4854',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Doanh thu']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#0ea5e9"
                                            fillOpacity={1}
                                            fill="url(#revenueGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#9dabb9]">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-4xl opacity-30 mb-2">show_chart</span>
                                        <p>Chưa có dữ liệu doanh thu</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Growth Chart */}
                    <div className="rounded-xl bg-[#283039] border border-[#3b4754] p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white text-lg font-bold">Tăng trưởng người dùng</h3>
                                <p className="text-[#9dabb9] text-sm">Số lượng đăng ký mới theo tuần</p>
                            </div>
                        </div>
                        <div className="h-64">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : userGrowthData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#3e4854" />
                                        <XAxis dataKey="name" stroke="#9dabb9" fontSize={12} />
                                        <YAxis stroke="#9dabb9" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1a222a',
                                                border: '1px solid #3e4854',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                            formatter={(value: number) => [value.toLocaleString(), 'Người dùng']}
                                        />
                                        <Bar dataKey="users" fill="#0bda5b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#9dabb9]">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-4xl opacity-30 mb-2">bar_chart</span>
                                        <p>Chưa có dữ liệu người dùng</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Package Distribution with Pie Chart */}
                <div className="rounded-xl bg-[#283039] border border-[#3b4754] p-6">
                    <h3 className="text-white text-lg font-bold mb-6">Phân bổ doanh thu theo gói</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <div className="h-64">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1a222a',
                                                border: '1px solid #3e4854',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Doanh thu']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-[#9dabb9]">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-4xl opacity-30 mb-2">pie_chart</span>
                                        <p>Chưa có dữ liệu phân bổ</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Package Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {packageDistribution.length > 0 ? (
                                packageDistribution.map((pkg, idx) => (
                                    <div key={pkg.name} className="p-4 bg-[#1a222a] rounded-lg border border-[#3e4854]/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span
                                                className="size-4 rounded-full"
                                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                            />
                                            <span className="text-white font-medium">{pkg.name}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white mb-1">${(pkg.count).toLocaleString()}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-[#3b4754] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${pkg.percentage}%`,
                                                        backgroundColor: COLORS[idx % COLORS.length]
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-[#9dabb9]">{pkg.percentage}%</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 p-8 text-center text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-4xl opacity-30 mb-2">inventory_2</span>
                                    <p>Chưa có dữ liệu phân bổ gói</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Reports;

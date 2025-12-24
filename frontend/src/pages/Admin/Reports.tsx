import { AdminLayout } from '../../components/layout';

export default function Reports() {
    return (
        <AdminLayout
            title="Báo Cáo & Thống Kê"
            subtitle="Tổng quan chi tiết về hiệu suất hệ thống, doanh thu và hoạt động người dùng"
            icon="bar_chart"
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/25 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Xuất dữ liệu
                </button>
            }
        >
            <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
                {/* Date Filters */}
                <div className="flex justify-end">
                    <div className="flex bg-[#283039] p-1 rounded-lg border border-[#3b4754]">
                        <button className="px-4 py-1.5 rounded text-sm font-medium text-[#9dabb9] hover:text-white transition-colors">
                            Hôm nay
                        </button>
                        <button className="px-4 py-1.5 rounded text-sm font-medium text-[#9dabb9] hover:text-white transition-colors">
                            7 ngày
                        </button>
                        <button className="px-4 py-1.5 rounded text-sm font-medium bg-primary text-white shadow-sm">
                            30 ngày
                        </button>
                        <button className="px-4 py-1.5 rounded text-sm font-medium text-[#9dabb9] hover:text-white transition-colors flex items-center gap-1">
                            <span>Tùy chọn</span>
                            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Card 1 */}
                    <div className="flex flex-col p-5 rounded-xl bg-[#283039] border border-[#3b4754] hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-green-500">payments</span>
                            </div>
                            <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +12%
                            </span>
                        </div>
                        <p className="text-[#9dabb9] text-sm font-medium">Tổng doanh thu</p>
                        <h3 className="text-white text-2xl font-bold mt-1">₫1.25 Tỷ</h3>
                        <p className="text-[#64748b] text-xs mt-2">So với 30 ngày trước</p>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col p-5 rounded-xl bg-[#283039] border border-[#3b4754] hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-blue-500">groups</span>
                            </div>
                            <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +5%
                            </span>
                        </div>
                        <p className="text-[#9dabb9] text-sm font-medium">Học viên hoạt động</p>
                        <h3 className="text-white text-2xl font-bold mt-1">4,520</h3>
                        <p className="text-[#64748b] text-xs mt-2">Người dùng đăng nhập hàng tháng</p>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col p-5 rounded-xl bg-[#283039] border border-[#3b4754] hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-purple-500">smart_toy</span>
                            </div>
                            <span className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +18%
                            </span>
                        </div>
                        <p className="text-[#9dabb9] text-sm font-medium">Buổi học với AI</p>
                        <h3 className="text-white text-2xl font-bold mt-1">12,300</h3>
                        <p className="text-[#64748b] text-xs mt-2">Tổng số phiên hoàn thành</p>
                    </div>

                    {/* Card 4 */}
                    <div className="flex flex-col p-5 rounded-xl bg-[#283039] border border-[#3b4754] hover:border-primary/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <span className="material-symbols-outlined text-orange-500">school</span>
                            </div>
                            <span className="flex items-center text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded text-xs font-medium">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_down</span> -2%
                            </span>
                        </div>
                        <p className="text-[#9dabb9] text-sm font-medium">Mentor hoạt động</p>
                        <h3 className="text-white text-2xl font-bold mt-1">125</h3>
                        <p className="text-[#64748b] text-xs mt-2">Đang trực tuyến ngay bây giờ</p>
                    </div>
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart (Large) */}
                    <div className="lg:col-span-2 rounded-xl bg-[#283039] border border-[#3b4754] p-6 flex flex-col h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white text-lg font-bold">Biểu đồ doanh thu</h3>
                                <p className="text-[#9dabb9] text-sm">Theo dõi thu nhập theo thời gian thực</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs text-[#9dabb9]">
                                    <span className="w-3 h-3 rounded-full bg-primary" /> Gói tháng
                                </span>
                                <span className="flex items-center gap-1 text-xs text-[#9dabb9]">
                                    <span className="w-3 h-3 rounded-full bg-purple-500" /> Gói năm
                                </span>
                            </div>
                        </div>
                        {/* CSS Chart Visual */}
                        <div className="flex-1 w-full flex items-end justify-between gap-2 px-2 pb-2 relative border-b border-[#3b4754] border-l">
                            {/* Y-Axis Labels (Absolute) */}
                            <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-xs text-[#64748b] py-2">
                                <span>500Tr</span>
                                <span>250Tr</span>
                                <span>100Tr</span>
                                <span>0</span>
                            </div>
                            {/* Bars */}
                            <div className="w-full flex items-end justify-around h-full gap-2 sm:gap-4 pl-4">
                                <div className="w-full bg-primary/20 rounded-t-sm relative group h-[40%] hover:bg-primary/30 transition-all">
                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[60%]" />
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                                        Tuần 1: ₫120M
                                    </div>
                                </div>
                                <div className="w-full bg-primary/20 rounded-t-sm relative group h-[55%] hover:bg-primary/30 transition-all">
                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[50%]" />
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                                        Tuần 2: ₫180M
                                    </div>
                                </div>
                                <div className="w-full bg-primary/20 rounded-t-sm relative group h-[35%] hover:bg-primary/30 transition-all">
                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[70%]" />
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                                        Tuần 3: ₫110M
                                    </div>
                                </div>
                                <div className="w-full bg-primary/20 rounded-t-sm relative group h-[65%] hover:bg-primary/30 transition-all">
                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[55%]" />
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                                        Tuần 4: ₫210M
                                    </div>
                                </div>
                                <div className="w-full bg-primary/20 rounded-t-sm relative group h-[80%] hover:bg-primary/30 transition-all">
                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[45%]" />
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                                        Tuần 5: ₫250M
                                    </div>
                                </div>
                                <div className="w-full bg-primary/20 rounded-t-sm relative group h-[72%] hover:bg-primary/30 transition-all">
                                    <div className="absolute bottom-0 w-full bg-primary rounded-t-sm h-[60%]" />
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity">
                                        Tuần 6: ₫230M
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* X-Axis */}
                        <div className="flex justify-between pl-4 mt-2 text-xs text-[#9dabb9]">
                            <span>01/10</span>
                            <span>05/10</span>
                            <span>10/10</span>
                            <span>15/10</span>
                            <span>20/10</span>
                            <span>25/10</span>
                        </div>
                    </div>

                    {/* Usage Distribution (Pie Chart Sim) */}
                    <div className="lg:col-span-1 rounded-xl bg-[#283039] border border-[#3b4754] p-6 flex flex-col h-[400px]">
                        <h3 className="text-white text-lg font-bold mb-1">Phân bổ Gói dịch vụ</h3>
                        <p className="text-[#9dabb9] text-sm mb-6">Tỷ lệ đăng ký theo loại gói</p>
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            {/* Conic Gradient for Pie Chart */}
                            <div
                                className="w-48 h-48 rounded-full relative"
                                style={{
                                    background: "conic-gradient(#2b8cee 0% 45%, #a855f7 45% 75%, #22c55e 75% 100%)",
                                    boxShadow: "0 0 20px rgba(0,0,0,0.2)"
                                }}
                            >
                                {/* Inner Hole for Donut */}
                                <div className="absolute inset-0 m-auto w-32 h-32 bg-[#283039] rounded-full flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-white">4,890</span>
                                    <span className="text-xs text-[#9dabb9]">Tổng gói</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between p-2 rounded hover:bg-[#1a222a] transition-colors cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    <span className="text-sm text-white">Gói cơ bản (Basic)</span>
                                </div>
                                <span className="text-sm font-bold text-white">45%</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded hover:bg-[#1a222a] transition-colors cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                                    <span className="text-sm text-white">Gói chuyên nghiệp (Pro)</span>
                                </div>
                                <span className="text-sm font-bold text-white">30%</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded hover:bg-[#1a222a] transition-colors cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-sm text-white">Chỉ dùng AI (AI-only)</span>
                                </div>
                                <span className="text-sm font-bold text-white">25%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tables Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Top Packages Table */}
                    <div className="xl:col-span-2 rounded-xl bg-[#283039] border border-[#3b4754] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[#3b4754] flex justify-between items-center">
                            <h3 className="text-white text-lg font-bold">Chi tiết Gói dịch vụ</h3>
                            <button className="text-primary text-sm font-medium hover:underline">Xem tất cả</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-[#9dabb9]">
                                <thead className="bg-[#1a222a] text-xs uppercase font-medium text-white">
                                    <tr>
                                        <th className="px-6 py-4">Tên gói</th>
                                        <th className="px-6 py-4 text-center">Giá</th>
                                        <th className="px-6 py-4 text-center">Đã bán</th>
                                        <th className="px-6 py-4 text-right">Doanh thu</th>
                                        <th className="px-6 py-4 text-center">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#3b4754]">
                                    <tr className="hover:bg-[#1a222a]/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="size-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined text-[18px]">star</span>
                                            </div>
                                            AESP Pro Monthly
                                        </td>
                                        <td className="px-6 py-4 text-center">₫499k</td>
                                        <td className="px-6 py-4 text-center">1,240</td>
                                        <td className="px-6 py-4 text-right text-white font-medium">₫618,760,000</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">Active</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-[#1a222a]/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="size-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-500">
                                                <span className="material-symbols-outlined text-[18px]">school</span>
                                            </div>
                                            AESP Basic
                                        </td>
                                        <td className="px-6 py-4 text-center">₫199k</td>
                                        <td className="px-6 py-4 text-center">850</td>
                                        <td className="px-6 py-4 text-right text-white font-medium">₫169,150,000</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">Active</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-[#1a222a]/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="size-8 rounded bg-purple-500/20 flex items-center justify-center text-purple-500">
                                                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                                            </div>
                                            AI Assistant Only
                                        </td>
                                        <td className="px-6 py-4 text-center">₫99k</td>
                                        <td className="px-6 py-4 text-center">2,100</td>
                                        <td className="px-6 py-4 text-right text-white font-medium">₫207,900,000</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-medium">Review</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-[#1a222a]/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="size-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-500">
                                                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                                            </div>
                                            Enterprise Pack
                                        </td>
                                        <td className="px-6 py-4 text-center">₫12M</td>
                                        <td className="px-6 py-4 text-center">15</td>
                                        <td className="px-6 py-4 text-right text-white font-medium">₫180,000,000</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">Active</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Server/System Performance Mini-Widgets */}
                    <div className="flex flex-col gap-4">
                        <div className="rounded-xl bg-[#283039] border border-[#3b4754] p-6">
                            <h3 className="text-white text-lg font-bold mb-4">Tài nguyên hệ thống</h3>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-[#9dabb9]">CPU Server Usage</span>
                                        <span className="text-white font-medium">45%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#1a222a] rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[45%] rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-[#9dabb9]">Memory (RAM)</span>
                                        <span className="text-white font-medium">72%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#1a222a] rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 w-[72%] rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-[#9dabb9]">AI Processing Nodes</span>
                                        <span className="text-white font-medium">28/30</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#1a222a] rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-[93%] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mini Promo/Alert */}
                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-[#283039] border border-primary/30 p-6 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-10">
                                <span className="material-symbols-outlined text-[120px] text-primary">analytics</span>
                            </div>
                            <h3 className="text-white text-lg font-bold mb-2 relative z-10">Cần chú ý</h3>
                            <p className="text-[#9dabb9] text-sm mb-4 relative z-10">
                                Lưu lượng truy cập đang tăng cao vào giờ cao điểm (20:00 - 22:00).
                            </p>
                            <button className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium w-full relative z-10">
                                Xem chi tiết Load Balancer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

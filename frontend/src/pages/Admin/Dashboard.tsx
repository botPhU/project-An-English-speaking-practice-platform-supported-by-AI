import React from 'react';
import { AdminLayout } from '../../components/layout';

const AdminDashboard: React.FC = () => {
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
                            <p className="text-white text-3xl font-bold leading-tight">1,245</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[#0bda5b] text-base">trending_up</span>
                                <p className="text-[#0bda5b] text-xs font-medium leading-normal">+12% so với tháng trước</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Doanh thu hàng tháng</p>
                            <span className="material-symbols-outlined text-primary text-xl">payments</span>
                        </div>
                        <div>
                            <p className="text-white text-3xl font-bold leading-tight">$45,200</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[#0bda5b] text-base">trending_up</span>
                                <p className="text-[#0bda5b] text-xs font-medium leading-normal">+5% so với tháng trước</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Gói đã bán (Tháng này)</p>
                            <span className="material-symbols-outlined text-primary text-xl">shopping_cart</span>
                        </div>
                        <div>
                            <p className="text-white text-3xl font-bold leading-tight">320</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[#0bda5b] text-base">trending_up</span>
                                <p className="text-[#0bda5b] text-xs font-medium leading-normal">+8% so với tháng trước</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tải phiên AI</p>
                            <span className="material-symbols-outlined text-primary text-xl">memory</span>
                        </div>
                        <div>
                            <p className="text-white text-3xl font-bold leading-tight">84%</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="material-symbols-outlined text-[#fa6238] text-base">trending_down</span>
                                <p className="text-[#fa6238] text-xs font-medium leading-normal">-2% dung lượng trống</p>
                            </div>
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
                        <div className="relative h-64 w-full">
                            <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 800 200">
                                <defs>
                                    <linearGradient id="chartGradient" x1={0} x2={0} y1={0} y2={1}>
                                        <stop offset="0%" stopColor="#2b8cee" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#2b8cee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <line stroke="#3e4854" strokeWidth={1} x1={0} x2={800} y1={199} y2={199} />
                                <line stroke="#3e4854" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={800} y1={150} y2={150} />
                                <line stroke="#3e4854" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={800} y1={100} y2={100} />
                                <line stroke="#3e4854" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={800} y1={50} y2={50} />
                                <path d="M0 150 C 100 140, 150 100, 200 80 S 300 120, 400 90 S 500 40, 600 50 S 700 80, 800 60 V 200 H 0 Z" fill="url(#chartGradient)" />
                                <path d="M0 150 C 100 140, 150 100, 200 80 S 300 120, 400 90 S 500 40, 600 50 S 700 80, 800 60" fill="none" stroke="#2b8cee" strokeWidth={3} />
                            </svg>
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
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-white w-16">Doanh nghiệp</span>
                                <div className="flex-1 h-3 bg-[#111418] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[35%] rounded-full" />
                                </div>
                                <span className="text-xs text-[#9dabb9]">$15.2k</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-white w-16">Cao cấp</span>
                                <div className="flex-1 h-3 bg-[#111418] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/80 w-[65%] rounded-full" />
                                </div>
                                <span className="text-xs text-[#9dabb9]">$28.4k</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-white w-16">Chuyên nghiệp</span>
                                <div className="flex-1 h-3 bg-[#111418] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/60 w-[45%] rounded-full" />
                                </div>
                                <span className="text-xs text-[#9dabb9]">$12.5k</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-white w-16">Cơ bản</span>
                                <div className="flex-1 h-3 bg-[#111418] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/40 w-[20%] rounded-full" />
                                </div>
                                <span className="text-xs text-[#9dabb9]">$5.1k</span>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-[#3e4854]/50 flex justify-between items-end">
                            <div>
                                <p className="text-xs text-[#9dabb9]">Tổng doanh thu</p>
                                <p className="text-xl font-bold text-white">$61,200</p>
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
                            <div className="flex items-center justify-between p-4 border-b border-[#3e4854]/30 hover:bg-[#2f3844] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <span className="material-symbols-outlined">person_add</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">Đơn đăng ký hướng dẫn viên mới</p>
                                        <p className="text-[#9dabb9] text-xs">Sarah Jenkins đã đăng ký làm Hướng dẫn viên ESL</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="px-3 py-1.5 rounded-lg bg-[#111418] text-white text-xs font-medium hover:bg-red-500/20 hover:text-red-400 transition-colors">
                                        Từ chối
                                    </button>
                                    <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors">
                                        Xem xét
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border-b border-[#3e4854]/30 hover:bg-[#2f3844] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                        <span className="material-symbols-outlined">flag</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">Bình luận bị gắn cờ</p>
                                        <p className="text-[#9dabb9] text-xs">Người dùng #4829 đã báo cáo trong "Tiếng Anh thương mại"</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="px-3 py-1.5 rounded-lg bg-[#111418] text-white text-xs font-medium hover:bg-red-500/20 hover:text-red-400 transition-colors">
                                        Bỏ qua
                                    </button>
                                    <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors">
                                        Kiểm duyệt
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 hover:bg-[#2f3844] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <span className="material-symbols-outlined">support_agent</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">Cảnh báo hệ thống: Độ trễ cao</p>
                                        <p className="text-[#9dabb9] text-xs">Khu vực Châu Á - Thái Bình Dương đang gặp sự cố chậm trễ</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors">
                                        Kiểm tra trạng thái
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-white text-xl font-bold px-2">Trạng thái hệ thống</h3>
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 p-5 flex flex-col gap-5 h-full">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#0bda5b]">check_circle</span>
                                    <span className="text-white text-sm font-medium">Cổng API</span>
                                </div>
                                <span className="text-[#0bda5b] text-xs font-bold bg-[#0bda5b]/10 px-2 py-1 rounded">
                                    Đang hoạt động
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#0bda5b]">smart_toy</span>
                                    <span className="text-white text-sm font-medium">Công cụ suy luận AI</span>
                                </div>
                                <span className="text-[#0bda5b] text-xs font-bold bg-[#0bda5b]/10 px-2 py-1 rounded">
                                    Thời gian hoạt động 98%
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-yellow-500">database</span>
                                    <span className="text-white text-sm font-medium">Cụm cơ sở dữ liệu</span>
                                </div>
                                <span className="text-yellow-500 text-xs font-bold bg-yellow-500/10 px-2 py-1 rounded">
                                    Sắp bảo trì
                                </span>
                            </div>
                            <div className="mt-auto pt-4 border-t border-[#3e4854]/30">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-[#9dabb9]">Tải máy chủ</span>
                                    <span className="text-xs text-white font-mono">42%</span>
                                </div>
                                <div className="w-full bg-[#111418] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: '42%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

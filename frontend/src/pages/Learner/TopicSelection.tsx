import LearnerLayout from '../../layouts/LearnerLayout';

export default function TopicSelection() {
    return (
        <LearnerLayout title="Nhập Vai AI">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Daily Challenge Hero */}
                <div className="bg-gradient-to-r from-primary/20 to-purple-600/20 p-1 rounded-2xl border border-primary/20 relative">
                    <div className="bg-surface-dark/80 backdrop-blur-sm rounded-xl p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined text-[10rem] text-primary transform -rotate-12">
                                forum
                            </span>
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-4 max-w-2xl">
                                <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">
                                    <span className="material-symbols-outlined text-sm">
                                        auto_awesome
                                    </span>
                                    THỬ THÁCH HÔM NAY
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Xử lý Khiếu nại Khách hàng
                                </h1>
                                <p className="text-text-secondary text-base leading-relaxed">
                                    Luyện tập kỹ năng giải quyết vấn đề và giữ bình tĩnh. Khách
                                    hàng đang phàn nàn về dịch vụ chậm trễ. Mục tiêu của bạn là
                                    xoa dịu họ và đưa ra giải pháp hợp lý.
                                </p>
                                <div className="flex items-center gap-4 text-sm text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg">
                                            schedule
                                        </span>{" "}
                                        10 phút
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg">
                                            signal_cellular_alt
                                        </span>{" "}
                                        Trung bình
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-lg text-yellow-500">
                                            star
                                        </span>{" "}
                                        +150 XP
                                    </span>
                                </div>
                            </div>
                            <button className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(43,140,238,0.39)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap">
                                <span className="material-symbols-outlined">play_arrow</span>
                                Bắt đầu ngay
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border-dark pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            Thư viện Tình huống
                        </h2>
                        <p className="text-text-secondary text-sm">
                            Chọn chủ đề bạn muốn cải thiện kỹ năng giao tiếp.
                        </p>
                    </div>
                    <div className="flex items-center p-1 bg-surface-dark border border-border-dark rounded-lg overflow-x-auto w-full md:w-auto">
                        <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
                            Tất cả
                        </button>
                        <button className="px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
                            Công việc
                        </button>
                        <button className="px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
                            Du lịch
                        </button>
                        <button className="px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
                            Đời sống
                        </button>
                        <button className="px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-md text-sm font-medium whitespace-nowrap transition-colors">
                            IELTS
                        </button>
                    </div>
                </div>

                {/* Scenario Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                    {/* Card 1: Job Interview */}
                    <div className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(43,140,238,0.1)] transition-all duration-300 flex flex-col h-full">
                        <div className="h-40 bg-gradient-to-br from-blue-900/40 to-slate-900 flex items-center justify-center relative group-hover:from-blue-800/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-blue-400">
                                    work
                                </span>
                            </div>
                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-500 border border-white/10">
                                Cao cấp
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                    Phỏng vấn xin việc
                                </h3>
                                <p className="text-text-secondary text-sm line-clamp-2">
                                    Luyện tập trả lời các câu hỏi phổ biến như "Điểm mạnh của
                                    bạn là gì?" và đàm phán lương.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-dark/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                                        Công việc
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">
                                            schedule
                                        </span>{" "}
                                        15m
                                    </span>
                                </div>
                                <button className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Hotel Booking */}
                    <div className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(43,140,238,0.1)] transition-all duration-300 flex flex-col h-full">
                        <div className="h-40 bg-gradient-to-br from-orange-900/40 to-slate-900 flex items-center justify-center relative group-hover:from-orange-800/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-orange-400">
                                    hotel
                                </span>
                            </div>
                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-blue-400 border border-white/10">
                                Trung cấp
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                    Đặt phòng Khách sạn
                                </h3>
                                <p className="text-text-secondary text-sm line-clamp-2">
                                    Gọi điện đặt phòng, hỏi về các tiện nghi và thay đổi ngày
                                    đặt phòng.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-dark/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                                        Du lịch
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">
                                            schedule
                                        </span>{" "}
                                        8m
                                    </span>
                                </div>
                                <button className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Restaurant */}
                    <div className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(43,140,238,0.1)] transition-all duration-300 flex flex-col h-full">
                        <div className="h-40 bg-gradient-to-br from-emerald-900/40 to-slate-900 flex items-center justify-center relative group-hover:from-emerald-800/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-emerald-400">
                                    restaurant_menu
                                </span>
                            </div>
                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-green-400 border border-white/10">
                                Cơ bản
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                    Gọi món tại Nhà hàng
                                </h3>
                                <p className="text-text-secondary text-sm line-clamp-2">
                                    Học cách gọi món, hỏi về các thành phần món ăn và yêu cầu
                                    thanh toán.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-dark/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                                        Đời sống
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">
                                            schedule
                                        </span>{" "}
                                        10m
                                    </span>
                                </div>
                                <button className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Shopping */}
                    <div className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(43,140,238,0.1)] transition-all duration-300 flex flex-col h-full">
                        <div className="h-40 bg-gradient-to-br from-pink-900/40 to-slate-900 flex items-center justify-center relative group-hover:from-pink-800/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-pink-400">
                                    shopping_bag
                                </span>
                            </div>
                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-green-400 border border-white/10">
                                Cơ bản
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                    Mua sắm &amp; Mặc cả
                                </h3>
                                <p className="text-text-secondary text-sm line-clamp-2">
                                    Hỏi giá, thử quần áo, hỏi về size và thương lượng giá cả tại
                                    chợ.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-dark/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                                        Đời sống
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">
                                            schedule
                                        </span>{" "}
                                        12m
                                    </span>
                                </div>
                                <button className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 5: Airport */}
                    <div className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(43,140,238,0.1)] transition-all duration-300 flex flex-col h-full">
                        <div className="h-40 bg-gradient-to-br from-cyan-900/40 to-slate-900 flex items-center justify-center relative group-hover:from-cyan-800/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-cyan-400">
                                    flight_takeoff
                                </span>
                            </div>
                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-blue-400 border border-white/10">
                                Trung cấp
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                    Làm thủ tục Sân bay
                                </h3>
                                <p className="text-text-secondary text-sm line-clamp-2">
                                    Check-in, ký gửi hành lý, qua cửa an ninh và tìm cửa ra máy
                                    bay.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-dark/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                                        Du lịch
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">
                                            schedule
                                        </span>{" "}
                                        10m
                                    </span>
                                </div>
                                <button className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 6: Small Talk */}
                    <div className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(43,140,238,0.1)] transition-all duration-300 flex flex-col h-full">
                        <div className="h-40 bg-gradient-to-br from-indigo-900/40 to-slate-900 flex items-center justify-center relative group-hover:from-indigo-800/40 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-4xl text-indigo-400">
                                    diversity_3
                                </span>
                            </div>
                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-green-400 border border-white/10">
                                Cơ bản
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                    Trò chuyện Xã giao
                                </h3>
                                <p className="text-text-secondary text-sm line-clamp-2">
                                    Bắt chuyện với người lạ, nói về thời tiết, sở thích và kết
                                    bạn mới.
                                </p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border-dark/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-text-secondary bg-white/5 px-2 py-1 rounded">
                                        Giao tiếp
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">
                                            schedule
                                        </span>{" "}
                                        5m
                                    </span>
                                </div>
                                <button className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LearnerLayout>
    );
}

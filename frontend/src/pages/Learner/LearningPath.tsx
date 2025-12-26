import LearnerLayout from '../../layouts/LearnerLayout';

export default function LearningPath() {
    return (
        <LearnerLayout title="Lộ Trình Của Tôi">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#1c2127] to-[#101922] p-6 md:p-8 rounded-2xl border border-border-dark relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[12rem] text-primary transform rotate-12">
                            flag
                        </span>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">
                                <span className="material-symbols-outlined text-sm">
                                    school
                                </span>
                                CHƯƠNG TRÌNH TRUNG CẤP
                            </div>
                            <h1 className="text-3xl font-bold text-white">
                                Tiếng Anh Giao Tiếp (B1)
                            </h1>
                            <p className="text-text-secondary max-w-xl">
                                Lộ trình được cá nhân hóa để cải thiện độ trôi chảy và mở rộng
                                vốn từ vựng về các chủ đề du lịch và công việc.
                            </p>
                            <div className="pt-2">
                                <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
                                    <span>Tiến độ tổng thể</span>
                                    <span className="text-white font-bold">45%</span>
                                </div>
                                <div className="w-full bg-border-dark rounded-full h-2.5">
                                    <div
                                        className="bg-primary h-2.5 rounded-full shadow-[0_0_10px_rgba(43,140,238,0.5)]"
                                        style={{ width: "45%" }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-center p-3 bg-surface-dark border border-border-dark rounded-xl min-w-[100px]">
                                <p className="text-2xl font-bold text-white">12</p>
                                <p className="text-xs text-text-secondary uppercase mt-1">
                                    Bài đã học
                                </p>
                            </div>
                            <div className="text-center p-3 bg-surface-dark border border-border-dark rounded-xl min-w-[100px]">
                                <p className="text-2xl font-bold text-yellow-500">B1</p>
                                <p className="text-xs text-text-secondary uppercase mt-1">
                                    Trình độ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative pl-8 md:pl-12 space-y-10">
                    <div className="absolute left-4 md:left-6 top-2 bottom-8 w-0.5 bg-border-dark" />

                    {/* Unit 1: Completed */}
                    <div className="relative group">
                        <div className="absolute -left-8 md:-left-[34px] w-8 h-8 rounded-full bg-surface-dark border-2 border-green-500 flex items-center justify-center z-10">
                            <span className="material-symbols-outlined text-green-500 text-sm font-bold">
                                check
                            </span>
                        </div>
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-green-500/50 transition-colors opacity-80 hover:opacity-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                            waving_hand
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-white text-lg font-bold">
                                            Unit 1: Giới thiệu &amp; Làm quen
                                        </h3>
                                        <p className="text-text-secondary text-sm">
                                            Chào hỏi, giới thiệu bản thân và gia đình.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-center">
                                    <span className="px-3 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                                        ĐÃ HOÀN THÀNH
                                    </span>
                                    <button
                                        className="text-text-secondary hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                                        title="Xem lại"
                                    >
                                        <span className="material-symbols-outlined">replay</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unit 2: Completed */}
                    <div className="relative group">
                        <div className="absolute -left-8 md:-left-[34px] w-8 h-8 rounded-full bg-surface-dark border-2 border-green-500 flex items-center justify-center z-10">
                            <span className="material-symbols-outlined text-green-500 text-sm font-bold">
                                check
                            </span>
                        </div>
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-green-500/50 transition-colors opacity-80 hover:opacity-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                            interests
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-white text-lg font-bold">
                                            Unit 2: Sở thích &amp; Thói quen
                                        </h3>
                                        <p className="text-text-secondary text-sm">
                                            Nói về các hoạt động giải trí và thời gian rảnh.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-center">
                                    <span className="px-3 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                                        ĐÃ HOÀN THÀNH
                                    </span>
                                    <button
                                        className="text-text-secondary hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                                        title="Xem lại"
                                    >
                                        <span className="material-symbols-outlined">replay</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unit 3: In Progress */}
                    <div className="relative">
                        <div className="absolute -left-8 md:-left-[34px] w-8 h-8 rounded-full bg-primary border-4 border-surface-dark shadow-[0_0_0_2px_rgba(43,140,238,1)] flex items-center justify-center z-10">
                            <span className="material-symbols-outlined text-white text-sm font-bold animate-pulse">
                                play_arrow
                            </span>
                        </div>
                        <div className="bg-surface-dark border-2 border-primary rounded-xl overflow-hidden shadow-[0_0_30px_rgba(43,140,238,0.15)] relative">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                                </span>
                            </div>
                            <div className="p-6 border-b border-border-dark">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div
                                        className="w-full md:w-48 h-32 rounded-lg bg-cover bg-center flex-shrink-0 border border-border-dark"
                                        style={{
                                            backgroundImage:
                                                'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400")'
                                        }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-primary font-bold text-xs uppercase tracking-wider">
                                                Đang Tiến Hành
                                            </span>
                                            <span className="text-text-secondary text-xs">•</span>
                                            <span className="text-text-secondary text-xs">
                                                Unit 3
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            Thảo luận Kế hoạch Du lịch
                                        </h3>
                                        <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                                            Học cách lên kế hoạch, đặt vé máy bay và khách sạn.
                                            Luyện tập các mẫu câu thì tương lai gần (be going to) và
                                            tương lai đơn (will).
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex justify-between text-xs mb-1 text-text-secondary font-medium">
                                                    <span>Tiến độ bài học</span>
                                                    <span className="text-primary">65%</span>
                                                </div>
                                                <div className="w-full bg-[#101922] rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: "65%" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#151a20] p-4 space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-dark border border-border-dark/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">
                                                check
                                            </span>
                                        </div>
                                        <span className="text-text-secondary line-through decoration-text-secondary text-sm">
                                            Từ vựng: Phương tiện đi lại
                                        </span>
                                    </div>
                                    <span className="text-green-500 text-xs font-bold">
                                        100 XP
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-dark border border-border-dark/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">
                                                check
                                            </span>
                                        </div>
                                        <span className="text-text-secondary line-through decoration-text-secondary text-sm">
                                            Ngữ pháp: Tương lai đơn vs Gần
                                        </span>
                                    </div>
                                    <span className="text-green-500 text-xs font-bold">
                                        150 XP
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30 cursor-pointer hover:bg-primary/20 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm">
                                                mic
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm">
                                                Luyện nói: Đặt phòng Khách sạn
                                            </span>
                                            <span className="text-primary text-xs">
                                                Tiếp theo • 5 phút
                                            </span>
                                        </div>
                                    </div>
                                    <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
                                        Bắt đầu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unit 4: Locked */}
                    <div className="relative">
                        <div className="absolute -left-8 md:-left-[34px] w-8 h-8 rounded-full bg-surface-dark border-2 border-border-dark flex items-center justify-center z-10">
                            <span className="material-symbols-outlined text-text-secondary text-sm">
                                lock
                            </span>
                        </div>
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-5 opacity-60 grayscale hover:grayscale-0 hover:opacity-80 transition-all cursor-not-allowed">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-[#283039] flex items-center justify-center text-text-secondary flex-shrink-0">
                                        <span className="material-symbols-outlined">work</span>
                                    </div>
                                    <div>
                                        <h3 className="text-text-secondary text-lg font-bold">
                                            Unit 4: Công việc &amp; Sự nghiệp
                                        </h3>
                                        <p className="text-text-secondary text-sm">
                                            Phỏng vấn xin việc và môi trường công sở.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center bg-[#283039] px-3 py-1.5 rounded text-text-secondary text-xs font-medium">
                                    <span className="material-symbols-outlined text-sm">
                                        lock
                                    </span>
                                    Chưa mở khóa
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Unit 5: Locked */}
                    <div className="relative">
                        <div className="absolute -left-8 md:-left-[34px] w-8 h-8 rounded-full bg-surface-dark border-2 border-border-dark flex items-center justify-center z-10">
                            <span className="material-symbols-outlined text-text-secondary text-sm">
                                lock
                            </span>
                        </div>
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-5 opacity-40 grayscale cursor-not-allowed">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-[#283039] flex items-center justify-center text-text-secondary flex-shrink-0">
                                        <span className="material-symbols-outlined">
                                            shopping_bag
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-text-secondary text-lg font-bold">
                                            Unit 5: Mua sắm &amp; Dịch vụ
                                        </h3>
                                        <p className="text-text-secondary text-sm">
                                            Mặc cả, hỏi giá và khiếu nại dịch vụ.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <span className="material-symbols-outlined text-border-dark">
                                        lock
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-center pt-8 pb-12">
                    <button className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-medium">
                        <span className="material-symbols-outlined">expand_more</span>
                        Xem toàn bộ lộ trình
                    </button>
                </div>
            </div>
        </LearnerLayout>
    );
}

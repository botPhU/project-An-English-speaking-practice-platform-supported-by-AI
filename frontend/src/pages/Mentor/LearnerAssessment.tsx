import MentorLayout from '../../layouts/MentorLayout';

// Learner Assessment - Tổ chức đánh giá và xếp level cho learner
export default function LearnerAssessment() {
    const assessmentCategories = [
        { name: 'Speaking', icon: 'record_voice_over', weight: 30 },
        { name: 'Listening', icon: 'hearing', weight: 25 },
        { name: 'Grammar', icon: 'spellcheck', weight: 20 },
        { name: 'Vocabulary', icon: 'menu_book', weight: 15 },
        { name: 'Fluency', icon: 'speed', weight: 10 },
    ];

    const levels = [
        { name: 'A1', label: 'Beginner', range: '0-20', description: 'Có thể hiểu và sử dụng các cụm từ cơ bản' },
        { name: 'A2', label: 'Elementary', range: '21-40', description: 'Có thể giao tiếp trong các tình huống đơn giản' },
        { name: 'B1', label: 'Intermediate', range: '41-60', description: 'Có thể xử lý hầu hết các tình huống du lịch' },
        { name: 'B2', label: 'Upper-Int', range: '61-80', description: 'Có thể tương tác với mức độ trôi chảy' },
        { name: 'C1', label: 'Advanced', range: '81-90', description: 'Có thể sử dụng ngôn ngữ linh hoạt và hiệu quả' },
        { name: 'C2', label: 'Proficient', range: '91-100', description: 'Có thể hiểu và diễn đạt mọi thứ dễ dàng' },
    ];

    const recentAssessments = [
        { learner: 'Nguyễn Văn An', date: 'Hôm nay', previousLevel: 'A2', currentLevel: 'B1', score: 58, change: '+12' },
        { learner: 'Trần Thị Bình', date: 'Hôm qua', previousLevel: 'B1', currentLevel: 'B1', score: 52, change: '+3' },
        { learner: 'Lê Hoàng Cường', date: '3 ngày trước', previousLevel: 'B2', currentLevel: 'C1', score: 82, change: '+15' },
        { learner: 'Phạm Minh Dương', date: '1 tuần trước', previousLevel: 'A1', currentLevel: 'A2', score: 35, change: '+18' },
    ];

    const pendingAssessments = [
        { learner: 'Võ Thị Hồng', requestDate: 'Hôm nay', reason: 'Đánh giá hàng tháng' },
        { learner: 'Đặng Quang Huy', requestDate: 'Hôm qua', reason: 'Học viên mới' },
        { learner: 'Bùi Thị Mai', requestDate: '2 ngày trước', reason: 'Yêu cầu thăng cấp' },
    ];

    return (
        <MentorLayout
            title="Đánh giá học viên"
            icon="assessment"
            subtitle="Tổ chức đánh giá và xếp level cho học viên"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Assessment Categories */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-4">Tiêu chí đánh giá</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {assessmentCategories.map((cat, index) => (
                            <div
                                key={index}
                                className="text-center p-4 rounded-xl bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-all"
                            >
                                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                                    <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
                                </div>
                                <p className="font-bold text-white">{cat.name}</p>
                                <p className="text-sm text-primary">{cat.weight}%</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Level Scale */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-4">Thang điểm CEFR</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {levels.map((level, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl font-black text-primary">{level.name}</span>
                                    <span className="text-xs text-[#9dabb9]">({level.range})</span>
                                </div>
                                <p className="text-sm font-bold text-white mb-1">{level.label}</p>
                                <p className="text-xs text-[#9dabb9]">{level.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Assessments */}
                    <div className="lg:col-span-2 rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                            <div>
                                <h3 className="text-lg font-bold text-white">Đánh giá gần đây</h3>
                                <p className="text-sm text-[#9dabb9]">Kết quả xếp level học viên</p>
                            </div>
                            <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                                Xem tất cả →
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#3e4854]/20">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Học viên</th>
                                        <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Ngày</th>
                                        <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Trước</th>
                                        <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Sau</th>
                                        <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Điểm</th>
                                        <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Thay đổi</th>
                                        <th className="text-left p-4 text-sm font-medium text-[#9dabb9]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#3e4854]/30">
                                    {recentAssessments.map((assessment, index) => (
                                        <tr key={index} className="hover:bg-[#3e4854]/10 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                        {assessment.learner.split(' ').pop()?.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-white">{assessment.learner}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[#9dabb9] text-sm">{assessment.date}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs font-bold">
                                                    {assessment.previousLevel}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold">
                                                    {assessment.currentLevel}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-white font-bold">{assessment.score}</span>
                                                <span className="text-[#9dabb9]">/100</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-green-400 font-bold">{assessment.change}</span>
                                            </td>
                                            <td className="p-4">
                                                <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pending Assessments */}
                    <div className="space-y-4">
                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-white">Chờ đánh giá</h3>
                                <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                                    {pendingAssessments.length}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {pendingAssessments.map((item, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-white">{item.learner}</span>
                                            <span className="text-xs text-[#9dabb9]">{item.requestDate}</span>
                                        </div>
                                        <p className="text-xs text-primary mb-3">{item.reason}</p>
                                        <button className="w-full px-3 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                            Bắt đầu đánh giá
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-xl bg-primary p-5 text-white">
                            <h3 className="font-bold mb-3">Công cụ đánh giá</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left">
                                    <span className="material-symbols-outlined">quiz</span>
                                    <span className="text-sm font-medium">Tạo bài test mới</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left">
                                    <span className="material-symbols-outlined">analytics</span>
                                    <span className="text-sm font-medium">Xem thống kê</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left">
                                    <span className="material-symbols-outlined">download</span>
                                    <span className="text-sm font-medium">Xuất báo cáo</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

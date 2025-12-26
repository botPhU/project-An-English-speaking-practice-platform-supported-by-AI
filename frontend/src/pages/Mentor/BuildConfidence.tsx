import MentorLayout from '../../layouts/MentorLayout';

// Build Confidence - Xây dựng sự tự tin cho học viên
export default function BuildConfidence() {
    const techniques = [
        {
            title: 'Positive Reinforcement',
            icon: 'thumb_up',
            description: 'Khen ngợi những tiến bộ dù nhỏ nhất để xây dựng động lực',
            tips: ['Sử dụng lời khen cụ thể', 'Nhận xét tích cực trước khi sửa lỗi', 'Tạo không khí thoải mái']
        },
        {
            title: 'Gradual Exposure',
            icon: 'trending_up',
            description: 'Từng bước đưa học viên vào các tình huống giao tiếp khó hơn',
            tips: ['Bắt đầu từ tình huống quen thuộc', 'Tăng dần độ khó', 'Không gây áp lực']
        },
        {
            title: 'Error Acceptance',
            icon: 'psychology',
            description: 'Giúp học viên hiểu rằng lỗi là một phần của quá trình học',
            tips: ['Chia sẻ lỗi của bản thân', 'Biến lỗi thành cơ hội học hỏi', 'Không phán xét']
        },
        {
            title: 'Role Modeling',
            icon: 'record_voice_over',
            description: 'Trình diễn cách giao tiếp tự tin để học viên học theo',
            tips: ['Làm mẫu rõ ràng', 'Giải thích ngôn ngữ cơ thể', 'Luyện tập cùng học viên']
        },
    ];

    const activities = [
        { name: 'Mirror Practice', duration: '10 phút', difficulty: 'Easy', description: 'Luyện nói trước gương' },
        { name: 'Voice Recording', duration: '15 phút', difficulty: 'Easy', description: 'Ghi âm và nghe lại' },
        { name: 'Shadowing', duration: '20 phút', difficulty: 'Medium', description: 'Nghe và lặp lại ngay' },
        { name: 'Mock Interview', duration: '30 phút', difficulty: 'Hard', description: 'Phỏng vấn giả lập' },
    ];

    const learnerProgress = [
        { name: 'Nguyễn Văn An', before: 45, after: 72, change: '+27%' },
        { name: 'Trần Thị Bình', before: 55, after: 78, change: '+23%' },
        { name: 'Lê Hoàng Cường', before: 38, after: 68, change: '+30%' },
    ];

    return (
        <MentorLayout
            title="Xây dựng tự tin"
            icon="emoji_events"
            subtitle="Giúp học viên vượt qua nỗi sợ giao tiếp"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Hero Section */}
                <div className="rounded-xl bg-primary p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black mb-2">💪 Tự tin là chìa khóa thành công</h2>
                        <p className="text-white/90 max-w-2xl">
                            Nhiều học viên có kiến thức tốt nhưng thiếu tự tin khi giao tiếp.
                            Mentor đóng vai trò quan trọng trong việc xây dựng và củng cố sự tự tin cho họ.
                        </p>
                    </div>
                </div>

                {/* Techniques Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {techniques.map((technique, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-primary text-2xl">{technique.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{technique.title}</h3>
                                    <p className="text-sm text-[#9dabb9] mb-3">{technique.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {technique.tips.map((tip, tipIndex) => (
                                            <span key={tipIndex} className="px-2 py-1 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs">
                                                {tip}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activities */}
                    <div className="lg:col-span-2 rounded-xl bg-[#283039] border border-[#3e4854]/30">
                        <div className="p-5 border-b border-[#3e4854]/30">
                            <h3 className="text-lg font-bold text-white">Hoạt động xây dựng tự tin</h3>
                            <p className="text-sm text-[#9dabb9]">Gán các hoạt động này cho học viên</p>
                        </div>
                        <div className="p-5 space-y-3">
                            {activities.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">play_arrow</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-primary transition-colors">{activity.name}</h4>
                                            <p className="text-xs text-[#9dabb9]">{activity.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${activity.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                activity.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {activity.difficulty}
                                        </span>
                                        <span className="text-sm text-[#9dabb9]">{activity.duration}</span>
                                        <button className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all">
                                            Gán
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Tracking */}
                    <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30">
                        <div className="p-5 border-b border-[#3e4854]/30">
                            <h3 className="font-bold text-white">Tiến bộ về sự tự tin</h3>
                            <p className="text-sm text-[#9dabb9]">Confidence score của học viên</p>
                        </div>
                        <div className="p-5 space-y-4">
                            {learnerProgress.map((learner, index) => (
                                <div key={index} className="p-3 rounded-lg bg-[#3e4854]/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-white">{learner.name}</span>
                                        <span className="text-green-400 font-bold text-sm">{learner.change}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-[#9dabb9]">{learner.before}%</span>
                                        <div className="flex-1 h-2 bg-[#3e4854] rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${learner.after}%` }}></div>
                                        </div>
                                        <span className="text-xs text-primary font-bold">{learner.after}%</span>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                                Xem báo cáo chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

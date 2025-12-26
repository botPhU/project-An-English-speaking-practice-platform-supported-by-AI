import MentorLayout from '../../layouts/MentorLayout';

// Feedback Session - Phản hồi sau khi luyện tập
export default function FeedbackSession() {
    const pendingFeedback = [
        {
            learner: 'Nguyễn Văn An',
            sessionType: 'Speaking Practice',
            topic: 'Job Interview',
            date: 'Hôm nay, 09:00',
            duration: '25 phút',
            errors: { pronunciation: 3, grammar: 2, vocabulary: 1 },
            status: 'pending'
        },
        {
            learner: 'Trần Thị Bình',
            sessionType: 'Role Play',
            topic: 'Restaurant Ordering',
            date: 'Hôm nay, 10:30',
            duration: '18 phút',
            errors: { pronunciation: 1, grammar: 4, vocabulary: 2 },
            status: 'pending'
        },
        {
            learner: 'Lê Hoàng Cường',
            sessionType: 'Presentation',
            topic: 'Business Proposal',
            date: 'Hôm qua, 14:00',
            duration: '32 phút',
            errors: { pronunciation: 2, grammar: 1, vocabulary: 3 },
            status: 'in-progress'
        },
    ];

    const feedbackTemplates = [
        { name: 'Pronunciation Focus', icon: 'record_voice_over', count: 12 },
        { name: 'Grammar Correction', icon: 'spellcheck', count: 18 },
        { name: 'Vocabulary Building', icon: 'menu_book', count: 8 },
        { name: 'Fluency Improvement', icon: 'speed', count: 6 },
        { name: 'Confidence Boost', icon: 'emoji_events', count: 10 },
    ];

    const recentFeedback = [
        { learner: 'Phạm Minh Dương', topic: 'Daily Conversation', rating: 4.5, date: '2 ngày trước' },
        { learner: 'Võ Thị Hồng', topic: 'Travel Dialogue', rating: 5, date: '3 ngày trước' },
        { learner: 'Đặng Quang Huy', topic: 'Phone Conversation', rating: 4, date: '4 ngày trước' },
    ];

    return (
        <MentorLayout
            title="Phản hồi & Đánh giá"
            icon="rate_review"
            subtitle="Cho phản hồi ngay sau khi luyện tập và hướng dẫn cải thiện"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Chờ phản hồi</p>
                            <span className="material-symbols-outlined text-yellow-400 text-xl">pending</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">5</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đang viết</p>
                            <span className="material-symbols-outlined text-blue-400 text-xl">edit</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">2</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đã gửi (tháng)</p>
                            <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">156</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đánh giá TB</p>
                            <span className="material-symbols-outlined text-primary text-xl">star</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">4.8</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Feedback List */}
                    <div className="lg:col-span-2 rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                            <div>
                                <h3 className="text-lg font-bold text-white">Phiên cần phản hồi</h3>
                                <p className="text-sm text-[#9dabb9]">Xem lại và gửi feedback cho học viên</p>
                            </div>
                            <select className="px-3 py-2 rounded-lg bg-[#3e4854]/30 border border-[#3e4854]/30 text-[#9dabb9] text-sm focus:outline-none focus:border-primary/50">
                                <option>Tất cả phiên</option>
                                <option>Chờ phản hồi</option>
                                <option>Đang viết</option>
                            </select>
                        </div>
                        <div className="divide-y divide-[#3e4854]/30">
                            {pendingFeedback.map((session, index) => (
                                <div key={index} className="p-5 hover:bg-[#3e4854]/10 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {session.learner.split(' ').pop()?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-white">{session.learner}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${session.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {session.status === 'pending' ? 'Chờ' : 'Đang viết'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[#9dabb9]">{session.sessionType}: {session.topic}</p>
                                                <p className="text-xs text-[#9dabb9]/70">{session.date} • {session.duration}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex gap-3">
                                                <div className="text-center">
                                                    <span className="text-red-400 font-bold">{session.errors.pronunciation}</span>
                                                    <p className="text-[10px] text-[#9dabb9]">Phát âm</p>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-yellow-400 font-bold">{session.errors.grammar}</span>
                                                    <p className="text-[10px] text-[#9dabb9]">Ngữ pháp</p>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-blue-400 font-bold">{session.errors.vocabulary}</span>
                                                    <p className="text-[10px] text-[#9dabb9]">Từ vựng</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined">play_arrow</span>
                                                </button>
                                                <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                                    Viết phản hồi
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Feedback Templates */}
                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="font-bold text-white mb-4">Mẫu phản hồi</h3>
                            <div className="space-y-2">
                                {feedbackTemplates.map((template, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary">{template.icon}</span>
                                            <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{template.name}</span>
                                        </div>
                                        <span className="text-xs text-[#9dabb9]">{template.count}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary hover:text-white transition-all">
                                <span className="material-symbols-outlined text-lg">add</span>
                                Tạo mẫu mới
                            </button>
                        </div>

                        {/* Recent Feedback */}
                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="font-bold text-white mb-4">Phản hồi gần đây</h3>
                            <div className="space-y-3">
                                {recentFeedback.map((fb, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#3e4854]/20 transition-colors cursor-pointer">
                                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                            {fb.learner.split(' ').pop()?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{fb.learner}</p>
                                            <p className="text-xs text-[#9dabb9]">{fb.topic}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                <span className="material-symbols-outlined text-sm">star</span>
                                                <span className="text-sm font-bold">{fb.rating}</span>
                                            </div>
                                            <p className="text-[10px] text-[#9dabb9]">{fb.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📝 Mẹo viết phản hồi hiệu quả</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-start gap-3">
                            <span className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</span>
                            <p className="text-sm text-[#9dabb9]">Bắt đầu bằng điểm tích cực ("sandwich feedback")</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">2</span>
                            <p className="text-sm text-[#9dabb9]">Cụ thể hóa lỗi và cách sửa</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">3</span>
                            <p className="text-sm text-[#9dabb9]">Gợi ý bài tập để cải thiện</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">4</span>
                            <p className="text-sm text-[#9dabb9]">Kết thúc với lời động viên</p>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

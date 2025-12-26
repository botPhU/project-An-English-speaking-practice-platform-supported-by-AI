import MentorLayout from '../../layouts/MentorLayout';

// Provide Conversation Topics - Cung cấp chủ đề và tình huống hội thoại thực tế
export default function ConversationTopics() {
    const topicCategories = [
        { name: 'Daily Life', icon: 'home', count: 24 },
        { name: 'Work & Business', icon: 'work', count: 18 },
        { name: 'Travel', icon: 'flight', count: 15 },
        { name: 'Education', icon: 'school', count: 12 },
        { name: 'Health', icon: 'favorite', count: 10 },
        { name: 'Technology', icon: 'devices', count: 8 },
    ];

    const featuredTopics = [
        {
            title: 'Job Interview Practice',
            category: 'Work & Business',
            level: 'Intermediate',
            duration: '20 phút',
            description: 'Luyện tập trả lời các câu hỏi phỏng vấn phổ biến nhất',
            questions: ['Tell me about yourself', 'Why do you want this job?', 'What are your strengths?'],
            popularity: 85
        },
        {
            title: 'Ordering at a Restaurant',
            category: 'Daily Life',
            level: 'Beginner',
            duration: '15 phút',
            description: 'Học cách gọi món, hỏi về thực đơn và thanh toán',
            questions: ['Can I see the menu?', 'What would you recommend?', 'Can I have the bill?'],
            popularity: 92
        },
        {
            title: 'Discussing Weekend Plans',
            category: 'Daily Life',
            level: 'Beginner',
            duration: '10 phút',
            description: 'Chia sẻ và hỏi về kế hoạch cuối tuần',
            questions: ['What are you doing this weekend?', 'Would you like to join us?', 'That sounds fun!'],
            popularity: 78
        },
        {
            title: 'Presenting a Business Proposal',
            category: 'Work & Business',
            level: 'Advanced',
            duration: '30 phút',
            description: 'Thuyết trình ý tưởng kinh doanh một cách chuyên nghiệp',
            questions: ['Let me walk you through...', 'The key benefits are...', 'Any questions so far?'],
            popularity: 65
        },
    ];

    const recentlyUsed = [
        { topic: 'Airport Check-in', learner: 'Nguyễn Văn An', time: '2 giờ trước' },
        { topic: 'Doctor Visit', learner: 'Trần Thị Bình', time: '4 giờ trước' },
        { topic: 'Hotel Booking', learner: 'Lê Hoàng Cường', time: 'Hôm qua' },
    ];

    return (
        <MentorLayout
            title="Chủ đề hội thoại"
            icon="forum"
            subtitle="Cung cấp chủ đề và tình huống hội thoại thực tế cho học viên"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Topic Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {topicCategories.map((cat, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-4 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all cursor-pointer group text-center"
                        >
                            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
                            </div>
                            <p className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{cat.name}</p>
                            <p className="text-xs text-[#9dabb9]">{cat.count} chủ đề</p>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Featured Topics */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Chủ đề nổi bật</h3>
                            <div className="flex gap-2">
                                <select className="px-3 py-2 rounded-lg bg-[#283039] border border-[#3e4854]/30 text-[#9dabb9] text-sm focus:outline-none focus:border-primary/50">
                                    <option>Tất cả level</option>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                    Tạo chủ đề
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {featuredTopics.map((topic, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <span className="px-2 py-0.5 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs mb-2 inline-block">
                                                {topic.category}
                                            </span>
                                            <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                                                {topic.title}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <span className="material-symbols-outlined text-sm">star</span>
                                            <span className="text-sm font-bold">{topic.popularity}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#9dabb9] mb-4">{topic.description}</p>
                                    <div className="space-y-2 mb-4">
                                        {topic.questions.slice(0, 2).map((q, qIndex) => (
                                            <div key={qIndex} className="flex items-center gap-2 text-sm text-primary/80">
                                                <span className="material-symbols-outlined text-base">chat_bubble</span>
                                                "{q}"
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-[#3e4854]/30">
                                        <div className="flex items-center gap-4 text-xs text-[#9dabb9]">
                                            <span className={`px-2 py-1 rounded ${topic.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                                    topic.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {topic.level}
                                            </span>
                                            <span>⏱ {topic.duration}</span>
                                        </div>
                                        <button className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all">
                                            Sử dụng
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Recently Used */}
                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="font-bold text-white mb-4">Vừa sử dụng</h3>
                            <div className="space-y-3">
                                {recentlyUsed.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#3e4854]/20 transition-colors cursor-pointer">
                                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-sm">history</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{item.topic}</p>
                                            <p className="text-xs text-[#9dabb9]">{item.learner} • {item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Create */}
                        <div className="rounded-xl bg-primary p-5 text-white">
                            <h3 className="font-bold mb-2">Tạo nhanh chủ đề</h3>
                            <p className="text-sm text-white/80 mb-4">
                                Sử dụng AI để tạo chủ đề hội thoại tùy chỉnh theo yêu cầu của học viên
                            </p>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-bold">
                                <span className="material-symbols-outlined">auto_awesome</span>
                                Tạo với AI
                            </button>
                        </div>

                        {/* Tips */}
                        <div className="rounded-xl bg-primary/10 border border-primary/20 p-5">
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-400">lightbulb</span>
                                Mẹo hay
                            </h3>
                            <p className="text-sm text-[#9dabb9]">
                                Chọn chủ đề phù hợp với mục tiêu thực tế của học viên.
                                Nếu họ chuẩn bị đi du lịch, hãy tập trung vào Travel topics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

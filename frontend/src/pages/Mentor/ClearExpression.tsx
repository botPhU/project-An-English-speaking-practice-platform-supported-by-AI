import MentorLayout from '../../layouts/MentorLayout';

// Clear Expression - Hướng dẫn diễn đạt rõ ràng
export default function ClearExpression() {
    const expressionTechniques = [
        {
            title: 'KISS Principle',
            subtitle: 'Keep It Short and Simple',
            icon: 'compress',
            description: 'Sử dụng câu ngắn gọn, từ ngữ đơn giản để truyền đạt ý nghĩa rõ ràng hơn.',
            examples: [
                { before: 'Due to the fact that...', after: 'Because...' },
                { before: 'In the event that...', after: 'If...' },
            ]
        },
        {
            title: 'Active Voice',
            subtitle: 'Chủ động thay vì bị động',
            icon: 'bolt',
            description: 'Câu chủ động trực tiếp và mạnh mẽ hơn câu bị động.',
            examples: [
                { before: 'The report was written by me.', after: 'I wrote the report.' },
                { before: 'Mistakes were made.', after: 'We made mistakes.' },
            ]
        },
        {
            title: 'Concrete Language',
            subtitle: 'Ngôn ngữ cụ thể',
            icon: 'inventory_2',
            description: 'Dùng từ cụ thể thay vì từ mơ hồ để người nghe hiểu chính xác.',
            examples: [
                { before: 'We need it soon.', after: 'We need it by Friday 5 PM.' },
                { before: 'It was a good meeting.', after: 'We agreed on 3 action items.' },
            ]
        },
        {
            title: 'Logical Flow',
            subtitle: 'Mạch logic rõ ràng',
            icon: 'account_tree',
            description: 'Sắp xếp ý tưởng theo trình tự hợp lý, dùng từ nối phù hợp.',
            examples: [
                { before: 'Random points...', after: 'First... Then... Finally...' },
                { before: 'Jumping topics', after: 'However, Therefore...' },
            ]
        },
    ];

    const practiceExercises = [
        { title: 'Simplify Complex Sentences', type: 'Rewrite', count: 10, time: '15 phút' },
        { title: 'Active → Passive Conversion', type: 'Transform', count: 8, time: '10 phút' },
        { title: 'Add Transitions', type: 'Gap Fill', count: 12, time: '12 phút' },
        { title: 'Summarize a Paragraph', type: 'Writing', count: 3, time: '20 phút' },
    ];

    const learnerSubmissions = [
        {
            learner: 'Nguyễn Văn An',
            original: 'I think that it would be a good idea if we could perhaps consider the possibility of maybe having a meeting.',
            improved: 'Let\'s schedule a meeting.',
            improvement: 85,
            status: 'pending'
        },
        {
            learner: 'Trần Thị Bình',
            original: 'The decision was made by the committee that the project should be postponed.',
            improved: 'The committee decided to postpone the project.',
            improvement: 72,
            status: 'reviewed'
        },
    ];

    return (
        <MentorLayout
            title="Diễn đạt rõ ràng"
            icon="psychology"
            subtitle="Hướng dẫn học viên diễn đạt ý tưởng một cách rõ ràng và hiệu quả"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Introduction Banner */}
                <div className="rounded-xl bg-primary p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-white mb-2">
                            💎 Clarity is Power
                        </h2>
                        <p className="text-white/90 max-w-2xl">
                            "If you can't explain it simply, you don't understand it well enough." - Albert Einstein.
                            Giúp học viên biến những ý tưởng phức tạp thành câu từ đơn giản, dễ hiểu.
                        </p>
                    </div>
                </div>

                {/* Expression Techniques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expressionTechniques.map((technique, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all group"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-primary text-2xl">{technique.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{technique.title}</h3>
                                    <p className="text-sm text-primary">{technique.subtitle}</p>
                                </div>
                            </div>
                            <p className="text-sm text-[#9dabb9] mb-4">{technique.description}</p>
                            <div className="space-y-2">
                                {technique.examples.map((example, exIndex) => (
                                    <div key={exIndex} className="flex items-center gap-2 text-sm">
                                        <span className="text-red-400 line-through flex-1">{example.before}</span>
                                        <span className="material-symbols-outlined text-primary">arrow_forward</span>
                                        <span className="text-green-400 flex-1">{example.after}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Practice & Submissions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Practice Exercises */}
                    <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                        <h3 className="text-lg font-bold text-white mb-4">Bài tập luyện diễn đạt</h3>
                        <div className="space-y-3">
                            {practiceExercises.map((exercise, index) => (
                                <div
                                    key={index}
                                    className="p-3 rounded-lg bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-white group-hover:text-primary transition-colors text-sm">{exercise.title}</h4>
                                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-medium">
                                            {exercise.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-[#9dabb9]">
                                        <span>{exercise.count} câu</span>
                                        <span>⏱ {exercise.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined">add</span>
                            Tạo bài tập
                        </button>
                    </div>

                    {/* Learner Submissions */}
                    <div className="lg:col-span-2 rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                            <div>
                                <h3 className="text-lg font-bold text-white">Bài nộp của học viên</h3>
                                <p className="text-sm text-[#9dabb9]">So sánh trước và sau khi cải thiện</p>
                            </div>
                        </div>
                        <div className="divide-y divide-[#3e4854]/30">
                            {learnerSubmissions.map((submission, index) => (
                                <div key={index} className="p-5 hover:bg-[#3e4854]/10 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                {submission.learner.split(' ').pop()?.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{submission.learner}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-center">
                                                <span className="text-xl font-bold text-green-400">{submission.improvement}%</span>
                                                <p className="text-xs text-[#9dabb9]">Cải thiện</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                                                }`}>
                                                {submission.status === 'pending' ? 'Chờ xem' : 'Đã xem'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <p className="text-xs text-red-400 font-bold mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                                BAN ĐẦU (Wordy)
                                            </p>
                                            <p className="text-red-300 text-sm leading-relaxed">{submission.original}</p>
                                        </div>
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                            <p className="text-xs text-green-400 font-bold mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">check</span>
                                                CẢI THIỆN (Clear)
                                            </p>
                                            <p className="text-green-300 text-sm leading-relaxed">{submission.improved}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button className="px-4 py-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] text-sm font-medium hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                            Góp ý thêm
                                        </button>
                                        <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                            Xác nhận tốt
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Reference */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🎯 Checklist diễn đạt rõ ràng</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#283039] border border-[#3e4854]/30">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <span className="text-sm text-white">Câu &lt; 20 từ</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#283039] border border-[#3e4854]/30">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <span className="text-sm text-white">Một ý chính / câu</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#283039] border border-[#3e4854]/30">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <span className="text-sm text-white">Dùng câu chủ động</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#283039] border border-[#3e4854]/30">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                            <span className="text-sm text-white">Tránh từ thừa</span>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

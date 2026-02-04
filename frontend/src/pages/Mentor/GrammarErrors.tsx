import MentorLayout from '../../layouts/MentorLayout';

// Grammar Errors - Xác định lỗi ngữ pháp
export default function GrammarErrors() {
    const grammarCategories = [
        { name: 'Tenses', icon: 'schedule', count: 45 },
        { name: 'Articles', icon: 'article', count: 32 },
        { name: 'Prepositions', icon: 'compare_arrows', count: 28 },
        { name: 'Subject-Verb', icon: 'handshake', count: 21 },
        { name: 'Conditionals', icon: 'help', count: 18 },
        { name: 'Relative Clauses', icon: 'link', count: 15 },
    ];

    const recentErrors = [
        {
            learner: 'Nguyễn Văn An',
            sentence: 'If I will have money, I will buy a car.',
            correction: 'If I have money, I will buy a car.',
            rule: 'Conditional Type 1: If + present simple, will + V',
            category: 'Conditionals',
            severity: 'Medium'
        },
        {
            learner: 'Trần Thị Bình',
            sentence: 'She go to school every day.',
            correction: 'She goes to school every day.',
            rule: 'Third person singular adds -s/-es to the verb',
            category: 'Subject-Verb',
            severity: 'Easy'
        },
        {
            learner: 'Lê Hoàng Cường',
            sentence: 'I am living in Hanoi since 2015.',
            correction: 'I have been living in Hanoi since 2015.',
            rule: 'Use present perfect continuous with "since"',
            category: 'Tenses',
            severity: 'Hard'
        },
    ];

    const grammarExercises = [
        { title: 'Tense Transformation', questions: 20, difficulty: 'Medium', time: '15 phút' },
        { title: 'Article Gap Fill', questions: 15, difficulty: 'Easy', time: '10 phút' },
        { title: 'Conditional Sentences', questions: 10, difficulty: 'Hard', time: '12 phút' },
        { title: 'Error Correction', questions: 25, difficulty: 'Medium', time: '20 phút' },
    ];

    return (
        <MentorLayout
            title="Lỗi ngữ pháp"
            icon="spellcheck"
            subtitle="Xác định và sửa lỗi ngữ pháp cho học viên"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Grammar Categories Overview */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {grammarCategories.map((cat, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-4 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all cursor-pointer group text-center"
                        >
                            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">{cat.count}</p>
                            <p className="text-xs text-[#9dabb9]">{cat.name}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Errors */}
                    <div className="lg:col-span-2 rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                            <div>
                                <h3 className="text-lg font-bold text-white">Lỗi ngữ pháp gần đây</h3>
                                <p className="text-sm text-[#9dabb9]">Cần review và gửi giải thích</p>
                            </div>
                            <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                                Xem tất cả →
                            </button>
                        </div>
                        <div className="divide-y divide-[#3e4854]/30">
                            {recentErrors.map((error, index) => (
                                <div key={index} className="p-5 hover:bg-[#3e4854]/10 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                {error.learner.split(' ').pop()?.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{error.learner}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${error.severity === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                    error.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {error.severity}
                                            </span>
                                            <span className="px-2 py-1 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs">
                                                {error.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                            <p className="text-xs text-red-400 font-bold mb-1">❌ SAI</p>
                                            <p className="text-red-300">{error.sentence}</p>
                                        </div>
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                            <p className="text-xs text-green-400 font-bold mb-1">✓ ĐÚNG</p>
                                            <p className="text-green-300">{error.correction}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-[#9dabb9]">
                                            <span className="text-primary font-medium">Quy tắc:</span> {error.rule}
                                        </p>
                                        <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                            Gửi giải thích
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grammar Exercises */}
                    <div className="space-y-4">
                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="text-lg font-bold text-white mb-4">Bài tập ngữ pháp</h3>
                            <div className="space-y-3">
                                {grammarExercises.map((exercise, index) => (
                                    <div
                                        key={index}
                                        className="p-3 rounded-lg bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-white group-hover:text-primary transition-colors">{exercise.title}</h4>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${exercise.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                    exercise.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {exercise.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[#9dabb9]">
                                            <span>{exercise.questions} câu</span>
                                            <span>⏱ {exercise.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                                <span className="material-symbols-outlined">add</span>
                                Tạo bài tập mới
                            </button>
                        </div>

                        {/* Quick Tips */}
                        <div className="rounded-xl bg-primary/10 border border-primary/20 p-5">
                            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">tips_and_updates</span>
                                Mẹo giải thích ngữ pháp
                            </h3>
                            <ul className="space-y-2 text-sm text-[#9dabb9]">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Dùng ví dụ cụ thể và quen thuộc
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    So sánh với cấu trúc tiếng Việt
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Tạo câu mnemonic để ghi nhớ
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    Cho học viên tự tạo ví dụ ngay
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Grammar Rules Quick Reference */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">📚 Tài liệu tham khảo nhanh</h3>
                        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                            Xem thư viện đầy đủ →
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-[#283039] border border-[#3e4854]/30">
                            <p className="text-primary font-bold mb-1">Present Perfect vs Past Simple</p>
                            <p className="text-sm text-[#9dabb9]">Khi nào dùng "have done" vs "did"</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#283039] border border-[#3e4854]/30">
                            <p className="text-primary font-bold mb-1">Article Usage</p>
                            <p className="text-sm text-[#9dabb9]">a/an/the hay không dùng article</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#283039] border border-[#3e4854]/30">
                            <p className="text-primary font-bold mb-1">Conditional Types</p>
                            <p className="text-sm text-[#9dabb9]">Type 0, 1, 2, 3 conditionals</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#283039] border border-[#3e4854]/30">
                            <p className="text-primary font-bold mb-1">Relative Pronouns</p>
                            <p className="text-sm text-[#9dabb9]">who, whom, which, that, whose</p>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

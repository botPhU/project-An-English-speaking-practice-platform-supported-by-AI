import MentorLayout from '../../layouts/MentorLayout';

// Word Usage Correction - Sửa cách dùng từ không tự nhiên
export default function WordUsageCorrection() {
    const commonMistakes = [
        {
            wrong: 'I very like coffee',
            correct: 'I really like coffee / I like coffee very much',
            explanation: '"Very" không thể đứng trước động từ. Dùng "really" trước động từ hoặc "very much" sau.',
            category: 'Adverb Placement',
            frequency: 'Very Common'
        },
        {
            wrong: 'He is more taller than me',
            correct: 'He is taller than me',
            explanation: 'Không dùng "more" với tính từ so sánh đã có "-er".',
            category: 'Comparison',
            frequency: 'Common'
        },
        {
            wrong: 'I am agree with you',
            correct: 'I agree with you',
            explanation: '"Agree" là động từ, không cần "am" phía trước.',
            category: 'Verb Usage',
            frequency: 'Very Common'
        },
        {
            wrong: 'The news are good',
            correct: 'The news is good',
            explanation: '"News" là danh từ không đếm được, dùng động từ số ít.',
            category: 'Uncountable Nouns',
            frequency: 'Common'
        },
    ];

    const learnerErrors = [
        { learner: 'Nguyễn Văn An', error: 'I am working here since 2020', correction: 'I have been working here since 2020', type: 'Tense', date: 'Hôm nay' },
        { learner: 'Trần Thị Bình', error: 'She make me happy', correction: 'She makes me happy', type: 'Subject-Verb', date: 'Hôm qua' },
        { learner: 'Lê Hoàng Cường', error: 'I have a news for you', correction: 'I have news for you', type: 'Article', date: '2 ngày trước' },
    ];

    return (
        <MentorLayout
            title="Sửa cách dùng từ"
            icon="edit_note"
            subtitle="Phát hiện và sửa lỗi dùng từ không tự nhiên"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Lỗi phổ biến đã ghi nhận</p>
                            <span className="material-symbols-outlined text-yellow-400 text-xl">warning</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">127</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Lỗi đã được sửa</p>
                            <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">89</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tỉ lệ cải thiện</p>
                            <span className="material-symbols-outlined text-primary text-xl">trending_up</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">70%</p>
                    </div>
                </div>

                {/* Common Mistakes Library */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                        <div>
                            <h3 className="text-lg font-bold text-white">Thư viện lỗi phổ biến</h3>
                            <p className="text-sm text-[#9dabb9]">Các lỗi dùng từ thường gặp và cách sửa</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Thêm lỗi
                        </button>
                    </div>
                    <div className="divide-y divide-[#3e4854]/30">
                        {commonMistakes.map((mistake, index) => (
                            <div key={index} className="p-5 hover:bg-[#3e4854]/10 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${mistake.frequency === 'Very Common' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {mistake.frequency}
                                            </span>
                                            <span className="px-2 py-1 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs">
                                                {mistake.category}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                                <p className="text-xs text-red-400 font-bold mb-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">close</span> SAI
                                                </p>
                                                <p className="text-red-300 font-medium line-through">{mistake.wrong}</p>
                                            </div>
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                                <p className="text-xs text-green-400 font-bold mb-1 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">check</span> ĐÚNG
                                                </p>
                                                <p className="text-green-300 font-medium">{mistake.correct}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#9dabb9]">
                                            <span className="text-primary font-medium">Giải thích:</span> {mistake.explanation}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 lg:flex-col">
                                        <button className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined">share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Learner Errors */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                    <div className="p-5 border-b border-[#3e4854]/30">
                        <h3 className="text-lg font-bold text-white">Lỗi gần đây từ học viên</h3>
                        <p className="text-sm text-[#9dabb9]">Cần được review và gửi phản hồi</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#3e4854]/20">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Học viên</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Câu sai</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Câu đúng</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Loại lỗi</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Thời gian</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3e4854]/30">
                                {learnerErrors.map((error, index) => (
                                    <tr key={index} className="hover:bg-[#3e4854]/10 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-white">{error.learner}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-red-400 line-through">{error.error}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-green-400">{error.correction}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">
                                                {error.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-[#9dabb9] text-sm">{error.date}</td>
                                        <td className="p-4">
                                            <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                                Gửi phản hồi
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

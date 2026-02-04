import MentorLayout from '../../layouts/MentorLayout';

// Pronunciation Errors - Chỉ ra lỗi phát âm
export default function PronunciationErrors() {
    const commonPronunciationIssues = [
        {
            sound: '/θ/ và /ð/',
            examples: ['think → /θɪŋk/', 'this → /ðɪs/'],
            vietnameseChallenge: 'Người Việt thường phát âm thành /t/ hoặc /d/',
            tip: 'Đặt lưỡi giữa hai hàm răng và thổi nhẹ',
            difficulty: 'Hard',
            icon: '😮‍💨'
        },
        {
            sound: '/r/ và /l/',
            examples: ['right → /raɪt/', 'light → /laɪt/'],
            vietnameseChallenge: 'Hay nhầm lẫn hai âm này',
            tip: 'Với /r/ cuộn lưỡi, với /l/ chạm lưỡi vào vòm miệng',
            difficulty: 'Medium',
            icon: '👅'
        },
        {
            sound: 'Final consonants',
            examples: ['bed → /bed/', 'cat → /kæt/'],
            vietnameseChallenge: 'Thường bỏ phụ âm cuối',
            tip: 'Nhấn mạnh và phát âm rõ phụ âm cuối',
            difficulty: 'Medium',
            icon: '🔚'
        },
        {
            sound: '/ʃ/ và /s/',
            examples: ['ship → /ʃɪp/', 'sip → /sɪp/'],
            vietnameseChallenge: 'Khó phân biệt âm "sh" và "s"',
            tip: 'Với /ʃ/ tròn môi hơn và âm dày hơn',
            difficulty: 'Easy',
            icon: '🤫'
        },
    ];

    const learnerRecordings = [
        { learner: 'Nguyễn Văn An', sentence: 'I think this is the right thing to do', issues: ['/θ/', '/ð/', '/r/'], score: 65, date: 'Hôm nay' },
        { learner: 'Trần Thị Bình', sentence: 'She sells seashells by the seashore', issues: ['/ʃ/', '/s/'], score: 72, date: 'Hôm qua' },
        { learner: 'Lê Hoàng Cường', sentence: 'The weather is getting better', issues: ['Final /r/', '/ð/'], score: 80, date: '2 ngày trước' },
    ];

    return (
        <MentorLayout
            title="Lỗi phát âm"
            icon="record_voice_over"
            subtitle="Chỉ ra và sửa lỗi phát âm cho học viên"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Hero Banner */}
                <div className="rounded-xl bg-primary p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">🎤 Công cụ phân tích phát âm</h2>
                            <p className="text-white/80">Sử dụng AI để phát hiện và phân tích lỗi phát âm tự động</p>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition-colors">
                            <span className="material-symbols-outlined">mic</span>
                            Ghi âm mẫu
                        </button>
                    </div>
                </div>

                {/* Common Issues Grid */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Lỗi phát âm phổ biến của người Việt</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {commonPronunciationIssues.map((issue, index) => (
                            <div
                                key={index}
                                className="rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-3xl">{issue.icon}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${issue.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                                            issue.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                        }`}>
                                        {issue.difficulty}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                    {issue.sound}
                                </h4>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {issue.examples.map((ex, exIndex) => (
                                        <span key={exIndex} className="px-2 py-1 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs font-mono">
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-[#9dabb9] mb-2">
                                    <span className="text-red-400">Khó khăn:</span> {issue.vietnameseChallenge}
                                </p>
                                <p className="text-sm text-primary">
                                    <span className="font-bold">💡</span> {issue.tip}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learner Recordings */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                        <div>
                            <h3 className="text-lg font-bold text-white">Bản ghi âm học viên</h3>
                            <p className="text-sm text-[#9dabb9]">Xem xét và cung cấp phản hồi</p>
                        </div>
                        <select className="px-3 py-2 rounded-lg bg-[#3e4854]/30 border border-[#3e4854]/30 text-[#9dabb9] text-sm focus:outline-none focus:border-primary/50">
                            <option>Tất cả học viên</option>
                            <option>Chờ xem xét</option>
                            <option>Đã phản hồi</option>
                        </select>
                    </div>
                    <div className="divide-y divide-[#3e4854]/30">
                        {learnerRecordings.map((recording, index) => (
                            <div key={index} className="p-5 hover:bg-[#3e4854]/10 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {recording.learner.split(' ').pop()?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{recording.learner}</p>
                                            <p className="text-sm text-[#9dabb9]">{recording.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-primary italic mb-2">"{recording.sentence}"</p>
                                        <div className="flex flex-wrap gap-2">
                                            {recording.issues.map((issue, issueIndex) => (
                                                <span key={issueIndex} className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs">
                                                    {issue}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${recording.score >= 80 ? 'text-green-400' :
                                                    recording.score >= 60 ? 'text-yellow-400' :
                                                        'text-red-400'
                                                }`}>
                                                {recording.score}%
                                            </div>
                                            <p className="text-xs text-[#9dabb9]">Điểm</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                                <span className="material-symbols-outlined">play_arrow</span>
                                            </button>
                                            <button className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                                <span className="material-symbols-outlined">mic</span>
                                            </button>
                                            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                                Phản hồi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tips Section */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">lightbulb</span>
                        Mẹo dạy phát âm hiệu quả
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <span className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</span>
                            <p className="text-sm text-[#9dabb9]">Sử dụng minimal pairs để phân biệt âm (ship/sip, thin/tin)</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">2</span>
                            <p className="text-sm text-[#9dabb9]">Cho học viên xem miệng và vị trí lưỡi khi phát âm</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">3</span>
                            <p className="text-sm text-[#9dabb9]">Luyện tập với tongue twisters để cải thiện nhanh hơn</p>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

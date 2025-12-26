import MentorLayout from '../../layouts/MentorLayout';

// Experience Sharing - Chia sẻ kinh nghiệm giao tiếp với người bản xứ
export default function ExperienceSharing() {
    const tips = [
        {
            title: 'Lắng nghe tích cực',
            icon: 'hearing',
            content: 'Native speakers nói nhanh và dùng nhiều slang. Đừng cố hiểu mọi từ - tập trung vào ý chính.',
            keyPoints: ['Nhìn vào mắt khi nghe', 'Gật đầu thể hiện đang lắng nghe', 'Đợi họ nói xong mới trả lời']
        },
        {
            title: 'Dùng filler words tự nhiên',
            icon: 'chat',
            content: 'Thay vì im lặng khi suy nghĩ, hãy dùng các từ như "Well...", "You know...", "I mean..."',
            keyPoints: ['Well, let me think...', 'Actually, I believe...', 'To be honest...']
        },
        {
            title: 'Đặt câu hỏi follow-up',
            icon: 'help',
            content: 'Thể hiện sự quan tâm bằng cách hỏi thêm. Điều này giúp cuộc trò chuyện tự nhiên.',
            keyPoints: ['Really? Tell me more!', 'How did that happen?', 'What was that like?']
        },
        {
            title: 'Chấp nhận sự không hoàn hảo',
            icon: 'thumb_up',
            content: 'Native speakers cũng nói sai ngữ pháp! Quan trọng là conveyed được ý.',
            keyPoints: ['Nobody\'s perfect', 'Communication > Perfection', 'Mistakes help you learn']
        },
    ];

    const nativePhrases = [
        { phrase: 'What\'s up?', meaning: 'Có gì mới không?', context: 'Chào hỏi thân mật', category: 'Greetings' },
        { phrase: 'I\'m down!', meaning: 'Tôi đồng ý/muốn tham gia', context: 'Khi được rủ làm gì đó', category: 'Agreement' },
        { phrase: 'No worries!', meaning: 'Không sao đâu', context: 'Trả lời khi ai đó xin lỗi', category: 'Responses' },
        { phrase: 'That\'s so cool!', meaning: 'Tuyệt vời quá!', context: 'Thể hiện ấn tượng', category: 'Expressions' },
        { phrase: 'I\'m swamped', meaning: 'Tôi đang rất bận', context: 'Giải thích không có thời gian', category: 'Work' },
        { phrase: 'Let\'s catch up soon', meaning: 'Hẹn gặp lại sớm nhé', context: 'Khi kết thúc cuộc trò chuyện', category: 'Farewells' },
    ];

    const culturalNotes = [
        { title: 'Small talk quan trọng', content: 'Người phương Tây thường small talk về thời tiết, sports trước khi vào chủ đề chính.' },
        { title: 'Personal space', content: 'Giữ khoảng cách khoảng một cánh tay khi nói chuyện. Đứng quá gần có thể khiến họ không thoải mái.' },
        { title: 'Eye contact', content: 'Nhìn vào mắt khi nói chuyện thể hiện sự tự tin và chân thành. Nhưng đừng nhìn chằm chằm.' },
    ];

    return (
        <MentorLayout
            title="Chia sẻ kinh nghiệm"
            icon="tips_and_updates"
            subtitle="Chia sẻ kinh nghiệm giao tiếp với người bản xứ"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Hero Section */}
                <div className="rounded-xl bg-primary p-6 lg:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">
                            🌍 Giao tiếp như người bản xứ
                        </h2>
                        <p className="text-white/90 max-w-2xl">
                            Chia sẻ những bí quyết và kinh nghiệm thực tế từ việc giao tiếp với native speakers.
                            Những điều không có trong sách giáo khoa!
                        </p>
                    </div>
                </div>

                {/* Communication Tips Grid */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">💡 Mẹo giao tiếp hiệu quả</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tips.map((tip, index) => (
                            <div
                                key={index}
                                className="rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-primary text-2xl">{tip.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{tip.title}</h4>
                                        <p className="text-sm text-[#9dabb9] mb-3">{tip.content}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {tip.keyPoints.map((point, pIndex) => (
                                                <span key={pIndex} className="px-2 py-1 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs">
                                                    {point}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Native Phrases */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                        <div>
                            <h3 className="text-lg font-bold text-white">🗣️ Cụm từ native hay dùng</h3>
                            <p className="text-sm text-[#9dabb9]">Những cách nói tự nhiên mà sách không dạy</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Thêm cụm từ
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-[#3e4854]/30">
                        {nativePhrases.map((item, index) => (
                            <div key={index} className="p-4 hover:bg-[#3e4854]/10 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg font-bold text-white">"{item.phrase}"</span>
                                    <span className="px-2 py-0.5 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs">
                                        {item.category}
                                    </span>
                                </div>
                                <p className="text-primary font-medium mb-1">→ {item.meaning}</p>
                                <p className="text-sm text-[#9dabb9]">{item.context}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cultural Notes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {culturalNotes.map((note, index) => (
                        <div
                            key={index}
                            className="rounded-xl bg-primary/10 border border-primary/20 p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">public</span>
                                <h4 className="font-bold text-white">{note.title}</h4>
                            </div>
                            <p className="text-sm text-[#9dabb9]">{note.content}</p>
                        </div>
                    ))}
                </div>

                {/* Share Your Experience */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Thêm kinh nghiệm của bạn</h3>
                                <p className="text-sm text-[#9dabb9]">
                                    Chia sẻ những mẹo hay và kinh nghiệm thực tế mà bạn đã học được khi giao tiếp với native speakers
                                </p>
                            </div>
                        </div>
                        <button className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
                            Viết bài chia sẻ
                        </button>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

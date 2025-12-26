import MentorLayout from '../../layouts/MentorLayout';

// Teach Collocations & Idioms - Dạy Collocations & Idioms
export default function CollocationsIdioms() {
    const collocations = [
        { phrase: 'make a decision', meaning: 'đưa ra quyết định', example: 'I need to make a decision about my career.', type: 'Collocation', category: 'Business' },
        { phrase: 'break the ice', meaning: 'phá vỡ không khí ngượng ngùng', example: 'He told a joke to break the ice.', type: 'Idiom', category: 'Social' },
        { phrase: 'take notes', meaning: 'ghi chép', example: 'Students should take notes during the lecture.', type: 'Collocation', category: 'Academic' },
        { phrase: 'hit the nail on the head', meaning: 'nói trúng vấn đề', example: 'You hit the nail on the head with that observation.', type: 'Idiom', category: 'General' },
        { phrase: 'heavy rain', meaning: 'mưa lớn', example: 'We had heavy rain last night.', type: 'Collocation', category: 'Weather' },
        { phrase: 'cost an arm and a leg', meaning: 'rất đắt đỏ', example: 'That new car costs an arm and a leg.', type: 'Idiom', category: 'Money' },
    ];

    const categories = ['Tất cả', 'Business', 'Social', 'Academic', 'General', 'Weather', 'Money'];

    return (
        <MentorLayout
            title="Collocations & Idioms"
            icon="library_books"
            subtitle="Dạy các cụm từ cố định và thành ngữ tiếng Anh"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Search and Filter */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    <div className="flex-1 max-w-xl">
                        <div className="flex items-center bg-[#283039] border border-[#3e4854]/30 rounded-lg px-4 py-3 focus-within:border-primary/50 transition-all">
                            <span className="material-symbols-outlined text-[#9dabb9]">search</span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm collocation hoặc idiom..."
                                className="bg-transparent border-none outline-none flex-1 px-3 text-sm text-white placeholder:text-[#9dabb9]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 rounded-lg bg-[#283039] border border-[#3e4854]/30 text-[#9dabb9] text-sm focus:outline-none focus:border-primary/50">
                            <option>Tất cả loại</option>
                            <option>Collocation</option>
                            <option>Idiom</option>
                        </select>
                        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Thêm mới
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 p-1 bg-[#283039] rounded-xl w-fit">
                    {categories.map((cat, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${index === 0
                                    ? 'bg-primary text-white'
                                    : 'text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Collocations & Idioms List */}
                <div className="space-y-4">
                    {collocations.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all group"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                            "{item.phrase}"
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.type === 'Collocation' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            {item.type}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs">
                                            {item.category}
                                        </span>
                                    </div>
                                    <p className="text-primary font-medium mb-2">→ {item.meaning}</p>
                                    <p className="text-[#9dabb9] italic">"{item.example}"</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">volume_up</span>
                                    </button>
                                    <button className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Teaching Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="material-symbols-outlined text-blue-400 text-2xl">lightbulb</span>
                            <h3 className="font-bold text-white">Mẹo dạy Collocations</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-[#9dabb9]">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                Nhấn mạnh việc học theo cụm, không học từ đơn lẻ
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                Cho ví dụ trong ngữ cảnh thực tế
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                Yêu cầu học viên tự tạo câu với collocation mới
                            </li>
                        </ul>
                    </div>
                    <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="material-symbols-outlined text-purple-400 text-2xl">psychology</span>
                            <h3 className="font-bold text-white">Mẹo dạy Idioms</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-[#9dabb9]">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                Giải thích nguồn gốc để dễ nhớ hơn
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                So sánh với thành ngữ tương tự trong tiếng Việt
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                Tạo tình huống roleplay sử dụng idiom
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

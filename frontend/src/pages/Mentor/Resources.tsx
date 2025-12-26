import MentorLayout from '../../layouts/MentorLayout';

// Resources - Cung cấp tài liệu liên quan và gợi ý cách học từ vựng
export default function Resources() {
    const resourceCategories = [
        { name: 'Vocabulary', icon: 'menu_book', count: 45 },
        { name: 'Grammar', icon: 'spellcheck', count: 32 },
        { name: 'Pronunciation', icon: 'record_voice_over', count: 18 },
        { name: 'Listening', icon: 'headphones', count: 24 },
        { name: 'Reading', icon: 'article', count: 28 },
        { name: 'Writing', icon: 'edit', count: 15 },
    ];

    const featuredResources = [
        {
            title: '1000 từ vựng IELTS thông dụng',
            type: 'PDF',
            category: 'Vocabulary',
            downloads: 234,
            rating: 4.8,
            description: 'Danh sách 1000 từ vựng quan trọng nhất cho kỳ thi IELTS'
        },
        {
            title: 'Phát âm chuẩn British vs American',
            type: 'Video',
            category: 'Pronunciation',
            downloads: 156,
            rating: 4.9,
            description: 'So sánh chi tiết cách phát âm giữa hai accent phổ biến'
        },
        {
            title: 'Grammar cheat sheet',
            type: 'PDF',
            category: 'Grammar',
            downloads: 189,
            rating: 4.7,
            description: 'Tổng hợp các cấu trúc ngữ pháp quan trọng cần nhớ'
        },
        {
            title: 'Podcast cho người mới bắt đầu',
            type: 'Audio',
            category: 'Listening',
            downloads: 98,
            rating: 4.6,
            description: 'Series podcast với tốc độ chậm, phù hợp cho beginner'
        },
    ];

    const vocabularyMethods = [
        {
            title: 'Spaced Repetition',
            icon: 'schedule',
            description: 'Ôn tập từ vựng theo khoảng thời gian tăng dần để ghi nhớ lâu hơn',
            bestFor: 'Ghi nhớ dài hạn'
        },
        {
            title: 'Context Learning',
            icon: 'description',
            description: 'Học từ trong ngữ cảnh thực tế thay vì học riêng lẻ',
            bestFor: 'Hiểu cách sử dụng'
        },
        {
            title: 'Word Families',
            icon: 'account_tree',
            description: 'Học nhóm từ cùng gốc: act, action, active, actively',
            bestFor: 'Mở rộng từ vựng nhanh'
        },
        {
            title: 'Visualization',
            icon: 'image',
            description: 'Liên kết từ với hình ảnh để tăng khả năng ghi nhớ',
            bestFor: 'Người học visual'
        },
    ];

    const recentUploads = [
        { name: 'Business English Phrases.pdf', size: '2.4 MB', date: 'Hôm nay' },
        { name: 'Pronunciation Guide.mp3', size: '15 MB', date: 'Hôm qua' },
        { name: 'IELTS Speaking Tips.pdf', size: '1.8 MB', date: '3 ngày trước' },
    ];

    return (
        <MentorLayout
            title="Tài liệu học tập"
            icon="folder_open"
            subtitle="Cung cấp tài liệu và gợi ý phương pháp học từ vựng"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Resource Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {resourceCategories.map((cat, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-4 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all cursor-pointer group text-center"
                        >
                            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-2xl">{cat.icon}</span>
                            </div>
                            <p className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{cat.name}</p>
                            <p className="text-xs text-[#9dabb9]">{cat.count} tài liệu</p>
                        </div>
                    ))}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Featured Resources */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Tài liệu nổi bật</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Tìm tài liệu..."
                                    className="px-4 py-2 rounded-lg bg-[#283039] border border-[#3e4854]/30 text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-[#9dabb9] w-48"
                                />
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-lg">upload</span>
                                    Tải lên
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {featuredResources.map((resource, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${resource.type === 'PDF' ? 'bg-red-500/20 text-red-400' :
                                                resource.type === 'Video' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-purple-500/20 text-purple-400'
                                            }`}>
                                            {resource.type}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <span className="material-symbols-outlined text-sm">star</span>
                                            <span className="text-sm font-bold">{resource.rating}</span>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </h4>
                                    <p className="text-sm text-[#9dabb9] mb-4">{resource.description}</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-[#3e4854]/30">
                                        <span className="px-2 py-1 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs">
                                            {resource.category}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-[#9dabb9]">
                                                <span className="material-symbols-outlined text-sm align-middle">download</span>
                                                {resource.downloads}
                                            </span>
                                            <button className="text-primary hover:text-primary/80 transition-colors">
                                                <span className="material-symbols-outlined">share</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Recent Uploads */}
                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="font-bold text-white mb-4">Tải lên gần đây</h3>
                            <div className="space-y-3">
                                {recentUploads.map((file, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#3e4854]/20 transition-colors cursor-pointer">
                                        <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary">
                                                {file.name.endsWith('.pdf') ? 'picture_as_pdf' : 'audio_file'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                            <p className="text-xs text-[#9dabb9]">{file.size} • {file.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vocabulary Methods */}
                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="font-bold text-white mb-4">💡 Phương pháp học từ vựng</h3>
                            <div className="space-y-3">
                                {vocabularyMethods.map((method, index) => (
                                    <div key={index} className="p-3 rounded-lg bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="material-symbols-outlined text-primary">{method.icon}</span>
                                            <h4 className="font-medium text-white group-hover:text-primary transition-colors">{method.title}</h4>
                                        </div>
                                        <p className="text-xs text-[#9dabb9] mb-2">{method.description}</p>
                                        <span className="text-[10px] text-primary font-medium">Phù hợp: {method.bestFor}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips Banner */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-2xl">tips_and_updates</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Mẹo chia sẻ tài liệu</h3>
                                <p className="text-sm text-[#9dabb9]">
                                    Tài liệu tốt nhất là tài liệu phù hợp với level và mục tiêu cụ thể của học viên.
                                    Đừng chia sẻ quá nhiều cùng lúc - 1-2 tài liệu mỗi tuần là đủ.
                                </p>
                            </div>
                        </div>
                        <button className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
                            Tạo bộ tài liệu
                        </button>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

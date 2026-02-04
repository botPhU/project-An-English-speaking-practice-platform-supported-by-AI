import MentorLayout from '../../layouts/MentorLayout';

// Create Real-life Situations - Tạo tình huống thực tế cho learner
export default function RealLifeSituations() {
    const situations = [
        {
            id: 1,
            title: 'Phỏng vấn xin việc',
            category: 'Business',
            difficulty: 'Intermediate',
            description: 'Tình huống phỏng vấn xin việc tại công ty đa quốc gia',
            scenarios: 5,
            usedBy: 48,
            icon: 'work'
        },
        {
            id: 2,
            title: 'Đặt phòng khách sạn',
            category: 'Travel',
            difficulty: 'Beginner',
            description: 'Hội thoại đặt phòng và yêu cầu dịch vụ tại khách sạn',
            scenarios: 3,
            usedBy: 72,
            icon: 'hotel'
        },
        {
            id: 3,
            title: 'Thuyết trình công việc',
            category: 'Business',
            difficulty: 'Advanced',
            description: 'Trình bày ý tưởng và thảo luận trong cuộc họp',
            scenarios: 4,
            usedBy: 35,
            icon: 'present_to_all'
        },
        {
            id: 4,
            title: 'Mua sắm và trả giá',
            category: 'Daily Life',
            difficulty: 'Beginner',
            description: 'Giao tiếp khi mua sắm, hỏi giá và thương lượng',
            scenarios: 4,
            usedBy: 89,
            icon: 'shopping_cart'
        },
        {
            id: 5,
            title: 'Xử lý khiếu nại',
            category: 'Customer Service',
            difficulty: 'Advanced',
            description: 'Giải quyết vấn đề và khiếu nại một cách chuyên nghiệp',
            scenarios: 6,
            usedBy: 28,
            icon: 'support_agent'
        },
        {
            id: 6,
            title: 'Hẹn gặp bác sĩ',
            category: 'Healthcare',
            difficulty: 'Intermediate',
            description: 'Mô tả triệu chứng và trao đổi với bác sĩ',
            scenarios: 3,
            usedBy: 45,
            icon: 'medical_services'
        },
    ];

    const categories = ['Tất cả', 'Business', 'Travel', 'Daily Life', 'Customer Service', 'Healthcare'];

    return (
        <MentorLayout
            title="Tình huống thực tế"
            icon="theater_comedy"
            subtitle="Tạo và quản lý các tình huống hội thoại thực tế"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${index === 0
                                        ? 'bg-primary text-white'
                                        : 'bg-[#283039] text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                        <span className="material-symbols-outlined">add</span>
                        Tạo tình huống mới
                    </button>
                </div>

                {/* Situations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {situations.map((situation) => (
                        <div
                            key={situation.id}
                            className="rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-all group cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-primary text-2xl">{situation.icon}</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${situation.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                        situation.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {situation.difficulty}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{situation.title}</h3>
                            <p className="text-sm text-[#9dabb9] mb-4 line-clamp-2">{situation.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-[#3e4854]/30">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-[#9dabb9]">
                                        <span className="text-white font-bold">{situation.scenarios}</span> kịch bản
                                    </span>
                                    <span className="text-[#9dabb9]">
                                        <span className="text-white font-bold">{situation.usedBy}</span> lượt dùng
                                    </span>
                                </div>
                                <span className="px-2 py-1 rounded bg-[#3e4854]/30 text-[#9dabb9] text-xs font-medium">
                                    {situation.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create New Situation Guide */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="size-16 rounded-xl bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-3xl">tips_and_updates</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">Hướng dẫn tạo tình huống hiệu quả</h3>
                            <p className="text-sm text-[#9dabb9]">
                                Một tình huống tốt nên có bối cảnh rõ ràng, mục tiêu giao tiếp cụ thể, và các biến thể để phù hợp với nhiều cấp độ học viên.
                                Bao gồm cả các cụm từ và từ vựng liên quan để học viên chuẩn bị trước.
                            </p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-[#283039] text-[#9dabb9] font-medium hover:bg-[#3e4854]/50 hover:text-white transition-colors whitespace-nowrap">
                            Xem hướng dẫn đầy đủ
                        </button>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

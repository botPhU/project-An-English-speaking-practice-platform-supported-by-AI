import { useState } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';

export default function Challenges() {
    const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');

    const challenges = [
        {
            id: 1,
            title: 'Mô tả phong cảnh',
            description: 'Sử dụng ít nhất 5 tính từ liên quan đến thiên nhiên trong bài nói 1 phút.',
            type: 'daily',
            xp: 50,
            time: '1 phút',
            difficulty: 'Dễ',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
            completed: false,
        },
        {
            id: 2,
            title: 'Phỏng vấn xin việc',
            description: 'Trả lời 3 câu hỏi phỏng vấn phổ biến bằng tiếng Anh tự nhiên.',
            type: 'daily',
            xp: 75,
            time: '3 phút',
            difficulty: 'Trung bình',
            image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&q=80&w=400',
            completed: true,
        },
        {
            id: 3,
            title: 'Thuyết trình sản phẩm',
            description: 'Giới thiệu một sản phẩm yêu thích của bạn trong 2 phút.',
            type: 'weekly',
            xp: 150,
            time: '2 phút',
            difficulty: 'Trung bình',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400',
            completed: false,
        },
        {
            id: 4,
            title: 'Tranh luận chủ đề xã hội',
            description: 'Đưa ra quan điểm về một vấn đề xã hội với 3 luận điểm rõ ràng.',
            type: 'weekly',
            xp: 200,
            time: '5 phút',
            difficulty: 'Khó',
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400',
            completed: false,
        },
        {
            id: 5,
            title: 'Chúc mừng năm mới',
            description: 'Gửi lời chúc năm mới bằng tiếng Anh với phát âm chuẩn.',
            type: 'special',
            xp: 100,
            time: '1 phút',
            difficulty: 'Dễ',
            image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=400',
            completed: false,
            deadline: '01/01/2025',
        },
    ];

    const filteredChallenges = filter === 'all'
        ? challenges
        : challenges.filter(c => c.type === filter);

    const stats = {
        completed: challenges.filter(c => c.completed).length,
        total: challenges.length,
        totalXP: 1250,
        streak: 5,
    };

    return (
        <LearnerLayout title="Thử thách">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Thử thách Speaking</h1>
                        <p className="text-text-secondary mt-1">Hoàn thành thử thách để nhận XP và cải thiện kỹ năng</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                            <span className="text-text-secondary text-sm">Đã hoàn thành</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.completed}/{stats.total}</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-primary">military_tech</span>
                            <span className="text-text-secondary text-sm">Tổng XP</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.totalXP}</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                            <span className="text-text-secondary text-sm">Chuỗi ngày</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.streak} ngày</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-purple-500">emoji_events</span>
                            <span className="text-text-secondary text-sm">Xếp hạng</span>
                        </div>
                        <p className="text-2xl font-bold text-white">#12</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: 'Tất cả', icon: 'category' },
                        { key: 'daily', label: 'Hàng ngày', icon: 'today' },
                        { key: 'weekly', label: 'Hàng tuần', icon: 'date_range' },
                        { key: 'special', label: 'Đặc biệt', icon: 'celebration' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key as typeof filter)}
                            className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${filter === tab.key
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-dark text-text-secondary hover:text-white hover:bg-white/5 border border-border-dark'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Challenges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChallenges.map((challenge) => (
                        <div
                            key={challenge.id}
                            className={`bg-surface-dark border rounded-xl overflow-hidden transition-all hover:shadow-lg group ${challenge.completed
                                    ? 'border-green-500/30 opacity-75'
                                    : 'border-border-dark hover:border-primary/50'
                                }`}
                        >
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={challenge.image}
                                    alt={challenge.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent"></div>
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${challenge.type === 'daily' ? 'bg-blue-500 text-white' :
                                            challenge.type === 'weekly' ? 'bg-purple-500 text-white' :
                                                'bg-orange-500 text-white'
                                        }`}>
                                        {challenge.type === 'daily' ? 'Hàng ngày' :
                                            challenge.type === 'weekly' ? 'Hàng tuần' : 'Đặc biệt'}
                                    </span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${challenge.difficulty === 'Dễ' ? 'bg-green-500/20 text-green-500' :
                                            challenge.difficulty === 'Trung bình' ? 'bg-yellow-500/20 text-yellow-500' :
                                                'bg-red-500/20 text-red-500'
                                        }`}>
                                        {challenge.difficulty}
                                    </span>
                                </div>
                                {challenge.completed && (
                                    <div className="absolute top-3 right-3">
                                        <span className="material-symbols-outlined text-green-500 text-2xl bg-surface-dark rounded-full p-1">check_circle</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-white text-lg mb-2">{challenge.title}</h3>
                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{challenge.description}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            {challenge.time}
                                        </span>
                                        <span className="flex items-center gap-1 text-primary font-bold">
                                            <span className="material-symbols-outlined text-sm">stars</span>
                                            +{challenge.xp} XP
                                        </span>
                                    </div>
                                    {challenge.deadline && (
                                        <span className="text-xs text-orange-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">timer</span>
                                            {challenge.deadline}
                                        </span>
                                    )}
                                </div>
                                <button
                                    className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${challenge.completed
                                            ? 'bg-green-500/20 text-green-500 cursor-default'
                                            : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25'
                                        }`}
                                    disabled={challenge.completed}
                                >
                                    {challenge.completed ? (
                                        <>
                                            <span className="material-symbols-outlined text-lg">check</span>
                                            Đã hoàn thành
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-lg">play_arrow</span>
                                            Bắt đầu thử thách
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </LearnerLayout>
    );
}

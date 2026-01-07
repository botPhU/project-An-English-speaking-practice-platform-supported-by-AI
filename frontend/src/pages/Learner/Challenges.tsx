import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import { learnerService } from '../../services/learnerService';

export default function Challenges() {
    const { user: authUser } = useAuth();
    const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');
    const [topics, setTopics] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser?.id) {
            fetchData();
        }
    }, [authUser?.id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [topicsRes, progressRes] = await Promise.all([
                learnerService.getTopics(filter),
                learnerService.getProgress(Number(authUser?.id))
            ]);
            setTopics(topicsRes.data);
            setStats(progressRes.data);
        } catch (error) {
            console.error('Error fetching challenges data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refetch when filter changes
    useEffect(() => {
        if (authUser?.id) {
            learnerService.getTopics(filter).then(res => setTopics(res.data));
        }
    }, [filter, authUser?.id]);

    if (loading) {
        return (
            <LearnerLayout title="Thử thách">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </LearnerLayout>
        );
    }

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
                            <span className="text-text-secondary text-sm">Bài luyện tập</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats?.total_sessions || 0}</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-primary">military_tech</span>
                            <span className="text-text-secondary text-sm">Điểm XP</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats?.xp_points?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                            <span className="text-text-secondary text-sm">Chuỗi ngày</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats?.current_streak || 0} ngày</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="material-symbols-outlined text-purple-500">emoji_events</span>
                            <span className="text-text-secondary text-sm">Trình độ</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats?.current_level?.toUpperCase() || 'BEGINNER'}</p>
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
                            onClick={() => setFilter(tab.key as any)}
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
                    {topics.length > 0 ? topics.map((topic) => (
                        <div
                            key={topic.id}
                            className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden transition-all hover:shadow-lg group hover:border-primary/50"
                        >
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={topic.image_url || `https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&q=80&w=400`}
                                    alt={topic.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent"></div>
                                <div className="absolute top-3 left-3 flex gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-blue-500 text-white">
                                        {topic.category || 'Giao tiếp'}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-green-500/20 text-green-500">
                                        Level: {topic.difficulty_level || 1}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-white text-lg mb-2">{topic.title}</h3>
                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{topic.description}</p>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            {topic.time_limit || 5} phút
                                        </span>
                                        <span className="flex items-center gap-1 text-primary font-bold">
                                            <span className="material-symbols-outlined text-sm">stars</span>
                                            +{topic.xp_reward || 50} XP
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-3 rounded-lg font-bold text-sm bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                                    Bắt đầu luyện tập
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-surface-dark rounded-xl border border-dashed border-border-dark">
                            <span className="material-symbols-outlined text-4xl text-text-secondary opacity-20 mb-2">search_off</span>
                            <p className="text-text-secondary">Không tìm thấy thử thách nào cho mục này.</p>
                        </div>
                    )}
                </div>
            </div>
        </LearnerLayout>
    );
}

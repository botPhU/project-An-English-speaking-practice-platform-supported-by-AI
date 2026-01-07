import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { learnerService } from '../../services/learnerService';
import PracticeModal from '../../components/PracticeModal';

interface Topic {
    id: number;
    title: string;
    description?: string;
    category?: string;
    image_url?: string;
    difficulty_level?: number;
    time_limit?: number;
    xp_reward?: number;
}

export default function TopicSelection() {
    const [filter, setFilter] = useState('all');
    const [topics, setTopics] = useState<Topic[]>([]);
    const [dailyChallenge, setDailyChallenge] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [isPracticeOpen, setIsPracticeOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [dailyRes, topicsRes] = await Promise.all([
                learnerService.getDailyChallenge(),
                learnerService.getTopics()
            ]);
            setDailyChallenge(dailyRes.data);
            setTopics(topicsRes.data);
        } catch (error) {
            console.error('Error fetching topic data:', error);
        } finally {
            setLoading(false);
        }
    };

    const startPractice = (topic: Topic) => {
        setSelectedTopic(topic);
        setIsPracticeOpen(true);
    };

    const startDailyChallenge = () => {
        if (dailyChallenge) {
            setSelectedTopic({
                id: dailyChallenge.id || 0,
                title: dailyChallenge.title,
                description: dailyChallenge.description,
                category: 'Daily Challenge'
            });
            setIsPracticeOpen(true);
        }
    };

    const filteredTopics = filter === 'all'
        ? topics
        : topics.filter(t => t.category === filter);

    if (loading) {
        return (
            <LearnerLayout title="Nhập Vai AI">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </LearnerLayout>
        );
    }

    return (
        <LearnerLayout title="Nhập Vai AI">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Daily Challenge Hero */}
                {dailyChallenge && (
                    <div className="bg-gradient-to-r from-primary/20 to-purple-600/20 p-1 rounded-2xl border border-primary/20 relative">
                        <div className="bg-surface-dark/80 backdrop-blur-sm rounded-xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-[10rem] text-primary transform -rotate-12">
                                    forum
                                </span>
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">
                                        <span className="material-symbols-outlined text-sm">
                                            auto_awesome
                                        </span>
                                        THỬ THÁCH HÔM NAY
                                    </div>
                                    <h1 className="text-3xl font-bold text-white">
                                        {dailyChallenge.title}
                                    </h1>
                                    <p className="text-text-secondary text-base leading-relaxed">
                                        {dailyChallenge.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-lg">
                                                schedule
                                            </span>{" "}
                                            {dailyChallenge.time_limit || 10} phút
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-lg">
                                                signal_cellular_alt
                                            </span>{" "}
                                            {dailyChallenge.difficulty_level <= 1 ? 'Dễ' : dailyChallenge.difficulty_level <= 2 ? 'Trung bình' : 'Khó'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-lg text-yellow-500">
                                                star
                                            </span>{" "}
                                            +{dailyChallenge.xp_reward || 100} XP
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={startDailyChallenge}
                                    className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(43,140,238,0.39)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined">play_arrow</span>
                                    Bắt đầu ngay
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border-dark pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                            Thư viện Tình huống
                        </h2>
                        <p className="text-text-secondary text-sm">
                            Chọn chủ đề bạn muốn cải thiện kỹ năng giao tiếp.
                        </p>
                    </div>
                    <div className="flex items-center p-1 bg-surface-dark border border-border-dark rounded-lg overflow-x-auto w-full md:w-auto">
                        {['all', 'Công việc', 'Du lịch', 'Đời sống', 'IELTS'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${filter === cat
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat === 'all' ? 'Tất cả' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scenario Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                    {filteredTopics.length > 0 ? filteredTopics.map((topic) => (
                        <div
                            key={topic.id}
                            className="group bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(43,140,238,0.1)] transition-all duration-300 flex flex-col h-full cursor-pointer"
                            onClick={() => startPractice(topic)}
                        >
                            <div className="h-40 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                <img
                                    src={topic.image_url || `https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&q=80&w=400`}
                                    alt={topic.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-60"></div>
                                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-yellow-500 border border-white/10">
                                    Level: {topic.difficulty_level || 1}
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="text-xs text-white bg-primary/80 px-2 py-0.5 rounded backdrop-blur-sm">
                                        {topic.category || 'Chung'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                        {topic.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm line-clamp-2">
                                        {topic.description}
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-border-dark/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-text-secondary flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">
                                                schedule
                                            </span>{" "}
                                            {topic.time_limit || 5}m
                                        </span>
                                        <span className="text-xs text-primary font-bold">
                                            +{topic.xp_reward || 50} XP
                                        </span>
                                    </div>
                                    <button className="w-8 h-8 rounded-full border border-border-dark flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                                        <span className="material-symbols-outlined text-sm">
                                            mic
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-surface-dark rounded-xl border border-dashed border-border-dark">
                            <span className="material-symbols-outlined text-4xl text-text-secondary opacity-20 mb-2">find_in_page</span>
                            <p className="text-text-secondary">Chưa có tình huống nào trong mục này.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Practice Modal */}
            <PracticeModal
                isOpen={isPracticeOpen}
                onClose={() => setIsPracticeOpen(false)}
                topic={selectedTopic}
            />
        </LearnerLayout>
    );
}

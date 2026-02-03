import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Badge {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: string;
    points: number;
    requirement_type: string;
    requirement_value: number;
}

interface EarnedBadge {
    id: number;
    badge_id: number;
    earned_at: string;
    badge: Badge;
}

interface BadgeProgress {
    badge: Badge;
    current_value: number;
    target_value: number;
    percentage: number;
    remaining: number;
}

interface UserBadges {
    earned: EarnedBadge[];
    locked: Badge[];
    total_earned: number;
    total_available: number;
    total_points: number;
    completion_percentage: number;
}

export default function Achievements() {
    const { user } = useAuth();
    const [userBadges, setUserBadges] = useState<UserBadges | null>(null);
    const [progress, setProgress] = useState<BadgeProgress[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchBadges();
            fetchProgress();
            checkNewBadges();
        }
    }, [user?.id]);

    const fetchBadges = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/badges/user/${user?.id}`);
            setUserBadges(response.data);
        } catch (error) {
            console.error('Failed to fetch badges:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await api.get(`/api/badges/user/${user?.id}/progress`);
            setProgress(response.data);
        } catch (error) {
            console.error('Failed to fetch progress:', error);
        }
    };

    const checkNewBadges = async () => {
        try {
            const response = await api.post(`/api/badges/user/${user?.id}/check`);
            if (response.data.count > 0) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
                fetchBadges(); // Refresh badges
            }
        } catch (error) {
            console.error('Failed to check badges:', error);
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'from-gray-400 to-gray-600';
            case 'rare': return 'from-blue-400 to-blue-600';
            case 'epic': return 'from-purple-400 to-purple-600';
            case 'legendary': return 'from-yellow-400 to-yellow-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const getRarityLabel = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'Phổ thông';
            case 'rare': return 'Hiếm';
            case 'epic': return 'Sử thi';
            case 'legendary': return 'Huyền thoại';
            default: return rarity;
        }
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'streak': return '🔥 Streak';
            case 'practice': return '💬 Luyện tập';
            case 'score': return '⭐ Điểm số';
            case 'level': return '📈 Trình độ';
            case 'special': return '✨ Đặc biệt';
            default: return category;
        }
    };

    const categories = ['all', 'streak', 'practice', 'score', 'level', 'special'];

    const filteredEarned = userBadges?.earned.filter(
        eb => activeCategory === 'all' || eb.badge.category === activeCategory
    ) || [];

    const filteredLocked = userBadges?.locked.filter(
        b => activeCategory === 'all' || b.category === activeCategory
    ) || [];

    return (
        <LearnerLayout>
            <div className="max-w-5xl mx-auto p-6">
                {/* Confetti Animation */}
                {showConfetti && (
                    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
                        <div className="text-6xl animate-bounce">🎉</div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">🏅 Huy hiệu & Thành tựu</h1>
                    <p className="text-gray-600">Thu thập huy hiệu bằng cách hoàn thành các mục tiêu học tập</p>
                </div>

                {/* Stats Cards */}
                {userBadges && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                            <p className="text-blue-100 text-sm">Đã đạt</p>
                            <p className="text-3xl font-bold">{userBadges.total_earned}</p>
                            <p className="text-blue-200 text-xs">/{userBadges.total_available} huy hiệu</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                            <p className="text-purple-100 text-sm">Hoàn thành</p>
                            <p className="text-3xl font-bold">{userBadges.completion_percentage}%</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                            <p className="text-yellow-100 text-sm">Tổng điểm</p>
                            <p className="text-3xl font-bold">{userBadges.total_points}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                            <p className="text-green-100 text-sm">Còn lại</p>
                            <p className="text-3xl font-bold">{userBadges.total_available - userBadges.total_earned}</p>
                        </div>
                    </div>
                )}

                {/* Progress Section */}
                {progress.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Tiến độ huy hiệu tiếp theo</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {progress.map((p) => (
                                <div key={p.badge.id} className="border rounded-xl p-4 hover:shadow-md transition">
                                    <div className="flex items-center mb-3">
                                        <span className="text-3xl mr-3">{p.badge.icon}</span>
                                        <div>
                                            <p className="font-medium text-gray-800">{p.badge.name}</p>
                                            <p className="text-sm text-gray-500">{p.badge.description}</p>
                                        </div>
                                    </div>
                                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute h-full bg-gradient-to-r ${getRarityColor(p.badge.rarity)} transition-all duration-500`}
                                            style={{ width: `${p.percentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm">
                                        <span className="text-gray-600">{p.current_value}/{p.target_value}</span>
                                        <span className="text-gray-500">Còn {p.remaining}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === cat
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat === 'all' ? '📋 Tất cả' : getCategoryLabel(cat)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Đang tải...</p>
                    </div>
                ) : (
                    <>
                        {/* Earned Badges */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                ✅ Đã đạt được ({filteredEarned.length})
                            </h2>
                            {filteredEarned.length === 0 ? (
                                <p className="text-gray-500 py-8 text-center">Chưa có huy hiệu nào trong danh mục này</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredEarned.map((eb) => (
                                        <div
                                            key={eb.id}
                                            className="bg-white rounded-xl shadow-lg p-4 text-center hover:shadow-xl transition transform hover:-translate-y-1"
                                        >
                                            <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(eb.badge.rarity)} flex items-center justify-center text-3xl mb-3`}>
                                                {eb.badge.icon}
                                            </div>
                                            <h3 className="font-bold text-gray-800">{eb.badge.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{eb.badge.description}</p>
                                            <div className="flex justify-center gap-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getRarityColor(eb.badge.rarity)} text-white`}>
                                                    {getRarityLabel(eb.badge.rarity)}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                                                    +{eb.badge.points} điểm
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Đạt {new Date(eb.earned_at).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Locked Badges */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                🔒 Chưa mở khóa ({filteredLocked.length})
                            </h2>
                            {filteredLocked.length === 0 ? (
                                <p className="text-gray-500 py-8 text-center">Đã mở khóa tất cả huy hiệu trong danh mục này! 🎉</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredLocked.map((badge) => (
                                        <div
                                            key={badge.id}
                                            className="bg-gray-100 rounded-xl p-4 text-center opacity-60 hover:opacity-80 transition"
                                        >
                                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-300 flex items-center justify-center text-3xl mb-3 grayscale">
                                                {badge.icon}
                                            </div>
                                            <h3 className="font-bold text-gray-600">{badge.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                                            <div className="flex justify-center gap-2">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-300 text-gray-600">
                                                    {getRarityLabel(badge.rarity)}
                                                </span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-300 text-gray-600">
                                                    +{badge.points} điểm
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Motivation Banner */}
                <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center">
                    <h3 className="text-xl font-bold mb-2">🌟 Tiếp tục hành trình!</h3>
                    <p className="opacity-90">Hoàn thành các buổi học mỗi ngày để mở khóa thêm huy hiệu</p>
                </div>
            </div>
        </LearnerLayout>
    );
}

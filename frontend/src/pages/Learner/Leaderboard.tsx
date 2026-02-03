import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface LeaderboardEntry {
    rank: number;
    user_id: number;
    username: string;
    avatar?: string;
    total_score: number;
    score?: number;
    level?: string;
    streak?: number;
}

interface UserRank {
    rank: number;
    total_score: number;
    percentile: number;
    next_rank_score?: number;
    users_ahead?: number;
    users_behind?: number;
}

export default function Leaderboard() {
    const { user } = useAuth();
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
    const [category, setCategory] = useState<'overall' | 'pronunciation' | 'grammar' | 'vocabulary'>('overall');
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [myRank, setMyRank] = useState<UserRank | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'global' | 'streaks' | 'categories'>('global');

    useEffect(() => {
        fetchLeaderboard();
        if (user?.id) {
            fetchMyRank();
        }
    }, [period, category, activeTab, user?.id]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            let response;
            if (activeTab === 'global') {
                response = await api.get(`/api/leaderboard?period=${period}&limit=20`);
            } else if (activeTab === 'streaks') {
                response = await api.get('/api/leaderboard/top-streaks?limit=20');
            } else {
                response = await api.get(`/api/leaderboard/categories?category=${category}&limit=20`);
            }
            setEntries(response.data.entries || []);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRank = async () => {
        try {
            const response = await api.get(`/api/leaderboard/my-rank?user_id=${user?.id}&period=${period}`);
            setMyRank(response.data);
        } catch (error) {
            console.error('Failed to fetch rank:', error);
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
        if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600';
        return 'bg-gray-100';
    };

    return (
        <LearnerLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">🏆 Bảng Xếp Hạng</h1>
                    <p className="text-gray-600">Xem thứ hạng của bạn và các học viên khác</p>
                </div>

                {/* My Rank Card */}
                {myRank && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 mb-1">Thứ hạng của bạn</p>
                                <p className="text-4xl font-bold">{getRankIcon(myRank.rank)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-100 mb-1">Tổng điểm</p>
                                <p className="text-3xl font-bold">{myRank.total_score.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-100 mb-1">Top</p>
                                <p className="text-3xl font-bold">{myRank.percentile}%</p>
                            </div>
                        </div>
                        {myRank.next_rank_score && (
                            <div className="mt-4 pt-4 border-t border-blue-400">
                                <p className="text-sm text-blue-100">
                                    Cần thêm <span className="font-bold text-white">{myRank.next_rank_score - myRank.total_score}</span> điểm để lên hạng tiếp theo
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'global'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        🌍 Toàn cầu
                    </button>
                    <button
                        onClick={() => setActiveTab('streaks')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'streaks'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        🔥 Streak
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'categories'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        📊 Kỹ năng
                    </button>
                </div>

                {/* Filters */}
                {activeTab === 'global' && (
                    <div className="flex gap-2 mb-6">
                        {(['weekly', 'monthly', 'all-time'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${period === p
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {p === 'weekly' ? 'Tuần này' : p === 'monthly' ? 'Tháng này' : 'Tất cả'}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="flex gap-2 mb-6">
                        {(['overall', 'pronunciation', 'grammar', 'vocabulary'] as const).map((c) => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${category === c
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {c === 'overall' ? 'Tổng hợp' :
                                    c === 'pronunciation' ? 'Phát âm' :
                                        c === 'grammar' ? 'Ngữ pháp' : 'Từ vựng'}
                            </button>
                        ))}
                    </div>
                )}

                {/* Leaderboard List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500">Đang tải...</p>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">Chưa có dữ liệu bảng xếp hạng</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {entries.map((entry) => (
                                <div
                                    key={entry.user_id}
                                    className={`flex items-center p-4 hover:bg-gray-50 transition ${entry.user_id === Number(user?.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${getRankColor(entry.rank)}`}>
                                        {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                                    </div>

                                    {/* Avatar & Name */}
                                    <div className="flex items-center flex-1 ml-4">
                                        <img
                                            src={entry.avatar || `https://ui-avatars.com/api/?name=${entry.username}&background=random`}
                                            alt={entry.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="ml-3">
                                            <p className="font-medium text-gray-800">
                                                {entry.username}
                                                {entry.user_id === Number(user?.id) && (
                                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Bạn</span>
                                                )}
                                            </p>
                                            {entry.level && (
                                                <p className="text-sm text-gray-500">Level: {entry.level}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Score or Streak */}
                                    <div className="text-right">
                                        {activeTab === 'streaks' ? (
                                            <p className="text-2xl font-bold text-orange-500">🔥 {entry.streak}</p>
                                        ) : (
                                            <p className="text-xl font-bold text-blue-600">{entry.total_score?.toLocaleString() || entry.score?.toLocaleString()}</p>
                                        )}
                                        <p className="text-xs text-gray-400">
                                            {activeTab === 'streaks' ? 'ngày liên tiếp' : 'điểm'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Motivation Banner */}
                <div className="mt-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white text-center">
                    <h3 className="text-xl font-bold mb-2">💪 Tiếp tục luyện tập!</h3>
                    <p className="opacity-90">Hoàn thành các buổi học mỗi ngày để leo lên bảng xếp hạng</p>
                </div>
            </div>
        </LearnerLayout>
    );
}

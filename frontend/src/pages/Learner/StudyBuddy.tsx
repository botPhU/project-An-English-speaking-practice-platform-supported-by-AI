import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import { studyBuddyService } from '../../services/studyBuddyService';
import type { PotentialBuddy, MatchResult } from '../../services/studyBuddyService';

type MatchingState = 'idle' | 'searching' | 'waiting' | 'matched';

export default function StudyBuddy() {
    const { user } = useAuth();
    const [buddies, setBuddies] = useState<PotentialBuddy[]>([]);
    const [matchState, setMatchState] = useState<MatchingState>('idle');
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const topics = [
        { id: 'daily', label: '🏠 Đời sống hàng ngày', icon: '🏠' },
        { id: 'business', label: '💼 Kinh doanh', icon: '💼' },
        { id: 'travel', label: '✈️ Du lịch', icon: '✈️' },
        { id: 'technology', label: '💻 Công nghệ', icon: '💻' },
        { id: 'culture', label: '🎭 Văn hóa', icon: '🎭' },
        { id: 'health', label: '🏥 Sức khỏe', icon: '🏥' }
    ];

    useEffect(() => {
        if (user?.id) {
            fetchBuddies();
            checkExistingMatch();
        }
    }, [user?.id]);

    // Poll for match status when waiting
    useEffect(() => {
        let pollInterval: ReturnType<typeof setInterval>;

        if (matchState === 'waiting' && user?.id) {
            pollInterval = setInterval(async () => {
                try {
                    const status = await studyBuddyService.checkStatus(Number(user.id));
                    if (status.matched) {
                        setMatchState('matched');
                        setMatchResult(status);
                    }
                } catch (err) {
                    console.error('Failed to check status:', err);
                }
            }, 3000);
        }

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [matchState, user?.id]);

    const fetchBuddies = async () => {
        setLoading(true);
        try {
            const data = await studyBuddyService.findBuddies(Number(user?.id), undefined, 10);
            setBuddies(data);
        } catch (err) {
            console.error('Failed to fetch buddies:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkExistingMatch = async () => {
        try {
            const status = await studyBuddyService.checkStatus(Number(user?.id));
            if (status.matched) {
                setMatchState('matched');
                setMatchResult(status);
            } else if (status.waiting) {
                setMatchState('waiting');
                setMatchResult(status);
            }
        } catch (err) {
            console.error('Failed to check existing match:', err);
        }
    };

    const handleFindMatch = async () => {
        if (!selectedTopic) {
            setError('Vui lòng chọn một chủ đề');
            return;
        }

        setError('');
        setMatchState('searching');

        try {
            const result = await studyBuddyService.requestMatch(
                Number(user?.id),
                selectedTopic
            );

            if (result.matched) {
                setMatchState('matched');
                setMatchResult(result);
            } else {
                setMatchState('waiting');
                setMatchResult(result);
            }
        } catch (err) {
            setError('Không thể tìm bạn học. Vui lòng thử lại.');
            setMatchState('idle');
        }
    };

    const handleCancelMatch = async () => {
        try {
            await studyBuddyService.cancelRequest(Number(user?.id));
            setMatchState('idle');
            setMatchResult(null);
        } catch (err) {
            console.error('Failed to cancel:', err);
        }
    };

    const handleEndSession = async () => {
        try {
            await studyBuddyService.endSession(Number(user?.id));
            setMatchState('idle');
            setMatchResult(null);
            fetchBuddies();
        } catch (err) {
            console.error('Failed to end session:', err);
        }
    };

    return (
        <LearnerLayout>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">👥 Study Buddy</h1>
                    <p className="text-gray-600">Luyện nói với người học khác có cùng trình độ</p>
                </div>

                {/* Matched State */}
                {matchState === 'matched' && matchResult?.buddy && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white">
                        <div className="text-center">
                            <p className="text-green-100 mb-2">🎉 Đã tìm được bạn học!</p>
                            <div className="flex items-center justify-center gap-4 my-4">
                                <img
                                    src={matchResult.buddy.avatar_url || `https://ui-avatars.com/api/?name=${matchResult.buddy.full_name}`}
                                    alt={matchResult.buddy.full_name}
                                    className="w-20 h-20 rounded-full border-4 border-white"
                                />
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold">{matchResult.buddy.full_name}</h3>
                                    <p className="text-green-100">Chủ đề: {matchResult.topic}</p>
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    onClick={() => window.open(`/video-room/${matchResult.room_name}`, '_blank')}
                                    className="px-6 py-3 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition"
                                >
                                    📹 Bắt đầu Video Call
                                </button>
                                <button
                                    onClick={handleEndSession}
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition"
                                >
                                    Kết thúc
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Waiting State */}
                {matchState === 'waiting' && (
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 mb-8 text-white text-center">
                        <div className="animate-pulse">
                            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <span className="text-4xl">🔍</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Đang tìm bạn học...</h3>
                        <p className="text-blue-100 mb-4">
                            {matchResult?.position
                                ? `Vị trí trong hàng đợi: #${matchResult.position}`
                                : 'Chờ một chút...'}
                        </p>
                        <button
                            onClick={handleCancelMatch}
                            className="px-6 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
                        >
                            Hủy tìm kiếm
                        </button>
                    </div>
                )}

                {/* Find Match Section - Only show when idle */}
                {matchState === 'idle' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Tìm bạn học</h2>

                        {/* Topic Selection */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-3">Chọn chủ đề:</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {topics.map((topic) => (
                                    <button
                                        key={topic.id}
                                        onClick={() => setSelectedTopic(topic.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition ${selectedTopic === topic.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="text-2xl">{topic.icon}</span>
                                        <p className="mt-1 font-medium text-sm">
                                            {topic.label.split(' ').slice(1).join(' ')}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}

                        <button
                            onClick={handleFindMatch}
                            disabled={matchState === 'searching'}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {matchState === 'searching' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span> Đang tìm...
                                </span>
                            ) : (
                                '🚀 Tìm bạn học ngay'
                            )}
                        </button>
                    </div>
                )}

                {/* Online Buddies */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        👥 Bạn học đang online ({buddies.filter(b => b.is_online).length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : buddies.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            Chưa có bạn học nào online
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {buddies.map((buddy) => (
                                <div
                                    key={buddy.id}
                                    className="flex items-center p-4 border rounded-xl hover:shadow-md transition"
                                >
                                    <div className="relative">
                                        <img
                                            src={buddy.avatar_url || `https://ui-avatars.com/api/?name=${buddy.full_name}`}
                                            alt={buddy.full_name}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        {buddy.is_online && (
                                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h3 className="font-medium text-gray-800">{buddy.full_name}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                                Level: {buddy.level}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                                                🔥 {buddy.current_streak}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <p>{buddy.total_sessions} buổi</p>
                                        <p>{buddy.xp_points} XP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Banner */}
                <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">💡 Lợi ích của Study Buddy</h3>
                    <ul className="space-y-2 opacity-90">
                        <li>✅ Luyện tập giao tiếp thực tế</li>
                        <li>✅ Cải thiện khả năng nghe và phản xạ</li>
                        <li>✅ Kết bạn với người cùng đam mê</li>
                        <li>✅ Thực hành không sợ sai</li>
                    </ul>
                </div>
            </div>
        </LearnerLayout>
    );
}

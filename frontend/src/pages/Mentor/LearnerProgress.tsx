import { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Learner {
    id: number;
    user_name: string;
    full_name: string;
    email: string;
    level?: string;
    total_sessions?: number;
    last_session?: string;
}

interface LearnerProgress {
    overall_score: number;
    pronunciation_score: number;
    grammar_score: number;
    vocabulary_score: number;
    fluency_score: number;
    streak: number;
    total_practice_time: number;
    sessions_this_week: number;
    improvement: number;
}

export default function LearnerProgress() {
    const { user } = useAuth();
    const [learners, setLearners] = useState<Learner[]>([]);
    const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchLearners();
        }
    }, [user?.id]);

    const fetchLearners = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/mentor/learners/${user?.id}`);
            setLearners(response.data || []);
        } catch (error) {
            console.error('Failed to fetch learners:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async (learnerId: number) => {
        try {
            const response = await api.get(`/api/learner/progress/${learnerId}`);
            setProgress(response.data);
        } catch (error) {
            console.error('Failed to fetch progress:', error);
            // Set mock data for demo
            setProgress({
                overall_score: 75,
                pronunciation_score: 70,
                grammar_score: 80,
                vocabulary_score: 72,
                fluency_score: 68,
                streak: 5,
                total_practice_time: 1240,
                sessions_this_week: 4,
                improvement: 12
            });
        }
    };

    const selectLearner = (learner: Learner) => {
        setSelectedLearner(learner);
        fetchProgress(learner.id);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 60) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <MentorLayout>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Tiến độ Học viên</h1>
                    <p className="text-gray-600">Theo dõi và đánh giá tiến độ của học viên</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Learner List */}
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">👥 Danh sách học viên</h2>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            </div>
                        ) : learners.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Chưa có học viên</p>
                        ) : (
                            <div className="space-y-2">
                                {learners.map((learner) => (
                                    <button
                                        key={learner.id}
                                        onClick={() => selectLearner(learner)}
                                        className={`w-full p-3 rounded-xl text-left transition ${selectedLearner?.id === learner.id
                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                {learner.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{learner.full_name}</p>
                                                <p className="text-xs text-gray-500">{learner.email}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress Detail */}
                    <div className="md:col-span-2">
                        {selectedLearner && progress ? (
                            <div className="space-y-6">
                                {/* Learner Info */}
                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                                            {selectedLearner.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedLearner.full_name}</h2>
                                            <p className="text-blue-100">{selectedLearner.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className="bg-white/10 rounded-xl p-3 text-center">
                                            <p className="text-3xl font-bold">{progress.streak}</p>
                                            <p className="text-sm text-blue-100">🔥 Streak</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-3 text-center">
                                            <p className="text-3xl font-bold">{progress.sessions_this_week}</p>
                                            <p className="text-sm text-blue-100">📚 Tuần này</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-3 text-center">
                                            <p className="text-3xl font-bold">+{progress.improvement}%</p>
                                            <p className="text-sm text-blue-100">📈 Tiến bộ</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Skill Scores */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">🎯 Điểm theo Kỹ năng</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Tổng thể', score: progress.overall_score, icon: '⭐' },
                                            { label: 'Phát âm', score: progress.pronunciation_score, icon: '🗣️' },
                                            { label: 'Ngữ pháp', score: progress.grammar_score, icon: '📝' },
                                            { label: 'Từ vựng', score: progress.vocabulary_score, icon: '📖' },
                                            { label: 'Lưu loát', score: progress.fluency_score, icon: '💬' }
                                        ].map((skill) => (
                                            <div key={skill.label} className="flex items-center gap-4">
                                                <span className="text-2xl">{skill.icon}</span>
                                                <div className="flex-1">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm font-medium text-gray-700">{skill.label}</span>
                                                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${getScoreColor(skill.score)}`}>
                                                            {skill.score}%
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${skill.score >= 80 ? 'bg-green-500' :
                                                                    skill.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${skill.score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Practice Time */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">⏱️ Thời gian luyện tập</h3>
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-blue-600">{formatTime(progress.total_practice_time)}</p>
                                        <p className="text-gray-500">Tổng thời gian</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                                        📝 Gửi Feedback
                                    </button>
                                    <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition">
                                        📚 Giao bài tập
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <span className="text-6xl">👆</span>
                                <p className="mt-4 text-gray-500">Chọn một học viên để xem tiến độ</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import { learnerService } from '../../services/learnerService';
import type { LearnerProgress, PracticeSession } from '../../services/learnerService';

export default function Progress() {
    const { user: authUser } = useAuth();
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [sessions, setSessions] = useState<PracticeSession[]>([]);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser?.id) {
            fetchProgressData();
        }
    }, [authUser?.id]);

    const fetchProgressData = async () => {
        try {
            setLoading(true);
            const [progRes, sessRes, achRes] = await Promise.all([
                learnerService.getProgress(Number(authUser?.id)),
                learnerService.getSessions(Number(authUser?.id), 5),
                learnerService.getAchievements(Number(authUser?.id))
            ]);
            setProgress(progRes.data);
            setSessions(sessRes.data);
            setAchievements(achRes.data.badges || []);
        } catch (error) {
            console.error('Error fetching progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to generate skill scores for the UI
    const skillScores = [
        { skill: 'Phát âm', score: progress?.pronunciation_score || 0, icon: 'record_voice_over', color: 'bg-blue-500' },
        { skill: 'Ngữ pháp', score: progress?.grammar_score || 0, icon: 'spellcheck', color: 'bg-green-500' },
        { skill: 'Từ vựng', score: progress?.vocabulary_score || 0, icon: 'translate', color: 'bg-purple-500' },
        { skill: 'Độ trôi chảy', score: progress?.fluency_score || 0, icon: 'speed', color: 'bg-pink-500' },
    ];

    if (loading) {
        return (
            <LearnerLayout title="Tiến độ & Phản hồi AI">
                <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </LearnerLayout>
        );
    }

    return (
        <LearnerLayout title="Tiến độ & Phản hồi AI">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Tiến độ học tập</h1>
                        <p className="text-text-secondary mt-1">Theo dõi hiệu suất và nhận phản hồi từ AI</p>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">auto_graph</span>
                            </div>
                            <span className="text-text-secondary text-sm">Điểm tổng quát</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{progress?.overall_score || 0}%</p>
                        <p className="text-xs text-text-secondary mt-1">Trình độ: {progress?.current_level?.toUpperCase() || 'BEGINNER'}</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                            </div>
                            <span className="text-text-secondary text-sm">Chuỗi ngày</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{progress?.current_streak || 0} ngày</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                            </div>
                            <span className="text-text-secondary text-sm">Bài hoàn thành</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{progress?.total_sessions || 0} bài</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-500">stars</span>
                            </div>
                            <span className="text-text-secondary text-sm">Điểm XP</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{progress?.xp_points?.toLocaleString() || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Activity Note */}
                    <div className="lg:col-span-2 bg-surface-dark border border-border-dark rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-6xl text-text-secondary opacity-20 mb-4">analytics</span>
                        <h3 className="text-lg font-bold text-white mb-2">Biểu đồ hoạt động</h3>
                        <p className="text-text-secondary text-sm max-w-md">
                            Thông tin chi tiết về thời gian học tập của bạn sẽ xuất hiện tại đây sau khi bạn hoàn thành các buổi học đầu tiên.
                        </p>
                    </div>

                    {/* Skill Scores */}
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">leaderboard</span>
                            Điểm kỹ năng
                        </h2>
                        <div className="space-y-4">
                            {skillScores.map((skill, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-text-secondary">{skill.icon}</span>
                                            <span className="text-sm text-white">{skill.skill}</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">{skill.score}%</span>
                                    </div>
                                    <div className="h-2 bg-border-dark rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                                            style={{ width: `${skill.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">emoji_events</span>
                        Thành tích đã đạt
                    </h2>
                    {achievements.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {achievements.map((achievement, index) => (
                                <div
                                    key={index}
                                    className="relative p-4 rounded-xl border transition-all text-center bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/30 hover:border-primary/50"
                                >
                                    <div className="size-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
                                        <span className="material-symbols-outlined text-2xl text-yellow-500">
                                            {achievement.icon || 'military_tech'}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-white text-sm">{achievement.name}</h3>
                                    <p className="text-xs text-text-secondary mt-1">{achievement.description}</p>
                                    <span className="absolute top-2 right-2 text-green-500">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-background-dark rounded-xl border border-dashed border-border-dark">
                            <span className="material-symbols-outlined text-4xl text-text-secondary opacity-20 mb-2">military_tech</span>
                            <p className="text-text-secondary text-sm">Bạn chưa có thành tích nào. Hãy tích cực học tập để nhận huy hiệu nhé!</p>
                        </div>
                    )}
                </div>

                {/* AI Feedback Section */}
                <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">psychology</span>
                            Phản hồi từ AI
                        </h2>
                    </div>
                    {sessions.filter(s => s.ai_feedback).length > 0 ? (
                        <div className="space-y-4">
                            {sessions.filter(s => s.ai_feedback).map((session, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-xl bg-background-dark border border-border-dark hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="size-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/20">
                                            <span className="material-symbols-outlined text-primary">comment</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                    {session.topic || 'Giao tiếp'}
                                                </span>
                                                <span className="text-xs text-text-secondary">Điểm: {session.overall_score}% • {new Date(session.created_at).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <p className="text-text-secondary text-sm leading-relaxed italic">
                                                "{session.ai_feedback}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-background-dark rounded-xl border border-dashed border-border-dark">
                            <span className="material-symbols-outlined text-4xl text-text-secondary opacity-20 mb-2">feedback</span>
                            <p className="text-text-secondary text-sm">Chưa có phản hồi chi tiết từ AI. Hãy hoàn thành các buổi luyện tập để xem phân tích ở đây.</p>
                        </div>
                    )}
                </div>
            </div>
        </LearnerLayout>
    );
}

import { useEffect, useState } from 'react';
import { feedbackService } from '../../services/feedbackService';

interface LearnerProfileModalProps {
    learnerId: number;
    learnerName: string;
    learnerEmail?: string;
    learnerAvatar?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function LearnerProfileModal({
    learnerId,
    learnerName,
    learnerEmail,
    learnerAvatar,
    isOpen,
    onClose
}: LearnerProfileModalProps) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && learnerId) {
            fetchLearnerStats();
        }
    }, [isOpen, learnerId]);

    const fetchLearnerStats = async () => {
        setLoading(true);
        try {
            const data = await feedbackService.getLearnerProgress(learnerId);
            setStats(data);
        } catch (error) {
            console.error('Error fetching learner stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <div className="bg-[#1a222a] rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl border border-border-dark animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-primary/80 to-purple-600/80">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 size-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>

                    <div className="absolute -bottom-10 left-6 flex items-end">
                        <div className="size-20 rounded-full border-4 border-[#1a222a] bg-[#283039] overflow-hidden">
                            {learnerAvatar ? (
                                <img src={learnerAvatar} alt={learnerName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold bg-primary/20">
                                    {learnerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="pt-12 px-6 pb-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white">{learnerName}</h2>
                        <p className="text-text-secondary">{learnerEmail || 'Không có email'}</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Key Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-[#283039] p-3 rounded-xl text-center border border-[#3e4854]/50">
                                    <p className="text-2xl font-bold text-primary">{stats?.current_level || 'A1'}</p>
                                    <p className="text-xs text-text-secondary uppercase mt-1">Trình độ</p>
                                </div>
                                <div className="bg-[#283039] p-3 rounded-xl text-center border border-[#3e4854]/50">
                                    <p className="text-2xl font-bold text-yellow-400">{stats?.total_sessions || 0}</p>
                                    <p className="text-xs text-text-secondary uppercase mt-1">Phiên học</p>
                                </div>
                                <div className="bg-[#283039] p-3 rounded-xl text-center border border-[#3e4854]/50">
                                    <p className="text-2xl font-bold text-orange-400">{stats?.current_streak || 0}🔥</p>
                                    <p className="text-xs text-text-secondary uppercase mt-1">Streak</p>
                                </div>
                            </div>

                            {/* Detailed Stats */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kỹ năng</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Phát âm (Pronunciation)', value: stats?.skill_averages?.pronunciation || 0, color: 'bg-purple-500' },
                                        { label: 'Ngữ pháp (Grammar)', value: stats?.skill_averages?.grammar || 0, color: 'bg-blue-500' },
                                        { label: 'Từ vựng (Vocabulary)', value: stats?.skill_averages?.vocabulary || 0, color: 'bg-green-500' },
                                        { label: 'Lưu loát (Fluency)', value: stats?.skill_averages?.fluency || 0, color: 'bg-yellow-500' },
                                    ].map((skill, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-text-secondary">{skill.label}</span>
                                                <span className="text-white font-bold">{skill.value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#283039] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${skill.color}`}
                                                    style={{ width: `${skill.value}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Focus */}
                            {stats?.recent_focus && (
                                <div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Trọng tâm gần đây</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(stats.recent_focus) ? stats.recent_focus.map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white">
                                                {tag}
                                            </span>
                                        )) : (
                                            <p className="text-sm text-text-secondary">{stats.recent_focus}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-[#3e4854] hover:bg-[#4e5a69] text-white rounded-xl font-bold transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

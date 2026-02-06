import { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { mentorService } from '../../services/mentorService';
import { useAuth } from '../../context/AuthContext';

interface Learner {
    id: number;
    user_name?: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    assigned_at?: string;
    stats?: {
        total_sessions: number;
        average_score: number;
        total_turns: number;
    };
    recent_session?: any;
}

interface Session {
    id: number;
    session_type?: string;
    topic: string;
    average_score?: number;
    is_active?: boolean;
    started_at?: string;
    ended_at?: string;
    total_turns?: number;
    messages?: any[];
}

// Learner Assessment - Tổ chức đánh giá và xếp level cho learner
export default function LearnerAssessment() {
    const { user } = useAuth();
    const [learners, setLearners] = useState<Learner[]>([]);
    const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
    const [learnerSessions, setLearnerSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [assessmentForm, setAssessmentForm] = useState({
        speaking: 0,
        listening: 0,
        grammar: 0,
        vocabulary: 0,
        fluency: 0,
        notes: ''
    });
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const assessmentCategories = [
        { name: 'Speaking', icon: 'record_voice_over', weight: 30, key: 'speaking' as const },
        { name: 'Listening', icon: 'hearing', weight: 25, key: 'listening' as const },
        { name: 'Grammar', icon: 'spellcheck', weight: 20, key: 'grammar' as const },
        { name: 'Vocabulary', icon: 'menu_book', weight: 15, key: 'vocabulary' as const },
        { name: 'Fluency', icon: 'speed', weight: 10, key: 'fluency' as const },
    ];

    const levels = [
        { name: 'A1', label: 'Beginner', range: '0-20', description: 'Có thể hiểu và sử dụng các cụm từ cơ bản' },
        { name: 'A2', label: 'Elementary', range: '21-40', description: 'Có thể giao tiếp trong các tình huống đơn giản' },
        { name: 'B1', label: 'Intermediate', range: '41-60', description: 'Có thể xử lý hầu hết các tình huống du lịch' },
        { name: 'B2', label: 'Upper-Int', range: '61-80', description: 'Có thể tương tác với mức độ trôi chảy' },
        { name: 'C1', label: 'Advanced', range: '81-90', description: 'Có thể sử dụng ngôn ngữ linh hoạt và hiệu quả' },
        { name: 'C2', label: 'Proficient', range: '91-100', description: 'Có thể hiểu và diễn đạt mọi thứ dễ dàng' },
    ];

    // Fetch learners on mount
    useEffect(() => {
        const fetchLearners = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const response = await mentorService.getLearners(Number(user.id));
                // API returns { success: true, learners: [...] }
                setLearners(response.data.learners || response.data || []);
            } catch (error) {
                console.error('Error fetching learners:', error);
                setLearners([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLearners();
    }, [user]);

    // Fetch sessions when learner is selected
    const handleSelectLearner = async (learner: Learner) => {
        if (!user) return;
        setSelectedLearner(learner);
        try {
            const response = await mentorService.getLearnerSessions(Number(user.id), learner.id);
            setLearnerSessions(response.data || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            setLearnerSessions([]);
        }
    };

    // Submit assessment
    const handleSubmitAssessment = async () => {
        if (!user || !selectedLearner) return;

        const overallScore = (
            assessmentForm.speaking * 0.3 +
            assessmentForm.listening * 0.25 +
            assessmentForm.grammar * 0.2 +
            assessmentForm.vocabulary * 0.15 +
            assessmentForm.fluency * 0.1
        );

        try {
            await mentorService.assessLearner({
                mentor_id: Number(user.id),
                learner_id: selectedLearner.id,
                assessment: {
                    ...assessmentForm,
                    overall_score: overallScore
                }
            });
            alert('Đánh giá thành công!');
            setShowAssessmentModal(false);
            setAssessmentForm({ speaking: 0, listening: 0, grammar: 0, vocabulary: 0, fluency: 0, notes: '' });
        } catch (error) {
            console.error('Error submitting assessment:', error);
            alert('Có lỗi xảy ra khi đánh giá');
        }
    };

    const getLevel = (score: number) => {
        if (score <= 20) return 'A1';
        if (score <= 40) return 'A2';
        if (score <= 60) return 'B1';
        if (score <= 80) return 'B2';
        if (score <= 90) return 'C1';
        return 'C2';
    };

    return (
        <MentorLayout
            title="Đánh giá học viên"
            icon="assessment"
            subtitle="Tổ chức đánh giá và xếp level cho học viên"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Assessment Categories */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-4">Tiêu chí đánh giá</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {assessmentCategories.map((cat, index) => (
                            <div
                                key={index}
                                className="text-center p-4 rounded-xl bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-all"
                            >
                                <div className="size-12 rounded-xl bg-purple-600/20 flex items-center justify-center mx-auto mb-3">
                                    <span className="material-symbols-outlined text-purple-400 text-2xl">{cat.icon}</span>
                                </div>
                                <p className="font-bold text-white">{cat.name}</p>
                                <p className="text-sm text-purple-400">{cat.weight}%</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Level Scale */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-4">Thang điểm CEFR</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {levels.map((level, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl font-black text-purple-400">{level.name}</span>
                                    <span className="text-xs text-[#9dabb9]">({level.range})</span>
                                </div>
                                <p className="text-sm font-bold text-white mb-1">{level.label}</p>
                                <p className="text-xs text-[#9dabb9]">{level.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Learners List */}
                    <div className="lg:col-span-2 rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                            <div>
                                <h3 className="text-lg font-bold text-white">Danh sách học viên</h3>
                                <p className="text-sm text-[#9dabb9]">Chọn học viên để đánh giá</p>
                            </div>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center text-[#9dabb9]">
                                <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                                <p className="mt-2">Đang tải...</p>
                            </div>
                        ) : learners.length === 0 ? (
                            <div className="p-8 text-center text-[#9dabb9]">
                                <span className="material-symbols-outlined text-4xl">group_off</span>
                                <p className="mt-2">Chưa có học viên nào được gán</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#3e4854]/30">
                                {learners.map((learner) => (
                                    <div
                                        key={learner.id}
                                        className={`p-4 hover:bg-[#3e4854]/10 transition-colors cursor-pointer ${selectedLearner?.id === learner.id ? 'bg-purple-600/10' : ''}`}
                                        onClick={() => handleSelectLearner(learner)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold">
                                                    {learner.full_name?.charAt(0) || learner.user_name?.charAt(0) || 'L'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{learner.full_name || learner.user_name}</p>
                                                    <p className="text-xs text-[#9dabb9]">{learner.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-sm font-bold hover:bg-blue-600/30 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLearner(learner);
                                                        setShowDetailModal(true);
                                                    }}
                                                    title="Xem thông tin chi tiết"
                                                >
                                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                                </button>
                                                <button
                                                    className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLearner(learner);
                                                        setShowAssessmentModal(true);
                                                    }}
                                                >
                                                    Đánh giá
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Sessions */}
                    <div className="space-y-4">
                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="font-bold text-white mb-4">
                                {selectedLearner ? `Sessions của ${selectedLearner.full_name}` : 'Chọn học viên'}
                            </h3>
                            {!selectedLearner ? (
                                <p className="text-[#9dabb9] text-sm">Chọn một học viên để xem sessions</p>
                            ) : learnerSessions.length === 0 ? (
                                <p className="text-[#9dabb9] text-sm">Học viên chưa có session nào</p>
                            ) : (
                                <div className="space-y-3">
                                    {learnerSessions.slice(0, 5).map((session) => (
                                        <div key={session.id} className="p-3 rounded-lg bg-[#3e4854]/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-white">{session.topic || 'Không có chủ đề'}</span>
                                                {session.average_score && (
                                                    <span className="px-2 py-1 rounded bg-purple-600/20 text-purple-400 text-xs font-bold">
                                                        {getLevel(session.average_score)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-[#9dabb9]">
                                                <span>{session.session_type}</span>
                                                <span>{session.average_score ? `${Math.round(session.average_score)}/100` : 'Chưa chấm'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="rounded-xl bg-purple-600 p-5 text-white">
                            <h3 className="font-bold mb-3">Công cụ đánh giá</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left">
                                    <span className="material-symbols-outlined">quiz</span>
                                    <span className="text-sm font-medium">Tạo bài test mới</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left">
                                    <span className="material-symbols-outlined">analytics</span>
                                    <span className="text-sm font-medium">Xem thống kê</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-left">
                                    <span className="material-symbols-outlined">download</span>
                                    <span className="text-sm font-medium">Xuất báo cáo</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assessment Modal */}
            {showAssessmentModal && selectedLearner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1a222a] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Đánh giá {selectedLearner.full_name}</h3>
                            <button onClick={() => setShowAssessmentModal(false)} className="text-[#9dabb9] hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {assessmentCategories.map((cat) => (
                                <div key={cat.key} className="flex items-center justify-between">
                                    <label className="text-white font-medium">{cat.name} ({cat.weight}%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={assessmentForm[cat.key]}
                                        onChange={(e) => setAssessmentForm(prev => ({ ...prev, [cat.key]: Number(e.target.value) }))}
                                        className="w-24 px-3 py-2 rounded-lg bg-[#283039] text-white text-center"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="text-white font-medium block mb-2">Ghi chú</label>
                                <textarea
                                    value={assessmentForm.notes}
                                    onChange={(e) => setAssessmentForm(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg bg-[#283039] text-white resize-none h-24"
                                    placeholder="Nhận xét về học viên..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setShowAssessmentModal(false)}
                                className="flex-1 px-4 py-3 rounded-lg bg-[#283039] text-white font-bold hover:bg-[#3e4854] transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitAssessment}
                                className="flex-1 px-4 py-3 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors"
                            >
                                Lưu đánh giá
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Learner Detail Modal */}
            {showDetailModal && selectedLearner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a222a] rounded-2xl w-full max-w-2xl border border-[#3b4754] max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#3e4854]/30">
                            <h3 className="text-xl font-bold text-white">Thông tin học viên</h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-[#9dabb9] hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Profile Section */}
                        <div className="p-6">
                            <div className="flex items-start gap-6 mb-6">
                                {/* Avatar */}
                                <div className="size-24 rounded-full bg-purple-600/20 flex items-center justify-center">
                                    {selectedLearner.avatar_url ? (
                                        <img
                                            src={selectedLearner.avatar_url}
                                            alt={selectedLearner.full_name}
                                            className="size-24 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-purple-400">
                                            {selectedLearner.full_name?.charAt(0) || selectedLearner.user_name?.charAt(0) || 'L'}
                                        </span>
                                    )}
                                </div>
                                {/* Info */}
                                <div className="flex-1">
                                    <h4 className="text-2xl font-bold text-white mb-1">
                                        {selectedLearner.full_name || selectedLearner.user_name || 'Không có tên'}
                                    </h4>
                                    <p className="text-[#9dabb9] mb-3">{selectedLearner.email}</p>
                                    {selectedLearner.assigned_at && (
                                        <p className="text-sm text-[#9dabb9]">
                                            <span className="material-symbols-outlined text-sm align-middle mr-1">calendar_today</span>
                                            Được gán từ: {new Date(selectedLearner.assigned_at).toLocaleDateString('vi-VN')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            {selectedLearner.stats && (
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-[#283039] rounded-xl p-4 text-center">
                                        <div className="size-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                                            <span className="material-symbols-outlined text-blue-400">record_voice_over</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{selectedLearner.stats.total_sessions}</p>
                                        <p className="text-xs text-[#9dabb9]">Tổng phiên học</p>
                                    </div>
                                    <div className="bg-[#283039] rounded-xl p-4 text-center">
                                        <div className="size-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                                            <span className="material-symbols-outlined text-green-400">score</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{Math.round(selectedLearner.stats.average_score || 0)}</p>
                                        <p className="text-xs text-[#9dabb9]">Điểm trung bình</p>
                                    </div>
                                    <div className="bg-[#283039] rounded-xl p-4 text-center">
                                        <div className="size-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                                            <span className="material-symbols-outlined text-purple-400">chat</span>
                                        </div>
                                        <p className="text-2xl font-bold text-white">{selectedLearner.stats.total_turns || 0}</p>
                                        <p className="text-xs text-[#9dabb9]">Tổng lượt nói</p>
                                    </div>
                                </div>
                            )}

                            {/* Recent Sessions */}
                            <div>
                                <h5 className="font-bold text-white mb-3">Phiên học gần đây</h5>
                                {learnerSessions.length === 0 ? (
                                    <p className="text-[#9dabb9] text-sm">Chưa có phiên học nào</p>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {learnerSessions.slice(0, 5).map((session) => (
                                            <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-[#283039]">
                                                <div>
                                                    <p className="font-medium text-white">{session.topic || 'Không có chủ đề'}</p>
                                                    <p className="text-xs text-[#9dabb9]">
                                                        {session.started_at ? new Date(session.started_at).toLocaleDateString('vi-VN') : 'N/A'}
                                                    </p>
                                                </div>
                                                {session.average_score && (
                                                    <span className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-400 font-bold">
                                                        {Math.round(session.average_score)}/100
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-[#3e4854]/30">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full px-4 py-3 rounded-lg bg-[#283039] text-white font-bold hover:bg-[#3e4854] transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MentorLayout>
    );
}

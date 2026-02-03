import { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { useAuth } from '../../context/AuthContext';
import { mentorService } from '../../services/mentorService';
import api from '../../services/api';

interface PracticeSession {
    id: number;
    learner_id: number;
    learner_name: string;
    topic: string;
    session_type: string;
    duration_minutes: number;
    started_at: string | null;
    ended_at: string | null;
    pronunciation_score: number | null;
    grammar_score: number | null;
    vocabulary_score: number | null;
    fluency_score: number | null;
    overall_score: number | null;
    has_audio: boolean;
}

interface AISession {
    id: string;
    learner_name: string;
    topic: string;
    mode: 'repeat' | 'conversation';
    created_at: string;
    average_score: number;
    messages: {
        role: 'ai' | 'user';
        text: string;
        score?: number;
        feedback?: string;
    }[];
}

// Feedback Session - Phản hồi sau khi luyện tập
export default function FeedbackSession() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<PracticeSession[]>([]);
    const [aiSessions, setAiSessions] = useState<AISession[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingSessionId, setPlayingSessionId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'practice' | 'ai'>('practice');
    const [selectedAiSession, setSelectedAiSession] = useState<AISession | null>(null);

    useEffect(() => {
        fetchSessions();
        loadAiSessions();
    }, []);

    const fetchSessions = async () => {
        if (!user) return;

        try {
            const response = await mentorService.getPracticeSessions(parseInt(user.id));
            setSessions(response.data.sessions || []);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load AI sessions from database API
    const loadAiSessions = async () => {
        try {
            const response = await api.get('/api/speaking-drills/sessions?role=mentor');
            if (response.data.success && response.data.sessions) {
                setAiSessions(response.data.sessions);
            }
        } catch (e) {
            console.error('Error loading AI sessions:', e);
            setAiSessions([]);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return `Hôm nay, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (days === 1) {
            return `Hôm qua, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (days < 7) {
            return `${days} ngày trước`;
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const feedbackTemplates = [
        { name: 'Pronunciation Focus', icon: 'record_voice_over', count: 12 },
        { name: 'Grammar Correction', icon: 'spellcheck', count: 18 },
        { name: 'Vocabulary Building', icon: 'menu_book', count: 8 },
        { name: 'Fluency Improvement', icon: 'speed', count: 6 },
        { name: 'Confidence Boost', icon: 'emoji_events', count: 10 },
    ];

    const pendingCount = sessions.filter(s => !s.overall_score).length;
    const completedCount = sessions.filter(s => s.overall_score).length;
    const avgScore = sessions.length > 0
        ? (sessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / sessions.filter(s => s.overall_score).length).toFixed(1)
        : '0';

    return (
        <MentorLayout
            title="Phản hồi & Đánh giá"
            icon="rate_review"
            subtitle="Nghe bản ghi âm của học viên và cho phản hồi"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Tổng phiên</p>
                            <span className="material-symbols-outlined text-primary text-xl">history</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">{sessions.length + aiSessions.length}</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Phiên AI</p>
                            <span className="material-symbols-outlined text-purple-400 text-xl">smart_toy</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">{aiSessions.length}</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Đã đánh giá</p>
                            <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">{completedCount}</p>
                    </div>
                    <div className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm font-medium">Điểm TB</p>
                            <span className="material-symbols-outlined text-primary text-xl">star</span>
                        </div>
                        <p className="text-white text-3xl font-bold leading-tight">{avgScore}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-[#3e4854]/30 pb-2">
                    <button
                        onClick={() => { setActiveTab('practice'); setSelectedAiSession(null); }}
                        className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === 'practice'
                            ? 'bg-[#283039] text-white border-b-2 border-primary'
                            : 'text-[#9dabb9] hover:text-white'
                            }`}
                    >
                        📚 Phiên luyện tập ({sessions.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('ai'); setSelectedAiSession(null); }}
                        className={`px-4 py-2 rounded-t-lg font-medium transition ${activeTab === 'ai'
                            ? 'bg-[#283039] text-white border-b-2 border-purple-500'
                            : 'text-[#9dabb9] hover:text-white'
                            }`}
                    >
                        🤖 Hội thoại AI ({aiSessions.length})
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {activeTab === 'practice' ? (
                        <>
                            <div className="lg:col-span-2 rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                                <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Phiên luyện tập của học viên</h3>
                                        <p className="text-sm text-[#9dabb9]">Nghe ghi âm và cho phản hồi</p>
                                    </div>
                                    <button onClick={fetchSessions} className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">refresh</span>
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="p-10 text-center">
                                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                                        <p className="text-[#9dabb9]">Đang tải...</p>
                                    </div>
                                ) : sessions.length === 0 ? (
                                    <div className="p-10 text-center">
                                        <span className="material-symbols-outlined text-4xl text-[#3e4854] mb-2">inbox</span>
                                        <p className="text-[#9dabb9]">Chưa có phiên luyện tập nào</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[#3e4854]/30 max-h-[500px] overflow-y-auto">
                                        {sessions.map((session) => (
                                            <div key={session.id} className="p-5 hover:bg-[#3e4854]/10 transition-colors">
                                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                            {session.learner_name.split(' ').pop()?.charAt(0) || 'L'}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-white">{session.learner_name}</h4>
                                                                {session.has_audio && (
                                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">🎙️ Có ghi âm</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-[#9dabb9]">{session.topic || 'Chủ đề tự do'}</p>
                                                            <p className="text-xs text-[#9dabb9]/70">{formatDate(session.ended_at)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex gap-3">
                                                            <div className="text-center">
                                                                <span className="text-primary font-bold">{session.pronunciation_score || '--'}</span>
                                                                <p className="text-[10px] text-[#9dabb9]">Phát âm</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="text-yellow-400 font-bold">{session.grammar_score || '--'}</span>
                                                                <p className="text-[10px] text-[#9dabb9]">Ngữ pháp</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <span className="text-green-400 font-bold">{session.overall_score || '--'}</span>
                                                                <p className="text-[10px] text-[#9dabb9]">Tổng</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {session.has_audio && (
                                                                <button
                                                                    onClick={() => setPlayingSessionId(playingSessionId === session.id ? null : session.id)}
                                                                    className={`p-2 rounded-lg transition-colors ${playingSessionId === session.id ? 'bg-primary text-white' : 'bg-[#3e4854]/30 text-[#9dabb9] hover:bg-[#3e4854]/50 hover:text-white'}`}
                                                                >
                                                                    <span className="material-symbols-outlined">{playingSessionId === session.id ? 'pause' : 'play_arrow'}</span>
                                                                </button>
                                                            )}
                                                            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">Viết phản hồi</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {playingSessionId === session.id && session.has_audio && (
                                                    <div className="mt-4 p-3 bg-[#1a222a] rounded-xl">
                                                        <audio controls className="w-full" src={mentorService.getSessionAudioUrl(session.id)} autoPlay>Your browser does not support the audio element.</audio>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                                    <h3 className="font-bold text-white mb-4">Mẫu phản hồi</h3>
                                    <div className="space-y-2">
                                        {feedbackTemplates.map((template, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#3e4854]/20 hover:bg-[#3e4854]/30 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-primary">{template.icon}</span>
                                                    <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">{template.name}</span>
                                                </div>
                                                <span className="text-xs text-[#9dabb9]">{template.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-xl bg-primary/10 border border-primary/20 p-5">
                                    <h3 className="font-bold text-white mb-3">💡 Mẹo phản hồi</h3>
                                    <ul className="space-y-2 text-sm text-[#9dabb9]">
                                        <li>• Nghe kỹ bản ghi âm trước khi viết</li>
                                        <li>• Bắt đầu bằng điểm tích cực</li>
                                        <li>• Chỉ rõ lỗi và cách sửa cụ thể</li>
                                        <li>• Kết thúc với lời động viên</li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="lg:col-span-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-white">Phiên hội thoại AI</h3>
                                    <button onClick={loadAiSessions} className="p-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] hover:text-white">
                                        <span className="material-symbols-outlined text-sm">refresh</span>
                                    </button>
                                </div>

                                {aiSessions.length === 0 ? (
                                    <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-8 text-center">
                                        <span className="text-4xl mb-3 block">🤖</span>
                                        <p className="text-[#9dabb9]">Chưa có phiên AI</p>
                                        <p className="text-xs text-[#9dabb9]/70 mt-1">Học viên cần luyện nói với AI trước</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                        {aiSessions.map((session) => (
                                            <div
                                                key={session.id}
                                                onClick={() => setSelectedAiSession(session)}
                                                className={`rounded-xl bg-[#283039] border p-4 cursor-pointer transition hover:border-purple-500/50 ${selectedAiSession?.id === session.id ? 'border-purple-500' : 'border-[#3e4854]/30'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.learner_name}`} className="size-10 rounded-full" alt="" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-white truncate">{session.learner_name}</p>
                                                        <p className="text-xs text-[#9dabb9] truncate">{session.topic}</p>
                                                    </div>
                                                    <span className={`font-bold ${getScoreColor(session.average_score)}`}>{Math.round(session.average_score)}%</span>
                                                </div>
                                                <p className="text-xs text-[#9dabb9]/70 mt-2">{formatDate(session.created_at)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-2">
                                {selectedAiSession ? (
                                    <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                                        <div className="p-5 border-b border-[#3e4854]/30 bg-purple-500/5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAiSession.learner_name}`} className="size-12 rounded-full" alt="" />
                                                    <div>
                                                        <h3 className="font-bold text-white">{selectedAiSession.learner_name}</h3>
                                                        <p className="text-sm text-[#9dabb9]">{selectedAiSession.topic} • Hội thoại AI</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-2xl font-bold ${getScoreColor(selectedAiSession.average_score)}`}>{Math.round(selectedAiSession.average_score)}%</p>
                                                    <p className="text-xs text-[#9dabb9]">Điểm TB</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
                                            <h4 className="font-bold text-white flex items-center gap-2"><span>💬</span> Nội dung hội thoại</h4>
                                            {selectedAiSession.messages.map((msg, idx) => (
                                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] rounded-xl p-3 ${msg.role === 'ai' ? 'bg-[#1a222a] border border-[#3e4854]/30' : 'bg-purple-500/20 border border-purple-500/30'}`}>
                                                        <p className="text-xs text-[#9dabb9] mb-1">{msg.role === 'ai' ? '🤖 AI' : '👤 Học viên'}</p>
                                                        <p className="text-white">{msg.text}</p>
                                                        {msg.role === 'user' && msg.score && (
                                                            <div className="mt-2 pt-2 border-t border-[#3e4854]/30">
                                                                <span className={`font-bold ${getScoreColor(msg.score)}`}>Điểm: {msg.score}%</span>
                                                                {msg.feedback && <p className="text-xs text-[#9dabb9] mt-1">💡 {msg.feedback}</p>}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-5 border-t border-[#3e4854]/30 bg-[#1a222a]/50">
                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <p className="text-2xl font-bold text-white">{selectedAiSession.messages.filter(m => m.role === 'user').length}</p>
                                                    <p className="text-xs text-[#9dabb9]">Lượt nói</p>
                                                </div>
                                                <div>
                                                    <p className={`text-2xl font-bold ${getScoreColor(selectedAiSession.average_score)}`}>{Math.round(selectedAiSession.average_score)}%</p>
                                                    <p className="text-xs text-[#9dabb9]">Điểm TB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-12 text-center">
                                        <span className="text-6xl mb-4 block">🎧</span>
                                        <h3 className="text-xl font-bold text-white mb-2">Chọn phiên để xem</h3>
                                        <p className="text-[#9dabb9]">Chọn phiên hội thoại AI từ danh sách bên trái</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MentorLayout>
    );
}

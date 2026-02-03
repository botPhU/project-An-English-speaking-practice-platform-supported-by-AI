import { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import api from '../../services/api';

interface SpeakingSession {
    id: string;
    learner_id: string;
    learner_name: string;
    learner_avatar?: string;
    topic: string;
    mode: 'repeat' | 'conversation';
    created_at: string;
    duration_seconds: number;
    average_score: number;
    messages: ConversationMessage[];
    audio_recordings?: AudioRecording[];
}

interface ConversationMessage {
    role: 'ai' | 'user';
    text: string;
    score?: number;
    feedback?: string;
    audio_url?: string;
    timestamp?: string;
}

interface AudioRecording {
    id: string;
    text: string;
    audio_url: string;
    score: number;
    created_at: string;
}

// Mock data for demonstration
const MOCK_SESSIONS: SpeakingSession[] = [
    {
        id: '1',
        learner_id: '101',
        learner_name: 'Nguyễn Văn A',
        topic: 'Giới thiệu bản thân',
        mode: 'conversation',
        created_at: '2026-02-03T10:30:00',
        duration_seconds: 320,
        average_score: 78,
        messages: [
            { role: 'ai', text: 'Hi there! Can you tell me a little bit about yourself?', timestamp: '10:30:00' },
            { role: 'user', text: 'My name is Nguyen Van A. I am from Hanoi.', score: 85, feedback: 'Tốt! Câu rõ ràng.', timestamp: '10:30:45', audio_url: '/audio/session1_1.webm' },
            { role: 'ai', text: 'Nice to meet you! Hanoi is a beautiful city. What do you do for a living?', timestamp: '10:31:00' },
            { role: 'user', text: 'I work as a software developer in a technology company.', score: 82, feedback: 'Rất tốt! Phát âm chuẩn.', timestamp: '10:31:30', audio_url: '/audio/session1_2.webm' },
            { role: 'ai', text: 'That sounds interesting! What kind of software do you develop?', timestamp: '10:31:45' },
            { role: 'user', text: 'I develop web applications using React and Python.', score: 75, feedback: 'Tốt, cần cải thiện phát âm "applications".', timestamp: '10:32:15', audio_url: '/audio/session1_3.webm' },
        ]
    },
    {
        id: '2',
        learner_id: '102',
        learner_name: 'Trần Thị B',
        topic: 'Sở thích',
        mode: 'conversation',
        created_at: '2026-02-03T14:15:00',
        duration_seconds: 245,
        average_score: 82,
        messages: [
            { role: 'ai', text: 'What do you like to do in your free time?', timestamp: '14:15:00' },
            { role: 'user', text: 'I like reading books and playing guitar.', score: 88, feedback: 'Xuất sắc!', timestamp: '14:15:30', audio_url: '/audio/session2_1.webm' },
            { role: 'ai', text: 'That\'s wonderful! What kind of books do you enjoy reading?', timestamp: '14:15:45' },
            { role: 'user', text: 'I enjoy reading science fiction and mystery novels.', score: 80, feedback: 'Tốt! "mystery" phát âm tốt.', timestamp: '14:16:15', audio_url: '/audio/session2_2.webm' },
        ]
    },
    {
        id: '3',
        learner_id: '101',
        learner_name: 'Nguyễn Văn A',
        topic: 'Travel Phrases',
        mode: 'repeat',
        created_at: '2026-02-02T16:00:00',
        duration_seconds: 180,
        average_score: 72,
        messages: [
            { role: 'ai', text: 'Repeat: "Excuse me, where is the nearest subway station?"' },
            { role: 'user', text: 'Excuse me, where is the nearest subway station?', score: 70, feedback: 'Cần cải thiện "subway".', audio_url: '/audio/session3_1.webm' },
            { role: 'ai', text: 'Repeat: "I would like to book a table for two, please."' },
            { role: 'user', text: 'I would like to book a table for two, please.', score: 75, feedback: 'Tốt!', audio_url: '/audio/session3_2.webm' },
        ]
    }
];

export default function SpeakingSessions() {
    const [sessions, setSessions] = useState<SpeakingSession[]>(MOCK_SESSIONS);
    const [selectedSession, setSelectedSession] = useState<SpeakingSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [filterLearner, setFilterLearner] = useState('');
    const [filterMode, setFilterMode] = useState<'all' | 'repeat' | 'conversation'>('all');
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);

    // Fetch sessions from API
    useEffect(() => {
        const fetchSessions = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/speaking-drills/sessions?role=mentor');
                if (response.data.success && response.data.sessions?.length > 0) {
                    setSessions(response.data.sessions);
                } else {
                    // No sessions yet - show empty state
                    setSessions([]);
                }
            } catch (error) {
                console.log('API error, showing empty state');
                setSessions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    // Filter sessions
    const filteredSessions = sessions.filter(s => {
        if (filterLearner && !s.learner_name.toLowerCase().includes(filterLearner.toLowerCase())) {
            return false;
        }
        if (filterMode !== 'all' && s.mode !== filterMode) {
            return false;
        }
        return true;
    });

    // Play audio recording
    const playAudio = (audioUrl: string) => {
        if (playingAudio === audioUrl) {
            setPlayingAudio(null);
            return;
        }

        // In real implementation, would use actual audio URL
        const utterance = new SpeechSynthesisUtterance("Audio playback simulation");
        utterance.lang = 'en-US';
        utterance.onend = () => setPlayingAudio(null);
        speechSynthesis.speak(utterance);
        setPlayingAudio(audioUrl);
    };

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get score color
    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <MentorLayout
            title="Lịch sử luyện nói"
            subtitle="Xem quá trình luyện tập speaking của học viên với AI"
            icon="record_voice_over"
        >
            <div className="space-y-6">
                {/* Filters */}
                <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="🔍 Tìm học viên..."
                                value={filterLearner}
                                onChange={(e) => setFilterLearner(e.target.value)}
                                className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white placeholder:text-text-secondary focus:border-purple-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'conversation', 'repeat'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setFilterMode(mode)}
                                    className={`px-4 py-2 rounded-xl font-medium transition ${filterMode === mode
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-background-dark text-text-secondary hover:bg-white/5'
                                        }`}
                                >
                                    {mode === 'all' ? 'Tất cả' : mode === 'conversation' ? '💬 Hội thoại' : '🔄 Lặp lại'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sessions List */}
                    <div className="lg:col-span-1 space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span className="text-xl">📋</span> Phiên luyện tập ({filteredSessions.length})
                        </h3>

                        {loading ? (
                            <div className="text-center py-8 text-text-secondary">
                                Loading...
                            </div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="text-center py-8 text-text-secondary">
                                Không có phiên nào
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                {filteredSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() => setSelectedSession(session)}
                                        className={`bg-surface-dark rounded-xl p-4 border cursor-pointer transition hover:border-purple-500/50 ${selectedSession?.id === session.id
                                            ? 'border-purple-500'
                                            : 'border-border-dark'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.learner_name}`}
                                                    alt=""
                                                    className="size-10 rounded-full"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white truncate">{session.learner_name}</p>
                                                <p className="text-sm text-text-secondary truncate">{session.topic}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs">
                                                    <span className={`font-bold ${getScoreColor(session.average_score)}`}>
                                                        {session.average_score}%
                                                    </span>
                                                    <span className="text-text-secondary">
                                                        ⏱️ {formatDuration(session.duration_seconds)}
                                                    </span>
                                                    <span className="text-text-secondary">
                                                        {session.mode === 'conversation' ? '💬' : '🔄'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-text-secondary mt-2">
                                            {new Date(session.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Session Detail */}
                    <div className="lg:col-span-2">
                        {selectedSession ? (
                            <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden">
                                {/* Session Header */}
                                <div className="p-6 border-b border-border-dark bg-purple-500/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full overflow-hidden">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSession.learner_name}`}
                                                    alt=""
                                                    className="size-full"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{selectedSession.learner_name}</h3>
                                                <p className="text-text-secondary">
                                                    {selectedSession.topic} • {selectedSession.mode === 'conversation' ? 'Hội thoại AI' : 'Lặp lại câu mẫu'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${getScoreColor(selectedSession.average_score)}`}>
                                                {selectedSession.average_score}%
                                            </p>
                                            <p className="text-text-secondary text-sm">Điểm trung bình</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Conversation Messages */}
                                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                                    <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                                        <span className="text-lg">💬</span> Nội dung hội thoại
                                    </h4>

                                    {selectedSession.messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                                                <div
                                                    className={`rounded-2xl p-4 ${msg.role === 'ai'
                                                        ? 'bg-background-dark border border-border-dark'
                                                        : 'bg-purple-500/20 border border-purple-500/30'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs text-text-secondary">
                                                            {msg.role === 'ai' ? '🤖 AI' : '👤 Học viên'}
                                                        </span>
                                                        {msg.timestamp && (
                                                            <span className="text-xs text-text-secondary">{msg.timestamp}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-white">{msg.text}</p>

                                                    {/* User message extras */}
                                                    {msg.role === 'user' && (
                                                        <div className="mt-3 pt-3 border-t border-border-dark/50">
                                                            <div className="flex items-center justify-between gap-4">
                                                                {msg.score !== undefined && (
                                                                    <span className={`font-bold ${getScoreColor(msg.score)}`}>
                                                                        Điểm: {msg.score}%
                                                                    </span>
                                                                )}
                                                                {msg.audio_url && (
                                                                    <button
                                                                        onClick={() => playAudio(msg.audio_url!)}
                                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${playingAudio === msg.audio_url
                                                                            ? 'bg-green-500 text-white'
                                                                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                                                                            }`}
                                                                    >
                                                                        {playingAudio === msg.audio_url ? '⏹️ Dừng' : '🎧 Nghe'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {msg.feedback && (
                                                                <p className="text-text-secondary text-sm mt-2">
                                                                    💡 {msg.feedback}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Session Stats */}
                                <div className="p-6 border-t border-border-dark bg-background-dark/50">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-white">
                                                {selectedSession.messages.filter(m => m.role === 'user').length}
                                            </p>
                                            <p className="text-text-secondary text-sm">Lượt nói</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">
                                                {formatDuration(selectedSession.duration_seconds)}
                                            </p>
                                            <p className="text-text-secondary text-sm">Thời lượng</p>
                                        </div>
                                        <div>
                                            <p className={`text-2xl font-bold ${getScoreColor(selectedSession.average_score)}`}>
                                                {selectedSession.average_score}%
                                            </p>
                                            <p className="text-text-secondary text-sm">Điểm TB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface-dark rounded-2xl border border-border-dark p-12 text-center">
                                <span className="text-6xl mb-4 block">🎧</span>
                                <h3 className="text-xl font-bold text-white mb-2">Chọn phiên luyện tập</h3>
                                <p className="text-text-secondary">
                                    Chọn một phiên từ danh sách bên trái để xem chi tiết hội thoại và nghe bản ghi âm của học viên
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

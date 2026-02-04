import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { practiceService } from '../../services/practiceService';
import type { ChatMessage, VocabularyResponse } from '../../services/practiceService';
import AIAvatar from '../../components/AIAvatar';
import VoiceWaveform from '../../components/VoiceWaveform';

// Predefined topics and scenarios
const TOPICS = [
    { id: 'daily', name: 'Đời sống hàng ngày', icon: '🏠', description: 'Giao tiếp thường ngày', color: 'from-green-500 to-emerald-600' },
    { id: 'business', name: 'Kinh doanh', icon: '💼', description: 'Tiếng Anh công sở', color: 'from-blue-500 to-indigo-600' },
    { id: 'travel', name: 'Du lịch', icon: '✈️', description: 'Đi du lịch nước ngoài', color: 'from-orange-500 to-red-500' },
    { id: 'interview', name: 'Phỏng vấn', icon: '🎯', description: 'Chuẩn bị phỏng vấn', color: 'from-purple-500 to-pink-600' },
    { id: 'academic', name: 'Học thuật', icon: '📚', description: 'Tiếng Anh học đường', color: 'from-cyan-500 to-blue-500' },
    { id: 'free', name: 'Tự do', icon: '💬', description: 'Nói chuyện tự do', color: 'from-pink-500 to-rose-500' },
];

type AIState = 'idle' | 'listening' | 'speaking' | 'thinking';

const AIPracticeImmersive: React.FC = () => {
    const { user } = useAuth();
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [vocabulary, setVocabulary] = useState<VocabularyResponse['vocabulary'] | null>(null);
    const [showVocabulary, setShowVocabulary] = useState(true);

    // Recording states
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [aiState, setAiState] = useState<AIState>('idle');
    const [sessionDuration, setSessionDuration] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recognitionRef = useRef<any>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Timer for session duration
    useEffect(() => {
        if (sessionId && !sessionCompleted) {
            timerRef.current = setInterval(() => {
                setSessionDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [sessionId, sessionCompleted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Update AI state based on loading
    useEffect(() => {
        if (isLoading) {
            setAiState('thinking');
        } else if (isRecording) {
            setAiState('listening');
        } else {
            setAiState('idle');
        }
    }, [isLoading, isRecording]);

    const startSession = async (topic: string) => {
        if (!user) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }

        setIsLoading(true);
        setAiState('thinking');
        try {
            // Fetch vocabulary first
            const vocabResponse = await practiceService.getVocabulary(topic);
            setVocabulary(vocabResponse.data.vocabulary);

            const response = await practiceService.startSession(
                parseInt(user.id),
                topic,
                TOPICS.find(t => t.id === topic)?.name
            );
            setSessionId(response.data.session_id);
            setSelectedTopic(topic);
            setSessionDuration(0);

            const topicName = TOPICS.find(t => t.id === topic)?.name || topic;
            setMessages([{
                role: 'assistant',
                content: `Xin chào! 🎤 Chào mừng bạn đến với buổi luyện tập **"${topicName}"**!\n\nHãy bắt đầu nói tiếng Anh. Tôi sẽ lắng nghe và đưa ra phản hồi giúp bạn cải thiện. Nhấn nút microphone để bắt đầu ghi âm.\n\n**Let's start! Tell me something about yourself!** 😊`,
                timestamp: new Date().toISOString()
            }]);
            setAiState('speaking');
            setTimeout(() => setAiState('idle'), 2000);
        } catch (error: any) {
            console.error('Failed to start session:', error);
            const errorMsg = error?.response?.data?.error || error?.message || 'Unknown error';
            alert(`Lỗi bắt đầu phiên: ${errorMsg}`);
            setMessages([{
                role: 'assistant',
                content: `Xin lỗi, không thể bắt đầu phiên luyện tập. Lỗi: ${errorMsg}\n\nVui lòng thử lại sau.`,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const startRecording = async () => {
        try {
            setTranscript('');
            audioChunksRef.current = [];

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 }
            });
            setAudioStream(stream);

            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
                setAudioStream(null);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(100);

            // Setup Speech Recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const text = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += text + ' ';
                        } else {
                            interimTranscript += text;
                        }
                    }

                    setTranscript(prev => {
                        const base = prev.replace(/\s*\[.*\]$/, '');
                        if (finalTranscript) return base + finalTranscript;
                        return base + (interimTranscript ? ` [${interimTranscript}]` : '');
                    });
                };

                recognitionRef.current = recognition;
                recognition.start();
            }

            setIsRecording(true);
            setAiState('listening');
        } catch (err) {
            console.error('Error starting recording:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setTranscript(prev => prev.replace(/\s*\[.*\]$/, '').trim());
        }
        setAiState('idle');
    };

    const sendMessage = async (message?: string) => {
        const msgToSend = message || inputMessage || transcript;
        if (!msgToSend.trim() || !sessionId || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: msgToSend,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setTranscript('');
        setAudioBlob(null);
        setIsLoading(true);
        setAiState('thinking');

        try {
            // Upload audio if available
            if (audioBlob && sessionId) {
                try {
                    await practiceService.uploadAudio(sessionId, audioBlob);
                } catch (e) {
                    console.log('Audio upload not supported yet');
                }
            }

            const response = await practiceService.chat(sessionId, msgToSend);
            setAiState('speaking');

            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.data.response,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, assistantMessage]);

            setTimeout(() => setAiState('idle'), 2000);
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const completeSession = async () => {
        if (!sessionId) return;

        setIsLoading(true);
        try {
            const response = await practiceService.completeSession(sessionId);
            setAnalysis(response.data);
            setSessionCompleted(true);
        } catch (error) {
            console.error('Failed to complete session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetSession = () => {
        setSessionId(null);
        setMessages([]);
        setSelectedTopic(null);
        setSessionCompleted(false);
        setAnalysis(null);
        setSessionDuration(0);
        setVocabulary(null);
    };

    // Topic Selection Screen
    if (!selectedTopic) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a222a] to-[#0f1419] p-6">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#283039]/50 text-[#9dabb9] hover:bg-[#283039] hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Quay lại</span>
                    </button>

                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium mb-6">
                            <span className="material-symbols-outlined text-lg">mic</span>
                            AI Speaking Practice
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
                            Luyện nói tiếng Anh với AI
                        </h1>
                        <p className="text-[#9dabb9] text-lg max-w-xl mx-auto">
                            Chọn chủ đề và bắt đầu cuộc hội thoại. AI sẽ lắng nghe và đưa ra phản hồi chi tiết giúp bạn cải thiện kỹ năng nói.
                        </p>
                    </div>

                    {/* Topic Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {TOPICS.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => startSession(topic.id)}
                                disabled={isLoading}
                                className="group relative overflow-hidden bg-[#1a222a] border border-[#3b4754]/50 rounded-2xl p-6 text-left hover:border-primary/50 transition-all duration-300 disabled:opacity-50"
                            >
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                <div className="relative z-10">
                                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{topic.icon}</div>
                                    <h3 className="text-white font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                                        {topic.name}
                                    </h3>
                                    <p className="text-[#9dabb9] text-sm">{topic.description}</p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-primary">arrow_forward</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Session Analysis Screen
    if (sessionCompleted && analysis) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a222a] to-[#0f1419] p-6 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    <div className="bg-[#1a222a]/80 backdrop-blur-xl border border-[#3b4754]/50 rounded-3xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mb-4">
                                <span className="text-4xl">🎉</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Kết quả luyện tập</h2>
                            <p className="text-[#9dabb9] mt-2">Thời gian: {formatTime(sessionDuration)}</p>
                        </div>

                        {/* Scores Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                { key: 'pronunciation_score', label: 'Phát âm', icon: '🎤', color: 'from-pink-500 to-rose-500' },
                                { key: 'grammar_score', label: 'Ngữ pháp', icon: '📝', color: 'from-blue-500 to-indigo-500' },
                                { key: 'vocabulary_score', label: 'Từ vựng', icon: '📚', color: 'from-green-500 to-emerald-500' },
                                { key: 'fluency_score', label: 'Trôi chảy', icon: '💬', color: 'from-purple-500 to-violet-500' },
                            ].map(item => (
                                <div key={item.key} className="bg-[#283039] rounded-2xl p-5 text-center relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`} />
                                    <p className="text-3xl mb-2">{item.icon}</p>
                                    <p className="text-[#9dabb9] text-sm mb-1">{item.label}</p>
                                    <p className="text-3xl font-bold text-white">
                                        {analysis[item.key] !== undefined && analysis[item.key] !== null ? analysis[item.key] : '--'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Overall Score */}
                        <div className="bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/20 rounded-2xl p-6 mb-8 text-center border border-primary/20">
                            <p className="text-[#9dabb9] text-sm mb-2">Điểm tổng</p>
                            <p className="text-5xl font-bold text-white">
                                {analysis.overall_score !== undefined && analysis.overall_score !== null ? analysis.overall_score : '--'}
                                <span className="text-xl text-[#9dabb9]">/100</span>
                            </p>
                        </div>

                        {/* AI Feedback */}
                        <div className="bg-[#283039] rounded-2xl p-5 mb-8">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span>🤖</span> Nhận xét từ AI
                            </h3>
                            <p className="text-[#9dabb9] text-sm whitespace-pre-wrap leading-relaxed">
                                {typeof analysis.analysis === 'string'
                                    ? analysis.analysis.substring(0, 600)
                                    : 'Hoàn thành tốt! Tiếp tục luyện tập để cải thiện kỹ năng.'}
                            </p>
                        </div>

                        <button
                            onClick={resetSession}
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20"
                        >
                            Luyện tập tiếp
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main Practice Interface
    const currentTopic = TOPICS.find(t => t.id === selectedTopic);

    return (
        <div className="h-screen bg-gradient-to-br from-[#0f1419] via-[#1a222a] to-[#0f1419] flex flex-col overflow-hidden">
            {/* Header */}
            <header className="shrink-0 bg-[#1a222a]/80 backdrop-blur-xl border-b border-[#3b4754]/50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={resetSession}
                            className="p-2 rounded-lg hover:bg-[#3b4754]/50 text-[#9dabb9] hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{currentTopic?.icon}</span>
                            <div>
                                <h1 className="text-white font-bold text-lg">{currentTopic?.name}</h1>
                                <p className="text-[#9dabb9] text-sm">Session #{sessionId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Timer */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#283039] rounded-full">
                            <span className="material-symbols-outlined text-primary text-lg">timer</span>
                            <span className="text-white font-mono font-bold">{formatTime(sessionDuration)}</span>
                        </div>

                        {/* Progress indicator */}
                        <div className="hidden md:flex items-center gap-2 text-sm text-[#9dabb9]">
                            <span>{messages.filter(m => m.role === 'user').length}</span>
                            <span>lượt nói</span>
                        </div>

                        <button
                            onClick={completeSession}
                            disabled={isLoading || messages.length < 3}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            Hoàn thành
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - AI Avatar & Scores */}
                <aside className="hidden lg:flex flex-col w-64 shrink-0 p-6 border-r border-[#3b4754]/30">
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <AIAvatar state={aiState} size="lg" />

                        {/* Quick Scores */}
                        <div className="mt-8 w-full space-y-3">
                            {[
                                { label: 'Phát âm', icon: '🎤', value: '--' },
                                { label: 'Ngữ pháp', icon: '📝', value: '--' },
                                { label: 'Từ vựng', icon: '📚', value: '--' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-[#283039]/50 rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <span>{item.icon}</span>
                                        <span className="text-[#9dabb9] text-sm">{item.label}</span>
                                    </div>
                                    <span className="text-white font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Center - Conversation */}
                <main className="flex-1 flex flex-col min-w-0">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-3xl mx-auto space-y-6">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-5 py-4 ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-primary to-primary/80 text-white rounded-br-md'
                                            : 'bg-[#283039]/80 backdrop-blur text-white rounded-bl-md border border-[#3b4754]/30'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                        <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/60' : 'text-[#9dabb9]/60'
                                            }`}>
                                            {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-[#283039] rounded-2xl rounded-bl-md px-5 py-4">
                                        <div className="flex gap-1.5">
                                            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Recording/Input Area */}
                    <div className="shrink-0 bg-[#1a222a]/80 backdrop-blur-xl border-t border-[#3b4754]/50 p-6">
                        <div className="max-w-3xl mx-auto">
                            {/* Live Transcript */}
                            {(isRecording || transcript) && (
                                <div className="mb-4 p-4 bg-[#283039]/50 rounded-xl border border-[#3b4754]/30">
                                    <p className="text-white text-sm">
                                        {transcript || <span className="text-[#9dabb9]">Đang nghe...</span>}
                                    </p>
                                </div>
                            )}

                            {/* Waveform */}
                            <div className="mb-4">
                                <VoiceWaveform isRecording={isRecording} audioStream={audioStream} />
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-4">
                                {/* Mic Button */}
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    disabled={isLoading}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${isRecording
                                        ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/30'
                                        : 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-primary/30'
                                        } disabled:opacity-50`}
                                >
                                    <span className="material-symbols-outlined text-white text-3xl">
                                        {isRecording ? 'stop' : 'mic'}
                                    </span>
                                </button>

                                {/* Send Button */}
                                {transcript && !isRecording && (
                                    <button
                                        onClick={() => sendMessage(transcript)}
                                        disabled={isLoading}
                                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                        Gửi
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-[#9dabb9] text-xs mt-4">
                                {isRecording ? 'Nhấn để dừng ghi âm' : 'Nhấn microphone để bắt đầu nói tiếng Anh'}
                            </p>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar - Vocabulary */}
                {showVocabulary && vocabulary && (
                    <aside className="hidden xl:block w-80 shrink-0 border-l border-[#3b4754]/30 overflow-y-auto">
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <span>📚</span> Từ vựng gợi ý
                                </h3>
                                <button
                                    onClick={() => setShowVocabulary(false)}
                                    className="text-[#9dabb9] hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>

                            {vocabulary.basic && vocabulary.basic.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-primary text-xs font-bold mb-2 flex items-center gap-1">
                                        <span>📗</span> CƠ BẢN (A1-A2)
                                    </p>
                                    {vocabulary.basic.map((item, i) => (
                                        <div key={i} className="bg-[#283039]/50 rounded-xl p-3 mb-2 hover:bg-[#283039] transition-colors">
                                            <p className="text-white font-medium">{item.word}</p>
                                            <p className="text-[#9dabb9] text-xs">{item.ipa} • {item.vietnamese}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {vocabulary.intermediate && vocabulary.intermediate.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-blue-400 text-xs font-bold mb-2 flex items-center gap-1">
                                        <span>📘</span> TRUNG CẤP (B1-B2)
                                    </p>
                                    {vocabulary.intermediate.map((item, i) => (
                                        <div key={i} className="bg-[#283039]/50 rounded-xl p-3 mb-2 hover:bg-[#283039] transition-colors">
                                            <p className="text-white font-medium">{item.word}</p>
                                            <p className="text-[#9dabb9] text-xs">{item.ipa} • {item.vietnamese}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {vocabulary.advanced && vocabulary.advanced.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-orange-400 text-xs font-bold mb-2 flex items-center gap-1">
                                        <span>📙</span> NÂNG CAO (C1-C2)
                                    </p>
                                    {vocabulary.advanced.map((item, i) => (
                                        <div key={i} className="bg-[#283039]/50 rounded-xl p-3 mb-2 hover:bg-[#283039] transition-colors">
                                            <p className="text-white font-medium">{item.word}</p>
                                            <p className="text-[#9dabb9] text-xs">{item.ipa} • {item.vietnamese}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {vocabulary.idioms && vocabulary.idioms.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-purple-400 text-xs font-bold mb-2 flex items-center gap-1">
                                        <span>🗣️</span> THÀNH NGỮ
                                    </p>
                                    {vocabulary.idioms.map((item, i) => (
                                        <div key={i} className="bg-[#283039]/50 rounded-xl p-3 mb-2 hover:bg-[#283039] transition-colors">
                                            <p className="text-white font-medium">{item.phrase}</p>
                                            <p className="text-[#9dabb9] text-xs">{item.meaning}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
};

// TypeScript declarations for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default AIPracticeImmersive;

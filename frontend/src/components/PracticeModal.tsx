import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { practiceService } from '../services/practiceService';
import type { ChatMessage } from '../services/practiceService';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

interface PracticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    topic: {
        id: number;
        title: string;
        description?: string;
        category?: string;
    } | null;
}

const PracticeModal: React.FC<PracticeModalProps> = ({ isOpen, onClose, topic }) => {
    const { user } = useAuth();
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [inputMode, setInputMode] = useState<'text' | 'voice'>('voice');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        isRecording,
        audioUrl,
        transcript,
        isTranscribing,
        startRecording,
        stopRecording,
        resetRecording,
        error: recorderError,
    } = useVoiceRecorder();

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Start session when modal opens
    useEffect(() => {
        if (isOpen && topic && !sessionId) {
            startSession();
        }
    }, [isOpen, topic]);

    // Update input message when transcript changes
    useEffect(() => {
        if (transcript) {
            setInputMessage(transcript);
        }
    }, [transcript]);

    const startSession = async () => {
        if (!user || !topic) return;

        setIsLoading(true);
        try {
            const response = await practiceService.startSession(
                parseInt(user.id),
                topic.title,
                topic.description
            );
            setSessionId(response.data.session_id);
            setMessages([{
                role: 'assistant',
                content: `Hello! I'll be your English practice partner today. We'll be practicing "${topic.title}". 

Feel free to speak or type in English. I'll help you improve your speaking skills and correct any mistakes.

Let's begin! Tell me a little about yourself or ask me something about ${topic.title}.`,
                timestamp: new Date().toISOString()
            }]);
        } catch (error) {
            console.error('Failed to start session:', error);
            setMessages([{
                role: 'assistant',
                content: 'Sorry, I could not start the practice session. Please try again later.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (message?: string) => {
        const msgToSend = message || inputMessage;
        if (!msgToSend.trim() || !sessionId || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: msgToSend,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        resetRecording();
        setIsLoading(true);

        try {
            const response = await practiceService.chat(sessionId, msgToSend);
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.data.response,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceToggle = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
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

    const handleClose = () => {
        setSessionId(null);
        setMessages([]);
        setSessionCompleted(false);
        setAnalysis(null);
        setInputMessage('');
        resetRecording();
        onClose();
    };

    if (!isOpen) return null;

    // Analysis Results Screen
    if (sessionCompleted && analysis) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#1a222a] border border-[#3b4754] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
                            <span className="text-3xl">🎉</span>
                            Kết quả luyện tập
                        </h2>

                        {/* Scores Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[
                                { key: 'pronunciation_score', label: 'Phát âm', icon: '🎤' },
                                { key: 'grammar_score', label: 'Ngữ pháp', icon: '📝' },
                                { key: 'vocabulary_score', label: 'Từ vựng', icon: '📚' },
                                { key: 'fluency_score', label: 'Trôi chảy', icon: '💬' },
                            ].map(item => (
                                <div key={item.key} className="bg-[#283039] rounded-xl p-4 text-center">
                                    <p className="text-2xl mb-1">{item.icon}</p>
                                    <p className="text-[#9dabb9] text-xs mb-1">{item.label}</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {analysis[item.key] || '--'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Overall Score */}
                        <div className="bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-xl p-4 mb-6 text-center">
                            <p className="text-[#9dabb9] text-sm mb-1">Điểm tổng</p>
                            <p className="text-4xl font-bold text-white">
                                {analysis.overall_score || '--'}
                                <span className="text-lg text-[#9dabb9]">/100</span>
                            </p>
                        </div>

                        {/* AI Feedback */}
                        <div className="bg-[#283039] rounded-xl p-4 mb-6">
                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <span>🤖</span> Nhận xét từ AI
                            </h3>
                            <p className="text-[#9dabb9] text-sm whitespace-pre-wrap leading-relaxed">
                                {typeof analysis.analysis === 'string'
                                    ? analysis.analysis.substring(0, 500)
                                    : 'Hoàn thành tốt! Tiếp tục luyện tập để cải thiện kỹ năng.'}
                            </p>
                        </div>

                        <button
                            onClick={handleClose}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-medium transition-colors"
                        >
                            Hoàn tất
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main Chat Interface
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a222a] border border-[#3b4754] rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-[#283039] px-4 py-3 border-b border-[#3b4754] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-xl">🤖</span>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm">{topic?.title}</h3>
                            <p className="text-[#9dabb9] text-xs">AI English Tutor</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={completeSession}
                            disabled={isLoading || messages.length < 4}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                            Hoàn thành
                        </button>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-[#9dabb9] transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-br-md'
                                    : 'bg-[#283039] text-white rounded-bl-md'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#283039] rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-[#9dabb9] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-[#9dabb9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-[#9dabb9] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Voice Recording Indicator */}
                {isRecording && (
                    <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <p className="text-red-400 text-sm font-medium">Đang ghi âm...</p>
                            {isTranscribing && transcript && (
                                <p className="text-[#9dabb9] text-sm truncate flex-1">{transcript}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {recorderError && (
                    <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/20">
                        <p className="text-yellow-400 text-sm">{recorderError}</p>
                    </div>
                )}

                {/* Audio Playback */}
                {audioUrl && !isRecording && (
                    <div className="px-4 py-2 bg-[#283039] border-t border-[#3b4754]">
                        <audio controls src={audioUrl} className="w-full h-8" />
                    </div>
                )}

                {/* Input Area */}
                <div className="bg-[#283039] border-t border-[#3b4754] p-4 shrink-0">
                    {/* Mode Toggle */}
                    <div className="flex justify-center gap-2 mb-3">
                        <button
                            onClick={() => setInputMode('voice')}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${inputMode === 'voice'
                                ? 'bg-primary text-white'
                                : 'bg-[#3b4754] text-[#9dabb9] hover:text-white'
                                }`}
                        >
                            🎤 Nói
                        </button>
                        <button
                            onClick={() => setInputMode('text')}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${inputMode === 'text'
                                ? 'bg-primary text-white'
                                : 'bg-[#3b4754] text-[#9dabb9] hover:text-white'
                                }`}
                        >
                            ⌨️ Gõ
                        </button>
                    </div>

                    {inputMode === 'voice' ? (
                        /* Voice Input Mode */
                        <div className="flex flex-col items-center gap-3">
                            <button
                                onClick={handleVoiceToggle}
                                disabled={isLoading}
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording
                                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                    : 'bg-primary hover:bg-primary/90'
                                    } disabled:opacity-50`}
                            >
                                <span className="material-symbols-outlined text-white text-3xl">
                                    {isRecording ? 'stop' : 'mic'}
                                </span>
                            </button>
                            <p className="text-[#9dabb9] text-xs">
                                {isRecording ? 'Nhấn để dừng' : 'Nhấn để nói'}
                            </p>
                            {transcript && !isRecording && (
                                <button
                                    onClick={() => sendMessage(transcript)}
                                    disabled={isLoading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    Gửi: "{transcript.substring(0, 30)}..."
                                </button>
                            )}
                        </div>
                    ) : (
                        /* Text Input Mode */
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                placeholder="Type in English..."
                                disabled={isLoading}
                                className="flex-1 bg-[#1a222a] border border-[#3b4754] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-[#9dabb9]/60 disabled:opacity-50 text-sm"
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-medium transition-colors"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticeModal;

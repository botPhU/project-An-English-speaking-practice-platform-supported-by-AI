import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { practiceService } from '../../services/practiceService';
import type { ChatMessage } from '../../services/practiceService';

// Predefined topics and scenarios
const TOPICS = [
    { id: 'daily', name: 'Đời sống hàng ngày', icon: '🏠', description: 'Giao tiếp thường ngày' },
    { id: 'business', name: 'Kinh doanh', icon: '💼', description: 'Tiếng Anh công sở' },
    { id: 'travel', name: 'Du lịch', icon: '✈️', description: 'Đi du lịch nước ngoài' },
    { id: 'interview', name: 'Phỏng vấn', icon: '🎯', description: 'Chuẩn bị phỏng vấn' },
    { id: 'academic', name: 'Học thuật', icon: '📚', description: 'Tiếng Anh học đường' },
    { id: 'free', name: 'Tự do', icon: '💬', description: 'Nói chuyện tự do' },
];

const AIPractice: React.FC = () => {
    const { user } = useAuth();
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startSession = async (topic: string) => {
        if (!user) return;

        setIsLoading(true);
        try {
            const response = await practiceService.startSession(
                parseInt(user.id),
                topic,
                TOPICS.find(t => t.id === topic)?.name
            );
            setSessionId(response.data.session_id);
            setSelectedTopic(topic);
            setMessages([{
                role: 'assistant',
                content: `Xin chào! Tôi là trợ lý luyện nói tiếng Anh của bạn. Hôm nay chúng ta sẽ luyện tập chủ đề "${TOPICS.find(t => t.id === topic)?.name}". 

Let's start! How are you doing today?`,
                timestamp: new Date().toISOString()
            }]);
        } catch (error) {
            console.error('Failed to start session:', error);
            setMessages([{
                role: 'assistant',
                content: 'Xin lỗi, không thể bắt đầu phiên luyện tập. Vui lòng thử lại sau.',
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || !sessionId || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await practiceService.chat(sessionId, inputMessage);
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
    };

    // Topic Selection Screen
    if (!selectedTopic) {
        return (
            <div className="min-h-screen bg-[#0f1419] p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white mb-3">
                            🎙️ Luyện nói với AI
                        </h1>
                        <p className="text-[#9dabb9]">
                            Chọn chủ đề để bắt đầu luyện tập tiếng Anh với trợ lý AI
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {TOPICS.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => startSession(topic.id)}
                                disabled={isLoading}
                                className="bg-[#1a222a] border border-[#3b4754] rounded-xl p-6 text-left hover:border-primary hover:bg-[#283039] transition-all group disabled:opacity-50"
                            >
                                <div className="text-4xl mb-3">{topic.icon}</div>
                                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                    {topic.name}
                                </h3>
                                <p className="text-[#9dabb9] text-sm">{topic.description}</p>
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
            <div className="min-h-screen bg-[#0f1419] p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-[#1a222a] border border-[#3b4754] rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            📊 Kết quả luyện tập
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {['pronunciation', 'grammar', 'vocabulary', 'fluency'].map(skill => (
                                <div key={skill} className="bg-[#283039] rounded-lg p-4 text-center">
                                    <p className="text-[#9dabb9] text-sm capitalize mb-1">
                                        {skill === 'pronunciation' ? 'Phát âm' :
                                            skill === 'grammar' ? 'Ngữ pháp' :
                                                skill === 'vocabulary' ? 'Từ vựng' : 'Trôi chảy'}
                                    </p>
                                    <p className="text-2xl font-bold text-primary">
                                        {analysis[`${skill}_score`] || '--'}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#283039] rounded-lg p-4 mb-6">
                            <h3 className="text-white font-semibold mb-2">📝 Nhận xét từ AI</h3>
                            <p className="text-[#9dabb9] text-sm whitespace-pre-wrap">
                                {typeof analysis.analysis === 'string'
                                    ? analysis.analysis
                                    : JSON.stringify(analysis.analysis, null, 2)}
                            </p>
                        </div>

                        <button
                            onClick={resetSession}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors"
                        >
                            Luyện tập tiếp
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Chat Interface
    return (
        <div className="min-h-screen bg-[#0f1419] flex flex-col">
            {/* Header */}
            <div className="bg-[#1a222a] border-b border-[#3b4754] p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">
                            {TOPICS.find(t => t.id === selectedTopic)?.icon}
                        </span>
                        <div>
                            <h2 className="text-white font-semibold">
                                {TOPICS.find(t => t.id === selectedTopic)?.name}
                            </h2>
                            <p className="text-[#9dabb9] text-sm">
                                Session #{sessionId}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={completeSession}
                            disabled={isLoading || messages.length < 3}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Hoàn thành
                        </button>
                        <button
                            onClick={resetSession}
                            className="bg-[#3b4754] hover:bg-[#4a5a6a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-br-md'
                                    : 'bg-[#283039] text-white rounded-bl-md'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-[#9dabb9]'
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
                            <div className="bg-[#283039] rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-[#9dabb9] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-[#9dabb9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-[#9dabb9] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-[#1a222a] border-t border-[#3b4754] p-4">
                <div className="max-w-3xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Nhập tin nhắn bằng tiếng Anh..."
                        disabled={isLoading}
                        className="flex-1 bg-[#283039] border border-[#3b4754] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-[#9dabb9]/60 disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
                <p className="text-center text-[#9dabb9] text-xs mt-2">
                    💡 Tip: Hãy viết đầy đủ câu bằng tiếng Anh để AI có thể sửa lỗi cho bạn
                </p>
            </div>
        </div>
    );
};

export default AIPractice;

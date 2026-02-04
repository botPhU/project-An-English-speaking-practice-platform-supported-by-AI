import { useState, useRef, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// Speech Recognition types
interface ISpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: ISpeechRecognitionEvent) => void) | null;
    onerror: ((event: { error: string }) => void) | null;
    onend: (() => void) | null;
}

interface ISpeechRecognitionEvent {
    resultIndex: number;
    results: {
        length: number;
        [index: number]: {
            isFinal: boolean;
            [index: number]: { transcript: string };
        };
    };
}

interface DrillSentence {
    id: number;
    text: string;
    translation: string;
    level: string;
    category: string;
    ipa?: string;
}

interface ConversationMessage {
    role: 'ai' | 'user';
    text: string;
    score?: number;
    feedback?: string;
}

interface ScoreResult {
    accuracy: number;
    pronunciation: number;
    fluency: number;
    overall: number;
    feedback: string;
    word_details: { word: string; correct: boolean; suggestion?: string }[];
}

interface VocabularyHint {
    word: string;
    meaning: string;
    pronunciation?: string;
}

// Sample sentences for practice
const DRILL_SENTENCES: DrillSentence[] = [
    // A1 - Daily
    { id: 1, text: "Hello, my name is John.", translation: "Xin chào, tên tôi là John.", level: "A1", category: "daily", ipa: "/həˈloʊ maɪ neɪm ɪz dʒɒn/" },
    { id: 2, text: "How are you today?", translation: "Hôm nay bạn khỏe không?", level: "A1", category: "daily", ipa: "/haʊ ɑːr juː təˈdeɪ/" },
    { id: 3, text: "Nice to meet you.", translation: "Rất vui được gặp bạn.", level: "A1", category: "daily", ipa: "/naɪs tuː miːt juː/" },
    { id: 4, text: "What is your name?", translation: "Tên bạn là gì?", level: "A1", category: "daily" },
    { id: 5, text: "I am from Vietnam.", translation: "Tôi đến từ Việt Nam.", level: "A1", category: "daily" },
    // A2 - Travel
    { id: 6, text: "Excuse me, where is the train station?", translation: "Xin lỗi, ga tàu ở đâu?", level: "A2", category: "travel" },
    { id: 7, text: "How much does this cost?", translation: "Cái này giá bao nhiêu?", level: "A2", category: "travel" },
    { id: 8, text: "I would like to book a room.", translation: "Tôi muốn đặt phòng.", level: "A2", category: "travel" },
    // B1 - Business
    { id: 9, text: "Could you please send me the report?", translation: "Bạn có thể gửi báo cáo cho tôi được không?", level: "B1", category: "business" },
    { id: 10, text: "I think we should schedule a meeting.", translation: "Tôi nghĩ chúng ta nên lên lịch họp.", level: "B1", category: "business" },
    // Tongue Twisters
    { id: 11, text: "She sells seashells by the seashore.", translation: "Cô ấy bán vỏ sò bên bờ biển.", level: "B1", category: "tongue_twister" },
    { id: 12, text: "Peter Piper picked a peck of pickled peppers.", translation: "Peter Piper hái một mớ ớt ngâm.", level: "B2", category: "tongue_twister" },
];

// Conversation starters for AI Q&A mode
const CONVERSATION_TOPICS = [
    { id: 1, title: "Giới thiệu bản thân", starter: "Hi there! Can you tell me a little bit about yourself?", level: "A1" },
    { id: 2, title: "Sở thích", starter: "What do you like to do in your free time?", level: "A1" },
    { id: 3, title: "Công việc", starter: "Can you tell me about your job or studies?", level: "A2" },
    { id: 4, title: "Du lịch", starter: "Have you traveled anywhere recently? Tell me about it.", level: "B1" },
    { id: 5, title: "Ẩm thực", starter: "What's your favorite food? Can you describe how it tastes?", level: "A2" },
    { id: 6, title: "Tương lai", starter: "What are your plans for the future?", level: "B1" },
];

export default function SpeakingDrills() {
    const { user } = useAuth();

    // Mode: 'repeat' | 'conversation'
    const [mode, setMode] = useState<'repeat' | 'conversation'>('repeat');

    // Repeat mode state
    const [selectedLevel, setSelectedLevel] = useState('A1');
    const [selectedCategory, setSelectedCategory] = useState('daily');
    const [currentSentence, setCurrentSentence] = useState<DrillSentence | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
    const [loading, setLoading] = useState(false);

    // Conversation mode state
    const [selectedTopic, setSelectedTopic] = useState<typeof CONVERSATION_TOPICS[0] | null>(null);
    const [conversation, setConversation] = useState<ConversationMessage[]>([]);
    const [isConversationActive, setIsConversationActive] = useState(false);
    const [sessionScore, setSessionScore] = useState<number[]>([]);
    const [vocabularyHints, setVocabularyHints] = useState<VocabularyHint[]>([]);
    const [sentenceTemplates, setSentenceTemplates] = useState<string[]>([]);

    // Speech recognition ref
    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const transcriptRef = useRef<string>('');

    // Filter sentences
    const filteredSentences = DRILL_SENTENCES.filter(
        s => s.level === selectedLevel && s.category === selectedCategory
    );

    useEffect(() => {
        if (filteredSentences.length > 0) {
            setCurrentSentence(filteredSentences[0]);
            setCurrentIndex(0);
        }
    }, [selectedLevel, selectedCategory]);

    // Text-to-Speech
    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    // Start recording
    const startRecording = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Trình duyệt không hỗ trợ Speech Recognition. Vui lòng dùng Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        transcriptRef.current = '';
        setTranscript('');
        setScoreResult(null);

        recognition.onresult = (event: ISpeechRecognitionEvent) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + ' ';
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            if (finalTranscript) {
                transcriptRef.current += finalTranscript;
            }
            setTranscript(transcriptRef.current + interimTranscript);
        };

        recognition.onerror = (event: { error: string }) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
    };

    // Stop recording and evaluate
    const stopRecording = async () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);

        const finalTranscript = transcriptRef.current.trim() || transcript.trim();
        if (!finalTranscript) {
            alert('Không nhận diện được giọng nói. Vui lòng thử lại.');
            return;
        }

        setTranscript(finalTranscript);

        if (mode === 'repeat') {
            await evaluateRepeat(finalTranscript);
        } else {
            await evaluateConversation(finalTranscript);
        }
    };

    // Evaluate repeat mode
    const evaluateRepeat = async (userText: string) => {
        if (!currentSentence) return;

        setLoading(true);
        try {
            const response = await api.post('/api/speaking-drills/evaluate', {
                user_id: user?.id,
                expected_text: currentSentence.text,
                user_text: userText,
                sentence_id: currentSentence.id
            });
            setScoreResult(response.data.result);
        } catch (error) {
            // Mock evaluation
            const expected = currentSentence.text.toLowerCase().split(/\s+/);
            const spoken = userText.toLowerCase().split(/\s+/);

            let matchCount = 0;
            const wordDetails = expected.map(word => {
                const cleanWord = word.replace(/[.,!?]/g, '');
                const found = spoken.some(s => s.replace(/[.,!?]/g, '').includes(cleanWord));
                if (found) matchCount++;
                return {
                    word,
                    correct: found,
                    suggestion: found ? undefined : `Phát âm "${word}" rõ hơn`
                };
            });

            const accuracy = Math.round((matchCount / expected.length) * 100);
            const pronunciation = Math.min(accuracy + 5, 100);
            const fluency = Math.min(accuracy + 10, 100);

            setScoreResult({
                accuracy,
                pronunciation,
                fluency,
                overall: Math.round((accuracy * 0.4 + pronunciation * 0.4 + fluency * 0.2)),
                feedback: accuracy >= 80
                    ? 'Tuyệt vời! Phát âm của bạn rất tốt.'
                    : accuracy >= 60
                        ? 'Khá tốt! Hãy luyện thêm các từ bị sai.'
                        : 'Cần cải thiện. Hãy nghe mẫu và thử lại.',
                word_details: wordDetails
            });
        } finally {
            setLoading(false);
        }
    };

    // Evaluate conversation and get next AI response
    const evaluateConversation = async (userText: string) => {
        setLoading(true);

        // Add user message
        setConversation(prev => [...prev, { role: 'user', text: userText }]);
        sessionScore.push(0);

        try {
            const response = await api.post('/api/speaking-drills/conversation/respond', {
                user_id: user?.id,
                user_text: userText,
                conversation_history: conversation,
                topic: selectedTopic?.title
            });

            const aiResponse = response.data.ai_response;
            const score = response.data.score;

            setConversation(prev => [...prev, {
                role: 'ai',
                text: aiResponse,
                feedback: response.data.feedback
            }]);

            // Update last user message with score
            setConversation(prev => {
                const updated = [...prev];
                const lastUserIdx = updated.length - 2;
                if (updated[lastUserIdx]?.role === 'user') {
                    updated[lastUserIdx].score = score;
                    updated[lastUserIdx].feedback = response.data.feedback;
                }
                return updated;
            });

            setSessionScore(prev => [...prev.slice(0, -1), score]);

            // Set vocabulary hints and sentence templates
            if (response.data.vocabulary_hints) {
                setVocabularyHints(response.data.vocabulary_hints);
            }
            if (response.data.sentence_templates) {
                setSentenceTemplates(response.data.sentence_templates);
            }

            // Auto-play AI response
            playAudio(aiResponse);

        } catch (error) {
            // Mock AI response
            const mockResponses = [
                "That's interesting! Can you tell me more about that?",
                "I see! And what do you think about it?",
                "Great! How does that make you feel?",
                "That sounds wonderful! What else would you like to share?",
                "Interesting perspective! Can you give me an example?"
            ];

            const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
            const mockScore = Math.floor(Math.random() * 30) + 60;

            setConversation(prev => {
                const updated = [...prev];
                const lastUserIdx = updated.length - 1;
                if (updated[lastUserIdx]?.role === 'user') {
                    updated[lastUserIdx].score = mockScore;
                    updated[lastUserIdx].feedback = mockScore >= 80 ? 'Tốt lắm!' : 'Hãy nói rõ hơn';
                }
                return [...updated, { role: 'ai', text: randomResponse }];
            });

            setSessionScore(prev => [...prev.slice(0, -1), mockScore]);

            // Mock vocabulary hints
            setVocabularyHints([
                { word: "think", meaning: "nghĩ", pronunciation: "/θɪŋk/" },
                { word: "believe", meaning: "tin", pronunciation: "/bɪˈliːv/" },
                { word: "opinion", meaning: "ý kiến", pronunciation: "/əˈpɪnjən/" }
            ]);
            setSentenceTemplates(["I think that...", "In my opinion...", "Well, I would say..."]);

            playAudio(randomResponse);
        } finally {
            setLoading(false);
        }
    };

    // Start conversation
    const startConversation = (topic: typeof CONVERSATION_TOPICS[0]) => {
        setSelectedTopic(topic);
        setConversation([{ role: 'ai', text: topic.starter }]);
        setIsConversationActive(true);
        setSessionScore([]);

        // Set initial vocabulary hints based on topic
        const topicVocabulary: { [key: string]: { vocabulary: VocabularyHint[], templates: string[] } } = {
            'Giới thiệu bản thân': {
                vocabulary: [
                    { word: "name", meaning: "tên", pronunciation: "/neɪm/" },
                    { word: "from", meaning: "đến từ", pronunciation: "/frɒm/" },
                    { word: "live", meaning: "sống", pronunciation: "/lɪv/" },
                    { word: "work", meaning: "làm việc", pronunciation: "/wɜːrk/" },
                    { word: "study", meaning: "học", pronunciation: "/ˈstʌdi/" }
                ],
                templates: [
                    "My name is...",
                    "I'm from...",
                    "I live in...",
                    "I work as a...",
                    "I'm a student at..."
                ]
            },
            'Sở thích': {
                vocabulary: [
                    { word: "hobby", meaning: "sở thích", pronunciation: "/ˈhɒbi/" },
                    { word: "enjoy", meaning: "thích", pronunciation: "/ɪnˈdʒɔɪ/" },
                    { word: "free time", meaning: "thời gian rảnh", pronunciation: "/friː taɪm/" },
                    { word: "play", meaning: "chơi", pronunciation: "/pleɪ/" },
                    { word: "watch", meaning: "xem", pronunciation: "/wɒtʃ/" }
                ],
                templates: [
                    "I like to...",
                    "In my free time, I...",
                    "My hobby is...",
                    "I enjoy...",
                    "I'm interested in..."
                ]
            },
            'Công việc': {
                vocabulary: [
                    { word: "job", meaning: "công việc", pronunciation: "/dʒɒb/" },
                    { word: "company", meaning: "công ty", pronunciation: "/ˈkʌmpəni/" },
                    { word: "experience", meaning: "kinh nghiệm", pronunciation: "/ɪkˈspɪəriəns/" },
                    { word: "responsibility", meaning: "trách nhiệm", pronunciation: "/rɪˌspɒnsəˈbɪləti/" }
                ],
                templates: [
                    "I work at...",
                    "My job is...",
                    "I'm responsible for...",
                    "I've been working for..."
                ]
            },
            'Du lịch': {
                vocabulary: [
                    { word: "travel", meaning: "du lịch", pronunciation: "/ˈtrævl/" },
                    { word: "visit", meaning: "thăm", pronunciation: "/ˈvɪzɪt/" },
                    { word: "beautiful", meaning: "đẹp", pronunciation: "/ˈbjuːtɪfl/" },
                    { word: "experience", meaning: "trải nghiệm", pronunciation: "/ɪkˈspɪəriəns/" }
                ],
                templates: [
                    "I went to...",
                    "I visited...",
                    "It was...",
                    "I really enjoyed..."
                ]
            },
            'Ẩm thực': {
                vocabulary: [
                    { word: "food", meaning: "đồ ăn", pronunciation: "/fuːd/" },
                    { word: "delicious", meaning: "ngon", pronunciation: "/dɪˈlɪʃəs/" },
                    { word: "taste", meaning: "vị", pronunciation: "/teɪst/" },
                    { word: "favorite", meaning: "yêu thích", pronunciation: "/ˈfeɪvərɪt/" },
                    { word: "cook", meaning: "nấu ăn", pronunciation: "/kʊk/" }
                ],
                templates: [
                    "My favorite food is...",
                    "I like to eat...",
                    "It tastes...",
                    "I usually cook..."
                ]
            },
            'Tương lai': {
                vocabulary: [
                    { word: "plan", meaning: "kế hoạch", pronunciation: "/plæn/" },
                    { word: "goal", meaning: "mục tiêu", pronunciation: "/ɡoʊl/" },
                    { word: "hope", meaning: "hy vọng", pronunciation: "/hoʊp/" },
                    { word: "future", meaning: "tương lai", pronunciation: "/ˈfjuːtʃər/" },
                    { word: "dream", meaning: "ước mơ", pronunciation: "/driːm/" }
                ],
                templates: [
                    "I plan to...",
                    "In the future, I want to...",
                    "My goal is to...",
                    "I hope to..."
                ]
            }
        };

        const topicData = topicVocabulary[topic.title] || {
            vocabulary: [
                { word: "think", meaning: "nghĩ", pronunciation: "/θɪŋk/" },
                { word: "believe", meaning: "tin", pronunciation: "/bɪˈliːv/" },
                { word: "because", meaning: "bởi vì", pronunciation: "/bɪˈkɒz/" }
            ],
            templates: ["I think...", "In my opinion...", "I believe..."]
        };

        setVocabularyHints(topicData.vocabulary);
        setSentenceTemplates(topicData.templates);

        playAudio(topic.starter);
    };

    // End conversation
    const endConversation = () => {
        setIsConversationActive(false);
        const avgScore = sessionScore.length > 0
            ? Math.round(sessionScore.reduce((a, b) => a + b, 0) / sessionScore.length)
            : 0;

        alert(`🎉 Hoàn thành!\n\nĐiểm trung bình: ${avgScore}%\nSố lượt nói: ${sessionScore.length}`);
    };

    // Next sentence
    const nextSentence = () => {
        if (currentIndex < filteredSentences.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentSentence(filteredSentences[currentIndex + 1]);
            setTranscript('');
            setScoreResult(null);
        }
    };

    // Previous sentence
    const prevSentence = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentSentence(filteredSentences[currentIndex - 1]);
            setTranscript('');
            setScoreResult(null);
        }
    };

    return (
        <LearnerLayout title="Luyện Speaking với AI">
            <div className="max-w-4xl mx-auto">
                {/* Mode Switcher */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setMode('repeat')}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition ${mode === 'repeat'
                            ? 'bg-primary text-white'
                            : 'bg-surface-dark text-text-secondary hover:bg-surface-dark/80'
                            }`}
                    >
                        🔄 Lặp lại câu mẫu
                    </button>
                    <button
                        onClick={() => setMode('conversation')}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold transition ${mode === 'conversation'
                            ? 'bg-primary text-white'
                            : 'bg-surface-dark text-text-secondary hover:bg-surface-dark/80'
                            }`}
                    >
                        💬 Hội thoại với AI
                    </button>
                </div>

                {/* =================== REPEAT MODE =================== */}
                {mode === 'repeat' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex gap-4 flex-wrap">
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="px-4 py-2 bg-surface-dark border border-border-dark rounded-lg text-white"
                            >
                                <option value="A1">A1 - Beginner</option>
                                <option value="A2">A2 - Elementary</option>
                                <option value="B1">B1 - Intermediate</option>
                                <option value="B2">B2 - Upper Intermediate</option>
                            </select>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 bg-surface-dark border border-border-dark rounded-lg text-white"
                            >
                                <option value="daily">🏠 Daily Conversation</option>
                                <option value="travel">✈️ Travel</option>
                                <option value="business">💼 Business</option>
                                <option value="tongue_twister">😝 Tongue Twisters</option>
                            </select>
                        </div>

                        {currentSentence ? (
                            <>
                                {/* Sentence Card */}
                                <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-text-secondary text-sm">
                                            Câu {currentIndex + 1} / {filteredSentences.length}
                                        </span>
                                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                                            {currentSentence.level}
                                        </span>
                                    </div>

                                    <div className="text-center py-6">
                                        <p className="text-2xl font-bold text-white mb-2">
                                            "{currentSentence.text}"
                                        </p>
                                        {currentSentence.ipa && (
                                            <p className="text-primary text-sm mb-2">{currentSentence.ipa}</p>
                                        )}
                                        <p className="text-text-secondary">{currentSentence.translation}</p>
                                    </div>

                                    <button
                                        onClick={() => playAudio(currentSentence.text)}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
                                    >
                                        🔊 Nghe mẫu
                                    </button>
                                </div>

                                {/* Recording Section */}
                                <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
                                    <h3 className="font-bold text-white mb-4">🎤 Bạn nói:</h3>

                                    {transcript && (
                                        <div className="bg-background-dark rounded-xl p-4 mb-4">
                                            <p className="text-white text-lg">"{transcript}"</p>
                                        </div>
                                    )}

                                    <div className="flex justify-center gap-4">
                                        {!isRecording ? (
                                            <button
                                                onClick={startRecording}
                                                disabled={loading}
                                                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50"
                                            >
                                                <span className="text-3xl">🎤</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={stopRecording}
                                                className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center animate-pulse"
                                            >
                                                <span className="text-3xl">⏹️</span>
                                            </button>
                                        )}
                                    </div>

                                    {isRecording && (
                                        <p className="text-center text-red-500 mt-3 animate-pulse">🔴 Đang ghi âm...</p>
                                    )}
                                </div>

                                {/* Score Result */}
                                {loading && (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                                        <p className="text-text-secondary mt-2">AI đang chấm điểm...</p>
                                    </div>
                                )}

                                {scoreResult && (
                                    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
                                        <h3 className="font-bold text-white mb-4">📊 Kết quả:</h3>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-400">{scoreResult.accuracy}%</div>
                                                <div className="text-text-secondary text-sm">Accuracy</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-400">{scoreResult.pronunciation}%</div>
                                                <div className="text-text-secondary text-sm">Pronunciation</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-400">{scoreResult.fluency}%</div>
                                                <div className="text-text-secondary text-sm">Fluency</div>
                                            </div>
                                        </div>

                                        <div className="bg-primary/20 rounded-xl p-4 text-center mb-4">
                                            <div className="text-3xl font-bold text-primary">{scoreResult.overall}%</div>
                                            <div className="text-text-secondary">Overall Score</div>
                                        </div>

                                        {/* Word details */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {scoreResult.word_details.map((wd, i) => (
                                                <span
                                                    key={i}
                                                    className={`px-3 py-1 rounded-full text-sm ${wd.correct
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                        }`}
                                                >
                                                    {wd.correct ? '✓' : '✗'} {wd.word}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="bg-yellow-500/10 rounded-xl p-4">
                                            <p className="text-yellow-400 font-medium">💡 {scoreResult.feedback}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={prevSentence}
                                        disabled={currentIndex === 0}
                                        className="flex-1 py-3 border border-border-dark rounded-xl text-white disabled:opacity-50"
                                    >
                                        ← Câu trước
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTranscript('');
                                            setScoreResult(null);
                                        }}
                                        className="flex-1 py-3 bg-surface-dark border border-border-dark rounded-xl text-white"
                                    >
                                        🔄 Thử lại
                                    </button>
                                    <button
                                        onClick={nextSentence}
                                        disabled={currentIndex >= filteredSentences.length - 1}
                                        className="flex-1 py-3 bg-primary hover:bg-primary-dark rounded-xl text-white font-bold disabled:opacity-50"
                                    >
                                        Câu tiếp →
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12 bg-surface-dark rounded-2xl">
                                <span className="text-5xl">📭</span>
                                <p className="text-text-secondary mt-4">Không có câu mẫu cho lựa chọn này</p>
                            </div>
                        )}
                    </div>
                )}

                {/* =================== CONVERSATION MODE =================== */}
                {mode === 'conversation' && (
                    <div className="space-y-6">
                        {!isConversationActive ? (
                            <>
                                <h2 className="text-xl font-bold text-white">🎯 Chọn chủ đề hội thoại:</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {CONVERSATION_TOPICS.map(topic => (
                                        <button
                                            key={topic.id}
                                            onClick={() => startConversation(topic)}
                                            className="bg-surface-dark hover:bg-surface-dark/80 border border-border-dark rounded-2xl p-6 text-left transition hover:border-primary"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                                                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">{topic.level}</span>
                                            </div>
                                            <p className="text-text-secondary text-sm italic">"{topic.starter}"</p>
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Conversation Header */}
                                <div className="flex justify-between items-center bg-surface-dark rounded-xl p-4">
                                    <div>
                                        <h3 className="font-bold text-white">{selectedTopic?.title}</h3>
                                        <p className="text-text-secondary text-sm">Nói tiếng Anh và AI sẽ phản hồi</p>
                                    </div>
                                    <button
                                        onClick={endConversation}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold"
                                    >
                                        ✅ Hoàn thành
                                    </button>
                                </div>

                                {/* Conversation Messages */}
                                <div className="bg-surface-dark rounded-2xl p-4 max-h-[400px] overflow-y-auto space-y-4">
                                    {conversation.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'ai'
                                                ? 'bg-blue-600/20 text-white'
                                                : 'bg-primary/20 text-white'
                                                }`}>
                                                <p className="text-sm opacity-60 mb-1">
                                                    {msg.role === 'ai' ? '🤖 AI' : '👤 Bạn'}
                                                </p>
                                                <p className="text-lg">{msg.text}</p>
                                                {msg.role === 'user' && msg.score !== undefined && (
                                                    <div className="mt-2 pt-2 border-t border-white/20">
                                                        <span className={`text-sm ${msg.score >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                            📊 {msg.score}% - {msg.feedback}
                                                        </span>
                                                    </div>
                                                )}
                                                {msg.role === 'ai' && (
                                                    <button
                                                        onClick={() => playAudio(msg.text)}
                                                        className="mt-2 text-sm text-blue-400 hover:underline"
                                                    >
                                                        🔊 Nghe lại
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-blue-600/20 rounded-2xl p-4">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Recording Section */}
                                <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
                                    {transcript && (
                                        <div className="bg-background-dark rounded-xl p-4 mb-4">
                                            <p className="text-white text-lg">"{transcript}"</p>
                                        </div>
                                    )}

                                    <div className="flex justify-center">
                                        {!isRecording ? (
                                            <button
                                                onClick={startRecording}
                                                disabled={loading}
                                                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50"
                                            >
                                                <span className="text-3xl">🎤</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={stopRecording}
                                                className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center animate-pulse"
                                            >
                                                <span className="text-3xl">⏹️</span>
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-center text-text-secondary mt-3">
                                        {isRecording ? '🔴 Đang ghi âm...' : 'Nhấn để trả lời'}
                                    </p>
                                </div>

                                {/* Session Stats */}
                                {sessionScore.length > 0 && (
                                    <div className="bg-surface-dark rounded-xl p-4 flex justify-between items-center">
                                        <span className="text-text-secondary">
                                            Số lượt nói: {sessionScore.length}
                                        </span>
                                        <span className="text-primary font-bold">
                                            Điểm TB: {Math.round(sessionScore.reduce((a, b) => a + b, 0) / sessionScore.length)}%
                                        </span>
                                    </div>
                                )}

                                {/* Vocabulary Hints */}
                                {vocabularyHints.length > 0 && (
                                    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="text-xl">📚</span> Từ vựng gợi ý
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {vocabularyHints.map((hint, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-background-dark rounded-xl p-3 hover:bg-primary/10 transition cursor-pointer"
                                                    onClick={() => playAudio(hint.word)}
                                                >
                                                    <p className="text-white font-bold">{hint.word}</p>
                                                    {hint.pronunciation && (
                                                        <p className="text-primary text-xs">{hint.pronunciation}</p>
                                                    )}
                                                    <p className="text-text-secondary text-sm">{hint.meaning}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sentence Templates */}
                                {sentenceTemplates.length > 0 && (
                                    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="text-xl">💬</span> Mẫu câu gợi ý
                                        </h3>
                                        <div className="space-y-2">
                                            {sentenceTemplates.map((template, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-background-dark rounded-xl p-3 flex items-center justify-between hover:bg-primary/10 transition cursor-pointer group"
                                                    onClick={() => playAudio(template)}
                                                >
                                                    <p className="text-white">{template}</p>
                                                    <span className="text-primary opacity-0 group-hover:opacity-100 transition">🔊</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-text-secondary text-xs mt-3">
                                            💡 Nhấn vào mẫu câu để nghe cách phát âm
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </LearnerLayout>
    );
}

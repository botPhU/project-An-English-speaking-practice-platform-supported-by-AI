import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Web Speech API type definitions
interface ISpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: ISpeechRecognitionEvent) => void) | null;
    onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
}

interface ISpeechRecognitionEvent {
    resultIndex: number;
    results: {
        length: number;
        [index: number]: {
            isFinal: boolean;
            [index: number]: {
                transcript: string;
                confidence: number;
            };
        };
    };
}

interface ISpeechRecognitionErrorEvent {
    error: string;
    message: string;
}

interface Question {
    id: number;
    question_text: string;
    question_type: string;
    category: string;
    difficulty_level: string;
    points: number;
    options: {
        a: string;
        b: string;
        c: string;
        d: string;
    };
}

interface SpeakingPrompt {
    id: number;
    level: string;
    prompt: string;
    prompt_vi: string;
    duration_seconds: number;
}

interface SpeakingResult {
    pronunciation_score: number;
    vocabulary_score: number;
    grammar_score: number;
    fluency_score: number;
    coherence_score: number;
    overall_score: number;
    estimated_level: string;
    feedback: string;
    strengths: string[];
    improvements: string[];
}

interface FinalResult {
    written_score: number;
    speaking_score: number;
    final_score: number;
    final_level: string;
    speaking_subscores: Record<string, number>;
    level_description: {
        name: string;
        name_vi: string;
        description: string;
    };
    feedback: {
        overall: string;
        strength: string;
        improvement: string;
        next_steps: string[];
    };
}

export default function PlacementTest() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Test stages: intro -> written -> speaking -> result
    const [stage, setStage] = useState<'intro' | 'written' | 'speaking' | 'result'>('intro');

    // Written test state
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [writtenScore, setWrittenScore] = useState(0);

    // Speaking test state
    const [speakingPrompts, setSpeakingPrompts] = useState<SpeakingPrompt[]>([]);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [speakingResults, setSpeakingResults] = useState<SpeakingResult[]>([]);
    const [transcription, setTranscription] = useState('');

    // Final result
    const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(20 * 60);
    const [startTime, setStartTime] = useState<number>(0);

    // Audio recording refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Timer for written test
    useEffect(() => {
        if (stage !== 'written') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitWritten();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [stage]);

    // Recording timer
    useEffect(() => {
        if (!isRecording) return;

        const timer = setInterval(() => {
            setRecordingTime((prev) => {
                const maxTime = speakingPrompts[currentPromptIndex]?.duration_seconds || 120;
                if (prev >= maxTime) {
                    stopRecording();
                    return maxTime;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRecording, currentPromptIndex, speakingPrompts]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/placement-test/questions?user_id=${user?.id}`);
            if (response.data.can_take_test) {
                setQuestions(response.data.questions);
                setStage('written');
                setStartTime(Date.now());
            }
        } catch (error) {
            // Mock questions
            setQuestions([
                { id: 1, question_text: 'She _____ a student.', question_type: 'multiple_choice', category: 'grammar', difficulty_level: 'A1', points: 1, options: { a: 'is', b: 'are', c: 'am', d: 'be' } },
                { id: 2, question_text: 'I _____ to school every day.', question_type: 'multiple_choice', category: 'grammar', difficulty_level: 'A1', points: 1, options: { a: 'goes', b: 'go', c: 'going', d: 'went' } },
                { id: 3, question_text: 'What is the opposite of "hot"?', question_type: 'multiple_choice', category: 'vocabulary', difficulty_level: 'A1', points: 1, options: { a: 'warm', b: 'cool', c: 'cold', d: 'heat' } },
                { id: 4, question_text: 'If I _____ rich, I would travel.', question_type: 'multiple_choice', category: 'grammar', difficulty_level: 'B1', points: 3, options: { a: 'am', b: 'was', c: 'were', d: 'be' } },
                { id: 5, question_text: 'She has _____ finished.', question_type: 'multiple_choice', category: 'grammar', difficulty_level: 'A2', points: 2, options: { a: 'yet', b: 'already', c: 'still', d: 'ago' } },
            ]);
            setStage('written');
            setStartTime(Date.now());
        } finally {
            setLoading(false);
        }
    };

    const fetchSpeakingPrompts = async () => {
        try {
            const response = await api.get('/api/placement-test/speaking/prompts');
            setSpeakingPrompts(response.data.prompts);
        } catch (error) {
            // Mock prompts
            setSpeakingPrompts([
                { id: 1, level: 'A1-A2', prompt: 'Please introduce yourself.', prompt_vi: 'Hãy giới thiệu về bản thân bạn.', duration_seconds: 60 },
                { id: 2, level: 'A2-B1', prompt: 'Describe your daily routine.', prompt_vi: 'Mô tả thói quen hàng ngày của bạn.', duration_seconds: 90 },
                { id: 3, level: 'B1-B2', prompt: 'Tell me about a memorable trip.', prompt_vi: 'Kể về một chuyến đi đáng nhớ.', duration_seconds: 120 },
            ]);
        }
    };

    const handleAnswer = (answer: string) => {
        setAnswers(prev => ({ ...prev, [questions[currentIndex].id.toString()]: answer }));
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleSubmitWritten = async () => {
        setLoading(true);
        try {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            const response = await api.post('/api/placement-test/submit', {
                user_id: user?.id,
                answers,
                time_taken_seconds: timeTaken
            });
            setWrittenScore(response.data.result.percentage);
        } catch (error) {
            // Mock score
            setWrittenScore(Math.floor(Math.random() * 40) + 50);
        } finally {
            setLoading(false);
            // Move to speaking test
            await fetchSpeakingPrompts();
            setStage('speaking');
        }
    };

    // ============ Speaking Recording with Speech Recognition ============

    // Speech recognition ref
    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const transcriptRef = useRef<string>('');

    const startRecording = async () => {
        try {
            // Start audio recording
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await processRecording(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            // Start Speech Recognition (Web Speech API)
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                transcriptRef.current = '';

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

                    // Show interim results while speaking
                    setTranscription(transcriptRef.current + interimTranscript);
                };

                recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
                    console.error('Speech recognition error:', event.error);
                };

                recognitionRef.current = recognition;
                recognition.start();
            }

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
        } catch (error) {
            console.error('Failed to start recording:', error);
            alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop speech recognition
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }
    };

    const processRecording = async (_audioBlob: Blob) => {
        setLoading(true);

        // Get the transcription from speech recognition
        const finalTranscription = transcriptRef.current.trim() || transcription.trim();

        if (!finalTranscription) {
            setTranscription('Không nhận diện được giọng nói. Vui lòng thử lại.');
            setLoading(false);
            return;
        }

        setTranscription(finalTranscription);

        try {
            const response = await api.post('/api/placement-test/speaking/evaluate', {
                user_id: user?.id,
                prompt_id: speakingPrompts[currentPromptIndex].id,
                transcription: finalTranscription,
                audio_duration: recordingTime
            });

            setSpeakingResults(prev => [...prev, response.data.evaluation]);
        } catch (error) {
            // Fallback evaluation if API fails
            const mockResult: SpeakingResult = {
                pronunciation_score: Math.floor(Math.random() * 30) + 60,
                vocabulary_score: Math.floor(Math.random() * 30) + 55,
                grammar_score: Math.floor(Math.random() * 30) + 60,
                fluency_score: Math.floor(Math.random() * 30) + 55,
                coherence_score: Math.floor(Math.random() * 30) + 60,
                overall_score: Math.floor(Math.random() * 25) + 60,
                estimated_level: 'B1',
                feedback: 'Không thể kết nối server. Kết quả tạm thời.',
                strengths: ['Đã hoàn thành câu trả lời'],
                improvements: ['Hãy thử lại khi mạng ổn định hơn']
            };
            setSpeakingResults(prev => [...prev, mockResult]);
        } finally {
            setLoading(false);
        }
    };

    const handleNextPrompt = () => {
        if (currentPromptIndex < speakingPrompts.length - 1) {
            setCurrentPromptIndex(prev => prev + 1);
            setTranscription('');
            setRecordingTime(0);
        } else {
            // Submit final assessment
            submitFinalAssessment();
        }
    };

    const submitFinalAssessment = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/placement-test/speaking/submit-all', {
                user_id: user?.id,
                speaking_results: speakingResults,
                written_percentage: writtenScore
            });
            setFinalResult(response.data.result);
        } catch (error) {
            // Mock final result
            const avgSpeaking = speakingResults.reduce((sum, r) => sum + r.overall_score, 0) / speakingResults.length;
            const finalScore = writtenScore * 0.4 + avgSpeaking * 0.6;

            setFinalResult({
                written_score: writtenScore,
                speaking_score: avgSpeaking,
                final_score: Math.round(finalScore),
                final_level: finalScore >= 75 ? 'B2' : finalScore >= 60 ? 'B1' : 'A2',
                speaking_subscores: {
                    pronunciation: speakingResults.reduce((sum, r) => sum + r.pronunciation_score, 0) / speakingResults.length,
                    vocabulary: speakingResults.reduce((sum, r) => sum + r.vocabulary_score, 0) / speakingResults.length,
                    grammar: speakingResults.reduce((sum, r) => sum + r.grammar_score, 0) / speakingResults.length,
                    fluency: speakingResults.reduce((sum, r) => sum + r.fluency_score, 0) / speakingResults.length,
                    coherence: speakingResults.reduce((sum, r) => sum + r.coherence_score, 0) / speakingResults.length,
                },
                level_description: { name: 'Intermediate', name_vi: 'Trung cấp', description: 'Có thể xử lý hầu hết các tình huống' },
                feedback: {
                    overall: 'Trình độ của bạn được đánh giá là B1.',
                    strength: 'Phát âm rõ ràng',
                    improvement: 'Cần mở rộng từ vựng',
                    next_steps: ['Luyện nói hàng ngày', 'Tham gia lớp với mentor']
                }
            });
        } finally {
            setLoading(false);
            setStage('result');
        }
    };

    const currentQuestion = questions[currentIndex];
    const currentPrompt = speakingPrompts[currentPromptIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">

                {/* === INTRO === */}
                {stage === 'intro' && (
                    <div className="p-8 text-center">
                        <span className="text-6xl">📝</span>
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Bài kiểm tra Phân loại</h1>
                        <p className="text-gray-600 mt-2">Placement Test với Speaking Assessment</p>

                        <div className="bg-blue-50 rounded-xl p-6 mt-6 text-left">
                            <h2 className="font-bold text-gray-800 mb-3">📋 Bài kiểm tra gồm 2 phần:</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg">
                                    <h3 className="font-bold text-blue-600">✍️ Phần 1: Trắc nghiệm</h3>
                                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                        <li>• 15 câu hỏi</li>
                                        <li>• 20 phút</li>
                                        <li>• Grammar, Vocabulary, Reading</li>
                                    </ul>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <h3 className="font-bold text-green-600">🎤 Phần 2: Speaking</h3>
                                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                        <li>• 3 câu hỏi nói</li>
                                        <li>• AI chấm điểm</li>
                                        <li>• Đánh giá 5 tiêu chí</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-500">
                                <strong>Điểm cuối cùng:</strong> Trắc nghiệm (40%) + Speaking (60%)
                            </p>
                        </div>

                        <button
                            onClick={fetchQuestions}
                            disabled={loading}
                            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Đang tải...' : '🚀 Bắt đầu làm bài'}
                        </button>
                    </div>
                )}

                {/* === WRITTEN TEST === */}
                {stage === 'written' && currentQuestion && (
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    ✍️ Phần 1: Trắc nghiệm
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                    {currentQuestion.category} • {currentQuestion.difficulty_level}
                                </span>
                            </div>
                            <div className={`px-4 py-2 rounded-full font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                ⏱️ {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                <span>Câu {currentIndex + 1} / {questions.length}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 transition-all" style={{ width: `${(currentIndex + 1) / questions.length * 100}%` }} />
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <p className="text-xl font-medium text-gray-800">{currentQuestion.question_text}</p>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(currentQuestion.options).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => handleAnswer(key)}
                                    className={`w-full p-4 rounded-xl text-left transition border-2 ${answers[currentQuestion.id.toString()] === key
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 bg-white text-gray-800'
                                        }`}
                                >
                                    <span className="font-bold mr-3">{key.toUpperCase()}.</span>
                                    {value}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={handlePrev} disabled={currentIndex === 0} className="px-6 py-2 border rounded-lg disabled:opacity-50">← Trước</button>
                            {currentIndex < questions.length - 1 ? (
                                <button onClick={handleNext} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Tiếp theo →</button>
                            ) : (
                                <button onClick={handleSubmitWritten} disabled={loading} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    {loading ? 'Đang chấm...' : 'Hoàn thành Phần 1 →'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* === SPEAKING TEST === */}
                {stage === 'speaking' && currentPrompt && (
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                🎤 Phần 2: Speaking ({currentPromptIndex + 1}/{speakingPrompts.length})
                            </span>
                            <span className="text-gray-500">{currentPrompt.level}</span>
                        </div>

                        {/* Written score summary */}
                        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center">
                            <p className="text-sm text-blue-700">✍️ Điểm Trắc nghiệm: <strong>{writtenScore}%</strong></p>
                        </div>

                        {/* Prompt */}
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-6 mb-6">
                            <p className="text-lg font-medium">{currentPrompt.prompt}</p>
                            <p className="text-sm opacity-80 mt-2">{currentPrompt.prompt_vi}</p>
                            <p className="text-xs mt-3 opacity-60">⏱️ Thời gian tối đa: {currentPrompt.duration_seconds}s</p>
                        </div>

                        {/* Recording UI */}
                        <div className="text-center">
                            {!isRecording && !transcription && (
                                <button
                                    onClick={startRecording}
                                    className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center mx-auto transition-transform hover:scale-105"
                                >
                                    <span className="text-4xl">🎤</span>
                                </button>
                            )}

                            {isRecording && (
                                <div>
                                    <button
                                        onClick={stopRecording}
                                        className="w-24 h-24 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto animate-pulse"
                                    >
                                        <span className="text-4xl">⏹️</span>
                                    </button>
                                    <p className="mt-4 text-2xl font-mono text-red-600">{formatTime(recordingTime)}</p>
                                    <p className="text-gray-500">Đang ghi âm...</p>
                                </div>
                            )}

                            {!isRecording && transcription && (
                                <div>
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
                                        <p className="text-sm text-gray-500 mb-2">📝 Nội dung đã nói:</p>
                                        <p className="text-gray-800">{transcription}</p>
                                    </div>

                                    {speakingResults[currentPromptIndex] && (
                                        <div className="bg-green-50 rounded-xl p-4 mb-4">
                                            <p className="font-bold text-green-700 mb-2">✅ Kết quả AI đánh giá:</p>
                                            <div className="grid grid-cols-3 gap-2 text-sm">
                                                <div>Phát âm: <strong>{speakingResults[currentPromptIndex].pronunciation_score}</strong></div>
                                                <div>Từ vựng: <strong>{speakingResults[currentPromptIndex].vocabulary_score}</strong></div>
                                                <div>Ngữ pháp: <strong>{speakingResults[currentPromptIndex].grammar_score}</strong></div>
                                                <div>Trôi chảy: <strong>{speakingResults[currentPromptIndex].fluency_score}</strong></div>
                                                <div>Mạch lạc: <strong>{speakingResults[currentPromptIndex].coherence_score}</strong></div>
                                                <div className="text-green-700">Tổng: <strong>{speakingResults[currentPromptIndex].overall_score}</strong></div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleNextPrompt}
                                        disabled={loading}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                                    >
                                        {currentPromptIndex < speakingPrompts.length - 1 ? 'Câu tiếp theo →' : '🏁 Xem kết quả cuối cùng'}
                                    </button>
                                </div>
                            )}

                            {loading && (
                                <div className="mt-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">AI đang đánh giá...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* === FINAL RESULT === */}
                {stage === 'result' && finalResult && (
                    <div className="p-8 text-center">
                        <span className="text-6xl">🎉</span>
                        <h1 className="text-3xl font-bold text-gray-800 mt-4">Kết quả Cuối cùng</h1>

                        <div className="my-6">
                            <div className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                <div className="text-center">
                                    <p className="text-5xl font-bold">{finalResult.final_level}</p>
                                    <p className="text-sm opacity-80">{finalResult.level_description.name}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-xl text-gray-700">{finalResult.level_description.name_vi}</p>
                        <p className="text-gray-500 text-sm">{finalResult.level_description.description}</p>

                        {/* Score breakdown */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-blue-50 rounded-xl p-4">
                                <p className="text-2xl font-bold text-blue-600">{Math.round(finalResult.written_score)}%</p>
                                <p className="text-xs text-gray-500">✍️ Trắc nghiệm (40%)</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4">
                                <p className="text-2xl font-bold text-green-600">{Math.round(finalResult.speaking_score)}%</p>
                                <p className="text-xs text-gray-500">🎤 Speaking (60%)</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4">
                                <p className="text-2xl font-bold text-purple-600">{Math.round(finalResult.final_score)}%</p>
                                <p className="text-xs text-gray-500">🏆 Tổng điểm</p>
                            </div>
                        </div>

                        {/* Speaking subscores */}
                        <div className="bg-gray-50 rounded-xl p-4 mt-4">
                            <p className="font-bold text-gray-700 mb-2">🎤 Chi tiết Speaking:</p>
                            <div className="grid grid-cols-5 gap-2 text-sm">
                                {Object.entries(finalResult.speaking_subscores).map(([key, value]) => (
                                    <div key={key} className="bg-white rounded p-2">
                                        <p className="font-bold text-blue-600">{Math.round(value)}</p>
                                        <p className="text-xs text-gray-500">{key}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="bg-yellow-50 rounded-xl p-4 mt-4 text-left">
                            <p className="font-bold text-gray-700">💡 Nhận xét:</p>
                            <p className="text-green-600 text-sm mt-1">✓ {finalResult.feedback.strength}</p>
                            <p className="text-orange-600 text-sm">⚡ {finalResult.feedback.improvement}</p>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Gợi ý tiếp theo:</p>
                                <ul className="text-sm text-gray-700">
                                    {finalResult.feedback.next_steps.map((step, i) => (
                                        <li key={i}>• {step}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                        >
                            🏠 Về trang chủ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

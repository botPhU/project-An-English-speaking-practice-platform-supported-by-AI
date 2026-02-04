import { useState } from 'react';

interface FeedbackFormProps {
    learnerId: number;
    learnerName: string;
    mentorId: number;
    sessionId?: number;
    onSubmit: (data: FeedbackData) => void;
    onClose: () => void;
    isOpen: boolean;
}

interface FeedbackData {
    mentor_id: number;
    learner_id: number;
    session_id?: number;
    pronunciation_score: number;
    grammar_score: number;
    vocabulary_score: number;
    fluency_score: number;
    overall_score: number;
    strengths: string;
    improvements: string;
    recommendations: string;
}

const FeedbackForm = ({ learnerId, learnerName, mentorId, sessionId, onSubmit, onClose, isOpen }: FeedbackFormProps) => {
    const [pronunciationScore, setPronunciationScore] = useState(5);
    const [grammarScore, setGrammarScore] = useState(5);
    const [vocabularyScore, setVocabularyScore] = useState(5);
    const [fluencyScore, setFluencyScore] = useState(5);
    const [strengths, setStrengths] = useState('');
    const [improvements, setImprovements] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const overallScore = Math.round((pronunciationScore + grammarScore + vocabularyScore + fluencyScore) / 4);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        await onSubmit({
            mentor_id: mentorId,
            learner_id: learnerId,
            session_id: sessionId,
            pronunciation_score: pronunciationScore,
            grammar_score: grammarScore,
            vocabulary_score: vocabularyScore,
            fluency_score: fluencyScore,
            overall_score: overallScore,
            strengths,
            improvements,
            recommendations
        });

        setSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    const ScoreSlider = ({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) => (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">{label}</span>
                <span className={`text-lg font-bold ${color}`}>{value}/10</span>
            </div>
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8">
            <div className="bg-[#1a2230] rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#1a2230] flex items-center justify-between px-6 py-4 border-b border-gray-700 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white">Đánh giá học viên</h3>
                        <p className="text-sm text-gray-400">{learnerName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Score Sliders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ScoreSlider label="🗣️ Phát âm" value={pronunciationScore} onChange={setPronunciationScore} color="text-purple-400" />
                        <ScoreSlider label="📝 Ngữ pháp" value={grammarScore} onChange={setGrammarScore} color="text-blue-400" />
                        <ScoreSlider label="📚 Từ vựng" value={vocabularyScore} onChange={setVocabularyScore} color="text-green-400" />
                        <ScoreSlider label="💬 Lưu loát" value={fluencyScore} onChange={setFluencyScore} color="text-yellow-400" />
                    </div>

                    {/* Overall Score Display */}
                    <div className="flex items-center justify-center gap-4 py-4 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-xl">
                        <span className="text-gray-300 font-medium">Điểm tổng:</span>
                        <span className="text-4xl font-bold text-primary">{overallScore}</span>
                        <span className="text-gray-400">/10</span>
                    </div>

                    {/* Text Feedback */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">✨ Điểm mạnh</label>
                            <textarea
                                value={strengths}
                                onChange={(e) => setStrengths(e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Những gì học viên làm tốt..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">📈 Cần cải thiện</label>
                            <textarea
                                value={improvements}
                                onChange={(e) => setImprovements(e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Những lĩnh vực cần luyện tập thêm..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">💡 Khuyến nghị</label>
                            <textarea
                                value={recommendations}
                                onChange={(e) => setRecommendations(e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder="Gợi ý bài tập, tài liệu học tập..."
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Gửi đánh giá
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;

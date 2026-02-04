import { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Technique {
    id: number;
    title: string;
    description: string;
    tips: string[];
    difficulty: string;
}

interface GrammarError {
    id: number;
    category: string;
    error: string;
    correct: string;
    explanation: string;
    frequency: string;
}

interface Idiom {
    id: number;
    idiom: string;
    meaning: string;
    example: string;
    level: string;
    topic: string;
}

interface Situation {
    id: number;
    name: string;
    name_vi: string;
    icon: string;
    description: string;
    level: string;
    key_phrases: string[];
}

export default function TeachingResources() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'confidence' | 'grammar' | 'pronunciation' | 'idioms' | 'situations'>('confidence');
    const [techniques, setTechniques] = useState<Technique[]>([]);
    const [grammarErrors, setGrammarErrors] = useState<GrammarError[]>([]);
    const [idioms, setIdioms] = useState<Idiom[]>([]);
    const [situations, setSituations] = useState<Situation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContent();
    }, [activeTab]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'confidence':
                    const confRes = await api.get('/api/mentor/content/confidence/techniques');
                    setTechniques(confRes.data.techniques || []);
                    break;
                case 'grammar':
                    const gramRes = await api.get('/api/mentor/content/grammar/common-errors');
                    setGrammarErrors(gramRes.data.errors || []);
                    break;
                case 'idioms':
                    const idiomRes = await api.get('/api/mentor/content/vocabulary/idioms');
                    setIdioms(idiomRes.data.idioms || []);
                    break;
                case 'situations':
                    const sitRes = await api.get('/api/mentor/content/situations');
                    setSituations(sitRes.data.situations || []);
                    break;
            }
        } catch (error) {
            console.error('Failed to fetch content:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'confidence', label: '💪 Xây dựng Tự tin', icon: '💪' },
        { id: 'grammar', label: '📝 Lỗi Ngữ pháp', icon: '📝' },
        { id: 'pronunciation', label: '🗣️ Phát âm', icon: '🗣️' },
        { id: 'idioms', label: '💬 Thành ngữ', icon: '💬' },
        { id: 'situations', label: '🎭 Tình huống', icon: '🎭' }
    ];

    return (
        <MentorLayout>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Tài liệu Giảng dạy</h1>
                    <p className="text-gray-600">Nội dung hỗ trợ mentor giúp học viên học tốt hơn</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`px-4 py-2 rounded-xl font-medium transition ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : (
                    <>
                        {/* Confidence Tab */}
                        {activeTab === 'confidence' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {techniques.map((tech) => (
                                    <div key={tech.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-bold text-gray-800">{tech.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tech.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                                    tech.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {tech.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{tech.description}</p>
                                        <div className="space-y-2">
                                            {tech.tips?.map((tip, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-sm">
                                                    <span className="text-green-500">✓</span>
                                                    <span className="text-gray-700">{tip}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Grammar Tab */}
                        {activeTab === 'grammar' && (
                            <div className="space-y-4">
                                {grammarErrors.map((error) => (
                                    <div key={error.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${error.category === 'tense' ? 'bg-purple-100 text-purple-700' :
                                                    error.category === 'article' ? 'bg-blue-100 text-blue-700' :
                                                        error.category === 'preposition' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {error.category}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs ${error.frequency === 'very_common' ? 'bg-red-100 text-red-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                {error.frequency === 'very_common' ? 'Rất phổ biến' : 'Phổ biến'}
                                            </span>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-3 bg-red-50 rounded-lg">
                                                <p className="text-xs text-red-500 mb-1">❌ Sai</p>
                                                <p className="text-lg line-through text-red-700">{error.error}</p>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <p className="text-xs text-green-500 mb-1">✓ Đúng</p>
                                                <p className="text-lg font-medium text-green-700">{error.correct}</p>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-gray-600 text-sm">💡 {error.explanation}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Idioms Tab */}
                        {activeTab === 'idioms' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {idioms.map((idiom) => (
                                    <div key={idiom.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{idiom.level}</span>
                                            <span className="text-xs text-gray-400">#{idiom.topic}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">"{idiom.idiom}"</h3>
                                        <p className="text-purple-600 font-medium mb-2">{idiom.meaning}</p>
                                        <p className="text-sm text-gray-500 italic">"{idiom.example}"</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Situations Tab */}
                        {activeTab === 'situations' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {situations.map((situation) => (
                                    <div key={situation.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                                            <span className="text-3xl">{situation.icon}</span>
                                            <h3 className="text-xl font-bold mt-2">{situation.name}</h3>
                                            <p className="text-blue-100">{situation.name_vi}</p>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-gray-600 mb-3">{situation.description}</p>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Level: {situation.level}</span>
                                            </div>
                                            <div className="border-t pt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Cụm từ quan trọng:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {situation.key_phrases?.map((phrase, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                            {phrase}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Quick Tips for Mentors */}
                <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-4">💡 Mẹo cho Mentor</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="font-medium mb-2">🎯 Khen trước sửa sau</p>
                            <p className="text-sm opacity-90">Luôn bắt đầu bằng việc khen ngợi điểm tốt trước khi sửa lỗi</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="font-medium mb-2">🔄 Sửa lỗi tự nhiên</p>
                            <p className="text-sm opacity-90">Lặp lại câu đúng thay vì chỉ ra lỗi trực tiếp</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="font-medium mb-2">❓ Câu hỏi mở</p>
                            <p className="text-sm opacity-90">Đặt câu hỏi mở để học viên nói nhiều hơn</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <p className="font-medium mb-2">⏳ Kiên nhẫn</p>
                            <p className="text-sm opacity-90">Cho học viên thời gian suy nghĩ, không vội vã</p>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

import { useState } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';

export default function Community() {
    const [activeTab, setActiveTab] = useState<'practice' | 'reviews' | 'mentors'>('practice');

    const onlineLearners = [
        { id: 1, name: 'Minh Hoàng', level: 'B2', avatar: 'MH', status: 'online', topic: 'Du lịch' },
        { id: 2, name: 'Quỳnh Anh', level: 'B1', avatar: 'QA', status: 'online', topic: 'Công việc' },
        { id: 3, name: 'Đức Anh', level: 'A2', avatar: 'DA', status: 'in-session', topic: 'Phỏng vấn' },
        { id: 4, name: 'Thu Hà', level: 'B2', avatar: 'TH', status: 'online', topic: 'Văn hóa' },
    ];

    const mentors = [
        { id: 1, name: 'Ms. Linh Đan', specialty: 'IELTS Speaking', rating: 4.9, reviews: 128, avatar: 'LD', available: true },
        { id: 2, name: 'Mr. Hoàng Nam', specialty: 'Business English', rating: 4.8, reviews: 95, avatar: 'HN', available: true },
        { id: 3, name: 'Ms. Mai Anh', specialty: 'Pronunciation', rating: 4.7, reviews: 72, avatar: 'MA', available: false },
    ];

    const recentSessions = [
        { id: 1, mentor: 'Ms. Linh Đan', date: '28/12/2024', topic: 'IELTS Part 2', rating: null },
        { id: 2, mentor: 'Mr. Hoàng Nam', date: '25/12/2024', topic: 'Business Meeting', rating: 5 },
        { id: 3, mentor: 'Ms. Mai Anh', date: '22/12/2024', topic: 'Pronunciation', rating: 4 },
    ];

    return (
        <LearnerLayout title="Cộng đồng">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Cộng đồng học tập</h1>
                        <p className="text-text-secondary mt-1">Luyện tập cùng bạn bè và kết nối với Mentor</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 bg-surface-dark p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('practice')}
                        className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'practice'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">group</span>
                        Luyện tập cùng nhau
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'reviews'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">rate_review</span>
                        Đánh giá
                    </button>
                    <button
                        onClick={() => setActiveTab('mentors')}
                        className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'mentors'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-text-secondary hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">supervisor_account</span>
                        Mentor
                    </button>
                </div>

                {/* Practice with Others Tab */}
                {activeTab === 'practice' && (
                    <div className="space-y-6">
                        {/* Quick Match */}
                        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-2xl p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-xl bg-primary/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl">record_voice_over</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Tìm bạn luyện tập ngay</h3>
                                        <p className="text-text-secondary text-sm">Ghép cặp ngẫu nhiên với học viên cùng trình độ</p>
                                    </div>
                                </div>
                                <button className="px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                                    <span className="material-symbols-outlined">bolt</span>
                                    Tìm kiếm nhanh
                                </button>
                            </div>
                        </div>

                        {/* Online Learners */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500">circle</span>
                                    Đang trực tuyến ({onlineLearners.filter(l => l.status === 'online').length})
                                </h2>
                                <select className="bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none">
                                    <option>Tất cả trình độ</option>
                                    <option>A1-A2</option>
                                    <option>B1-B2</option>
                                    <option>C1-C2</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {onlineLearners.map((learner) => (
                                    <div
                                        key={learner.id}
                                        className={`p-4 rounded-xl border transition-all ${learner.status === 'online'
                                                ? 'bg-white/5 border-border-dark hover:border-primary/50 cursor-pointer'
                                                : 'bg-white/[0.02] border-border-dark/50 opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="size-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary">
                                                        {learner.avatar}
                                                    </div>
                                                    <span className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-surface-dark ${learner.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`}></span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{learner.name}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                                                        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">{learner.level}</span>
                                                        <span>•</span>
                                                        <span>{learner.topic}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {learner.status === 'online' ? (
                                                <button className="px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary text-primary hover:text-white font-bold text-xs transition-all">
                                                    Mời luyện tập
                                                </button>
                                            ) : (
                                                <span className="text-xs text-yellow-500 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                                                    Đang bận
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6">
                        {/* Pending Reviews */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-orange-500">pending_actions</span>
                                Chờ đánh giá
                            </h2>
                            <div className="space-y-4">
                                {recentSessions.filter(s => s.rating === null).map((session) => (
                                    <div key={session.id} className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-white">{session.topic}</h4>
                                                <p className="text-sm text-text-secondary">{session.mentor} • {session.date}</p>
                                            </div>
                                            <button className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg">star</span>
                                                Đánh giá ngay
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Completed Reviews */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                                Đã đánh giá
                            </h2>
                            <div className="space-y-4">
                                {recentSessions.filter(s => s.rating !== null).map((session) => (
                                    <div key={session.id} className="p-4 rounded-xl bg-white/5 border border-border-dark">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-white">{session.topic}</h4>
                                                <p className="text-sm text-text-secondary">{session.mentor} • {session.date}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className={`material-symbols-outlined text-lg ${star <= (session.rating || 0) ? 'text-yellow-500' : 'text-gray-600'
                                                            }`}
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Mentors Tab */}
                {activeTab === 'mentors' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mentors.map((mentor) => (
                                <div key={mentor.id} className="bg-surface-dark border border-border-dark rounded-xl p-6 hover:border-primary/50 transition-all">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-bold text-primary text-lg">
                                            {mentor.avatar}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{mentor.name}</h3>
                                            <p className="text-sm text-primary">{mentor.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                                            <span className="font-bold text-white">{mentor.rating}</span>
                                        </div>
                                        <span className="text-text-secondary">({mentor.reviews} đánh giá)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {mentor.available ? (
                                            <>
                                                <button className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-lg">video_call</span>
                                                    Đặt lịch
                                                </button>
                                                <button className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                                                    <span className="material-symbols-outlined text-lg">chat</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-text-secondary font-bold text-sm cursor-not-allowed">
                                                Không khả dụng
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </LearnerLayout>
    );
}

import LearnerLayout from '../../layouts/LearnerLayout';

export default function Progress() {
    // Sample data for demonstration
    const weeklyProgress = [
        { day: 'T2', value: 45, label: '45 phút' },
        { day: 'T3', value: 30, label: '30 phút' },
        { day: 'T4', value: 60, label: '60 phút' },
        { day: 'T5', value: 20, label: '20 phút' },
        { day: 'T6', value: 50, label: '50 phút' },
        { day: 'T7', value: 75, label: '75 phút' },
        { day: 'CN', value: 40, label: '40 phút' },
    ];

    const achievements = [
        { icon: 'local_fire_department', name: 'Chuỗi 7 ngày', description: 'Học liên tục 7 ngày', earned: true, color: 'text-orange-500' },
        { icon: 'military_tech', name: 'Cao thủ Phát âm', description: 'Đạt 90% độ chính xác', earned: true, color: 'text-yellow-500' },
        { icon: 'star', name: 'Siêu sao Ngữ pháp', description: 'Hoàn thành 50 bài tập', earned: true, color: 'text-purple-500' },
        { icon: 'workspace_premium', name: 'Bậc thầy B2', description: 'Đạt trình độ B2', earned: false, color: 'text-gray-500' },
    ];

    const recentFeedback = [
        {
            type: 'grammar',
            icon: 'spellcheck',
            original: 'I go to school yesterday.',
            correction: 'I went to school yesterday.',
            explanation: 'Sử dụng thì quá khứ đơn "went" vì hành động xảy ra "yesterday".',
            score: 85,
        },
        {
            type: 'pronunciation',
            icon: 'mic',
            word: 'comfortable',
            userPronunciation: '/ˈkʌmfərtəbl/',
            correctPronunciation: '/ˈkʌmftəbl/',
            tip: 'Bỏ âm "or" ở giữa, phát âm là "KUMF-tuh-bl"',
            score: 72,
        },
        {
            type: 'vocabulary',
            icon: 'translate',
            context: 'Sử dụng "make" thay vì "do"',
            original: 'I need to do a decision.',
            correction: 'I need to make a decision.',
            explanation: 'Collocations: "make a decision", không phải "do".',
            score: 78,
        },
    ];

    const skillScores = [
        { skill: 'Phát âm', score: 82, icon: 'record_voice_over', color: 'bg-blue-500' },
        { skill: 'Ngữ pháp', score: 75, icon: 'spellcheck', color: 'bg-green-500' },
        { skill: 'Từ vựng', score: 88, icon: 'translate', color: 'bg-purple-500' },
        { skill: 'Nghe hiểu', score: 70, icon: 'hearing', color: 'bg-orange-500' },
        { skill: 'Độ trôi chảy', score: 65, icon: 'speed', color: 'bg-pink-500' },
    ];

    return (
        <LearnerLayout title="Tiến độ & Phản hồi AI">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Tiến độ học tập</h1>
                        <p className="text-text-secondary mt-1">Theo dõi hiệu suất và nhận phản hồi từ AI</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="bg-surface-dark border border-border-dark rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none">
                            <option>Tuần này</option>
                            <option>Tháng này</option>
                            <option>3 tháng gần đây</option>
                        </select>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">schedule</span>
                            </div>
                            <span className="text-text-secondary text-sm">Tổng thời gian</span>
                        </div>
                        <p className="text-2xl font-bold text-white">12.5 giờ</p>
                        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +2.5h so với tuần trước
                        </p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
                            </div>
                            <span className="text-text-secondary text-sm">Chuỗi ngày</span>
                        </div>
                        <p className="text-2xl font-bold text-white">14 ngày</p>
                        <p className="text-xs text-text-secondary mt-1">Kỷ lục: 21 ngày</p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-500">check_circle</span>
                            </div>
                            <span className="text-text-secondary text-sm">Bài hoàn thành</span>
                        </div>
                        <p className="text-2xl font-bold text-white">47 bài</p>
                        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +12 bài tuần này
                        </p>
                    </div>
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="size-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-500">stars</span>
                            </div>
                            <span className="text-text-secondary text-sm">Điểm trung bình</span>
                        </div>
                        <p className="text-2xl font-bold text-white">82%</p>
                        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +5% so với tuần trước
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Weekly Progress Chart */}
                    <div className="lg:col-span-2 bg-surface-dark border border-border-dark rounded-xl p-6">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">bar_chart</span>
                            Thời gian luyện tập tuần này
                        </h2>
                        <div className="flex items-end justify-between gap-3 h-52 pt-8">
                            {weeklyProgress.map((item, index) => {
                                const maxValue = Math.max(...weeklyProgress.map(p => p.value));
                                const heightPercent = (item.value / maxValue) * 100;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full">
                                        <div className="flex-1 flex items-end w-full">
                                            <div
                                                className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg hover:from-primary hover:to-primary/80 transition-all cursor-pointer relative group"
                                                style={{ height: `${Math.max(heightPercent, 10)}%`, minHeight: '20px' }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-dark border border-border-dark px-3 py-1.5 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                                                    {item.label}
                                                </div>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">
                                                    {item.value}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-text-secondary font-medium">{item.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border-dark flex items-center justify-between text-sm">
                            <span className="text-text-secondary">Tổng tuần: <span className="text-white font-bold">320 phút</span></span>
                            <span className="text-green-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +15% so với tuần trước
                            </span>
                        </div>
                    </div>

                    {/* Skill Scores */}
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">leaderboard</span>
                            Điểm kỹ năng
                        </h2>
                        <div className="space-y-4">
                            {skillScores.map((skill, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-text-secondary">{skill.icon}</span>
                                            <span className="text-sm text-white">{skill.skill}</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">{skill.score}%</span>
                                    </div>
                                    <div className="h-2 bg-border-dark rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                                            style={{ width: `${skill.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">emoji_events</span>
                        Thành tích đã đạt
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className={`relative p-4 rounded-xl border transition-all text-center ${achievement.earned
                                    ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/30 hover:border-primary/50'
                                    : 'bg-surface-dark/50 border-border-dark opacity-50'
                                    }`}
                            >
                                <div className={`size-12 mx-auto mb-3 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-gradient-to-br from-primary/20 to-purple-500/20' : 'bg-border-dark'
                                    }`}>
                                    <span className={`material-symbols-outlined text-2xl ${achievement.color}`}>
                                        {achievement.icon}
                                    </span>
                                </div>
                                <h3 className="font-bold text-white text-sm">{achievement.name}</h3>
                                <p className="text-xs text-text-secondary mt-1">{achievement.description}</p>
                                {achievement.earned && (
                                    <span className="absolute top-2 right-2 text-green-500">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Feedback Section */}
                <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">psychology</span>
                            Phản hồi từ AI
                        </h2>
                        <button className="text-sm text-primary hover:underline">Xem tất cả</button>
                    </div>
                    <div className="space-y-4">
                        {recentFeedback.map((feedback, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl bg-background-dark border border-border-dark hover:border-primary/30 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${feedback.type === 'grammar' ? 'bg-green-500/20' :
                                        feedback.type === 'pronunciation' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                                        }`}>
                                        <span className={`material-symbols-outlined ${feedback.type === 'grammar' ? 'text-green-500' :
                                            feedback.type === 'pronunciation' ? 'text-blue-500' : 'text-purple-500'
                                            }`}>{feedback.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {feedback.type === 'grammar' && (
                                            <>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                                                        Ngữ pháp
                                                    </span>
                                                    <span className="text-xs text-text-secondary">Điểm: {feedback.score}%</span>
                                                </div>
                                                <p className="text-red-400 line-through text-sm">{feedback.original}</p>
                                                <p className="text-green-400 text-sm mt-1">{feedback.correction}</p>
                                                <p className="text-text-secondary text-xs mt-2">{feedback.explanation}</p>
                                            </>
                                        )}
                                        {feedback.type === 'pronunciation' && (
                                            <>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                                                        Phát âm
                                                    </span>
                                                    <span className="text-xs text-text-secondary">Điểm: {feedback.score}%</span>
                                                </div>
                                                <p className="text-white font-bold">{feedback.word}</p>
                                                <div className="flex items-center gap-4 mt-1 text-sm">
                                                    <span className="text-red-400">{feedback.userPronunciation}</span>
                                                    <span className="material-symbols-outlined text-text-secondary text-sm">arrow_forward</span>
                                                    <span className="text-green-400">{feedback.correctPronunciation}</span>
                                                </div>
                                                <p className="text-text-secondary text-xs mt-2">{feedback.tip}</p>
                                            </>
                                        )}
                                        {feedback.type === 'vocabulary' && (
                                            <>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">
                                                        Từ vựng
                                                    </span>
                                                    <span className="text-xs text-text-secondary">Điểm: {feedback.score}%</span>
                                                </div>
                                                <p className="text-white text-sm font-medium">{feedback.context}</p>
                                                <p className="text-red-400 line-through text-sm mt-1">{feedback.original}</p>
                                                <p className="text-green-400 text-sm">{feedback.correction}</p>
                                                <p className="text-text-secondary text-xs mt-2">{feedback.explanation}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LearnerLayout>
    );
}

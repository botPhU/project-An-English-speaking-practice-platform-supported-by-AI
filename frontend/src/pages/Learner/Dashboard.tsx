import LearnerLayout from '../../layouts/LearnerLayout';

export default function Dashboard() {
    return (
        <LearnerLayout title="Bảng điều khiển">
            <div className="flex flex-col gap-10">
                {/* Welcome Section */}
                <header className="flex flex-col gap-4">
                    <h2 className="text-3xl md:text-4xl font-black leading-tight text-white">
                        Chào mừng trở lại, Alex
                    </h2>
                    <p className="text-text-secondary text-base md:text-lg max-w-2xl font-medium">
                        Bạn đang có chuỗi 12 ngày học liên tiếp! Hãy giữ vững phong độ nhé.
                    </p>
                </header>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark group hover:border-primary/50 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl">local_fire_department</span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <span className="material-symbols-outlined fill-1">local_fire_department</span>
                            </div>
                            <span className="text-text-secondary font-bold text-sm uppercase tracking-widest">Chuỗi Ngày</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">12</span>
                            <span className="text-text-secondary font-bold text-sm">Ngày liên tiếp</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark group hover:border-primary/50 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl">military_tech</span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">military_tech</span>
                            </div>
                            <span className="text-text-secondary font-bold text-sm uppercase tracking-widest">Điểm XP</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">2,450</span>
                            <span className="text-text-secondary font-bold text-sm">Điểm XP</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark group hover:border-primary/50 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl">track_changes</span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 rounded-xl bg-accent-green/10 flex items-center justify-center text-accent-green">
                                <span className="material-symbols-outlined">track_changes</span>
                            </div>
                            <span className="text-text-secondary font-bold text-sm uppercase tracking-widest">Mục Tiêu Ngày</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black">80%</span>
                            <span className="text-text-secondary font-bold text-sm">Hoàn thành</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Learning Roadmap */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        <section className="bg-surface-dark/30 rounded-3xl border border-border-dark overflow-hidden group">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1543269664-7eef42226a21?auto=format&fit=crop&q=80&w=1200"
                                    alt="Lesson cover"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/50 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <span className="px-3 py-1 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Tiếp tục lộ trình</span>
                                    <h3 className="text-3xl font-black text-white mb-2">Thảo luận Kế hoạch Du lịch</h3>
                                    <p className="text-text-secondary font-medium flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">school</span>
                                        Bài 4 • Giao tiếp
                                    </p>
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-text-secondary text-base leading-relaxed mb-8 max-w-2xl">
                                    Làm chủ thì tương lai cùng trợ lý AI trong phiên nhập vai tương tác này.
                                    Tập trung vào cách dùng <span className="text-white font-bold">"going to"</span> và <span className="text-white font-bold">"will"</span>.
                                </p>
                                <button className="w-full md:w-auto px-10 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 transition-all">
                                    Bắt đầu ngay
                                </button>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* AI Progress */}
                            <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark flex flex-col gap-6">
                                <h4 className="font-black flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">auto_graph</span>
                                    Tiến độ Kỹ năng
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Phát âm', value: 72, color: 'bg-primary' },
                                        { label: 'Ngữ pháp', value: 64, color: 'bg-purple-500' },
                                        { label: 'Từ vựng', value: 85, color: 'bg-accent-green' },
                                    ].map(skill => (
                                        <div key={skill.label} className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-text-secondary">
                                                <span>{skill.label}</span>
                                                <span className="text-white">{skill.value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.value}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Feedback */}
                            <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark flex flex-col gap-6">
                                <h4 className="font-black flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">comment</span>
                                    AI Feedback Mới
                                </h4>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 italic text-sm text-text-secondary leading-relaxed">
                                    "Bạn đã sử dụng thì hiện tại hoàn thành rất tự nhiên. Hãy chú ý nhấn âm cuối 's' ở các từ số nhiều nhé!"
                                </div>
                                <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline text-left">
                                    Xem chi tiết phản hồi
                                </button>
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <section className="bg-surface-dark rounded-2xl border border-border-dark p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-black flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    Lịch học tuần này
                                </h4>
                                <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">
                                    Xem tất cả
                                </button>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { day: 'Hôm nay', time: '19:00', title: 'Giao tiếp: Du lịch', type: 'AI Practice', status: 'upcoming', color: 'border-primary' },
                                    { day: 'T3, 31/12', time: '20:00', title: 'Phát âm: Âm cuối', type: 'Lesson', status: 'scheduled', color: 'border-purple-500' },
                                    { day: 'T5, 02/01', time: '18:30', title: 'Ngữ pháp: Thì tương lai', type: 'Quiz', status: 'scheduled', color: 'border-green-500' },
                                ].map((item, index) => (
                                    <div key={index} className={`flex items-center gap-4 p-4 rounded-xl bg-white/5 border-l-4 ${item.color} hover:bg-white/10 transition-colors cursor-pointer`}>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-text-secondary">{item.day}</span>
                                                <span className="text-xs text-text-secondary">•</span>
                                                <span className="text-xs font-bold text-primary">{item.time}</span>
                                            </div>
                                            <h5 className="font-bold text-white truncate">{item.title}</h5>
                                            <span className="text-[10px] uppercase tracking-wider text-text-secondary">{item.type}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Challenges & Social */}
                    <div className="lg:col-span-4 flex flex-col gap-8">
                        <section className="bg-surface-dark rounded-3xl border border-border-dark overflow-hidden">
                            <div className="p-6 border-b border-border-dark flex items-center justify-between bg-white/[0.02]">
                                <h4 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs">
                                    <span className="material-symbols-outlined text-orange-500">emoji_events</span>
                                    Thử thách hôm nay
                                </h4>
                                <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded">MỚI</span>
                            </div>
                            <div className="p-0">
                                <div className="group relative overflow-hidden h-48">
                                    <img
                                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
                                        alt="Landscape"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent"></div>
                                </div>
                                <div className="p-6">
                                    <h5 className="font-bold text-lg mb-2">Mô tả phong cảnh</h5>
                                    <p className="text-xs text-text-secondary leading-relaxed mb-6">
                                        Sử dụng ít nhất 5 tính từ liên quan đến thiên nhiên trong bài nói 1 phút.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-sm">stars</span>
                                            <span className="text-xs font-black text-primary">+50 XP</span>
                                        </div>
                                        <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-widest transition-all">
                                            THỬ THÁCH
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-surface-dark rounded-3xl border border-border-dark p-6">
                            <h4 className="font-black flex items-center gap-3 uppercase tracking-widest text-xs mb-8">
                                <span className="material-symbols-outlined text-primary">leaderboard</span>
                                Bảng Xếp Hạng
                            </h4>
                            <div className="space-y-6">
                                {[
                                    { rank: 1, name: 'Minh Hoàng', xp: '3,200', avatar: 'MH', color: 'text-yellow-500' },
                                    { rank: 2, name: 'Quỳnh Anh', xp: '2,950', avatar: 'QA', color: 'text-gray-400' },
                                    { rank: 3, name: 'Bạn', xp: '2,450', avatar: 'ME', color: 'text-primary', active: true },
                                ].map(user => (
                                    <div key={user.name} className={`flex items-center justify-between ${user.active ? 'p-3 bg-primary/5 rounded-xl border border-primary/20 -mx-3' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-black w-4 ${user.color}`}>{user.rank}</span>
                                            <div className={`size-10 rounded-full flex items-center justify-center font-black text-sm border-2 ${user.active ? 'border-primary bg-primary text-white' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>
                                                {user.avatar}
                                            </div>
                                            <span className={`text-sm font-bold ${user.active ? 'text-primary' : ''}`}>{user.name}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-text-secondary">{user.xp} XP</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </LearnerLayout>
    );
}

import LearnerLayout from '../../layouts/LearnerLayout';

export default function Challenges() {
    return (
        <LearnerLayout title="Trung tâm Thành tích">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8">
                {/* Page Heading & Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] text-white">
                            Trung tâm Thành tích
                        </h1>
                        <p className="text-text-secondary text-base font-normal max-w-2xl">
                            Theo dõi sự tiến bộ hàng ngày, hoàn thành nhiệm vụ và leo lên bảng
                            xếp hạng để trở thành bậc thầy tiếng Anh.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#283039] hover:bg-[#323b46] text-white font-bold text-sm transition-all text-nowrap">
                            <span className="material-symbols-outlined text-lg">history</span>
                            Lịch sử
                        </button>
                        <button className="flex items-center gap-2 h-10 px-5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all text-nowrap">
                            <span className="material-symbols-outlined text-lg">
                                play_arrow
                            </span>
                            Học ngay
                        </button>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-10">
                    {/* Stats Overview (Top Row - Spans Full) */}
                    <div className="col-span-1 md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Level Card */}
                        <div className="flex flex-col gap-3 rounded-xl p-5 bg-surface-dark border border-border-dark shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-white">
                                    military_tech
                                </span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                                Cấp độ hiện tại
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">Level 12</span>
                            </div>
                            <div className="w-full bg-[#283039] h-2 rounded-full overflow-hidden mt-1">
                                <div className="bg-primary h-full rounded-full w-[70%]" />
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                                340 XP đến Level 13
                            </p>
                        </div>

                        {/* XP Card */}
                        <div className="flex flex-col gap-3 rounded-xl p-5 bg-surface-dark border border-border-dark shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-white">
                                    stars
                                </span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                                Tổng điểm XP
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">12,450</span>
                                <span className="text-sm font-bold text-text-secondary">XP</span>
                            </div>
                            <div className="flex items-center gap-1 text-accent-green text-sm font-medium bg-accent-green/10 w-fit px-2 py-0.5 rounded">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +150 hôm nay
                            </div>
                        </div>

                        {/* Streak Card */}
                        <div className="flex flex-col gap-3 rounded-xl p-5 bg-surface-dark border border-[#ff9800]/30 shadow-sm relative overflow-hidden group hover:border-[#ff9800]/50 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ff9800]/5 to-transparent" />
                            <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-accent-orange fill-1">
                                    local_fire_department
                                </span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                                Chuỗi ngày học
                            </p>
                            <div className="flex items-baseline gap-2 z-10">
                                <span className="text-3xl font-bold text-[#ff9800]">15 Ngày</span>
                            </div>
                            <p className="text-sm text-text-secondary z-10">
                                Bạn đang cháy hết mình! 🔥
                            </p>
                        </div>

                        {/* Badges Count */}
                        <div className="flex flex-col gap-3 rounded-xl p-5 bg-surface-dark border border-border-dark shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-6xl text-white">
                                    workspace_premium
                                </span>
                            </div>
                            <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                                Huy hiệu
                            </p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">8</span>
                                <span className="text-xl text-text-secondary">/ 20</span>
                            </div>
                            <p className="text-sm text-text-secondary mt-1">
                                Mở khóa huy hiệu tiếp theo
                            </p>
                        </div>
                    </div>

                    {/* Left Column: Progress & Heatmap (Span 8) */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-8 flex flex-col gap-6">
                        {/* Heatmap Section */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-bold text-lg">Hoạt động luyện tập</h3>
                                <div className="flex gap-2 text-xs text-text-secondary">
                                    <span>Ít</span>
                                    <div className="flex gap-1">
                                        <div className="size-3 rounded-sm bg-[#283039]" />
                                        <div className="size-3 rounded-sm bg-primary/20" />
                                        <div className="size-3 rounded-sm bg-primary/40" />
                                        <div className="size-3 rounded-sm bg-primary/70" />
                                        <div className="size-3 rounded-sm bg-primary" />
                                    </div>
                                    <span>Nhiều</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 w-full overflow-x-auto pb-2 scrollbar-hide">
                                <div className="flex gap-1">
                                    {Array.from({ length: 52 }).map((_, i) => (
                                        <div key={i} className="flex flex-col gap-1 flex-shrink-0">
                                            {Array.from({ length: 7 }).map((_, j) => {
                                                const opacity = Math.random() > 0.4 ? (Math.random() > 0.5 ? 'bg-primary' : 'bg-primary/30') : 'bg-[#283039]';
                                                return <div key={j} className={`size-3 rounded-sm ${opacity} hover:ring-1 hover:ring-white transition-all`} />;
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] text-text-secondary uppercase font-bold tracking-widest">
                                <span>Tháng 1</span>
                                <span>Tháng 4</span>
                                <span>Tháng 7</span>
                                <span>Tháng 10</span>
                                <span>Tháng 12</span>
                            </div>
                        </div>

                        {/* Skill Progress Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { name: 'Vốn từ vựng', value: 85, icon: 'menu_book', color: 'bg-blue-500' },
                                { name: 'Phát âm', value: 64, icon: 'record_voice_over', color: 'bg-green-500' },
                                { name: 'Ngữ pháp', value: 72, icon: 'architecture', color: 'bg-purple-500' },
                                { name: 'Độ trôi chảy', value: 58, icon: 'auto_graph', color: 'bg-orange-500' },
                            ].map((skill, i) => (
                                <div key={i} className="bg-surface-dark border border-border-dark rounded-xl p-5 flex flex-col gap-4 group/item hover:border-primary/20 transition-all">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${skill.color}/10 text-white group-hover/item:scale-110 transition-transform`}>
                                                <span className="material-symbols-outlined text-xl">{skill.icon}</span>
                                            </div>
                                            <span className="font-bold text-white">{skill.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-white">{skill.value}%</span>
                                    </div>
                                    <div className="w-full bg-[#283039] h-2 rounded-full overflow-hidden">
                                        <div className={`${skill.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${skill.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Badge Collection Grid */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-white font-bold text-lg">Huy hiệu đã đạt</h3>
                                <button className="text-primary text-sm font-bold hover:underline">Sưu tập của tôi</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                                {[
                                    { name: 'Người Tiên Phong', icon: 'explore', unlocked: true },
                                    { name: 'Nhà Hùng Biện', icon: 'campaign', unlocked: true },
                                    { name: 'Kẻ Hủy Diệt', icon: 'auto_stories', unlocked: true },
                                    { name: 'Siêu Chiến Binh', icon: 'workspace_premium', unlocked: true },
                                    { name: 'Chuyên Gia Cố Vấn', icon: 'psychology', unlocked: false },
                                    { name: 'Thiên Tài Ngữ Pháp', icon: 'spellcheck', unlocked: false },
                                ].map((badge, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 group/badge">
                                        <div className={`size-16 rounded-2xl flex items-center justify-center transition-all ${badge.unlocked ? 'bg-primary/10 text-primary border border-primary/20 group-hover/badge:rotate-12 group-hover/badge:scale-110' : 'bg-gray-800/50 text-gray-600 border border-transparent grayscale'}`}>
                                            <span className="material-symbols-outlined text-3xl font-light">{badge.icon}</span>
                                        </div>
                                        <span className={`text-[10px] text-center font-bold uppercase tracking-tight ${badge.unlocked ? 'text-white' : 'text-text-secondary'}`}>{badge.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 1: Challenges & Quests (Span 4) */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col gap-6">
                        {/* Daily Quests List */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden shadow-sm flex flex-col">
                            <div className="p-5 border-b border-border-dark bg-white/[0.02] flex items-center justify-between">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">task_alt</span>
                                    Nhiệm vụ hàng ngày
                                </h3>
                                <span className="text-xs text-text-secondary">2/3</span>
                            </div>
                            <div className="p-2 flex flex-col divide-y divide-[#283039]">
                                {[
                                    { task: 'Luyện nói 10 phút', reward: '50 XP', done: true },
                                    { task: 'Học 5 từ vựng mới', reward: '30 XP', done: true },
                                    { task: 'Hoàn thành 1 bài tập ngữ pháp', reward: '40 XP', done: false },
                                ].map((q, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-5 rounded border flex items-center justify-center transition-colors ${q.done ? 'bg-accent-green border-accent-green text-white' : 'border-gray-500'}`}>
                                                {q.done && <span className="material-symbols-outlined text-sm font-black">check</span>}
                                            </div>
                                            <span className={`text-sm ${q.done ? 'text-text-secondary line-through' : 'text-white'}`}>{q.task}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">{q.reward}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard Excerpt */}
                        <div className="bg-surface-dark border border-border-dark rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-white font-bold">Bảng Xếp Hạng</h3>
                                <div className="flex gap-2">
                                    <span className="text-xs font-black text-primary px-2 py-1 bg-primary/10 rounded cursor-pointer">Tuần này</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                {[
                                    { name: 'Minh Hoàng', xp: '3,200', rank: 1, avatar: 'MH' },
                                    { name: 'Quỳnh Anh', xp: '2,950', rank: 2, avatar: 'QA' },
                                    { name: 'Bạn', xp: '2,450', rank: 3, avatar: 'ME', active: true },
                                    { name: 'Trọng Hiển', xp: '2,100', rank: 4, avatar: 'TH' },
                                ].map((u, i) => (
                                    <div key={i} className={`flex items-center justify-between group ${u.active ? 'bg-primary/5 p-3 rounded-xl border border-primary/20 -mx-3' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs font-black w-4 ${u.rank === 1 ? 'text-yellow-500' : u.rank === 2 ? 'text-gray-400' : u.rank === 3 ? 'text-primary' : 'text-text-secondary'}`}>{u.rank}</span>
                                            <div className={`size-10 rounded-full flex items-center justify-center font-black text-sm border-2 ${u.active ? 'border-primary bg-primary text-white' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>{u.avatar}</div>
                                            <span className={`text-sm font-bold ${u.active ? 'text-primary' : 'text-white'} group-hover:underline cursor-pointer`}>{u.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-black ${u.active ? 'text-primary' : 'text-text-secondary'}`}>{u.xp} XP</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 rounded-xl border border-[#283039] text-text-secondary text-xs font-black uppercase tracking-widest hover:bg-[#283039] hover:text-white transition-all">Xem bảng xếp hạng</button>
                        </div>

                        {/* Daily Motivation Quote */}
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                                <span className="material-symbols-outlined text-9xl text-white">format_quote</span>
                            </div>
                            <h4 className="text-primary text-[10px] font-black uppercase tracking-widest mb-3">Lời dẫn cảm hứng</h4>
                            <p className="text-white text-sm italic leading-relaxed relative z-10">
                                "The limits of my language mean the limits of my world."
                            </p>
                            <p className="text-primary text-xs font-bold mt-3 relative z-10">— Ludwig Wittgenstein</p>
                        </div>
                    </div>
                </div>
            </div>
        </LearnerLayout>
    );
}

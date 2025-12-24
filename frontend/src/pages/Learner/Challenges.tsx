export default function Challenges() {
    return (
        <>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Trung tâm Thành tích - AESP</title>
            <link href="https://fonts.googleapis.com" rel="preconnect" />
            <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
            <link
                href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
            <div className="relative flex h-auto min-h-screen w-full flex-col">
                {/* Top Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e7eb] dark:border-[#283039] bg-surface-light dark:bg-[#111418] px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-4 text-[#111418] dark:text-white">
                        <div className="size-8 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                            AESP
                        </h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <div className="hidden md:flex items-center gap-9">
                            <a
                                className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-secondary"
                                href="#"
                            >
                                Trang chủ
                            </a>
                            <a
                                className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-secondary"
                                href="#"
                            >
                                Học tập
                            </a>
                            <a
                                className="text-sm font-medium leading-normal text-primary font-bold"
                                href="#"
                            >
                                Thành tích
                            </a>
                            <a
                                className="text-sm font-medium leading-normal hover:text-primary transition-colors text-text-secondary"
                                href="#"
                            >
                                Cộng đồng
                            </a>
                        </div>
                        <div className="flex gap-3 items-center">
                            {/* Streak Flame (Small Widget) */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff9800]/10 rounded-full border border-[#ff9800]/20">
                                <span className="material-symbols-outlined text-[#ff9800] text-xl fill-1">
                                    local_fire_department
                                </span>
                                <span className="text-[#ff9800] font-bold text-sm">15</span>
                            </div>
                            <button className="flex items-center justify-center rounded-full size-10 hover:bg-gray-100 dark:hover:bg-[#283039] transition-colors text-[#111418] dark:text-white">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div className="relative group cursor-pointer">
                                <div
                                    className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary"
                                    data-alt="User profile avatar showing a smiling student"
                                    style={{
                                        backgroundImage:
                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQt1N5y5MQr9NqgVwsAq5QrvpqEzabnYitu4FZZiVIQrvwKnlBzrVstJftAfK66HdL-SFuuXsZ2bHH9Li7-Kzhn3hvfaUQjyPGJVwXIPvfchXiKvX1IqCxdCFeIy7UAUfJrw4aF3HTymzl-6pa-pv9iN0x8VR6k_sQEPF9gWJj7V0NCZY24yCPC0KwUstVfKhEKuOC1_wPVcZLLTcYLC2Wg5RMhg3EUJwLsf0L5GKN55rIUxGKVIW2qQIo8NUgaBjXu5pdDFWnnl8")'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 justify-center py-8 px-4 md:px-8 lg:px-20">
                    <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 gap-8">
                        {/* Page Heading & Actions */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                                    Trung tâm Thành tích
                                </h1>
                                <p className="text-text-secondary text-base font-normal max-w-2xl">
                                    Theo dõi sự tiến bộ hàng ngày, hoàn thành nhiệm vụ và leo lên bảng
                                    xếp hạng để trở thành bậc thầy tiếng Anh.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 h-10 px-5 rounded-lg bg-[#283039] hover:bg-[#323b46] text-white font-bold text-sm transition-all">
                                    <span className="material-symbols-outlined text-lg">history</span>
                                    Lịch sử
                                </button>
                                <button className="flex items-center gap-2 h-10 px-5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all">
                                    <span className="material-symbols-outlined text-lg">
                                        play_arrow
                                    </span>
                                    Học ngay
                                </button>
                            </div>
                        </div>
                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Stats Overview (Top Row - Spans Full) */}
                            <div className="col-span-1 md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Level Card */}
                                <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1e242b] border border-gray-200 dark:border-[#283039] shadow-sm relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-6xl">
                                            military_tech
                                        </span>
                                    </div>
                                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                                        Cấp độ hiện tại
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold">Level 12</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-[#283039] h-2 rounded-full overflow-hidden mt-1">
                                        <div className="bg-primary h-full rounded-full w-[70%]" />
                                    </div>
                                    <p className="text-xs text-text-secondary mt-1">
                                        340 XP đến Level 13
                                    </p>
                                </div>
                                {/* XP Card */}
                                <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1e242b] border border-gray-200 dark:border-[#283039] shadow-sm relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-6xl">
                                            stars
                                        </span>
                                    </div>
                                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                                        Tổng điểm XP
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold">12,450</span>
                                        <span className="text-sm font-bold text-text-secondary">
                                            XP
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-accent-green text-sm font-medium bg-accent-green/10 w-fit px-2 py-0.5 rounded">
                                        <span className="material-symbols-outlined text-sm">
                                            trending_up
                                        </span>
                                        +150 hôm nay
                                    </div>
                                </div>
                                {/* Streak Card */}
                                <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1e242b] border border-[#ff9800]/30 shadow-sm relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff9800]/5 to-transparent" />
                                    <div className="absolute right-0 top-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                                        <span className="material-symbols-outlined text-6xl text-accent-orange">
                                            local_fire_department
                                        </span>
                                    </div>
                                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                                        Chuỗi ngày học
                                    </p>
                                    <div className="flex items-baseline gap-2 z-10">
                                        <span className="text-3xl font-bold text-[#ff9800]">
                                            15 Ngày
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary z-10">
                                        Bạn đang cháy hết mình! 🔥
                                    </p>
                                </div>
                                {/* Badges Count */}
                                <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1e242b] border border-gray-200 dark:border-[#283039] shadow-sm relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-6xl">
                                            workspace_premium
                                        </span>
                                    </div>
                                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                                        Huy hiệu
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-bold">8</span>
                                        <span className="text-xl text-text-secondary">/ 20</span>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-1">
                                        Mở khóa huy hiệu tiếp theo
                                    </p>
                                </div>
                            </div>
                            {/* Column 1: Challenges & Quests (Span 4) */}
                            <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold">Nhiệm vụ hôm nay</h3>
                                        <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
                                            Xem tất cả
                                        </span>
                                    </div>
                                    {/* Challenge Card 1 */}
                                    <div className="bg-white dark:bg-[#1e242b] p-5 rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm flex flex-col gap-4 hover:border-primary/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                    <span className="material-symbols-outlined">
                                                        record_voice_over
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base">Luyện nói 10 phút</p>
                                                    <p className="text-xs text-text-secondary mt-0.5">
                                                        Với trợ lý AI
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold">
                                                +50 XP
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between text-xs font-medium text-text-secondary">
                                                <span>7 / 10 phút</span>
                                                <span>70%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-[#283039] h-2 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full w-[70%]" />
                                            </div>
                                        </div>
                                        <button className="w-full py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-colors">
                                            Tiếp tục
                                        </button>
                                    </div>
                                    {/* Challenge Card 2 */}
                                    <div className="bg-white dark:bg-[#1e242b] p-5 rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm flex flex-col gap-4 hover:border-primary/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                    <span className="material-symbols-outlined">
                                                        library_books
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base">Học 5 từ mới</p>
                                                    <p className="text-xs text-text-secondary mt-0.5">
                                                        Chủ đề: Du lịch
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold">
                                                +30 XP
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between text-xs font-medium text-text-secondary">
                                                <span>5 / 5 từ</span>
                                                <span className="text-accent-green">Hoàn thành</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-[#283039] h-2 rounded-full overflow-hidden">
                                                <div className="bg-accent-green h-full rounded-full w-full" />
                                            </div>
                                        </div>
                                        <button className="w-full py-2 rounded-lg bg-accent-green hover:bg-green-600 text-white text-sm font-bold transition-colors shadow-lg shadow-green-500/20">
                                            Nhận thưởng
                                        </button>
                                    </div>
                                    {/* Daily Quote Widget */}
                                    <div className="bg-gradient-to-r from-primary to-blue-600 p-5 rounded-xl shadow-lg text-white relative overflow-hidden">
                                        <div className="absolute -right-4 -bottom-4 opacity-20">
                                            <span className="material-symbols-outlined text-[100px]">
                                                format_quote
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium opacity-80 uppercase tracking-widest mb-2">
                                            Quote of the day
                                        </p>
                                        <p className="text-lg font-display italic font-medium leading-relaxed">
                                            "Practice makes perfect. Don't be afraid to make mistakes."
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Column 2: Main Charts & Heatmap (Span 5) */}
                            <div className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col gap-6">
                                {/* Heatmap Section */}
                                <div className="bg-white dark:bg-[#1e242b] p-6 rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold">Hoạt động năm nay</h3>
                                        <div className="flex gap-2 text-xs">
                                            <span className="text-text-secondary">Ít</span>
                                            <div className="flex gap-1">
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                            </div>
                                            <span className="text-text-secondary">Nhiều</span>
                                        </div>
                                    </div>
                                    {/* Custom Heatmap Grid simulation */}
                                    <div className="flex flex-col gap-1 overflow-x-auto pb-2">
                                        <div className="flex gap-1 min-w-[300px]">
                                            {/* Generating a grid of boxes to simulate heatmap contributions */}
                                            <div className="grid grid-rows-7 grid-flow-col gap-1 w-full">
                                                {/* Using a loop logic simulation with HTML copy-paste for visual effect */}
                                                {/* Week 1 */}
                                                <div
                                                    className="size-3 bg-[#283039] rounded-sm"
                                                    title="CN: 0 min"
                                                />
                                                <div
                                                    className="size-3 bg-primary/30 rounded-sm"
                                                    title="T2: 10 min"
                                                />
                                                <div
                                                    className="size-3 bg-[#283039] rounded-sm"
                                                    title="T3: 0 min"
                                                />
                                                <div
                                                    className="size-3 bg-primary rounded-sm"
                                                    title="T4: 45 min"
                                                />
                                                <div
                                                    className="size-3 bg-primary/60 rounded-sm"
                                                    title="T5: 25 min"
                                                />
                                                <div
                                                    className="size-3 bg-[#283039] rounded-sm"
                                                    title="T6: 0 min"
                                                />
                                                <div
                                                    className="size-3 bg-[#283039] rounded-sm"
                                                    title="T7: 0 min"
                                                />
                                                {/* Week 2 */}
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                {/* Week 3 */}
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                {/* Week 4 */}
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                {/* Week 5 */}
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                {/* Week 6 */}
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                {/* Week 7 */}
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                {/* Week 8 */}
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                {/* Week 9 */}
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                {/* Week 10 */}
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                {/* Week 11 */}
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                <div className="size-3 bg-[#283039] rounded-sm" />
                                                {/* Week 12 */}
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary/30 rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary rounded-sm" />
                                                <div className="size-3 bg-primary/60 rounded-sm border border-white" />{" "}
                                                {/* Today */}
                                                <div className="size-3 bg-[#283039]/50 rounded-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-secondary mt-3">
                                        Bạn đã học 320 phút trong tháng này, giỏi hơn 85% người dùng.
                                    </p>
                                </div>
                                {/* Skill Progress Charts */}
                                <div className="bg-white dark:bg-[#1e242b] p-6 rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm flex flex-col flex-1">
                                    <h3 className="text-lg font-bold mb-4">Kỹ năng</h3>
                                    <div className="flex-1 flex flex-col justify-end gap-5">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Từ vựng</span>
                                                <span className="font-bold">Level 12</span>
                                            </div>
                                            <div className="h-2 w-full bg-[#283039] rounded-full">
                                                <div className="h-full bg-blue-500 w-[80%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Phát âm</span>
                                                <span className="font-bold">Level 8</span>
                                            </div>
                                            <div className="h-2 w-full bg-[#283039] rounded-full">
                                                <div className="h-full bg-purple-500 w-[60%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Ngữ pháp</span>
                                                <span className="font-bold">Level 10</span>
                                            </div>
                                            <div className="h-2 w-full bg-[#283039] rounded-full">
                                                <div className="h-full bg-pink-500 w-[70%] rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-secondary">Lưu loát</span>
                                                <span className="font-bold">Level 14</span>
                                            </div>
                                            <div className="h-2 w-full bg-[#283039] rounded-full">
                                                <div className="h-full bg-accent-green w-[85%] rounded-full shadow-[0_0_10px_rgba(11,218,91,0.5)]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Column 3: Leaderboard (Span 3) */}
                            <div className="col-span-1 md:col-span-12 lg:col-span-3 flex flex-col h-full">
                                <div className="bg-white dark:bg-[#1e242b] rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm flex flex-col h-full overflow-hidden">
                                    <div className="p-5 border-b border-gray-200 dark:border-[#283039] flex justify-between items-center bg-[#252d38]">
                                        <h3 className="font-bold text-lg text-white">Bảng Xếp Hạng</h3>
                                        <div className="flex gap-1 text-xs font-bold text-white/70 bg-white/10 px-2 py-1 rounded">
                                            <span>Tuần này</span>
                                            <span className="material-symbols-outlined text-sm">
                                                expand_more
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col p-2 gap-1 overflow-y-auto max-h-[500px] flex-1">
                                        {/* Top 1 */}
                                        <div className="flex items-center gap-3 p-3 hover:bg-[#283039] rounded-lg transition-colors cursor-pointer">
                                            <div className="flex flex-col items-center justify-center min-w-[24px]">
                                                <span className="material-symbols-outlined text-yellow-400">
                                                    emoji_events
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <div
                                                    className="size-10 rounded-full bg-cover bg-center border-2 border-yellow-400"
                                                    data-alt="Avatar of top ranked user Minh Anh"
                                                    style={{
                                                        backgroundImage:
                                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBKMWvEh4u7B0BNuNrQXC0zEnujDVlBNVMcIGq-c3Jr8-AT06_JgLtb6qob0aWReMqMgz1j7NTnRyYpmklPTzlMyrJFUC11cpPvIdl4Hq5aIHNib57HMrrc8MyyBe9EZXeizhZ3jr6k-srlehTS330Pj20LFMn-rjgJ8GwSg2kYTfHklnRtv5O6NKGHIQ7jO3yfBPNL1uPmiGhTG5ChujPbwAC90F5RH1XqD6b_TN03aMbQVsGtDuNFSW3ff_L5dzJ3jOVKfcpaZPc")'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">Minh Anh</p>
                                                <p className="text-xs text-text-secondary">15,200 XP</p>
                                            </div>
                                        </div>
                                        {/* Top 2 */}
                                        <div className="flex items-center gap-3 p-3 hover:bg-[#283039] rounded-lg transition-colors cursor-pointer">
                                            <div className="flex flex-col items-center justify-center min-w-[24px]">
                                                <span className="font-bold text-gray-400 text-lg">2</span>
                                            </div>
                                            <div className="relative">
                                                <div
                                                    className="size-10 rounded-full bg-cover bg-center border-2 border-gray-400"
                                                    data-alt="Avatar of second ranked user Sarah Nguyen"
                                                    style={{
                                                        backgroundImage:
                                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCd5eaPvH575EY2WfQlOBWfPI8kw88EosOjXRel9ohf6iuEYRrcdRDqjN0CSmEqicXjOBFdINEaGzjKVeSadUL_RfZiZ7aVVjB1VenML0J2olTLBsKqZ7dl4APprR9Rk01mR4qebZKdhKDD4nx1Fmo1ApzAQnVIgTNp74YsvwxWfnYzMuhHK_E-YFOMghi3UxY2bJPwngbQYCSkIg9gVuQgsNoS9oWe0CkVsIOE3yWq04Sy6BMOJ9Fj-0SNIOcMMqumwYhEjFBLxJY")'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">Sarah Nguyen</p>
                                                <p className="text-xs text-text-secondary">14,850 XP</p>
                                            </div>
                                        </div>
                                        {/* Top 3 */}
                                        <div className="flex items-center gap-3 p-3 hover:bg-[#283039] rounded-lg transition-colors cursor-pointer">
                                            <div className="flex flex-col items-center justify-center min-w-[24px]">
                                                <span className="font-bold text-orange-700 text-lg">3</span>
                                            </div>
                                            <div className="relative">
                                                <div
                                                    className="size-10 rounded-full bg-cover bg-center border-2 border-orange-700"
                                                    data-alt="Avatar of third ranked user Tuan Pham"
                                                    style={{
                                                        backgroundImage:
                                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQCmDOIMM--cy9JDl7SjXoCZNY9fhRiUUIdwiIqedRgwvJDt8Xm5j2Zl-BzOCyduxWGt50IIIyar9WKBLNpIkk0JgcpttbydvDlgrScSLiAbwxWn_rb_ztESBRRF_u4fVC2kXuC4cvKvnG_t4lFDNbBHbcoKDEwPCC_xYiD2l_RbFUa1bDEiiKbd6Pc0RjYapUYoy2ovO14sg3-vtBFS_MygUOlJKggn3R7FiciZpdnjCn9LzKlBNSx5OK_q_pifiYvWsFBNJWKGU")'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">Tuấn Phạm</p>
                                                <p className="text-xs text-text-secondary">13,200 XP</p>
                                            </div>
                                        </div>
                                        <div className="h-px w-full bg-[#283039] my-1" />
                                        {/* User Rank */}
                                        <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                                            <div className="flex flex-col items-center justify-center min-w-[24px]">
                                                <span className="font-bold text-primary text-lg">14</span>
                                            </div>
                                            <div className="relative">
                                                <div
                                                    className="size-10 rounded-full bg-cover bg-center border-2 border-primary"
                                                    data-alt="Your avatar"
                                                    style={{
                                                        backgroundImage:
                                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAM5tdb0ZxzrTqYO_JBnM23tMWSr0jyYTOMg63K-ok6uvhg2O9oUW7xiJDFNu1tbfYzalK6bqhhONkgddNQhaPlobOFpiRmmQp6-WhQ-qar9-ok0OeZjLapsLoJW2oqpICjovGAeO_PNXNzEPxkqrPygwCgDprK754LNrG6MygapSKHPcdoKqc-wJ-d1T8WdooRmezHog9hX91sJqmHbJ07dsdVfEZoLpBe7T5yK03b6hNcBcSMkspI6hmJ6qEXGfvn__SE_Es7r4A")'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-primary">Bạn</p>
                                                <p className="text-xs text-text-secondary">12,450 XP</p>
                                            </div>
                                            <span className="material-symbols-outlined text-accent-green text-sm">
                                                arrow_upward
                                            </span>
                                        </div>
                                        {/* Others */}
                                        <div className="flex items-center gap-3 p-3 hover:bg-[#283039] rounded-lg transition-colors opacity-60">
                                            <div className="flex flex-col items-center justify-center min-w-[24px]">
                                                <span className="font-bold text-gray-500 text-lg">15</span>
                                            </div>
                                            <div className="relative">
                                                <div
                                                    className="size-10 rounded-full bg-cover bg-center bg-gray-600"
                                                    data-alt="Avatar of user rank 15"
                                                    style={{
                                                        backgroundImage:
                                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAI3FhM900cJzh6LJOHs1M6WCSOgTwYseHxu3HpqPF8UuXTUbmLDZdUoRJBWLJh2QDIQZ_QwgXfyrPoUUaphjk8JiuXPifZntUfm4_X37AHo4HI0WgRwq7GtX8y7hiouVLOWmSspDPXBRpKVZMB0DW1xcn9JRyxrG4sjCBBxAahCYQM8lc6_K6Wxby0oTMkwRUHl3vSRhB1DL3VPP4j2vjYq-dW9c8V5kTWVOEEzAe4Xa7a5TVo2vlst8QK2lA3-bOpLRuJPvVDo0A")'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">Linh Chi</p>
                                                <p className="text-xs text-text-secondary">12,100 XP</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-[#283039] bg-[#252d38] text-center">
                                        <a
                                            className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-wide"
                                            href="#"
                                        >
                                            Xem toàn bộ bảng xếp hạng
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Badge Collection Section */}
                        <div className="flex flex-col gap-6 pt-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold leading-tight">
                                    Bộ sưu tập huy hiệu
                                </h2>
                                <button className="text-sm font-medium text-primary hover:underline">
                                    Xem tất cả (20)
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {/* Earned Badge 1 */}
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#1e242b] border border-primary/30 shadow-[0_0_15px_rgba(43,140,238,0.1)] hover:transform hover:-translate-y-1 transition-transform cursor-pointer group">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">
                                            bolt
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                                            Tốc độ ánh sáng
                                        </p>
                                        <p className="text-[10px] text-text-secondary mt-1">
                                            Hoàn thành bài học dưới 3 phút
                                        </p>
                                    </div>
                                </div>
                                {/* Earned Badge 2 */}
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#1e242b] border border-primary/30 shadow-[0_0_15px_rgba(43,140,238,0.1)] hover:transform hover:-translate-y-1 transition-transform cursor-pointer group">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">
                                            forum
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                                            Nhà hùng biện
                                        </p>
                                        <p className="text-[10px] text-text-secondary mt-1">
                                            Luyện nói 500 phút
                                        </p>
                                    </div>
                                </div>
                                {/* Earned Badge 3 */}
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#1e242b] border border-primary/30 shadow-[0_0_15px_rgba(43,140,238,0.1)] hover:transform hover:-translate-y-1 transition-transform cursor-pointer group">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">
                                            calendar_month
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                                            Chăm chỉ
                                        </p>
                                        <p className="text-[10px] text-text-secondary mt-1">
                                            Chuỗi 30 ngày
                                        </p>
                                    </div>
                                </div>
                                {/* Locked Badge 1 */}
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#1a1f26] border border-[#283039] opacity-70 cursor-not-allowed">
                                    <div className="size-16 rounded-full bg-[#283039] flex items-center justify-center grayscale">
                                        <span className="material-symbols-outlined text-gray-500 text-3xl">
                                            psychology
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-gray-500">Bậc thầy AI</p>
                                        <p className="text-[10px] text-gray-600 mt-1">
                                            Đánh bại AI Debate Mode
                                        </p>
                                    </div>
                                </div>
                                {/* Locked Badge 2 */}
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#1a1f26] border border-[#283039] opacity-70 cursor-not-allowed">
                                    <div className="size-16 rounded-full bg-[#283039] flex items-center justify-center grayscale">
                                        <span className="material-symbols-outlined text-gray-500 text-3xl">
                                            group
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-gray-500">Người cố vấn</p>
                                        <p className="text-[10px] text-gray-600 mt-1">
                                            Giúp đỡ 10 học viên mới
                                        </p>
                                    </div>
                                </div>
                                {/* Locked Badge 3 */}
                                <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#1a1f26] border border-[#283039] opacity-70 cursor-not-allowed">
                                    <div className="size-16 rounded-full bg-[#283039] flex items-center justify-center grayscale">
                                        <span className="material-symbols-outlined text-gray-500 text-3xl">
                                            school
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-gray-500">Thần đồng</p>
                                        <p className="text-[10px] text-gray-600 mt-1">Đạt Level 20</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

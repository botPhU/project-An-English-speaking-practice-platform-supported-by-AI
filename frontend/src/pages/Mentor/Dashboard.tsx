import React, { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { mentorService } from '../../services/mentorService';

interface DashboardStats {
    label: string;
    value: string;
    icon: string;
    change: string;
    up: boolean;
}

interface UpcomingSession {
    id?: number;
    learner: string;
    topic: string;
    time: string;
    level: string;
    avatar: string;
}

interface RecentFeedback {
    id?: number;
    learner: string;
    type: string;
    issue: string;
    status: 'pending' | 'reviewed';
}

export default function MentorDashboard() {
    const [stats, setStats] = useState<DashboardStats[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
    const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // TODO: Get mentor ID from auth context
    const mentorId = 1;

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await mentorService.getDashboard(mentorId);
            const data = response.data;

            // Map stats from API
            setStats([
                {
                    label: 'Học viên đang hướng dẫn',
                    value: data.total_learners?.toString() || '24',
                    icon: 'school',
                    change: data.learners_change || '+3 tuần này',
                    up: true
                },
                {
                    label: 'Phiên trong tuần',
                    value: data.sessions_this_week?.toString() || '38',
                    icon: 'event',
                    change: data.sessions_today ? `${data.sessions_today} hôm nay` : '12 hôm nay',
                    up: true
                },
                {
                    label: 'Đánh giá trung bình',
                    value: data.avg_rating?.toString() || '4.9',
                    icon: 'star',
                    change: '⭐ xuất sắc',
                    up: true
                },
                {
                    label: 'Giờ hướng dẫn',
                    value: data.hours_this_month?.toString() || '156',
                    icon: 'schedule',
                    change: 'Tháng này',
                    up: true
                },
            ]);

            // Map sessions
            if (data.upcoming_sessions) {
                setUpcomingSessions(data.upcoming_sessions.map((s: any) => ({
                    id: s.id,
                    learner: s.learner_name || s.learner,
                    topic: s.topic,
                    time: s.time || s.scheduled_time,
                    level: s.level || 'Intermediate',
                    avatar: s.avatar || s.learner_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 3)
                })));
            }

            // Map feedback
            if (data.recent_feedback) {
                setRecentFeedback(data.recent_feedback.map((f: any) => ({
                    id: f.id,
                    learner: f.learner_name || f.learner,
                    type: f.type || f.feedback_type,
                    issue: f.issue || f.description,
                    status: f.status || 'pending'
                })));
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching mentor dashboard:', err);
            setError('Không thể tải dữ liệu dashboard');

            // Fallback data
            setStats([
                { label: 'Học viên đang hướng dẫn', value: '24', icon: 'school', change: '+3 tuần này', up: true },
                { label: 'Phiên trong tuần', value: '38', icon: 'event', change: '12 hôm nay', up: true },
                { label: 'Đánh giá trung bình', value: '4.9', icon: 'star', change: '⭐ xuất sắc', up: true },
                { label: 'Giờ hướng dẫn', value: '156', icon: 'schedule', change: 'Tháng này', up: true },
            ]);
            setUpcomingSessions([
                { learner: 'Nguyễn Văn An', topic: 'IELTS Speaking Part 2', time: '09:00', level: 'Intermediate', avatar: 'NVA' },
                { learner: 'Trần Thị Bình', topic: 'Pronunciation Practice', time: '10:30', level: 'Beginner', avatar: 'TTB' },
                { learner: 'Lê Hoàng Cường', topic: 'Business English', time: '14:00', level: 'Advanced', avatar: 'LHC' },
                { learner: 'Phạm Minh Dương', topic: 'Grammar Review', time: '15:30', level: 'Intermediate', avatar: 'PMD' },
            ]);
            setRecentFeedback([
                { learner: 'Nguyễn Văn An', type: 'Pronunciation', issue: 'Âm /θ/ và /ð/ cần luyện thêm', status: 'pending' },
                { learner: 'Trần Thị Bình', type: 'Grammar', issue: 'Sử dụng thì hiện tại hoàn thành', status: 'reviewed' },
                { learner: 'Lê Hoàng Cường', type: 'Vocabulary', issue: 'Collocation với "make" và "do"', status: 'pending' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MentorLayout
            title="Tổng quan"
            icon="dashboard"
            actions={
                <button className="hidden lg:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                    <span className="truncate">Tạo phiên mới</span>
                </button>
            }
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30">
                                <div className="h-4 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                <div className="h-9 w-16 bg-[#3e4854] animate-pulse rounded"></div>
                                <div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div>
                            </div>
                        ))
                    ) : (
                        stats.map((stat, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-between gap-2 rounded-xl p-5 bg-[#283039] border border-[#3e4854]/30 hover:border-[#3e4854] transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-[#9dabb9] text-sm font-medium">{stat.label}</p>
                                    <span className="material-symbols-outlined text-primary text-xl">{stat.icon}</span>
                                </div>
                                <div>
                                    <p className="text-white text-3xl font-bold leading-tight">{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[#0bda5b] text-base">trending_up</span>
                                        <p className="text-[#0bda5b] text-xs font-medium leading-normal">{stat.change}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Sessions */}
                    <div className="lg:col-span-2 flex flex-col rounded-xl bg-[#283039] border border-[#3e4854]/30">
                        <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                            <div>
                                <h3 className="text-white text-lg font-bold">Phiên hôm nay</h3>
                                <p className="text-[#9dabb9] text-sm">Lịch học sắp tới</p>
                            </div>
                            <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                                Xem tất cả →
                            </button>
                        </div>
                        <div className="divide-y divide-[#3e4854]/30">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-[#3e4854] animate-pulse"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                                <div className="h-3 w-40 bg-[#3e4854] animate-pulse rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : upcomingSessions.length === 0 ? (
                                <div className="p-8 text-center text-[#9dabb9]">Không có phiên học nào hôm nay</div>
                            ) : (
                                upcomingSessions.map((session, index) => (
                                    <div key={session.id || index} className="flex items-center justify-between p-5 hover:bg-[#3e4854]/20 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                {session.avatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-primary transition-colors">{session.learner}</p>
                                                <p className="text-sm text-[#9dabb9]">{session.topic}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${session.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                                session.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {session.level}
                                            </span>
                                            <div className="text-right">
                                                <p className="font-bold text-primary">{session.time}</p>
                                                <p className="text-xs text-[#9dabb9]">Hôm nay</p>
                                            </div>
                                            <button className="opacity-0 group-hover:opacity-100 px-3 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
                                                Bắt đầu
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <div className="rounded-xl bg-primary p-5 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-3xl">lightbulb</span>
                                <div>
                                    <h3 className="font-bold">Mẹo hôm nay</h3>
                                    <p className="text-sm text-white/80">Nâng cao hiệu quả giảng dạy</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/90 leading-relaxed">
                                Sử dụng kỹ thuật "shadowing" để giúp học viên cải thiện phát âm tự nhiên hơn.
                                Cho học viên nghe và lặp lại ngay sau đó.
                            </p>
                        </div>

                        <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 p-5">
                            <h3 className="font-bold text-white mb-4">Hành động nhanh</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#3e4854]/30 hover:bg-[#3e4854]/50 text-[#9dabb9] hover:text-white transition-colors text-left">
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <span className="text-sm font-medium">Tạo bài tập mới</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#3e4854]/30 hover:bg-[#3e4854]/50 text-[#9dabb9] hover:text-white transition-colors text-left">
                                    <span className="material-symbols-outlined">upload_file</span>
                                    <span className="text-sm font-medium">Tải tài liệu lên</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#3e4854]/30 hover:bg-[#3e4854]/50 text-[#9dabb9] hover:text-white transition-colors text-left">
                                    <span className="material-symbols-outlined">rate_review</span>
                                    <span className="text-sm font-medium">Gửi phản hồi</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Feedback */}
                <div className="rounded-xl bg-[#283039] border border-[#3e4854]/30 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-[#3e4854]/30">
                        <div>
                            <h3 className="text-lg font-bold text-white">Phản hồi gần đây</h3>
                            <p className="text-sm text-[#9dabb9]">Các lỗi cần được theo dõi</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] text-sm font-medium hover:bg-[#3e4854]/50 hover:text-white transition-colors">
                            Xem tất cả
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#3e4854]/20">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Học viên</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Loại lỗi</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Mô tả</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Trạng thái</th>
                                    <th className="text-left p-4 text-sm font-medium text-[#9dabb9]">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3e4854]/30">
                                {loading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="p-4"><div className="h-4 w-24 bg-[#3e4854] animate-pulse rounded"></div></td>
                                            <td className="p-4"><div className="h-6 w-20 bg-[#3e4854] animate-pulse rounded-full"></div></td>
                                            <td className="p-4"><div className="h-4 w-48 bg-[#3e4854] animate-pulse rounded"></div></td>
                                            <td className="p-4"><div className="h-6 w-16 bg-[#3e4854] animate-pulse rounded-full"></div></td>
                                            <td className="p-4"><div className="h-4 w-20 bg-[#3e4854] animate-pulse rounded"></div></td>
                                        </tr>
                                    ))
                                ) : recentFeedback.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-[#9dabb9]">Không có phản hồi gần đây</td>
                                    </tr>
                                ) : (
                                    recentFeedback.map((feedback, index) => (
                                        <tr key={feedback.id || index} className="hover:bg-[#3e4854]/10 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-white">{feedback.learner}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${feedback.type === 'Pronunciation' ? 'bg-purple-500/20 text-purple-400' :
                                                    feedback.type === 'Grammar' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {feedback.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[#9dabb9]">{feedback.issue}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${feedback.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {feedback.status === 'pending' ? 'Chờ xử lý' : 'Đã xem'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">
                                                    Xem chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

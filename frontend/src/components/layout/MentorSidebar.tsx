import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MENTOR_ROUTES, AUTH_ROUTES } from '../../routes/paths';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { name: 'Tổng quan', icon: 'dashboard', path: MENTOR_ROUTES.DASHBOARD, exact: true },
    { name: 'Tin nhắn', icon: 'chat', path: '/mentor/messages', exact: false },
    { name: 'Đánh giá học viên', icon: 'assessment', path: MENTOR_ROUTES.LEARNER_ASSESSMENT, exact: false },
    { name: 'Phản hồi & Đánh giá', icon: 'rate_review', path: MENTOR_ROUTES.FEEDBACK_SESSION, exact: false },
    { name: 'Tình huống thực tế', icon: 'theater_comedy', path: MENTOR_ROUTES.REAL_LIFE_SITUATIONS, exact: false },
    { name: 'Chủ đề hội thoại', icon: 'forum', path: MENTOR_ROUTES.CONVERSATION_TOPICS, exact: false },
    { name: 'Lỗi phát âm', icon: 'record_voice_over', path: MENTOR_ROUTES.PRONUNCIATION_ERRORS, exact: false },
    { name: 'Lỗi ngữ pháp', icon: 'spellcheck', path: MENTOR_ROUTES.GRAMMAR_ERRORS, exact: false },
    { name: 'Tài liệu', icon: 'folder_open', path: MENTOR_ROUTES.RESOURCES, exact: false },
    { name: 'Hồ sơ', icon: 'person', path: MENTOR_ROUTES.PROFILE, exact: false },
];

const MentorSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isNavActive = (path: string, exact: boolean) => {
        if (exact) {
            // Dashboard is active for /mentor, /mentor/, and /mentor/dashboard
            return location.pathname === path || location.pathname === '/mentor/' || location.pathname === '/mentor/dashboard';
        }
        return location.pathname === path || location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        navigate(AUTH_ROUTES.LOGIN);
    };

    return (
        <aside className="hidden lg:flex flex-col w-72 border-r border-border-dark bg-surface-dark/50 backdrop-blur-xl sticky top-0 h-screen">
            {/* Logo & Brand */}
            <div className="p-8">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="size-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white text-2xl">psychology</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">AESP</h1>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Trung tâm Mentor</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isNavActive(item.path, item.exact);
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${active
                                ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20 shadow-[0_0_20px_rgba(147,51,234,0.1)]'
                                : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-sm font-bold text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all group"
                >
                    <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">logout</span>
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
};

export default MentorSidebar;

import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { LEARNER_ROUTES } from '../routes/paths';

interface LearnerLayoutProps {
    children: ReactNode;
    title?: string;
}

const navItems = [
    { name: 'Tổng quan', icon: 'dashboard', path: LEARNER_ROUTES.DASHBOARD },
    { name: 'Lộ trình của tôi', icon: 'map', path: LEARNER_ROUTES.LEARNING_PATH },
    { name: 'Nhập vai AI', icon: 'smart_toy', path: LEARNER_ROUTES.SPEAKING_PRACTICE },
    { name: 'Thành tích', icon: 'military_tech', path: LEARNER_ROUTES.CHALLENGES },
    { name: 'Kết nối Cố vấn', icon: 'groups', path: '/learner/mentors' }, // Placeholder or update if available
    { name: 'Hồ sơ', icon: 'person', path: LEARNER_ROUTES.PROFILE },
];

export default function LearnerLayout({ children, title = 'AESP' }: LearnerLayoutProps) {
    return (
        <div className="flex min-h-screen bg-background-dark text-white font-sans selection:bg-primary/30">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-72 border-r border-border-dark bg-surface-dark/50 backdrop-blur-xl sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-white text-2xl">school</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">AESP</h1>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Trung tâm Học viên</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${isActive
                                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(43,140,238,0.1)]'
                                    : 'text-text-secondary hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 mt-auto">
                    <button className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-sm font-bold text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all group">
                        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">logout</span>
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-border-dark bg-surface-dark/30 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button className="size-10 rounded-lg hover:bg-white/5 flex items-center justify-center">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-lg font-bold">{title}</h2>
                    </div>

                    <div className="hidden md:flex items-center flex-1 max-w-xl bg-white/5 border border-border-dark rounded-xl px-4 py-2 mx-8 group focus-within:border-primary/50 transition-all">
                        <span className="material-symbols-outlined text-gray-500 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Tìm bài học, chủ đề..."
                            className="bg-transparent border-none outline-none flex-1 px-4 text-sm font-medium placeholder:text-gray-600"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative size-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-colors group">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">notifications</span>
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-[#111418]"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-border-dark cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold group-hover:text-primary transition-colors">Alex Nguyen</p>
                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-tighter">Level 12</p>
                            </div>
                            <div className="size-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden group-hover:scale-110 transition-transform">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 lg:p-12 w-full max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </main>
            </div>
        </div>
    );
}

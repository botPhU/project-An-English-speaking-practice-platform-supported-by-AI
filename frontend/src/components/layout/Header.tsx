import React from 'react';
import { Link } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

type RoleTheme = 'admin' | 'mentor' | 'learner';

interface HeaderProps {
    title: string;
    subtitle?: string;
    icon?: string;
    actions?: React.ReactNode;
    role?: RoleTheme;
    profilePath?: string;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    showSearch?: boolean;
}

const ROLE_COLORS: Record<RoleTheme, { icon: string; hover: string; border: string; gradient: string }> = {
    admin: {
        icon: 'text-blue-400',
        hover: 'hover:text-blue-400',
        border: 'border-blue-600',
        gradient: 'from-blue-600 to-blue-400'
    },
    mentor: {
        icon: 'text-purple-400',
        hover: 'hover:text-purple-400',
        border: 'border-purple-600',
        gradient: 'from-purple-600 to-purple-400'
    },
    learner: {
        icon: 'text-cyan-400',
        hover: 'hover:text-cyan-400',
        border: 'border-cyan-600',
        gradient: 'from-cyan-600 to-cyan-400'
    }
};

const ROLE_LABELS: Record<RoleTheme, string> = {
    admin: 'Quản trị viên',
    mentor: 'Mentor',
    learner: 'Học viên'
};

const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    icon = 'dashboard',
    actions,
    role = 'learner',
    profilePath = '/profile',
    searchPlaceholder = 'Tìm kiếm...',
    onSearch,
    showSearch = true
}) => {
    const { user } = useAuth();
    const colors = ROLE_COLORS[role];

    return (
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-6 lg:px-8 border-b border-border-dark bg-surface-dark/50 backdrop-blur-md sticky top-0 z-40">
            {/* Left: Mobile Menu + Title */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button className="lg:hidden size-10 rounded-lg hover:bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined">menu</span>
                </button>

                {/* Page Title */}
                <div className="hidden md:flex items-center gap-3">
                    <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${colors.icon}`}>
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </div>
                    <div>
                        <h2 className="text-base lg:text-lg font-bold leading-tight text-white">{title}</h2>
                        {subtitle && (
                            <p className="text-xs text-text-secondary hidden lg:block">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Mobile Title */}
                <h2 className="md:hidden text-lg font-bold text-white">{title}</h2>
            </div>

            {/* Center: Search */}
            {showSearch && (
                <div className="hidden md:flex items-center flex-1 max-w-md bg-white/5 border border-border-dark rounded-xl px-4 py-2 mx-4 lg:mx-8 group focus-within:border-primary/50 transition-all">
                    <span className="material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        onChange={(e) => onSearch?.(e.target.value)}
                        className="bg-transparent border-none outline-none flex-1 px-3 text-sm font-medium placeholder:text-text-secondary text-white"
                    />
                </div>
            )}

            {/* Right: Actions + Notifications + Profile */}
            <div className="flex items-center gap-3 md:gap-6">
                {/* Custom Actions */}
                {actions}

                {/* Notifications */}
                <NotificationDropdown />

                {/* User Profile */}
                <Link
                    to={profilePath}
                    className="flex items-center gap-3 pl-3 md:pl-6 border-l border-border-dark cursor-pointer group"
                >
                    <div className="text-right hidden sm:block">
                        <p className={`text-sm font-bold ${colors.hover} transition-colors`}>
                            {user?.name || 'User'}
                        </p>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-tighter">
                            {ROLE_LABELS[role]}
                        </p>
                    </div>
                    <div className={`size-10 rounded-full bg-gradient-to-br ${colors.gradient} p-0.5 group-hover:scale-110 transition-transform`}>
                        <div
                            className="size-full rounded-full bg-cover bg-center"
                            style={{
                                backgroundImage: user?.avatar
                                    ? `url("${user.avatar}")`
                                    : `url("https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}")`
                            }}
                        />
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Header;

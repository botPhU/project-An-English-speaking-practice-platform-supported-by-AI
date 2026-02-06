import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_ROUTES } from '../../routes/paths';

interface NavItem {
    path: string;
    icon: string;
    label: string;
}

const navItems: NavItem[] = [
    { path: ADMIN_ROUTES.DASHBOARD, icon: 'dashboard', label: 'Bảng điều khiển' },
    { path: ADMIN_ROUTES.USER_MANAGEMENT, icon: 'group', label: 'Quản lý người dùng' },
    { path: ADMIN_ROUTES.MENTOR_MANAGEMENT, icon: 'verified', label: 'Phê duyệt mentor' },
    { path: ADMIN_ROUTES.PACKAGE_MANAGEMENT, icon: 'inventory_2', label: 'Quản lý gói học' },
    { path: ADMIN_ROUTES.FEEDBACK_MODERATION, icon: 'chat_bubble', label: 'Kiểm duyệt nội dung' },
    { path: ADMIN_ROUTES.LEARNER_SUPPORT, icon: 'support_agent', label: 'Hỗ trợ người học' },
    { path: ADMIN_ROUTES.REPORTS, icon: 'analytics', label: 'Báo cáo & Phân tích' },
    { path: ADMIN_ROUTES.POLICY_MANAGEMENT, icon: 'policy', label: 'Quản lý chính sách' },
    { path: ADMIN_ROUTES.PROFILE, icon: 'account_circle', label: 'Hồ sơ cá nhân' },
];

const AdminSidebar: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path: string) => {
        if (path === ADMIN_ROUTES.DASHBOARD) {
            return location.pathname === path || location.pathname === '/admin/';
        }
        // For other paths, ensure we match the specific route or its sub-pages
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="hidden md:flex flex-col w-64 bg-[#111418] border-r border-[#283039] h-full shrink-0">
            <div className="flex flex-col h-full p-4">
                {/* Logo & Brand */}
                <div className="flex gap-3 mb-8 items-center">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 border border-[#283039] flex items-center justify-center bg-primary/20"
                    >
                        <span className="material-symbols-outlined text-primary text-xl">school</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-white text-base font-medium leading-normal truncate">
                            AESP Admin
                        </h1>
                        <p className="text-[#9dabb9] text-xs font-normal leading-normal truncate">
                            Quản trị hệ thống
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-primary/20 text-primary border border-primary/10'
                                : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium leading-normal">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-[#283039]">
                    <Link
                        to={ADMIN_ROUTES.SETTINGS}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9dabb9] hover:bg-[#283039] hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">settings</span>
                        <span className="text-sm font-medium leading-normal">Cài đặt hệ thống</span>
                    </Link>

                    {/* User Info */}
                    <div className="flex items-center gap-3 mt-4 px-3 pt-4 border-t border-[#283039]">
                        {user?.avatar ? (
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 border-2 border-[#283039]"
                                style={{ backgroundImage: `url("${user.avatar}")` }}
                            />
                        ) : (
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border-2 border-[#283039]">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                        )}
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
                            <p className="text-[#9dabb9] text-xs truncate">Quản trị viên</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;

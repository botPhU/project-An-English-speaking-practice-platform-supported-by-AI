import MentorSidebar from '../components/layout/MentorSidebar';
import NotificationDropdown from '../components/layout/NotificationDropdown';
import { Link } from 'react-router-dom';
import { MENTOR_ROUTES } from '../routes/paths';

interface MentorLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    icon?: string;
    actions?: React.ReactNode;
}

const MentorLayout: React.FC<MentorLayoutProps> = ({
    children,
    title,
    subtitle,
    icon = 'psychology',
    actions
}) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#111418] text-white">
            {/* Sidebar */}
            <MentorSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-[#283039] px-6 py-4 bg-[#111418]/95 backdrop-blur-sm z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <div className="md:hidden text-white cursor-pointer">
                            <span className="material-symbols-outlined">menu</span>
                        </div>

                        {/* Page Title */}
                        <div className="flex items-center gap-3 text-white">
                            <div className="size-8 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-2xl">{icon}</span>
                            </div>
                            <div>
                                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                                    {title}
                                </h2>
                                {subtitle && (
                                    <p className="text-[#9dabb9] text-xs">{subtitle}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#283039] border border-transparent focus-within:border-primary/50 transition-colors">
                                <div className="text-[#9dabb9] flex items-center justify-center pl-3">
                                    <span className="material-symbols-outlined text-xl">search</span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-[#9dabb9] px-3 text-sm font-normal leading-normal"
                                    placeholder="Tìm kiếm..."
                                />
                            </div>
                        </label>

                        {/* Custom Actions */}
                        {actions}

                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* User Avatar */}
                        <Link
                            to={MENTOR_ROUTES.PROFILE}
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#283039] cursor-pointer"
                            style={{
                                backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor")'
                            }}
                        />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MentorLayout;

import MentorSidebar from '../components/layout/MentorSidebar';
import NotificationDropdown from '../components/layout/NotificationDropdown';
import { useAuth } from '../context/AuthContext';

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
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen bg-background-dark text-white font-sans selection:bg-purple-600/30">
            {/* Sidebar */}
            <MentorSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                {/* Header - matching LearnerLayout style */}
                <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-border-dark bg-surface-dark/30 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button className="size-10 rounded-lg hover:bg-white/5 flex items-center justify-center">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>

                    {/* Page Title */}
                    <div className="hidden lg:flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-400 text-2xl">{icon}</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight">{title}</h2>
                            {subtitle && (
                                <p className="text-xs text-text-secondary">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    {/* Mobile Title */}
                    <div className="lg:hidden">
                        <h2 className="text-lg font-bold">{title}</h2>
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex items-center flex-1 max-w-md bg-white/5 border border-border-dark rounded-xl px-4 py-2 mx-8 group focus-within:border-purple-600/50 transition-all">
                        <span className="material-symbols-outlined text-gray-500 group-focus-within:text-purple-400 transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Tìm học viên, phiên học..."
                            className="bg-transparent border-none outline-none flex-1 px-4 text-sm font-medium placeholder:text-gray-600"
                        />
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center gap-6">
                        {/* Custom Actions */}
                        {actions}

                        {/* Notifications */}
                        <NotificationDropdown />

                        {/* User Profile */}
                        <div className="flex items-center gap-3 pl-6 border-l border-border-dark cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold group-hover:text-purple-400 transition-colors">{user?.name || 'Mentor'}</p>
                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-tighter">Mentor</p>
                            </div>
                            <div className="size-10 rounded-full bg-purple-600/20 border-2 border-purple-600 overflow-hidden group-hover:scale-110 transition-transform">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Mentor'}`} alt="Avatar" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-8 lg:p-12 w-full max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MentorLayout;

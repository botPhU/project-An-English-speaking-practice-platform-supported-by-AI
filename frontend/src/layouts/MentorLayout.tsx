import MentorSidebar from '../components/layout/MentorSidebar';
import Header from '../components/layout/Header';
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
        <div className="flex min-h-screen bg-background-dark text-white font-sans selection:bg-purple-600/30">
            {/* Sidebar */}
            <MentorSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                {/* Unified Header */}
                <Header
                    title={title}
                    subtitle={subtitle}
                    icon={icon}
                    actions={actions}
                    role="mentor"
                    profilePath={MENTOR_ROUTES.PROFILE}
                    searchPlaceholder="Tìm học viên, phiên học..."
                />

                {/* Page Content */}
                <main className="p-4 md:p-8 lg:p-12 w-full max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MentorLayout;

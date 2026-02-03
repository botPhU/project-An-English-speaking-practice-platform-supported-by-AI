import AdminSidebar from './AdminSidebar';
import Header from './Header';
import { ADMIN_ROUTES } from '../../routes/paths';

interface AdminLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    icon?: string;
    actions?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    children,
    title,
    subtitle,
    icon = 'monitor_heart',
    actions
}) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#111418] text-white">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Unified Header */}
                <Header
                    title={title}
                    subtitle={subtitle}
                    icon={icon}
                    actions={actions}
                    role="admin"
                    profilePath={ADMIN_ROUTES.PROFILE}
                    searchPlaceholder="Tìm kiếm..."
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

import React from 'react';
import AdminSidebar from './AdminSidebar';

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
                        <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg size-10 bg-[#283039] text-white hover:bg-[#3b4754] transition-colors relative">
                            <span className="material-symbols-outlined text-xl">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-[#283039]" />
                        </button>

                        {/* User Avatar */}
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-[#283039] cursor-pointer"
                            style={{
                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQhMo4J4VgtN7o9g7aUrJGV74X0ke8FKm-tZmaqrZTGQbAXw3dogSwXCA-rv_tsjXL12P9lRl0mj3qRYrd73mw7KJycrdN8M3u-lI2MsLZZNBMimAQr4BRE6jsSVOB_DD1nOD-8iIkCn2SD3SlgbfTFv0FCmeYnSRAWabCPp49CApY2OCoRuH95dvFnLXzHbF6JiFaiTqGTn9Sj5J2v8kiBkVomQvcX-xRLyWJVJJy5d4I9HJBsYT-_kwUUXywLTyvRZMZaRpIpkE")'
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

export default AdminLayout;

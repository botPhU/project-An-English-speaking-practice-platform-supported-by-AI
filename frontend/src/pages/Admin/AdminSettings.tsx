import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import SettingsGeneral from '../../components/admin/settings/SettingsGeneral';
import SettingsSecurity from '../../components/admin/settings/SettingsSecurity';
import SettingsIntegrations from '../../components/admin/settings/SettingsIntegrations';
import SettingsPerformance from '../../components/admin/settings/SettingsPerformance';

const AdminSettings: React.FC = () => {
    return (
        <AdminLayout
            title="Cấu Hình Hệ Thống"
            subtitle="Quản lý các thiết lập toàn cầu cho nền tảng AESP."
            icon="settings"
            actions={
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all shadow-lg shadow-primary/20">
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">save</span>
                        Lưu thay đổi
                    </span>
                </button>
            }
        >
            <div className="layout-content-container flex flex-col max-w-[1000px] mx-auto flex-1 gap-6">
                {/* Tabs Navigation */}
                <div className="">
                    <div className="flex border-b border-[#3b4754] gap-6 overflow-x-auto no-scrollbar">
                        <a
                            className="flex items-center gap-2 border-b-[3px] border-b-primary text-white pb-3 pt-2 whitespace-nowrap px-1"
                            href="#general"
                        >
                            <span className="material-symbols-outlined text-[20px] fill">tune</span>
                            <p className="text-sm font-bold leading-normal">Tổng quan</p>
                        </a>
                        <a
                            className="flex items-center gap-2 border-b-[3px] border-b-transparent text-[#9dabb9] hover:text-white pb-3 pt-2 whitespace-nowrap px-1 transition-colors"
                            href="#security"
                        >
                            <span className="material-symbols-outlined text-[20px]">security</span>
                            <p className="text-sm font-bold leading-normal">Bảo mật</p>
                        </a>
                        <a
                            className="flex items-center gap-2 border-b-[3px] border-b-transparent text-[#9dabb9] hover:text-white pb-3 pt-2 whitespace-nowrap px-1 transition-colors"
                            href="#integration"
                        >
                            <span className="material-symbols-outlined text-[20px]">hub</span>
                            <p className="text-sm font-bold leading-normal">Tích hợp</p>
                        </a>
                        <a
                            className="flex items-center gap-2 border-b-[3px] border-b-transparent text-[#9dabb9] hover:text-white pb-3 pt-2 whitespace-nowrap px-1 transition-colors"
                            href="#performance"
                        >
                            <span className="material-symbols-outlined text-[20px]">speed</span>
                            <p className="text-sm font-bold leading-normal">Hiệu suất</p>
                        </a>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 gap-6 pb-12">
                    <SettingsGeneral />
                    <SettingsSecurity />
                    <SettingsIntegrations />
                    <SettingsPerformance />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;

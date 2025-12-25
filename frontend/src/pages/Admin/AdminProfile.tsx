import AdminLayout from '../../components/layout/AdminLayout';
import ProfileIdentityCard from '../../components/admin/profile/ProfileIdentityCard';
import ProfileBasicInfo from '../../components/admin/profile/ProfileBasicInfo';
import ProfileSecurity from '../../components/admin/profile/ProfileSecurity';

const AdminProfile = () => {
    return (
        <AdminLayout
            title="Hồ Sơ Quản Trị Viên"
            subtitle="Quản lý thông tin cá nhân và cài đặt bảo mật cho tài khoản quản trị của bạn."
            icon="person"
            actions={
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#3b4754] text-slate-700 dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#283039] transition-colors">
                        Hủy bỏ
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Lưu thay đổi
                    </button>
                </div>
            }
        >
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Col: Identity Card */}
                    <ProfileIdentityCard />

                    {/* Right Col: Forms */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        <ProfileBasicInfo />
                        <ProfileSecurity />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;

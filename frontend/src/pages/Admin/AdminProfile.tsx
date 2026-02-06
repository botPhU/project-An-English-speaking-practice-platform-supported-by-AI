import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { userProfileService } from '../../services/userProfileService';
import type { ProfileData, UserProfile } from '../../services/userProfileService';

const AdminProfile = () => {
    useAuth(); // Just to verify auth
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        bio: '',
        address: '',
        city: '',
        date_of_birth: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Load profile on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await userProfileService.getProfile();
                const profileData = response.data;
                setProfile(profileData);

                // Split full_name into first and last name
                const nameParts = (profileData.full_name || '').split(' ');
                const lastName = nameParts.pop() || '';
                const firstName = nameParts.join(' ') || '';

                setFormData({
                    first_name: firstName,
                    last_name: lastName,
                    email: profileData.email || '',
                    phone_number: profileData.phone_number || '',
                    bio: profileData.bio || '',
                    address: profileData.address || '',
                    city: profileData.city || '',
                    date_of_birth: profileData.date_of_birth || ''
                });
            } catch (error) {
                console.error('Error loading profile:', error);
                setMessage({ type: 'error', text: 'Không thể tải thông tin hồ sơ' });
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle password input change
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // Save profile
    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const fullName = `${formData.first_name} ${formData.last_name}`.trim();
            const updateData: ProfileData = {
                full_name: fullName,
                phone_number: formData.phone_number,
                date_of_birth: formData.date_of_birth || '2000-01-01',
                bio: formData.bio,
                address: formData.address,
                city: formData.city
            };

            const response = await userProfileService.updateProfile(updateData);

            if (response.data.user) {
                setProfile(response.data.user);
            }

            setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Có lỗi xảy ra khi cập nhật thông tin' });
        } finally {
            setSaving(false);
        }
    };

    // Cancel changes
    const handleCancel = () => {
        if (profile) {
            const nameParts = (profile.full_name || '').split(' ');
            const lastName = nameParts.pop() || '';
            const firstName = nameParts.join(' ') || '';

            setFormData({
                first_name: firstName,
                last_name: lastName,
                email: profile.email || '',
                phone_number: profile.phone_number || '',
                bio: profile.bio || '',
                address: profile.address || '',
                city: profile.city || '',
                date_of_birth: profile.date_of_birth || ''
            });
        }
        setMessage(null);
    };

    if (loading) {
        return (
            <AdminLayout title="Hồ Sơ Quản Trị Viên" subtitle="Đang tải..." icon="person">
                <div className="flex items-center justify-center h-64">
                    <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout
            title="Hồ Sơ Quản Trị Viên"
            subtitle="Quản lý thông tin cá nhân và cài đặt bảo mật cho tài khoản quản trị của bạn."
            icon="person"
            actions={
                <div className="flex gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#3b4754] text-slate-700 dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-[#283039] transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? (
                            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined text-[18px]">save</span>
                        )}
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            }
        >
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                {/* Success/Error Message */}
                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        <span className="material-symbols-outlined">
                            {message.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Col: Identity Card */}
                    <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.3),transparent_50%)]" />
                        <div className="relative z-10">
                            <div className="flex flex-col items-center mb-6">
                                <div className="size-28 rounded-full bg-primary/30 flex items-center justify-center mb-4 border-4 border-primary/50 relative group">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="size-28 rounded-full object-cover" />
                                    ) : (
                                        <span className="text-5xl font-bold text-primary">
                                            {formData.first_name?.charAt(0) || 'A'}
                                        </span>
                                    )}
                                    <button className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white">photo_camera</span>
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold">{profile?.user_name || 'admin'}</h2>
                                <p className="text-blue-300 text-sm">Quản Trị Viên Hệ Thống</p>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-300">mail</span>
                                    <span>{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-300">call</span>
                                    <span>{formData.phone_number || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-300">location_on</span>
                                    <span>{formData.city || formData.address || 'Chưa cập nhật'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                            <h4 className="font-bold text-white/80">Trạng thái tài khoản</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-white/60">Đăng nhập lần cuối</span>
                                <span className="text-white text-right">Hôm nay</span>
                                <span className="text-white/60">Tình trạng</span>
                                <span className="text-green-400 text-right flex items-center justify-end gap-1">
                                    <span className="size-2 rounded-full bg-green-400 animate-pulse"></span>
                                    Hoạt động
                                </span>
                                <span className="text-white/60">Quyền hạn</span>
                                <span className="text-yellow-400 text-right font-medium">Toàn quyền (Super)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Forms */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        {/* Basic Info Form */}
                        <div className="bg-white dark:bg-[#1c2127] rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#283039]">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Thông tin cơ bản</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Họ</span>
                                    <input
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:border-primary transition-all"
                                        type="text"
                                        placeholder="Nhập họ"
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Tên</span>
                                    <input
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:border-primary transition-all"
                                        type="text"
                                        placeholder="Nhập tên"
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Email</span>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">mail</span>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white pl-11 pr-4 py-2.5 outline-none focus:border-primary transition-all"
                                            type="email"
                                            placeholder="Nhập email"
                                            disabled
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Số điện thoại</span>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">call</span>
                                        <input
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white pl-11 pr-4 py-2.5 outline-none focus:border-primary transition-all"
                                            type="tel"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col gap-2 md:col-span-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Tiểu sử / Ghi chú</span>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:border-primary transition-all resize-none"
                                        rows={3}
                                        placeholder="Giới thiệu về bản thân..."
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Security Form */}
                        <div className="bg-white dark:bg-[#1c2127] rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#283039]">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bảo mật & Đăng nhập</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="material-symbols-outlined text-primary">lock</span>
                                    <span className="font-medium text-slate-900 dark:text-white">Đổi mật khẩu</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Mật khẩu hiện tại</span>
                                        <input
                                            name="current_password"
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:border-primary transition-all"
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Mật khẩu mới</span>
                                        <input
                                            name="new_password"
                                            value={passwordData.new_password}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:border-primary transition-all"
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Xác nhận mật khẩu</span>
                                        <input
                                            name="confirm_password"
                                            value={passwordData.confirm_password}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:border-primary transition-all"
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;

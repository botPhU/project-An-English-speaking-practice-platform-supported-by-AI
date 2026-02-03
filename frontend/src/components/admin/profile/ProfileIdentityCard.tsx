import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { AvatarUpload } from '../../common';
import { fileService } from '../../../services/fileService';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    location: string;
    avatar: string | null;
    role: string;
    lastLogin: string;
    status: 'active' | 'inactive';
    permissions: string;
}

const ProfileIdentityCard: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState<ProfileData>({
        name: user?.name || 'Admin',
        email: user?.email || 'admin@aesp.vn',
        phone: '+84 909 123 456',
        location: 'Hồ Chí Minh, Việt Nam',
        avatar: user?.avatar || null,
        role: 'Quản Trị Viên Hệ Thống',
        lastLogin: 'Hôm nay, ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'active',
        permissions: 'Toàn quyền (Super)'
    });
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setProfile(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
                avatar: user.avatar || prev.avatar
            }));
        }
    }, [user]);

    const handleAvatarUpload = async (file: File): Promise<string> => {
        setUploadError(null);
        try {
            const userId = user?.id ? parseInt(user.id, 10) : undefined;
            const result = await fileService.uploadAvatar(file, userId);
            // Update local state and auth context
            setProfile(prev => ({ ...prev, avatar: result.url }));
            updateUser({ avatar: result.url });
            return result.url;
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Lỗi khi upload ảnh';
            setUploadError(errorMessage);
            throw error;
        }
    };

    return (
        <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#1c2127] rounded-xl border border-gray-200 dark:border-[#283039] overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-[#3b82f6] relative"></div>
                <div className="px-6 pb-6 relative">
                    <div className="relative -mt-12 mb-4 w-fit">
                        <AvatarUpload
                            currentAvatar={profile.avatar || undefined}
                            name={profile.name}
                            size="lg"
                            onUpload={handleAvatarUpload}
                            onError={(error) => setUploadError(error)}
                        />
                    </div>

                    {uploadError && (
                        <p className="text-red-500 text-xs mb-2">{uploadError}</p>
                    )}

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h3>
                    <p className="text-[#3b82f6] font-medium text-sm mb-4">{profile.role}</p>
                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-[#283039]">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-[#9dabb9]">
                            <span className="material-symbols-outlined text-[20px]">mail</span>
                            <span className="text-sm">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-[#9dabb9]">
                            <span className="material-symbols-outlined text-[20px]">call</span>
                            <span className="text-sm">{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-[#9dabb9]">
                            <span className="material-symbols-outlined text-[20px]">location_on</span>
                            <span className="text-sm">{profile.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats / Status */}
            <div className="bg-white dark:bg-[#1c2127] rounded-xl border border-gray-200 dark:border-[#283039] p-6 shadow-sm">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                    Trạng thái tài khoản
                </h4>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-[#9dabb9]">Đăng nhập lần cuối</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {profile.lastLogin}
                    </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-[#9dabb9]">Tình trạng</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${profile.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                        }`}>
                        <span className={`size-1.5 rounded-full ${profile.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                        {profile.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-[#9dabb9]">Quyền hạn</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {profile.permissions}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileIdentityCard;

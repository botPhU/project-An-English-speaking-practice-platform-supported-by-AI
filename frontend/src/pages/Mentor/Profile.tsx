import { useState, useEffect } from 'react';
import MentorLayout from '../../layouts/MentorLayout';
import { mentorService } from '../../services/mentorService';
import { useAuth } from '../../context/AuthContext';
import { AvatarUpload } from '../../components/common';
import { fileService } from '../../services/fileService';

interface MentorProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar?: string;
    specialties: string[];
    certifications: string;
    experience: string;
    stats: {
        currentLearners: number;
        totalSessions: number;
        avgRating: number;
        status: 'active' | 'inactive';
    };
}

export default function MentorProfile() {
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState<MentorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [, setError] = useState<string | null>(null);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');

    // Get mentor ID from auth context
    const mentorId = Number(authUser?.id) || 0;

    useEffect(() => {
        if (mentorId > 0) {
            fetchProfile();
        }
    }, [mentorId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await mentorService.getProfile(mentorId);
            const data = response.data;

            const mappedProfile: MentorProfile = {
                id: data.id || mentorId,
                firstName: data.first_name || data.firstName || 'Nguyễn Tuấn',
                lastName: data.last_name || data.lastName || 'Mentor',
                email: data.email || 'mentor.tuan@aesp.vn',
                phone: data.phone || '+84 912 345 678',
                location: data.location || 'Hà Nội, Việt Nam',
                bio: data.bio || 'Chuyên gia IELTS với 8 năm kinh nghiệm giảng dạy.',
                avatar: data.avatar || data.profile_picture,
                specialties: data.specialties || ['IELTS Speaking', 'Pronunciation', 'Business English'],
                certifications: data.certifications || 'IELTS Band 8.5, TESOL Certificate',
                experience: data.experience || '8 năm giảng dạy',
                stats: {
                    currentLearners: data.stats?.current_learners || 24,
                    totalSessions: data.stats?.total_sessions || 456,
                    avgRating: data.stats?.avg_rating || 4.9,
                    status: data.stats?.status || 'active'
                }
            };

            setProfile(mappedProfile);
            setFirstName(mappedProfile.firstName);
            setLastName(mappedProfile.lastName);
            setEmail(mappedProfile.email);
            setPhone(mappedProfile.phone);
            setBio(mappedProfile.bio);

            setError(null);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Không thể tải thông tin hồ sơ');

            // Fallback
            const fallbackProfile: MentorProfile = {
                id: mentorId,
                firstName: 'Nguyễn Tuấn',
                lastName: 'Mentor',
                email: 'mentor.tuan@aesp.vn',
                phone: '+84 912 345 678',
                location: 'Hà Nội, Việt Nam',
                bio: 'Chuyên gia IELTS với 8 năm kinh nghiệm giảng dạy. Tốt nghiệp Đại học Ngoại ngữ, band 8.5 IELTS. Đam mê giúp học viên cải thiện kỹ năng speaking.',
                specialties: ['IELTS Speaking', 'Pronunciation', 'Business English', 'Grammar', 'Vocabulary'],
                certifications: 'IELTS Band 8.5, TESOL Certificate',
                experience: '8 năm giảng dạy',
                stats: {
                    currentLearners: 24,
                    totalSessions: 456,
                    avgRating: 4.9,
                    status: 'active'
                }
            };
            setProfile(fallbackProfile);
            setFirstName(fallbackProfile.firstName);
            setLastName(fallbackProfile.lastName);
            setEmail(fallbackProfile.email);
            setPhone(fallbackProfile.phone);
            setBio(fallbackProfile.bio);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await mentorService.updateProfile(mentorId, {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                bio
            });
        } catch (err) {
            console.error('Error saving profile:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <MentorLayout
            title="Hồ Sơ Mentor"
            subtitle="Quản lý thông tin cá nhân và chuyên môn"
            icon="person"
            actions={
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] text-sm font-bold hover:bg-[#3e4854]/50 transition-colors">
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">{saving ? 'sync' : 'save'}</span>
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            }
        >
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Col: Identity Card */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        {/* Profile Card */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-primary to-blue-400 relative"></div>
                            <div className="px-6 pb-6 relative">
                                <div className="relative -mt-12 mb-4 w-fit">
                                    {loading ? (
                                        <div className="size-24 rounded-full bg-[#3e4854] animate-pulse border-4 border-[#283039]"></div>
                                    ) : (
                                        <AvatarUpload
                                            currentAvatar={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor`}
                                            name={`${profile?.firstName || ''} ${profile?.lastName || ''}`}
                                            size="lg"
                                            onUpload={async (file) => {
                                                const result = await fileService.uploadAvatar(file, mentorId);
                                                setProfile(prev => prev ? { ...prev, avatar: result.url } : null);
                                                return result.url;
                                            }}
                                            onError={(error) => console.error('Upload error:', error)}
                                        />
                                    )}
                                </div>
                                {loading ? (
                                    <div className="space-y-2">
                                        <div className="h-6 w-40 bg-[#3e4854] animate-pulse rounded"></div>
                                        <div className="h-4 w-32 bg-[#3e4854] animate-pulse rounded"></div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-bold text-white">{profile?.firstName} {profile?.lastName}</h3>
                                        <p className="text-primary font-medium text-sm mb-4">Chuyên gia IELTS Speaking</p>
                                    </>
                                )}
                                <div className="flex flex-col gap-3 pt-4 border-t border-[#3e4854]/30">
                                    <div className="flex items-center gap-3 text-[#9dabb9]">
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                        <span className="text-sm">{loading ? '...' : profile?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#9dabb9]">
                                        <span className="material-symbols-outlined text-[20px]">call</span>
                                        <span className="text-sm">{loading ? '...' : profile?.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#9dabb9]">
                                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                                        <span className="text-sm">{loading ? '...' : profile?.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 p-6">
                            <h4 className="text-base font-bold text-white mb-4">Thống kê giảng dạy</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#9dabb9]">Học viên hiện tại</span>
                                    {loading ? (
                                        <div className="h-4 w-8 bg-[#3e4854] animate-pulse rounded"></div>
                                    ) : (
                                        <span className="text-sm font-bold text-white">{profile?.stats.currentLearners}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#9dabb9]">Tổng phiên dạy</span>
                                    {loading ? (
                                        <div className="h-4 w-8 bg-[#3e4854] animate-pulse rounded"></div>
                                    ) : (
                                        <span className="text-sm font-bold text-white">{profile?.stats.totalSessions}</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#9dabb9]">Đánh giá trung bình</span>
                                    {loading ? (
                                        <div className="h-4 w-8 bg-[#3e4854] animate-pulse rounded"></div>
                                    ) : (
                                        <span className="flex items-center gap-1 text-yellow-400">
                                            <span className="material-symbols-outlined text-sm">star</span>
                                            <span className="text-sm font-bold">{profile?.stats.avgRating}</span>
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#9dabb9]">Tình trạng</span>
                                    {loading ? (
                                        <div className="h-6 w-20 bg-[#3e4854] animate-pulse rounded-full"></div>
                                    ) : (
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${profile?.stats.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            <span className={`size-1.5 rounded-full ${profile?.stats.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`} />
                                            {profile?.stats.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Forms */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        {/* Basic Info */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30">
                            <div className="px-6 py-4 border-b border-[#3e4854]/30 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Thông tin cơ bản</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Họ</span>
                                    <input
                                        className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={loading}
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Tên</span>
                                    <input
                                        className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={loading}
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Email</span>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9] material-symbols-outlined text-[20px]">mail</span>
                                        <input
                                            className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white pl-11 pr-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Số điện thoại</span>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9] material-symbols-outlined text-[20px]">call</span>
                                        <input
                                            className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white pl-11 pr-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col gap-2 md:col-span-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Giới thiệu bản thân</span>
                                    <textarea
                                        className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all resize-none"
                                        rows={3}
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        disabled={loading}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30">
                            <div className="px-6 py-4 border-b border-[#3e4854]/30 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Chuyên môn & Kỹ năng</h3>
                                <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                                    Thêm kỹ năng
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <div key={i} className="h-8 w-24 bg-[#3e4854] animate-pulse rounded-lg"></div>
                                        ))
                                    ) : (
                                        <>
                                            {profile?.specialties.map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                            <span className="px-3 py-1.5 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] text-sm font-medium cursor-pointer hover:bg-[#3e4854]/50 transition-colors">
                                                + Thêm
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-[#9dabb9]">Chứng chỉ</span>
                                        <p className="text-white font-medium">{loading ? '...' : profile?.certifications}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-[#9dabb9]">Kinh nghiệm</span>
                                        <p className="text-white font-medium">{loading ? '...' : profile?.experience}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30">
                            <div className="px-6 py-4 border-b border-[#3e4854]/30">
                                <h3 className="text-lg font-bold text-white">Bảo mật & Đăng nhập</h3>
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                <div className="flex flex-col gap-4">
                                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">lock</span>
                                        Đổi mật khẩu
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-[#9dabb9]">Mật khẩu hiện tại</span>
                                            <input
                                                className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-[#9dabb9]">Mật khẩu mới</span>
                                            <input
                                                className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-[#9dabb9]">Xác nhận mật khẩu</span>
                                            <input
                                                className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

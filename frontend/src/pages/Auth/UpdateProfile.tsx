import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userProfileService } from '../../services/userProfileService';
import type { ProfileData } from '../../services/userProfileService';

export default function UpdateProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState<ProfileData>({
        full_name: '',
        phone_number: '',
        date_of_birth: '',
        gender: undefined,
        address: '',
        city: '',
        country: '',
        bio: ''
    });

    // Load existing profile data if any
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await userProfileService.getProfile();
                const profile = response.data;
                setFormData({
                    full_name: profile.full_name || '',
                    phone_number: profile.phone_number || '',
                    date_of_birth: profile.date_of_birth || '',
                    gender: profile.gender as 'male' | 'female' | 'other' | undefined,
                    address: profile.address || '',
                    city: profile.city || '',
                    country: profile.country || '',
                    bio: profile.bio || ''
                });
            } catch (err) {
                // New user, no profile yet - that's okay
                console.log('No existing profile found');
            }
        };
        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Client-side validation
        if (!formData.full_name.trim()) {
            setError('Vui lòng nhập họ và tên');
            setLoading(false);
            return;
        }
        if (!formData.phone_number.trim()) {
            setError('Vui lòng nhập số điện thoại');
            setLoading(false);
            return;
        }
        if (!formData.date_of_birth) {
            setError('Vui lòng chọn ngày sinh');
            setLoading(false);
            return;
        }

        try {
            await userProfileService.updateProfile(formData);
            setSuccess(true);

            // Get user role to redirect to appropriate dashboard
            const token = localStorage.getItem('accessToken');
            if (token) {
                const statusResponse = await userProfileService.getProfileStatus();
                const role = statusResponse.data.role;

                // Redirect based on role
                setTimeout(() => {
                    if (role === 'admin') {
                        navigate('/admin');
                    } else if (role === 'mentor') {
                        navigate('/mentor');
                    } else {
                        navigate('/dashboard');
                    }
                }, 1500);
            }
        } catch (err: any) {
            console.error('Profile update error:', err);
            setError(err.response?.data?.error || 'Cập nhật thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-[#2b8cee] to-[#1d4ed8] text-white shadow-lg shadow-[#2b8cee]/30 mb-4">
                        <span className="material-symbols-outlined text-[32px]">person_add</span>
                    </div>
                    <h1 className="text-white text-3xl font-black tracking-tight mb-2">
                        Hoàn thiện hồ sơ
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Vui lòng điền thông tin để bắt đầu sử dụng AESP
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[#1c2127]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
                            <span className="material-symbols-outlined text-green-400">check_circle</span>
                            <span className="text-green-400 font-medium">Cập nhật thành công! Đang chuyển hướng...</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-400">error</span>
                            <span className="text-red-400 font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1: Full Name & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Full Name - Required */}
                            <div className="space-y-2">
                                <label className="text-white font-medium flex items-center gap-1">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">badge</span>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#2b8cee] focus:ring-2 focus:ring-[#2b8cee]/20 transition-all"
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Number - Required */}
                            <div className="space-y-2">
                                <label className="text-white font-medium flex items-center gap-1">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">phone</span>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#2b8cee] focus:ring-2 focus:ring-[#2b8cee]/20 transition-all"
                                        placeholder="0912 345 678"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Date of Birth & Gender */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date of Birth - Required */}
                            <div className="space-y-2">
                                <label className="text-white font-medium flex items-center gap-1">
                                    Ngày sinh <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">calendar_month</span>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#2b8cee] focus:ring-2 focus:ring-[#2b8cee]/20 transition-all [color-scheme:dark]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Gender - Optional */}
                            <div className="space-y-2">
                                <label className="text-white font-medium">Giới tính</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">wc</span>
                                    <select
                                        name="gender"
                                        value={formData.gender || ''}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#2b8cee] focus:ring-2 focus:ring-[#2b8cee]/20 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-[#1c2127]">Chọn giới tính</option>
                                        <option value="male" className="bg-[#1c2127]">Nam</option>
                                        <option value="female" className="bg-[#1c2127]">Nữ</option>
                                        <option value="other" className="bg-[#1c2127]">Khác</option>
                                    </select>
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: City & Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* City */}
                            <div className="space-y-2">
                                <label className="text-white font-medium">Thành phố</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">location_city</span>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#2b8cee] focus:ring-2 focus:ring-[#2b8cee]/20 transition-all"
                                        placeholder="Hồ Chí Minh"
                                    />
                                </div>
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                                <label className="text-white font-medium">Quốc gia</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined">public</span>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#2b8cee] focus:ring-2 focus:ring-[#2b8cee]/20 transition-all"
                                        placeholder="Việt Nam"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className="text-white font-medium">Địa chỉ</label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-gray-400 material-symbols-outlined">home</span>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#2b8cee] focus:ring-2 focus:ring-[#2b8cee]/20 transition-all"
                                    placeholder="Số nhà, đường, quận/huyện..."
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="text-white font-medium">Giới thiệu bản thân</label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-gray-400 material-symbols-outlined">edit_note</span>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-[#2b8cee] focus:ring-2 focus:ring-[#2b8cee]/20 transition-all resize-none"
                                    placeholder="Một vài dòng về bản thân bạn..."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#2b8cee] to-[#1d4ed8] text-white font-bold text-lg shadow-lg shadow-[#2b8cee]/30 hover:shadow-xl hover:shadow-[#2b8cee]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Đang lưu...</span>
                                </>
                            ) : success ? (
                                <>
                                    <span className="material-symbols-outlined">check</span>
                                    <span>Đã lưu</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">save</span>
                                    <span>Lưu thông tin</span>
                                </>
                            )}
                        </button>

                        {/* Required fields note */}
                        <p className="text-gray-500 text-sm text-center">
                            <span className="text-red-500">*</span> Các trường bắt buộc
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

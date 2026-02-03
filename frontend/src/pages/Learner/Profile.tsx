import { useState, useEffect } from 'react';
import LearnerLayout from '../../layouts/LearnerLayout';
import { useAuth } from '../../context/AuthContext';
import { learnerService } from '../../services/learnerService';
import type { LearnerProfile } from '../../services/learnerService';
import { AvatarUpload } from '../../components/common';
import { fileService } from '../../services/fileService';

interface FormData {
  full_name: string;
  email: string;
  native_language: string;
  timezone: string;
  learning_goals: string[];
  correction_style: 'gentle' | 'strict';
  daily_goal_minutes: number;
  profile_visibility: 'public' | 'mentors_only' | 'private';
}

export default function Profile() {
  const { user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    native_language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    learning_goals: [],
    correction_style: 'gentle',
    daily_goal_minutes: 30,
    profile_visibility: 'public',
  });

  useEffect(() => {
    if (authUser?.id) {
      fetchProfile();
    }
  }, [authUser?.id]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        native_language: profile.native_language || 'vi',
        timezone: profile.timezone || 'Asia/Ho_Chi_Minh',
        learning_goals: profile.learning_goals || [],
        correction_style: profile.correction_style || 'gentle',
        daily_goal_minutes: profile.daily_goal_minutes || 30,
        profile_visibility: profile.profile_visibility || 'public',
      });
    }
  }, [profile]);


  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Use learnerService.getProfile to get full profile data including LearnerProfile table
      const response = await learnerService.getProfile(Number(authUser!.id));
      const profileData = response.data;

      // Map response to LearnerProfile format - data comes from LearnerProfileModel
      setProfile({
        id: profileData.id,
        full_name: profileData.full_name || '',
        username: profileData.username || '',
        email: profileData.email || '',
        avatar: profileData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.username || 'Guest'}`,
        current_level: profileData.current_level || 'beginner',
        current_streak: profileData.current_streak || 0,
        xp_points: profileData.xp_points || 0,
        target_level: profileData.target_level || 'C1',
        progress_to_target: profileData.progress_to_target || 0,
        native_language: profileData.native_language || 'vi',
        timezone: profileData.timezone || 'Asia/Ho_Chi_Minh',
        member_since: profileData.member_since || 'N/A',
        learning_goals: profileData.learning_goals || [],
        correction_style: profileData.correction_style || 'gentle',
        daily_goal_minutes: profileData.daily_goal_minutes || 30,
        voice_calibration_date: profileData.voice_calibration_date || null,
        profile_visibility: profileData.profile_visibility || 'public',
        show_progress: profileData.show_progress !== undefined ? profileData.show_progress : true,
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Không thể tải thông tin hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      learning_goals: prev.learning_goals.includes(goal)
        ? prev.learning_goals.filter(g => g !== goal)
        : [...prev.learning_goals, goal]
    }));
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        native_language: profile.native_language || 'vi',
        timezone: profile.timezone || 'Asia/Ho_Chi_Minh',
        learning_goals: profile.learning_goals || [],
        correction_style: profile.correction_style || 'gentle',
        daily_goal_minutes: profile.daily_goal_minutes || 30,
        profile_visibility: profile.profile_visibility || 'public',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!authUser?.id) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Update profile info
      await learnerService.updateProfile(Number(authUser.id), {
        full_name: formData.full_name,
        email: formData.email,
        native_language: formData.native_language,
        timezone: formData.timezone,
      });

      // Update learning goals
      await learnerService.updateLearningGoals(Number(authUser.id), {
        goals: formData.learning_goals,
        correction_style: formData.correction_style,
        daily_goal_minutes: formData.daily_goal_minutes,
      });

      // Update privacy settings
      await learnerService.updatePrivacySettings(Number(authUser.id), {
        profile_visibility: formData.profile_visibility,
      });

      // Update AuthContext user to sync header name/avatar
      updateUser({ name: formData.full_name });

      // Refresh profile data
      await fetchProfile();
      setSuccessMessage('Đã lưu thay đổi thành công!');
      setIsEditing(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Không thể lưu thay đổi. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LearnerLayout title="Hồ Sơ Học Viên">
        <div className="flex flex-col items-center justify-center h-[400px] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </LearnerLayout>
    );
  }

  if (!profile && !loading) {
    return (
      <LearnerLayout title="Hồ Sơ Học Viên">
        <div className="text-center py-20 bg-surface-dark rounded-xl border border-border-dark">
          <p className="text-text-secondary">Không tìm thấy thông tin hồ sơ.</p>
        </div>
      </LearnerLayout>
    );
  }

  const learningGoalOptions = ['Thăng tiến sự nghiệp', 'Du lịch', 'Luyện thi (IELTS/TOEFL)', 'Giao tiếp xã hội', 'Giải trí'];

  return (
    <LearnerLayout title="Hồ Sơ Học Viên">
      <div className="w-full max-w-[1080px] mx-auto flex flex-col gap-6">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <p className="text-green-500 font-medium">{successMessage}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">
              Hồ sơ của tôi
            </h1>
            <p className="text-text-secondary text-base font-normal">
              Quản lý thông tin cá nhân, mục tiêu học tập và sở thích của bạn.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Chỉnh sửa hồ sơ
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col items-center text-center shadow-sm">
              <AvatarUpload
                currentAvatar={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Guest'}`}
                name={profile?.full_name || 'Learner'}
                size="lg"
                onUpload={async (file) => {
                  const userId = authUser?.id ? parseInt(authUser.id, 10) : 0;
                  const result = await fileService.uploadAvatar(file, userId);
                  setProfile(prev => prev ? { ...prev, avatar: result.url } : null);
                  updateUser({ avatar: result.url });
                  return result.url;
                }}
                onError={(error) => setError(error)}
              />
              <h2 className="mt-4 text-xl font-bold text-white">
                {formData.full_name || profile?.full_name || 'Học viên'}
              </h2>
              <p className="text-text-secondary text-sm">
                @{profile?.username}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                  <span className="material-symbols-outlined text-base">
                    verified
                  </span>
                  Trình độ {profile?.current_level?.toUpperCase() || 'BEGINNER'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-500">
                  <span className="material-symbols-outlined text-base">
                    local_fire_department
                  </span>
                  Chuỗi {profile?.current_streak || 0} ngày
                </span>
              </div>
              <div className="w-full h-px bg-border-dark my-6" />
              <div className="w-full flex flex-col gap-4 text-left">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Mục tiêu hiện tại
                  </p>
                  <div className="w-full bg-background-dark rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${profile?.progress_to_target || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-right mt-1 text-text-secondary">
                    {profile?.progress_to_target || 0}% đến {profile?.target_level || 'C1'}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-text-secondary">
                    Thành viên từ
                  </p>
                  <p className="text-sm font-medium text-white">
                    {profile?.member_since || '---'}
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Calibration */}
            <div className="bg-surface-dark rounded-xl p-6 border border-border-dark shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">
                  Hiệu chỉnh giọng nói
                </h3>
                <span className="material-symbols-outlined text-primary">
                  mic
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                {profile?.voice_calibration_date
                  ? `Lần cuối ${profile.voice_calibration_date}. Cập nhật để AI phản hồi chuẩn xác hơn.`
                  : 'Chưa có mẫu giọng nói. Hãy ghi mẫu để AI nhận diện tốt hơn.'}
              </p>
              <button className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 bg-background-dark border border-border-dark text-white hover:bg-white/5 transition-colors text-sm font-medium">
                <span className="material-symbols-outlined text-lg">
                  graphic_eq
                </span>
                Ghi mẫu giọng mới
              </button>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Personal Info */}
            <div className="bg-surface-dark rounded-xl border border-border-dark shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-dark flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">
                  Thông tin cá nhân
                </h3>
                {isEditing && (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">Đang chỉnh sửa</span>
                )}
              </div>
              <div className="p-6 grid gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Họ và tên
                  </span>
                  <input
                    className="form-input w-full rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Nhập họ và tên"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Địa chỉ Email
                  </span>
                  <input
                    className="form-input w-full rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Nhập email"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Ngôn ngữ mẹ đẻ
                  </span>
                  <div className="relative">
                    <select
                      className="form-select w-full appearance-none rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      value={formData.native_language}
                      onChange={(e) => handleInputChange('native_language', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">Tiếng Anh</option>
                      <option value="zh">Tiếng Trung</option>
                      <option value="kr">Tiếng Hàn</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                      <span className="material-symbols-outlined text-sm">
                        expand_more
                      </span>
                    </div>
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Múi giờ
                  </span>
                  <div className="relative">
                    <select
                      className="form-select w-full appearance-none rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      value={formData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="Asia/Ho_Chi_Minh">(GMT+07:00) Hà Nội, Bangkok</option>
                      <option value="Asia/Singapore">(GMT+08:00) Singapore</option>
                      <option value="Asia/Tokyo">(GMT+09:00) Tokyo</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                      <span className="material-symbols-outlined text-sm">
                        expand_more
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-surface-dark rounded-xl border border-border-dark shadow-sm">
              <div className="px-6 py-4 border-b border-border-dark">
                <h3 className="text-lg font-bold text-white">
                  Mục tiêu &amp; Sở thích học tập
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-white">
                    Mục đích học tiếng Anh của bạn là gì?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {learningGoalOptions.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => isEditing && handleGoalToggle(goal)}
                        disabled={!isEditing}
                        className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${formData.learning_goals.includes(goal)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border-dark bg-transparent text-text-secondary hover:text-white'
                          }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-white">
                    Phong cách sửa lỗi của AI
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => isEditing && handleInputChange('correction_style', 'gentle')}
                      disabled={!isEditing}
                      className={`relative flex cursor-pointer rounded-lg border p-4 text-left focus:outline-none disabled:cursor-not-allowed ${formData.correction_style === 'gentle'
                        ? 'border-primary bg-primary/5'
                        : 'border-border-dark'
                        }`}
                    >
                      <span className="flex flex-col">
                        <span className="block text-sm font-bold text-white">
                          Hướng dẫn nhẹ nhàng
                        </span>
                        <span className="mt-1 flex items-center text-xs text-text-secondary">
                          Sửa lỗi sau khi tôi nói xong. Chú trọng sự trôi chảy.
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => isEditing && handleInputChange('correction_style', 'strict')}
                      disabled={!isEditing}
                      className={`relative flex cursor-pointer rounded-lg border p-4 text-left focus:outline-none disabled:cursor-not-allowed ${formData.correction_style === 'strict'
                        ? 'border-primary bg-primary/5'
                        : 'border-border-dark'
                        }`}
                    >
                      <span className="flex flex-col">
                        <span className="block text-sm font-bold text-white">
                          Gia sư nghiêm khắc
                        </span>
                        <span className="mt-1 flex items-center text-xs text-text-secondary">
                          Ngắt lời ngay khi sai. Chú trọng độ chính xác.
                        </span>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-white">
                      Mục tiêu luyện tập hàng ngày
                    </label>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {formData.daily_goal_minutes} phút
                    </span>
                  </div>
                  <input
                    className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    max={60}
                    min={5}
                    step={5}
                    type="range"
                    value={formData.daily_goal_minutes}
                    onChange={(e) => handleInputChange('daily_goal_minutes', Number(e.target.value))}
                    disabled={!isEditing}
                  />
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>5p</span>
                    <span>15p</span>
                    <span>30p</span>
                    <span>45p</span>
                    <span>60p</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-surface-dark rounded-xl border border-border-dark shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-dark">
                <h3 className="text-lg font-bold text-white">
                  Quyền riêng tư &amp; Bảo mật
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      Hiển thị hồ sơ
                    </span>
                    <span className="text-xs text-text-secondary">
                      Ai có thể xem thống kê và hồ sơ của bạn.
                    </span>
                  </div>
                  <div className="flex items-center rounded-lg bg-background-dark p-1 border border-border-dark">
                    <button
                      type="button"
                      onClick={() => isEditing && handleInputChange('profile_visibility', 'public')}
                      disabled={!isEditing}
                      className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all disabled:cursor-not-allowed ${formData.profile_visibility === 'public'
                        ? 'bg-surface-dark text-white shadow-sm'
                        : 'text-text-secondary hover:text-white'
                        }`}
                    >
                      Công khai
                    </button>
                    <button
                      type="button"
                      onClick={() => isEditing && handleInputChange('profile_visibility', 'mentors_only')}
                      disabled={!isEditing}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed ${formData.profile_visibility === 'mentors_only'
                        ? 'bg-surface-dark text-white shadow-sm'
                        : 'text-text-secondary hover:text-white'
                        }`}
                    >
                      Chỉ Mentor
                    </button>
                    <button
                      type="button"
                      onClick={() => isEditing && handleInputChange('profile_visibility', 'private')}
                      disabled={!isEditing}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed ${formData.profile_visibility === 'private'
                        ? 'bg-surface-dark text-white shadow-sm'
                        : 'text-text-secondary hover:text-white'
                        }`}
                    >
                      Riêng tư
                    </button>
                  </div>
                </div>
                <div className="w-full h-px bg-border-dark" />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      Mật khẩu
                    </span>
                    <span className="text-xs text-text-secondary">
                      Bảo vệ tài khoản của bạn.
                    </span>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border-dark bg-transparent text-sm font-bold text-white hover:bg-white/5 transition-colors">
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>

            {/* Save Actions */}
            {isEditing && (
              <div className="flex justify-end gap-4 py-4">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg border border-border-dark text-text-secondary font-bold text-sm hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </LearnerLayout>
  );
}

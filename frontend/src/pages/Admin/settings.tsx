import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

interface SettingsState {
  // General
  appName: string;
  adminEmail: string;
  defaultLanguage: string;
  timezone: string;

  // Security
  minPasswordLength: number;
  sessionTimeout: number;
  requireTwoFactor: boolean;
  allowSocialLogin: boolean;
  maxLoginAttempts: number;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;

  // Performance
  cacheDuration: number;
  enableCDN: boolean;
  compressionEnabled: boolean;

  // Integrations
  paymentGateway: boolean;
  aiEngine: boolean;
  analyticsEnabled: boolean;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'integrations' | 'performance'>('general');
  const [settings, setSettings] = useState<SettingsState>({
    // General
    appName: 'AESP Learning Platform',
    adminEmail: 'admin@aesp.vn',
    defaultLanguage: 'vi',
    timezone: 'UTC+7',

    // Security
    minPasswordLength: 8,
    sessionTimeout: 60,
    requireTwoFactor: false,
    allowSocialLogin: true,
    maxLoginAttempts: 5,

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,

    // Performance
    cacheDuration: 12,
    enableCDN: true,
    compressionEnabled: true,

    // Integrations
    paymentGateway: true,
    aiEngine: true,
    analyticsEnabled: true,
  });

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general' as const, label: 'Tổng quan', icon: 'tune' },
    { id: 'security' as const, label: 'Bảo mật', icon: 'security' },
    { id: 'notifications' as const, label: 'Thông báo', icon: 'notifications' },
    { id: 'integrations' as const, label: 'Tích hợp', icon: 'hub' },
    { id: 'performance' as const, label: 'Hiệu suất', icon: 'speed' },
  ];

  const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between p-4 bg-[#283039] rounded-lg border border-[#3b4754]">
      <span className="text-white text-sm font-medium">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[#3b4754] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
      </label>
    </div>
  );

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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-[3px] pb-3 pt-2 whitespace-nowrap px-1 transition-colors ${activeTab === tab.id
                    ? 'border-b-primary text-white'
                    : 'border-b-transparent text-[#9dabb9] hover:text-white'
                  }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${activeTab === tab.id ? 'fill' : ''}`}>
                  {tab.icon}
                </span>
                <p className="text-sm font-bold leading-normal">{tab.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 gap-6 pb-12">
          {/* General Settings */}
          {activeTab === 'general' && (
            <section className="flex flex-col gap-4" id="general">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">language</span>
                Cài đặt chung & Bản địa hóa
              </h3>
              <div className="bg-[#1c2127] rounded-xl border border-[#283039] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Tên ứng dụng</label>
                  <input
                    className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                    type="text"
                    value={settings.appName}
                    onChange={(e) => updateSetting('appName', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Email quản trị viên</label>
                  <input
                    className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => updateSetting('adminEmail', e.target.value)}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 h-px bg-[#283039] my-1" />
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Ngôn ngữ mặc định</label>
                  <div className="relative">
                    <select
                      value={settings.defaultLanguage}
                      onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
                      className="w-full bg-[#283039] border-transparent rounded-lg text-white focus:border-primary focus:ring-0 text-sm h-10 pl-3 pr-8 appearance-none outline-none"
                    >
                      <option value="vi">Tiếng Việt (Vietnamese)</option>
                      <option value="en">Tiếng Anh (English)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Múi giờ hệ thống</label>
                  <div className="relative">
                    <select
                      value={settings.timezone}
                      onChange={(e) => updateSetting('timezone', e.target.value)}
                      className="w-full bg-[#283039] border-transparent rounded-lg text-white focus:border-primary focus:ring-0 text-sm h-10 pl-3 pr-8 appearance-none outline-none"
                    >
                      <option value="UTC+7">(UTC+07:00) Bangkok, Hanoi, Jakarta</option>
                      <option value="UTC+0">(UTC+00:00) Universal Time Coordinated</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <section className="flex flex-col gap-4" id="security">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lock</span>
                Chính sách mật khẩu & Bảo mật
              </h3>
              <div className="bg-[#1c2127] rounded-xl border border-[#283039] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Độ dài mật khẩu tối thiểu</label>
                  <input
                    className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                    type="number"
                    value={settings.minPasswordLength}
                    onChange={(e) => updateSetting('minPasswordLength', parseInt(e.target.value) || 8)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Thời gian hết phiên (phút)</label>
                  <input
                    className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 60)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium">Số lần đăng nhập sai tối đa</label>
                  <input
                    className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value) || 5)}
                  />
                </div>
              </div>

              <h3 className="text-white text-lg font-bold flex items-center gap-2 mt-4">
                <span className="material-symbols-outlined text-primary">shield</span>
                Tùy chọn bảo mật
              </h3>
              <div className="flex flex-col gap-3">
                <ToggleSwitch
                  checked={settings.requireTwoFactor}
                  onChange={(value) => updateSetting('requireTwoFactor', value)}
                  label="Bắt buộc xác thực 2 yếu tố (2FA)"
                />
                <ToggleSwitch
                  checked={settings.allowSocialLogin}
                  onChange={(value) => updateSetting('allowSocialLogin', value)}
                  label="Cho phép đăng nhập bằng Google/Facebook"
                />
              </div>
            </section>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <section className="flex flex-col gap-4" id="notifications">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications</span>
                Cài đặt thông báo
              </h3>
              <div className="flex flex-col gap-3">
                <ToggleSwitch
                  checked={settings.emailNotifications}
                  onChange={(value) => updateSetting('emailNotifications', value)}
                  label="Thông báo qua Email"
                />
                <ToggleSwitch
                  checked={settings.pushNotifications}
                  onChange={(value) => updateSetting('pushNotifications', value)}
                  label="Thông báo đẩy (Push Notifications)"
                />
                <ToggleSwitch
                  checked={settings.marketingEmails}
                  onChange={(value) => updateSetting('marketingEmails', value)}
                  label="Email tiếp thị & khuyến mãi"
                />
              </div>
            </section>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <section className="flex flex-col gap-4" id="integrations">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">extension</span>
                Dịch vụ tích hợp
              </h3>
              <div className="bg-[#1c2127] rounded-xl border border-[#283039] overflow-hidden">
                {/* Payment Gateway */}
                <div className="p-4 sm:p-6 border-b border-[#283039] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-white p-2 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-800 text-3xl">payments</span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-white text-sm font-bold">Cổng thanh toán (VNPay / Momo)</h4>
                      <p className={`text-xs font-medium flex items-center gap-1 ${settings.paymentGateway ? 'text-green-500' : 'text-red-500'}`}>
                        <span className={`size-1.5 rounded-full block ${settings.paymentGateway ? 'bg-green-500' : 'bg-red-500'}`} />
                        {settings.paymentGateway ? 'Đang hoạt động' : 'Đã tắt'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.paymentGateway}
                        onChange={(e) => updateSetting('paymentGateway', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3b4754] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                    <button className="px-4 py-2 rounded-lg border border-[#3b4754] text-white text-sm font-medium hover:bg-[#283039] transition-colors">
                      Cấu hình
                    </button>
                  </div>
                </div>

                {/* AI Engine */}
                <div className="p-4 sm:p-6 border-b border-[#283039] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-white p-2 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-800 text-3xl">smart_toy</span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-white text-sm font-bold">AI Engine (OpenAI / Gemini)</h4>
                      <p className={`text-xs font-medium flex items-center gap-1 ${settings.aiEngine ? 'text-green-500' : 'text-red-500'}`}>
                        <span className={`size-1.5 rounded-full block ${settings.aiEngine ? 'bg-green-500' : 'bg-red-500'}`} />
                        {settings.aiEngine ? 'Đang hoạt động' : 'Đã tắt'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.aiEngine}
                        onChange={(e) => updateSetting('aiEngine', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3b4754] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                    <button className="px-4 py-2 rounded-lg border border-[#3b4754] text-white text-sm font-medium hover:bg-[#283039] transition-colors">
                      Cấu hình API Key
                    </button>
                  </div>
                </div>

                {/* Analytics */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-white p-2 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-800 text-3xl">analytics</span>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-white text-sm font-bold">Google Analytics</h4>
                      <p className={`text-xs font-medium flex items-center gap-1 ${settings.analyticsEnabled ? 'text-green-500' : 'text-red-500'}`}>
                        <span className={`size-1.5 rounded-full block ${settings.analyticsEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                        {settings.analyticsEnabled ? 'Đang hoạt động' : 'Đã tắt'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.analyticsEnabled}
                        onChange={(e) => updateSetting('analyticsEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3b4754] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                    <button className="px-4 py-2 rounded-lg border border-[#3b4754] text-white text-sm font-medium hover:bg-[#283039] transition-colors">
                      Cấu hình
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Performance Settings */}
          {activeTab === 'performance' && (
            <section className="flex flex-col gap-4" id="performance">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">speed</span>
                Hiệu suất hệ thống
              </h3>
              <div className="bg-[#1c2127] rounded-xl border border-[#283039] p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <label className="text-white text-sm font-medium">Bộ nhớ đệm (Cache Duration)</label>
                    <span className="text-primary text-sm font-bold">{settings.cacheDuration} Giờ</span>
                  </div>
                  <input
                    className="w-full h-2 bg-[#283039] rounded-lg appearance-none cursor-pointer accent-primary"
                    max={24}
                    min={1}
                    type="range"
                    value={settings.cacheDuration}
                    onChange={(e) => updateSetting('cacheDuration', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <h3 className="text-white text-lg font-bold flex items-center gap-2 mt-4">
                <span className="material-symbols-outlined text-primary">cloud</span>
                Tối ưu hóa
              </h3>
              <div className="flex flex-col gap-3">
                <ToggleSwitch
                  checked={settings.enableCDN}
                  onChange={(value) => updateSetting('enableCDN', value)}
                  label="Bật CDN (Content Delivery Network)"
                />
                <ToggleSwitch
                  checked={settings.compressionEnabled}
                  onChange={(value) => updateSetting('compressionEnabled', value)}
                  label="Nén dữ liệu (Gzip/Brotli)"
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;

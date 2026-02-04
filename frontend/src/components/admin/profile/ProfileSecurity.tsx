import React from 'react';

const ProfileSecurity: React.FC = () => {
    return (
        <div className="bg-white dark:bg-[#1c2127] rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#283039]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Bảo mật &amp; Đăng nhập
                </h3>
            </div>
            <div className="p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3b82f6]">lock</span>
                        Đổi mật khẩu
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">
                                Mật khẩu hiện tại
                            </span>
                            <input
                                className="w-full rounded-lg border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">
                                Mật khẩu mới
                            </span>
                            <input
                                className="w-full rounded-lg border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">
                                Xác nhận mật khẩu
                            </span>
                            <input
                                className="w-full rounded-lg border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none transition-all"
                                placeholder="••••••••"
                                type="password"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurity;

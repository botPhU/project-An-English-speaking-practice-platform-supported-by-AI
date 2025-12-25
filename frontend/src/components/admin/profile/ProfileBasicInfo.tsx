import React from 'react';

const ProfileBasicInfo: React.FC = () => {
    return (
        <div className="bg-white dark:bg-[#1c2127] rounded-xl border border-gray-200 dark:border-[#283039] shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[#283039] flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Thông tin cơ bản
                </h3>
                <button className="text-[#3b82f6] text-sm font-medium hover:underline">
                    Chỉnh sửa
                </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Họ</span>
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none transition-all"
                        type="text"
                        defaultValue="Nguyễn Văn"
                    />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">Tên</span>
                    <input
                        className="w-full rounded-lg border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none transition-all"
                        type="text"
                        defaultValue="Admin"
                    />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">
                        Email
                    </span>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">
                            mail
                        </span>
                        <input
                            className="w-full rounded-lg border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white pl-11 pr-4 py-2.5 outline-none transition-all"
                            type="email"
                            defaultValue="admin@aesp.vn"
                        />
                    </div>
                </label>
                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">
                        Số điện thoại
                    </span>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">
                            call
                        </span>
                        <input
                            className="w-full rounded-lg border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white pl-11 pr-4 py-2.5 outline-none transition-all"
                            type="tel"
                            defaultValue="+84 909 123 456"
                        />
                    </div>
                </label>
                <label className="flex flex-col gap-2 md:col-span-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-[#9dabb9]">
                        Tiểu sử / Ghi chú
                    </span>
                    <textarea
                        className="w-full rounded-lg border-gray-300 dark:border-[#3b4754] bg-gray-50 dark:bg-[#111418] text-slate-900 dark:text-white px-4 py-2.5 outline-none transition-all resize-none"
                        rows={3}
                        defaultValue="Quản trị viên chính của hệ thống AESP. Phụ trách quản lý người dùng và nội dung bài học."
                    />
                </label>
            </div>
        </div>
    );
};

export default ProfileBasicInfo;

import React from 'react';

const ProfileIdentityCard: React.FC = () => {
    return (
        <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#1c2127] rounded-xl border border-gray-200 dark:border-[#283039] overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-[#3b82f6] relative"></div>
                <div className="px-6 pb-6 relative">
                    <div className="relative -mt-12 mb-4 w-fit">
                        <div
                            className="size-24 rounded-full border-4 border-white dark:border-[#1c2127] bg-center bg-cover"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB3Uf0ceXbbDi_oOnnaLHBpHGenOlfTkmw6ESU3eV8dqSkojjfYB6cDFROPdQ4yKxJf_1ew2iiqeYStsEIcm2zQq1wjDXf2pG6Iu8r50crXELsYd-nkuEEUod_NMp_Vkshro70YiNf8aDL608hPw6mu-0aoVbTTDd9PYP1A_DeAgHLZRIRjPZUsdHkYN8Ya2vvN6ZMuP_UFR976E56Z4dhdRvUcxkcPhqU6jJvOZN5YwudboROjY3Htx4-QTosoi4cvDeiAHBKhfLs")'
                            }}
                        />
                        <button
                            className="absolute bottom-0 right-0 p-1.5 bg-slate-800 text-white rounded-full hover:bg-slate-700 border-2 border-white dark:border-[#1c2127] flex items-center justify-center transition-colors"
                            title="Đổi ảnh đại diện"
                        >
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                        </button>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nguyễn Văn Admin</h3>
                    <p className="text-[#3b82f6] font-medium text-sm mb-4">Quản Trị Viên Hệ Thống</p>
                    <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-[#283039]">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-[#9dabb9]">
                            <span className="material-symbols-outlined text-[20px]">mail</span>
                            <span className="text-sm">admin@aesp.vn</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-[#9dabb9]">
                            <span className="material-symbols-outlined text-[20px]">call</span>
                            <span className="text-sm">+84 909 123 456</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-[#9dabb9]">
                            <span className="material-symbols-outlined text-[20px]">location_on</span>
                            <span className="text-sm">Hồ Chí Minh, Việt Nam</span>
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
                        Hôm nay, 08:30
                    </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-[#9dabb9]">Tình trạng</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold">
                        <span className="size-1.5 rounded-full bg-green-500" />
                        Hoạt động
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-[#9dabb9]">Quyền hạn</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                        Toàn quyền (Super)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfileIdentityCard;

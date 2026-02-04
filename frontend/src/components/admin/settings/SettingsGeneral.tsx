import React from 'react';

const SettingsGeneral: React.FC = () => {
    return (
        <section className="flex flex-col gap-4" id="general">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">language</span>
                Cài đặt chung &amp; Bản địa hóa
            </h3>
            <div className="bg-[#1c2127] rounded-xl border border-[#283039] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Tên ứng dụng</label>
                    <input
                        className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                        type="text"
                        defaultValue="AESP Learning Platform"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Email quản trị viên</label>
                    <input
                        className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                        type="email"
                        defaultValue="admin@aesp.vn"
                    />
                </div>
                <div className="col-span-1 md:col-span-2 h-px bg-[#283039] my-1" />
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Ngôn ngữ mặc định</label>
                    <div className="relative">
                        <select className="w-full bg-[#283039] border-transparent rounded-lg text-white focus:border-primary focus:ring-0 text-sm h-10 pl-3 pr-8 appearance-none outline-none">
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
                        <select className="w-full bg-[#283039] border-transparent rounded-lg text-white focus:border-primary focus:ring-0 text-sm h-10 pl-3 pr-8 appearance-none outline-none">
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
    );
};

export default SettingsGeneral;

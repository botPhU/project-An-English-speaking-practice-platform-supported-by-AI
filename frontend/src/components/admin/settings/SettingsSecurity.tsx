import React from 'react';

const SettingsSecurity: React.FC = () => {
    return (
        <section className="flex flex-col gap-4" id="security">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lock</span>
                Chính sách mật khẩu &amp; Bảo mật
            </h3>
            <div className="bg-[#1c2127] rounded-xl border border-[#283039] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Độ dài mật khẩu tối thiểu</label>
                    <input
                        className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                        type="number"
                        defaultValue={8}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-white text-sm font-medium">Thời gian hết phiên (phút)</label>
                    <input
                        className="w-full bg-[#283039] border-transparent rounded-lg text-white placeholder-[#9dabb9] focus:border-primary focus:ring-0 text-sm h-10 px-3"
                        type="number"
                        defaultValue={60}
                    />
                </div>
            </div>
        </section>
    );
};

export default SettingsSecurity;

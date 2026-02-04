import React from 'react';

const SettingsPerformance: React.FC = () => {
    return (
        <section className="flex flex-col gap-4" id="performance">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">speed</span>
                Hiệu suất hệ thống
            </h3>
            <div className="bg-[#1c2127] rounded-xl border border-[#283039] p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <label className="text-white text-sm font-medium">Bộ nhớ đệm (Cache Duration)</label>
                        <span className="text-primary text-sm font-bold">12 Giờ</span>
                    </div>
                    <input
                        className="w-full h-2 bg-[#283039] rounded-lg appearance-none cursor-pointer accent-primary"
                        max={24}
                        min={1}
                        type="range"
                        defaultValue={12}
                    />
                </div>
            </div>
        </section>
    );
};

export default SettingsPerformance;

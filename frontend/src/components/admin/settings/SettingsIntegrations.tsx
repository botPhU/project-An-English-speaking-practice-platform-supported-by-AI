import React from 'react';

const SettingsIntegrations: React.FC = () => {
    return (
        <section className="flex flex-col gap-4" id="integration">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">extension</span>
                Dịch vụ tích hợp
            </h3>
            <div className="bg-[#1c2127] rounded-xl border border-[#283039] overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-[#283039] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-white p-2 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-800 text-3xl">payments</span>
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-white text-sm font-bold">Cổng thanh toán (VNPay / Momo)</h4>
                            <p className="text-green-500 text-xs font-medium flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-green-500 block" /> Đang hoạt động
                            </p>
                        </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-[#3b4754] text-white text-sm font-medium hover:bg-[#283039] transition-colors">
                        Cấu hình
                    </button>
                </div>

                <div className="p-4 sm:p-6 border-b border-[#283039] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-white p-2 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-800 text-3xl">smart_toy</span>
                        </div>
                        <div className="flex flex-col">
                            <h4 className="text-white text-sm font-bold">AI Engine (OpenAI / Gemini)</h4>
                            <p className="text-green-500 text-xs font-medium flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-green-500 block" /> Đang hoạt động
                            </p>
                        </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-[#3b4754] text-white text-sm font-medium hover:bg-[#283039] transition-colors">
                        Cấu hình API Key
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SettingsIntegrations;

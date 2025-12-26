import LearnerLayout from '../../layouts/LearnerLayout';

export default function ProficiencyTest() {
    return (
        <LearnerLayout title="Đánh Giá Năng Lực">
            <div className="w-full max-w-[960px] mx-auto flex flex-col gap-6">
                {/* Progress Section */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-surface-dark shadow-sm border border-border-dark">
                    <div className="flex gap-6 justify-between items-end">
                        <div>
                            <p className="text-white text-base font-bold leading-normal">
                                Phần 1: Phát âm cơ bản
                            </p>
                            <p className="text-text-secondary text-sm font-normal leading-normal mt-1">
                                Câu hỏi 3 / 12
                            </p>
                        </div>
                        <p className="text-primary text-sm font-bold leading-normal">25%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-border-dark">
                        <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: "25%" }}
                        />
                    </div>
                </div>

                {/* Main Task Area */}
                <div className="flex flex-col gap-2">
                    {/* Text Instructions */}
                    <div className="text-center pb-2">
                        <h1 className="text-white tracking-tight text-[28px] md:text-[32px] font-bold leading-tight px-4 pb-2">
                            Task 1: Read the sentence aloud
                        </h1>
                        <p className="text-text-secondary text-base font-normal leading-normal px-4">
                            Hãy đọc to câu tiếng Anh dưới đây để kiểm tra ngữ điệu và phát âm
                            của bạn.
                        </p>
                    </div>

                    {/* Card / Interaction Area */}
                    <div className="rounded-xl overflow-hidden bg-surface-dark shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-border-dark">
                        {/* Content to Read */}
                        <div className="p-6 md:p-10 flex flex-col items-center gap-6 border-b border-border-dark">
                            {/* Image for Context */}
                            <div
                                className="w-full h-32 md:h-48 rounded-lg bg-cover bg-center mb-2 relative overflow-hidden group"
                                style={{
                                    backgroundImage:
                                        'url("https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800")'
                                }}
                            >
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white/80 text-[48px]">
                                        menu_book
                                    </span>
                                </div>
                            </div>
                            <p className="text-white text-xl md:text-2xl font-medium leading-relaxed text-center max-w-2xl">
                                "The quick brown fox jumps over the lazy dog."
                            </p>
                            {/* Sample Audio Button */}
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors">
                                <span className="material-symbols-outlined text-[20px]">
                                    volume_up
                                </span>
                                Nghe phát âm mẫu
                            </button>
                        </div>

                        {/* Recording Interface */}
                        <div className="p-6 bg-[#151a21] flex flex-col items-center justify-center gap-6">
                            {/* Waveform Visualization */}
                            <div className="flex items-center justify-center gap-1 h-12 w-full max-w-md">
                                <div className="w-1.5 h-3 bg-primary/30 rounded-full" />
                                <div className="w-1.5 h-5 bg-primary/40 rounded-full" />
                                <div className="w-1.5 h-8 bg-primary/60 rounded-full" />
                                <div className="w-1.5 h-4 bg-primary/30 rounded-full" />
                                <div className="w-1.5 h-10 bg-primary/80 rounded-full" />
                                <div className="w-1.5 h-6 bg-primary/50 rounded-full" />
                                <div className="w-1.5 h-12 bg-primary rounded-full animate-pulse" />
                                <div className="w-1.5 h-7 bg-primary/60 rounded-full" />
                                <div className="w-1.5 h-4 bg-primary/40 rounded-full" />
                                <div className="w-1.5 h-9 bg-primary/70 rounded-full" />
                                <div className="w-1.5 h-5 bg-primary/30 rounded-full" />
                                <div className="w-1.5 h-3 bg-primary/20 rounded-full" />
                            </div>
                            <div className="flex items-center gap-8 w-full justify-center relative">
                                {/* Timer */}
                                <div className="absolute left-0 md:left-auto md:right-[calc(50%+60px)] top-1/2 -translate-y-1/2 text-text-secondary text-sm font-mono hidden md:block">
                                    00:00 / 01:00
                                </div>
                                {/* Main Record Button */}
                                <button className="group relative flex items-center justify-center size-16 md:size-20 rounded-full bg-primary hover:bg-[#1a7bd9] text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 ring-4 ring-transparent hover:ring-primary/20">
                                    <span className="material-symbols-outlined text-[32px] md:text-[40px]">
                                        mic
                                    </span>
                                </button>
                                {/* Status Label (Mobile Only) */}
                                <div className="absolute right-0 md:hidden top-1/2 -translate-y-1/2 text-text-secondary text-sm font-mono">
                                    00:00
                                </div>
                                {/* Instruction Hint */}
                                <div className="absolute hidden md:block left-[calc(50%+60px)] top-1/2 -translate-y-1/2 text-sm text-text-secondary max-w-[150px] leading-tight">
                                    Nhấn để bắt đầu thu âm
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                                Microphone đã sẵn sàng
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between pt-4 pb-10">
                    <button className="flex items-center justify-center h-10 px-6 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors font-medium text-sm">
                        Bỏ qua câu này
                    </button>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-[#1a7bd9] text-white shadow-md shadow-primary/20 font-bold text-base transition-all">
                            <span>Tiếp tục</span>
                            <span className="material-symbols-outlined text-[20px] ml-2">
                                arrow_forward
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </LearnerLayout>
    );
}

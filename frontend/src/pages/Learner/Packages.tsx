import LearnerLayout from '../../layouts/LearnerLayout';

export default function Packages() {
    return (
        <LearnerLayout title="Gói Học & Thanh Toán">
            <div className="max-w-[1200px] mx-auto space-y-8">
                {/* Page Heading */}
                <div className="flex flex-col items-center text-center gap-4 mb-8">
                    <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                        Chọn lộ trình phù hợp với bạn
                    </h1>
                    <p className="text-text-secondary text-lg font-normal leading-normal max-w-2xl">
                        Mở khóa tiềm năng tiếng Anh của bạn với trợ lý AI và chuyên gia
                        ngôn ngữ hàng đầu. Linh hoạt nâng cấp hoặc hủy bất kỳ lúc nào.
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center py-3 mb-8">
                    <div className="flex h-12 w-full max-w-md items-center justify-center rounded-xl bg-surface-dark p-1 relative">
                        <label className="cursor-pointer z-10 w-1/2 h-full flex items-center justify-center rounded-lg transition-all has-[:checked]:bg-background-dark has-[:checked]:shadow-sm has-[:checked]:text-primary text-text-secondary font-bold text-sm">
                            <span className="truncate">Thanh toán tháng</span>
                            <input
                                defaultChecked
                                className="invisible w-0 absolute"
                                name="billing_cycle"
                                type="radio"
                                defaultValue="monthly"
                            />
                        </label>
                        <label className="cursor-pointer z-10 w-1/2 h-full flex items-center justify-center rounded-lg transition-all has-[:checked]:bg-background-dark has-[:checked]:shadow-sm has-[:checked]:text-primary text-text-secondary font-bold text-sm">
                            <span className="truncate flex items-center gap-2">
                                Thanh toán năm
                                <span className="bg-green-900/30 text-green-400 text-[10px] px-2 py-0.5 rounded-full">
                                    -20%
                                </span>
                            </span>
                            <input
                                className="invisible w-0 absolute"
                                name="billing_cycle"
                                type="radio"
                                defaultValue="yearly"
                            />
                        </label>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-start">
                    {/* Starter Plan */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-border-dark bg-surface-dark p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white text-lg font-bold leading-tight">
                                    Gói Khởi Động
                                </h3>
                                <span className="material-symbols-outlined text-text-secondary text-3xl">
                                    psychology
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary">
                                Dành cho người tự học với AI
                            </p>
                            <div className="my-4 h-px w-full bg-border-dark" />
                            <p className="flex items-baseline gap-1 text-white">
                                <span className="text-4xl font-black leading-tight tracking-[-0.033em]">
                                    199k
                                </span>
                                <span className="text-base font-bold text-text-secondary">
                                    /tháng
                                </span>
                            </p>
                        </div>
                        <button className="w-full cursor-pointer rounded-xl h-12 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold leading-normal transition-colors">
                            Chọn gói này
                        </button>
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-green-500 text-[20px]">
                                    check_circle
                                </span>
                                Truy cập AI Speaking 24/7
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-green-500 text-[20px]">
                                    check_circle
                                </span>
                                Kho từ vựng cơ bản
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-green-500 text-[20px]">
                                    check_circle
                                </span>
                                1 bài kiểm tra trình độ
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-gray-600 line-through">
                                <span className="material-symbols-outlined text-gray-700 text-[20px]">
                                    cancel
                                </span>
                                Không có Mentor hỗ trợ
                            </div>
                        </div>
                    </div>

                    {/* Accelerator Plan (Most Popular) */}
                    <div className="relative flex flex-col gap-4 rounded-2xl border-2 border-primary bg-surface-dark p-8 shadow-xl shadow-primary/10 transform md:-translate-y-4 z-10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            PHỔ BIẾN NHẤT
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white text-lg font-bold leading-tight">
                                    Gói Tăng Tốc
                                </h3>
                                <span className="material-symbols-outlined text-primary text-3xl">
                                    rocket_launch
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary">
                                Kết hợp AI và Mentor hướng dẫn
                            </p>
                            <div className="my-4 h-px w-full bg-border-dark" />
                            <p className="flex items-baseline gap-1 text-white">
                                <span className="text-4xl font-black leading-tight tracking-[-0.033em]">
                                    499k
                                </span>
                                <span className="text-base font-bold text-text-secondary">
                                    /tháng
                                </span>
                            </p>
                        </div>
                        <button className="w-full cursor-pointer rounded-xl h-12 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal shadow-lg shadow-primary/25 transition-all hover:scale-[1.02]">
                            Dùng thử miễn phí 7 ngày
                        </button>
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-primary text-[20px]">
                                    check_circle
                                </span>
                                Mọi tính năng gói Cơ bản
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-white">
                                <span className="material-symbols-outlined text-primary text-[20px]">
                                    check_circle
                                </span>
                                <span className="font-bold">
                                    2 buổi Mentor 1-1/tuần
                                </span>
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-primary text-[20px]">
                                    check_circle
                                </span>
                                Kho tài liệu Premium
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-primary text-[20px]">
                                    check_circle
                                </span>
                                Chấm điểm phát âm chi tiết
                            </div>
                        </div>
                    </div>

                    {/* Intensive Plan */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-border-dark bg-surface-dark p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white text-lg font-bold leading-tight">
                                    Gói Chuyên Sâu
                                </h3>
                                <span className="material-symbols-outlined text-text-secondary text-3xl">
                                    school
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary">
                                Cam kết đầu ra IELTS/TOEIC
                            </p>
                            <div className="my-4 h-px w-full bg-border-dark" />
                            <p className="flex items-baseline gap-1 text-white">
                                <span className="text-4xl font-black leading-tight tracking-[-0.033em]">
                                    999k
                                </span>
                                <span className="text-base font-bold text-text-secondary">
                                    /tháng
                                </span>
                            </p>
                        </div>
                        <button className="w-full cursor-pointer rounded-xl h-12 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold leading-normal transition-colors">
                            Liên hệ tư vấn
                        </button>
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-green-500 text-[20px]">
                                    check_circle
                                </span>
                                Mọi tính năng gói Tăng Tốc
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-white">
                                <span className="material-symbols-outlined text-green-500 text-[20px]">
                                    check_circle
                                </span>
                                <span className="font-bold">
                                    4 buổi Mentor 1-1/tuần
                                </span>
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-green-500 text-[20px]">
                                    check_circle
                                </span>
                                Lộ trình cá nhân hóa
                            </div>
                            <div className="text-sm font-medium flex gap-3 text-text-secondary">
                                <span className="material-symbols-outlined text-green-500 text-[20px]">
                                    check_circle
                                </span>
                                Cam kết đầu ra bằng văn bản
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="flex flex-col mb-16">
                    <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-6 text-center">
                        So sánh chi tiết các gói
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-border-dark">
                        <table className="w-full min-w-[800px] border-collapse bg-surface-dark text-left text-sm text-text-secondary">
                            <thead className="bg-white/5 text-white font-bold">
                                <tr>
                                    <th className="px-6 py-4">Tính năng</th>
                                    <th className="px-6 py-4 text-center">Khởi Động</th>
                                    <th className="px-6 py-4 text-center text-primary">
                                        Tăng Tốc
                                    </th>
                                    <th className="px-6 py-4 text-center">Chuyên Sâu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-dark">
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        Học với AI Speaking
                                    </td>
                                    <td className="px-6 py-4 text-center">Không giới hạn</td>
                                    <td className="px-6 py-4 text-center">Không giới hạn</td>
                                    <td className="px-6 py-4 text-center">Không giới hạn</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        Mentor 1-1 (Giáo viên Việt Nam)
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">
                                        -
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-primary">
                                        2 buổi/tuần
                                    </td>
                                    <td className="px-6 py-4 text-center">4 buổi/tuần</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        Kho đề thi thử (IELTS/TOEIC)
                                    </td>
                                    <td className="px-6 py-4 text-center">1 đề/tháng</td>
                                    <td className="px-6 py-4 text-center">5 đề/tháng</td>
                                    <td className="px-6 py-4 text-center">Không giới hạn</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        Sửa lỗi phát âm chi tiết
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="material-symbols-outlined text-green-500">
                                            check
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="material-symbols-outlined text-green-500">
                                            check
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="material-symbols-outlined text-green-500">
                                            check
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        Cam kết đầu ra
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">
                                        -
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">
                                        -
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="material-symbols-outlined text-green-500">
                                            check
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment & Trust Section */}
                <div className="flex flex-col items-center gap-8 pb-12 border-t border-border-dark pt-12">
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="text-text-secondary text-sm font-semibold uppercase tracking-wider">
                            Thanh toán an toàn & tiện lợi qua
                        </h3>
                        <div className="flex flex-wrap justify-center gap-6 items-center mt-2 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
                            <div className="h-8 w-auto flex items-center justify-center bg-white p-1 rounded">
                                <img
                                    alt="Ví điện tử MoMo"
                                    className="h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVyDNzLbWP6Eg56ovSZwkdNab1PGM0EQrjjBCrX--uxabwKfdOynLPZb2K6H7mtZz-mCTurdQAp3tdBPrij3-lYXTzNsZqKGOEVXofLXu_dlEjEGwOSWJTpZrwFZNUWo03VO4qvI--hbZfx4H90s0EhNFaCe1S-SsktB7K9R-F6SjMVE79l0sOqyKwNYM3ImcSNll_NxEJqTsE8KVWbEw8EUNS79xfIgt34A7FPenvdZIXXQv7H-uuwJxdvK5w24V2YApREgwH-lY"
                                />
                            </div>
                            <div className="h-8 w-auto flex items-center justify-center bg-white p-1 rounded">
                                <img
                                    alt="Ví điện tử ZaloPay"
                                    className="h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBzmk7OJboBdFhnwn9WYCS0qZYYnkH2W-4FD9c3sfAgqugG6OD5RVlLPeBRcF_Y9JdZEmjo6dlJOJQSR93um32CmiqcM8fAHCtGNbRbF7GrsA1gYZREboANFgEgbI2tEgYH8onEC69hzfazYBhQK0IsMCpWN9zBAlJNxqn1kFHl8YrmXUkcKLB2jLhiLaHkcG5pBGtutdOvwLEjALPD74aLvd11VNWWgTX65WpOizAsIi_ZokqOJURnwoEl7-K1KPYmRPFTSU6ggk"
                                />
                            </div>
                            <div className="h-8 w-auto flex items-center justify-center bg-white p-1 rounded">
                                <img
                                    alt="Cổng thanh toán VNPAY-QR"
                                    className="h-full object-contain"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdRE5XtN6Nn7ew7eOzSsjBtdjCjJNRUETLFCA2CH_abZSg4sKjCY5fW3mydGeefbuNKrn9YC46AvxYkV4RdR5CH0R6pVwX4iTD4GDyJcR7GxCHrXXdSiw1ShwIfDwVUYAFSXasN_K0s5Kjj9aJQv7RfUR_K4a9_U-LlB9XEeN-eInUj2CxkDS4BXWcIHKoFB79-hnKJ3w0I8f8EMGLepMFdQj-jUk0Kl4jVy29n8HTF5TMfatASVCBnwOMQMonWcjKKHV1wPoWjUE"
                                />
                            </div>
                            <div className="h-6 w-auto flex items-center gap-2 text-text-secondary">
                                <span className="material-symbols-outlined text-3xl">
                                    credit_card
                                </span>
                                <span className="text-xs font-bold">VISA / MASTER</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <span className="material-symbols-outlined">
                                    verified_user
                                </span>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">
                                    Bảo mật thông tin
                                </p>
                                <p className="text-text-secondary text-xs">
                                    Mã hóa SSL 256-bit
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <span className="material-symbols-outlined">
                                    published_with_changes
                                </span>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">
                                    Hoàn tiền 100%
                                </p>
                                <p className="text-text-secondary text-xs">
                                    Trong vòng 7 ngày đầu
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <span className="material-symbols-outlined">
                                    support_agent
                                </span>
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">
                                    Hỗ trợ 24/7
                                </p>
                                <p className="text-text-secondary text-xs">
                                    Giải đáp mọi thắc mắc
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LearnerLayout>
    );
}

import MentorLayout from '../../layouts/MentorLayout';

// Mentor Profile - Hồ sơ cá nhân Mentor
export default function MentorProfile() {
    return (
        <MentorLayout
            title="Hồ Sơ Mentor"
            subtitle="Quản lý thông tin cá nhân và chuyên môn"
            icon="person"
            actions={
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] text-sm font-bold hover:bg-[#3e4854]/50 transition-colors">
                        Hủy bỏ
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Lưu thay đổi
                    </button>
                </div>
            }
        >
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Col: Identity Card */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        {/* Profile Card */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-primary to-blue-400 relative"></div>
                            <div className="px-6 pb-6 relative">
                                <div className="relative -mt-12 mb-4 w-fit">
                                    <div
                                        className="size-24 rounded-full border-4 border-[#283039] bg-center bg-cover"
                                        style={{
                                            backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor")'
                                        }}
                                    />
                                    <button
                                        className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary/80 border-2 border-[#283039] flex items-center justify-center transition-colors"
                                        title="Đổi ảnh đại diện"
                                    >
                                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-white">Nguyễn Tuấn Mentor</h3>
                                <p className="text-primary font-medium text-sm mb-4">Chuyên gia IELTS Speaking</p>
                                <div className="flex flex-col gap-3 pt-4 border-t border-[#3e4854]/30">
                                    <div className="flex items-center gap-3 text-[#9dabb9]">
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                        <span className="text-sm">mentor.tuan@aesp.vn</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#9dabb9]">
                                        <span className="material-symbols-outlined text-[20px]">call</span>
                                        <span className="text-sm">+84 912 345 678</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[#9dabb9]">
                                        <span className="material-symbols-outlined text-[20px]">location_on</span>
                                        <span className="text-sm">Hà Nội, Việt Nam</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30 p-6">
                            <h4 className="text-base font-bold text-white mb-4">Thống kê giảng dạy</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#9dabb9]">Học viên hiện tại</span>
                                    <span className="text-sm font-bold text-white">24</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#9dabb9]">Tổng phiên dạy</span>
                                    <span className="text-sm font-bold text-white">456</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#9dabb9]">Đánh giá trung bình</span>
                                    <span className="flex items-center gap-1 text-yellow-400">
                                        <span className="material-symbols-outlined text-sm">star</span>
                                        <span className="text-sm font-bold">4.9</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[#9dabb9]">Tình trạng</span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                                        <span className="size-1.5 rounded-full bg-green-400" />
                                        Hoạt động
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Forms */}
                    <div className="xl:col-span-2 flex flex-col gap-6">
                        {/* Basic Info */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30">
                            <div className="px-6 py-4 border-b border-[#3e4854]/30 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Thông tin cơ bản</h3>
                                <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                                    Chỉnh sửa
                                </button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Họ</span>
                                    <input
                                        className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                        type="text"
                                        defaultValue="Nguyễn Tuấn"
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Tên</span>
                                    <input
                                        className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                        type="text"
                                        defaultValue="Mentor"
                                    />
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Email</span>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9] material-symbols-outlined text-[20px]">
                                            mail
                                        </span>
                                        <input
                                            className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white pl-11 pr-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                            type="email"
                                            defaultValue="mentor.tuan@aesp.vn"
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Số điện thoại</span>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9] material-symbols-outlined text-[20px]">
                                            call
                                        </span>
                                        <input
                                            className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white pl-11 pr-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                            type="tel"
                                            defaultValue="+84 912 345 678"
                                        />
                                    </div>
                                </label>
                                <label className="flex flex-col gap-2 md:col-span-2">
                                    <span className="text-sm font-medium text-[#9dabb9]">Giới thiệu bản thân</span>
                                    <textarea
                                        className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all resize-none"
                                        rows={3}
                                        defaultValue="Chuyên gia IELTS với 8 năm kinh nghiệm giảng dạy. Tốt nghiệp Đại học Ngoại ngữ, band 8.5 IELTS. Đam mê giúp học viên cải thiện kỹ năng speaking và tự tin giao tiếp."
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Specialties */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30">
                            <div className="px-6 py-4 border-b border-[#3e4854]/30 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Chuyên môn & Kỹ năng</h3>
                                <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                                    Thêm kỹ năng
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium">IELTS Speaking</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium">Pronunciation</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium">Business English</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium">Grammar</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium">Vocabulary</span>
                                    <span className="px-3 py-1.5 rounded-lg bg-[#3e4854]/30 text-[#9dabb9] text-sm font-medium cursor-pointer hover:bg-[#3e4854]/50 transition-colors">+ Thêm</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-[#9dabb9]">Chứng chỉ</span>
                                        <p className="text-white font-medium">IELTS Band 8.5, TESOL Certificate</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-[#9dabb9]">Kinh nghiệm</span>
                                        <p className="text-white font-medium">8 năm giảng dạy</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="bg-[#283039] rounded-xl border border-[#3e4854]/30">
                            <div className="px-6 py-4 border-b border-[#3e4854]/30">
                                <h3 className="text-lg font-bold text-white">Bảo mật & Đăng nhập</h3>
                            </div>
                            <div className="p-6 flex flex-col gap-6">
                                <div className="flex flex-col gap-4">
                                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">lock</span>
                                        Đổi mật khẩu
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-[#9dabb9]">Mật khẩu hiện tại</span>
                                            <input
                                                className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-[#9dabb9]">Mật khẩu mới</span>
                                            <input
                                                className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-[#9dabb9]">Xác nhận mật khẩu</span>
                                            <input
                                                className="w-full rounded-lg border border-[#3e4854]/30 bg-[#111418] text-white px-4 py-2.5 outline-none focus:border-primary/50 transition-all"
                                                placeholder="••••••••"
                                                type="password"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MentorLayout>
    );
}

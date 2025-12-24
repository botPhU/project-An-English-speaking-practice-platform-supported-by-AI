import { useState } from 'react';
import { Link } from 'react-router-dom';

// Register page - Đăng ký (Learner)
export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement register logic
        console.log('Register:', { fullName, email, password, confirmPassword });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-row font-[Manrope,sans-serif]">
            {/* Left Column: Branding / Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[#1c2127] overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCEF63HPE43O9M8vjvr7QDniaeWdgpQ1WGhSZ5rAezduhNpAf8SCFsB3UmE4ayMksy9oLJOdGs9mQjVo9YnJQT5En6tOKFCBPqkqY1kHi3a-IVy8V2Uxfw9bBloOtn7c6ojNDt1Q4PzSHCW-sy9RyM5E_ocCbJCqFja8kdGBHextRFZgLrXGisdSK7DPVPYKZlywm5To3QC--Vp0S82w1HS9MtUKLWH6WsHLsXi4OAtLloa8oSVd2A61NwH-2_6LWRif3HH3WzBrU')"
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111418] via-[#111418]/60 to-[#2b8cee]/20 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111418]" />

                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-[#2b8cee] text-white shadow-lg shadow-[#2b8cee]/30">
                        <span className="material-symbols-outlined text-[24px]">school</span>
                    </div>
                    <h2 className="text-white text-2xl font-black tracking-tight drop-shadow-md">AESP</h2>
                </div>

                {/* Hero Text Content */}
                <div className="relative z-10 max-w-lg mb-8">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] mb-4 drop-shadow-lg">
                        Bắt đầu hành trình<br />chinh phục tiếng Anh.
                    </h1>
                    <p className="text-white/90 text-lg font-medium leading-relaxed drop-shadow-md">
                        Tham gia cộng đồng AESP để trải nghiệm phương pháp học tiếng Anh hiện đại với AI và mentor chuyên nghiệp.
                    </p>

                    {/* Trust/Feature Badges */}
                    <div className="flex gap-4 mt-8">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                            <span className="material-symbols-outlined text-[#2b8cee] text-[20px]">smart_toy</span>
                            <span className="text-sm font-bold text-white">AI Assistant</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                            <span className="material-symbols-outlined text-[#2b8cee] text-[20px]">groups</span>
                            <span className="text-sm font-bold text-white">Cộng đồng Mentor</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Register Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-24 bg-[#f6f7f8] dark:bg-[#111418] w-full">
                <div className="w-full max-w-[480px] flex flex-col gap-6">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center size-8 rounded-lg bg-[#2b8cee] text-white">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                        </div>
                        <span className="text-[#111418] dark:text-white text-xl font-black tracking-tight">AESP</span>
                    </div>

                    {/* Form Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-[-0.015em]">
                            Tạo tài khoản mới
                        </h1>
                        <p className="text-[#637588] dark:text-[#9dabb9] text-base font-normal leading-normal">
                            Điền thông tin bên dưới để đăng ký tài khoản AESP và bắt đầu học ngay.
                        </p>
                    </div>

                    {/* Register Form */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Full Name Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-white text-base font-medium leading-normal">
                                Họ và tên
                            </label>
                            <div className="flex w-full items-stretch rounded-lg h-14 relative group">
                                <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none z-10 text-[#637588] dark:text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[24px]">badge</span>
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50 border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-[#1c2127] focus:border-[#2b8cee] h-full placeholder:text-[#9dabb9] pl-12 pr-4 text-base font-normal leading-normal transition-all duration-200"
                                    placeholder="Nhập họ và tên của bạn"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-white text-base font-medium leading-normal">
                                Email
                            </label>
                            <div className="flex w-full items-stretch rounded-lg h-14 relative group">
                                <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none z-10 text-[#637588] dark:text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[24px]">mail</span>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50 border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-[#1c2127] focus:border-[#2b8cee] h-full placeholder:text-[#9dabb9] pl-12 pr-4 text-base font-normal leading-normal transition-all duration-200"
                                    placeholder="nhap_email_cua_ban@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-white text-base font-medium leading-normal">
                                Mật khẩu
                            </label>
                            <div className="flex w-full items-stretch rounded-lg h-14 relative group">
                                <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none z-10 text-[#637588] dark:text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[24px]">lock</span>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50 border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-[#1c2127] focus:border-[#2b8cee] h-full placeholder:text-[#9dabb9] pl-12 pr-12 text-base font-normal leading-normal transition-all duration-200"
                                    placeholder="Tối thiểu 8 ký tự"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 bottom-0 pr-4 flex items-center cursor-pointer text-[#637588] dark:text-[#9dabb9] hover:text-[#2b8cee] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[24px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-white text-base font-medium leading-normal">
                                Xác nhận mật khẩu
                            </label>
                            <div className="flex w-full items-stretch rounded-lg h-14 relative group">
                                <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none z-10 text-[#637588] dark:text-[#9dabb9]">
                                    <span className="material-symbols-outlined text-[24px]">lock_reset</span>
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:ring-2 focus:ring-[#2b8cee]/50 border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-[#1c2127] focus:border-[#2b8cee] h-full placeholder:text-[#9dabb9] pl-12 pr-12 text-base font-normal leading-normal transition-all duration-200"
                                    placeholder="Nhập lại mật khẩu"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-0 top-0 bottom-0 pr-4 flex items-center cursor-pointer text-[#637588] dark:text-[#9dabb9] hover:text-[#2b8cee] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[24px]">
                                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3 mt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 w-4 h-4 rounded border-[#dce0e5] dark:border-[#3b4754] text-[#2b8cee] focus:ring-[#2b8cee] cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-[#637588] dark:text-[#9dabb9] text-sm font-normal leading-normal cursor-pointer">
                                Tôi đồng ý với <a className="text-[#2b8cee] hover:underline font-medium">Điều khoản dịch vụ</a> và <a className="text-[#2b8cee] hover:underline font-medium">Chính sách bảo mật</a> của AESP.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#2b8cee] hover:bg-[#2b8cee]/90 text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-200 shadow-lg shadow-[#2b8cee]/20 mt-2"
                        >
                            <span className="truncate">Đăng ký</span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 text-[#637588] dark:text-[#9dabb9] text-sm font-medium">
                        <div className="h-px flex-1 bg-[#dce0e5] dark:bg-[#3b4754]" />
                        <span>Hoặc đăng ký với</span>
                        <div className="h-px flex-1 bg-[#dce0e5] dark:bg-[#3b4754]" />
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex cursor-pointer items-center justify-center gap-3 rounded-lg h-12 px-4 border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-[#1c2127] hover:bg-gray-50 dark:hover:bg-[#252b32] transition-colors">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAef47g2nr3-z9TCc8XM495uiyiBnzNWsFZSZm7oXkG2qL_w5ia1EfXt8POqCxFsjSftqT_BMNoFwBp5SDHl6xW4Xzmuiwfn1z2J4KpurzTxdAUCK7hBe3PsoqlHhcXL3pkLmaj60L_A2C-hTwECaIIXLUjw2qo5w_X5jza5plyM1dkJnr-Khwgd4M7b0LSF_pkXEoQIRUZ1VmNrBqPXmE3crVdsQK7zvjiapynWjrbyWUE4KjYx5VUp0Y8yNBCAZlAJuePtJ-2E9Q"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            <span className="text-[#111418] dark:text-white text-sm font-bold">Google</span>
                        </button>
                        <button className="flex cursor-pointer items-center justify-center gap-3 rounded-lg h-12 px-4 border border-[#dce0e5] dark:border-[#3b4754] bg-white dark:bg-[#1c2127] hover:bg-gray-50 dark:hover:bg-[#252b32] transition-colors">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrZ4mPLTl9vgD-MnFlRCYeLqDXGZFKC3_e5GDtB6nOqj-h8rskVx3LtKuLQwl5tVO_PSLQxBex3G8zM13LOB2wz9tcPWhtQFVRB-8kKDbM2knIGQst3M-wgqY4dLp2KQ9wTP0K4hYvgu8OaXx6iICawEuP5w15Wk117kVXycD3iMp9qiBHW6UgycText1K5rcifznYPjJnQESyrJ5yL3Ck5uWK5_NJUMmlCzA8g6JavdazJgeWKBzg9SwiQC3vZ7goDTvySfykfas"
                                alt="Facebook"
                                className="w-5 h-5"
                            />
                            <span className="text-[#111418] dark:text-white text-sm font-bold">Facebook</span>
                        </button>
                    </div>

                    {/* Login Footer */}
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <p className="text-[#637588] dark:text-[#9dabb9] text-base font-normal">Đã có tài khoản?</p>
                        <Link to="/login" className="text-[#2b8cee] hover:text-[#2b8cee]/80 text-base font-bold transition-colors cursor-pointer">
                            Đăng nhập
                        </Link>
                    </div>

                    {/* Bottom Links */}
                    <div className="flex justify-center gap-6 mt-2 opacity-60">
                        <a className="text-xs text-[#637588] dark:text-[#9dabb9] hover:underline cursor-pointer">Điều khoản</a>
                        <a className="text-xs text-[#637588] dark:text-[#9dabb9] hover:underline cursor-pointer">Bảo mật</a>
                        <a className="text-xs text-[#637588] dark:text-[#9dabb9] hover:underline cursor-pointer">Trợ giúp</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
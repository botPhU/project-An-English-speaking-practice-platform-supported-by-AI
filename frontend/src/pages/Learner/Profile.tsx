import LearnerLayout from '../../layouts/LearnerLayout';

export default function Profile() {
  return (
    <LearnerLayout title="Hồ Sơ Học Viên">
      <div className="w-full max-w-[1080px] mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">
              Hồ sơ của tôi
            </h1>
            <p className="text-text-secondary text-base font-normal">
              Quản lý thông tin cá nhân, mục tiêu học tập và sở thích của bạn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-dark rounded-xl p-6 border border-border-dark flex flex-col items-center text-center shadow-sm">
              <div className="relative group cursor-pointer">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-background-dark"
                  style={{
                    backgroundImage:
                      'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Alex")'
                  }}
                />
                <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-background-dark flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                Trần Minh Anh
              </h2>
              <p className="text-text-secondary text-sm">
                @minhanh_hocvien
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                  <span className="material-symbols-outlined text-base">
                    verified
                  </span>
                  Trình độ B2
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-500">
                  <span className="material-symbols-outlined text-base">
                    local_fire_department
                  </span>
                  Chuỗi 12 ngày
                </span>
              </div>
              <div className="w-full h-px bg-border-dark my-6" />
              <div className="w-full flex flex-col gap-4 text-left">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Mục tiêu hiện tại
                  </p>
                  <div className="w-full bg-background-dark rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                  <p className="text-xs text-right mt-1 text-text-secondary">
                    65% đến C1 Cao cấp
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-text-secondary">
                    Thành viên từ
                  </p>
                  <p className="text-sm font-medium text-white">
                    Tháng 9, 2023
                  </p>
                </div>
              </div>
            </div>

            {/* Voice Calibration */}
            <div className="bg-surface-dark rounded-xl p-6 border border-border-dark shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">
                  Hiệu chỉnh giọng nói
                </h3>
                <span className="material-symbols-outlined text-primary">
                  mic
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Lần cuối 2 tuần trước. Cập nhật để AI phản hồi chuẩn xác hơn.
              </p>
              <button className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 bg-background-dark border border-border-dark text-white hover:bg-white/5 transition-colors text-sm font-medium">
                <span className="material-symbols-outlined text-lg">
                  graphic_eq
                </span>
                Ghi mẫu giọng mới
              </button>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Personal Info */}
            <div className="bg-surface-dark rounded-xl border border-border-dark shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-dark flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">
                  Thông tin cá nhân
                </h3>
                <button className="text-sm text-primary font-medium hover:underline">
                  Chỉnh sửa
                </button>
              </div>
              <div className="p-6 grid gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Họ và tên
                  </span>
                  <input
                    className="form-input w-full rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500 text-sm"
                    type="text"
                    defaultValue="Trần Minh Anh"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Địa chỉ Email
                  </span>
                  <input
                    className="form-input w-full rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500 text-sm"
                    type="email"
                    defaultValue="minhanh@vidu.com"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Ngôn ngữ mẹ đẻ
                  </span>
                  <div className="relative">
                    <select className="form-select w-full appearance-none rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary text-sm">
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">Tiếng Anh</option>
                      <option value="zh">Tiếng Trung</option>
                      <option value="kr">Tiếng Hàn</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                      <span className="material-symbols-outlined text-sm">
                        expand_more
                      </span>
                    </div>
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Múi giờ
                  </span>
                  <div className="relative">
                    <select className="form-select w-full appearance-none rounded-lg border border-border-dark bg-background-dark px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary text-sm">
                      <option>(GMT+07:00) Hà Nội, Bangkok</option>
                      <option>(GMT+08:00) Singapore</option>
                      <option>(GMT+09:00) Tokyo</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary">
                      <span className="material-symbols-outlined text-sm">
                        expand_more
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-surface-dark rounded-xl border border-border-dark shadow-sm">
              <div className="px-6 py-4 border-b border-border-dark">
                <h3 className="text-lg font-bold text-white">
                  Mục tiêu &amp; Sở thích học tập
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-white">
                    Mục đích học tiếng Anh của bạn là gì?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Thăng tiến sự nghiệp', 'Du lịch', 'Luyện thi (IELTS/TOEFL)', 'Giao tiếp xã hội', 'Giải trí'].map((goal, i) => (
                      <label key={goal} className="cursor-pointer">
                        <input
                          defaultChecked={i < 2}
                          className="peer sr-only"
                          type="checkbox"
                        />
                        <div className="rounded-md border border-border-dark bg-transparent px-4 py-2 text-sm font-medium text-text-secondary transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                          {goal}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-white">
                    Phong cách sửa lỗi của AI
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="relative flex cursor-pointer rounded-lg border border-border-dark p-4 focus:outline-none has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        defaultChecked
                        className="sr-only"
                        name="correction-style"
                        type="radio"
                      />
                      <span className="flex flex-col">
                        <span className="block text-sm font-bold text-white">
                          Hướng dẫn nhẹ nhàng
                        </span>
                        <span className="mt-1 flex items-center text-xs text-text-secondary">
                          Sửa lỗi sau khi tôi nói xong. Chú trọng sự trôi chảy.
                        </span>
                      </span>
                    </label>
                    <label className="relative flex cursor-pointer rounded-lg border border-border-dark p-4 focus:outline-none has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        className="sr-only"
                        name="correction-style"
                        type="radio"
                      />
                      <span className="flex flex-col">
                        <span className="block text-sm font-bold text-white">
                          Gia sư nghiêm khắc
                        </span>
                        <span className="mt-1 flex items-center text-xs text-text-secondary">
                          Ngắt lời ngay khi sai. Chú trọng độ chính xác.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-white">
                      Mục tiêu luyện tập hàng ngày
                    </label>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      30 phút
                    </span>
                  </div>
                  <input
                    className="w-full h-2 bg-border-dark rounded-lg appearance-none cursor-pointer accent-primary"
                    max={60}
                    min={5}
                    step={5}
                    type="range"
                    defaultValue={30}
                  />
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>5p</span>
                    <span>15p</span>
                    <span>30p</span>
                    <span>45p</span>
                    <span>60p</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-surface-dark rounded-xl border border-border-dark shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-border-dark">
                <h3 className="text-lg font-bold text-white">
                  Quyền riêng tư &amp; Bảo mật
                </h3>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      Hiển thị hồ sơ
                    </span>
                    <span className="text-xs text-text-secondary">
                      Ai có thể xem thống kê và hồ sơ của bạn.
                    </span>
                  </div>
                  <div className="flex items-center rounded-lg bg-background-dark p-1 border border-border-dark">
                    <button className="rounded-md bg-surface-dark px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all">
                      Công khai
                    </button>
                    <button className="rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-white transition-all">
                      Chỉ Mentor
                    </button>
                    <button className="rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-white transition-all">
                      Riêng tư
                    </button>
                  </div>
                </div>
                <div className="w-full h-px bg-border-dark" />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      Mật khẩu
                    </span>
                    <span className="text-xs text-text-secondary">
                      Thay đổi lần cuối 3 tháng trước.
                    </span>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-border-dark bg-transparent text-sm font-bold text-white hover:bg-white/5 transition-colors">
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>

            {/* Save Actions */}
            <div className="flex justify-end gap-4 py-4">
              <button className="px-6 py-2.5 rounded-lg border border-transparent text-text-secondary font-bold text-sm hover:text-white transition-colors">
                Hủy
              </button>
              <button className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">save</span>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </LearnerLayout>
  );
}

# Hướng Dẫn Tạo Trang Admin Mới

Tài liệu này hướng dẫn cách tạo một trang Admin mới sử dụng `AdminLayout` component chung.

---

## 📁 Cấu trúc thư mục

```
frontend/src/
├── components/
│   └── layout/
│       ├── AdminLayout.tsx    # Layout wrapper chung
│       ├── AdminSidebar.tsx   # Sidebar navigation
│       └── index.ts           # Export barrel
├── pages/
│   └── Admin/
│       ├── Dashboard.tsx
│       ├── FeedbackModeration.tsx
│       ├── LearnerSupport.tsx
│       └── [YourNewPage].tsx  # Trang mới của bạn
├── routes/
│   └── paths.ts               # Định nghĩa routes
└── App.tsx                    # Router configuration
```

---

## 🚀 Bước 1: Tạo Component Trang Mới

Tạo file mới trong `src/pages/Admin/YourNewPage.tsx`:

```tsx
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout';

// ============================================
// 1. ĐỊNH NGHĨA TYPES
// ============================================
interface YourDataType {
    id: string;
    name: string;
    status: 'active' | 'pending' | 'inactive';
    createdAt: string;
}

// ============================================
// 2. MOCK DATA (sau này thay bằng API call)
// ============================================
const mockData: YourDataType[] = [
    {
        id: '1',
        name: 'Item 1',
        status: 'active',
        createdAt: '20/12/2024'
    },
    // ... thêm data mẫu
];

// ============================================
// 3. COMPONENT CHÍNH
// ============================================
const YourNewPage: React.FC = () => {
    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedItem, setSelectedItem] = useState<YourDataType | null>(null);

    // Filter logic
    const filteredData = mockData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Render status badge
    const getStatusBadge = (status: YourDataType['status']) => {
        const config = {
            active: { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Hoạt động' },
            pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Chờ xử lý' },
            inactive: { bg: 'bg-gray-500/20', text: 'text-gray-500', label: 'Không hoạt động' }
        };
        const c = config[status];
        return (
            <span className={`${c.bg} ${c.text} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                {c.label}
            </span>
        );
    };

    return (
        <AdminLayout 
            title="Tiêu Đề Trang"
            subtitle="Mô tả ngắn về trang này"
            icon="settings"  // Icon từ Material Symbols
            actions={
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Thêm mới
                </button>
            }
        >
            <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
                {/* STATS SECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat Card */}
                    <div className="bg-[#283039] border border-[#3b4754] rounded-xl p-5">
                        <div className="flex justify-between items-start">
                            <p className="text-[#9dabb9] text-sm">Tổng số</p>
                            <span className="material-symbols-outlined text-primary">analytics</span>
                        </div>
                        <p className="text-white text-3xl font-bold mt-2">123</p>
                        <p className="text-[#0bda5b] text-xs mt-1">+12% so với tháng trước</p>
                    </div>
                    {/* Thêm các stat cards khác */}
                </div>

                {/* SEARCH & FILTER */}
                <div className="flex flex-col md:flex-row gap-4 bg-[#283039]/50 p-4 rounded-xl border border-[#3b4754]">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9dabb9]">
                            search
                        </span>
                        <input
                            type="text"
                            className="w-full bg-[#1a222a] border border-[#3b4754] text-white rounded-lg pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-primary"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-[#1a222a] border border-[#3b4754] text-white rounded-lg px-4 py-2.5"
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="pending">Chờ xử lý</option>
                    </select>
                </div>

                {/* DATA TABLE */}
                <div className="bg-[#1a222a] border border-[#3b4754] rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#283039] border-b border-[#3b4754]">
                            <tr>
                                <th className="p-4 text-xs text-[#9dabb9] uppercase">ID</th>
                                <th className="p-4 text-xs text-[#9dabb9] uppercase">Tên</th>
                                <th className="p-4 text-xs text-[#9dabb9] uppercase">Trạng thái</th>
                                <th className="p-4 text-xs text-[#9dabb9] uppercase text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3b4754]">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-[#283039] transition-colors">
                                    <td className="p-4 text-[#9dabb9]">{item.id}</td>
                                    <td className="p-4 text-white">{item.name}</td>
                                    <td className="p-4">{getStatusBadge(item.status)}</td>
                                    <td className="p-4 text-right">
                                        <button className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default YourNewPage;
```

---

## 🛤️ Bước 2: Thêm Route

### File `src/routes/paths.ts`:
```ts
export const ADMIN_ROUTES = {
    DASHBOARD: '/admin',
    USER_MANAGEMENT: '/admin/users',
    // ... routes hiện có
    YOUR_NEW_PAGE: '/admin/your-page',  // ← Thêm dòng này
};
```

### File `src/App.tsx`:
```tsx
import YourNewPage from './pages/Admin/YourNewPage'

// Trong <Routes>:
<Route path="/admin/your-page" element={<YourNewPage />} />
```

---

## 📍 Bước 3: Thêm vào Sidebar

### File `src/components/layout/AdminSidebar.tsx`:
```tsx
const navItems: NavItem[] = [
    { path: ADMIN_ROUTES.DASHBOARD, icon: 'dashboard', label: 'Bảng điều khiển' },
    // ... items hiện có
    { path: ADMIN_ROUTES.YOUR_NEW_PAGE, icon: 'your_icon', label: 'Trang của bạn' },
];
```

---

## 🎨 CSS Classes Thường Dùng

### Backgrounds & Borders
| Thành phần | Class |
|------------|-------|
| Background chính | `bg-[#111418]` |
| Background card | `bg-[#283039]` hoặc `bg-[#1a222a]` |
| Border màu | `border-[#3b4754]` |
| Text chính | `text-white` |
| Text phụ | `text-[#9dabb9]` |

### Buttons
```tsx
// Primary button
<button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg">

// Secondary button  
<button className="bg-[#283039] hover:bg-[#3b4754] border border-[#3b4754] text-white px-4 py-2 rounded-lg">

// Icon button
<button className="p-1.5 hover:bg-primary/20 text-[#9dabb9] hover:text-primary rounded-lg">
```

### Status Badges
```tsx
// Success
<span className="bg-[#0bda5b]/20 text-[#0bda5b] px-2.5 py-0.5 rounded-full text-xs">

// Warning
<span className="bg-yellow-500/20 text-yellow-500 px-2.5 py-0.5 rounded-full text-xs">

// Error
<span className="bg-red-500/20 text-red-500 px-2.5 py-0.5 rounded-full text-xs">

// Info
<span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs">
```

---

## 📋 Material Symbols Icons

Một số icons thường dùng:
- `dashboard` - Bảng điều khiển
- `group` - Người dùng
- `verified` - Xác minh
- `chat_bubble` - Tin nhắn
- `support_agent` - Hỗ trợ
- `inventory_2` - Gói/Sản phẩm
- `analytics` - Báo cáo
- `policy` - Chính sách
- `settings` - Cài đặt
- `visibility` - Xem
- `edit` - Sửa
- `delete` - Xóa
- `add` - Thêm
- `search` - Tìm kiếm
- `filter_list` - Lọc

Xem thêm tại: https://fonts.google.com/icons

---

## ✅ Checklist Tạo Trang Mới

- [ ] Tạo file component trong `src/pages/Admin/`
- [ ] Import `AdminLayout` từ `../../components/layout`
- [ ] Định nghĩa TypeScript interfaces
- [ ] Tạo mock data
- [ ] Implement state management (search, filter, selection)
- [ ] Tạo UI với stats, search/filter, table
- [ ] Thêm route trong `paths.ts`
- [ ] Thêm route trong `App.tsx`
- [ ] Thêm menu item trong `AdminSidebar.tsx`
- [ ] Test trên browser

---

## 🔧 AdminLayout Props

```tsx
interface AdminLayoutProps {
    children: React.ReactNode;     // Nội dung trang
    title: string;                 // Tiêu đề hiển thị ở header
    subtitle?: string;             // Mô tả phụ (tùy chọn)
    icon?: string;                 // Icon Material Symbols (mặc định: 'monitor_heart')
    actions?: React.ReactNode;     // Các nút action ở header (tùy chọn)
}
```

---

*Tài liệu được tạo cho dự án AESP - English Speaking Practice Platform*

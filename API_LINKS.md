# AESP Platform - API & Page Links

## 🌐 Frontend Pages (http://localhost:5173)

| Trang | Link | Mô tả |
|-------|------|-------|
| **Trang chủ** | http://localhost:5173 | Landing page |
| **Đăng nhập** | http://localhost:5173/login | Trang đăng nhập |
| **Đăng ký** | http://localhost:5173/register | Trang đăng ký |

### 👨‍💼 Admin Dashboard
| Trang | Link |
|-------|------|
| Dashboard | http://localhost:5173/admin |
| Quản lý người dùng | http://localhost:5173/admin/users |
| Phê duyệt Mentor | http://localhost:5173/admin/mentors |
| Quản lý gói học | http://localhost:5173/admin/packages |
| Kiểm duyệt nội dung | http://localhost:5173/admin/feedback |
| Hỗ trợ người học | http://localhost:5173/admin/support |
| Báo cáo & Phân tích | http://localhost:5173/admin/reports |
| Quản lý chính sách | http://localhost:5173/admin/policies |
| Hồ sơ cá nhân | http://localhost:5173/admin/profile |
| Cài đặt | http://localhost:5173/admin/settings |

### 👨‍🏫 Mentor Dashboard
| Trang | Link |
|-------|------|
| Dashboard | http://localhost:5173/mentor |
| Tin nhắn | http://localhost:5173/mentor/messages |
| Lịch sử luyện nói | http://localhost:5173/mentor/speaking-history |
| Đánh giá học viên | http://localhost:5173/mentor/assessments |
| Phản hồi & Đánh giá | http://localhost:5173/mentor/feedback |
| Tình huống thực tế | http://localhost:5173/mentor/situations |
| Chủ đề hội thoại | http://localhost:5173/mentor/topics |
| Lỗi phát âm | http://localhost:5173/mentor/pronunciation |
| Lỗi ngữ pháp | http://localhost:5173/mentor/grammar |
| Tài liệu | http://localhost:5173/mentor/resources |
| Hồ sơ | http://localhost:5173/mentor/profile |

### 👨‍🎓 Learner Dashboard
| Trang | Link |
|-------|------|
| Dashboard | http://localhost:5173/learner |
| Luyện nói AI | http://localhost:5173/learner/speaking-drills |
| Cộng đồng | http://localhost:5173/learner/community |
| Mentor của tôi | http://localhost:5173/learner/mentors |
| Tiến độ học tập | http://localhost:5173/learner/progress |
| Hồ sơ | http://localhost:5173/learner/profile |

---

## 🔌 Backend API (http://localhost:5000)

### 📚 API Documentation
| Trang | Link | Mô tả |
|-------|------|-------|
| **Swagger UI** | http://localhost:5000/docs | Giao diện test API |
| **API Spec JSON** | http://localhost:5000/apispec.json | OpenAPI specification |

### 🔐 Authentication API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/logout` | Đăng xuất |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |

### 👨‍💼 Admin API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/dashboard` | Dashboard data |
| GET | `/api/admin/dashboard/stats` | Thống kê tổng quan |
| GET | `/api/admin/users` | Danh sách users |
| GET | `/api/admin/mentors` | Danh sách mentors |
| GET | `/api/admin/mentors/pending` | Mentors chờ phê duyệt |
| POST | `/api/admin/mentors/{id}/approve` | Phê duyệt mentor |
| POST | `/api/admin/mentors/{id}/reject` | Từ chối mentor |
| GET | `/api/admin/packages` | Danh sách gói học |
| POST | `/api/admin/packages` | Tạo gói học mới |
| PUT | `/api/admin/packages/{id}` | Cập nhật gói học |
| GET | `/api/admin/policies` | Danh sách chính sách |
| POST | `/api/admin/policies` | Tạo chính sách mới |

### 👨‍🏫 Mentor API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/mentor/dashboard` | Dashboard data |
| GET | `/api/mentor/learners` | Danh sách học viên |
| GET | `/api/mentor/sessions` | Lịch sử sessions |
| POST | `/api/mentor/assessments` | Đánh giá học viên |

### 👨‍🎓 Learner API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/learner/dashboard` | Dashboard data |
| GET | `/api/learner/mentors` | Danh sách mentors |
| GET | `/api/learner/sessions` | Lịch sử luyện tập |
| POST | `/api/learner/sessions` | Tạo session mới |

### ✅ Todo API (Demo)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/todos` | Lấy tất cả todos |
| POST | `/api/todos` | Tạo todo mới |
| GET | `/api/todos/{id}` | Lấy todo theo ID |
| PUT | `/api/todos/{id}` | Cập nhật todo |
| DELETE | `/api/todos/{id}` | Xóa todo |

---

## 🚀 Quick Start

```bash
# Start backend & frontend
.\FIX_AND_START.bat

# Or manually:
cd Flask-CleanArchitecture\src && python main.py  # Backend
cd frontend && npm run dev                         # Frontend
```

## 📝 Notes

- Backend mặc định chạy ở port **5000**
- Frontend mặc định chạy ở port **5173**
- Swagger UI tại: http://localhost:5000/docs

# AESP - AI English Speaking Practice Platform

**Nền tảng luyện nói tiếng Anh có sự hỗ trợ của AI**

## 📋 Giới thiệu

AESP là một ứng dụng web hỗ trợ người học tiếng Anh luyện tập kỹ năng nói trong môi trường không áp lực. AI đóng vai trò như một trợ lý hội thoại, cung cấp từ vựng, câu mẫu, và phản hồi phát âm ngay lập tức.

## 👥 Đối tượng sử dụng

| Role | Mô tả |
|------|-------|
| **Admin** | Quản lý hệ thống, tài khoản, gói dịch vụ, thống kê |
| **Mentor** | Đánh giá, hướng dẫn, và cung cấp feedback cho learner |
| **Learner** | Luyện nói với AI, theo dõi tiến độ, tham gia challenges |

## 📁 Cấu trúc dự án

```
AESP/
├── Flask-CleanArchitecture/    # 🔧 BACKEND (Python/Flask)
│   └── src/
│       ├── api/                # API endpoints
│       ├── domain/             # Business logic
│       ├── infrastructure/     # Database, external services
│       └── ...
│
└── frontend/                    # 🎨 FRONTEND (React + TypeScript)
    └── src/
        ├── pages/              # Giao diện theo role
        │   ├── Admin/          # Dashboard, quản lý user/mentor/package
        │   ├── Learner/        # Luyện nói, progress, challenges
        │   ├── Mentor/         # Đánh giá, feedback, resources
        │   └── Auth/           # Login/Register
        ├── components/         # UI components
        ├── services/           # API calls
        └── types/              # TypeScript definitions
```

## 🛠️ Công nghệ sử dụng

### Backend
- Python, Flask
- PostgreSQL / MySQL
- Azure, Aiven, Cloudinary

### Frontend
- React + TypeScript
- Vite

## 🚀 Cách chạy dự án

### Backend
```bash
cd Flask-CleanArchitecture/src
pip install -r requirements.txt
python create_app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 License

© 2024 AESP Team

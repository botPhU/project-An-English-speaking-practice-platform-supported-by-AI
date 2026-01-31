# 🎤 AESP - AI English Speaking Practice Platform

**Nền tảng luyện nói tiếng Anh có sự hỗ trợ của AI và Mentor thực**

## 📋 Giới Thiệu

AESP giúp người học tiếng Anh luyện tập kỹ năng nói trong môi trường không áp lực:
- 🤖 **AI Conversation**: Luyện nói với AI, nhận feedback phát âm real-time
- 👨‍🏫 **Mentor Support**: Được hướng dẫn bởi mentor chuyên nghiệp
- 📊 **Progress Tracking**: Theo dõi tiến độ học tập chi tiết
- 🏆 **Gamification**: Challenges, streaks, leaderboard

## 👥 Vai Trò Người Dùng

| Role | Mô tả |
|------|-------|
| **Admin** | Quản lý hệ thống, phân công mentor, thống kê |
| **Mentor** | Video call, đánh giá, feedback cho learner |
| **Learner** | Luyện nói AI, chat mentor, tham gia community |

## 🛠️ Công Nghệ

| Layer | Stack |
|-------|-------|
| **Backend** | Python, Flask, SQLAlchemy, Socket.IO |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Database** | MySQL (Railway cloud) |
| **Video Call** | Jitsi Meet |
| **AI** | Google Gemini API |

## 🚀 Khởi Động Nhanh

### 1-Click Start (Khuyên dùng)
```batch
.\FIX_AND_START.bat
```

### Chạy Thủ Công

**Backend:**
```bash
cd Flask-CleanArchitecture/src
..\..\.venv\Scripts\activate
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Cấu Trúc Dự Án

```
AESP/
├── Flask-CleanArchitecture/   # Backend (Python/Flask)
│   └── src/
│       ├── api/controllers/   # API endpoints
│       ├── services/          # Business logic  
│       ├── infrastructure/    # Database models
│       └── scripts/           # Migration SQL
│
├── frontend/                   # Frontend (React)
│   └── src/
│       ├── pages/             # Admin, Learner, Mentor views
│       ├── components/        # UI components
│       └── services/          # API calls
│
├── FIX_AND_START.bat          # 1-click starter
├── TROUBLESHOOTING.md         # Hướng dẫn sửa lỗi
└── DATABASE_SETUP.md          # Hướng dẫn cài database
```

## 🔗 Links

- **Local Frontend**: http://localhost:5173
- **Local Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/docs

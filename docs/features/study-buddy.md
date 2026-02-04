# Study Buddy (Luyện nói với bạn học)

## Tổng quan

Tính năng Study Buddy cho phép người học ghép cặp với người học khác có cùng trình độ để luyện nói tiếng Anh theo chủ đề.

## API Endpoints

### 1. Find Buddies
```
GET /api/study-buddy/find?user_id={id}&level={level}&limit=10
```

### 2. Request Match
```
POST /api/study-buddy/match
Body: { "user_id": 1, "topic": "business", "level": "B1" }
```

### 3. Check Status
```
GET /api/study-buddy/status?user_id={id}
```

### 4. Cancel Request
```
POST /api/study-buddy/cancel
Body: { "user_id": 1 }
```

### 5. End Session
```
POST /api/study-buddy/end
Body: { "user_id": 1 }
```

---

## Topics

| ID | Label |
|----|-------|
| daily | 🏠 Đời sống hàng ngày |
| business | 💼 Kinh doanh |
| travel | ✈️ Du lịch |
| technology | 💻 Công nghệ |
| culture | 🎭 Văn hóa |
| health | 🏥 Sức khỏe |

---

## Matching Algorithm

1. User submits match request với topic và level
2. Hệ thống tìm user khác đang chờ với cùng topic/level
3. Nếu tìm thấy → ghép cặp + tạo room video call
4. Nếu không → đưa vào hàng đợi, poll mỗi 3s

---

## Files

| File | Description |
|------|-------------|
| `services/study_buddy_service.py` | Backend service |
| `controllers/study_buddy_controller.py` | 5 API endpoints |
| `services/studyBuddyService.ts` | Frontend service |
| `pages/Learner/StudyBuddy.tsx` | Frontend page |

# Badges & Achievements System

## Tổng quan

Hệ thống huy hiệu và thành tựu cho phép người học thu thập huy hiệu bằng cách hoàn thành các mục tiêu học tập trên nền tảng AESP.

## API Endpoints

### 1. Get All Badges
```
GET /api/badges
```
**Query Parameters:** `category` (optional) - streak, practice, score, level, special

**Response:**
```json
[
  {
    "id": 1,
    "name": "First Step",
    "description": "Hoàn thành ngày học đầu tiên",
    "icon": "👣",
    "category": "streak",
    "rarity": "common",
    "points": 10
  }
]
```

---

### 2. Get User Badges
```
GET /api/badges/user/{user_id}
```

**Response:**
```json
{
  "earned": [...],
  "locked": [...],
  "total_earned": 5,
  "total_available": 20,
  "total_points": 150,
  "completion_percentage": 25.0
}
```

---

### 3. Check & Award Badges
```
POST /api/badges/user/{user_id}/check
```
Kiểm tra và tự động trao huy hiệu nếu đủ điều kiện.

---

### 4. Get Badge Progress
```
GET /api/badges/user/{user_id}/progress
```
Xem tiến độ đến huy hiệu tiếp theo trong mỗi category.

---

### 5. Get Recent Achievements
```
GET /api/badges/user/{user_id}/recent?limit=5
```

---

### 6. Seed Default Badges
```
POST /api/badges/seed
```

---

## Badge Categories

| Category | Icon | Description |
|----------|------|-------------|
| streak | 🔥 | Duy trì streak học tập |
| practice | 💬 | Hoàn thành buổi luyện tập |
| score | ⭐ | Đạt điểm số |
| level | 📈 | Đạt trình độ |
| special | ✨ | Thành tựu đặc biệt |

## Rarity Levels

| Rarity | Color | Điểm thường |
|--------|-------|-------------|
| Common | Xám | 10-50 |
| Rare | Xanh | 100-200 |
| Epic | Tím | 300-500 |
| Legendary | Vàng | 500-1000 |

---

## Default Badges (20)

### Streak (4)
- 👣 First Step - 1 ngày
- 🔥 Week Warrior - 7 ngày
- 🏆 Month Master - 30 ngày
- 💎 Century Champion - 100 ngày

### Practice (4)
- 💬 First Conversation - 1 buổi
- 🎯 Practice Pro - 10 buổi
- 🎤 Speaking Master - 50 buổi
- 🗣️ Fluent Speaker - 100 buổi

### Score (4)
- ⭐ Rising Star - 100 điểm
- 🌟 Score Hunter - 500 điểm
- ✨ Point Master - 1000 điểm
- 🏅 Score Legend - 5000 điểm

### Level (5)
- 🌱 Beginner - A1
- 🌿 Elementary - A2
- 🌳 Intermediate - B1
- 🌲 Upper Intermediate - B2
- 🏔️ Advanced - C1

### Special (3)
- 🌅 Early Bird - Luyện tập trước 7h
- 🦉 Night Owl - Luyện tập sau 22h
- 💯 Perfect Score - Điểm tuyệt đối

---

## Files

| File | Description |
|------|-------------|
| `models/badge_model.py` | Database models |
| `services/badge_service.py` | Business logic |
| `controllers/badge_controller.py` | API endpoints |
| `pages/Learner/Achievements.tsx` | Frontend page |

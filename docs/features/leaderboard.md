# Leaderboard System

## Tổng quan

Hệ thống bảng xếp hạng cho phép người học xem thứ hạng của mình so với các học viên khác trên nền tảng AESP.

## API Endpoints

### 1. Get Global Leaderboard
```
GET /api/leaderboard
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | weekly | `weekly`, `monthly`, or `all-time` |
| limit | int | 10 | Số lượng entries tối đa |

**Response:**
```json
{
  "period": "weekly",
  "entries": [
    {
      "rank": 1,
      "user_id": 123,
      "username": "john_doe",
      "avatar": "https://...",
      "total_score": 5000,
      "level": "B2",
      "streak": 15
    }
  ],
  "total_users": 10
}
```

---

### 2. Get My Rank
```
GET /api/leaderboard/my-rank
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| user_id | int | Yes | ID của người dùng |
| period | string | No | Khoảng thời gian (default: weekly) |

**Response:**
```json
{
  "rank": 5,
  "total_score": 3500,
  "percentile": 85.5,
  "next_rank_score": 4000,
  "users_ahead": 4,
  "users_behind": 20
}
```

---

### 3. Get Top Streaks
```
GET /api/leaderboard/top-streaks
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | int | 10 | Số lượng entries tối đa |

**Response:**
```json
{
  "entries": [
    {
      "rank": 1,
      "user_id": 456,
      "username": "jane_doe",
      "avatar": "https://...",
      "streak": 30
    }
  ]
}
```

---

### 4. Get Category Leaderboard
```
GET /api/leaderboard/categories
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | Yes | `pronunciation`, `grammar`, `vocabulary`, or `overall` |
| limit | int | No | Số lượng entries tối đa (default: 10) |

**Response:**
```json
{
  "category": "pronunciation",
  "entries": [
    {
      "rank": 1,
      "user_id": 789,
      "username": "speaker_pro",
      "avatar": "https://...",
      "score": 95.5
    }
  ]
}
```

---

## Frontend Components

### Leaderboard Page
**Path:** `/learner/leaderboard`

**Features:**
- 🏆 Hiển thị thứ hạng cá nhân với tổng điểm và percentile
- 🌍 Tab "Toàn cầu" với filter theo tuần/tháng/tất cả
- 🔥 Tab "Streak" hiển thị chuỗi ngày học dài nhất
- 📊 Tab "Kỹ năng" với filter theo category

**UI Components:**
- `MyRankCard`: Hiển thị thứ hạng người dùng hiện tại
- `LeaderboardList`: Danh sách xếp hạng với avatar và điểm
- `PeriodFilter`: Bộ lọc thời gian
- `CategoryFilter`: Bộ lọc kỹ năng

---

## Database Models

Sử dụng các models hiện có:
- `ProgressModel`: Lưu trữ điểm số và streak của người dùng
- `LeaderboardEntryModel`: Entries cho bảng xếp hạng (từ `challenge_models.py`)

---

## Files

| File | Description |
|------|-------------|
| `api/controllers/leaderboard_controller.py` | API endpoints |
| `services/challenge_service.py` | Business logic (get_leaderboard) |
| `pages/Learner/Leaderboard.tsx` | Frontend page |

---

## Cách sử dụng

### Learner
1. Đăng nhập vào hệ thống
2. Truy cập menu "Bảng xếp hạng"
3. Xem thứ hạng cá nhân ở phần đầu trang
4. Chuyển đổi giữa các tab để xem các loại xếp hạng khác nhau
5. Sử dụng filter để xem theo khoảng thời gian hoặc kỹ năng cụ thể

### Tính điểm
- Điểm được cộng dồn từ các buổi luyện tập
- Streak được tính theo số ngày liên tiếp có luyện tập
- Điểm kỹ năng riêng biệt cho phát âm, ngữ pháp, từ vựng

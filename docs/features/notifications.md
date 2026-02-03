# Notifications System

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications/user/{id}` | GET | Lấy danh sách thông báo |
| `/api/notifications/user/{id}/unread-count` | GET | Đếm thông báo chưa đọc |
| `/api/notifications/` | POST | Tạo thông báo (Admin) |
| `/api/notifications/bulk` | POST | Gửi thông báo hàng loạt |
| `/api/notifications/{id}/read` | PUT | Đánh dấu đã đọc |
| `/api/notifications/user/{id}/read-all` | PUT | Đánh dấu tất cả đã đọc |
| `/api/notifications/{id}` | DELETE | Xóa thông báo |

---

## Notification Types

| Type | Icon | Description |
|------|------|-------------|
| achievement | 🏆 | Đạt huy hiệu |
| assignment | 📝 | Bài tập mới |
| reminder | ⏰ | Nhắc nhở |
| session | 📅 | Lịch học |
| message | 💬 | Tin nhắn |
| system | ⚙️ | Hệ thống |

---

## Files

| File | Description |
|------|-------------|
| `controllers/notification_controller.py` | 7 API endpoints |
| `services/notification_service.py` | Business logic |
| `components/layout/NotificationDropdown.tsx` | Header dropdown |
| `pages/Learner/Notifications.tsx` | Full page view |

---

## Usage

### Frontend Component
```typescript
// Get notifications
GET /api/notifications/user/{userId}?limit=20&offset=0&unread_only=false

// Mark as read
PUT /api/notifications/{notificationId}/read?user_id={userId}

// Mark all as read
PUT /api/notifications/user/{userId}/read-all
```

### Creating Notification (Backend)
```python
NotificationService.create_notification(
    user_id=123,
    title='🏆 Huy hiệu mới',
    message='Bạn đã đạt huy hiệu Week Warrior!',
    notification_type='achievement',
    action_url='/learner/achievements'
)
```

# Admin Features Documentation

## Overview
Các trang quản trị cho hệ thống AESP.

## Admin Pages (15 total)

### Core Pages (đã có)
| Page | Description |
|------|-------------|
| Dashboard | Thống kê tổng quan |
| UserManagement | Quản lý người dùng |
| MentorManagement | Quản lý mentor |
| PackageManagement | Quản lý gói dịch vụ |
| FeedbackModeration | Kiểm duyệt feedback |
| LearnerSupport | Hỗ trợ học viên |
| Reports | Báo cáo |
| Settings | Cài đặt |

### New Pages (vừa tạo)
| Page | File | Features |
|------|------|----------|
| LearningResources | `LearningResources.tsx` | Video/Document/Audio CRUD, filtering, publish toggle |
| BroadcastNotifications | `BroadcastNotifications.tsx` | Target audience, notification types, send functionality |
| ContentModeration | `ContentModeration.tsx` | Comment review, approve/reject, flag handling |
| SystemLogs | `SystemLogs.tsx` | Log levels, sources, filtering, detail view |

---

## API Endpoints Used

### Learning Resources
- `GET /api/resources` - List resources
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Broadcast Notifications
- `GET /api/admin/notifications/broadcast` - List broadcasts
- `POST /api/admin/notifications/broadcast` - Create broadcast
- `POST /api/admin/notifications/broadcast/:id/send` - Send broadcast

### Content Moderation
- `GET /api/admin/moderation/comments` - List comments
- `PUT /api/admin/moderation/comments/:id/approve` - Approve
- `PUT /api/admin/moderation/comments/:id/reject` - Reject
- `DELETE /api/admin/moderation/comments/:id` - Delete

### System Logs
- `GET /api/admin/logs` - Get system logs

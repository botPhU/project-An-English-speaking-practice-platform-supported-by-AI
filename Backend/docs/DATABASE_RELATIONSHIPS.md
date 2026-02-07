# 📊 AESP Database - Giải Thích 56 Bảng & Mối Quan Hệ

> **Tài liệu này giải thích chi tiết mối quan hệ giữa các bảng trong hệ thống AESP (AI English Speaking Practice Platform)**

---

## 📋 Mục Lục

1. [User & Authentication (2 bảng)](#1-user--authentication)
2. [Learning & Practice (5 bảng)](#2-learning--practice)
3. [Subscription & Payment (5 bảng)](#3-subscription--payment)
4. [Challenges & Gamification (7 bảng)](#4-challenges--gamification)
5. [Mentor System (6 bảng)](#5-mentor-system)
6. [Feedback & Reviews (3 bảng)](#6-feedback--reviews)
7. [Messaging & Notifications (3 bảng)](#7-messaging--notifications)
8. [Community & Peer Learning (4 bảng)](#8-community--peer-learning)
9. [Support & Admin (5 bảng)](#9-support--admin)
10. [Learning Content (11 bảng)](#10-learning-content)
11. [Legacy & Utility (5 bảng)](#11-legacy--utility)

---

## 🔑 Ký Hiệu Quan Hệ

| Ký hiệu | Ý nghĩa | Ví dụ |
|---------|---------|-------|
| `1-1` | One-to-One | 1 user → 1 progress |
| `1-N` | One-to-Many | 1 user → N purchases |
| `N-N` | Many-to-Many | N users ↔ N courses |
| `FK` | Foreign Key | user_id → flask_user.id |
| `UNIQUE` | Constraint đảm bảo 1-1 | |

---

## 1. User & Authentication

### Table 1: `flask_user`
**Bảng trung tâm** - Lưu thông tin TẤT CẢ người dùng (Admin, Mentor, Learner)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | learner_profile | 1-1 | Mỗi user có 1 profile chi tiết |
| Là nguồn | learner_progress | 1-1 | Mỗi learner có 1 bản ghi tiến độ |
| Là nguồn | purchases | 1-N | 1 user mua nhiều gói |
| Là nguồn | mentor_bookings | 1-N | 1 user đặt/nhận nhiều booking |
| Là nguồn | messages | 1-N | 1 user gửi/nhận nhiều tin nhắn |

**Tại sao thiết kế này?**
> Thay vì tạo 3 bảng riêng (admin, mentor, learner), dùng 1 bảng `flask_user` với trường `role` để phân biệt. Giúp đơn giản hóa authentication và quan hệ FK.

---

### Table 2: `learner_profile`
**Mở rộng thông tin** cho Learner (preferences, learning goals)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | 1-1 | `user_id UNIQUE` → mỗi user chỉ có 1 profile |

**Tại sao tách riêng?**
> Không phải tất cả user cần thông tin này (Admin, Mentor không cần). Tách riêng giúp bảng `flask_user` gọn nhẹ.

---

## 2. Learning & Practice

### Table 3: `courses`
**Khóa học** trong hệ thống

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | course_register | 1-N | 1 course có nhiều người đăng ký |
| Là nguồn | feedbacks | 1-N | 1 course nhận nhiều đánh giá |

---

### Table 4: `course_register`
**Bảng trung gian** cho quan hệ N-N giữa User và Course

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | Nhiều đăng ký thuộc 1 user |
| FK | courses | N-1 | Nhiều đăng ký thuộc 1 course |

**Tại sao cần bảng này?**
> Quan hệ Many-to-Many không thể lưu trực tiếp. Bảng trung gian cho phép:
> - 1 user đăng ký nhiều courses
> - 1 course có nhiều users đăng ký
> - Lưu thêm info: ngày đăng ký, tiến độ %

---

### Table 5: `learner_progress`
**Tiến độ học tập** tổng hợp của Learner

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | 1-1 | `user_id UNIQUE` → 1 user = 1 progress |

**Tại sao 1-1?**
> Mỗi learner chỉ có ĐÚNG 1 bản ghi progress tập trung. Cập nhật liên tục thay vì tạo mới.

---

### Table 6: `practice_sessions`
**Phiên luyện tập** với AI hoặc Mentor

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (user_id) | N-1 | Learner tạo session |
| FK | flask_user (mentor_id) | N-1 | Mentor tham gia (nullable) |
| Là nguồn | mentor_feedbacks | 1-N | 1 session có thể có nhiều feedback |

**Tại sao mentor_id nullable?**
> Session có thể là `ai_only` (chỉ với AI) → không cần mentor.

---

### Table 7: `assessments`
**Bài đánh giá trình độ** (initial test, periodic test)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user làm nhiều bài đánh giá |

**Tại sao 1-N?**
> User làm nhiều bài: initial assessment, weekly, monthly, level-up test.

---

## 3. Subscription & Payment

### Table 8: `packages`
**Gói dịch vụ** (Basic, Premium, Pro)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | purchases | 1-N | 1 package được mua nhiều lần |

---

### Table 9: `purchases`
**Giao dịch mua gói** dịch vụ

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user mua nhiều lần |
| FK | packages | N-1 | 1 package có nhiều lượt mua |

**Tại sao cần bảng này?**
> Tracking lịch sử mua hàng, thời hạn sử dụng, trạng thái thanh toán.

---

### Table 10: `subscription_plans`
**Gói subscription** (monthly, yearly)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | user_subscriptions | 1-N | 1 plan có nhiều người đăng ký |

---

### Table 11: `user_subscriptions`
**Subscription của user** (đang active)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user có thể có nhiều subscription (history) |
| FK | subscription_plans | N-1 | Thuộc về 1 plan |
| Là nguồn | payment_history | 1-N | 1 subscription có nhiều lần thanh toán |

---

### Table 12: `payment_history`
**Lịch sử thanh toán** subscription

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user có nhiều payments |
| FK | user_subscriptions | N-1 | Thuộc về 1 subscription |

**Tại sao tách riêng?**
> Subscription gia hạn hàng tháng → có nhiều lần thanh toán cho 1 subscription.

---

## 4. Challenges & Gamification

### Table 13: `challenges`
**Thử thách** (7-day streak, 100 words, etc.)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | user_challenges | 1-N | 1 challenge có nhiều người tham gia |

---

### Table 14: `user_challenges`
**Tham gia thử thách** của user

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user tham gia nhiều challenges |
| FK | challenges | N-1 | 1 challenge có nhiều participants |

**Đây là quan hệ N-N** được triển khai qua bảng trung gian, có thêm fields: `progress_value`, `is_completed`.

---

### Table 15: `rewards`
**Phần thưởng** có thể đổi bằng XP

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | user_rewards | 1-N | 1 reward được nhận nhiều lần |

---

### Table 16: `user_rewards`
**Phần thưởng đã nhận** của user

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user nhận nhiều rewards |
| FK | rewards | N-1 | 1 reward được nhiều user nhận |

---

### Table 17: `leaderboard_entries`
**Bảng xếp hạng** (daily, weekly, monthly)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user có nhiều entries (khác period) |

**Tại sao 1-N?**
> Mỗi user có entry cho daily, weekly, monthly, all-time → nhiều bản ghi.

---

### Table 18: `achievements`
**Định nghĩa thành tích** (badges)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | user_achievements | 1-N | 1 achievement được nhiều user đạt |

---

### Table 19: `user_achievements`
**Thành tích đã đạt** của user

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user đạt nhiều achievements |
| FK | achievements | N-1 | 1 achievement được nhiều user đạt |

---

## 5. Mentor System

### Table 20: `mentor_applications`
**Đơn đăng ký làm Mentor**

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (user_id) | N-1 | Người nộp đơn |
| FK | flask_user (reviewed_by) | N-1 | Admin review |

**Tại sao N-1?**
> User có thể nộp lại đơn nếu bị reject → nhiều applications.

---

### Table 21: `mentor_assignments`
**Phân công Mentor-Learner** (1-1)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (mentor_id) | 1-1 | `UNIQUE` → 1 mentor = 1 learner |
| FK | flask_user (learner_id) | 1-1 | `UNIQUE` → 1 learner = 1 mentor |
| FK | flask_user (assigned_by) | N-1 | Admin phân công |

**Tại sao 1-1?**
> Business rule: Mỗi Learner chỉ được 1 Mentor, mỗi Mentor chỉ 1 Learner.

---

### Table 22: `mentor_bookings`
**Đặt lịch học** với Mentor

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (learner_id) | N-1 | 1 learner đặt nhiều bookings |
| FK | flask_user (mentor_id) | N-1 | 1 mentor nhận nhiều bookings |
| Là nguồn | reviews | 1-1 | 1 booking → 1 review |
| Là nguồn | video_call_rooms | 1-1 | 1 booking → 1 room |

---

### Table 23: `mentor_feedbacks`
**Đánh giá từ Mentor** cho Learner

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (mentor_id) | N-1 | 1 mentor cho nhiều feedbacks |
| FK | flask_user (learner_id) | N-1 | 1 learner nhận nhiều feedbacks |
| FK | practice_sessions | N-1 | Thuộc về 1 session |

---

### Table 24: `consultants`
**Chuyên gia tư vấn** (legacy)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | appointments | 1-N | 1 consultant có nhiều appointments |

---

### Table 25: `appointments`
**Lịch hẹn tư vấn** (legacy)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user đặt nhiều appointments |
| FK | consultants | N-1 | 1 consultant có nhiều appointments |

---

## 6. Feedback & Reviews

### Table 26: `feedbacks`
**Phản hồi về khóa học**

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user gửi nhiều feedbacks |
| FK | courses | N-1 | 1 course nhận nhiều feedbacks |

---

### Table 27: `feedback`
**Phản hồi hệ thống** (từ user về platform)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user gửi nhiều feedbacks |
| FK | practice_sessions | N-1 | Liên quan đến session |

---

### Table 28: `reviews`
**Đánh giá/Rating** (Learner đánh giá Mentor, peer đánh giá nhau)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (reviewer_id) | N-1 | 1 user viết nhiều reviews |
| FK | flask_user (reviewed_id) | N-1 | 1 user nhận nhiều reviews |
| FK | mentor_bookings | 1-1 | 1 booking → 1 review |

**Tại sao booking → review là 1-1?**
> Mỗi buổi học chỉ được đánh giá 1 lần, tránh spam rating.

---

## 7. Messaging & Notifications

### Table 29: `messages`
**Tin nhắn chat** giữa users

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (sender_id) | N-1 | 1 user gửi nhiều messages |
| FK | flask_user (receiver_id) | N-1 | 1 user nhận nhiều messages |

**Self-referencing relationship**: Cả sender và receiver đều là flask_user.

---

### Table 30: `notifications`
**Thông báo** cho user

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user nhận nhiều notifications |

---

### Table 31: `admin_broadcasts`
**Thông báo hàng loạt** từ Admin

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (admin_id) | N-1 | 1 admin gửi nhiều broadcasts |

---

## 8. Community & Peer Learning

### Table 32: `peer_invitations`
**Lời mời luyện tập** giữa Learners

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (sender_id) | N-1 | 1 user gửi nhiều invitations |
| FK | flask_user (receiver_id) | N-1 | 1 user nhận nhiều invitations |

---

### Table 33: `peer_sessions`
**Phiên luyện tập** giữa 2 Learners

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (learner1_id) | N-1 | Participant 1 |
| FK | flask_user (learner2_id) | N-1 | Participant 2 |

---

### Table 34: `quick_matches`
**Tìm bạn nhanh** để luyện tập

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (user_id) | N-1 | Người tìm |
| FK | flask_user (matched_user_id) | N-1 | Người được match |

---

### Table 35: `study_buddy_matches`
**Ghép đôi học tập** dài hạn

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (user1_id) | N-1 | User 1 |
| FK | flask_user (user2_id) | N-1 | User 2 |

---

## 9. Support & Admin

### Table 36: `support_tickets`
**Ticket hỗ trợ** từ user

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (user_id) | N-1 | 1 user tạo nhiều tickets |
| FK | flask_user (assigned_to) | N-1 | Admin được assign |
| Là nguồn | ticket_messages | 1-N | 1 ticket có nhiều messages |

---

### Table 37: `ticket_messages`
**Tin nhắn trong ticket**

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | support_tickets | N-1 | Thuộc về 1 ticket |
| FK | flask_user (sender_id) | N-1 | Người gửi message |

---

### Table 38: `activity_logs`
**Log hoạt động** hệ thống

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user có nhiều logs |

---

### Table 39: `system_settings`
**Cài đặt hệ thống** (key-value)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (updated_by) | N-1 | Admin cập nhật |

---

### Table 40: `policies`
**Chính sách, điều khoản**

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (created_by) | N-1 | Admin tạo policy |

---

## 10. Learning Content

### Table 41: `topics`
**Chủ đề hội thoại** AI

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Là nguồn | conversation_scenarios | 1-N | 1 topic có nhiều scenarios |

---

### Table 42: `conversation_scenarios`
**Kịch bản hội thoại** chi tiết

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | topics | N-1 | Thuộc về 1 topic |

**Tại sao tách riêng?**
> Topic là category (Du lịch, Công việc), Scenario là chi tiết (Check-in sân bay, Phỏng vấn).

---

### Table 43: `resources`
**Tài liệu** Mentor chia sẻ

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (mentor_id) | N-1 | 1 mentor tạo nhiều resources |

---

### Table 44: `vocabulary_items`
**Từ vựng** trong hệ thống

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Không có FK, dữ liệu tĩnh |

---

### Table 45: `idioms`
**Thành ngữ** tiếng Anh

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Không có FK, dữ liệu tĩnh |

---

### Table 46: `grammar_errors`
**Lỗi ngữ pháp** phổ biến

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Không có FK, dữ liệu tĩnh |

---

### Table 47: `pronunciation_errors`
**Lỗi phát âm** phổ biến

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Không có FK, dữ liệu tĩnh |

---

### Table 48: `confidence_techniques`
**Kỹ thuật tự tin** khi nói

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Không có FK, dữ liệu tĩnh |

---

### Table 49: `expression_tips`
**Mẹo diễn đạt**

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Không có FK, dữ liệu tĩnh |

---

### Table 50: `real_life_situations`
**Tình huống thực tế**

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Không có FK, dữ liệu tĩnh |

---

### Table 51: `learner_activity_assignments`
**Bài tập được giao** cho Learner

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user (mentor_id) | N-1 | Mentor giao bài |
| FK | flask_user (learner_id) | N-1 | Learner nhận bài |

---

## 11. Legacy & Utility

### Table 52: `video_call_rooms`
**Phòng video call**

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | mentor_bookings | 1-1 | 1 booking → 1 room |
| FK | flask_user (mentor_id) | N-1 | Mentor trong room |
| FK | flask_user (learner_id) | N-1 | Learner trong room |

**Tại sao gắn với booking?**
> Video call chỉ tạo khi có booking được confirmed. Tránh tạo phòng "vô chủ".

---

### Table 53: `notes`
**Ghi chú cá nhân**

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| FK | flask_user | N-1 | 1 user có nhiều notes |

---

### Table 54: `programs`
**Chương trình học** (legacy)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Bảng cũ, không còn sử dụng |

---

### Table 55: `surveys`
**Khảo sát** (legacy)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Bảng cũ, không còn sử dụng |

---

### Table 56: `todos`
**Việc cần làm** (legacy)

| Quan hệ | Với bảng | Loại | Giải thích |
|---------|----------|------|------------|
| Độc lập | - | - | Bảng cũ, không còn sử dụng |

---

## 📊 Tóm Tắt Thống Kê

| Loại quan hệ | Số lượng | Ví dụ |
|--------------|----------|-------|
| **1-1** | 5 | user↔progress, user↔profile, booking↔room |
| **1-N** | 40+ | user→purchases, topic→scenarios |
| **N-N** | 3 | user↔courses, user↔challenges, user↔achievements |
| **Self-ref** | 8 | messages, peer_sessions, reviews |
| **Độc lập** | 10 | vocabulary, idioms, grammar_errors |

---

## 🔗 Biểu Đồ Tổng Quan

```
                    ┌─────────────────┐
                    │   flask_user    │
                    │   (Trung tâm)   │
                    └────────┬────────┘
                             │
      ┌──────────────────────┼──────────────────────┐
      │                      │                      │
      ▼                      ▼                      ▼
┌──────────┐          ┌──────────┐          ┌──────────┐
│ Learner  │          │  Mentor  │          │  Admin   │
│ Features │          │ Features │          │ Features │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     ▼                     ▼                     ▼
• progress            • bookings            • broadcasts
• assessments         • feedbacks           • tickets
• challenges          • resources           • logs
• peer_sessions       • assignments         • settings
```

---

**Tài liệu này được tạo tự động cho dự án AESP**

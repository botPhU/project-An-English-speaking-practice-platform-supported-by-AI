# Mentor Content & Resources

## Tổng quan
Hệ thống tài liệu giảng dạy giúp mentor hỗ trợ học viên học tiếng Anh hiệu quả.

## API Endpoints

### Confidence Building
| Endpoint | Description |
|----------|-------------|
| `GET /api/mentor/content/confidence/techniques` | Kỹ thuật xây dựng tự tin |
| `GET /api/mentor/content/confidence/activities` | Hoạt động luyện tập |
| `POST /api/mentor/content/confidence/assign` | Giao hoạt động |

### Grammar & Expression
| Endpoint | Description |
|----------|-------------|
| `GET /api/mentor/content/grammar/common-errors` | Lỗi ngữ pháp phổ biến |
| `POST /api/mentor/content/grammar/analyze` | Phân tích ngữ pháp |
| `GET /api/mentor/content/expression/tips` | Mẹo diễn đạt |

### Vocabulary
| Endpoint | Description |
|----------|-------------|
| `GET /api/mentor/content/vocabulary/collocations` | Collocations |
| `GET /api/mentor/content/vocabulary/idioms` | Thành ngữ |
| `GET /api/mentor/content/vocabulary/mistakes` | Lỗi từ vựng |

### Situations
| Endpoint | Description |
|----------|-------------|
| `GET /api/mentor/content/situations` | Tình huống thực tế |
| `GET /api/mentor/content/situations/{id}/scripts` | Dialog mẫu |

---

## Seed Data Categories

| Category | Items | Description |
|----------|-------|-------------|
| Confidence Techniques | 4 | Positive self-talk, Mirror practice, etc. |
| Confidence Activities | 3 | 30s intro, Daily diary, Opinion sharing |
| Expression Tips | 5 | Clarity, Structure, Vocabulary |
| Grammar Errors | 6 | Tense, Article, Subject-verb, etc. |
| Pronunciation Errors | 5 | Common words |
| Collocations | 5 | Verb+noun, Adj+noun |
| Idioms | 6 | A2-B2 level |
| Topic Categories | 5 | Daily, Work, Travel, Tech, Culture |
| Real-life Situations | 3 | Coffee shop, Doctor, Interview |

---

## Files

| File | Description |
|------|-------------|
| `data/mentor_content_data.py` | Seed data |
| `services/mentor_content_service.py` | 20+ methods |
| `controllers/mentor_content_controller.py` | 20+ endpoints |
| `pages/Mentor/TeachingResources.tsx` | 5-tab UI |
| `pages/Mentor/LearnerProgress.tsx` | Progress tracking |
| `pages/Mentor/AssignmentManagement.tsx` | Assignment CRUD |

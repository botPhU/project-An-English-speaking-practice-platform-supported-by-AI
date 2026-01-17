# 🛠️ Hướng Dẫn Khắc Phục Lỗi - AESP

## 🚀 Cách Khởi Động Nhanh

Chạy file sau để khởi động toàn bộ hệ thống:
```batch
.\FIX_AND_START.bat
```

Script này sẽ tự động:
- ✅ Dọn dẹp tiến trình cũ (Python, Node)
- ✅ Tạo file `.env` cho Frontend
- ✅ Khởi động Backend (Flask - port 5000)
- ✅ Khởi động Frontend (Vite - port 5173)
- ✅ Mở trình duyệt tự động

---

## ❌ Các Lỗi Thường Gặp

### 1. Lỗi "Đăng nhập thất bại"
**Nguyên nhân:** Frontend chưa kết nối được Backend.

**Cách sửa:**
1. Kiểm tra file `frontend/.env` có nội dung:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
2. Restart Frontend: `npm run dev`

### 2. Backend không chạy được
**Nguyên nhân:** MySQL chưa bật hoặc thiếu database.

**Cách sửa:**
1. Mở MySQL Workbench, đảm bảo MySQL đang chạy
2. Kiểm tra database `aesp_db` tồn tại
3. Restart Backend

### 3. Lỗi CORS (Cross-Origin)
**Nguyên nhân:** Backend không cho phép Frontend truy cập.

**Cách sửa:** File `Flask-CleanArchitecture/src/app.py` đã được cấu hình cho phép tất cả origins.

### 4. Lỗi NPort "Subdomain already taken"
**Cách sửa:** Mở `FIX_AND_START.bat` và sửa dòng:
```batch
set PREFIX=aesp-tenban
```

---

## 📊 Đồng Bộ Database Railway

Nếu Railway thiếu bảng so với local:
```bash
cd Flask-CleanArchitecture/src
python run_railway_migration.py
```

---

## 📞 Liên Hệ Hỗ Trợ

Nếu vẫn gặp lỗi, hãy chụp ảnh:
1. Cửa sổ Backend (lỗi đỏ nếu có)
2. Console trình duyệt (F12 → Console)

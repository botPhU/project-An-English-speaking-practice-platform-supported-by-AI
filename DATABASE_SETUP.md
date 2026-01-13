# Hướng dẫn Setup Database cho Team AESP

## Yêu cầu
- MySQL Server 8.0+ (hoặc MariaDB)
- Đã cài đặt và chạy MySQL service

## Bước 1: Tạo Database

Mở MySQL Command Line hoặc MySQL Workbench, chạy:

```sql
CREATE DATABASE IF NOT EXISTS aesp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Bước 2: Import Database

### Cách 1: Dùng Command Line

```powershell
# Windows - Thay đổi đường dẫn MySQL theo máy của bạn
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p aesp_db < database_backup.sql
```

```bash
# Linux/Mac
mysql -u root -p aesp_db < database_backup.sql
```

### Cách 2: Dùng MySQL Workbench
1. Mở MySQL Workbench
2. Connect vào server
3. Chọn **Server** → **Data Import**
4. Chọn **Import from Self-Contained File** → chọn file `database_backup.sql`
5. Chọn target schema: `aesp_db`
6. Click **Start Import**

## Bước 3: Cấu hình Backend

### Tạo file `.env` trong thư mục `Flask-CleanArchitecture/src/`:

```env
# Database Configuration
DATABASE_URI=mysql+pymysql://root:YOUR_PASSWORD@127.0.0.1:3306/aesp_db

# Secret Key for JWT
SECRET_KEY=your_secret_key_here

# Gemini AI (optional - for AI features)
GEMINI_API_KEY=your_gemini_api_key

# Debug mode
DEBUG=True
```

**Lưu ý:** Thay `YOUR_PASSWORD` bằng password MySQL của bạn.

## Bước 4: Cài đặt Dependencies

```powershell
# Tạo virtual environment
python -m venv .venv

# Activate (Windows)
.\.venv\Scripts\Activate.ps1

# Install packages
pip install -r Flask-CleanArchitecture/requirements.txt
```

## Bước 5: Chạy Backend

```powershell
python Flask-CleanArchitecture/src/app.py
```

Backend sẽ chạy tại `http://localhost:5000`

## Bước 6: Chạy Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5174`

---

## Tài khoản Test

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | 123456 |
| Learner | user1 | 123456 |
| Mentor | mentor1 | 123456 |

---

## Troubleshooting

### Lỗi "Access denied"
- Kiểm tra username/password MySQL trong file `.env`
- Đảm bảo user có quyền truy cập database `aesp_db`

### Lỗi "Unknown database 'aesp_db'"
- Chạy lại Bước 1 để tạo database

### Lỗi "Module not found"
- Chạy `pip install -r Flask-CleanArchitecture/requirements.txt`

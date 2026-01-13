# Hướng Dẫn Kết Nối Database (MySQL - Railway)

Dự án sử dụng cơ sở dữ liệu **MySQL** được host trên **Railway**. Để chạy backend, bạn cần cấu hình chuỗi kết nối (Connection String) chính xác.

## 1. Lấy thông tin kết nối

⚠️ **QUAN TRỌNG:** Vì lý do bảo mật, chuỗi kết nối (`DATABASE_URI`) không được public trên GitHub.

👉 **Vui lòng liên hệ trực tiếp với Project Lead (mình) để nhận link kết nối Database.**

## 2. Cấu hình môi trường

1.  Mở file `src/.env` (nếu chưa có thì copy từ `src/.env.example`).
2.  Tìm biến `DATABASE_URI`.
3.  Dán link bạn vừa nhận được vào đó và chỉnh lại format cho đúng với thư viện `pymysql`.

Ví dụ:
```env
# Trong file src/.env
# Chú ý: Thay postgresql://... bằng mysql+pymysql://...
DATABASE_URI=mysql+pymysql://root:PASSWORD@containers-us-west-111.railway.app:3306/railway
```

## 3. Kiểm tra kết nối

Sau khi cấu hình xong, hãy chạy lại ứng dụng để đảm bảo mọi thứ hoạt động:

```bash
cd src
python app.py
```

Nếu thấy log hiện:
`✓ Database connection successful!`
thì bạn đã cấu hình thành công.

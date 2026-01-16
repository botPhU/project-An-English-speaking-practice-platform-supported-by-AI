# 🚀 Hướng Dẫn Chạy Dự Án (One-Click Start)

Dự án này đã được tích hợp script tự động để khởi chạy toàn bộ hệ thống (Backend, Frontend và Tunnels) chỉ với 1 file duy nhất.

## 1. Cách chạy nhanh nhất

Chỉ cần chạy file **`start_all.bat`** ở thư mục gốc của dự án.

Bạn có thể double-click vào file trong File Explorer hoặc chạy lệnh sau trong terminal:

```cmd
.\start_all.bat
```

### Script này sẽ tự động làm gì?
1.  **Khởi động Backend (Flask)**:
    *   Sử dụng Python trong môi trường ảo `.venv`.
    *   Chạy trên cổng `5000`.
2.  **Khởi động Frontend (React/Vite)**:
    *   Chạy lệnh `npm run dev`.
    *   Chạy trên cổng `5173`.
3.  **Mở đường hầm (Tunnels)**:
    *   Sử dụng `nport` để public localhost ra internet.
    *   Backend URL: `https://aesp-platform-2026-dev.nport.link`
    *   Frontend URL: `https://aesp-frontend-dev.nport.link`

---

## 2. Kiểm tra sau khi chạy

Sau khi script chạy xong, bạn sẽ thấy các cửa sổ cmd riêng biệt cho từng dịch vụ. Đừng tắt các cửa sổ này khi đang làm việc.

*   **Truy cập Frontend**: [http://localhost:5173](http://localhost:5173) hoặc link `nport` ở trên.
*   **Truy cập Backend API**: [http://localhost:5000](http://localhost:5000) hoặc link `nport` ở trên.
*   **Tài liệu API**: [http://localhost:5000/docs](http://localhost:5000/docs)

## 3. Nếu gặp lỗi

Nếu script không chạy được, hãy kiểm tra:
*   Đảm bảo bạn đã cài đặt `Python` và `Node.js`.
*   Đảm bảo thư mục `.venv` tồn tại (nếu chưa, hãy tạo virtualenv và cài đặt dependencies).
*   Đảm bảo không có tiến trình nào khác đang chiếm dụng port 5000 hoặc 5173.

### Chạy thủ công (nếu cần)

**Backend:**
```bash
cd Flask-CleanArchitecture/src
../../.venv/Scripts/python.exe app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

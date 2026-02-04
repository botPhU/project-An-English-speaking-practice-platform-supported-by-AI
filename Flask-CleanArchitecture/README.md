# Architecture

```bash
    ├── migrations
    ├── scripts
    │   └── run_postgres.sh
    ├── src
    │   ├── api
    │   │   ├── controllers
    │   │   │   └── ...  # controllers for the api
    │   │   ├── schemas
    │   │   │   └── ...  # Marshmallow schemas
    │   │   ├── middleware.py
    │   │   ├── responses.py
    │   │   └── requests.py
    │   ├── infrastructure
    │   │   ├── services
    │   │   │   └── ...  # Services that use third party libraries or services (e.g. email service)
    │   │   ├── databases
    │   │   │   └── ...  # Database adapaters and initialization
    │   │   ├── repositories
    │   │   │   └── ...  # Repositories for interacting with the databases
    │   │   └── models
    │   │   │   └── ...  # Database models
    │   ├── domain
    │   │   ├── constants.py
    │   │   ├── exceptions.py
    │   │   ├── models
    │   │   │   └── ...  # Business logic models
    │   ├── services
    │   │    └── ...  # Services for interacting with the domain (business logic)
    │   ├── app.py
    │   ├── config.py
    │   ├── cors.py
    │   ├── create_app.py
    │   ├── dependency_container.py
    │   ├── error_handler.py
    │   └── logging.py
```

## Domain Layer

## Services Layer

## Infrastructure Layer

## Download source code (CMD)
    git clone https://github.com/ChienNguyensrdn/Flask-CleanArchitecture.git
## Kiểm tra đã cài python đã cài đặt trên máy chưa
    python --version
## Run app

 - Bước 1: Tạo môi trường ảo co Python (phiên bản 3.x)
     ## Windows:
     		py -m venv .venv
     ## Unix/MacOS:
     		python3 -m venv .venv
   - Bước 2: Kích hoạt môi trường:
     ## Windows:
     		.venv\Scripts\activate.ps1
     ### Nếu xảy ra lỗi active .venv trên winos run powshell -->Administrator
         Set-ExecutionPolicy RemoteSigned -Force
     ## Unix/MacOS:
     		source .venv/bin/activate
     
   - Bước 3: Cài đặt các thư viện cần thiết
     ## Install:
     		pip install -r requirements.txt
   - Bước 4: Chạy mã xử lý dữ liệu
     ## Run:
    		python app.py


     Truy câp http://localhost:9999/docs



## Create file .env in folder /src/.env
    
    # Flask settings
    FLASK_ENV=development
    SECRET_KEY=your_secret_key
    
    # SQL Server settings
    DB_USER=sa
    DB_PASSWORD=Aa@123456
    DB_HOST=127.0.0.1
    DB_PORT=1433
    DB_NAME=FlaskApiDB
    
    
    DATABASE_URI = "mssql+pymssql://sa:Aa%40123456@127.0.0.1:1433/FlaskApiDB"

## pull image MS SQL server 
    
    ```bash
    docker pull mcr.microsoft.com/mssql/server:2025-latest
    ```
## Install MS SQL server in docker 
    ```bash
    docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Aa123456" -p 1433:1433 --name sql1 --hostname sql1 -d  mcr.microsoft.com/mssql/server:2025-latest
    ```
## Test connect SQL server 

## ORM Flask (from sqlalchemy.orm )
Object Relational Mapping

Ánh xạ 1 class (OOP)  model src/infrastructure/models --> Table in database 
Ánh xạ các mối quan hệ (Relational) -- Khoá ngoại CSDL 
(n-n): many to many 

## Database Setup

Project đang sử dụng **MySQL trên Railway**.

👉 Đọc hướng dẫn chi tiết tại: [docs/DATABASE_GUIDE.md](docs/DATABASE_GUIDE.md) để biết cách lấy link kết nối và setup.

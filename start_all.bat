@echo off
echo ========================================================
echo        AESP PLATFORM - ONE CLICK START
echo ========================================================

echo 1. Starting Backend (Flask)...
start "AESP Backend" /D "Flask-CleanArchitecture\src" cmd /k "python app.py"

echo 2. Starting Frontend (Vite)...
start "AESP Frontend" /D "frontend" cmd /k "npm run dev"

echo Waiting 5 seconds for services to initialize...
timeout /t 5 >nul

echo 3. Starting Backend Tunnel (Port 5000)...
start "NPort Backend" cmd /k "nport 5000 -s aesp-platform-2026"

echo 4. Starting Frontend Tunnel (Port 5173)...
start "NPort Frontend" cmd /k "nport 5173 -s aesp-frontend"

echo ========================================================
echo DONE! All services are running in separate windows.
echo You can minimize this window.
echo ========================================================
pause

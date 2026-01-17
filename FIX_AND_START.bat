@echo off
setlocal
echo ========================================================
echo        AESP PLATFORM - ONE CLICK FIX ^& START
echo ========================================================

echo 1. Cleaning up old processes...
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM nport.exe /T >nul 2>&1
echo Done clean up.

echo 2. Ensuring Frontend Environment (localhost)...
echo VITE_API_URL=http://localhost:5000/api > frontend\.env
echo VITE_APP_NAME=AESP >> frontend\.env
echo VITE_APP_VERSION=1.0.0 >> frontend\.env
echo Created frontend/.env for localhost

echo 3. Starting Backend (Flask)...
start "AESP Backend" /D "Flask-CleanArchitecture\src" cmd /k "..\..\\.venv\Scripts\python.exe app.py"

echo 4. Starting Frontend (Vite on Port 5173)...
start "AESP Frontend" /D "frontend" cmd /k "npm run dev -- --port 5173"

echo Waiting 8 seconds for services to initialize...
timeout /t 8 >nul

echo ========================================================
echo SYSTEM STARTED!
echo.
echo  LOCAL ACCESS (Recommended):
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000/api
echo.
echo  NOTE: NPort tunnels removed to prevent connection issues.
echo        If you need external access, run NPort manually:
echo        nport 5000 -s your-api-subdomain
echo        nport 5173 -s your-web-subdomain
echo ========================================================

:: Auto open localhost
echo Opening browser...
start http://localhost:5173

pause

@echo off
echo ============================================================
echo FoodTrack - Complete Startup Script
echo ============================================================
echo.
echo This script will start both the frontend and backend servers
echo.
pause

echo.
echo [1/2] Starting Backend (FastAPI ML Server)...
echo ============================================================
start "FoodTrack Backend" cmd /k "cd /d %~dp0backend && python main.py"
timeout /t 5 /nobreak

echo.
echo [2/2] Starting Frontend (Next.js)...
echo ============================================================
start "FoodTrack Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ============================================================
echo ✅ FoodTrack is starting!
echo ============================================================
echo.
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Two new windows have opened for Frontend and Backend
echo Close those windows to stop the servers
echo.
echo ============================================================
pause

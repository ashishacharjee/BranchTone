@echo off
echo ===================================================
echo Launching BranchTone 100%% Full Studio
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:5173
echo ===================================================
cd /d "%~dp0"
start "BranchTone Backend" cmd /c "backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --port 8000 --reload"
timeout /t 2 /nobreak > nul
start "BranchTone Frontend" cmd /c "npm run dev --prefix frontend -- --open"

@echo off
echo ===================================================
echo Starting BranchTone FastAPI Backend on port 8000...
echo ===================================================
cd /d "%~dp0"
backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --port 8000 --reload

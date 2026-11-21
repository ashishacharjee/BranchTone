@echo off
echo ===================================================
echo Starting BranchTone Vite Frontend on port 5173...
echo ===================================================
cd /d "%~dp0"
npm run dev --prefix frontend

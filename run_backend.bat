@echo off
echo =======================================================
echo   STARTING SMART UNIVERSITY DIGITAL CAMPUS BACKEND
echo =======================================================
cd backend

set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    set PYTHON_CMD="C:\Users\siddharth\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
)

echo Using Python: %PYTHON_CMD%
%PYTHON_CMD% -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause

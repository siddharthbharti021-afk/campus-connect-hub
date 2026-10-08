Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  STARTING SMART UNIVERSITY DIGITAL CAMPUS BACKEND" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

$py = "python"
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    $py = "C:\Users\siddharth\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
}

Push-Location backend
try {
    & $py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
} finally {
    Pop-Location
}

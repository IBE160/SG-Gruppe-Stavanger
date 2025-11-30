@echo off
echo ===================================
echo Story 2-1: Pantry Test Suite
echo ===================================
echo.

echo Step 1: Cleaning up processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM chrome.exe /T 2>nul
timeout /t 2 >nul

echo Step 2: Removing lock files...
cd app
if exist .next\dev rmdir /S /Q .next\dev
timeout /t 1 >nul

echo Step 3: Running tests...
echo.
npm run e2e -- pantry-add-item.spec.ts --project=chromium --workers=1

echo.
echo ===================================
echo Tests Complete!
echo ===================================
pause

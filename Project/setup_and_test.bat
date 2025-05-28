@echo off
echo.
echo ============================================
echo  TrustTrack - Complete Setup and Test
echo ============================================
echo.

echo [1/5] Checking project structure...
if exist "index.html" (
    echo ✓ Main files found
) else (
    echo ✗ Missing main files
    pause
    exit /b 1
)

echo.
echo [2/5] Checking page files...
if exist "pages\admin.html" (
    echo ✓ Admin dashboard ready
) else (
    echo ✗ Missing admin files
)

if exist "pages\reviews.html" (
    echo ✓ Review system ready
) else (
    echo ✗ Missing review files
)

echo.
echo [3/5] Checking styles and scripts...
if exist "styles\main.css" (
    echo ✓ Stylesheets ready
) else (
    echo ✗ Missing stylesheets
)

if exist "scripts\main.js" (
    echo ✓ JavaScript files ready
) else (
    echo ✗ Missing JavaScript files
)

echo.
echo [4/5] Setting up local environment...
echo • Sample data will be automatically loaded
echo • Admin credentials: admin / trusttrack2025
echo • Contact forms will save to localStorage
echo • Email integration guide available in EMAIL_SETUP.md

echo.
echo [5/5] Launching TrustTrack...
echo.
echo Opening TrustTrack in your default browser...
echo.
echo ============================================
echo  TrustTrack Features Overview:
echo ============================================
echo  → Homepage: Trending reviews and features
echo  → Reviews: Submit and view transport ratings
echo  → Emergency: Map with emergency contacts
echo  → Team: About us with contact form
echo  → Feedback: User feedback system
echo  → Admin: Management dashboard
echo ============================================
echo.

start "" "index.html"

echo.
echo TrustTrack is now running!
echo.
echo Quick Test Checklist:
echo [ ] Homepage loads with trending reviews
echo [ ] Review form accepts ratings and comments
echo [ ] Emergency map displays correctly
echo [ ] Team page shows contact form
echo [ ] Feedback form works
echo [ ] Admin login (admin/trusttrack2025)
echo.
echo For email integration, see EMAIL_SETUP.md
echo.
pause

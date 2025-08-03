@echo off
echo Switching to PRODUCTION mode...

powershell -Command "(Get-Content 'client\src\config.js') -replace 'isDevelopment: true', 'isDevelopment: false' | Set-Content 'client\src\config.js'"

echo.
echo Configuration updated for PRODUCTION!
echo.
echo To deploy to AWS:
echo 1. Run: deploy-frontend.bat
echo 2. Your app will use http://18.209.102.221 for API calls
echo.
pause 
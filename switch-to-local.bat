@echo off
echo Switching to LOCAL development mode...

powershell -Command "(Get-Content 'client\src\config.js') -replace 'isDevelopment: false', 'isDevelopment: true' | Set-Content 'client\src\config.js'"

echo.
echo Configuration updated for LOCAL development!
echo.
echo To run locally:
echo 1. Start your backend: cd server && npm start
echo 2. Start your frontend: cd client && npm start
echo.
echo Your app will now use http://localhost:5000 for API calls
pause 
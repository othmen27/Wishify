@echo off
echo 🚀 Starting Wishify Frontend Deployment...

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS CLI is not installed. Please install it first:
    echo    https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
    pause
    exit /b 1
)

REM Check if AWS credentials are configured
aws sts get-caller-identity >nul 2>&1
if errorlevel 1 (
    echo ❌ AWS credentials not configured. Please run:
    echo    aws configure
    pause
    exit /b 1
)

REM Get S3 bucket name from user
set /p S3_BUCKET="Enter your S3 bucket name (e.g., wishify-frontend): "

REM Get API endpoint from user
set /p API_ENDPOINT="Enter your API endpoint (e.g., http://your-ec2-ip or https://your-domain.com): "

REM Remove trailing slash if present
set API_ENDPOINT=%API_ENDPOINT:~0,-1%

echo 📦 Installing dependencies...
cd client
call npm install

echo 🔧 Updating API endpoint...
REM Create a temporary package.json without proxy
copy package.json package.json.backup
powershell -Command "(Get-Content package.json) | Where-Object {$_ -notmatch '\"proxy\":'} | Set-Content package.json"

echo 🏗️ Building the application...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed!
    copy package.json.backup package.json
    pause
    exit /b 1
)

echo 📤 Uploading to S3...
aws s3 sync build/ s3://%S3_BUCKET% --delete

if errorlevel 0 (
    echo ✅ Frontend deployment completed!
    echo 🌐 Your website should be available at:
    echo    http://%S3_BUCKET%.s3-website-%AWS_DEFAULT_REGION%.amazonaws.com
    echo.
    echo 📝 Don't forget to:
    echo    1. Update your API calls to use: %API_ENDPOINT%
    echo    2. Configure CORS in your backend to allow requests from your S3 domain
    echo    3. Set up CloudFront for better performance (optional)
) else (
    echo ❌ Upload failed!
)

REM Restore original package.json
copy package.json.backup package.json

pause 
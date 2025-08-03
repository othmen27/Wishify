#!/bin/bash

# Wishify Frontend Deployment Script
# Run this script locally to deploy to S3

echo "🚀 Starting Wishify Frontend Deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run:"
    echo "   aws configure"
    exit 1
fi

# Get S3 bucket name from user
read -p "Enter your S3 bucket name (e.g., wishify-frontend): " S3_BUCKET

# Check if bucket exists
if ! aws s3 ls "s3://$S3_BUCKET" &> /dev/null; then
    echo "❌ Bucket $S3_BUCKET does not exist or you don't have access to it."
    echo "Please create the bucket first in the AWS S3 console."
    exit 1
fi

# Get API endpoint from user
read -p "Enter your API endpoint (e.g., http://your-ec2-ip or https://your-domain.com): " API_ENDPOINT

# Remove trailing slash if present
API_ENDPOINT=${API_ENDPOINT%/}

echo "📦 Installing dependencies..."
cd client
npm install

echo "🔧 Updating API endpoint..."
# Create a temporary package.json without proxy
cp package.json package.json.backup
sed '/"proxy":/d' package.json.backup > package.json

echo "🏗️ Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    mv package.json.backup package.json
    exit 1
fi

echo "📤 Uploading to S3..."
aws s3 sync build/ "s3://$S3_BUCKET" --delete

if [ $? -eq 0 ]; then
    echo "✅ Frontend deployment completed!"
    echo "🌐 Your website should be available at:"
    echo "   http://$S3_BUCKET.s3-website-$(aws configure get region).amazonaws.com"
    echo ""
    echo "📝 Don't forget to:"
    echo "   1. Update your API calls to use: $API_ENDPOINT"
    echo "   2. Configure CORS in your backend to allow requests from your S3 domain"
    echo "   3. Set up CloudFront for better performance (optional)"
else
    echo "❌ Upload failed!"
fi

# Restore original package.json
mv package.json.backup package.json 
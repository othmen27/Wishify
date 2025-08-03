#!/bin/bash

# Wishify Backend Deployment Script
# Run this script on your EC2 instance

echo "🚀 Starting Wishify Backend Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js
echo "📦 Installing Node.js..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Install nginx
echo "📦 Installing nginx..."
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /home/ec2-user/wishify
cd /home/ec2-user/wishify

# Clone repository (replace with your actual repo URL)
echo "📥 Cloning repository..."
git clone https://github.com/yourusername/wishify.git .

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install

# Create environment file
echo "⚙️ Creating environment file..."
cat > .env << EOF
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
PORT=5000
EOF

echo "⚠️  Please update the .env file with your actual MongoDB connection string and JWT secret!"

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start index.js --name "wishify-backend"
pm2 startup
pm2 save

# Configure nginx
echo "⚙️ Configuring nginx..."
sudo tee /etc/nginx/conf.d/wishify.conf > /dev/null << EOF
server {
    listen 80;
    server_name _;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
EOF

# Test and reload nginx
echo "🔄 Testing and reloading nginx..."
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Backend deployment completed!"
echo "📊 Check PM2 status: pm2 status"
echo "📊 Check nginx status: sudo systemctl status nginx"
echo "🌐 Your API should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/api" 
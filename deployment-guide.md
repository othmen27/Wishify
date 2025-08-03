# Wishify AWS Deployment Guide

## Overview
This guide will help you deploy your Wishify MERN stack application to AWS using the following services:
- **Frontend**: AWS S3 + CloudFront
- **Backend**: AWS EC2 (t2.micro)
- **Database**: MongoDB Atlas (recommended) or AWS DocumentDB
- **Domain**: Route 53 (optional)

## Prerequisites
- AWS Account with $140 credit
- Domain name (optional but recommended)
- MongoDB Atlas account (free tier)

## Step 1: Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free tier
   - Create a new cluster (M0 tier is free)

2. **Configure Database**
   - Create a database user
   - Whitelist your IP (0.0.0.0/0 for all IPs)
   - Get your connection string

3. **Update Environment Variables**
   - Copy your MongoDB connection string
   - You'll use this in the EC2 deployment

## Step 2: Backend Deployment (EC2)

### 2.1 Launch EC2 Instance
1. **EC2 Dashboard** → **Launch Instance**
2. **Instance Details**:
   - Name: `wishify-backend`
   - AMI: Amazon Linux 2023
   - Instance Type: t3.micro (free tier)
   - Key Pair: Create new key pair
   - Security Group: Create new security group

### 2.2 Security Group Configuration
Create security group with these rules:
- **SSH**: Port 22, Source: Your IP
- **HTTP**: Port 80, Source: 0.0.0.0/0
- **HTTPS**: Port 443, Source: 0.0.0.0/0
- **Custom**: Port 5000, Source: 0.0.0.0/0 (for your API)

### 2.3 Connect and Setup EC2
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Update system
sudo yum update -y

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install PM2 for process management
npm install -g pm2

# Install nginx
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.4 Deploy Backend Code
```bash
# Clone your repository
git clone https://github.com/yourusername/wishify.git
cd wishify/server

# Install dependencies
npm install

# Create environment file
nano .env
```

Add your environment variables:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=5000
```

```bash
# Start the application with PM2
pm2 start index.js --name "wishify-backend"
pm2 startup
pm2 save
```

### 2.5 Configure Nginx
```bash
sudo nano /etc/nginx/conf.d/wishify.conf
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

## Step 3: Frontend Deployment (S3 + CloudFront)

### 3.1 Create S3 Bucket
1. **S3 Dashboard** → **Create Bucket**
2. **Bucket Name**: `wishify-frontend` (must be globally unique)
3. **Region**: Same as your EC2 instance
4. **Block Public Access**: Uncheck all (we'll make it public)
5. **Bucket Versioning**: Disabled
6. **Tags**: Add tags for organization

### 3.2 Configure S3 Bucket for Static Website
1. **Properties** → **Static website hosting**
2. **Enable**: Static website hosting
3. **Index document**: `index.html`
4. **Error document**: `index.html` (for React Router)

### 3.3 Configure Bucket Policy
Go to **Permissions** → **Bucket Policy** and add:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::wishify-frontend/*"
        }
    ]
}
```

### 3.4 Build and Deploy Frontend
```bash
# In your local project
cd client

# Update API endpoint (remove proxy from package.json)
# Build the application
npm run build

# Upload to S3 (install AWS CLI first)
aws s3 sync build/ s3://wishify-frontend --delete
```

### 3.5 Setup CloudFront (Optional but Recommended)
1. **CloudFront Dashboard** → **Create Distribution**
2. **Origin Domain**: Your S3 bucket website endpoint
3. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
4. **Default Root Object**: `index.html`
5. **Error Pages**: Create custom error response for 403/404 → `/index.html`

## Step 4: Environment Configuration

### 4.1 Update Frontend API Endpoint
Before building, update your API calls to use the EC2 public IP or domain:

```javascript
// In your React components, replace localhost:5000 with your EC2 IP
const API_BASE_URL = 'http://your-ec2-ip/api';
// or
const API_BASE_URL = 'https://your-domain.com/api';
```

### 4.2 Update CORS in Backend
In your server/index.js, update CORS configuration:
```javascript
app.use(cors({
  origin: ['http://your-s3-website-url', 'https://your-cloudfront-url'],
  credentials: true
}));
```

## Step 5: Domain and SSL (Optional)

### 5.1 Route 53 Setup
1. **Route 53 Dashboard** → **Hosted Zones**
2. **Create Hosted Zone** for your domain
3. **Create A Record** pointing to your EC2 instance
4. **Create CNAME Record** for www pointing to your domain

### 5.2 SSL Certificate
1. **AWS Certificate Manager** → **Request Certificate**
2. **Domain**: your-domain.com, *.your-domain.com
3. **Validation**: DNS validation
4. **Add CNAME records** to Route 53

### 5.3 Update Nginx for HTTPS
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location /api {
        proxy_pass http://localhost:5000;
        # ... same proxy settings as before
    }
}
```

## Step 6: Monitoring and Maintenance

### 6.1 CloudWatch Setup
- Set up CloudWatch alarms for EC2 metrics
- Monitor CPU, memory, and disk usage

### 6.2 Backup Strategy
- Enable automated backups for your database
- Set up S3 lifecycle policies for cost optimization

### 6.3 Updates and Maintenance
```bash
# Update application
git pull origin main
npm install
pm2 restart wishify-backend

# Update frontend
npm run build
aws s3 sync build/ s3://wishify-frontend --delete
```

## Cost Estimation (Monthly)
- **EC2 t3.micro**: $0 (free tier)
- **S3**: ~$0.50 (for small static site)
- **CloudFront**: ~$0.50 (for small traffic)
- **Route 53**: ~$0.50 (if using custom domain)
- **Data Transfer**: ~$1-5 (depending on usage)

**Total Estimated Cost**: $2-6/month (well within your $140 credit)

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Check CORS configuration in backend
2. **API Not Found**: Verify nginx configuration and EC2 security groups
3. **Database Connection**: Check MongoDB Atlas IP whitelist
4. **Build Errors**: Ensure all dependencies are installed

### Useful Commands:
```bash
# Check PM2 status
pm2 status
pm2 logs wishify-backend

# Check nginx status
sudo systemctl status nginx
sudo nginx -t

# Check EC2 logs
sudo tail -f /var/log/nginx/error.log
```

## Next Steps
1. Set up CI/CD pipeline with GitHub Actions
2. Implement monitoring and alerting
3. Set up automated backups
4. Configure CDN caching strategies
5. Implement rate limiting and security measures

Your $140 AWS credit should easily cover 6-12 months of hosting costs for this setup! 
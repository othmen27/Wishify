# 🚀 Wishify AWS Deployment - Quick Start

## Your $140 AWS Credit is Perfect! 

This will easily cover 6-12 months of hosting costs. Here's how to get started immediately:

## ⚡ Quick Start (30 minutes)

### 1. Database Setup (5 minutes)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster (M0 tier - FREE)
4. Create database user
5. Whitelist IP: `0.0.0.0/0`
6. Copy connection string

### 2. Backend Setup (15 minutes)
1. **AWS Console** → **EC2** → **Launch Instance**
   - AMI: Amazon Linux 2023
   - Type: t3.micro (FREE tier)
   - Security Group: Allow ports 22, 80, 443, 5000
2. **Connect to EC2** via SSH
3. **Run this command** on your EC2:
```bash
curl -s https://raw.githubusercontent.com/yourusername/wishify/main/deploy-scripts/deploy-backend.sh | bash
```
4. **Update .env file** with your MongoDB connection string

### 3. Frontend Setup (10 minutes)
1. **AWS Console** → **S3** → **Create Bucket**
   - Name: `wishify-frontend-yourname`
   - Uncheck "Block Public Access"
2. **Configure bucket** for static website hosting
3. **Run locally**: `deploy-scripts/deploy-frontend.bat` (Windows) or `./deploy-scripts/deploy-frontend.sh` (Mac/Linux)

## 🎯 What You'll Get

- **Frontend**: `http://your-bucket.s3-website-region.amazonaws.com`
- **Backend API**: `http://your-ec2-ip/api`
- **Database**: MongoDB Atlas (free tier)

## 💰 Cost Breakdown (Monthly)
- **EC2 t3.micro**: $0 (free tier)
- **S3**: ~$0.50
- **CloudFront**: ~$0.50 (optional)
- **Total**: ~$1-2/month

**Your $140 credit = 70+ months of hosting!**

## 🔧 Next Steps (Optional)
1. **Custom Domain**: Route 53 + SSL certificate
2. **CDN**: CloudFront for better performance
3. **Monitoring**: CloudWatch alerts
4. **CI/CD**: GitHub Actions for auto-deployment

## 🆘 Need Help?
- Check `deployment-guide.md` for detailed instructions
- Use `aws-setup-checklist.md` to track progress
- Common issues in troubleshooting section

## 🎉 You're Ready!
Your Wishify app will be live in under 30 minutes. The $140 credit gives you plenty of room to experiment and scale! 
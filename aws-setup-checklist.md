# AWS Deployment Checklist

## Pre-Deployment Setup
- [ ] AWS Account created with $140 credit
- [ ] AWS CLI installed and configured locally
- [ ] MongoDB Atlas account created (free tier)
- [ ] Domain name purchased (optional but recommended)
- [ ] GitHub repository ready with your code

## Database Setup (MongoDB Atlas)
- [ ] Create MongoDB Atlas cluster (M0 tier)
- [ ] Create database user
- [ ] Whitelist IP addresses (0.0.0.0/0 for all)
- [ ] Copy connection string
- [ ] Test connection locally

## Backend Deployment (EC2)
- [ ] Launch EC2 instance (t3.micro)
- [ ] Create/select key pair
- [ ] Configure security group
  - [ ] SSH (Port 22) - Your IP
  - [ ] HTTP (Port 80) - 0.0.0.0/0
  - [ ] HTTPS (Port 443) - 0.0.0.0/0
  - [ ] Custom (Port 5000) - 0.0.0.0/0
- [ ] Connect to EC2 instance
- [ ] Run deployment script or manual setup
- [ ] Install Node.js, PM2, nginx
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Create .env file with MongoDB connection
- [ ] Start application with PM2
- [ ] Configure nginx
- [ ] Test API endpoints

## Frontend Deployment (S3)
- [ ] Create S3 bucket
- [ ] Configure bucket for static website hosting
- [ ] Set bucket policy for public read access
- [ ] Build React application locally
- [ ] Upload build files to S3
- [ ] Test website access

## Optional Enhancements
- [ ] Set up CloudFront distribution
- [ ] Configure custom domain with Route 53
- [ ] Set up SSL certificate
- [ ] Configure HTTPS redirect
- [ ] Set up monitoring and alerts

## Testing
- [ ] Test frontend loads correctly
- [ ] Test API endpoints work
- [ ] Test user registration/login
- [ ] Test file uploads
- [ ] Test all major features
- [ ] Test on mobile devices

## Security & Optimization
- [ ] Review security group rules
- [ ] Set up automated backups
- [ ] Configure CloudWatch monitoring
- [ ] Set up cost alerts
- [ ] Review and optimize costs

## Documentation
- [ ] Document deployment process
- [ ] Create maintenance procedures
- [ ] Document troubleshooting steps
- [ ] Create backup/restore procedures

## Cost Monitoring
- [ ] Set up AWS Cost Explorer
- [ ] Configure billing alerts
- [ ] Monitor monthly usage
- [ ] Optimize resources as needed

## Estimated Timeline
- **Database Setup**: 30 minutes
- **Backend Deployment**: 1-2 hours
- **Frontend Deployment**: 30 minutes
- **Testing**: 1 hour
- **Optional Enhancements**: 2-3 hours

**Total Estimated Time**: 5-7 hours

## Cost Breakdown (Monthly)
- **EC2 t3.micro**: $0 (free tier)
- **S3 Storage**: ~$0.50
- **CloudFront**: ~$0.50
- **Route 53**: ~$0.50 (if using custom domain)
- **Data Transfer**: ~$1-5
- **Total**: $2-6/month

Your $140 credit should last 6-12 months! 
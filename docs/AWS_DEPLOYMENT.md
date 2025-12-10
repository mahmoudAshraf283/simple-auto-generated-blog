# AWS Deployment Guide

## Overview
This document describes the AWS deployment process for the Auto-Generated Blog application.

## Architecture

```
GitHub Repo → CodeBuild → ECR → EC2 Instance
                          ↓
                   Docker Images
```

## Prerequisites

- AWS Account (Free Tier)
- AWS CLI configured
- GitHub repository
- Docker installed locally

## Deployment Steps

### 1. Create ECR Repositories

```bash
aws ecr create-repository --repository-name blog-backend --region us-east-1
aws ecr create-repository --repository-name blog-frontend --region us-east-1
```

Save your AWS Account ID from the repository URIs.

### 2. Set Up CodeBuild (Optional)

1. Go to AWS CodeBuild console
2. Create build project:
   - Source: GitHub (connect your repo)
   - Environment: Ubuntu Standard
   - Privileged mode: Enabled
   - Buildspec: `buildspec.yml`
3. Add environment variable: `AWS_ACCOUNT_ID`
4. Attach `AmazonEC2ContainerRegistryPowerUser` policy to CodeBuild role

### 3. Launch EC2 Instance

1. Launch t2.micro instance (Amazon Linux 2023)
2. Configure security group:
   - Port 22: SSH
   - Port 80: HTTP
   - Port 3001: Backend API
3. Save the key pair (`.pem` file)
4. Note the public IP address

### 4. Initialize EC2

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@YOUR_EC2_IP

# Upload and run init script
# (First copy init-ec2.sh to EC2)
chmod +x init-ec2.sh
./init-ec2.sh

# Log out and back in
exit
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
```

### 5. Configure AWS CLI on EC2

```bash
aws configure
# Enter your Access Key ID
# Enter your Secret Access Key
# Region: us-east-1
# Format: json
```

### 6. Deploy Application

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/simple-auto-generated-blog.git
cd simple-auto-generated-blog

# Create .env file
cat > .env << EOF
AWS_ACCOUNT_ID=your_account_id
AWS_REGION=us-east-1
DB_PASSWORD=AaEm2001.
HUGGINGFACE_API_KEY=your_api_key
EOF

# Load environment variables
export $(cat .env | xargs)

# Use production docker-compose
cp docker-compose.prod.yml docker-compose.yml

# Run deployment
chmod +x infra/scripts/deploy.sh
./infra/scripts/deploy.sh
```

## Manual Image Push (Alternative to CodeBuild)

If not using CodeBuild, push images directly from EC2:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -t $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest .
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/blog-backend:latest

# Build and push frontend
cd ../frontend
docker build -t $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest .
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/blog-frontend:latest
```

## Verification

1. Check containers: `docker ps`
2. Check logs: `docker logs blog-backend`
3. Test API: `curl http://localhost:3001/api/articles`
4. Test frontend: Open `http://YOUR_EC2_IP` in browser

## Troubleshooting

### Containers won't start
- Check logs: `docker logs <container_name>`
- Verify environment variables in `.env`
- Ensure images were pulled successfully

### Can't pull images from ECR
- Verify AWS credentials: `aws sts get-caller-identity`
- Check ECR permissions
- Try manual ECR login

### Application not accessible
- Check security group rules
- Verify EC2 instance is running
- Check container status: `docker ps`

## Free Tier Usage

- EC2: 750 hours/month (t2.micro)
- ECR: 500 MB storage
- CodeBuild: 100 build minutes/month
- Data Transfer: 1 GB/month

Total cost: **$0.00/month** ✅

## Updating the Application

```bash
cd ~/simple-auto-generated-blog
git pull origin main
./infra/scripts/deploy.sh
```

## Cleanup (To avoid charges after free tier)

```bash
# Stop containers
docker-compose down -v

# Delete images
docker rmi $(docker images -q)

# Terminate EC2 instance (via AWS Console)
# Delete ECR repositories (via AWS Console)
```

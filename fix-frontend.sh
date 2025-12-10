#!/bin/bash

# Fix Frontend API URL Script
# Run this on EC2 to rebuild frontend with correct API URL

set -e

echo "=========================================="
echo "  Fixing Frontend API URL"
echo "=========================================="

# Set variables
export AWS_ACCOUNT_ID=369809331359
export AWS_REGION=eu-north-1
export PUBLIC_IP=13.60.16.140

echo ""
echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo ""
echo "🏗️  Rebuilding frontend with API URL: http://$PUBLIC_IP:3001"
cd ~/simple-auto-generated-blog/frontend

docker build \
  --build-arg VITE_API_URL=http://$PUBLIC_IP:3001 \
  -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/blog-frontend:latest .

echo ""
echo "📤 Pushing to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/blog-frontend:latest

echo ""
echo "♻️  Restarting frontend container..."
cd ~/simple-auto-generated-blog

# Pull latest image
docker-compose pull frontend

# Recreate frontend container
docker-compose up -d --force-recreate frontend

echo ""
echo "⏳ Waiting for frontend to start..."
sleep 10

echo ""
echo "🔍 Checking container status..."
docker ps | grep blog

echo ""
echo "=========================================="
echo "✅ Frontend fixed!"
echo "=========================================="
echo ""
echo "🌐 Test your application:"
echo "   Frontend: http://$PUBLIC_IP"
echo "   Backend:  http://$PUBLIC_IP:3001/api/articles"
echo ""

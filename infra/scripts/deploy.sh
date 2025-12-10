#!/bin/bash

# EC2 Deployment Script for Auto-Generated Blog
# This script pulls the latest Docker images from ECR and deploys them

set -e

echo "=========================================="
echo "  Blog App Deployment Script"
echo "=========================================="
echo ""

# Configuration - Set these as environment variables or replace here
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BACKEND_IMAGE="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/blog-backend:latest"
FRONTEND_IMAGE="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/blog-frontend:latest"

# Check if AWS_ACCOUNT_ID is set
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "❌ Error: AWS_ACCOUNT_ID environment variable is not set"
    echo "Please set it using: export AWS_ACCOUNT_ID=your_account_id"
    exit 1
fi

echo "🔐 Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | \
    docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

if [ $? -ne 0 ]; then
    echo "❌ Failed to login to ECR"
    exit 1
fi

echo "✅ ECR login successful"
echo ""

echo "📥 Pulling latest images from ECR..."
echo "Backend: $BACKEND_IMAGE"
docker pull $BACKEND_IMAGE

echo "Frontend: $FRONTEND_IMAGE"
docker pull $FRONTEND_IMAGE

if [ $? -ne 0 ]; then
    echo "❌ Failed to pull images from ECR"
    exit 1
fi

echo "✅ Images pulled successfully"
echo ""

echo "🛑 Stopping old containers..."
docker-compose down 2>/dev/null || true

echo "✅ Old containers stopped"
echo ""

echo "▶️  Starting new containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start containers"
    exit 1
fi

echo "✅ Containers started successfully"
echo ""

echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "🔍 Checking container status..."
docker-compose ps

echo ""
echo "=========================================="
echo "✅ Deployment completed successfully!"
echo "=========================================="
echo ""
echo "🌐 Your application is now running at:"
echo "   Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP')"
echo "   Backend:  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'YOUR_EC2_IP'):3001"
echo ""
echo "📝 To check logs:"
echo "   docker logs blog-backend"
echo "   docker logs blog-frontend"
echo ""

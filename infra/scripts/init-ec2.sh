#!/bin/bash

# EC2 Initialization Script
# Run this script ONCE on a fresh EC2 instance to set up Docker and dependencies

set -e

echo "=========================================="
echo "  EC2 Instance Initialization"
echo "=========================================="
echo ""

echo "📦 Updating system packages..."
sudo yum update -y

echo "✅ System updated"
echo ""

echo "🐳 Installing Docker..."
sudo yum install docker -y

echo "▶️  Starting Docker service..."
sudo service docker start

echo "🔧 Enabling Docker to start on boot..."
sudo systemctl enable docker

echo "👤 Adding ec2-user to docker group..."
sudo usermod -a -G docker ec2-user

echo "✅ Docker installed and configured"
echo ""

echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

echo "✅ Docker Compose installed"
echo ""

echo "📦 Installing Git..."
sudo yum install git -y

echo "✅ Git installed"
echo ""

echo "☁️  Installing/Updating AWS CLI..."
if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
else
    echo "AWS CLI already installed, updating..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install --update
    rm -rf aws awscliv2.zip
fi

echo "✅ AWS CLI installed/updated"
echo ""

echo "🔍 Verifying installations..."
echo "Docker version:"
docker --version

echo "Docker Compose version:"
docker-compose --version

echo "Git version:"
git --version

echo "AWS CLI version:"
aws --version

echo ""
echo "=========================================="
echo "✅ EC2 initialization completed!"
echo "=========================================="
echo ""
echo "⚠️  IMPORTANT: You must log out and log back in for Docker group changes to take effect!"
echo ""
echo "Next steps:"
echo "1. Log out: exit"
echo "2. Log back in: ssh -i your-key.pem ec2-user@your-ec2-ip"
echo "3. Configure AWS CLI: aws configure"
echo "4. Clone your repository: git clone https://github.com/YOUR_USERNAME/simple-auto-generated-blog.git"
echo "5. Create .env file with your secrets"
echo "6. Run deploy.sh"
echo ""

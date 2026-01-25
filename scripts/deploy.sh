#!/bin/bash

set -e

echo "🚀 Deploying TodoApp to Production..."

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "❌ AWS credentials not found. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
    exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GitHub token not found. Please set GITHUB_TOKEN"
    exit 1
fi

echo "📦 Building Docker images..."

docker build -t ghcr.io/$(git config --get remote.origin.url | sed 's/.*\///' | sed 's/.git$//')-frontend:latest ./frontend
docker build -t ghcr.io/$(git config --get remote.origin.url | sed 's/.*\///' | sed 's/.git$//')-backend:latest ./backend

echo "🔐 Logging into GitHub Container Registry..."

echo $GITHUB_TOKEN | docker login ghcr.io -u $(git config --get user.name) --password-stdin

echo "📤 Pushing images to registry..."

docker push ghcr.io/$(git config --get remote.origin.url | sed 's/.*\///' | sed 's/.git$//')-frontend:latest
docker push ghcr.io/$(git config --get remote.origin.url | sed 's/.*\///' | sed 's/.git$//')-backend:latest

echo "🏗️  Applying Terraform infrastructure..."

cd infrastructure

terraform init
terraform plan -var="github_repository=$(git config --get remote.origin.url | sed 's/.*\///' | sed 's/.git$//')" -var="jwt_secret=$JWT_SECRET" -var="github_token=$GITHUB_TOKEN"
terraform apply -auto-approve -var="github_repository=$(git config --get remote.origin.url | sed 's/.*\///' | sed 's/.git$//')" -var="jwt_secret=$JWT_SECRET" -var="github_token=$GITHUB_TOKEN"

cd ..

echo "🔍 Waiting for services to be healthy..."
sleep 60

echo "🧪 Running smoke tests..."

curl -f https://api.yourapp.com/actuator/health || {
    echo "❌ Health check failed"
    exit 1
}

curl -f https://yourapp.com || {
    echo "❌ Frontend health check failed"
    exit 1
}

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend: https://yourapp.com"
echo "🔌 Backend API: https://api.yourapp.com"
#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
REPO_URL="git@github.com:codexonx/codexonx-platform.git"
DEPLOY_DIR="/var/www/codexonx-staging"
ENV_FILE="$DEPLOY_DIR/.env"

echo "Starting staging deployment..."

# Check if deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "Creating deployment directory..."
  mkdir -p "$DEPLOY_DIR"
  git clone "$REPO_URL" "$DEPLOY_DIR"
else
  echo "Updating repository..."
  cd "$DEPLOY_DIR"
  git fetch --all
  git reset --hard origin/staging
fi

# Ensure we're in the deployment directory
cd "$DEPLOY_DIR"

# Check if env file exists, create if not
if [ ! -f "$ENV_FILE" ]; then
  echo "Creating .env file..."
  cp .env.example "$ENV_FILE"
  # You would normally populate this with real values
  echo "WARNING: .env file created with example values. Please update with real values!"
fi

# Make sure SSL directory exists
mkdir -p ./nginx/ssl

# Check for SSL certificates
if [ ! -f ./nginx/ssl/staging.codexonx.com.crt ] || [ ! -f ./nginx/ssl/staging.codexonx.com.key ]; then
  echo "Warning: SSL certificates not found. Using self-signed certificates for now."
  
  # Generate self-signed certificate
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ./nginx/ssl/staging.codexonx.com.key \
    -out ./nginx/ssl/staging.codexonx.com.crt \
    -subj "/CN=staging.codexonx.com/O=Codexonx/C=TR"
    
  echo "Created self-signed certificate for development purposes"
  echo "For production, please replace with valid certificates"
fi

# Build and start the services
echo "Building and starting services..."
docker-compose -f docker-compose.yml -f docker-compose.staging.yml pull
docker-compose -f docker-compose.yml -f docker-compose.staging.yml build
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d

# Run database migrations
echo "Running database migrations..."
sleep 10  # Wait for database to be ready
docker-compose -f docker-compose.yml -f docker-compose.staging.yml exec server npm run migrate

echo "Deployment to staging complete!"
echo "Application is now running at https://staging.codexonx.com"

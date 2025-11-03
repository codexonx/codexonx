#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
REPO_URL="git@github.com:codexonx/codexonx-platform.git"
DEPLOY_DIR="/var/www/codexonx-production"
ENV_FILE="$DEPLOY_DIR/.env"
BACKUP_DIR="/var/backups/codexonx"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "Starting production deployment..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
  echo "Creating deployment directory..."
  mkdir -p "$DEPLOY_DIR"
  git clone "$REPO_URL" "$DEPLOY_DIR"
  git checkout main
else
  echo "Backing up database before deployment..."
  # Backup the database
  docker-compose -f "$DEPLOY_DIR/docker-compose.yml" -f "$DEPLOY_DIR/docker-compose.production.yml" exec -T postgres pg_dump -U postgres codexonx_production > "$BACKUP_DIR/db_backup_${TIMESTAMP}.sql"
  
  echo "Updating repository..."
  cd "$DEPLOY_DIR"
  git fetch --all
  git reset --hard origin/main
fi

# Ensure we're in the deployment directory
cd "$DEPLOY_DIR"

# Check if env file exists, create if not
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env file not found. Deployment aborted."
  echo "Please create a .env file with production settings."
  exit 1
fi

# Check for SSL certificate directories
if [ ! -d "./nginx/letsencrypt" ]; then
  echo "Creating Let's Encrypt directory structure..."
  mkdir -p ./nginx/letsencrypt
  mkdir -p /var/www/certbot
  
  # Obtain initial certificates (comment this out if you're using pre-existing certificates)
  echo "Obtaining SSL certificates..."
  docker run -it --rm \
    -v "$DEPLOY_DIR/nginx/letsencrypt:/etc/letsencrypt" \
    -v "/var/www/certbot:/var/www/certbot" \
    certbot/certbot certonly --webroot \
    -w /var/www/certbot \
    -d codexonx.com -d www.codexonx.com \
    --email admin@codexonx.com --agree-tos
fi

# Create cache directory
mkdir -p ./nginx/cache

# Show warning if monitoring directory doesn't exist
if [ ! -d "./prometheus" ]; then
  echo "Warning: Prometheus config directory not found!"
  echo "Creating basic directory structure..."
  mkdir -p ./prometheus
  cp /path/to/default/prometheus.yml ./prometheus/prometheus.yml
fi
if [ ! -d "./grafana" ]; then
  mkdir -p ./grafana/provisioning/datasources
  mkdir -p ./grafana/provisioning/dashboards
  
  # Create basic Grafana datasource config
  cat > ./grafana/provisioning/datasources/datasource.yml << 'EOL'
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
EOL
fi

# Deploy the application
echo "Building and starting services..."
docker-compose -f docker-compose.yml -f docker-compose.production.yml pull
docker-compose -f docker-compose.yml -f docker-compose.production.yml build
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d

# Run database migrations
echo "Running database migrations..."
sleep 10  # Wait for database to be ready
docker-compose -f docker-compose.yml -f docker-compose.production.yml exec server npm run migrate

# Check that services are running correctly
echo "Checking service health..."
for service in web server nginx prometheus grafana; do
  if ! docker-compose -f docker-compose.yml -f docker-compose.production.yml ps | grep -q "$service.*Up"; then
    echo "WARNING: $service service is not running properly. Please check logs."
  else
    echo "$service is running."
  fi
done

echo "Deployment to production complete!"
echo "Application is now running at https://www.codexonx.com"
echo "Grafana monitoring available at http://your-server-ip:3000"
echo "Prometheus available at http://your-server-ip:9090"

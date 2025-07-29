#!/bin/bash

# MyBank Deployment Script
# Usage: ./deploy.sh [environment]
# Environments: dev, prod (default: prod)

set -e

ENVIRONMENT=${1:-prod}
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "🚀 Starting MyBank deployment for environment: $ENVIRONMENT"
echo "📁 Project directory: $PROJECT_DIR"
echo "⏰ Timestamp: $TIMESTAMP"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_status "Checking Docker..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Check if environment file exists
check_env_file() {
    ENV_FILE=".env.$ENVIRONMENT"
    if [ ! -f "$ENV_FILE" ]; then
        print_warning "Environment file $ENV_FILE not found"
        if [ -f ".env.${ENVIRONMENT}.example" ]; then
            print_status "Copying example file..."
            cp ".env.${ENVIRONMENT}.example" "$ENV_FILE"
            print_warning "Please edit $ENV_FILE with your configuration before continuing"
            exit 1
        fi
    fi
    print_success "Environment file $ENV_FILE found"
}

# Backup current deployment (if exists)
backup_current() {
    if [ "$ENVIRONMENT" = "prod" ]; then
        print_status "Creating backup..."
        BACKUP_DIR="backups/backup_$TIMESTAMP"
        mkdir -p "$BACKUP_DIR"
        
        # Backup database
        if docker-compose -f docker-compose.prod.yml ps database | grep -q "Up"; then
            print_status "Backing up database..."
            docker-compose -f docker-compose.prod.yml exec -T database mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE > "$BACKUP_DIR/database.sql"
            print_success "Database backup created"
        fi
        
        # Backup volumes
        print_status "Backing up volumes..."
        docker run --rm -v mybank_mysql_data_prod:/data -v "$PROJECT_DIR/$BACKUP_DIR":/backup alpine tar czf /backup/mysql_data.tar.gz -C /data .
        
        print_success "Backup completed in $BACKUP_DIR"
    fi
}

# Pull latest images
pull_images() {
    print_status "Pulling latest Docker images..."
    if [ "$ENVIRONMENT" = "prod" ]; then
        docker pull mybank/backend:latest
        docker pull mybank/frontend:latest
    else
        docker-compose -f docker-compose.yml pull
    fi
    print_success "Images pulled successfully"
}

# Deploy application
deploy() {
    print_status "Deploying MyBank..."
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        # Production deployment
        print_status "Starting production deployment..."
        docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --remove-orphans
        
        # Wait for services to be ready
        print_status "Waiting for services to be ready..."
        sleep 30
        
        # Run database migrations
        print_status "Running database migrations..."
        docker-compose -f docker-compose.prod.yml exec -T backend php bin/console doctrine:migrations:migrate --no-interaction
        
    else
        # Development deployment
        print_status "Starting development deployment..."
        docker-compose -f docker-compose.yml up -d --build
        
        # Wait for services to be ready
        print_status "Waiting for services to be ready..."
        sleep 30
        
        # Run database migrations
        print_status "Running database migrations..."
        docker-compose exec -T backend php bin/console doctrine:migrations:migrate --no-interaction
    fi
    
    print_success "Deployment completed"
}

# Health check
health_check() {
    print_status "Performing health checks..."
    
    # Check backend health
    print_status "Checking backend health..."
    if curl -f http://localhost:8082/api/categories > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend health (if running)
    if [ "$ENVIRONMENT" = "prod" ]; then
        print_status "Checking frontend health..."
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_success "Frontend is healthy"
        else
            print_warning "Frontend health check failed"
        fi
    fi
    
    print_success "Health checks completed"
}

# Cleanup old images and containers
cleanup() {
    print_status "Cleaning up old images and containers..."
    docker system prune -f
    print_success "Cleanup completed"
}

# Show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml ps
    else
        docker-compose ps
    fi
    
    echo ""
    print_success "MyBank is now running!"
    echo ""
    echo "🌐 Backend API: http://localhost:8082/api"
    if [ "$ENVIRONMENT" = "prod" ]; then
        echo "🌐 Frontend: http://localhost:3000"
    fi
    echo ""
    echo "📋 To view logs:"
    if [ "$ENVIRONMENT" = "prod" ]; then
        echo "   docker-compose -f docker-compose.prod.yml logs -f"
    else
        echo "   docker-compose logs -f"
    fi
    echo ""
    echo "🛑 To stop:"
    if [ "$ENVIRONMENT" = "prod" ]; then
        echo "   docker-compose -f docker-compose.prod.yml down"
    else
        echo "   docker-compose down"
    fi
}

# Main deployment process
main() {
    echo "=========================================="
    echo "🏦 MyBank Deployment Script"
    echo "=========================================="
    
    check_docker
    check_env_file
    
    if [ "$ENVIRONMENT" = "prod" ]; then
        backup_current
        pull_images
    fi
    
    deploy
    health_check
    cleanup
    show_status
    
    print_success "Deployment completed successfully! 🎉"
}

# Handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main "$@"

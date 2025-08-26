#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
check_env() {
    if [ ! -f .env ]; then
        print_error ".env file not found!"
        print_warning "Please create .env file based on .env.example"
        exit 1
    fi
}

# Build all services
build() {
    print_status "Building Docker images..."
    check_env
    docker-compose build --no-cache
}

# Start all services
start() {
    print_status "Starting all services..."
    check_env
    docker-compose up -d
    print_status "Services started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:3001"
    print_status "PgAdmin: http://localhost:5050"
}

# Stop all services
stop() {
    print_status "Stopping all services..."
    docker-compose down
}

# Restart all services
restart() {
    print_status "Restarting all services..."
    stop
    start
}

# View logs
logs() {
    if [ -z "$1" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $1..."
        docker-compose logs -f "$1"
    fi
}

# Clean up Docker resources
clean() {
    print_status "Cleaning up Docker resources..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_status "Cleanup completed!"
}

# Show service status
status() {
    print_status "Service status:"
    docker-compose ps
}

# Enter service container
shell() {
    if [ -z "$1" ]; then
        print_error "Please specify service name (backend, frontend, postgres, redis, pgadmin)"
        exit 1
    fi
    
    case "$1" in
        backend)
            docker-compose exec backend sh
            ;;
        frontend)
            docker-compose exec frontend sh
            ;;
        postgres)
            docker-compose exec postgres psql -U postgres -d fullstack_app
            ;;
        redis)
            docker-compose exec redis redis-cli
            ;;
        pgadmin)
            docker-compose exec pgadmin sh
            ;;
        *)
            print_error "Unknown service: $1"
            print_warning "Available services: backend, frontend, postgres, redis, pgadmin"
            ;;
    esac
}

# Database operations
db_migrate() {
    print_status "Running Prisma migrations..."
    docker-compose exec backend npx prisma migrate deploy
}

db_generate() {
    print_status "Generating Prisma client..."
    docker-compose exec backend npx prisma generate
}

db_seed() {
    print_status "Seeding database..."
    docker-compose exec backend npx prisma db seed
}

db_studio() {
    print_status "Opening Prisma Studio..."
    print_warning "Prisma Studio will be available at http://localhost:5555"
    docker-compose exec -d backend npx prisma studio --port 5555 --hostname 0.0.0.0
}

db_reset() {
    print_warning "This will reset the database and lose all data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting database..."
        docker-compose exec backend npx prisma migrate reset --force
    else
        print_status "Database reset cancelled."
    fi
}

# Show help
help() {
    echo "Docker Management Script"
    echo ""
    echo "Usage: $0 {command}"
    echo ""
    echo "Commands:"
    echo "  build     - Build all Docker images"
    echo "  start     - Start all services"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  logs      - View logs (optionally specify service)"
    echo "  status    - Show service status"
    echo "  clean     - Clean up Docker resources"
    echo "  shell     - Enter service container (specify service)"
    echo "  db-migrate- Run Prisma database migrations"
    echo "  db-generate- Generate Prisma client"
    echo "  db-seed   - Seed database with Prisma"
    echo "  db-studio - Open Prisma Studio"
    echo "  db-reset  - Reset database (WARNING: deletes all data)"
    echo "  swagger   - Show Swagger documentation URL"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 shell postgres"
    echo "  $0 db-studio"
    echo "  $0 swagger"
}

# Main script logic
case "$1" in
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    shell)
        shell "$2"
        ;;
    db-migrate)
        db_migrate
        ;;
    db-generate)
        db_generate
        ;;
    db-seed)
        db_seed
        ;;
    db-studio)
        db_studio
        ;;
    db-reset)
        db_reset
        ;;
    swagger)
        print_status "Swagger documentation available at:"
        print_status "http://localhost:${PORT:-3001}/api/docs"
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        help
        exit 1
        ;;
esac

#!/bin/bash

echo "🛑 Stopping Shadcn Admin Production Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running."
    exit 1
fi

# Stop all production containers
print_status "Stopping production containers..."
docker-compose -f docker-compose.prod.yml down --remove-orphans

# Optional: Remove volumes (uncomment if you want to clean everything)
# print_status "Removing volumes..."
# docker-compose -f docker-compose.prod.yml down -v

print_success "🎉 Production environment stopped successfully!"
echo ""
print_status "To start the production environment again, run:"
echo "  ./start-prod.sh"

#!/bin/bash

echo "🚀 Building Shadcn Admin for Production..."

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

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Build the frontend
print_status "Building frontend application..."
NODE_ENV=production npm run build

# Check if build was successful
if [ $? -eq 0 ] && [ -d "dist" ]; then
    print_success "Build completed! dist/ directory created"
    print_status "Starting production services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "🎉 Production deployment completed!"
    echo ""
    print_status "Services:"
    echo "  🌐 Frontend: http://localhost"
    echo "  🔧 API: http://localhost:3001"
else
    print_error "Build failed!"
    exit 1
fi

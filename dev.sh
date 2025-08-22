#!/bin/bash

# Shadcn Admin - Development Script
# This script provides various development commands

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_help() {
    echo -e "${BLUE}Shadcn Admin Development Helper${NC}"
    echo "================================"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo -e "  ${GREEN}install${NC}     - Install all dependencies"
    echo -e "  ${GREEN}start${NC}       - Start both frontend and backend"
    echo -e "  ${GREEN}frontend${NC}    - Start only frontend (dev server)"
    echo -e "  ${GREEN}backend${NC}     - Start only backend server"
    echo -e "  ${GREEN}build${NC}       - Build frontend for production"
    echo -e "  ${GREEN}lint${NC}        - Run linting checks"
    echo -e "  ${GREEN}format${NC}      - Format code with prettier"
    echo -e "  ${GREEN}clean${NC}       - Clean node_modules and reinstall"
    echo -e "  ${GREEN}help${NC}        - Show this help message"
    echo ""
}

print_step() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Parse command
COMMAND=${1:-help}

case $COMMAND in
    "install")
        print_step "Running installation script..."
        ./install.sh
        ;;
    
    "start")
        print_step "Starting full application..."
        ./start.sh
        ;;
    
    "frontend")
        print_step "Starting frontend development server..."
        pnpm run dev
        ;;
    
    "backend")
        print_step "Starting backend server..."
        cd server
        node server.js
        ;;
    
    "build")
        print_step "Building frontend for production..."
        pnpm run build
        print_success "Build completed! Check 'dist' folder."
        ;;
    
    "lint")
        print_step "Running linting checks..."
        pnpm run lint
        ;;
    
    "format")
        print_step "Formatting code..."
        pnpm run format
        print_success "Code formatting completed!"
        ;;
    
    "clean")
        print_step "Cleaning node_modules..."
        rm -rf node_modules server/node_modules
        print_step "Reinstalling dependencies..."
        ./install.sh
        ;;
    
    "help"|*)
        print_help
        ;;
esac

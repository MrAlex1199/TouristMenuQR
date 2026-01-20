.PHONY: help setup dev-backend dev-frontend dev-all down logs clean

help:
	@echo "TouristMenuQR Development Commands"
	@echo "=================================="
	@echo "make setup              - Setup the project (install dependencies)"
	@echo "make dev-all            - Start all services (Docker + Frontend)"
	@echo "make dev-backend        - Start only backend services"
	@echo "make dev-frontend       - Start only frontend"
	@echo "make down               - Stop all services"
	@echo "make logs               - View Docker logs"
	@echo "make clean              - Clean build files and node_modules"
	@echo "make lint               - Run linters"
	@echo "make format             - Format code with Prettier"

setup:
	@echo "Setting up TouristMenuQR..."
	@echo "Installing server dependencies..."
	cd server && npm install
	@echo "Installing client dependencies..."
	cd client && npm install
	@echo "Setup complete!"

dev-backend:
	@echo "Starting backend services with Docker..."
	docker-compose up -d
	@echo "Backend services are running on:"
	@echo "- API: http://localhost:3000"
	@echo "- MongoDB: mongodb://root:password123@localhost:27017"

dev-frontend:
	@echo "Starting frontend development server..."
	cd client && npm start

dev-all: dev-backend dev-frontend

down:
	@echo "Stopping Docker services..."
	docker-compose down

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-mongodb:
	docker-compose logs -f mongodb

clean:
	@echo "Cleaning up..."
	rm -rf server/dist server/node_modules
	rm -rf client/node_modules
	rm -rf server/.env
	rm -rf client/.env

lint:
	@echo "Running linters..."
	cd server && npm run lint
	cd client && npm run lint

format:
	@echo "Formatting code..."
	prettier --write "server/src/**/*.ts"
	prettier --write "client/src/**/*.{ts,tsx}"
	prettier --write "client/app/**/*.{ts,tsx}"

install-deps:
	cd server && npm install
	cd client && npm install

docker-build:
	docker-compose build

docker-rebuild:
	docker-compose down -v
	docker-compose build --no-cache
	docker-compose up -d

mongo-shell:
	docker exec -it tourist-menu-qr-mongodb mongosh -u root -p password123

reset: down clean
	@echo "Project reset complete!"

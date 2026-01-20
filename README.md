# TouristMenuQR - Monorepo

A modern mobile and web application for QR-based menu management for tourists. Built with React Native (Expo), NestJS, and MongoDB.

## 🏗️ Project Structure

```
TouristMenuQR/
├── client/              # React Native (Expo) frontend
├── server/              # NestJS backend API
├── docker-compose.yml   # Docker orchestration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🛠️ Tech Stack

- **Frontend:** React Native with Expo (Managed workflow) + TypeScript
- **Backend:** NestJS + TypeScript
- **Database:** MongoDB + Mongoose ODM
- **DevOps:** Docker & Docker Compose
- **Package Manager:** npm or yarn

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose
- Expo CLI (for mobile development)

## 🚀 Getting Started

### 1. Setup Backend (NestJS)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 2. Setup Frontend (Expo + React Native)

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file (if needed)
cp .env.example .env
```

### 3. Running the Stack

#### Using Docker Compose (Recommended)

```bash
# Start all services (MongoDB + NestJS Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The backend will be available at `http://localhost:3000`
MongoDB will be available at `mongodb://root:password123@localhost:27017`

#### Running Frontend

```bash
cd client

# For web preview
npm start

# For iOS (macOS only)
npm run ios

# For Android
npm run android
```

## 📝 Development Workflow

### Backend Development

```bash
# Terminal 1: Start Docker services
docker-compose up

# Terminal 2: Navigate to server
cd server

# Development runs with hot-reload via Docker volume mount
```

### Frontend Development

```bash
cd client
npm start
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
MONGO_URI=mongodb://root:password123@mongodb:27017/tourist_menu_qr?authSource=admin
PORT=3000
```

#### MongoDB (via docker-compose.yml)
- Username: `root`
- Password: `password123`
- Database: `tourist_menu_qr`
- Port: `27017`

## 📚 Scripts

### Backend Scripts
```bash
npm run start       # Start backend
npm run start:dev   # Start with hot-reload
npm run build       # Build for production
npm run test        # Run tests
```

### Frontend Scripts
```bash
npm start           # Start Expo server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run on web
npm run build       # Build for production
```

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v

# Access MongoDB shell
docker exec -it tourist-menu-qr-mongodb mongosh -u root -p password123
```

## 🔍 Debugging

### Backend Debugging
```bash
# Check backend logs
docker-compose logs backend

# SSH into backend container
docker exec -it tourist-menu-qr-backend sh
```

### Database Debugging
```bash
# Access MongoDB shell
docker exec -it tourist-menu-qr-mongodb mongosh -u root -p password123

# View databases
show dbs

# Use database
use tourist_menu_qr

# View collections
show collections
```

## 📦 Adding Dependencies

### Backend
```bash
cd server
npm install package-name
```

### Frontend
```bash
cd client
npm install package-name
# or for Expo-specific packages
npx expo install package-name
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## 📖 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)

## 📝 License

MIT

---

**Last Updated:** January 2026

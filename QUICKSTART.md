# 🚀 TouristMenuQR - Quick Start Guide

Welcome to TouristMenuQR! This guide will help you get the application running in just a few minutes.

## ⚡ Quick Setup (5 minutes)

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- Git

### 1. Clone & Setup
```bash
# Navigate to project
cd TouristMenuQR

# Setup everything with Make
make setup
```

### 2. Start Services
```bash
# Start backend (Terminal 1)
make dev-backend

# Wait for MongoDB to be healthy, then start frontend (Terminal 2)
make dev-frontend
```

### 3. Test the Application

#### Backend API Test
```bash
# Test health endpoint
curl http://localhost:3000/api

# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "restaurant_owner"
  }'
```

#### Frontend Test
- Open http://localhost:19006 in your browser
- Scan QR code with Expo Go app on your phone
- Or press 'w' to open in web browser

## 🎯 What's Working Now

### ✅ Backend Features
- **Authentication**: JWT-based login/register
- **Restaurant Management**: CRUD operations
- **QR Code Generation**: Automatic QR codes for restaurants
- **Role-based Access**: Customer, Restaurant Owner, Admin roles
- **Location Services**: Find nearby restaurants
- **Data Validation**: Input validation with DTOs
- **Database**: MongoDB with Mongoose ODM

### ✅ Frontend Features
- **API Integration**: Complete API service layer
- **Type Safety**: Full TypeScript support
- **Authentication**: Token management with SecureStore
- **Navigation**: React Navigation setup
- **UI Components**: React Native Paper integration

## 🔄 Next Steps

### Phase 3: QR & Menu System
1. **QR Scanner**: Implement camera-based QR scanning
2. **Menu Display**: Create menu viewing interface
3. **Menu Management**: CRUD operations for menus/items

### Quick Development Tasks
```bash
# Add QR scanner
cd client
npx expo install expo-camera expo-barcode-scanner

# Add menu service to backend
cd server
nest generate module menus
nest generate service menus
nest generate controller menus
```

## 🛠️ Development Workflow

### Backend Development
```bash
# Watch mode with hot reload
make dev-backend

# Run tests
make test-backend

# Check logs
make logs-backend
```

### Frontend Development
```bash
# Start Expo dev server
make dev-frontend

# Run on specific platform
cd client && npm run ios     # iOS simulator
cd client && npm run android # Android emulator
cd client && npm run web     # Web browser
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check if MongoDB is running
make logs-mongodb

# Restart services
make down && make dev-backend
```

**Frontend can't connect to API:**
```bash
# Check .env file
cat client/.env

# Should have: EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

**Database connection issues:**
```bash
# Reset database
make reset

# Check MongoDB shell
make mongo-shell
```

## 📱 Testing on Mobile

### Using Expo Go
1. Install Expo Go app on your phone
2. Run `make dev-frontend`
3. Scan QR code with Expo Go app

### Using Simulator
```bash
# iOS (macOS only)
cd client && npm run ios

# Android
cd client && npm run android
```

## 🔐 Authentication Flow

1. **Register**: Create account with email/password
2. **Login**: Get JWT token
3. **Protected Routes**: Token automatically added to requests
4. **Role Access**: Different permissions for customers vs restaurant owners

## 📊 Database Structure

- **Users**: Authentication & profile data
- **Restaurants**: Restaurant information & QR codes
- **Menus**: Menu structure with categories & items (coming soon)

## 🎉 You're Ready!

Your TouristMenuQR application is now running with:
- ✅ Full authentication system
- ✅ Restaurant management
- ✅ QR code generation
- ✅ Location-based search
- ✅ Role-based permissions

Next: Start building the QR scanner and menu display features!

---

**Need Help?** Check the main README.md for detailed documentation or run `make help` for available commands.

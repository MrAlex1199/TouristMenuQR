# Quick Start Guide

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

## 5-Minute Setup

### 1. Clone and Navigate
```bash
cd TouristMenuQR
```

### 2. Install Dependencies
```bash
make setup
```

### 3. Start Backend (Terminal 1)
```bash
make dev-backend
```

Wait for MongoDB to be healthy (check logs):
```bash
make logs-mongodb
```

### 4. Start Frontend (Terminal 2)
```bash
make dev-frontend
```

### 5. That's it!
- API is at: `http://localhost:3000`
- Expo app opens in browser/emulator

## Common Commands

```bash
# View all commands
make help

# Stop everything
make down

# View logs
make logs

# Reset everything
make reset
```

## Next Steps

1. Check [README.md](README.md) for detailed documentation
2. See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
3. Start building your features!

## Verify Setup

### Test Backend
```bash
curl http://localhost:3000/health
```

### Test Database
```bash
make mongo-shell
```

## Having Issues?

1. **Port conflicts**: Change port in `.env` files
2. **Docker not running**: Start Docker Desktop
3. **MongoDB issues**: Run `make reset`
4. **Dependencies**: Run `make clean && make setup`

For more help, see [README.md](README.md)

# Contributing Guidelines

## Code Style

This project uses:
- **Prettier** for code formatting
- **ESLint** for linting
- **TypeScript** for type safety

## Formatting Code

```bash
make format
```

## Running Linter

```bash
make lint
```

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Format code: `make format`
4. Commit: `git commit -m "feat: your feature description"`
5. Push: `git push origin feature/your-feature`
6. Create a Pull Request

## Commit Message Format

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Build/dependencies

Example: `feat: add QR code scanner component`

## Backend Development

### Running Tests
```bash
cd server
npm run test
```

### Building
```bash
cd server
npm run build
```

## Frontend Development

### Debugging
Press `i` in the Expo CLI to open iOS simulator
Press `a` for Android emulator
Press `w` for web preview

### Building for Production
```bash
cd client
npm run build
```

## Troubleshooting

### MongoDB Connection Issues
```bash
docker-compose down -v
docker-compose up -d
```

### Port Already in Use
Change the port in `.env` and `docker-compose.yml`

### Dependencies Update
```bash
make clean
make setup
```

# 🕐 DuoTime - Nx Monorepo

A modern couples' reminder and activity tracking app built with NestJS backend and React Native
mobile app, managed with Nx for optimal development experience.

## 🏗️ Project Structure

```text
DuoTime/
├── apps/
│   ├── backend/      # NestJS GraphQL API
│   └── mobile/       # React Native Expo app
├── libs/             # Shared libraries (future)
├── .github/          # GitHub Actions CI/CD
├── .husky/           # Git hooks
└── package.json      # Root workspace config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL
- Redis
- Expo CLI (for mobile development)

### Development Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start infrastructure services:**

   ```bash
   docker-compose -f backend/docker-compose.dev.yml up -d
   ```

3. **Set up environment variables:**

   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Run database migrations:**

   ```bash
   npm run db:migrate
   ```

5. **Start development servers:**

   ```bash
   # Both backend and mobile (parallel)
   npm run dev

   # Or individually:
   npm run dev:backend    # Backend only
   npm run dev:mobile     # Mobile only
   ```

## 📚 Available Commands

### Workspace Commands

```bash
# Development
npm run dev              # Start both backend and mobile in parallel
npm run dev:backend      # Start backend only
npm run dev:mobile       # Start mobile only

# Build all projects
npm run build

# Test all projects
npm run test

# Lint all projects
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check

# Database operations
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:push          # Push schema
npm run db:studio        # Open Prisma Studio

# Run affected commands (only changed projects)
npm run affected:build
npm run affected:test
npm run affected:lint

# View dependency graph
npm run graph
```

### Backend Commands

```bash
# Development
npx nx run backend:start:dev    # Start in watch mode
npx nx run backend:serve        # Start production server

# Database
npx nx run backend:db:generate  # Generate Prisma client
npx nx run backend:db:migrate   # Run migrations
npx nx run backend:db:push      # Push schema
npx nx run backend:db:studio    # Open Prisma Studio

# Testing
npx nx run backend:test         # Run unit tests
npx nx run backend:test:e2e     # Run e2e tests
```

### Mobile Commands

```bash
# Development
npx nx run mobile:start         # Start Expo dev server
npx nx run mobile:android       # Run on Android
npx nx run mobile:ios           # Run on iOS
npx nx run mobile:web           # Run on web

# Build
npx nx run mobile:build         # Build for production
npx nx run mobile:export        # Export static files

# Code Generation
npx nx run mobile:codegen       # Generate GraphQL types
```

## 🔧 Features

### Backend (NestJS)

- **🔐 Authentication** - Google OAuth integration
- **🔒 Encryption** - Automatic field-level encryption
- **📊 GraphQL API** - Apollo Server with subscriptions
- **💾 Database** - PostgreSQL with Prisma ORM
- **⚡ Caching** - Redis for session and job queues
- **📱 Push Notifications** - Real-time notifications
- **🔄 Job Queues** - Bull queue for background tasks
- **📝 Logging** - Structured logging with Pino
- **🛡️ Security** - Rate limiting, CORS, Helmet

### Mobile (React Native + Expo)

- **📱 Cross-platform** - iOS, Android, and Web
- **🎨 Modern UI** - Gluestack UI components
- **📊 State Management** - Zustand for state
- **🌐 GraphQL Client** - Apollo Client integration
- **🔔 Notifications** - Expo notifications
- **🎯 Type Safety** - Full TypeScript support
- **🎨 Styling** - NativeWind (TailwindCSS)

## 🚀 CI/CD Pipeline

Our GitHub Actions workflow includes:

### Static Analysis

- **Markdown Linting** - Ensures consistent documentation
- **Spell Checking** - Catches typos in code and docs
- **Code Formatting** - Prettier for consistent style
- **ESLint** - Code quality and best practices

### Testing

- **Unit Tests** - Jest for backend and mobile
- **E2E Tests** - End-to-end testing for backend
- **Type Checking** - TypeScript compilation checks
- **GraphQL Codegen** - Schema validation

### Security

- **Dependency Audits** - npm audit for vulnerabilities
- **Code Quality** - Automated code review checks

### Build & Deploy

- **Affected Builds** - Only build changed projects
- **Parallel Execution** - Optimized for speed
- **Caching** - Nx cache for faster builds

## 🛠️ Development Workflow

### Git Hooks (Husky)

- **Pre-commit** - Automatically runs:
  - Code formatting (Prettier)
  - Spell checking (cspell)
  - Markdown linting
  - Lint-staged for changed files only

### Nx Features

- **Affected Commands** - Only run on changed projects
- **Dependency Graph** - Visualize project relationships
- **Caching** - Intelligent build caching
- **Parallel Execution** - Optimized task running

## 📖 Documentation

- [Backend Documentation](./backend/README.md)
- [Mobile Documentation](./mobile/README.md)
- [Docker Setup](./backend/DOCKER.md)
- [Testing Guide](./backend/TESTING.md)
- [Encryption System](./backend/ENCRYPTION.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Submit a pull request

### Commit Guidelines

- Use conventional commits
- Pre-commit hooks will automatically format and check code
- All CI checks must pass before merge

## 📄 License

This project is licensed under the MIT License.

## 🎯 What is CI/CD?

**Continuous Integration (CI)** and **Continuous Deployment (CD)** are software development
practices that help teams deliver code changes more frequently and reliably.

### CI/CD Benefits

- **Automated Testing** - Catch bugs early
- **Code Quality** - Enforce standards automatically
- **Faster Feedback** - Immediate validation of changes
- **Reduced Risk** - Consistent deployment process
- **Team Collaboration** - Shared development standards

### How It Works

1. **Code Push** - Developer pushes to repository
2. **Automated Checks** - CI runs tests, linting, security scans
3. **Quality Gates** - Only passes code gets merged
4. **Deployment** - CD automatically deploys to staging/production

This setup ensures that every change is automatically validated, maintaining high code quality and
reducing manual errors.

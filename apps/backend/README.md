# 🕐 DuoTime Backend

A NestJS backend for the DuoTime application - a couples' reminder and activity tracking app.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL
- Redis

### Development Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start infrastructure services:**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations:**

   ```bash
   npm run db:migrate
   ```

5. **Start the development server:**

   ```bash
   npm run start:dev
   ```

### Docker Setup

For full Docker deployment, see [DOCKER.md](./DOCKER.md).

```bash
# Full stack with Docker
docker-compose up -d

# Development infrastructure only
docker-compose -f docker-compose.dev.yml up -d
```

## 📚 Available Scripts

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start in debug mode

# Production
npm run start:prod         # Start production server
npm run build              # Build the application

# Database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run database migrations
npm run db:push            # Push schema to database
npm run db:studio          # Open Prisma Studio

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run e2e tests
npm run test:cov           # Run tests with coverage
```

## 🔧 Features

- **🔐 Authentication** - Google OAuth integration
- **🔒 Encryption** - Automatic field-level encryption
- **📊 GraphQL API** - Apollo Server with subscriptions
- **💾 Database** - PostgreSQL with Prisma ORM
- **⚡ Caching** - Redis for session and job queues
- **📱 Push Notifications** - Real-time notifications
- **🔄 Job Queues** - Bull queue for background tasks
- **📝 Logging** - Structured logging with Pino
- **🛡️ Security** - Rate limiting, CORS, Helmet

## 🌐 API Endpoints

- **GraphQL Playground:** [http://localhost:3000/graphql](http://localhost:3000/graphql)
- **Health Check:** [http://localhost:3000/health](http://localhost:3000/health)
- **Redis Commander:** [http://localhost:8081](http://localhost:8081)

## 📁 Project Structure

```text
src/
├── auth/                 # Authentication & authorization
├── common/               # Shared utilities & services
│   ├── config/          # Configuration files
│   ├── guards/          # Authentication guards
│   ├── middleware/      # HTTP middleware
│   ├── services/        # Shared services
│   └── utils/           # Utility functions
├── notification/         # Notification system
├── partner-binding/      # Partner connection logic
├── prisma/              # Database configuration
├── shared/              # Shared interfaces & types
└── user/                # User management
```

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=duotime2024

# JWT
JWT_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id

# Encryption
ENCRYPTION_KEY=your-32-character-key
```

## 📖 Documentation

- [Docker Setup](./DOCKER.md)
- [Encryption System](./ENCRYPTION.md)
- [Testing Guide](./TESTING.md)
- [Logging Guide](./LOGGING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

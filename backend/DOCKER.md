# 🐳 Docker Setup for DuoTime Backend

This folder contains Docker Compose files for running the DuoTime backend and its dependencies.

## 📁 Files

- `docker-compose.yml` - Full stack with backend application
- `docker-compose.dev.yml` - Development infrastructure only (no backend)
- `Dockerfile` - Backend application container
- `.env.docker` - Environment variables for Docker

## 🚀 Usage

### Full Stack (Backend + Infrastructure)

```bash
# From backend folder
docker-compose up -d

# This starts:
# - PostgreSQL database
# - Redis cache
# - Redis Commander (GUI)
# - Backend application
```

### Development (Infrastructure Only)

```bash
# From backend folder
docker-compose -f docker-compose.dev.yml up -d

# This starts:
# - PostgreSQL database
# - Redis cache
# - Redis Commander (GUI)
#
# Then run backend locally:
npm run start:dev
```

### Stop Services

```bash
# Stop full stack
docker-compose down

# Stop development services
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose down -v
```

## 🔧 Services

### PostgreSQL

- **Port:** 5432
- **Database:** duotime
- **User:** postgres
- **Password:** vinh2004.

### Redis

- **Port:** 6379
- **Password:** duotime2024
- **Persistence:** Enabled (appendonly)

### Redis Commander

- **Port:** 8081
- **URL:** http://localhost:8081
- **Purpose:** Redis GUI for debugging

### Backend

- **Port:** 3000
- **URL:** http://localhost:3000
- **GraphQL Playground:** http://localhost:3000/graphql

## 🔐 Environment Variables

Create `.env.docker` file in the backend folder:

```env
# Database
DATABASE_URL="postgresql://postgres:vinh2004.@postgres:5432/duotime"

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=duotime2024

# JWT
JWT_SECRET=your-jwt-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🛠️ Development Workflow

1. **Start infrastructure:**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Run backend locally:**

   ```bash
   npm install
   npm run start:dev
   ```

3. **Access services:**
   - Backend: http://localhost:3000
   - GraphQL: http://localhost:3000/graphql
   - Redis GUI: http://localhost:8081

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Redis Connection Issues

```bash
# Check Redis status
docker-compose logs redis

# Test Redis connection
docker exec -it duotime-redis redis-cli -a duotime2024 ping
```

### Backend Issues

```bash
# View backend logs
docker-compose logs backend

# Rebuild backend
docker-compose build backend
docker-compose up -d backend
```

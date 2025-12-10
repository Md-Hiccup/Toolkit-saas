# Docker Setup Guide

## Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose v2 (included with Docker Desktop)

## Quick Start

### 1. Build and Run with Docker Compose
```bash
docker compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8005
- **API Docs**: http://localhost:8005/docs

### 2. Run in Background
```bash
docker compose up -d
```

### 3. Stop the Application
```bash
docker compose down
```

### 4. View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

## Sharing with Your Friend

### Option 1: Share via Docker Hub (Recommended)

**Build and push images:**
```bash
# Login to Docker Hub
docker login

# Build and tag images
docker compose build
docker tag toolkit-saas-backend yourusername/toolkit-backend:latest
docker tag toolkit-saas-frontend yourusername/toolkit-frontend:latest

# Push to Docker Hub
docker push yourusername/toolkit-backend:latest
docker push yourusername/toolkit-frontend:latest
```

**Your friend can pull and run:**
```bash
docker pull yourusername/toolkit-backend:latest
docker pull yourusername/toolkit-frontend:latest
docker compose up
```

### Option 2: Export/Import Docker Images

**Export images to files:**
```bash
docker save -o toolkit-backend.tar toolkit-saas-backend
docker save -o toolkit-frontend.tar toolkit-saas-frontend
```

**Share the .tar files with your friend. They can import:**
```bash
docker load -i toolkit-backend.tar
docker load -i toolkit-frontend.tar
docker compose up
```

### Option 3: Share Source + Docker Files

Share the entire project folder. Your friend just needs to run:
```bash
docker compose up --build
```

## Development Mode

To run with hot-reload for development:

**Backend:**
```bash
docker compose run --rm -p 8005:8000 -v $(pwd)/backend:/app backend uvicorn app.main:app --host 0.0.0.0 --reload
```

**Frontend:**
```bash
docker compose run --rm -p 3000:3000 -v $(pwd)/frontend:/app frontend npm run dev
```

## Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml
# Example: "8006:8000" instead of "8005:8000"
```

### Rebuild After Code Changes
```bash
docker compose up --build
```

### Clean Everything
```bash
docker compose down -v
docker system prune -a
```

## Production Deployment

For production, consider:
- Using environment variables for configuration
- Setting up proper logging
- Adding HTTPS/SSL certificates
- Using a reverse proxy (nginx)
- Implementing health checks and monitoring

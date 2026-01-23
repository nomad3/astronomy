# Astronomy Dashboard - Kubernetes Deployment Guide

## Architecture Overview

The application consists of:
- **Frontend**: Next.js 16 client served via nginx
- **Backend**: FastAPI server with Redis caching
- **Infrastructure**: GKE cluster with Helm charts

## Container Images

Images are hosted on Google Container Registry:
- `gcr.io/ai-agency-479516/astronomy-server:<tag>`
- `gcr.io/ai-agency-479516/astronomy-client:<tag>`

## Building Images

### Server
```bash
cd server
docker build --platform linux/amd64 -t gcr.io/ai-agency-479516/astronomy-server:<tag> .
docker push gcr.io/ai-agency-479516/astronomy-server:<tag>
```

### Client
```bash
cd client
docker build --platform linux/amd64 -t gcr.io/ai-agency-479516/astronomy-client:<tag> .
docker push gcr.io/ai-agency-479516/astronomy-client:<tag>
```

## Deploying to Kubernetes

### Using kubectl
```bash
# Deploy server
kubectl set image deployment/astronomy-server server=gcr.io/ai-agency-479516/astronomy-server:<tag> -n prod

# Deploy client
kubectl set image deployment/astronomy-client client=gcr.io/ai-agency-479516/astronomy-client:<tag> -n prod

# Check rollout status
kubectl rollout status deployment/astronomy-server -n prod
kubectl rollout status deployment/astronomy-client -n prod
```

### Using Helm
```bash
cd helm/astronomy
helm upgrade astronomy . -n prod -f values.yaml
```

## Verifying Deployment

```bash
# Check pods
kubectl get pods -n prod -l app=astronomy

# Check logs
kubectl logs -f deployment/astronomy-server -n prod
kubectl logs -f deployment/astronomy-client -n prod

# Check endpoints
kubectl get svc -n prod
kubectl get ingress -n prod
```

## Environment Variables

### Server
- `REDIS_HOST`: Redis hostname (default: `redis`)
- `NASA_API_KEY`: NASA API key for NeoWs and other APIs
- `CORS_ORIGINS`: Allowed CORS origins

### Client
- `NEXT_PUBLIC_API_URL`: Backend API URL (set to `/api` in production)

## API Endpoints

### Launches
- `GET /api/launches` - List upcoming launches
- `GET /api/launches/{id}` - Launch details

### Asteroids
- `GET /api/asteroids` - List near-Earth objects
- `GET /api/asteroids/{id}` - Asteroid details

### Analytics
- `GET /api/analytics/overview` - Dashboard statistics

### Space Weather
- `GET /api/space-weather` - DONKI notifications

### Gallery
- `GET /api/gallery` - NASA APOD images

## Troubleshooting

### 502 Errors
Check server logs:
```bash
kubectl logs deployment/astronomy-server -n prod --tail=100
```

### Frontend API Issues
Verify the client is using the correct API URL:
```bash
kubectl exec deployment/astronomy-client -n prod -- printenv | grep API
```

### Redis Connection
```bash
kubectl exec deployment/astronomy-server -n prod -- python -c "import redis; r = redis.Redis(host='redis'); print(r.ping())"
```

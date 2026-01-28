# FoodTrack - Deployment Guide

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) - Recommended

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/foodtrack.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
   - Click "Deploy"

3. **Environment Variables** (if using API)
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL=your-backend-url`

### Option 2: Netlify (Frontend)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy"

### Option 3: Railway (Backend API)

Railway is perfect for deploying FastAPI backends.

#### Steps:

1. **Create railway.json** in backend folder:
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

2. **Deploy**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder as root
   - Railway will auto-detect Python and deploy

3. **Update CORS**
   - After deployment, get your Railway URL
   - Update `allow_origins` in `backend/main.py`:
     ```python
     allow_origins=[
         "http://localhost:3000",
         "https://your-vercel-app.vercel.app"
     ]
     ```

### Option 4: Render (Backend API)

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure:
   - Name: foodtrack-api
   - Root Directory: backend
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"

### Option 5: Docker Deployment

#### Frontend Dockerfile

Create `Dockerfile` in root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Backend Dockerfile

Create `Dockerfile` in backend folder:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Docker Compose

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
```

Deploy:
```bash
docker-compose up -d
```

## 🔧 Production Checklist

### Frontend
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Enable analytics (optional)
- [ ] Test all pages and routes
- [ ] Verify responsive design
- [ ] Check 3D animations performance
- [ ] Test form validation
- [ ] Optimize images (if any added)

### Backend
- [ ] Update CORS origins to production frontend URL
- [ ] Add rate limiting (optional)
- [ ] Implement request logging
- [ ] Add error tracking (Sentry, etc.)
- [ ] Configure production database (if needed)
- [ ] Replace simulated ML with actual model
- [ ] Set up monitoring

## 🚀 Quick Deploy Commands

### Frontend to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### Backend to Railway
```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
```

## 📊 Performance Optimization

### Frontend
1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Next.js does this automatically
3. **Lazy Loading**: Already implemented for 3D components
4. **Caching**: Configure in `next.config.js`

### Backend
1. **Caching**: Implement Redis for repeated predictions
2. **Load Balancing**: Use multiple workers
3. **Database**: Add PostgreSQL for storing predictions
4. **CDN**: Use for static assets

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use server-side environment variables
3. **CORS**: Restrict to specific domains in production
4. **Rate Limiting**: Implement to prevent abuse
5. **HTTPS**: Always use HTTPS in production

## 📱 Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Railway
1. Go to Settings → Domains
2. Add custom domain
3. Configure DNS CNAME record

## 🎯 Testing Before Deployment

```bash
# Build and test frontend locally
npm run build
npm start

# Test backend
cd backend
python main.py
# Visit http://localhost:8000/docs

# Run tests (if added)
npm test
```

## 📈 Monitoring & Analytics

Consider adding:
- **Frontend**: Google Analytics, Vercel Analytics
- **Backend**: New Relic, DataDog
- **Errors**: Sentry for both frontend and backend
- **Logs**: Papertrail, LogDNA

## 🎉 Post-Deployment

1. Test all features on production URL
2. Check mobile responsiveness
3. Verify API connections
4. Monitor performance metrics
5. Share with users!

---

**Your FoodTrack app is ready for the world! 🚀**

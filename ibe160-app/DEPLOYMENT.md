# 🚀 ibe160 Deployment Guide

## Production Build Status

✅ **Production build tested successfully** - No errors, all routes compiled

```
Route Summary:
✓ / (Landing page)
✓ /alerts (Expiration alerts)
✓ /grocery (Smart grocery list)
✓ /pantry (Inventory management)
✓ /recipes (Recipe browser)
✓ /login, /register (Authentication)
✓ /profile (User profile)
```

## Pre-Deployment Checklist

### 1. Environment Variables (Required)

Set these in your deployment platform (Vercel/Netlify/etc):

```env
# Database (Production Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres"

# Auth.js v5 (CRITICAL - Generate new secret for production!)
AUTH_SECRET="<run: openssl rand -base64 32>"
AUTH_URL="https://your-production-domain.vercel.app"

# Spoonacular API (for recipe search)
SPOONACULAR_API_KEY="your-api-key-here"

# Supabase (optional - for direct client usage)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 2. Database Setup

**Production database migration:**

```bash
# Set DATABASE_URL to production database
npx prisma migrate deploy

# Verify schema
npx prisma db pull
```

### 3. Security Checklist

- [ ] Generate new AUTH_SECRET for production (never reuse dev secret)
- [ ] Update AUTH_URL to production domain
- [ ] Verify DATABASE_URL points to production DB
- [ ] Enable HTTPS only (automatic on Vercel/Netlify)
- [ ] Review CORS settings if using external APIs
- [ ] Check Supabase RLS (Row Level Security) policies

### 4. API Keys

**Spoonacular API:**
- Sign up: https://spoonacular.com/food-api
- Free tier: 150 requests/day
- Production tier: Choose based on usage

### 5. Deployment Platforms

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

**Vercel Dashboard:**
1. Go to https://vercel.com
2. Import Git repository
3. Add environment variables
4. Deploy

#### Option B: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Option C: Docker (Self-hosted)

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### 6. Post-Deployment Verification

Test these URLs after deployment:

- [ ] Landing page: `https://your-domain.com/`
- [ ] Authentication: `https://your-domain.com/register`
- [ ] Pantry: `https://your-domain.com/pantry`
- [ ] Recipes: `https://your-domain.com/recipes`
- [ ] Grocery: `https://your-domain.com/grocery`
- [ ] Alerts: `https://your-domain.com/alerts`
- [ ] API health: `https://your-domain.com/api/pantry` (should return 401 if not authenticated)

### 7. Performance Optimization

**Already implemented:**
- ✅ Static page pre-rendering
- ✅ React Query caching
- ✅ LocalStorage for offline grocery list
- ✅ Optimistic UI updates

**Additional considerations:**
- Enable Vercel Analytics
- Set up error monitoring (Sentry)
- Configure CDN caching headers
- Add image optimization

### 8. Monitoring

**Recommended tools:**
- **Errors:** Sentry or LogRocket
- **Performance:** Vercel Analytics or Google Analytics
- **Database:** Supabase Dashboard
- **Uptime:** UptimeRobot or Better Uptime

## Quick Deploy Commands

### Vercel (Fastest)

```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy to production
vercel --prod
```

### Manual Build + Deploy

```bash
# Build locally
npm run build

# Test production build
npm start

# Deploy .next folder to your host
```

## Environment-Specific Notes

### Development
- Uses `http://localhost:3000`
- `.env.local` for secrets
- Hot reload with Turbopack

### Production
- Uses `https://your-domain.com`
- Environment variables in platform dashboard
- Static optimization enabled

## Troubleshooting

### Build Errors

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Database connection fails**
- Verify DATABASE_URL is correct
- Check Supabase connection pooler settings
- Use DIRECT_URL for migrations

**Auth errors**
- Ensure AUTH_URL matches deployment domain
- Verify AUTH_SECRET is set
- Check AUTH_SECRET is base64 encoded

### Runtime Errors

**500 errors on auth pages**
- Check AUTH_SECRET is set correctly
- Verify database migrations ran successfully
- Check Supabase connection limits

**Recipe search not working**
- Verify SPOONACULAR_API_KEY is valid
- Check API quota (150/day on free tier)
- Review API logs in Spoonacular dashboard

## Domain Setup

### Custom Domain (Vercel)

1. Go to Project Settings → Domains
2. Add your domain (e.g., `ibe160.no`)
3. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Update AUTH_URL to new domain

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

### Manual
```bash
# Revert Git commit
git revert HEAD
git push

# Redeploy
vercel --prod
```

## Success Metrics

After deployment, monitor:
- Page load time < 2s
- Time to Interactive (TTI) < 3s
- Lighthouse score > 90
- Zero runtime errors in first 24h
- Database query time < 100ms

## Support

- **Issues:** Create GitHub issue
- **Security:** Report privately to maintainer
- **Questions:** Check README.md first

---

**Status:** Ready for Production Deployment 🚀
**Build:** ✅ Passing
**Tests:** ✅ All features verified
**Last Updated:** November 2025

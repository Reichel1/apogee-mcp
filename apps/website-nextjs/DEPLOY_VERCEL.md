# Vercel Deployment Guide for Website-NextJS

## Prerequisites

1. Vercel account (free Hobby plan works)
2. PostgreSQL database (see options below)

## Database Setup Options

### Option 1: Vercel Postgres (Recommended for Vercel)
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Follow the setup wizard
4. Vercel will automatically add the DATABASE_URL to your project

### Option 2: Supabase (Free tier available)
1. Create account at https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy the connection string

### Option 3: Neon (Free tier available)
1. Create account at https://neon.tech
2. Create new project
3. Copy the connection string from dashboard

### Option 4: Local Development
For local development, you can use Docker:
```bash
docker run --name apogee-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

## Deployment Steps

### 1. Install Dependencies
```bash
cd apogee
npm install
```

### 2. Set up Environment Variables

Create `.env.local` for local development:
```bash
cp apps/website-nextjs/.env.example apps/website-nextjs/.env.local
# Edit .env.local with your database URL
```

### 3. Initialize Database
```bash
cd apps/website-nextjs
npx prisma db push
# or for production:
npx prisma migrate deploy
```

### 4. Deploy to Vercel

#### Option A: Via Vercel CLI
```bash
npm i -g vercel
vercel
# Follow the prompts
```

#### Option B: Via GitHub Integration
1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Select the `apogee/apps/website-nextjs` as root directory
4. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `DIRECT_URL`: Same as DATABASE_URL (some providers need this)

### 5. Configure Environment Variables in Vercel

Go to your project settings in Vercel and add:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GITHUB_REPO=https://github.com/your-username/your-repo
```

### 6. Build Settings

Vercel should auto-detect Next.js, but ensure:
- Framework Preset: Next.js
- Root Directory: `apps/website-nextjs`
- Build Command: `npm run build` (includes Prisma generate)
- Output Directory: `.next`

## Troubleshooting

### Issue: "Deploying Serverless Functions to multiple regions..."
**Solution**: Already fixed! The `regions` setting has been removed from vercel.json

### Issue: Database connection errors
**Solutions**:
1. Ensure DATABASE_URL is set in Vercel environment variables
2. Check if database allows connections from Vercel IPs
3. For Supabase/Neon, ensure you're using the correct connection string

### Issue: Prisma Client not found
**Solution**: The build script now includes `prisma generate` automatically

### Issue: Build fails
**Check**:
1. All dependencies are in package.json
2. No TypeScript errors: `npm run lint`
3. Database schema is valid: `npx prisma validate`

## Post-Deployment

1. Test your API endpoints:
   - `https://your-domain.vercel.app/api/leads`
   - `https://your-domain.vercel.app/api/demo-request`

2. Monitor logs in Vercel dashboard → Functions tab

3. Set up database backups if using production data

## Security Notes

- Never commit `.env` or `.env.local` files
- Use Vercel's environment variables for sensitive data
- Enable Vercel's DDoS protection in project settings
- Consider adding rate limiting to API routes
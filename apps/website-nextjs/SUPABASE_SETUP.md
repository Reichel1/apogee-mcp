# Supabase Setup for MCP Website

## Getting Your Database Connection String

1. **Go to Supabase Dashboard**:
   - Visit: https://app.supabase.com/project/ujetbhhidxkenudwtmqa/settings/database
   - This is your existing apogeestudios.dev project

2. **Find Connection String**:
   - Look for "Connection string" section
   - Copy the URI that looks like:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.ujetbhhidxkenudwtmqa.supabase.co:5432/postgres
     ```

## Setting Environment Variables

### Option 1: Via Vercel CLI (Recommended)
```bash
vercel env add DATABASE_URL
# Paste your full connection string when prompted
# Choose: Production, Preview, Development (all)

vercel env add DIRECT_URL  
# Paste the same connection string
# Choose: Production, Preview, Development (all)
```

### Option 2: Via Vercel Dashboard
1. Go to: https://vercel.com/zander-rrs-projects/docs/settings/environment-variables
2. Add `DATABASE_URL` with your connection string
3. Add `DIRECT_URL` with the same value
4. Set for Production, Preview, and Development

## Deploy Database Schema

After setting environment variables:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: View database
npx prisma studio
```

## Database Tables Created

The following tables will be created with `mcp_` prefix:
- `mcp_leads` - Lead information with tags ["mcp-website"]
- `mcp_demo_requests` - Demo requests
- `mcp_waitlist_entries` - Waitlist signups
- `mcp_newsletter_subscriptions` - Newsletter subscriptions

## User Tagging System

All leads automatically get tagged with `["mcp-website"]` to distinguish them from other apogeestudios.dev users:

```sql
-- Example query to find all MCP website leads
SELECT * FROM mcp_leads WHERE 'mcp-website' = ANY(tags);
```

## Final Deployment

After database setup:
```bash
vercel --prod
```

Your website will be live with full database functionality!
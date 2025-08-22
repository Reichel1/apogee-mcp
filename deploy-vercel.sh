#!/bin/bash

# Apogee MCP - Vercel Deployment Script
# Deploy the website to mcp.apogeestudios.dev

set -e

echo "🚀 Deploying Apogee MCP to Vercel..."

# Check if we're in the right directory
if [ ! -f "apps/website-nextjs/package.json" ]; then
    echo "❌ Error: Please run this script from the apogee root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Navigate to website directory
cd apps/website-nextjs

# Check if authenticated with Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project locally to check for errors
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."

# Deploy with custom domain configuration
vercel --prod \
  --name apogee-mcp \
  --scope reichel1 \
  --confirm \
  --env NEXT_PUBLIC_SITE_URL=https://mcp.apogeestudios.dev \
  --env NEXT_PUBLIC_GITHUB_REPO=https://github.com/Reichel1/apogee-mcp

# Get deployment URL
DEPLOYMENT_URL=$(vercel --scope reichel1 ls apogee-mcp --meta production -t 1 | grep "https://" | awk '{print $2}' | head -1)

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "📋 Next steps:"
echo "   1. Set up custom domain: mcp.apogeestudios.dev"
echo "   2. Configure DNS to point to Vercel"
echo "   3. Update domain in Vercel dashboard"
echo ""
echo "🔗 Deployment URL: $DEPLOYMENT_URL"
echo "🔗 Vercel Dashboard: https://vercel.com/reichel1/apogee-mcp"
echo ""

# Instructions for custom domain setup
echo "🌐 Custom Domain Setup:"
echo "   1. Go to https://vercel.com/reichel1/apogee-mcp/settings/domains"
echo "   2. Add domain: mcp.apogeestudios.dev"
echo "   3. Configure DNS with your domain provider:"
echo "      Type: CNAME"
echo "      Name: mcp"
echo "      Value: cname.vercel-dns.com"
echo ""
echo "   Or if using Cloudflare/other DNS:"
echo "      Type: A"
echo "      Name: mcp"
echo "      Value: 76.76.19.61 (Vercel's IP)"
echo ""

# Environment variables setup
echo "⚙️  Environment Variables Setup:"
echo "   Set these in Vercel dashboard if not already configured:"
echo "   - NEXT_PUBLIC_SITE_URL=https://mcp.apogeestudios.dev"
echo "   - NEXT_PUBLIC_GITHUB_REPO=https://github.com/Reichel1/apogee-mcp"
echo ""

echo "🚀 Ready to launch at mcp.apogeestudios.dev!"
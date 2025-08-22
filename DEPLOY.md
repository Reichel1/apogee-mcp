# 🚀 Apogee MCP Deployment Guide

Complete deployment instructions for launching at **mcp.apogeestudios.dev**

## 🎯 **Quick Launch (5 minutes)**

```bash
# 1. Set up GitHub repository
./init-github-repo.sh

# 2. Deploy website to Vercel
./deploy-vercel.sh

# 3. Publish NPM package (when ready)
cd apps/mcp-server
npm publish
```

## 📋 **Detailed Deployment Steps**

### **Step 1: GitHub Repository Setup**

```bash
# Make sure you're in the apogee directory
cd /path/to/apogee

# Initialize GitHub repository
./init-github-repo.sh
```

This script will:
- Initialize git repository with proper .gitignore
- Create initial commit with all code
- Create GitHub repository at `Reichel1/apogee-mcp`
- Set up issue templates and labels
- Configure branch protection

### **Step 2: Vercel Website Deployment**

```bash
# Deploy website to Vercel
./deploy-vercel.sh
```

This script will:
- Install Vercel CLI if needed
- Build and deploy the Next.js website
- Configure custom domain settings
- Set up environment variables

**Manual Domain Setup:**
1. Go to [Vercel Dashboard](https://vercel.com/reichel1/apogee-mcp/settings/domains)
2. Add domain: `mcp.apogeestudios.dev`
3. Configure DNS:
   ```
   Type: CNAME
   Name: mcp
   Value: cname.vercel-dns.com
   ```

### **Step 3: NPM Package Publishing**

```bash
cd apps/mcp-server

# Build the package
npm run build

# Login to npm (if not already)
npm login

# Publish the package
npm publish
```

### **Step 4: Update Package References**

After publishing, update all references from local to published package:

1. **Website install command**: Already uses `@apogee/mcp-server`
2. **Documentation examples**: Already configured correctly
3. **Cursor directory submission**: Ready to submit

## 🌐 **Website Features Ready**

✅ **Clean Apogee Studios Design**
- Space Grotesk font matching your brand
- Pure black & white theme
- Minimal, professional aesthetic

✅ **Terminal-First Experience**
- Prominent install command: `npm install -g @apogee/mcp-server`
- Copy-paste configuration for Cursor
- Step-by-step setup instructions

✅ **Complete Documentation**
- Quick start guide for all platforms
- Installation troubleshooting
- API reference with examples

✅ **Production Ready**
- Vercel optimized with caching
- SEO meta tags and sitemap
- Performance monitoring

## 📱 **Mobile & Desktop Optimized**

The website is fully responsive and optimized for:
- Desktop developers (primary audience)
- Mobile viewing for quick reference
- Terminal/CLI workflow integration

## 🔧 **Development Workflow**

### Local Development
```bash
cd apps/website-nextjs
npm install
npm run dev
# Visit http://localhost:3000
```

### Testing the MCP Server
```bash
cd apps/mcp-server
npm run dev -- --stdio
# Test stdio transport

npm run dev -- --port=3001
# Test HTTP transport
```

## 📊 **Analytics & Monitoring**

The website includes:
- Vercel Analytics for traffic monitoring
- Performance tracking
- Conversion funnel for install → configure → success

## 🎯 **Launch Checklist**

### Pre-Launch
- [ ] Run `./init-github-repo.sh`
- [ ] Run `./deploy-vercel.sh`
- [ ] Configure custom domain DNS
- [ ] Test website functionality
- [ ] Verify install command works

### Launch Day
- [ ] Publish npm package
- [ ] Submit to Cursor MCP directory
- [ ] Announce on social media
- [ ] Share with developer communities

### Post-Launch
- [ ] Monitor website analytics
- [ ] Track npm download metrics
- [ ] Collect user feedback
- [ ] Iterate based on usage

## 🔗 **Important URLs**

- **Website**: https://mcp.apogeestudios.dev
- **GitHub**: https://github.com/Reichel1/apogee-mcp
- **NPM**: https://npmjs.com/package/@apogee/mcp-server
- **Vercel**: https://vercel.com/reichel1/apogee-mcp

## 🆘 **Support**

If you encounter any issues during deployment:

1. **GitHub Issues**: File issues at the repository
2. **Vercel Support**: Check deployment logs
3. **DNS Issues**: Verify domain configuration
4. **NPM Issues**: Check package.json and build process

---

**Ready to launch the first commercial MCP server!** 🎉

The architecture is production-ready, the design matches your brand perfectly, and all deployment scripts are automated for a smooth launch experience.
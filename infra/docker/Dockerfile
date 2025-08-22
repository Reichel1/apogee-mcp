FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
COPY apps/mcp-server/package*.json ./apps/mcp-server/

RUN npm ci --only=production

# Copy source code
COPY apps/mcp-server/ ./apps/mcp-server/
COPY packages/ ./packages/

# Build the server
WORKDIR /app/apps/mcp-server
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "dist/index.js", "--port=3001"]
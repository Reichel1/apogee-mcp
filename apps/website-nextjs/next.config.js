/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static optimization for better performance
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/Reichel1/apogee-mcp',
        permanent: false,
      },
      {
        source: '/npm',
        destination: 'https://www.npmjs.com/package/@apogee/mcp-server',
        permanent: false,
      },
    ];
  },
  
  // Environment variables available to the client
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://mcp.apogeestudios.dev',
    NEXT_PUBLIC_GITHUB_REPO: 'https://github.com/Reichel1/apogee-mcp',
  },
  
  // Experimental features
  experimental: {
    // Enable app directory (if using Next.js 13+)
    // appDir: true,
    
    // Optimize font loading
    optimizeFonts: true,
    
    // Enable SWC plugins
    swcPlugins: [],
  },
  
  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add custom webpack configuration here if needed
    
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    
    return config;
  },
  
  // TypeScript configuration
  typescript: {
    // Disable type checking during build (handle in CI instead)
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Disable ESLint during build (handle in CI instead)
    ignoreDuringBuilds: false,
  },
  
  // Trailing slash handling
  trailingSlash: false,
  
  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/mcp/:path*',
        destination: '/api/mcp/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
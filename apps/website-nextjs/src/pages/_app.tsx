import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Apogee MCP - Multi-Agent AI Development Coordination</title>
        <meta name="description" content="The MCP server that lets multiple dev agents collaborate safely—shared TODOs, conflict-free patches, and Claude-owned DB migrations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mcp.apogeestudios.dev/" />
        <meta property="og:title" content="Apogee MCP - Multi-Agent AI Development Coordination" />
        <meta property="og:description" content="The MCP server that lets multiple dev agents collaborate safely—shared TODOs, conflict-free patches, and Claude-owned DB migrations." />
        <meta property="og:image" content="https://mcp.apogeestudios.dev/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://mcp.apogeestudios.dev/" />
        <meta property="twitter:title" content="Apogee MCP - Multi-Agent AI Development Coordination" />
        <meta property="twitter:description" content="The MCP server that lets multiple dev agents collaborate safely—shared TODOs, conflict-free patches, and Claude-owned DB migrations." />
        <meta property="twitter:image" content="https://mcp.apogeestudios.dev/og-image.png" />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Apogee Studios" />
        <meta name="keywords" content="MCP, Model Context Protocol, AI development, multi-agent, Claude Code, Cursor, OpenAI, development tools, coordination" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://mcp.apogeestudios.dev/" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Apogee MCP",
              "description": "Multi-agent AI development coordination server implementing the Model Context Protocol",
              "url": "https://mcp.apogeestudios.dev",
              "author": {
                "@type": "Organization",
                "name": "Apogee Studios",
                "url": "https://apogeestudios.dev"
              },
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "macOS, Linux, Windows",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "downloadUrl": "https://npmjs.com/package/@apogee/mcp-server",
              "codeRepository": "https://github.com/Reichel1/apogee-mcp"
            })
          }}
        />
      </Head>
      
      <Component {...pageProps} />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontFamily: 'Space Grotesk, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#000',
            },
          },
        }}
      />
    </>
  );
}
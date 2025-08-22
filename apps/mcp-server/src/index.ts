#!/usr/bin/env node

import { StdioTransport } from './transports/stdio.js';
import { HttpTransport } from './transports/http.js';

const args = process.argv.slice(2);
const isStdio = args.includes('--stdio');
const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1] || '3001');

async function main() {
  try {
    if (isStdio) {
      // Start stdio transport for local development
      const stdio = new StdioTransport();
      await stdio.start();
    } else {
      // Start HTTP transport for production/remote MCP
      const http = new HttpTransport(port);
      await http.start();
    }
  } catch (error) {
    console.error('Failed to start Apogee MCP Server:', error);
    process.exit(1);
  }
}

main();
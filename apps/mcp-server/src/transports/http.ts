import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { StateManager } from '../core/state.js';
import { PolicyEnforcer } from '../auth/policy.js';
import { APOGEE_TOOLS, APOGEE_RESOURCES } from '../core/spec.js';
import { ToolHandlers } from '../features/tools/index.js';
import { ResourceHandlers } from '../features/resources/index.js';

export class HttpTransport {
  private fastify;
  private server: Server;
  private stateManager: StateManager;
  private policy: PolicyEnforcer;
  private toolHandlers: ToolHandlers;
  private resourceHandlers: ResourceHandlers;
  private port: number;

  constructor(port = 3001) {
    this.port = port;
    this.fastify = Fastify({ logger: true });
    
    this.server = new Server(
      {
        name: 'apogee-mcp-server',
        version: '1.0.0',
        description: 'Apogee AI Dev SDK - Simultaneous Claude Code + GPT-5 Development'
      },
      {
        capabilities: {
          tools: {},
          resources: {}
        }
      }
    );

    this.stateManager = new StateManager();
    this.policy = new PolicyEnforcer();
    
    this.toolHandlers = new ToolHandlers(this.stateManager, this.policy);
    this.resourceHandlers = new ResourceHandlers(this.stateManager);

    this.setupMiddleware();
    this.setupRoutes();
  }

  private async setupMiddleware() {
    // CORS with origin validation
    await this.fastify.register(cors, {
      origin: (origin, callback) => {
        if (!origin) return callback(null, false);
        const isValid = this.policy.validateOrigin(origin);
        callback(null, isValid);
      },
      credentials: true
    });

    // Auth middleware
    this.fastify.addHook('preHandler', async (request, reply) => {
      if (request.url === '/health') return; // Skip auth for health check
      
      const auth = this.policy.extractAuthFromHeaders(request.headers as Record<string, string>);
      if (!auth) {
        reply.code(401).send({ error: 'Authorization required' });
        return;
      }

      request.auth = auth;
    });
  }

  private setupRoutes() {
    // Health check
    this.fastify.get('/health', async () => {
      return { status: 'ok', version: '1.0.0' };
    });

    // Main MCP endpoint - handles JSON-RPC over HTTP
    this.fastify.post('/mcp', async (request, reply) => {
      const auth = request.auth;
      if (!auth) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
      }

      try {
        const rpcRequest = request.body as any;
        
        // Handle different MCP request types
        switch (rpcRequest.method) {
          case 'tools/list':
            return {
              jsonrpc: '2.0',
              id: rpcRequest.id,
              result: {
                tools: APOGEE_TOOLS.map(tool => ({
                  name: tool.name,
                  description: tool.description,
                  inputSchema: tool.inputSchema
                }))
              }
            };

          case 'resources/list':
            return {
              jsonrpc: '2.0',
              id: rpcRequest.id,
              result: { resources: APOGEE_RESOURCES }
            };

          case 'tools/call':
            const { name, arguments: args } = rpcRequest.params;
            
            if (!this.policy.canExecuteTool(auth, name)) {
              return {
                jsonrpc: '2.0',
                id: rpcRequest.id,
                error: {
                  code: -32603,
                  message: `Tool ${name} not authorized for role ${auth.role}`
                }
              };
            }

            const result = await this.toolHandlers.executeTool(name, args, auth);
            return {
              jsonrpc: '2.0',
              id: rpcRequest.id,
              result
            };

          case 'resources/read':
            const { uri } = rpcRequest.params;
            const resourceResult = await this.resourceHandlers.readResource(uri, auth);
            return {
              jsonrpc: '2.0',
              id: rpcRequest.id,
              result: resourceResult
            };

          default:
            return {
              jsonrpc: '2.0',
              id: rpcRequest.id,
              error: {
                code: -32601,
                message: `Method ${rpcRequest.method} not found`
              }
            };
        }
      } catch (error) {
        return {
          jsonrpc: '2.0',
          id: (request.body as any)?.id,
          error: {
            code: -32603,
            message: error instanceof Error ? error.message : 'Internal error'
          }
        };
      }
    });

    // SSE endpoint for real-time updates
    this.fastify.get('/mcp/events', async (request, reply) => {
      const auth = request.auth;
      if (!auth) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
      }

      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': request.headers.origin || '*'
      });

      // Send initial connection event
      reply.raw.write('event: connected\\ndata: {"status": "connected"}\\n\\n');

      // Set up event listeners for real-time updates
      const handleTodoUpdate = (data: any) => {
        if (data.sessionId === auth.sessionId) {
          reply.raw.write(`event: todos\\ndata: ${JSON.stringify(data.todos)}\\n\\n`);
        }
      };

      const handleCommsMessage = (data: any) => {
        if (data.sessionId === auth.sessionId) {
          reply.raw.write(`event: comms\\ndata: ${JSON.stringify(data.message)}\\n\\n`);
        }
      };

      const handleFenceChange = (data: any) => {
        if (data.sessionId === auth.sessionId) {
          reply.raw.write(`event: fence\\ndata: ${JSON.stringify({ owner: data.owner })}\\n\\n`);
        }
      };

      this.stateManager.on('todos:updated', handleTodoUpdate);
      this.stateManager.on('comms:message', handleCommsMessage);
      this.stateManager.on('fence:changed', handleFenceChange);

      // Clean up on disconnect
      request.raw.on('close', () => {
        this.stateManager.off('todos:updated', handleTodoUpdate);
        this.stateManager.off('comms:message', handleCommsMessage);
        this.stateManager.off('fence:changed', handleFenceChange);
      });
    });
  }

  async start() {
    try {
      await this.fastify.listen({ port: this.port, host: '0.0.0.0' });
      console.log(`Apogee MCP Server started on http://0.0.0.0:${this.port}`);
      console.log(`MCP endpoint: http://localhost:${this.port}/mcp`);
      console.log(`SSE events: http://localhost:${this.port}/mcp/events`);
    } catch (err) {
      this.fastify.log.error(err);
      process.exit(1);
    }
  }
}

// Extend Fastify request type
declare module 'fastify' {
  interface FastifyRequest {
    auth?: any;
  }
}
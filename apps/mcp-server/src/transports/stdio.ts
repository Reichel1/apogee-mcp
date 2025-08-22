import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListResourcesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { StateManager } from '../core/state.js';
import { PolicyEnforcer } from '../auth/policy.js';
import { APOGEE_TOOLS, APOGEE_RESOURCES } from '../core/spec.js';
import { ToolHandlers } from '../features/tools/index.js';
import { ResourceHandlers } from '../features/resources/index.js';

export class StdioTransport {
  private server: Server;
  private stateManager: StateManager;
  private policy: PolicyEnforcer;
  private toolHandlers: ToolHandlers;
  private resourceHandlers: ResourceHandlers;
  private sessionId: string;

  constructor() {
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
    this.sessionId = this.stateManager.createSession();
    
    this.toolHandlers = new ToolHandlers(this.stateManager, this.policy);
    this.resourceHandlers = new ResourceHandlers(this.stateManager);

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: APOGEE_TOOLS.map(tool => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }))
      };
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return { resources: APOGEE_RESOURCES };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const auth = this.policy.createStdioAuth();
      auth.sessionId = this.sessionId;

      const { name, arguments: args } = request.params;

      if (!this.policy.canExecuteTool(auth, name)) {
        throw new Error(`Tool ${name} not authorized for role ${auth.role}`);
      }

      return await this.toolHandlers.executeTool(name, args, auth);
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const auth = this.policy.createStdioAuth();
      auth.sessionId = this.sessionId;
      
      const { uri } = request.params;
      return await this.resourceHandlers.readResource(uri, auth);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('Apogee MCP Server started (stdio mode)');
    console.error(`Session ID: ${this.sessionId}`);
  }
}
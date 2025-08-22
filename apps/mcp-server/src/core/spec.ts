import { z } from 'zod';

// Agent roles for authorization
export type AgentRole = 'planner' | 'implementer';

// Session state
export interface SessionState {
  id: string;
  todos: TodoItem[];
  writeFence: AgentRole;
  commsLog: CommMessage[];
  dbSchema?: any;
  ciStatus?: string;
  lastUpdated: number;
}

export interface TodoItem {
  id: string;
  desc: string;
  assignee: AgentRole;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: number;
  updatedAt: number;
}

export interface CommMessage {
  id: string;
  agent: AgentRole;
  text: string;
  timestamp: number;
  tags?: string[];
}

// Tool schemas following MCP spec
export const TodoUpdateSchema = z.object({
  diff: z.array(z.object({
    id: z.string().optional(),
    desc: z.string().optional(),
    assignee: z.enum(['planner', 'implementer']).optional(),
    status: z.enum(['pending', 'in_progress', 'completed']).optional(),
    operation: z.enum(['create', 'update', 'delete'])
  }))
});

export const PatchApplySchema = z.object({
  diff: z.string().describe('Unified diff format patch'),
  rationale: z.string().optional().describe('Explanation of the changes'),
  targetBranch: z.string().optional().default('main')
});

export const DbMigrateSchema = z.object({
  planId: z.string().describe('Migration plan identifier'),
  dryRun: z.boolean().optional().default(false)
});

export const FenceSetSchema = z.object({
  owner: z.enum(['planner', 'implementer'])
});

export const CommsPostSchema = z.object({
  text: z.string(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

// MCP Tool definitions
export interface McpTool {
  name: string;
  description: string;
  inputSchema: any;
  requiredRole?: AgentRole;
}

export const APOGEE_TOOLS: McpTool[] = [
  {
    name: 'apogee.todo.update',
    description: 'Update the shared todo list with new tasks or status changes',
    inputSchema: TodoUpdateSchema,
  },
  {
    name: 'apogee.fence.set',
    description: 'Change the write fence owner (who can apply patches)',
    inputSchema: FenceSetSchema,
  },
  {
    name: 'apogee.patch.apply',
    description: 'Apply a code patch to the working repository',
    inputSchema: PatchApplySchema,
  },
  {
    name: 'apogee.db.migrate',
    description: 'Run database migrations via Supabase MCP (planner-only)',
    inputSchema: DbMigrateSchema,
    requiredRole: 'planner',
  },
  {
    name: 'apogee.comms.post',
    description: 'Post a structured message to the shared communication log',
    inputSchema: CommsPostSchema,
  }
];

// MCP Resource definitions  
export const APOGEE_RESOURCES = [
  {
    uri: 'log://comms',
    name: 'Communication Log',
    description: 'Real-time feed of agent communications and actions',
    mimeType: 'application/json'
  },
  {
    uri: 'todos://board',
    name: 'Todo Board',
    description: 'Current task assignments and status',
    mimeType: 'application/json'
  },
  {
    uri: 'schema://current',
    name: 'Database Schema',
    description: 'Live introspected database schema from Supabase',
    mimeType: 'application/json'
  },
  {
    uri: 'ci://latest',
    name: 'CI Status',
    description: 'Latest build and test results',
    mimeType: 'application/json'
  }
];
import jwt from 'jsonwebtoken';
import type { AgentRole } from '../core/spec.js';

export interface AuthContext {
  role: AgentRole;
  sessionId: string;
  clientId?: string;
  scopes?: string[];
}

export class PolicyEnforcer {
  private jwtSecret: string;

  constructor(jwtSecret = process.env.JWT_SECRET || 'dev-secret-key') {
    this.jwtSecret = jwtSecret;
  }

  // Verify JWT token and extract auth context
  verifyToken(token: string): AuthContext {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as any;
      return {
        role: payload.role as AgentRole,
        sessionId: payload.sessionId,
        clientId: payload.clientId,
        scopes: payload.scopes || []
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Check if agent can perform specific tool action
  canExecuteTool(auth: AuthContext, toolName: string): boolean {
    switch (toolName) {
      case 'apogee.db.migrate':
      case 'apogee.sql.exec':
        // Only planner (Claude) can run database operations
        return auth.role === 'planner';
      
      case 'apogee.patch.apply':
        // Both agents can request patches, but write fence is enforced at state level
        return true;

      case 'apogee.todo.update':
      case 'apogee.fence.set':
      case 'apogee.comms.post':
        // Basic tools available to both agents
        return true;

      default:
        return false;
    }
  }

  // Check write fence permissions
  canApplyPatch(auth: AuthContext, currentFenceOwner: AgentRole): boolean {
    return auth.role === currentFenceOwner;
  }

  // Generate token for local development
  generateDevToken(role: AgentRole, sessionId: string, clientId?: string): string {
    return jwt.sign(
      {
        role,
        sessionId,
        clientId,
        scopes: role === 'planner' ? ['db:migrate', 'db:exec'] : ['code:apply'],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      this.jwtSecret
    );
  }

  // Validate Origin header for HTTP transport
  validateOrigin(origin: string): boolean {
    const allowedOrigins = [
      'https://claude.ai',
      'https://cursor.sh', 
      'https://api.openai.com',
      'http://localhost',
      'http://127.0.0.1'
    ];
    
    return allowedOrigins.some(allowed => 
      origin.startsWith(allowed) || 
      origin.match(/^http:\/\/localhost:\d+$/) ||
      origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)
    );
  }

  // Create auth context from request headers
  extractAuthFromHeaders(headers: Record<string, string>): AuthContext | null {
    const authHeader = headers.authorization || headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    try {
      return this.verifyToken(token);
    } catch {
      return null;
    }
  }

  // For stdio mode - simplified auth based on environment
  createStdioAuth(role?: AgentRole): AuthContext {
    return {
      role: role || (process.env.APOGEE_ROLE as AgentRole) || 'implementer',
      sessionId: process.env.APOGEE_SESSION_ID || 'stdio-session',
      clientId: 'stdio-client'
    };
  }
}
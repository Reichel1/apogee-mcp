import { StateManager } from '../../core/state.js';
import type { AuthContext } from '../../auth/policy.js';

export class ResourceHandlers {
  constructor(private stateManager: StateManager) {}

  async readResource(uri: string, auth: AuthContext): Promise<{ contents: any[] }> {
    const [protocol, resource] = uri.split('://');

    switch (protocol) {
      case 'log':
        return this.readCommsLog(resource, auth);
      
      case 'todos':
        return this.readTodosBoard(resource, auth);
      
      case 'schema':
        return this.readDbSchema(resource, auth);
      
      case 'ci':
        return this.readCiStatus(resource, auth);
      
      default:
        throw new Error(`Unknown resource protocol: ${protocol}`);
    }
  }

  private async readCommsLog(resource: string, auth: AuthContext) {
    if (resource !== 'comms') {
      throw new Error(`Unknown log resource: ${resource}`);
    }

    const commsLog = this.stateManager.getCommsResource(auth.sessionId);
    
    return {
      contents: [{
        uri: 'log://comms',
        mimeType: 'application/json',
        text: JSON.stringify({
          messages: commsLog,
          totalMessages: commsLog.length,
          sessionId: auth.sessionId,
          lastUpdated: Date.now()
        }, null, 2)
      }]
    };
  }

  private async readTodosBoard(resource: string, auth: AuthContext) {
    if (resource !== 'board') {
      throw new Error(`Unknown todos resource: ${resource}`);
    }

    const todos = this.stateManager.getTodosResource(auth.sessionId);
    const session = this.stateManager.getSession(auth.sessionId);
    
    return {
      contents: [{
        uri: 'todos://board',
        mimeType: 'application/json',
        text: JSON.stringify({
          todos,
          writeFence: session?.writeFence || 'implementer',
          summary: {
            total: todos.length,
            pending: todos.filter(t => t.status === 'pending').length,
            inProgress: todos.filter(t => t.status === 'in_progress').length,
            completed: todos.filter(t => t.status === 'completed').length,
            plannerTasks: todos.filter(t => t.assignee === 'planner').length,
            implementerTasks: todos.filter(t => t.assignee === 'implementer').length
          },
          lastUpdated: session?.lastUpdated || Date.now()
        }, null, 2)
      }]
    };
  }

  private async readDbSchema(resource: string, auth: AuthContext) {
    if (resource !== 'current') {
      throw new Error(`Unknown schema resource: ${resource}`);
    }

    const schema = this.stateManager.getSchemaResource(auth.sessionId);
    
    return {
      contents: [{
        uri: 'schema://current',
        mimeType: 'application/json',
        text: JSON.stringify({
          schema: schema || { message: 'No schema available - run migration first' },
          sessionId: auth.sessionId,
          lastUpdated: Date.now()
        }, null, 2)
      }]
    };
  }

  private async readCiStatus(resource: string, auth: AuthContext) {
    if (resource !== 'latest') {
      throw new Error(`Unknown ci resource: ${resource}`);
    }

    const ciStatus = this.stateManager.getCiResource(auth.sessionId);
    
    return {
      contents: [{
        uri: 'ci://latest',
        mimeType: 'application/json',
        text: JSON.stringify({
          status: ciStatus.status,
          lastUpdated: ciStatus.lastUpdated,
          sessionId: auth.sessionId,
          timestamp: Date.now()
        }, null, 2)
      }]
    };
  }
}
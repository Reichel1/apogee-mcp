import { EventEmitter } from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import type { SessionState, TodoItem, CommMessage, AgentRole } from './spec.js';

export class StateManager extends EventEmitter {
  private sessions = new Map<string, SessionState>();
  private activeSession: string | null = null;

  constructor() {
    super();
  }

  createSession(id?: string): string {
    const sessionId = id || uuidv4();
    const session: SessionState = {
      id: sessionId,
      todos: [],
      writeFence: 'implementer', // Default to implementer
      commsLog: [],
      lastUpdated: Date.now()
    };
    
    this.sessions.set(sessionId, session);
    this.activeSession = sessionId;
    this.emit('session:created', session);
    return sessionId;
  }

  getSession(id?: string): SessionState | null {
    const sessionId = id || this.activeSession;
    return sessionId ? this.sessions.get(sessionId) || null : null;
  }

  updateTodos(sessionId: string, todoDiff: any[]): TodoItem[] {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    for (const change of todoDiff) {
      switch (change.operation) {
        case 'create':
          const newTodo: TodoItem = {
            id: change.id || uuidv4(),
            desc: change.desc,
            assignee: change.assignee,
            status: change.status || 'pending',
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          session.todos.push(newTodo);
          break;

        case 'update':
          const todoIndex = session.todos.findIndex(t => t.id === change.id);
          if (todoIndex >= 0) {
            const todo = session.todos[todoIndex];
            if (change.desc !== undefined) todo.desc = change.desc;
            if (change.assignee !== undefined) todo.assignee = change.assignee;
            if (change.status !== undefined) todo.status = change.status;
            todo.updatedAt = Date.now();
          }
          break;

        case 'delete':
          session.todos = session.todos.filter(t => t.id !== change.id);
          break;
      }
    }

    session.lastUpdated = Date.now();
    this.emit('todos:updated', { sessionId, todos: session.todos });
    return session.todos;
  }

  setWriteFence(sessionId: string, owner: AgentRole): void {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.writeFence = owner;
    session.lastUpdated = Date.now();
    this.emit('fence:changed', { sessionId, owner });
  }

  addCommMessage(sessionId: string, agent: AgentRole, text: string, tags?: string[]): CommMessage {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const message: CommMessage = {
      id: uuidv4(),
      agent,
      text,
      timestamp: Date.now(),
      tags
    };

    session.commsLog.push(message);
    
    // Keep only last 100 messages to prevent memory bloat
    if (session.commsLog.length > 100) {
      session.commsLog = session.commsLog.slice(-100);
    }

    session.lastUpdated = Date.now();
    this.emit('comms:message', { sessionId, message });
    return message;
  }

  updateDbSchema(sessionId: string, schema: any): void {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.dbSchema = schema;
    session.lastUpdated = Date.now();
    this.emit('schema:updated', { sessionId, schema });
  }

  updateCiStatus(sessionId: string, status: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    session.ciStatus = status;
    session.lastUpdated = Date.now();
    this.emit('ci:updated', { sessionId, status });
  }

  // Resource getters for MCP
  getTodosResource(sessionId: string) {
    const session = this.getSession(sessionId);
    return session?.todos || [];
  }

  getCommsResource(sessionId: string) {
    const session = this.getSession(sessionId);
    return session?.commsLog || [];
  }

  getSchemaResource(sessionId: string) {
    const session = this.getSession(sessionId);
    return session?.dbSchema || null;
  }

  getCiResource(sessionId: string) {
    const session = this.getSession(sessionId);
    return { status: session?.ciStatus || 'unknown', lastUpdated: session?.lastUpdated };
  }
}
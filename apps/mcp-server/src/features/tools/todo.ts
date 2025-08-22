import { StateManager } from '../../core/state.js';
import type { TodoItem } from '../../core/spec.js';

export class TodoTools {
  constructor(private stateManager: StateManager) {}

  async updateTodos(sessionId: string, diff: any[]): Promise<{ todos: TodoItem[]; updated: number }> {
    try {
      const updatedTodos = this.stateManager.updateTodos(sessionId, diff);
      
      return {
        todos: updatedTodos,
        updated: Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to update todos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
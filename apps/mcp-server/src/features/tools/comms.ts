import { StateManager } from '../../core/state.js';
import type { AuthContext } from '../../auth/policy.js';
import type { CommMessage } from '../../core/spec.js';

export class CommsTools {
  constructor(private stateManager: StateManager) {}

  async postMessage(
    auth: AuthContext,
    args: { text: string; tags?: string[]; metadata?: Record<string, any> }
  ): Promise<{ message: CommMessage; posted: boolean }> {
    try {
      const message = this.stateManager.addCommMessage(
        auth.sessionId,
        auth.role,
        args.text,
        args.tags
      );

      return {
        message,
        posted: true
      };
    } catch (error) {
      throw new Error(`Failed to post message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
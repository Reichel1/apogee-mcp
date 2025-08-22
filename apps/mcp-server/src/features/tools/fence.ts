import { StateManager } from '../../core/state.js';
import type { AgentRole } from '../../core/spec.js';

export class FenceTools {
  constructor(private stateManager: StateManager) {}

  async setFence(sessionId: string, owner: AgentRole): Promise<{ owner: AgentRole; changed: boolean; timestamp: number }> {
    const session = this.stateManager.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const previousOwner = session.writeFence;
    const changed = previousOwner !== owner;

    if (changed) {
      this.stateManager.setWriteFence(sessionId, owner);
      
      // Log the fence change to comms
      this.stateManager.addCommMessage(
        sessionId,
        owner,
        `Write fence changed from ${previousOwner} to ${owner}`,
        ['fence', 'handoff']
      );
    }

    return {
      owner,
      changed,
      timestamp: Date.now()
    };
  }
}
import { StateManager } from '../../core/state.js';
import { PolicyEnforcer, type AuthContext } from '../../auth/policy.js';
import { TodoUpdateSchema, PatchApplySchema, DbMigrateSchema, FenceSetSchema, CommsPostSchema } from '../../core/spec.js';
import { TodoTools } from './todo.js';
import { PatchTools } from './patch.js';
import { DbTools } from './db_migrate.js';
import { FenceTools } from './fence.js';
import { CommsTools } from './comms.js';

export class ToolHandlers {
  private todoTools: TodoTools;
  private patchTools: PatchTools;
  private dbTools: DbTools;
  private fenceTools: FenceTools;
  private commsTools: CommsTools;

  constructor(
    private stateManager: StateManager,
    private policy: PolicyEnforcer
  ) {
    this.todoTools = new TodoTools(stateManager);
    this.patchTools = new PatchTools(stateManager, policy);
    this.dbTools = new DbTools(stateManager, policy);
    this.fenceTools = new FenceTools(stateManager);
    this.commsTools = new CommsTools(stateManager);
  }

  async executeTool(name: string, args: any, auth: AuthContext): Promise<any> {
    switch (name) {
      case 'apogee.todo.update':
        const todoArgs = TodoUpdateSchema.parse(args);
        return await this.todoTools.updateTodos(auth.sessionId, todoArgs.diff);

      case 'apogee.fence.set':
        const fenceArgs = FenceSetSchema.parse(args);
        return await this.fenceTools.setFence(auth.sessionId, fenceArgs.owner);

      case 'apogee.patch.apply':
        const patchArgs = PatchApplySchema.parse(args);
        return await this.patchTools.applyPatch(auth, patchArgs);

      case 'apogee.db.migrate':
        const dbArgs = DbMigrateSchema.parse(args);
        return await this.dbTools.runMigration(auth, dbArgs);

      case 'apogee.comms.post':
        const commsArgs = CommsPostSchema.parse(args);
        return await this.commsTools.postMessage(auth, commsArgs);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
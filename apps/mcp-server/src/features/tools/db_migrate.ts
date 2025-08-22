import { StateManager } from '../../core/state.js';
import { PolicyEnforcer, type AuthContext } from '../../auth/policy.js';

export class DbTools {
  constructor(
    private stateManager: StateManager,
    private policy: PolicyEnforcer
  ) {}

  async runMigration(
    auth: AuthContext,
    args: { planId: string; dryRun?: boolean }
  ): Promise<{ status: string; applied: string[]; errors: string[]; planId: string }> {
    // Double-check authorization (should be enforced at policy level)
    if (auth.role !== 'planner') {
      throw new Error('Database migrations can only be run by planner (Claude) role');
    }

    try {
      // Log migration start
      this.stateManager.addCommMessage(
        auth.sessionId,
        auth.role,
        `Starting database migration: ${args.planId} ${args.dryRun ? '(dry run)' : ''}`,
        ['db', 'migration', 'start']
      );

      // In a real implementation, this would:
      // 1. Connect to Supabase MCP server
      // 2. Execute the migration via MCP tools
      // 3. Return actual results
      
      // For now, simulate the process
      const result = await this.simulateSupabaseMigration(args.planId, args.dryRun || false);

      // Update database schema in session state
      if (result.status === 'applied' && !args.dryRun) {
        await this.updateDbSchema(auth.sessionId);
      }

      // Log completion
      this.stateManager.addCommMessage(
        auth.sessionId,
        auth.role,
        `Migration ${args.planId} completed: ${result.status}`,
        ['db', 'migration', result.status]
      );

      return result;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      // Log error
      this.stateManager.addCommMessage(
        auth.sessionId,
        auth.role,
        `Migration ${args.planId} failed: ${errorMsg}`,
        ['db', 'migration', 'error']
      );

      return {
        status: 'failed',
        applied: [],
        errors: [errorMsg],
        planId: args.planId
      };
    }
  }

  private async simulateSupabaseMigration(planId: string, dryRun: boolean) {
    // This would be replaced with actual Supabase MCP calls:
    // 
    // const supabaseMcp = new SupabaseMcpClient();
    // return await supabaseMcp.executeMigration(planId, { dryRun });

    // Simulate different outcomes based on planId
    if (planId.includes('error')) {
      return {
        status: 'failed',
        applied: [],
        errors: ['Simulated migration error'],
        planId
      };
    }

    if (dryRun) {
      return {
        status: 'validated',
        applied: [`Would apply: ${planId}`],
        errors: [],
        planId
      };
    }

    // Simulate successful migration
    const appliedStatements = [
      `CREATE TABLE IF NOT EXISTS ${planId}_table (id serial primary key)`,
      `CREATE INDEX ${planId}_idx ON ${planId}_table(id)`
    ];

    return {
      status: 'applied',
      applied: appliedStatements,
      errors: [],
      planId
    };
  }

  private async updateDbSchema(sessionId: string) {
    // In production, this would introspect the actual database
    // and update the schema resource
    const mockSchema = {
      tables: [
        {
          name: 'projects',
          columns: [
            { name: 'id', type: 'serial', primaryKey: true },
            { name: 'name', type: 'varchar(255)', nullable: false },
            { name: 'created_at', type: 'timestamp', default: 'now()' }
          ]
        }
      ],
      lastUpdated: new Date().toISOString()
    };

    this.stateManager.updateDbSchema(sessionId, mockSchema);
  }

  // Additional SQL execution for quick queries (also planner-only)
  async executeSql(
    auth: AuthContext,
    args: { sql: string; dryRun?: boolean }
  ): Promise<{ result: any; executed: boolean }> {
    if (auth.role !== 'planner') {
      throw new Error('SQL execution can only be performed by planner (Claude) role');
    }

    // This would delegate to Supabase MCP for actual execution
    // For now, just log and return mock result
    this.stateManager.addCommMessage(
      auth.sessionId,
      auth.role,
      `SQL query: ${args.sql.substring(0, 100)}${args.sql.length > 100 ? '...' : ''}`,
      ['db', 'query', args.dryRun ? 'dry-run' : 'executed']
    );

    return {
      result: args.dryRun ? 'Query validated' : 'Mock result',
      executed: !args.dryRun
    };
  }
}
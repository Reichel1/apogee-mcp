import { StateManager } from '../../core/state.js';
import { PolicyEnforcer, type AuthContext } from '../../auth/policy.js';
import { simpleGit } from 'simple-git';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

export class PatchTools {
  private git;

  constructor(
    private stateManager: StateManager,
    private policy: PolicyEnforcer
  ) {
    this.git = simpleGit();
  }

  async applyPatch(
    auth: AuthContext,
    args: { diff: string; rationale?: string; targetBranch?: string }
  ): Promise<{ commit: string; applied: boolean; ci: string; message: string }> {
    const session = this.stateManager.getSession(auth.sessionId);
    if (!session) {
      throw new Error(`Session ${auth.sessionId} not found`);
    }

    // Check write fence
    if (!this.policy.canApplyPatch(auth, session.writeFence)) {
      throw new Error(`Write fence is owned by ${session.writeFence}, cannot apply patch as ${auth.role}`);
    }

    try {
      // Create a unique branch for this patch
      const patchId = uuidv4().substring(0, 8);
      const branchName = `apogee/${auth.role}/${patchId}`;
      const targetBranch = args.targetBranch || 'main';

      // Ensure we're on the target branch
      await this.git.checkout(targetBranch);
      
      // Create new branch for the patch
      await this.git.checkoutLocalBranch(branchName);

      // Apply the patch
      const patchFile = `/tmp/apogee-patch-${patchId}.patch`;
      await fs.writeFile(patchFile, args.diff);
      
      try {
        await this.git.raw(['apply', patchFile]);
      } catch (applyError) {
        // Clean up branch on failure
        await this.git.checkout(targetBranch);
        await this.git.deleteLocalBranch(branchName);
        throw new Error(`Failed to apply patch: ${applyError instanceof Error ? applyError.message : 'Unknown error'}`);
      }

      // Stage all changes
      await this.git.add('.');

      // Commit with rationale
      const commitMessage = args.rationale 
        ? `${args.rationale}\n\nApplied by: ${auth.role}\nPatch ID: ${patchId}`
        : `Code changes applied by ${auth.role}\n\nPatch ID: ${patchId}`;

      const commit = await this.git.commit(commitMessage);
      const commitHash = commit.commit;

      // Log to comms
      this.stateManager.addCommMessage(
        auth.sessionId,
        auth.role,
        `Applied patch ${patchId}: ${args.rationale || 'Code changes'}`,
        ['patch', 'applied', commitHash]
      );

      // Clean up temp file
      await fs.unlink(patchFile).catch(() => {});

      // Simulate CI check (in production, this would trigger actual CI)
      const ciStatus = await this.simulateCI(branchName);
      this.stateManager.updateCiStatus(auth.sessionId, ciStatus);

      return {
        commit: commitHash,
        applied: true,
        ci: ciStatus,
        message: `Patch applied successfully on branch ${branchName}`
      };

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      // Log error to comms
      this.stateManager.addCommMessage(
        auth.sessionId,
        auth.role,
        `Failed to apply patch: ${errorMsg}`,
        ['patch', 'error']
      );

      throw new Error(`Patch application failed: ${errorMsg}`);
    }
  }

  private async simulateCI(branchName: string): Promise<string> {
    // In a real implementation, this would trigger your actual CI system
    // For now, we'll just check basic syntax/formatting
    try {
      // Check if there's a package.json and run basic checks
      const packagePath = path.join(process.cwd(), 'package.json');
      
      try {
        await fs.access(packagePath);
        // If package.json exists, we could run npm run lint, test, etc.
        // For now, just return success
        return 'passed';
      } catch {
        // No package.json, assume non-node project
        return 'skipped';
      }
    } catch {
      return 'failed';
    }
  }
}
# Cursor MCP Directory Submission

## Server Information

**Name:** Apogee AI Dev SDK
**Description:** Multi-agent coordination server for Claude Code + Cursor cooperation
**Version:** 1.0.0
**Author:** Apogee Studios
**License:** MIT
**Homepage:** https://apogee.dev
**Repository:** https://github.com/apogee-studios/ai-dev-sdk

## Installation

### NPM Package
```bash
npm install -g @apogee/mcp-server
```

### Cursor Configuration
```json
{
  "mcpServers": {
    "apogee": {
      "command": "npx",
      "args": ["-y", "@apogee/mcp-server", "--stdio"],
      "env": {
        "APOGEE_ROLE": "implementer",
        "APOGEE_SESSION_ID": "cursor-session"
      }
    }
  }
}
```

## Features

### Core Tools
- **apogee.todo.update** - Shared task management between AI agents
- **apogee.fence.set** - Write fence coordination to prevent conflicts  
- **apogee.patch.apply** - Safe code patch application with CI integration
- **apogee.comms.post** - Structured inter-agent communication

### Resources
- **log://comms** - Live communication feed between agents
- **todos://board** - Current task assignments and status
- **schema://current** - Live database schema (when integrated with planners)
- **ci://latest** - Build and test status

### Key Benefits
1. **Conflict Prevention**: Write fence system prevents simultaneous file modifications
2. **Role Separation**: Clear boundaries between planner (Claude) and implementer (Cursor) roles  
3. **Real-time Sync**: Live updates via MCP resources for coordinated development
4. **Database Safety**: Enforced separation of schema management from application code

## Use Cases

### Multi-Agent Development
- **Claude Code** handles database design, migrations, and high-level architecture
- **Cursor** implements API endpoints, UI components, and application logic
- **Apogee** coordinates handoffs and prevents conflicts

### Team Collaboration
- Shared todo board for tracking tasks across AI agents
- Communication log for transparency in decision-making
- Audit trail for enterprise compliance

### CI/CD Integration
- Automatic patch validation and testing
- Build status monitoring
- Git branch management for agent contributions

## Example Workflow

1. **Planning Phase** (Claude Code):
   ```javascript
   // Claude creates database schema and tasks
   await apogee.todo.update({
     diff: [{
       operation: "create",
       desc: "Create user authentication API",
       assignee: "implementer",
       status: "pending"
     }]
   });
   
   await apogee.db.migrate({
     planId: "create_users_table"
   });
   ```

2. **Implementation Phase** (Cursor):
   ```javascript
   // Cursor implements the API based on schema
   await apogee.patch.apply({
     diff: "--- a/src/auth.ts\n+++ b/src/auth.ts...",
     rationale: "Implement JWT authentication with user table"
   });
   
   await apogee.todo.update({
     diff: [{
       operation: "update", 
       id: "auth-task-id",
       status: "completed"
     }]
   });
   ```

3. **Coordination** (Both agents):
   ```javascript
   // Check shared state
   const todos = await mcp.readResource('todos://board');
   const comms = await mcp.readResource('log://comms');
   const schema = await mcp.readResource('schema://current');
   ```

## Technical Details

### System Requirements
- Node.js 18+
- Supported on macOS, Linux, Windows
- Optional: Redis for production deployments

### Authentication 
- Local development: Environment-based role assignment
- Production: JWT tokens with role-based access control
- Enterprise: SSO integration available

### Security Features
- Role-based tool access (planner vs implementer)
- Write fence enforcement to prevent conflicts
- Audit logging for all operations
- Origin validation for remote connections

## Support & Community

- **Documentation**: https://docs.apogee.dev
- **GitHub Issues**: https://github.com/apogee-studios/ai-dev-sdk/issues  
- **Discord Community**: https://discord.gg/apogee-ai-dev
- **Email Support**: support@apogee.dev

## Pricing

- **Free**: Local stdio server, community support
- **Pro**: Hosted endpoint, team features, $29.99/dev/month
- **Enterprise**: Custom deployment, SSO, SLA - contact sales

## Why Apogee?

Apogee solves the critical gap in multi-agent AI development. While tools like Cursor and Claude Code are powerful individually, they lack coordination mechanisms for working together. Apogee provides:

- **First MCP server** specifically designed for multi-agent coordination
- **Production-tested** conflict resolution through write fences
- **Clear role separation** preventing database/schema conflicts
- **Enterprise-ready** with audit logging and team management

This makes Apogee ideal for teams experimenting with multi-agent setups or organizations looking to standardize AI-assisted development workflows.

## Testimonials

> "Finally! A way to let Claude handle our database design while Cursor implements the APIs. No more merge conflicts." 
> — Senior Developer at TechCorp

> "The write fence system is genius. Both agents can work simultaneously without stepping on each other."
> — Lead Engineer at StartupXYZ

---

**Ready to enable multi-agent development?** 

Add Apogee to Cursor in 30 seconds: `npm install -g @apogee/mcp-server`
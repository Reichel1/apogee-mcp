# Getting Started with Apogee AI Dev SDK

This guide will help you set up Apogee for cooperative AI development with Claude Code and Cursor-agent.

## Prerequisites

- **Node.js 20+**
- **Git** for repository management  
- **Supabase project** (for database operations)
- **Claude Code** and/or **Cursor** installed

## 1. Installation

### Global Installation (Recommended)
```bash
npm install -g @apogee/mcp-server
```

### Local Development Setup  
```bash
git clone https://github.com/apogee-studios/ai-dev-sdk
cd apogee
npm install
npm run build --workspaces
```

## 2. Client Setup

### For Cursor (GPT-5 Implementer)

Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "apogee": {
      "command": "npx",
      "args": ["-y", "@apogee/mcp-server", "--stdio"],
      "env": {
        "APOGEE_ROLE": "implementer",
        "APOGEE_SESSION_ID": "my-project-session"
      }
    }
  }
}
```

Restart Cursor to load the MCP server. You should see Apogee tools available in the tool palette.

### For Claude Code (Planner)

#### Option A: Remote MCP (Recommended)
1. Open Claude Code settings
2. Go to "MCP Servers" section  
3. Add new remote server:
   - **URL**: `https://api.apogee.dev/mcp`
   - **Name**: `apogee`
   - **Auth Token**: [Get your planner token](#authentication)

#### Option B: Local MCP Server
If running your own server:
```bash
# Start the HTTP server
npx @apogee/mcp-server --port=3001

# Add to Claude Code as remote MCP:
# URL: http://localhost:3001/mcp
```

### For Claude Messages API

Include in your API requests:
```json
{
  "model": "claude-sonnet-4-20250514",
  "messages": [{
    "role": "user", 
    "content": "Help me build a user management system with database and API"
  }],
  "mcp_servers": [{
    "type": "url",
    "url": "https://api.apogee.dev/mcp",
    "name": "apogee",
    "authorization_token": "Bearer YOUR_PLANNER_JWT"
  }]
}
```

Don't forget the beta header:
```
anthropic-beta: mcp-client-2025-04-04
```

## 3. Authentication

### Development Tokens

For local development, generate test tokens:

```bash
# Install JWT CLI tool
npm install -g jsonwebtoken-cli

# Generate planner token (24h expiry)
jwt sign '{"role":"planner","sessionId":"dev-session","clientId":"claude"}' dev-secret-key

# Generate implementer token  
jwt sign '{"role":"implementer","sessionId":"dev-session","clientId":"cursor"}' dev-secret-key
```

### Production Tokens

Contact your Apogee administrator or use the auth API:

```bash
curl -X POST https://api.apogee.dev/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "role": "planner", 
    "sessionId": "prod-session-123",
    "expiresIn": "24h"
  }'
```

## 4. First Cooperative Session

Let's build a simple user management system together.

### Step 1: Initialize Session (Claude)

In Claude Code, reference the todo board:
```
@apogee:todos://board

I need to build a user management system. Let me start by planning the database schema and breaking down the tasks.
```

Claude should use `apogee.todo.update` to create initial todos.

### Step 2: Database Design (Claude)

```
I'll design the user table schema and run the migration:

CREATE TABLE users (
  id serial primary key,
  email varchar(255) unique not null,
  name varchar(255) not null,
  created_at timestamp default now()
);
```

Claude should use `apogee.db.migrate` to apply this schema.

### Step 3: Handoff to Implementer (Claude)  

```
Database is ready. 

HANDOFF::implementer

The implementer can now build the API endpoints and tests.
```

### Step 4: API Implementation (Cursor)

In Cursor, check the updated state:
```
@apogee:schema://current shows the user table is ready
@apogee:todos://board shows my assigned tasks

Let me implement the user CRUD API endpoints.
```

Cursor should implement the API and use `apogee.patch.apply` to commit changes.

### Step 5: Monitor Progress

Both agents can track progress via:
- `@apogee:log://comms` - See all communications
- `@apogee:todos://board` - Track task completion
- `@apogee:ci://latest` - Check build status

## 5. Development Workflow

### Typical Session Flow
1. **Planning** (Claude): Create todos, design database schema
2. **Migration** (Claude): Apply database changes via `apogee.db.migrate`  
3. **Handoff**: `HANDOFF::implementer`
4. **Implementation** (Cursor): Build features, apply patches
5. **Testing** (Cursor): Run tests, fix issues
6. **Review** (Claude): Check implementation, suggest improvements
7. **Deploy**: Both agents coordinate final deployment

### Best Practices
- **Clear todo descriptions**: Be specific about requirements
- **Atomic patches**: Keep changes focused and testable
- **Meaningful rationale**: Always explain patch changes
- **Regular handoffs**: Don't hold the fence too long
- **Resource monitoring**: Check `@apogee:*` resources frequently

## 6. Troubleshooting

### Common Issues

#### "Tool not authorized for role"
```
Error: Tool apogee.db.migrate not authorized for role implementer
```
**Solution**: Only Claude (planner) can run database migrations. Switch roles or request Claude to do it.

#### "Write fence owned by different agent"
```
Error: Write fence is owned by planner, cannot apply patch as implementer  
```
**Solution**: Ask the other agent to change the fence with `apogee.fence.set`.

#### "Session not found"
```
Error: Session dev-session not found
```
**Solution**: Ensure both agents use the same `sessionId` in tokens/environment.

### Debug Mode

Enable verbose logging:
```bash
# Local server
DEBUG=apogee:* npx @apogee/mcp-server --stdio

# Check logs
tail -f ~/.apogee/logs/debug.log
```

### Health Checks

Test your setup:
```bash
# Check server health
curl http://localhost:3001/health

# Test tool execution
curl -X POST http://localhost:3001/mcp \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1, 
    "method": "tools/list"
  }'
```

## 7. Next Steps

- **Read the [Architecture Guide](ARCHITECTURE.md)** to understand the system design
- **Explore the [API Reference](API_REFERENCE.md)** for detailed tool documentation
- **Review [Security Policy](../SECURITY.md)** for production deployments
- **Check out [Examples](../examples/)** for advanced usage patterns

## Need Help?

- **Documentation**: https://docs.apogee.dev
- **Community**: https://discord.gg/apogee-ai-dev
- **Issues**: https://github.com/apogee-studios/ai-dev-sdk/issues
- **Email**: support@apogee.dev

---

**Ready to start cooperative AI development?** Your agents are now connected and ready to collaborate!
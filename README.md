# Apogee AI Dev SDK

**Official MCP Server for Simultaneous Claude Code + GPT-5 Development**

Apogee enables cooperative AI development with clear role separation, write-fence coordination, and real-time synchronization between Claude (planner + database owner) and GPT-5 (implementer).

## 🚀 Quick Start

### Installation

```bash
npm install -g @apogee/mcp-server
```

### For Cursor (GPT-5 Implementer)

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "apogee": {
      "command": "npx",
      "args": ["-y", "@apogee/mcp-server", "--stdio"],
      "env": {
        "APOGEE_ROLE": "implementer"
      }
    }
  }
}
```

### For Claude Code (Planner)

Add Apogee as a remote MCP server:
- URL: `https://api.apogee.dev/mcp`
- Auth: Bearer token with `role:planner` scope

### For Claude Messages API

```json
{
  "model": "claude-sonnet-4-20250514",
  "messages": [...],
  "mcp_servers": [{
    "type": "url",
    "url": "https://api.apogee.dev/mcp",
    "name": "apogee",
    "authorization_token": "Bearer YOUR_PLANNER_JWT"
  }]
}
```

## 🏗️ Architecture

### Role Separation

**Claude Code (Planner + DB Owner)**
- ✅ Database schema design
- ✅ Supabase SQL migrations  
- ✅ Data access policies
- ✅ High-level planning
- ❌ Application code implementation

**Cursor-agent (GPT-5 Implementer)**  
- ✅ API routes & services
- ✅ UI components
- ✅ Tests & scripts
- ✅ Code refactoring
- ❌ Database migrations

### Write Fence System

Only one agent can apply file patches at a time:
- Fence starts with `implementer`
- Switch via `apogee.fence.set({ owner: "planner" | "implementer" })`
- Prevents file conflicts during simultaneous development

## 🛠️ Available Tools

### Todo Management
```json
apogee.todo.update({
  "diff": [{
    "operation": "create",
    "desc": "Implement user authentication API",
    "assignee": "implementer", 
    "status": "pending"
  }]
})
```

### Write Fence Control
```json
apogee.fence.set({
  "owner": "planner"  // or "implementer"
})
```

### Patch Application
```json
apogee.patch.apply({
  "diff": "--- a/src/api.ts\n+++ b/src/api.ts\n...",
  "rationale": "Add user endpoint with validation"
})
```

### Database Migration (Claude-only)
```json
apogee.db.migrate({
  "planId": "create_users_table",
  "dryRun": false
})
```

### Communication
```json
apogee.comms.post({
  "text": "Migration completed, implementer can now build the API",
  "tags": ["handoff", "db-ready"]
})
```

## 📊 Resources

Access live state via MCP resources:

- `log://comms` - Real-time communication feed
- `todos://board` - Current task assignments
- `schema://current` - Live database schema
- `ci://latest` - Build & test status

## 🔧 Local Development

```bash
# Clone and install
git clone https://github.com/apogee-studios/ai-dev-sdk
cd apogee
npm install

# Start in stdio mode (for Cursor)
npm run dev --workspace=apps/mcp-server -- --stdio

# Start HTTP server (for remote MCP)
npm run dev --workspace=apps/mcp-server -- --port=3001

# Generate JWT tokens for testing
node -e "
const jwt = require('jsonwebtoken');
console.log('Planner:', jwt.sign({role:'planner', sessionId:'test'}, 'dev-secret'));
console.log('Implementer:', jwt.sign({role:'implementer', sessionId:'test'}, 'dev-secret'));
"
```

## 🚢 Deployment

### Docker
```bash
docker build -f infra/docker/Dockerfile -t apogee/mcp-server .
docker run -p 3001:3001 -e JWT_SECRET=your-secret apogee/mcp-server
```

### Kubernetes
```bash
kubectl apply -f infra/k8s/
```

### Environment Variables
- `JWT_SECRET` - JWT signing secret
- `REDIS_URL` - Redis connection (optional, uses in-memory)
- `NODE_ENV` - production/development

## 🔒 Security

### Authentication
- **HTTP Mode**: JWT Bearer tokens with role-based scopes
- **Stdio Mode**: Environment-based role assignment
- **Origin Validation**: Restricts to allowed domains

### Authorization Matrix
| Tool | Planner (Claude) | Implementer (GPT-5) |
|------|------------------|---------------------|
| `apogee.todo.*` | ✅ | ✅ |
| `apogee.fence.*` | ✅ | ✅ |
| `apogee.patch.apply` | ✅ (when fence owner) | ✅ (when fence owner) |
| `apogee.db.migrate` | ✅ | ❌ |
| `apogee.comms.*` | ✅ | ✅ |

## 📖 Protocol Contract

Both agents must follow this output format:

```
Short natural response explaining the action.

HANDOFF::planner  (or HANDOFF::implementer)
DONE  (if task complete)
TODOS_JSON [{"id":"...", "desc":"...", "assignee":"...", "status":"..."}]
FILE_PATCH (unified diff when applying changes)
OBSERVE: Brief note about the other agent's last action
```

## 🔗 Integration Examples

### Claude Code System Prompt
```
You are CLAUDE (Planner & Database Owner). You always own:
- Database schema, Supabase SQL migrations/seeds/policies
- High-level planning and code review

Use apogee.db.migrate for all database changes.
Use HANDOFF::implementer when ready for code implementation.
```

### Cursor Agent System Prompt  
```
You are GPT (Implementer). You always own:
- Application code (API routes, UI, services, business logic)
- Tests, scripts, and refactors

Never run database migrations - request them from the planner.
Use HANDOFF::planner when database changes are needed.
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Ready to enable cooperative AI development?** 

Get started: `npm install -g @apogee/mcp-server`
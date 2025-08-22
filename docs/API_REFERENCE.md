# Apogee MCP Server API Reference

## Tools

### apogee.todo.update

Update the shared todo list with new tasks or status changes.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "diff": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "string", "description": "Todo ID (auto-generated if not provided)"},
          "desc": {"type": "string", "description": "Task description"},
          "assignee": {"type": "string", "enum": ["planner", "implementer"]},
          "status": {"type": "string", "enum": ["pending", "in_progress", "completed"]},
          "operation": {"type": "string", "enum": ["create", "update", "delete"]}
        },
        "required": ["operation"]
      }
    }
  },
  "required": ["diff"]
}
```

**Response:**
```json
{
  "todos": [...],
  "updated": 1640995200
}
```

**Example:**
```json
{
  "diff": [
    {
      "operation": "create",
      "desc": "Implement user authentication API",
      "assignee": "implementer",
      "status": "pending"
    },
    {
      "operation": "update", 
      "id": "existing-todo-id",
      "status": "completed"
    }
  ]
}
```

### apogee.fence.set

Change the write fence owner to control who can apply patches.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "owner": {"type": "string", "enum": ["planner", "implementer"]}
  },
  "required": ["owner"]
}
```

**Response:**
```json
{
  "owner": "planner",
  "changed": true,
  "timestamp": 1640995200
}
```

### apogee.patch.apply

Apply a code patch to the working repository.

**Authorization:** Must be current write fence owner.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "diff": {"type": "string", "description": "Unified diff format patch"},
    "rationale": {"type": "string", "description": "Explanation of the changes"},
    "targetBranch": {"type": "string", "default": "main"}
  },
  "required": ["diff"]
}
```

**Response:**
```json
{
  "commit": "abc123def456",
  "applied": true,
  "ci": "passed|failed|skipped",
  "message": "Patch applied successfully on branch apogee/implementer/patch123"
}
```

### apogee.db.migrate

Run database migrations via Supabase MCP.

**Authorization:** Planner role only.

**Input Schema:**
```json
{
  "type": "object", 
  "properties": {
    "planId": {"type": "string", "description": "Migration plan identifier"},
    "dryRun": {"type": "boolean", "default": false}
  },
  "required": ["planId"]
}
```

**Response:**
```json
{
  "status": "applied|failed|validated",
  "applied": ["CREATE TABLE users (id serial primary key)", "..."],
  "errors": [],
  "planId": "create_users_table"
}
```

### apogee.comms.post

Post a structured message to the shared communication log.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {"type": "string"},
    "tags": {"type": "array", "items": {"type": "string"}},
    "metadata": {"type": "object"}
  },
  "required": ["text"]
}
```

**Response:**
```json
{
  "message": {
    "id": "msg-123",
    "agent": "planner",
    "text": "Database migration completed",
    "timestamp": 1640995200,
    "tags": ["db", "migration", "completed"]
  },
  "posted": true
}
```

## Resources

### log://comms

Real-time communication feed between agents.

**Response:**
```json
{
  "messages": [
    {
      "id": "msg-123",
      "agent": "planner",
      "text": "Starting user table migration",
      "timestamp": 1640995200,
      "tags": ["db", "migration"]
    }
  ],
  "totalMessages": 15,
  "sessionId": "session-abc-123",
  "lastUpdated": 1640995200
}
```

### todos://board

Current task assignments and status.

**Response:**
```json
{
  "todos": [
    {
      "id": "todo-123",
      "desc": "Create user authentication API",
      "assignee": "implementer", 
      "status": "in_progress",
      "createdAt": 1640995000,
      "updatedAt": 1640995100
    }
  ],
  "writeFence": "implementer",
  "summary": {
    "total": 5,
    "pending": 2,
    "inProgress": 1,
    "completed": 2,
    "plannerTasks": 2,
    "implementerTasks": 3
  },
  "lastUpdated": 1640995200
}
```

### schema://current

Live database schema from Supabase introspection.

**Response:**
```json
{
  "schema": {
    "tables": [
      {
        "name": "users",
        "columns": [
          {
            "name": "id", 
            "type": "serial",
            "primaryKey": true
          },
          {
            "name": "email",
            "type": "varchar(255)",
            "nullable": false
          }
        ]
      }
    ],
    "lastUpdated": "2024-01-01T12:00:00Z"
  },
  "sessionId": "session-abc-123"
}
```

### ci://latest  

Latest build and test results.

**Response:**
```json
{
  "status": "passed|failed|unknown",
  "lastUpdated": 1640995200,
  "sessionId": "session-abc-123",
  "timestamp": 1640995300
}
```

## Error Responses

All tools may return errors in JSON-RPC format:

```json
{
  "jsonrpc": "2.0", 
  "id": "request-id",
  "error": {
    "code": -32603,
    "message": "Tool apogee.db.migrate not authorized for role implementer"
  }
}
```

### Common Error Codes
- `-32601`: Method not found
- `-32602`: Invalid parameters  
- `-32603`: Internal error
- `-32000`: Authorization error

## Authentication

### HTTP Transport
Include JWT token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stdio Transport
Set environment variables:
```bash
export APOGEE_ROLE=implementer
export APOGEE_SESSION_ID=my-session
```

## Rate Limits

- **Tool calls**: 60/minute per session
- **Resource reads**: 120/minute per session
- **SSE connections**: 5 concurrent per token

## Versioning

Current API version: `1.0.0`

MCP Protocol version: `2024-11-05`

Include version in requests:
```json
{
  "jsonrpc": "2.0",
  "method": "initialize", 
  "params": {
    "protocolVersion": "2024-11-05",
    "clientInfo": {
      "name": "cursor",
      "version": "0.1.0"
    }
  }
}
```
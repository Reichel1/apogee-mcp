# Security Policy

## Threat Model

### Assets
- **Source code repositories** and development environments
- **Database schemas and data** via Supabase integration
- **Authentication tokens** and session data
- **Inter-agent communications** and coordination state

### Threat Actors
- **Malicious MCP clients** attempting unauthorized operations
- **Compromised JWT tokens** with elevated privileges
- **Network attackers** intercepting or modifying requests
- **Insider threats** with legitimate but excessive access

### Attack Vectors
- **Authorization bypass** for database-only operations
- **Cross-site request forgery** via CORS misconfigurations  
- **Session hijacking** through token theft
- **Write fence manipulation** to cause conflicts
- **Resource exhaustion** via excessive tool calls

## Security Controls

### Authentication & Authorization

#### JWT Token Security
- **HS256 signing** with rotating secrets
- **Role-based scopes**: `role:planner`, `role:implementer`  
- **Session binding** via `sessionId` claim
- **Expiration enforcement**: 24-hour max TTL
- **Revocation support** via blacklist (production)

#### Permission Enforcement
```typescript
// Critical: Database operations restricted to planner role
if (toolName === 'apogee.db.migrate' && auth.role !== 'planner') {
  throw new Error('Database migrations restricted to planner role');
}

// Write fence validation before patch application
if (!this.policy.canApplyPatch(auth, session.writeFence)) {
  throw new Error('Write fence owned by different agent');
}
```

### Network Security

#### CORS Configuration
- **Origin whitelist**: `claude.ai`, `cursor.sh`, `localhost`
- **Credential support** for authenticated requests
- **Method restrictions**: GET, POST, OPTIONS only
- **Header validation**: Authorization, Content-Type, MCP-Protocol-Version

#### Transport Security
- **TLS 1.3** minimum for HTTPS endpoints
- **HSTS headers** to prevent downgrade attacks
- **Certificate pinning** for production deployments

### Input Validation

#### Tool Parameter Validation
```typescript
// Zod schema validation for all tool inputs
const DbMigrateSchema = z.object({
  planId: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
  dryRun: z.boolean().optional().default(false)
});
```

#### Resource Path Sanitization
```typescript
// Prevent path traversal in resource URIs  
const [protocol, resource] = uri.split('://');
if (!['log', 'todos', 'schema', 'ci'].includes(protocol)) {
  throw new Error('Invalid resource protocol');
}
```

### State Protection

#### Write Fence Integrity
- **Atomic fence updates** to prevent race conditions
- **Audit logging** for all fence changes
- **Timeout enforcement** to prevent deadlocks

#### Session Isolation
- **Per-session state** prevents cross-contamination
- **Resource access controls** based on session ownership
- **Memory limits** to prevent DoS via state bloat

### Audit & Monitoring

#### Security Events
- All authentication failures
- Authorization violations (role mismatches)
- Unusual tool call patterns
- Write fence violations
- Resource access anomalies

#### Log Format
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "SECURITY",
  "event": "auth_failure", 
  "sessionId": "sess-123",
  "clientId": "cursor-client",
  "attemptedRole": "planner",
  "actualRole": "implementer",
  "toolName": "apogee.db.migrate",
  "ip": "192.168.1.100"
}
```

## Production Hardening

### Environment Configuration
```bash
# Strong JWT secret (32+ chars, cryptographically random)
JWT_SECRET=<crypto-random-256-bit-key>

# Redis with AUTH and TLS
REDIS_URL=rediss://user:pass@redis.example.com:6380

# Supabase with service role key (not anon key)
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-key>
```

### Infrastructure Security
- **Container security scanning** in CI/CD pipeline
- **Network policies** restricting egress to necessary services
- **Secret management** via Kubernetes secrets or Vault
- **Regular security updates** for base images and dependencies

### Rate Limiting
```typescript
// Per-session limits to prevent abuse
const limits = {
  toolCalls: { requests: 60, window: '1m' },
  resourceReads: { requests: 120, window: '1m' }, 
  sseConnections: { concurrent: 5 }
};
```

## Incident Response

### Security Incident Classifications
1. **P0 Critical**: Authentication bypass, data breach, RCE
2. **P1 High**: Authorization escalation, persistent XSS  
3. **P2 Medium**: CSRF, information disclosure
4. **P3 Low**: Rate limit bypass, minor info leak

### Response Procedures
1. **Immediate containment**: Revoke compromised tokens, block malicious IPs
2. **Impact assessment**: Identify affected sessions and data
3. **Forensic analysis**: Examine logs, identify attack vector
4. **Recovery**: Deploy patches, restore service if needed
5. **Post-incident review**: Update security controls, conduct training

## Vulnerability Reporting

### Responsible Disclosure
Email security issues to: `security@apogee.dev`

**Please include:**
- Detailed vulnerability description
- Steps to reproduce
- Potential impact assessment
- Suggested remediation (if any)

### Response Timeline  
- **24 hours**: Initial acknowledgment
- **7 days**: Detailed assessment and triage
- **30 days**: Fix deployment (for verified issues)
- **Public disclosure**: 90 days after fix deployment

### Bug Bounty Scope (Future)
- Authentication bypass
- Authorization escalation  
- Code injection vulnerabilities
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Server-side request forgery (SSRF)

**Out of scope:**
- Social engineering
- Physical attacks
- DoS/DDoS attacks
- Issues in third-party dependencies

---

**Questions about security?** Contact `security@apogee.dev`
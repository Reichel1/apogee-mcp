import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Code, Bot, Zap, ExternalLink } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { CodeBlock } from '../../components/CodeBlock';
import toast from 'react-hot-toast';
export default function QuickStart() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };
  const cursorConfig = `{
  "mcpServers": {
    "apogee": {
      "command": "npx",
      "args": ["-y", "@apogee/mcp-server", "--stdio"],
      "env": {
        "APOGEE_ROLE": "implementer",
        "APOGEE_SESSION_ID": "my-project"
      }
    }
  }
}`;
  const claudeConfig = `{
  "model": "claude-sonnet-4-20250514",
  "messages": [
    {
      "role": "user", 
      "content": "Use Apogee tools to coordinate with implementer agents"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.apogeestudios.dev/mcp",
      "name": "apogee",
      "authorization_token": "Bearer YOUR_PLANNER_TOKEN"
    }
  ]
}`;
  const openaiConfig = `import { MCPConnector } from '@openai/agents-sdk';
const apogeeConnector = new MCPConnector({
  url: 'https://mcp.apogeestudios.dev/mcp',
  auth: {
    type: 'bearer',
    token: 'YOUR_IMPLEMENTER_TOKEN'
  }
});
const agent = new Agent({
  model: 'gpt-4o',
  tools: [apogeeConnector],
  instructions: \`You are an implementer in the Apogee system.
  Use apogee.* tools to coordinate with Claude planner.
  Never run database migrations - that's Claude's job.\`
});`;
  const npmInstall = `npm install -g @apogee/mcp-server`;
  const examples = [
    {
      title: 'Create Shared TODOs',
      code: `await apogee.todo.update({
  diff: [{
    operation: "create",
    desc: "Implement user authentication API",
    assignee: "implementer",
    status: "pending"
  }]
});`
    },
    {
      title: 'Apply Code Patches',
      code: `await apogee.patch.apply({
  diff: \`--- a/src/auth.ts
+++ b/src/auth.ts
@@ -1,3 +1,8 @@
+export function validateToken(token: string) {
+  return jwt.verify(token, process.env.JWT_SECRET);
+}
+\`,
  rationale: "Add JWT token validation function"
});`
    },
    {
      title: 'Database Migration (Claude Only)',
      code: `await apogee.db.migrate({
  planId: "create_users_table",
  dryRun: false
});
// Result: Creates table with RLS policies`
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Quick Start Guide</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get Apogee MCP running with Cursor, Claude Code, and OpenAI Agents in minutes
            </p>
          </div>
          {/* Installation */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 bg-slate-900/50 border border-slate-700 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Code className="h-6 w-6 text-purple-400" />
              Installation
            </h2>
            <p className="text-slate-300 mb-4">
              Install the Apogee MCP server globally via npm:
            </p>
            <div className="relative bg-slate-950 p-4 rounded-lg">
              <CodeBlock language="bash" className="bg-transparent p-0">
                {npmInstall}
              </CodeBlock>
              <button
                onClick={() => copyToClipboard(npmInstall, 'npm')}
                className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
              >
                {copiedCode === 'npm' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </motion.section>
          {/* Platform Setup */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Platform Setup</h2>
            
            <Tabs.Root defaultValue="cursor" className="w-full">
              <Tabs.List className="grid grid-cols-3 gap-2 bg-slate-900/50 border border-slate-700 rounded-lg p-2 mb-8">
                <Tabs.Trigger 
                  value="cursor"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  Cursor
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="claude"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  Claude Code
                </Tabs.Trigger>
                <Tabs.Trigger 
                  value="openai"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  OpenAI Agents
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="cursor">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Cursor Setup (Implementer Role)</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">1. Create MCP configuration</h4>
                      <p className="text-slate-400 text-sm mb-3">
                        Add this to your <code className="bg-slate-800 px-2 py-1 rounded text-purple-300">.cursor/mcp.json</code> file:
                      </p>
                      <div className="relative">
                        <CodeBlock 
                          language="json" 
                          
                          
                        >
                          {cursorConfig}
                        </CodeBlock>
                        <button
                          onClick={() => copyToClipboard(cursorConfig, 'cursor')}
                          className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
                        >
                          {copiedCode === 'cursor' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">2. Restart Cursor</h4>
                      <p className="text-slate-400 text-sm">
                        Restart Cursor to load the MCP server. You should see Apogee tools in the available tools list.
                      </p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-300 mb-2">Role: Implementer</h4>
                      <p className="text-blue-200 text-sm">
                        Cursor acts as the implementer - building app code, APIs, tests, and UI components based on Claude's planning and database design.
                      </p>
                    </div>
                  </div>
                </div>
              </Tabs.Content>
              <Tabs.Content value="claude">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Claude Code Setup (Planner Role)</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">1. Remote MCP Server (Recommended)</h4>
                      <p className="text-slate-400 text-sm mb-3">
                        Connect Claude Code to the hosted Apogee MCP endpoint:
                      </p>
                      <ul className="text-slate-400 text-sm space-y-1 mb-4">
                        <li>• Open Claude Code settings</li>
                        <li>• Go to "MCP Servers" section</li>
                        <li>• Add URL: <code className="bg-slate-800 px-2 py-1 rounded text-purple-300">https://mcp.apogeestudios.dev/mcp</code></li>
                        <li>• Set role scope: <code className="bg-slate-800 px-2 py-1 rounded text-purple-300">planner</code></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">2. Messages API Integration</h4>
                      <p className="text-slate-400 text-sm mb-3">
                        For API usage, include the MCP server configuration:
                      </p>
                      <div className="relative">
                        <CodeBlock 
                          language="json" 
                          
                          
                        >
                          {claudeConfig}
                        </CodeBlock>
                        <button
                          onClick={() => copyToClipboard(claudeConfig, 'claude')}
                          className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
                        >
                          {copiedCode === 'claude' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-300 mb-2">Role: Planner</h4>
                      <p className="text-blue-200 text-sm">
                        Claude handles high-level architecture, database design, Supabase migrations, and coordination with implementer agents.
                      </p>
                    </div>
                    <div className="flex items-start gap-2 text-amber-400 text-sm bg-amber-900/20 border border-amber-700/50 p-3 rounded-lg">
                      <span>⚠️</span>
                      <p>Requires beta header: <code className="bg-slate-800 px-1 rounded">anthropic-beta: mcp-client-2025-04-04</code></p>
                    </div>
                  </div>
                </div>
              </Tabs.Content>
              <Tabs.Content value="openai">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">OpenAI Agents Setup</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">1. MCP Connector Setup</h4>
                      <p className="text-slate-400 text-sm mb-3">
                        Use OpenAI's remote MCP connector to connect to Apogee:
                      </p>
                      <div className="relative">
                        <CodeBlock 
                          language="typescript" 
                          
                          
                        >
                          {openaiConfig}
                        </CodeBlock>
                        <button
                          onClick={() => copyToClipboard(openaiConfig, 'openai')}
                          className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
                        >
                          {copiedCode === 'openai' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-300 mb-2">2. Agent Configuration</h4>
                      <p className="text-slate-400 text-sm">
                        Configure your agent with implementer role instructions and Apogee tool access.
                      </p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-300 mb-2">Role: Configurable</h4>
                      <p className="text-blue-200 text-sm">
                        OpenAI Agents can be configured as either planner or implementer based on your use case and token permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </motion.section>
          {/* Example Usage */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Example Usage</h2>
            <div className="grid md:grid-cols-1 gap-6">
              {examples.map((example, idx) => (
                <div key={example.title} className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{example.title}</h3>
                  <div className="relative">
                    <CodeBlock 
                      language="typescript" 
                      
                      
                    >
                      {example.code}
                    </CodeBlock>
                    <button
                      onClick={() => copyToClipboard(example.code, `example-${idx}`)}
                      className="absolute top-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors"
                    >
                      {copiedCode === `example-${idx}` ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
          {/* Next Steps */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Start?</h2>
            <p className="text-slate-300 mb-6">
              Check out our comprehensive documentation and start building with multi-agent AI coordination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/docs/api-reference"
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors inline-flex items-center gap-2"
              >
                API Reference
                <ExternalLink className="h-4 w-4" />
              </a>
              <a 
                href="/docs/examples"
                className="border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 px-6 py-3 rounded-lg text-white font-semibold transition-colors inline-flex items-center gap-2"
              >
                View Examples
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
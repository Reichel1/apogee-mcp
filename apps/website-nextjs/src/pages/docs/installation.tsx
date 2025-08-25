import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Terminal, Code, Database, AlertCircle, ExternalLink, Github } from 'lucide-react';
import { CodeBlock } from '../../components/CodeBlock';
import toast from 'react-hot-toast';

export default function Installation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      toast.success('Copied!', {
        style: {
          background: '#000',
          color: '#fff',
        },
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const installCommand = `npm install -g @apogee/mcp-server`;
  const verifyCommand = `apogee-mcp --version`;
  const testCommand = `apogee-mcp --stdio`;

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

  const localDevConfig = `{
  "mcpServers": {
    "apogee": {
      "command": "node",
      "args": ["./node_modules/@apogee/mcp-server/dist/index.js", "--stdio"],
      "env": {
        "APOGEE_ROLE": "implementer",
        "APOGEE_SESSION_ID": "dev-session",
        "NODE_ENV": "development"
      }
    }
  }
}`;

  const packageJsonScript = `{
  "scripts": {
    "mcp:dev": "apogee-mcp --stdio --dev",
    "mcp:test": "apogee-mcp --stdio --test"
  }
}`;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">Installation Guide</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Install and configure Apogee MCP for terminal-based multi-agent development
            </p>
          </div>

          {/* Prerequisites */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 card"
          >
            <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
              <Terminal className="h-6 w-6" />
              Prerequisites
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Node.js 18+</h3>
                  <p className="text-gray-600 text-sm">Required for running the MCP server</p>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">node --version</code>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">npm or yarn</h3>
                  <p className="text-gray-600 text-sm">Package manager for installation</p>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">npm --version</code>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Code className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Cursor or Claude Code</h3>
                  <p className="text-gray-600 text-sm">AI development tools for multi-agent coordination</p>
                  <div className="flex gap-2 mt-1">
                    <a href="https://cursor.sh" className="text-xs text-blue-600 hover:underline">Download Cursor</a>
                    <span className="text-xs text-gray-400">•</span>
                    <a href="https://claude.ai/code" className="text-xs text-blue-600 hover:underline">Get Claude Code</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Installation Steps */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-black mb-8 text-center">Installation Steps</h2>
            
            <div className="space-y-8">
              {/* Step 1: Install */}
              <div className="card border-l-4 border-l-black">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <h3 className="text-xl font-semibold text-black">Install the Package</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Install Apogee MCP globally to make it available system-wide:
                </p>
                <div className="code-block">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Terminal</span>
                    <button
                      onClick={() => copyToClipboard(installCommand, 'install')}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedCode === 'install' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                    </button>
                  </div>
                  <div className="terminal">
                    <code>{installCommand}</code>
                  </div>
                </div>
              </div>

              {/* Step 2: Verify */}
              <div className="card border-l-4 border-l-gray-400">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <h3 className="text-xl font-semibold text-black">Verify Installation</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Check that the installation was successful:
                </p>
                <div className="code-block">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Verification</span>
                    <button
                      onClick={() => copyToClipboard(verifyCommand, 'verify')}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedCode === 'verify' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                    </button>
                  </div>
                  <div className="terminal">
                    <code>{verifyCommand}</code>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <CheckCircle className="h-4 w-4 inline mr-2" />
                    Expected output: <code className="bg-green-100 px-1 rounded">1.0.0</code>
                  </p>
                </div>
              </div>

              {/* Step 3: Configure */}
              <div className="card border-l-4 border-l-blue-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <h3 className="text-xl font-semibold text-black">Configure Cursor</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Add Apogee MCP to your Cursor configuration file <code className="bg-gray-100 px-1 rounded">.cursor/mcp.json</code>:
                </p>
                <div className="code-block">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">.cursor/mcp.json</span>
                    <button
                      onClick={() => copyToClipboard(cursorConfig, 'cursor')}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedCode === 'cursor' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                    </button>
                  </div>
                  <CodeBlock language="json">
                    {cursorConfig}
                  </CodeBlock>
                </div>
              </div>

              {/* Step 4: Test */}
              <div className="card border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <h3 className="text-xl font-semibold text-black">Test Connection</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Restart Cursor and verify that Apogee tools are available:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Restart Cursor application
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Open a project in Cursor
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Check that <code className="bg-gray-100 px-1 rounded">apogee.*</code> tools are available
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Alternative Installation Methods */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-black mb-8">Alternative Methods</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Local Development */}
              <div className="card">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Local Development
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  For development and testing with local source code:
                </p>
                <div className="code-block">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Local Install</span>
                    <button
                      onClick={() => copyToClipboard('git clone https://github.com/Reichel1/apogee-mcp.git\ncd apogee-mcp\nnpm install\nnpm run build', 'local')}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedCode === 'local' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                    </button>
                  </div>
                  <div className="terminal text-xs">
                    <div>git clone https://github.com/Reichel1/apogee-mcp.git</div>
                    <div>cd apogee-mcp</div>
                    <div>npm install</div>
                    <div>npm run build</div>
                  </div>
                </div>
              </div>

              {/* Docker */}
              <div className="card">
                <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Docker
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Run in containerized environment:
                </p>
                <div className="code-block">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Docker</span>
                    <button
                      onClick={() => copyToClipboard('docker run -it --rm ghcr.io/reichel1/apogee-mcp:latest --stdio', 'docker')}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedCode === 'docker' ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}
                    </button>
                  </div>
                  <div className="terminal text-xs">
                    <div>docker run -it --rm \</div>
                    <div>  ghcr.io/reichel1/apogee-mcp:latest \</div>
                    <div>  --stdio</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Troubleshooting */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-black mb-8">Troubleshooting</h2>
            
            <div className="space-y-6">
              <div className="card border border-amber-200 bg-amber-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Command not found: apogee-mcp</h3>
                    <p className="text-amber-700 text-sm mb-3">
                      The global installation may not have updated your PATH. Try:
                    </p>
                    <div className="terminal text-xs">
                      <div>npm list -g @apogee/mcp-server</div>
                      <div>which apogee-mcp</div>
                      <div>echo $PATH</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border border-red-200 bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">Permission denied errors</h3>
                    <p className="text-red-700 text-sm mb-3">
                      On macOS/Linux, you may need to use sudo or configure npm differently:
                    </p>
                    <div className="terminal text-xs">
                      <div>sudo npm install -g @apogee/mcp-server</div>
                      <div># OR configure npm to use a different directory</div>
                      <div>mkdir ~/.npm-global</div>
                      <div>npm config set prefix '~/.npm-global'</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border border-blue-200 bg-blue-50">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Cursor doesn't see MCP server</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      Ensure the configuration file is in the correct location and format:
                    </p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Check file path: <code className="bg-blue-100 px-1 rounded">.cursor/mcp.json</code></li>
                      <li>• Validate JSON syntax</li>
                      <li>• Restart Cursor completely</li>
                      <li>• Check Cursor's MCP server logs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Next Steps */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center card border-2 border-black"
          >
            <h2 className="text-2xl font-bold text-black mb-4">Ready to Start?</h2>
            <p className="text-gray-600 mb-6">
              Now that Apogee MCP is installed, explore the documentation and start building with multi-agent coordination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/docs/quickstart"
                className="btn-primary inline-flex items-center gap-2"
              >
                Quick Start Guide
                <ExternalLink className="h-4 w-4" />
              </a>
              <a 
                href="/docs/api"
                className="btn-secondary inline-flex items-center gap-2"
              >
                API Reference
                <Code className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/Reichel1/apogee-mcp"
                className="btn-ghost inline-flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Source
              </a>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
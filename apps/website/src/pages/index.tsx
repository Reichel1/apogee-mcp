import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Bot, 
  GitBranch, 
  Shield, 
  Zap,
  CheckCircle,
  Code,
  Database,
  Users,
  Star
} from 'lucide-react';

export default function Home() {
  const [copiedCursor, setCopiedCursor] = useState(false);
  
  const cursorConfig = `{
  "mcpServers": {
    "apogee": {
      "command": "npx",
      "args": ["-y", "@apogee/mcp-server", "--stdio"],
      "env": {
        "APOGEE_ROLE": "implementer"
      }
    }
  }
}`;

  const copyToClipboard = (text: string, setter: (value: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">Apogee</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#docs" className="text-slate-300 hover:text-white transition-colors">Docs</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
            <a href="https://github.com/apogee-studios/ai-dev-sdk" className="text-slate-300 hover:text-white transition-colors">GitHub</a>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white transition-colors">
              Sign In
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The First <span className="text-purple-400">MCP Server</span><br />
            for Multi-Agent Development
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Enable Claude Code and Cursor to work together seamlessly. Claude handles database design and migrations, 
            while GPT-5 implements your application code—without conflicts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => copyToClipboard(cursorConfig, setCopiedCursor)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {copiedCursor ? <CheckCircle className="h-5 w-5" /> : <Code className="h-5 w-5" />}
              {copiedCursor ? 'Copied!' : 'Add to Cursor'}
            </button>
            <button className="border border-slate-600 hover:border-slate-500 px-8 py-4 rounded-lg text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2">
              <Database className="h-5 w-5" />
              Connect Claude
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            Free forever for local development • Pro plan starts at $29.99/month
          </p>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Multi-Agent Development is <span className="text-red-400">Broken</span>
            </h2>
            <p className="text-xl text-slate-300">
              Cursor, Claude Code, and other AI coding tools work in isolation. When you try to use multiple AI agents, you get:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: GitBranch, title: "Merge Conflicts", desc: "Both agents modify the same files simultaneously" },
              { icon: Database, title: "Database Chaos", desc: "No clear ownership of schema changes and migrations" },
              { icon: Users, title: "No Coordination", desc: "Agents can't communicate or share state" }
            ].map((problem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg"
              >
                <problem.icon className="h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>
                <p className="text-slate-300">{problem.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Introducing <span className="text-purple-400">Cooperative AI Development</span>
            </h2>
            <p className="text-xl text-slate-300">
              Apogee provides the missing coordination layer with clear role separation and conflict-free collaboration.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-white mb-4">Claude Code (Planner)</h3>
                <ul className="space-y-2 text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Database schema design
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Supabase migrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    High-level architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Code review & planning
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-white mb-4">Cursor (Implementer)</h3>
                <ul className="space-y-2 text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    API routes & services
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    UI components
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Tests & scripts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Code implementation
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-12 bg-slate-800/50 border border-slate-700 p-8 rounded-lg"
          >
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Coordination Features</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: GitBranch, title: "Write Fence", desc: "Prevents simultaneous file conflicts" },
                { icon: Users, title: "Shared Todo Board", desc: "Coordinated task management" },
                { icon: Zap, title: "Real-time Sync", desc: "Live communication feed" },
                { icon: Shield, title: "Role Enforcement", desc: "Database operations stay with Claude" }
              ].map((feature, idx) => (
                <div key={idx} className="text-center">
                  <feature.icon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-300">Start free, upgrade when you need team features</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-slate-800/50 border border-slate-700 p-8 rounded-lg relative"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-white mb-1">$0</div>
              <div className="text-slate-400">forever</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              {[
                "Local stdio MCP server",
                "1 user per team", 
                "Basic collaboration tools",
                "500 tool calls/month",
                "Community support"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg text-white font-semibold transition-colors">
              Get Started
            </button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-b from-purple-600/20 to-purple-800/20 border-2 border-purple-500 p-8 rounded-lg relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 px-4 py-2 rounded-full text-white text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-bold text-white mb-1">$29.99</div>
              <div className="text-slate-400">per developer/month</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              {[
                "Hosted MCP endpoint",
                "Up to 10 team members",
                "Team collaboration dashboard", 
                "Supabase integration",
                "GitHub/GitLab CI hooks",
                "10,000 tool calls/month",
                "Priority support",
                "90-day session history"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors">
              Start Free Trial
            </button>
          </motion.div>

          {/* Enterprise Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700 p-8 rounded-lg relative"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-1">Custom</div>
              <div className="text-slate-400">contact us</div>
            </div>
            
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Pro",
                "Unlimited team members",
                "SSO integration", 
                "Private cloud deployment",
                "Advanced audit logging",
                "Custom integrations",
                "SLA guarantees",
                "1-year session history"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg text-white font-semibold transition-colors">
              Contact Sales
            </button>
          </motion.div>
        </div>
      </section>

      {/* Integration Instructions */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Quick Setup</h2>
            <p className="text-xl text-slate-300">Get started in 2 minutes</p>
          </motion.div>

          <div className="space-y-8">
            {/* Cursor Setup */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Code className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Add to Cursor</h3>
              </div>
              <p className="text-slate-300 mb-4">Add this to your <code className="bg-slate-700 px-2 py-1 rounded">.cursor/mcp.json</code> file:</p>
              <div className="bg-slate-900 p-4 rounded-lg relative">
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{cursorConfig}</code>
                </pre>
                <button 
                  onClick={() => copyToClipboard(cursorConfig, setCopiedCursor)}
                  className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-xs text-white transition-colors"
                >
                  {copiedCursor ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Claude Setup */}
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Connect Claude Code</h3>
              </div>
              <p className="text-slate-300 mb-4">Add Apogee as a remote MCP server:</p>
              <div className="bg-slate-900 p-4 rounded-lg">
                <ul className="text-slate-300 space-y-2">
                  <li>1. Open Claude Code settings</li>
                  <li>2. Go to "MCP Servers"</li>
                  <li>3. Add URL: <code className="bg-slate-700 px-2 py-1 rounded">https://api.apogee.dev/mcp</code></li>
                  <li>4. Set role: <code className="bg-slate-700 px-2 py-1 rounded">planner</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center bg-gradient-to-r from-purple-600 to-pink-600 p-12 rounded-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Enable Multi-Agent Development?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join developers already using Apogee for conflict-free AI cooperation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 hover:bg-slate-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2">
              <Star className="h-5 w-5" />
              Start Free
            </button>
            <button className="border border-white/50 hover:border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2">
              View on GitHub
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Bot className="h-6 w-6 text-purple-400" />
            <span className="text-white font-semibold">Apogee AI Dev SDK</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="https://github.com/apogee-studios/ai-dev-sdk" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
        <div className="text-center text-slate-400 mt-8 text-sm">
          © 2024 Apogee Studios. MIT Licensed.
        </div>
      </footer>
    </div>
  );
}
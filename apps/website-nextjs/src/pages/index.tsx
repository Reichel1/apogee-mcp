import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Terminal, 
  GitBranch, 
  Shield, 
  CheckCircle,
  Code,
  Database,
  Users,
  Star,
  Copy,
  Download,
  GitHub,
  ExternalLink
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { PricingSection } from '../components/PricingSection';
import { ICPSection } from '../components/ICPSection';
import { LiveDemo } from '../components/LiveDemo';

export default function Home() {
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedCursor, setCopiedCursor] = useState(false);
  
  const installCommand = `npm install -g @apogee/mcp-server`;
  
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

  const copyToClipboard = async (text: string, setter: (value: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      toast.success('Copied!', {
        style: {
          background: '#000',
          color: '#fff',
          border: 'none',
        },
      });
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <span className="text-xl font-semibold text-black">Apogee MCP</span>
                  <p className="text-xs text-gray-600">Multi-Agent AI Coordination</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#overview" className="text-gray-600 hover:text-black transition-colors">Overview</a>
              <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">Pricing</a>
              <a href="/docs" className="text-gray-600 hover:text-black transition-colors">Docs</a>
              <a href="https://github.com/Reichel1/apogee-mcp" className="text-gray-600 hover:text-black transition-colors">
                <GitHub className="h-5 w-5" />
              </a>
              <button className="btn-primary">
                Try Now
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 mb-8">
              <div className="status-dot"></div>
              <span className="text-gray-700 text-sm font-medium">The MCP server for multi-agent coordination</span>
            </div>
            
            <h1 className="font-bold text-black mb-6 leading-tight">
              Multiple Dev Agents<br />
              <span className="gradient-text">Collaborate Safely</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Shared TODOs, conflict-free patches, and Claude-owned DB migrations. 
              The standards-compliant MCP server that plugs into Claude Code, Cursor, and OpenAI Agents.
            </p>
            
            {/* Installation Command */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-3">Install via Terminal:</p>
              <div className="max-w-2xl mx-auto bg-black text-green-400 font-mono text-sm p-4 rounded-lg flex items-center justify-between">
                <code>{installCommand}</code>
                <button
                  onClick={() => copyToClipboard(installCommand, setCopiedInstall)}
                  className="ml-4 p-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition-colors"
                >
                  {copiedInstall ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => copyToClipboard(cursorConfig, setCopiedCursor)}
                className="btn-primary flex items-center justify-center gap-2"
              >
                {copiedCursor ? <CheckCircle className="h-5 w-5" /> : <Download className="h-5 w-5" />}
                Add to Cursor
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Code className="h-5 w-5" />
                Connect Claude Code
              </motion.button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">78%</div>
                <div className="text-gray-600 text-sm">Less merge conflicts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">45%</div>
                <div className="text-gray-600 text-sm">Faster dev cycles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">92%</div>
                <div className="text-gray-600 text-sm">Would recommend</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-black mb-6">See It In Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch Claude (planner) and Cursor (implementer) collaborate on a real project
            </p>
          </motion.div>

          <LiveDemo />
        </div>
      </section>

      {/* ICP Section */}
      <ICPSection />

      {/* How It Works */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-black mb-6">Coordinated Multi-Agent Development</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Role-based guardrails ensure agents work together without conflicts
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="card border-l-4 border-l-black">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-8 w-8 text-black" />
                  <h3 className="text-2xl font-bold text-black">Claude Code (Planner)</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    Owns Supabase migrations and schema
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    High-level architecture decisions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    Policy enforcement and guardrails
                  </li>
                </ul>
              </div>

              <div className="card border-l-4 border-l-gray-400">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="h-8 w-8 text-gray-700" />
                  <h3 className="text-2xl font-bold text-black">Cursor (Implementer)</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-700" />
                    Implements app code and APIs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-700" />
                    Writes tests and handles refactors
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-700" />
                    UI components and user flows
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-2xl font-bold text-black mb-6">Coordination Features</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: GitBranch,
                    title: "Write Fence",
                    desc: "Prevents simultaneous file modifications with explicit handoffs"
                  },
                  {
                    icon: Users,
                    title: "Shared TODO Board",
                    desc: "Real-time task coordination between agents"
                  },
                  {
                    icon: Terminal,
                    title: "Live Communication",
                    desc: "Observable comms feed for transparency"
                  },
                  {
                    icon: Shield,
                    title: "Role Enforcement", 
                    desc: "Database operations locked to planner role"
                  }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <feature.icon className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Quick Start */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-black mb-6">Get Started in 2 Minutes</h2>
            <p className="text-xl text-gray-600">Standards-compliant MCP integration</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Install</h3>
              <div className="terminal text-left">
                <code>{installCommand}</code>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Configure</h3>
              <p className="text-gray-600 text-sm">Add to .cursor/mcp.json</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Collaborate</h3>
              <p className="text-gray-600 text-sm">Start multi-agent development</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center card border-2 border-black p-12"
          >
            <h2 className="text-black mb-6">
              Ready for Multi-Agent Development?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join development teams already using Apogee MCP for conflict-free AI collaboration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Terminal className="h-5 w-5" />
                Install Now
              </motion.button>
              <motion.a 
                href="/docs"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                View Documentation
                <ArrowRight className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <span className="text-black font-semibold">Apogee MCP</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Multi-agent AI development coordination by Apogee Studios
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/Reichel1/apogee-mcp" className="text-gray-600 hover:text-black">
                  <GitHub className="h-5 w-5" />
                </a>
                <a href="https://github.com/Reichel1/apogee-mcp" className="text-gray-600 hover:text-black">
                  <Star className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-black font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#overview" className="hover:text-black">Overview</a></li>
                <li><a href="#pricing" className="hover:text-black">Pricing</a></li>
                <li><a href="/changelog" className="hover:text-black">Changelog</a></li>
                <li><a href="/status" className="hover:text-black">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-black font-semibold mb-4">Docs</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="/docs/quickstart" className="hover:text-black">Quick Start</a></li>
                <li><a href="/docs/cursor" className="hover:text-black">Cursor Setup</a></li>
                <li><a href="/docs/claude" className="hover:text-black">Claude Code</a></li>
                <li><a href="/docs/api" className="hover:text-black">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-black font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="https://apogeestudios.dev" className="hover:text-black">Apogee Studios</a></li>
                <li><a href="/privacy" className="hover:text-black">Privacy</a></li>
                <li><a href="/terms" className="hover:text-black">Terms</a></li>
                <li><a href="/contact" className="hover:text-black">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
            © 2024 Apogee Studios. MIT Licensed. Built for the MCP ecosystem.
          </div>
        </div>
      </footer>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  GitBranch, 
  Database, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Code,
  Bot
} from 'lucide-react';

interface TeamMetrics {
  totalSessions: number;
  activeMembers: number;
  toolCallsThisMonth: number;
  successRate: number;
  avgSessionDuration: string;
}

interface Session {
  id: string;
  name?: string;
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
  lastActivity: string;
  members: string[];
  todoCount: number;
  completedTodos: number;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource?: string;
  success: boolean;
  details: string;
}

export default function TeamDashboard() {
  const [metrics, setMetrics] = useState<TeamMetrics>({
    totalSessions: 12,
    activeMembers: 8,
    toolCallsThisMonth: 2847,
    successRate: 98.2,
    avgSessionDuration: '2h 34m'
  });

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'sess-1',
      name: 'E-commerce API Development',
      status: 'active',
      createdAt: '2024-01-15',
      lastActivity: '5 minutes ago',
      members: ['Claude', 'Cursor'],
      todoCount: 8,
      completedTodos: 5
    },
    {
      id: 'sess-2', 
      name: 'User Authentication System',
      status: 'paused',
      createdAt: '2024-01-14',
      lastActivity: '2 hours ago',
      members: ['Claude', 'Cursor'],
      todoCount: 12,
      completedTodos: 12
    },
    {
      id: 'sess-3',
      name: 'Payment Integration',
      status: 'active',
      createdAt: '2024-01-13',
      lastActivity: '1 hour ago', 
      members: ['Claude', 'Cursor'],
      todoCount: 6,
      completedTodos: 2
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'Claude (Planner)',
      action: 'apogee.db.migrate',
      resource: 'create_products_table',
      success: true,
      details: 'Created products table with inventory tracking'
    },
    {
      id: 'log-2',
      timestamp: '2024-01-15T10:25:00Z', 
      user: 'Cursor (Implementer)',
      action: 'apogee.patch.apply',
      resource: 'src/api/products.ts',
      success: true,
      details: 'Implemented product CRUD endpoints'
    },
    {
      id: 'log-3',
      timestamp: '2024-01-15T10:20:00Z',
      user: 'Claude (Planner)',
      action: 'apogee.todo.update',
      success: true,
      details: 'Added 3 new implementation tasks'
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bot className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Team Dashboard</h1>
              <p className="text-slate-600">Acme Inc Development Team</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Pro Plan
            </span>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium">
              New Session
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Sessions</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.totalSessions}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Members</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.activeMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Tool Calls</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.toolCallsThisMonth.toLocaleString()}</p>
                <p className="text-xs text-slate-500">this month</p>
              </div>
              <Code className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Duration</p>
                <p className="text-3xl font-bold text-slate-900">{metrics.avgSessionDuration}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Sessions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg border border-slate-200"
            >
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Active Sessions</h2>
                <p className="text-sm text-slate-600">AI agent collaboration sessions</p>
              </div>
              <div className="divide-y divide-slate-200">
                {sessions.map((session, idx) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          session.status === 'active' ? 'bg-green-400' :
                          session.status === 'paused' ? 'bg-yellow-400' : 'bg-slate-400'
                        }`} />
                        <h3 className="font-medium text-slate-900">{session.name || `Session ${session.id}`}</h3>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'active' ? 'bg-green-100 text-green-800' :
                        session.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <p><Calendar className="inline h-4 w-4 mr-1" />Created {session.createdAt}</p>
                        <p><Clock className="inline h-4 w-4 mr-1" />Last activity {session.lastActivity}</p>
                      </div>
                      <div>
                        <p><Users className="inline h-4 w-4 mr-1" />{session.members.join(', ')}</p>
                        <p><CheckCircle className="inline h-4 w-4 mr-1" />{session.completedTodos}/{session.todoCount} todos completed</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((session.completedTodos / session.todoCount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(session.completedTodos / session.todoCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Activity Feed */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg border border-slate-200"
            >
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
                <p className="text-sm text-slate-600">Live audit log</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {auditLogs.map((log, idx) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        log.success ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900">{log.user}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{log.action}</p>
                        {log.resource && (
                          <p className="text-xs text-slate-500 font-mono">{log.resource}</p>
                        )}
                        <p className="text-xs text-slate-600 mt-1">{log.details}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <button className="w-full mt-4 text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View Full Audit Log
                </button>
              </div>
            </motion.div>

            {/* Usage Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-6 bg-white rounded-lg border border-slate-200"
            >
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Usage This Month</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tool Calls</span>
                  <span className="text-sm font-medium">2,847 / 10,000</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '28%' }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Team Members</span>
                  <span className="text-sm font-medium">8 / 10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Active Sessions</span>
                  <span className="text-sm font-medium">12 / 50</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
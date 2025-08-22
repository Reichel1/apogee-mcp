import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Rocket, Shield, Users, Database, GitBranch, Zap } from 'lucide-react';

export function ICPSection() {
  const customerProfiles = [
    {
      title: 'Agencies & Product Squads',
      subtitle: 'Using Cursor/Claude Code for client work',
      icon: Building2,
      pain: 'Multiple AI tools stepping on each other during rapid development cycles',
      solution: 'Coordinated multi-model workflows with clear role separation',
      benefits: [
        'Deliver faster without merge conflicts',
        'Claude handles database design safely',
        'Cursor implements features efficiently',
        'Observable collaboration for clients'
      ],
      customer: 'Design agencies, dev shops, consulting firms'
    },
    {
      title: 'Supabase Startups',
      subtitle: 'Need automated, safe database migrations',
      icon: Rocket,
      pain: 'Fear of breaking production with manual schema changes',
      solution: 'Claude-owned migrations with policy enforcement and drift detection',
      benefits: [
        'Zero-downtime schema changes',
        'Migration safety guardrails',
        'RLS policy linting',
        'Audit trail for compliance'
      ],
      customer: 'YC startups, indie hackers, SaaS builders'
    },
    {
      title: 'Enterprise Platform Teams',
      subtitle: 'Piloting agentic development workflows',
      icon: Shield,
      pain: 'Need governance, audit trails, and SSO for AI development tools',
      solution: 'Enterprise-grade MCP with policy enforcement and compliance features',
      benefits: [
        'RBAC and SSO integration',
        'Complete audit logging',
        'Private cloud deployment',
        'Custom integration support'
      ],
      customer: 'Fortune 500 engineering teams, fintech, healthcare'
    }
  ];

  const useCases = [
    {
      icon: GitBranch,
      title: 'Conflict-Free Development',
      description: 'Write fence prevents simultaneous file modifications while allowing parallel work'
    },
    {
      icon: Database,
      title: 'Safe Database Evolution',
      description: 'Claude exclusively owns schema changes, preventing corruption from multiple agents'
    },
    {
      icon: Users,
      title: 'Observable Collaboration',
      description: 'Real-time communication feed shows exactly what each agent is doing'
    },
    {
      icon: Zap,
      title: 'Coordinated Handoffs',
      description: 'Explicit HANDOFF protocol ensures smooth transitions between planning and implementation'
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-white mb-6">Built for Modern Development Teams</h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          From agencies delivering client work to enterprises standardizing AI workflows
        </p>
      </motion.div>

      {/* Customer Profiles */}
      <div className="grid lg:grid-cols-3 gap-8 mb-20">
        {customerProfiles.map((profile, idx) => (
          <motion.div
            key={profile.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <profile.icon className="h-8 w-8 text-purple-400" />
              <div>
                <h3 className="text-xl font-bold text-white">{profile.title}</h3>
                <p className="text-sm text-slate-400">{profile.subtitle}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-2">Current Pain:</h4>
                <p className="text-slate-300 text-sm">{profile.pain}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-green-400 mb-2">Apogee Solution:</h4>
                <p className="text-slate-300 text-sm">{profile.solution}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-purple-400 mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {profile.benefits.map((benefit, benefitIdx) => (
                    <li key={benefitIdx} className="text-slate-300 text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500">{profile.customer}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Use Cases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white text-center mb-12">Core Use Cases</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4 p-6 bg-slate-900/30 border border-slate-700/50 rounded-lg"
            >
              <useCase.icon className="h-6 w-6 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-white mb-2">{useCase.title}</h4>
                <p className="text-slate-400 text-sm">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mt-20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700 p-8 rounded-lg"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Trusted by Development Teams</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
            <div className="text-slate-400 text-sm">Teams in beta</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-slate-400 text-sm">Tool calls processed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">98.2%</div>
            <div className="text-slate-400 text-sm">Success rate</div>
          </div>
        </div>
        
        <blockquote className="mt-8 text-slate-300 italic max-w-2xl mx-auto">
          "Finally! A way to let Claude handle our database design while Cursor implements the APIs. 
          No more merge conflicts, no more schema accidents. Game changer for our agency."
        </blockquote>
        <cite className="text-slate-400 text-sm mt-4 block">
          — Senior Developer at TechFlow Agency
        </cite>
      </motion.div>
    </section>
  );
}
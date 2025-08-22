import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Zap, Shield, Users, Database } from 'lucide-react';

export function PricingSection() {
  const pricingTiers = [
    {
      name: 'Open Source',
      price: 'Free',
      description: 'Perfect for individual developers and experimentation',
      features: [
        'Local stdio MCP server',
        'Basic coordination tools',
        'Single user sessions',
        'Community support',
        'MIT licensed'
      ],
      cta: 'Get Started',
      highlight: false,
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      billing: 'per developer/month',
      description: 'For small teams and agencies building with AI',
      features: [
        'Remote MCP endpoint',
        'Team collaboration (up to 10 devs)',
        '10,000 tool calls/month',
        'OAuth & role management',
        'Supabase integration',
        'CI/CD hooks',
        'Priority support',
        '90-day audit logs'
      ],
      cta: 'Start Free Trial',
      highlight: true,
      popular: true,
      minSeats: '5 seats minimum'
    },
    {
      name: 'Business',
      price: '$299',
      billing: 'per workspace/month + $29/seat',
      description: 'For product squads and growing agencies',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Advanced audit logging',
        'SSO integration',
        'Private projects',
        'CI merge queue',
        'Custom integrations',
        'SLA support'
      ],
      cta: 'Contact Sales',
      highlight: false,
      popular: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For platform teams with compliance needs',
      features: [
        'Everything in Business',
        'VPC deployment',
        'On-premise option',
        'Customer-managed keys',
        'Data processing agreement',
        'Dedicated support',
        'Custom development',
        'Training & onboarding'
      ],
      cta: 'Contact Sales',
      highlight: false,
      popular: false
    }
  ];

  const addOns = [
    {
      name: 'Supabase "DB Owner" Module',
      price: '+$19/month',
      description: 'Claude-only migrations with drift checks and RLS policy linting',
      icon: Database
    },
    {
      name: 'Compliance Pack',
      price: '+$49/month', 
      description: 'PII redaction, exportable audit trails, and regulatory reporting',
      icon: Shield
    }
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Start free with open source, scale with hosted cloud features
        </p>
      </motion.div>

      {/* Main Pricing Tiers */}
      <div className="grid lg:grid-cols-4 gap-8 mb-16">
        {pricingTiers.map((tier, idx) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative rounded-lg border p-8 ${
              tier.highlight 
                ? 'bg-gradient-to-b from-purple-600/20 to-purple-800/20 border-purple-500 shadow-2xl scale-105' 
                : 'bg-slate-900/50 border-slate-700'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 px-4 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.billing && (
                  <span className="text-slate-400 text-sm ml-2">{tier.billing}</span>
                )}
              </div>
              {tier.minSeats && (
                <div className="text-xs text-slate-400 mb-2">{tier.minSeats}</div>
              )}
              <p className="text-slate-400 text-sm">{tier.description}</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, featureIdx) => (
                <li key={featureIdx} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              tier.highlight
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}>
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add-ons Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white text-center mb-8">Add-ons</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {addOns.map((addon, idx) => (
            <motion.div
              key={addon.name}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 border border-slate-700 p-6 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <addon.icon className="h-8 w-8 text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{addon.name}</h4>
                    <span className="text-purple-400 font-semibold">{addon.price}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{addon.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enterprise CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mt-16 bg-slate-900/50 border border-slate-700 p-8 rounded-lg"
      >
        <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-4">Need something custom?</h3>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Enterprise teams get dedicated support, custom integrations, and flexible deployment options.
          Let's build the perfect solution for your AI development workflow.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg text-white font-semibold transition-colors">
          Schedule a Demo
        </button>
      </motion.div>
    </section>
  );
}
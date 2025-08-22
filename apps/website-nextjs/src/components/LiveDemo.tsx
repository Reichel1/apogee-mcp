import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Bot, Code, Database, CheckCircle, MessageSquare, GitBranch } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

const demoSteps = [
  {
    id: 1,
    agent: 'claude',
    action: 'Planning Phase',
    message: 'Starting e-commerce project. I need to design the database schema first.',
    tool: 'apogee.todo.update',
    result: 'Created 5 tasks: schema design, API endpoints, tests, UI components, deployment'
  },
  {
    id: 2,
    agent: 'claude', 
    action: 'Database Migration',
    message: 'Creating products table with inventory tracking and user relationships.',
    tool: 'apogee.db.migrate',
    result: 'Successfully migrated: products, users, orders tables with RLS policies'
  },
  {
    id: 3,
    agent: 'claude',
    action: 'Handoff to Implementer',
    message: 'Database is ready. HANDOFF::implementer - please build the API endpoints.',
    tool: 'apogee.fence.set',
    result: 'Write fence transferred to implementer'
  },
  {
    id: 4,
    agent: 'cursor',
    action: 'API Implementation',
    message: 'Building CRUD endpoints for products with proper validation and error handling.',
    tool: 'apogee.patch.apply',
    result: 'Applied patch: src/api/products.ts - 156 lines added'
  },
  {
    id: 5,
    agent: 'cursor',
    action: 'Test Implementation',
    message: 'Writing comprehensive tests for all product endpoints with edge cases.',
    tool: 'apogee.patch.apply', 
    result: 'Applied patch: tests/api/products.test.ts - 89 lines added'
  },
  {
    id: 6,
    agent: 'cursor',
    action: 'Status Update',
    message: 'API endpoints complete. All tests passing. Ready for UI components.',
    tool: 'apogee.todo.update',
    result: 'Marked API tasks as completed, UI tasks moved to in-progress'
  }
];

export function LiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < demoSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 2500);
    } else if (currentStep >= demoSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <>
      {/* Inline Demo Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden"
      >
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-white font-semibold">Live Collaboration Demo</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Active Session</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={resetDemo}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={togglePlayPause}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-slate-400 hover:text-white text-sm"
            >
              View Full Demo
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Action */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    {currentStepData.agent === 'claude' ? (
                      <Bot className="h-6 w-6 text-blue-400" />
                    ) : (
                      <Code className="h-6 w-6 text-purple-400" />
                    )}
                    <div>
                      <h4 className="text-white font-semibold">
                        {currentStepData.agent === 'claude' ? 'Claude (Planner)' : 'Cursor (Implementer)'}
                      </h4>
                      <p className="text-slate-400 text-sm">{currentStepData.action}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 p-3 rounded border-l-4 border-purple-500 mb-3">
                    <p className="text-slate-300 text-sm">{currentStepData.message}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-400 font-mono">{currentStepData.tool}</span>
                    <span className="text-slate-500">Step {currentStep + 1} of {demoSteps.length}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Result/State */}
            <div className="space-y-4">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Result
                </h4>
                <p className="text-green-300 text-sm bg-green-900/20 p-3 rounded border border-green-700/30">
                  {currentStepData.result}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Session Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Completion</span>
                    <span className="text-purple-400">{Math.round(((currentStep + 1) / demoSteps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div 
                      className="bg-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-700"></div>
              <motion.div 
                className="absolute top-4 left-0 h-0.5 bg-purple-600 z-10"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              
              {demoSteps.map((step, idx) => (
                <div key={step.id} className="relative z-20 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    idx <= currentStep 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="mt-2 text-xs text-center max-w-20">
                    <p className={idx <= currentStep ? 'text-slate-300' : 'text-slate-500'}>
                      {step.action.split(' ')[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Demo Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-lg z-50 overflow-hidden">
            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Full Multi-Agent Demo</h2>
              <Dialog.Close className="text-slate-400 hover:text-white p-2">
                ✕
              </Dialog.Close>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Communication Log */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Communication Feed
                  </h3>
                  
                  <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-700 max-h-96 overflow-y-auto">
                    {demoSteps.slice(0, currentStep + 1).map((step, idx) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded border border-slate-700/50"
                      >
                        {step.agent === 'claude' ? (
                          <Bot className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                        ) : (
                          <Code className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-white">
                              {step.agent === 'claude' ? 'Claude' : 'Cursor'}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date().toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">{step.message}</p>
                          <div className="text-xs text-purple-400 font-mono">{step.tool}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* State Sidebar */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Session State
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <h4 className="text-sm font-medium text-white mb-2">Write Fence</h4>
                        <p className="text-sm text-slate-300">
                          {currentStep < 3 ? 'Claude (Planner)' : 'Cursor (Implementer)'}
                        </p>
                      </div>
                      
                      <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <h4 className="text-sm font-medium text-white mb-2">TODO Progress</h4>
                        <div className="space-y-1">
                          <div className="text-xs text-slate-400">Completed: {Math.min(currentStep, 3)}/6</div>
                          <div className="w-full bg-slate-700 rounded-full h-1.5">
                            <div 
                              className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${(Math.min(currentStep, 3) / 6) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <h4 className="text-sm font-medium text-white mb-2">Database Status</h4>
                        <p className="text-sm text-green-300">
                          {currentStep >= 1 ? '✓ Schema migrated' : 'Pending migration'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
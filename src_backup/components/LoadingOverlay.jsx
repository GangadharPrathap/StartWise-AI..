import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Loader2, BrainCircuit, TrendingUp, Presentation, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

const LoadingOverlay = ({ step }) => {
  const steps = [
    { text: "🔍 Analyzing Idea...", icon: <BrainCircuit className="w-5 h-5" /> },
    { text: "📈 Market Research...", icon: <TrendingUp className="w-5 h-5" /> },
    { text: "🎨 Designing Pitch...", icon: <Presentation className="w-5 h-5" /> },
    { text: "📍 Finding Investors...", icon: <MapPin className="w-5 h-5" /> }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900/50 border border-gray-700/50 rounded-3xl p-10 max-w-md w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0 animate-progress-flow" />

        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-accent/10 rounded-full" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-t-accent border-r-accent/30 rounded-full"
          />
          <div className="absolute inset-4 bg-accent/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 premium-gradient-text">StartWise AI is building...</h2>

        <div className="space-y-4 text-left">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3, x: -10 }}
              animate={{
                opacity: step >= i ? 1 : 0.3,
                x: step >= i ? 0 : -10,
                scale: step === i ? 1.05 : 1
              }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all border border-transparent",
                step === i ? "bg-accent/10 border-accent/20 step-active shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "",
                step > i ? "text-green-400" : "text-gray-400"
              )}
            >
              {step > i ? <CheckCircle2 className="w-5 h-5" /> : s.icon}
              <span className="text-sm font-medium">{s.text}</span>
              {step === i && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-[11px] text-gray-500 font-medium tracking-wide flex items-center justify-center gap-2">
          ⚡ This will only take a few seconds
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingOverlay;

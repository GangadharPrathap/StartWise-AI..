import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, BrainCircuit, Cpu, Globe } from 'lucide-react'

/**
 * Premium AI Loader with dynamic pulsing and intelligence indicators
 */
export function AILoader({ text = "Analyzing data...", subtext = "Connecting to Startup Intelligence Engine" }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-12">
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-[-40px] bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute inset-[-60px] bg-blue-500/10 rounded-full blur-3xl"
        />
        
        {/* Core Icon */}
        <div className="relative z-10 w-24 h-24 bg-gray-900 border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl overflow-hidden group">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-blue-500/20 opacity-50"
          />
          <BrainCircuit className="text-accent w-10 h-10 relative z-10" />
          
          {/* Scanning Line */}
          <motion.div 
            animate={{ top: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent via-accent/20 to-transparent z-20"
          />
        </div>

        {/* Orbiting Icons */}
        {[Cpu, Sparkles, Globe].map((Icon, i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.5 }
            }}
            className="absolute inset-[-20px] pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 p-2 rounded-lg text-accent shadow-lg">
              <Icon size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-black text-white tracking-tight mb-2"
      >
        {text}
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]"
      >
        {subtext}
      </motion.p>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-white/5 rounded-full mt-8 overflow-hidden border border-white/5 p-[1px]">
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-accent to-transparent rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
        />
      </div>
    </div>
  )
}

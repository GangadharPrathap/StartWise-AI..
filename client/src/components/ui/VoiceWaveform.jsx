import { motion } from 'framer-motion'

/**
 * Advanced Voice Waveform for Mic and AI Speaking states
 */
export function VoiceWaveform({ isActive, color = "#3b82f6", bars = 16 }) {
  return (
    <div className="flex items-center gap-1.5 h-16">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          animate={isActive ? {
            height: [
              Math.random() * 20 + 10,
              Math.random() * 50 + 20,
              Math.random() * 30 + 15,
              Math.random() * 60 + 30,
              10
            ],
            backgroundColor: [color, "#8b5cf6", color],
            opacity: [0.5, 1, 0.5]
          } : {
            height: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            opacity: 0.3
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
          className="w-1.5 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

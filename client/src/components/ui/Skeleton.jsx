import { motion } from 'framer-motion'

/**
 * Premium Skeleton loaders for dashboard cards
 */
export function SkeletonCard() {
  return (
    <div className="bg-gray-900/40 border border-white/5 rounded-3xl p-6 overflow-hidden relative">
      <div className="flex gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 bg-white/5 rounded-full animate-pulse" />
          <div className="h-3 w-1/4 bg-white/5 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full bg-white/5 rounded-full animate-pulse" />
        <div className="h-3 w-5/6 bg-white/5 rounded-full animate-pulse" />
        <div className="h-3 w-4/6 bg-white/5 rounded-full animate-pulse" />
      </div>
      
      {/* Shimmer Effect */}
      <motion.div 
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
      />
    </div>
  )
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse flex items-center px-6 gap-4">
          <div className="w-8 h-8 rounded-lg bg-white/5" />
          <div className="h-3 w-1/3 bg-white/5 rounded-full" />
          <div className="ml-auto h-3 w-20 bg-white/5 rounded-full" />
        </div>
      ))}
    </div>
  )
}

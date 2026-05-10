import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility for tailwind class merging
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Premium Button with magnetic feel and cinematic glow
 */
export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  icon: Icon,
  children,
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40',
    secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
    outline: 'border border-accent/50 text-accent hover:bg-accent/10',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40'
  }

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm'
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? <Icon size={16} /> : null}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'

/**
 * Cinematic Glass Card
 */
export const Card = ({ className, children, glow = true }) => (
  <div className={cn(
    'relative bg-gray-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl overflow-hidden group',
    glow && 'hover:border-white/10 transition-all duration-500',
    className
  )}>
    {glow && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    )}
    {children}
  </div>
)

/**
 * Animated Input Field
 */
export const Input = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-2 w-full">
    {label && (
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
        {Icon ? <Icon size={12} /> : null} {label}
      </label>
    )}
    <div className="relative group">
      <input
        className={cn(
          'w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-gray-700 focus:border-accent focus:bg-white/10 outline-none transition-all',
          error && 'border-red-500/50 focus:border-red-500'
        )}
        {...props}
      />
      <div className="absolute inset-0 rounded-2xl border border-accent/0 group-focus-within:border-accent/20 pointer-events-none transition-all" />
    </div>
    {error && <p className="text-[10px] text-red-500 font-bold px-2">{error}</p>}
  </div>
)

/**
 * Badge System
 */
export const Badge = ({ children, variant = 'primary', className }) => {
  const styles = {
    primary: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
  return (
    <span className={cn('text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border', styles[variant], className)}>
      {children}
    </span>
  )
}

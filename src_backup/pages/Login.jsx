import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Sparkles, LogIn, ShieldCheck, Zap, Globe } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

const Login = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for the background glow
      gsap.to(glowRef.current, {
        x: '+=50',
        y: '+=30',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Entrance animations
      gsap.from('.login-card', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.2
      });

      gsap.from('.login-item', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.6
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative"
    >
      {/* Background Elements */}
      <div 
        ref={glowRef}
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" 
      />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-900/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        className="login-card w-full max-w-md relative z-10"
      >
        <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="login-item w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8A1E] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6 group hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
            </div>
            
            <h1 className="login-item text-4xl font-black tracking-tighter text-white mb-2">
              STARTWISE <span className="text-[#FF6B00]">AI</span>
            </h1>
            <p className="login-item text-gray-400 font-medium">
              Elite Startup Intelligence OS v2.0
            </p>
          </div>

          <div className="space-y-6">
            <div className="login-item grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 group hover:bg-white/10 transition-colors">
                <ShieldCheck className="w-5 h-5 text-orange-500/80" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secure Auth</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 group hover:bg-white/10 transition-colors">
                <Zap className="w-5 h-5 text-orange-500/80" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time AI</span>
              </div>
            </div>

            <button
              onClick={signInWithGoogle}
              className="login-item w-full py-4 px-6 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-3 hover:bg-[#FF6B00] hover:text-white transition-all duration-300 active:scale-[0.98] group relative overflow-hidden shadow-xl shadow-white/5"
            >
              <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Access Control Tower
            </button>

            <div className="login-item flex items-center justify-center gap-2 py-4">
              <div className="h-[1px] w-8 bg-white/10" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Indian Startup Ecosystem</span>
              <div className="h-[1px] w-8 bg-white/10" />
            </div>

            <div className="login-item flex justify-center gap-6 opacity-40">
              <Globe className="w-4 h-4 text-white" />
              <div className="h-4 w-[1px] bg-white/20" />
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">Proprietary AI Engine</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="login-item mt-8 text-center text-[10px] font-black text-gray-700 uppercase tracking-widest">
          &copy; 2026 StartWise AI Systems &bull; Built for Founders
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Sparkles, LogIn, ShieldCheck, Zap, Globe } from 'lucide-react';
import { signInWithGoogle } from '../services/firebase';

const Login = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Standard GSAP entrance
    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        x: '+=30',
        y: '+=20',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Ensure elements are visible immediately if GSAP fails
      gsap.set('.login-item', { opacity: 1, y: 0 });
      
      gsap.from('.login-card', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.login-item', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.3
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
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <motion.div className="login-card w-full max-w-md relative z-10">
        <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="login-item w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="login-item text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">
              STARTWISE <span className="text-orange-500">AI</span>
            </h1>
            <p className="login-item text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
              Elite Startup Intelligence OS v2.0
            </p>
          </div>

          <div className="space-y-4">
            <div className="login-item grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Secure Auth</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Real-time AI</span>
              </div>
            </div>

            <button
              onClick={signInWithGoogle}
              className="login-item w-full py-4 px-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5"
            >
              <LogIn className="w-4 h-4" />
              Access Control Tower
            </button>

            {/* Emergency Guest Login for testing/demo */}
            <button
              onClick={() => {
                // Manually trigger a mock auth state if Firebase is slow/failing
                window.dispatchEvent(new CustomEvent('demo-login'));
              }}
              className="login-item w-full py-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-orange-500 transition-colors"
            >
              Enter as Guest (Demo)
            </button>

            <div className="login-item flex items-center justify-center gap-4 py-4 opacity-20">
               <div className="h-[1px] flex-1 bg-white" />
               <Globe className="w-3 h-3 text-white" />
               <div className="h-[1px] flex-1 bg-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

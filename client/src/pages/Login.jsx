import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Star,
  CheckCircle2
} from 'lucide-react';

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
  })
};

/* ─── Floating particles ─── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: `rgba(255, 107, 0, ${0.15 + Math.random() * 0.25})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40 - Math.random() * 30, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Animated grid background ─── */
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

/* ─── Testimonial carousel ─── */
const testimonials = [
  { name: 'Sarah Chen', role: 'Founder, NexaAI', quote: 'StartWise helped me validate my idea in days, not months. The VC simulator was a game-changer.', rating: 5 },
  { name: 'Raj Patel', role: 'CEO, FinStack', quote: 'The investor map connected me with the right VCs. Raised our seed round in 6 weeks.', rating: 5 },
  { name: 'Emily Zhang', role: 'Co-founder, EduFlow', quote: 'The AI-generated pitch deck impressed every investor we met. Incredible tool.', rating: 5 },
];

function TestimonialCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[active];

  return (
    <motion.div
      key={active}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="glass-home-card rounded-2xl p-6 border border-white/5"
    >
      <div className="flex gap-1 mb-3">
        {[...Array(t.rating)].map((_, i) => (
          <Star key={i} size={14} className="text-orange-400 fill-orange-400" />
        ))}
      </div>
      <p className="text-sm text-gray-300 leading-relaxed italic mb-4">"{t.quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
          {t.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm text-white font-medium">{t.name}</p>
          <p className="text-xs text-gray-500">{t.role}</p>
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-orange-500 w-5' : 'bg-gray-600 hover:bg-gray-500'}`} />
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════ MAIN LOGIN PAGE ═══════════════ */
const Login = ({ user, signInWithGoogle, signInWithEmail, signUpWithEmail }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      // The useEffect will handle redirect once user state updates
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setIsLoading(true);
    setError('');
    try {
      if (activeTab === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, fullName);
      }
      // The useEffect will handle redirect once user state updates
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/user-not-found') setError('No account found with this email');
      else if (code === 'auth/wrong-password') setError('Incorrect password');
      else if (code === 'auth/email-already-in-use') setError('Email already registered');
      else if (code === 'auth/weak-password') setError('Password must be at least 6 characters');
      else if (code === 'auth/invalid-credential') setError('Invalid email or password');
      else setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-8rem)] flex items-center justify-center relative px-4"
    >
      <Particles />
      <GridBackground />

      {/* Ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">

        {/* ──── Left Panel: Branding & social proof ──── */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="hidden lg:block space-y-8">
          {/* Brand header */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/25">
                SW
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">StartWiseAI</h2>
                <p className="text-xs text-gray-400">AI Startup Copilot</p>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Validate, Build &{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Launch Faster
              </span>
            </h1>
            <p className="text-gray-400 leading-relaxed">
              Join 1,200+ founders using AI to turn ideas into investor-ready startups. Get insights, simulate VC pitches, and build your roadmap — all in one platform.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: <Zap size={18} />, title: 'AI-Powered Analysis', desc: 'Get instant SWOT analysis and market insights' },
              { icon: <Shield size={18} />, title: 'VC Pitch Simulator', desc: 'Practice with AI investors before the real deal' },
              { icon: <TrendingUp size={18} />, title: 'Growth Roadmap', desc: 'Step-by-step plan from idea to traction' },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i + 2} initial="hidden" animate="visible"
                className="flex items-start gap-4 p-4 rounded-xl glass-home-card border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400 shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible">
            <TestimonialCarousel />
          </motion.div>
        </motion.div>

        {/* ──── Right Panel: Login Form ──── */}
        <motion.div variants={scaleIn} initial="hidden" animate="visible">
          <div className="glass-home-card rounded-3xl p-8 md:p-10 border border-white/5 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-orange-600/8 rounded-full blur-[60px] pointer-events-none" />

            {/* Mobile-only brand */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">SW</div>
              <h2 className="text-xl font-bold text-white">StartWiseAI</h2>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/5 mb-8 relative z-10">
              {['login', 'signup'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}>
                  {tab === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <h3 className="text-2xl font-bold text-white mb-1 relative z-10">
              {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
            </h3>
            <p className="text-sm text-gray-400 mb-6 relative z-10">
              {activeTab === 'login'
                ? 'Sign in to continue building your startup journey.'
                : 'Start your journey with AI-powered startup tools.'}
            </p>

            {/* Google sign-in button */}
            <button onClick={handleGoogleSignIn} disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all relative z-10 group mb-6">
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 000 24c0 3.77.87 7.35 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-gray-600 uppercase tracking-wider font-medium">or continue with email</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 relative z-10">
                {error}
              </div>
            )}

            {/* Email / Password form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              {activeTab === 'signup' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Full Name</label>
                  <div className="relative">
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none transition-all" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                    </svg>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email Address</label>
                <div className="relative">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="founder@startup.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none transition-all" />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none transition-all" />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {activeTab === 'login' && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-600 bg-white/5 accent-orange-500" />
                    Remember me
                  </label>
                  <button type="button" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center relative z-10">
              <p className="text-xs text-gray-500">
                {activeTab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
                  className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                  {activeTab === 'login' ? 'Sign up free' : 'Log in'}
                </button>
              </p>
            </div>

            {/* Trust signals */}
            <div className="mt-6 pt-6 border-t border-white/5 relative z-10">
              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><Shield size={10} /> SSL Secured</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={10} /> SOC2 Compliant</span>
                <span className="flex items-center gap-1"><Lock size={10} /> Encrypted</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;

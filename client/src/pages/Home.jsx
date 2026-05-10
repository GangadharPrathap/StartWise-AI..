import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Star, TrendingUp, Target, BarChart3, Users, FileText, Mail, Mic, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../utils/helpers';

/* ─── animation variants ─── */
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }) };
const scaleIn = { hidden: { opacity: 0, scale: 0.85 }, visible: (i = 0) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.12, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } }) };
const slideRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } } };

/* ─── Animated counter ─── */
function Counter({ end, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0; const step = end / (duration / 16);
    const id = setInterval(() => { start += step; if (start >= end) { setVal(end); clearInterval(id); } else setVal(Math.floor(start)); }, 16);
    return () => clearInterval(id);
  }, [inView, end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Floating particles ─── */
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-orange-500/30"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }} />
      ))}
    </div>
  );
}

/* ─── Glassy dashboard mockup ─── */
function DashboardMockup() {
  return (
    <motion.div variants={slideRight} initial="hidden" animate="visible" className="relative w-full max-w-xl">
      {/* Main chart card */}
      <div className="glass-home-card rounded-2xl p-5 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400">Growth Overview</p>
            <p className="text-2xl font-bold text-white">$2.45M <span className="text-green-400 text-sm font-medium">+28.6%</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center"><TrendingUp size={18} className="text-orange-400" /></div>
        </div>
        {/* Animated bar chart */}
        <div className="flex items-end gap-2 h-28">
          {[40, 55, 35, 65, 50, 80, 60, 90, 70, 95, 75, 85].map((h, i) => (
            <motion.div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-orange-600 to-orange-400"
              initial={{ height: 0 }} animate={{ height: `${h}%` }}
              transition={{ delay: 0.8 + i * 0.08, duration: 0.6, ease: 'easeOut' }} />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-500">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m}>{m}</span>)}
        </div>
      </div>

      {/* Floating Market Opportunity card */}
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute -top-4 -right-4 glass-home-card rounded-xl p-3 z-20 border border-orange-500/20">
        <p className="text-[10px] text-gray-400 mb-1">Market Opportunity</p>
        <p className="text-lg font-bold text-green-400">High</p>
        <p className="text-[10px] text-gray-500">Total Addressable Market</p>
        <p className="text-sm font-semibold text-white">$18.6B</p>
      </motion.div>

      {/* Floating Investor Interest card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute -bottom-6 left-8 glass-home-card rounded-xl p-3 z-20 border border-orange-500/20">
        <p className="text-[10px] text-gray-400 mb-1">Investor Interest</p>
        <p className="text-base font-bold text-green-400">Strong</p>
        <p className="text-[10px] text-gray-500">Projected Funding Potential</p>
        <p className="text-sm font-semibold text-white">$3.2M – $5.1M</p>
      </motion.div>

      {/* Target Market donut */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6, duration: 0.5 }}
        className="absolute -bottom-2 -right-6 glass-home-card rounded-xl p-3 z-20 border border-orange-500/20 flex items-center gap-3">
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <motion.circle cx="18" cy="18" r="15.5" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="97.4" initial={{ strokeDashoffset: 97.4 }} animate={{ strokeDashoffset: 97.4 * 0.58 }} transition={{ delay: 1.8, duration: 1, ease: 'easeOut' }} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">42%</span>
        </div>
        <div>
          <p className="text-[10px] text-gray-400">Target Market</p>
          <p className="text-xs text-white font-medium">Early Adopters</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Feature card ─── */
const features = [
  { icon: <Sparkles size={20} />, title: 'Idea Intelligence', desc: 'Get AI-powered analysis on strengths, weaknesses, opportunities, and risks.', color: 'from-orange-500 to-amber-500',
    extra: <div className="mt-4 flex items-center gap-3"><div><p className="text-2xl font-bold text-white">78<span className="text-sm text-gray-400">/100</span></p><p className="text-[10px] text-green-400">Good Potential</p></div><div className="flex-1 h-16 flex items-end gap-1">{[30,50,40,65,55,80,70].map((h,i)=><div key={i} className="flex-1 rounded-t bg-gradient-to-t from-orange-600/60 to-orange-400/60" style={{height:`${h}%`}}/>)}</div></div> },
  { icon: <Mic size={20} />, title: 'AI VC Simulator', desc: 'Have realistic voice conversations with AI investors and get brutally honest feedback.', color: 'from-orange-500 to-red-500',
    extra: <div className="mt-4 glass-home-card rounded-lg p-3"><div className="flex items-center gap-2 mb-2"><div className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center text-[10px]">🎙</div><span className="text-xs text-gray-300">AI VC</span><span className="text-[10px] text-gray-500 ml-auto">01:24</span></div><div className="flex gap-[2px] items-center h-4">{Array.from({length:24}).map((_,i)=><div key={i} className="w-[3px] rounded-full bg-orange-400/60" style={{height:`${20+Math.random()*80}%`}}/>)}</div><p className="text-[10px] text-gray-400 mt-2">What's your go-to-market strategy?</p></div> },
  { icon: <Target size={20} />, title: 'Execution Roadmap', desc: 'Get a personalized, step-by-step roadmap to go from idea to traction.', color: 'from-green-500 to-emerald-500',
    extra: <div className="mt-4 space-y-2">{['Validate','Problem Discovery','Market Research','User Interviews'].map((s,i)=><div key={s} className="flex items-center gap-2"><div className={cn("w-4 h-4 rounded-full flex items-center justify-center",i<2?"bg-green-500/30":"bg-gray-700")}>{i<2?<CheckCircle2 size={10} className="text-green-400"/>:<div className="w-1.5 h-1.5 rounded-full bg-gray-500"/>}</div><span className="text-xs text-gray-300">{s}</span></div>)}</div> },
  { icon: <FileText size={20} />, title: 'Validation Toolkit', desc: 'Generate surveys, landing pages, and outreach emails in seconds.', color: 'from-blue-500 to-cyan-500',
    extra: <div className="mt-4 space-y-2">{['Survey Generator','Landing Page Copy','Email Outreach'].map((s,i)=><div key={s} className="flex items-center justify-between glass-home-card rounded-lg px-3 py-2"><div className="flex items-center gap-2"><div className={cn("w-5 h-5 rounded flex items-center justify-center text-[10px]",i===0?"bg-green-500/30 text-green-400":i===1?"bg-blue-500/30 text-blue-400":"bg-purple-500/30 text-purple-400")}>{i===0?'✓':i===1?'◆':'✉'}</div><span className="text-xs text-gray-300">{s}</span></div><ChevronRight size={12} className="text-gray-500"/></div>)}</div> },
  { icon: <Users size={20} />, title: 'Expert Connect', desc: 'Connect with relevant experts and mentors to accelerate your journey.', color: 'from-purple-500 to-pink-500',
    extra: <div className="mt-4 space-y-2">{[{n:'Alex Morgan',r:'Growth Advisor',c:'bg-orange-500/30'},{n:'Priya Shah',r:'Product Strategist',c:'bg-blue-500/30'},{n:'David Lee',r:'Fundraising Advisor',c:'bg-green-500/30'}].map(p=><div key={p.n} className="flex items-center gap-2"><div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-white font-medium",p.c)}>{p.n[0]}{p.n.split(' ')[1][0]}</div><div><p className="text-xs text-white">{p.n}</p><p className="text-[10px] text-gray-500">{p.r}</p></div><ChevronRight size={12} className="text-gray-500 ml-auto"/></div>)}</div> },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} variants={scaleIn} custom={index} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      className="glass-home-card rounded-2xl p-6 border border-white/5 hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4 shadow-lg", feature.color)}>
        {feature.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
      {feature.extra}
    </motion.div>
  );
}

/* ─── Trusted-by avatars ─── */
function TrustedBy() {
  const colors = ['bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];
  return (
    <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="flex items-center gap-4 mt-8">
      <div className="flex -space-x-3">
        {colors.map((c, i) => (
          <div key={i} className={cn("w-9 h-9 rounded-full border-2 border-black flex items-center justify-center text-white text-xs font-bold", c)}>
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>
      <div>
        <p className="text-sm text-white font-medium">Trusted by 1,200+ founders</p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-orange-400 fill-orange-400" />)}
          <span className="text-xs text-gray-400 ml-1">4.9/5</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════ MAIN HOME COMPONENT ═══════════════ */
const Home = ({ idea, setIdea, cities, selectedCity, setSelectedCity, handleGenerate, isLoading }) => {
  return (
    <div className="relative overflow-hidden">
      <Particles />

      {/* ── ambient glow blobs ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ════════ HERO SECTION ════════ */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Copy */}
          <div>
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-home-card border border-orange-500/20 text-sm text-orange-400 font-medium mb-6">
              <span className="text-orange-400">✦</span> AI-Powered Startup Intelligence
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Turn your startup idea into a{' '}
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">VC-ready narrative.</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
              className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
              Analyze your idea, get AI-driven insights, simulate investor conversations, and build a roadmap to success.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById('idea-input')?.focus()}
                className="group px-7 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2">
                Analyze Your Idea <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-7 py-3.5 rounded-2xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all flex items-center gap-2">
                <Play size={16} className="text-orange-400" /> Watch Demo
              </button>
            </motion.div>

            <TrustedBy />
          </div>

          {/* Right - Dashboard Mockup */}
          <div className="hidden lg:block">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ════════ FEATURES SECTION ════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-sm font-semibold text-orange-400 tracking-widest uppercase">Powerful Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">Everything you need to validate and build</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {features.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
        </div>
      </section>

      {/* ════════ IDEA INPUT SECTION ════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-10">
          <span className="text-sm font-semibold text-orange-400 tracking-widest uppercase flex items-center justify-center gap-2">
            <Sparkles size={14} /> Built for founders. Backed by <span className="font-bold text-white">AI.</span>
          </span>
        </motion.div>

        <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="glass-home-card border border-white/5 rounded-3xl p-8 md:p-10 max-w-3xl mx-auto relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Ready to validate your idea?</h3>
          <p className="text-gray-400 mb-6 relative z-10">Enter your startup idea and let AI do the heavy lifting.</p>

          <textarea id="idea-input" rows={4} value={idea} onChange={e => setIdea(e.target.value)}
            placeholder="Example: I am creating an app which enables college students to sell their practice notes..."
            className="w-full bg-white/5 text-white border border-white/10 rounded-xl p-4 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none transition-all relative z-10 placeholder:text-gray-600" />

          <div className="flex items-center gap-4 my-6 relative z-10">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">select location</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="flex gap-2 flex-wrap relative z-10 mb-8">
            {cities.map(city => (
              <button key={city} onClick={() => setSelectedCity(city)}
                className={cn("px-4 py-2 rounded-full border text-sm transition-all",
                  selectedCity === city
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    : "bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
                )}>{city}</button>
            ))}
          </div>

          <button onClick={handleGenerate} disabled={!idea.trim() || isLoading}
            className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 relative z-10 shadow-lg shadow-orange-500/20">
            {isLoading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</> : <>Generate My RoadMap 🚀</>}
          </button>

          <div className="mt-6 flex justify-center gap-3 flex-wrap relative z-10">
            {['📊 Market Research', '📑 Pitch Deck', '📍 Investor Map', '✉️ Email Draft'].map(f => (
              <span key={f} className="text-[10px] md:text-xs text-gray-400 glass-home-card px-3 py-1.5 rounded-full border border-white/5 hover:border-orange-500/20 hover:text-orange-400 transition-all cursor-default">
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ════════ STATS BAR ════════ */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Ideas Analyzed', value: 12500, suffix: '+' },
            { label: 'Pitch Decks Created', value: 8400, suffix: '+' },
            { label: 'VC Simulations', value: 3200, suffix: '+' },
            { label: 'Founder Success Rate', value: 89, suffix: '%' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={scaleIn} custom={i}
              className="glass-home-card rounded-2xl p-5 text-center border border-white/5 hover:border-orange-500/20 transition-all">
              <p className="text-2xl md:text-3xl font-bold text-white"><Counter end={s.value} suffix={s.suffix} /></p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

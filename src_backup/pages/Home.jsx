import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';

const Home = ({
  idea,
  setIdea,
  cities,
  selectedCity,
  setSelectedCity,
  handleGenerate,
  isLoading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto pt-20 pb-20"
    >
      <div className="text-center mb-12">
        <span className="inline-flex items-center px-4 py-1 rounded-full glass3d animate-float-slow tag-shimmer text-accent border border-accent text-sm font-medium mb-6">
          <span>✦ Powered by Gemini AI</span>
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Your AI Co-Founder</h1>
        <p className="text-xl text-muted-text">StartWiseAI is the best way to get your startup ideas</p>
      </div>

      <div className="glass-card-glow border border-border/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <label className="block text-sm text-muted-text mb-2 relative z-10">Enter the Startup Idea </label>
        <textarea
          rows={6}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Example: I am creating an app which enables the college students to sell their practice notes to the society"
          className="w-full bg-gray-800/50 text-white border border-gray-700 rounded-xl p-4 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none transition-all relative z-10"
        />

        <div className="flex items-center gap-4 my-8 relative z-10">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <label className="block text-sm text-muted-text mb-3 relative z-10">Select Your Location</label>
        <div className="flex gap-3 flex-wrap relative z-10">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={cn(
                "px-4 py-2 rounded-full border text-sm transition-all relative z-10",
                selectedCity === city
                  ? "bg-accent text-white border-accent"
                  : "bg-gray-800 text-muted-text border-gray-700 hover:border-gray-500"
              )}
            >
              {city}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!idea.trim() || isLoading}
          className="mt-8 w-full h-14 bg-accent hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10"
        >
          Generate My RoadMap 🚀
        </button>

        <div className="mt-6 flex justify-center gap-3 flex-wrap relative z-10">
          {["📊 Market Research", "📑 Pitch Deck", "📍 Investor Map", "✉️ Email Draft"].map(f => (
            <span key={f} className="text-[10px] md:text-xs text-gray-300 glass3d tag-hover-lift px-3 py-1 rounded-full border border-gray-800/50">
              <span>{f}</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;

import React from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, LogIn, Plus, Clock, BarChart3, Presentation, Sparkles } from 'lucide-react';

const History = ({
  user,
  history,
  signInWithGoogle,
  setActiveTab,
  setResult,
  setIdea,
  setSelectedCity
}) => {
  return (
    <motion.div
      key="history"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-8">My Saved Kits</h2>

      {!user ? (
        <div className="bg-gray-900 border border-border rounded-2xl p-12 text-center">
          <UserIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Login to see your history</h3>
          <p className="text-muted-text mb-6">Apne generated kits ko save karne ke liye login karein.</p>
          <button
            onClick={() => signInWithGoogle()}
            className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center gap-2 mx-auto"
          >
            <LogIn size={20} /> Login with Google
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-gray-900 border border-border rounded-2xl p-12 text-center">
          <Plus className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No kits found</h3>
          <p className="text-muted-text mb-6">Abhi tak koi startup kit generate nahi kiya gaya.</p>
          <button
            onClick={() => setActiveTab('home')}
            className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center gap-2 mx-auto"
          >
            Start Building 🚀
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((kit) => (
            <motion.div
              key={kit.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card-glow border border-white/10 rounded-3xl p-6 transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => {
                setResult(kit.result);
                setIdea(kit.idea);
                setSelectedCity(kit.city);
                setActiveTab('dashboard');
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[10px] glass3d animate-float-slow tag-shimmer text-accent px-3 py-1 rounded-full border border-accent/30 font-bold uppercase tracking-wider">
                  <span>{kit.city}</span>
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                  <Clock size={10} />
                  {kit.createdAt?.seconds ? new Date(kit.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                </div>
              </div>
              <h4 className="text-white font-bold mb-3 line-clamp-1 group-hover:text-accent transition-colors relative z-10">{kit.idea}</h4>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <BarChart3 size={12} className="text-accent" />
                  <span>{kit.result.marketSize}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Presentation size={12} className="text-purple-400" />
                  <span>{kit.result.pitchSlides?.length || 0} Slides</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                <span className="text-[10px] text-accent font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">View Full Kit →</span>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-900 bg-accent/20 flex items-center justify-center">
                      <Sparkles size={8} className="text-accent/50" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default History;

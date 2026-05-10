import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Presentation,
  Map as MapIcon,
  Mail,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  ArrowRight,
  Plus,
  Download,
  Send
} from 'lucide-react';
import { cn } from '../lib/utils';
import { investors } from '../data';
import confetti from 'canvas-confetti';

const Dashboard = ({
  result,
  idea,
  selectedCity,
  additionalSlidesCount,
  setAdditionalSlidesCount,
  handleGenerateMoreSlides,
  isGeneratingSlides,
  handleDownloadPPTX,
  setActiveTab,
  setSelectedInvestorForMeeting,
  setShowAnalysisModal
}) => {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Co-Founder Kit</h2>
          <p className="text-sm text-muted-text mt-1">Generated for: {idea.substring(0, 60)}...</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="glass3d tag-shimmer text-success border border-green-900/50 px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <CheckCircle2 size={14} /> <span>Analysis Complete</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: Market Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-glow rounded-3xl p-8 border border-border/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-accent to-accent/20 rounded-r-full" />
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <motion.div
              className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent border border-accent/30 group-hover:border-accent/60 transition-colors"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <BarChart3 size={24} />
            </motion.div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold flex items-center gap-2">
                Market Analysis
                {result?.riskLevel && (
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest glass3d animate-pulse-glow",
                    result.riskLevel === "Low" ? "text-green-400" :
                      result.riskLevel === "Medium" ? "text-amber-400" :
                        "text-red-400"
                  )}>
                    <span>{result.riskLevel} Risk</span>
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-accent font-medium uppercase tracking-widest">Deep Insights • {result?.marketGrowth || "28%"} CAGR</p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            {/* TAM/SAM/SOM Breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-black/30 rounded-xl border border-accent/10">
              <div className="text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">TAM</p>
                <p className="text-sm font-bold text-accent">{result?.marketSize || "$8.4B"}</p>
                <p className="text-[9px] text-gray-500 mt-1">Total Market</p>
              </div>
              <div className="text-center border-l border-r border-gray-700">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">SAM</p>
                <p className="text-sm font-bold text-blue-400">${(Number(result?.marketSize?.replace(/[\$B]/g, '') || 8.4) * 0.3).toFixed(1)}B</p>
                <p className="text-[9px] text-gray-500 mt-1">Serviceable</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">SOM</p>
                <p className="text-sm font-bold text-green-400">${(Number(result?.marketSize?.replace(/[\$B]/g, '') || 8.4) * 0.05).toFixed(1)}B</p>
                <p className="text-[9px] text-gray-500 mt-1">Obtainable</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-800">
              <div>
                <p className="text-[10px] text-muted-text mb-1 uppercase font-bold tracking-wider">Target Customer</p>
                <p className="text-xs text-white font-medium">{result?.targetCustomer || "Millennials & Gen Z"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-text mb-1 uppercase font-bold tracking-wider">Growth Potential</p>
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
                  <TrendingUp size={12} /> Very High
                </div>
              </div>
            </div>

            <div className="py-3 border-b border-gray-800">
              <p className="text-[10px] text-muted-text mb-2 uppercase font-bold tracking-wider">Top Trends</p>
              <div className="flex flex-wrap gap-1.5">
                {result?.marketTrends?.map((trend, i) => (
                  <span key={i} className="text-[9px] glass3d tag-hover-lift px-2 py-0.5 rounded-lg text-gray-300">
                    <span>{trend}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="py-3 border-b border-gray-800">
              <p className="text-[10px] text-muted-text mb-2 uppercase font-bold tracking-wider">Analysis Summary</p>
              <p className="text-xs text-gray-300 leading-relaxed italic line-clamp-2">"{result?.marketAnalysisDetails}"</p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <span className="text-muted-text">Competitors Found</span>
              <span className="text-white font-medium glass3d tag-shimmer px-3 py-1 rounded-full">
                <span>{result?.competitors.length || 3} companies</span>
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-muted-text">Opportunity Score</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-lg">{(result?.opportunityScore || 8.5) / 2}</span>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s}>★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <p className="text-xs text-muted-text mb-2 uppercase font-bold tracking-wider">Top Competitors</p>
            <div className="flex flex-wrap gap-2">
              {result?.competitors.map((c, i) => (
                <span
                  key={c.name}
                  className="glass3d tag-hover-lift text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-600 cursor-default transition-colors"
                >
                  <span>{c.name}</span>
                </span>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => setShowAnalysisModal(true)}
            className="mt-6 text-accent text-sm font-medium hover:underline flex items-center gap-1 relative z-10"
          >
            View Full Analysis <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        {/* CARD 2: Pitch Deck */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card-glow rounded-3xl p-8 border border-border/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-purple-500 to-purple-500/20 rounded-r-full" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 border border-purple-500/30">
                <Presentation size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Pitch Deck Ready</h3>
                <p className="text-[10px] text-purple-400 font-medium uppercase tracking-widest">Storytelling Flow • 92% Readiness</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto mb-4 custom-scrollbar pr-2 relative z-10">
            {result?.pitchSlides.map((slide, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group/slide">
                <div className="shrink-0 w-6 h-6 bg-gray-800 text-gray-400 rounded text-[10px] flex items-center justify-center font-bold mt-0.5 group-hover/slide:bg-purple-500 group-hover/slide:text-white transition-colors">
                  {slide.slideNumber}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{slide.title}</p>
                  <p className="text-[10px] text-muted-text line-clamp-1">{slide.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-800 relative z-10">
            <div>
              <p className="text-[10px] text-muted-text uppercase font-bold mb-1 tracking-wider">Target Customer</p>
              <p className="text-xs text-white font-medium">{result?.targetCustomer || "Not specified"}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-text uppercase font-bold mb-1 tracking-wider">Revenue Model</p>
              <p className="text-xs text-white font-medium">{result?.revenueModel || "Not specified"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 relative z-10">
            <p className="text-[10px] text-muted-text uppercase font-bold mb-3 tracking-wider">Generate More Slides</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-gray-800/50 rounded-xl px-3 border border-gray-700">
                <span className="text-xs text-gray-500 mr-2">Count:</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={additionalSlidesCount}
                  onChange={(e) => setAdditionalSlidesCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-transparent text-white py-2 text-sm outline-none"
                />
              </div>
              <button
                onClick={handleGenerateMoreSlides}
                disabled={isGeneratingSlides}
                className="bg-accent hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2"
              >
                {isGeneratingSlides ? "..." : "Add Slides"} <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            onClick={handleDownloadPPTX}
            className="mt-6 w-full border border-gray-700 text-gray-400 hover:text-accent hover:border-accent hover:bg-accent/10 rounded-xl py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 relative z-10"
          >
            <Download size={16} /> Download Pitch Deck
          </button>
        </motion.div>

        {/* CARD 3: Investors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-glow rounded-3xl p-8 border border-border/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-green-500 to-green-500/20 rounded-r-full" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 border border-green-500/30">
                <MapIcon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Investors Near You</h3>
                <p className="text-[10px] text-green-400 font-medium uppercase tracking-widest">Network Matches • {selectedCity}</p>
              </div>
            </div>
            <span className="glass3d tag-shimmer text-gray-400 text-[10px] px-2 py-0.5 rounded-full">
              <span>{result?.localInvestors?.length || investors.length} found</span>
            </span>
          </div>
          <p className="text-muted-text text-xs mb-6 flex items-center gap-1 relative z-10">
            📍 {selectedCity} • Local network matches • 98% Match Avg
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto mb-4 custom-scrollbar pr-2 relative z-10">
            {(result?.localInvestors || investors.slice(0, 5)).map((inv, idx) => (
              <div
                key={inv.id || idx}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group/inv cursor-pointer"
                onClick={() => {
                  if (inv.uri) window.open(inv.uri, '_blank');
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-accent shadow-lg shadow-accent/20 group-hover/inv:scale-110 transition-transform">
                    {inv.name?.substring(0, 2).toUpperCase() || inv.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover/inv:text-accent transition-colors">{inv.name}</p>
                    <p className="text-[10px] text-muted-text truncate max-w-[120px]">{inv.fund || inv.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInvestorForMeeting(inv);
                      setActiveTab('scheduler');
                    }}
                    className="text-[10px] bg-accent/20 text-accent hover:bg-accent hover:text-white px-3 py-1 rounded-lg transition-all font-bold border border-accent/30"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('map')}
            className="mt-2 w-full border border-gray-700 text-gray-400 hover:text-success hover:border-success hover:bg-success/10 rounded-xl py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 relative z-10"
          >
            <MapIcon size={16} /> View All on Map
          </button>
        </motion.div>

        {/* CARD 4: Investor Email Draft */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card-glow rounded-3xl p-8 border border-border/30 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-amber-500 to-amber-500/20 rounded-r-full" />

          <div className="flex flex-col gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 border border-amber-500/30">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Email Draft</h3>
                  <p className="text-[10px] text-amber-400 font-medium uppercase tracking-widest">72% Reply probability</p>
                </div>
              </div>

              <div className="p-5 bg-black/40 rounded-2xl border border-gray-800 shadow-inner group/email relative h-36 overflow-hidden">
                <div className="relative z-10">
                  <p className="text-amber-400 text-[10px] font-bold mb-1 truncate">Subject: {result?.investorEmail?.subject || "Investment Opportunity"}</p>
                  <p className="text-gray-400 text-xs italic leading-relaxed line-clamp-3">
                    {result?.investorEmail?.body ? (
                      `"${result.investorEmail.body.substring(0, 150)}..."`
                    ) : (
                      "Drafting response..."
                    )}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-900/10 border border-amber-900/20 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Strength</p>
                  <p className="text-sm font-bold text-amber-400">95%</p>
                </div>
                <div className="p-3 bg-blue-900/10 border border-blue-900/20 rounded-xl text-center">
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Clarity</p>
                  <p className="text-sm font-bold text-blue-400">88%</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('email')}
                className="w-full h-12 bg-accent hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 text-sm"
              >
                Personalize <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Presentation,
  Plus,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
  FileText
} from 'lucide-react';
import { cn } from '../../utils/helpers';

const PPTMaker = ({
  pptData,
  onGenerate,
  isGenerating,
  loadingStep,
  progress,
  prompt,
  setPrompt,
  slidesCount,
  setSlidesCount,
  theme,
  setTheme,
  language,
  setLanguage,
  currentSlideIndex,
  setCurrentSlideIndex,
  showSpeakerNotes,
  setShowSpeakerNotes,
  onDownload,
  onTTS,
  isSpeaking,
  onRegenerate,
  onEditPrompt,
  transition,
  setTransition
}) => {
  const themes = ['🌑 Dark', '🚀 Startup', '💼 Corporate', '☀️ Light', '🎨 Colorful', '💜 Purple'];
  const languages = ['English', 'Hindi', 'Hinglish', 'Spanish', 'French'];

  if (isGenerating) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="relative w-32 h-32 mx-auto mb-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-800 stroke-current"
              strokeWidth="8"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <motion.circle
              className="text-accent stroke-current"
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{progress}%</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Generating your Pitch Deck...</h3>
        <p className="text-muted-text animate-pulse">
          {loadingStep === 0 && "Analyzing your startup idea..."}
          {loadingStep === 1 && "Researching market trends..."}
          {loadingStep === 2 && "Drafting slide content..."}
          {loadingStep === 3 && "Designing layouts..."}
          {loadingStep === 4 && "Finalizing presentation..."}
        </p>
      </div>
    );
  }

  if (pptData) {
    const currentSlide = pptData.slides[currentSlideIndex];

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{pptData.presentationTitle}</h2>
            <p className="text-sm text-muted-text">{pptData.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRegenerate}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-all"
            >
              Regenerate
            </button>
            <button
              onClick={onDownload}
              className="px-6 py-2 bg-accent hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-accent/20 transition-all flex items-center gap-2"
            >
              <Download size={16} /> Download PPTX
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {pptData.slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all group",
                  currentSlideIndex === idx
                    ? "bg-accent/10 border-accent text-white"
                    : "bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold opacity-50">{idx + 1}</span>
                  <span className="text-sm font-medium truncate">{slide.title}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div
              className="aspect-video rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden"
              style={{ backgroundColor: pptData.theme.bgColor }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute inset-0 p-12 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-4xl">{currentSlide.emoji}</span>
                    <h3 className="text-4xl font-bold" style={{ color: pptData.theme.titleColor }}>
                      {currentSlide.title}
                    </h3>
                  </div>

                  <p className="text-xl mb-8 leading-relaxed" style={{ color: pptData.theme.textColor }}>
                    {currentSlide.content}
                  </p>

                  {currentSlide.bulletPoints?.length > 0 && (
                    <ul className="space-y-4 mb-8">
                      {currentSlide.bulletPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3" style={{ color: pptData.theme.textColor }}>
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: pptData.theme.accentColor }} />
                          <span className="text-lg">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {currentSlide.stats?.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-auto">
                      {currentSlide.stats.map((stat, i) => (
                        <div key={i}>
                          <p className="text-3xl font-bold" style={{ color: pptData.theme.accentColor }}>{stat.value}</p>
                          <p className="text-sm opacity-60" style={{ color: pptData.theme.textColor }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                  className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-md border border-white/10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentSlideIndex(Math.min(pptData.slides.length - 1, currentSlideIndex + 1))}
                  className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg backdrop-blur-md border border-white/10"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <FileText size={16} /> Speaker Notes
                </div>
                <button
                  onClick={() => onTTS(currentSlide.speakerNotes)}
                  disabled={isSpeaking}
                  className={cn(
                    "flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 rounded-xl",
                    isSpeaking ? "bg-accent text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <Volume2 size={16} /> {isSpeaking ? "Speaking..." : "Read Aloud"}
                </button>
              </div>
              <p className="text-gray-300 italic leading-relaxed">
                "{currentSlide.speakerNotes}"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-accent">
          <Presentation size={40} />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">AI Pitch Deck Maker</h2>
        <p className="text-muted-text">Professional presentations for your startup in seconds</p>
      </div>

      <div className="bg-gray-900 border border-border rounded-3xl p-8 shadow-2xl">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-accent" /> Describe your Startup
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black/40 border border-border rounded-2xl p-5 text-white focus:border-accent outline-none transition-all resize-none"
              placeholder="Example: A SaaS platform for small retailers in India to manage inventory and payments..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Number of Slides</label>
              <div className="flex items-center gap-4 bg-black/40 border border-border rounded-2xl p-1 px-4">
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={slidesCount}
                  onChange={(e) => setSlidesCount(parseInt(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="w-8 text-center font-bold text-white">{slidesCount}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-black/40 border border-border rounded-2xl px-4 py-3 text-white focus:border-accent outline-none appearance-none"
              >
                {themes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full h-16 bg-accent hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xl rounded-2xl transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
          >
            Create Pitch Deck <Sparkles size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PPTMaker;

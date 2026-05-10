import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, X, Sparkles, Presentation, TrendingUp, Users, Mail, Send, Loader2, Volume2, Quote } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../../utils/helpers';

const ChatPanel = ({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  onSend,
  isLoading,
  onTTS,
  isSpeaking
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-[95]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 120, opacity: 0, scale: 0.99 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 90, opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed left-2 right-2 top-2 bottom-2 sm:left-auto sm:right-4 sm:top-4 sm:bottom-4 sm:w-[min(92vw,680px)] lg:w-[700px] xl:w-[760px] bg-[#050505]/95 backdrop-blur-xl border border-white/10 z-[100] flex flex-col shadow-[0_0_70px_rgba(0,0,0,0.85)] rounded-2xl sm:rounded-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-accent/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/30">
                    <BrainCircuit className="text-accent w-6 h-6" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#0B121F] rounded-full" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">StartWise AI Co-Pilot</h3>
                  <p className="text-[10px] glass3d animate-float-slow tag-shimmer text-accent/90 font-semibold uppercase tracking-widest"><span>Startup Strategy Assistant</span></p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-7 space-y-6 custom-scrollbar">
              {messages.length === 0 && (
                <div className="space-y-8 py-4">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-accent/5 rounded-full flex items-center justify-center mx-auto border border-accent/10">
                      <Sparkles className="text-accent/40 w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-bold text-lg">Welcome, Founder!</h4>
                      <p className="text-sm text-gray-400 px-4 leading-relaxed">
                        Your AI co-pilot for pitch refinement, market analysis, and investor targeting.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <p className="text-[10px] font-bold glass3d tag-shimmer text-gray-400 uppercase tracking-widest px-3 py-1 rounded-lg"><span>Quick Prompts</span></p>
                    {[
                      { icon: Presentation, text: "Review my pitch deck", prompt: "Can you review my current pitch deck and suggest improvements?" },
                      { icon: TrendingUp, text: "Analyze market size", prompt: "Help me calculate the TAM, SAM, and SOM for my startup idea." },
                      { icon: Users, text: "Find target investors", prompt: "Who are the top 5 investors I should target for my startup?" },
                      { icon: Mail, text: "Draft investor email", prompt: "Draft a compelling cold email for a Seed round investor." }
                    ].map((action, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                        onClick={() => setInput(action.prompt)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-accent/35 hover:bg-accent/10 transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-all">
                          <action.icon className="w-4 h-4 text-gray-400 group-hover:text-accent" />
                        </div>
                        <span className="text-xs text-gray-300 group-hover:text-white font-medium">{action.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={cn("flex flex-col gap-2", msg.role === 'user' ? "items-end" : "items-start")}
                >
                  <div className={cn(
                    "max-w-[88%] p-4 sm:p-5 rounded-2xl text-sm sm:text-[15px] leading-relaxed shadow-lg",
                    msg.role === 'user'
                      ? "bg-accent text-white rounded-tr-none"
                      : "bg-gray-800/50 text-gray-200 rounded-tl-none border border-white/5 backdrop-blur-sm"
                  )}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Markdown>
                        {msg.content}
                      </Markdown>
                    </div>
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 px-2">
                      <button
                        onClick={() => onTTS(msg.content)}
                        className={cn(
                          "p-1.5 rounded-lg hover:bg-white/5 transition-all",
                          isSpeaking ? "text-accent" : "text-gray-500"
                        )}
                        title="Listen to response"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[10px] text-accent font-bold uppercase tracking-widest ml-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Thinking...
                  </div>
                  <div className="bg-gray-800/30 p-4 rounded-2xl rounded-tl-none border border-white/5 w-2/3">
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-accent rounded-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-5 sm:p-6 border-t border-white/5 bg-gray-900/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSend()}
                  placeholder="Ask about pitch, market, or investors..."
                  className="w-full bg-gray-800/50 border border-white/10 rounded-2xl pl-4 pr-14 py-4 text-sm sm:text-base text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-gray-500"
                />
                <button
                  onClick={onSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-accent hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:scale-95 shadow-lg shadow-accent/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-500 mt-4">
                StartWise AI can make mistakes. Verify important information.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;

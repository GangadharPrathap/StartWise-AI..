import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Loader2 } from 'lucide-react';
import { cn } from '../utils/helpers';
import CustomCursor from '../components/ui/CustomCursor';
import ChatPanel from '../components/chat/ChatPanel';
import { useChat } from '../hooks/useChat';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthReady, logout } = useAuth();
  const chat = useChat();
  
  const activeTab = location.pathname.split('/')[1] || 'home';

  useEffect(() => {
    const handleOpenChat = () => chat.setIsChatOpen(true);
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, [chat]);

  if (!isAuthReady) {
    return (
      <div className="fixed inset-0 bg-primary-bg z-[200] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg flex selection:bg-accent selection:text-white">
      <CustomCursor />
      {user && (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 pt-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-6 py-4 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 relative z-10 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">SW</div>
                <div>
                  <h1 className="text-white text-xl font-bold tracking-tight">StartWiseAI</h1>
                  <p className="text-[11px] text-gray-400 -mt-1">AI Startup Copilot</p>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-3 relative z-10">
                {[
                  { id: 'home', label: 'Home', path: '/' },
                  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
                  { id: 'map', label: 'Investor Map', path: '/map' },
                  { id: 'history', label: 'History', path: '/history' },
                  { id: 'analyzer', label: 'Idea Analyzer', path: '/analyzer' },
                  { id: 'vc-simulator', label: 'VC Simulator', path: '/vc-simulator' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "relative px-5 py-2.5 rounded-2xl text-sm font-medium transition-all",
                      activeTab === item.id || (item.id === 'home' && activeTab === '')
                        ? "text-white bg-orange-500/20 border border-orange-400/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <button onClick={() => chat.setIsChatOpen(true)} className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white">AI Assistant</button>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => navigate('/profile')} className="hover:ring-2 hover:ring-orange-500/50 rounded-xl transition-all" title="My Profile">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-10 h-10 rounded-xl border border-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                        {(user.displayName || user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                  </button>
                  <button onClick={logout} className="text-gray-400 hover:text-white"><X size={20} /></button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className={`flex-1 ${user ? 'pt-28' : 'pt-4'} p-4 md:p-8 overflow-x-hidden`}>
        <Outlet />
      </main>

      <ChatPanel
        isOpen={chat.isChatOpen} onClose={() => chat.setIsChatOpen(false)}
        messages={chat.chatMessages} input={chat.chatInput} setInput={chat.setChatInput}
        onSend={chat.handleChat} isLoading={chat.isChatLoading}
        onTTS={chat.handleTTS} isSpeaking={chat.isSpeaking}
      />
    </div>
  );
}

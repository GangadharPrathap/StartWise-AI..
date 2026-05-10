import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import './animations.css';
import {
  Home as HomeIcon,
  BarChart3,
  Map as MapIcon,
  Mail,
  Plus,
  CheckCircle2,
  Loader2,
  LogIn,
  User as UserIcon,
  Clock,
  Sparkles,
  Presentation,
  BrainCircuit,
  X
} from 'lucide-react';
import { cn } from './lib/utils';
import PptxGenJS from 'pptxgenjs';
import { investors } from './data';
import confetti from 'canvas-confetti';
import {
  auth,
  db,
  signInWithGoogle,
  logout,
  handleFirestoreError,
  OperationType
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';


// Components
import CustomCursor from './components/CustomCursor';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingOverlay from './components/LoadingOverlay';
import MeetingScheduler from './components/MeetingScheduler';
import MyMeetings from './components/MyMeetings';
import PPTMaker from './components/PPTMaker';
import ChatPanel from './components/ChatPanel';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InvestorMap from './pages/InvestorMap';
import EmailSender from './pages/EmailSender';
import History from './pages/History';

// Helpers
import {
  generateMockDashboard,
  generatePresentationContent
} from './lib/ai-helpers';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split('/')[1] || 'home';

  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [idea, setIdea] = useState('');
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [result, setResult] = useState(null);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedInvestorForMeeting, setSelectedInvestorForMeeting] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedulingSuccess, setSchedulingSuccess] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // PPT State
  const [pptData, setPptData] = useState(null);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [pptLoadingStep, setPptLoadingStep] = useState(0);
  const [pptProgress, setPptProgress] = useState(0);
  const [pptPrompt, setPptPrompt] = useState('');
  const [pptSlidesCount, setPptSlidesCount] = useState(6);
  const [pptTheme, setPptTheme] = useState('🚀 Startup');
  const [pptLanguage, setPptLanguage] = useState('English');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [pptTransition, setPptTransition] = useState('slide');

  const cities = ["Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai"];
  const cityCoords = {
    "Delhi NCR": [28.6139, 77.2090],
    "Mumbai": [19.0760, 72.8777],
    "Bangalore": [12.9716, 77.5946],
    "Hyderabad": [17.3850, 78.4867],
    "Pune": [18.5204, 73.8567],
    "Chennai": [13.0827, 80.2707]
  };

  // Auth & Listeners
  useEffect(() => {
    if (!auth) {
      setIsAuthReady(true);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setIsAuthReady(true);
      if (u && db) {
        try {
          const userRef = doc(db, 'users', u.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              createdAt: serverTimestamp()
            });
          }
        } catch (error) {
          console.error("Firestore error in auth listener:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) { setHistory([]); return; }
    const q = query(collection(db, `users/${user.uid}/kits`), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [user]);

  useEffect(() => {
    if (!user || !db) { setMeetings([]); return; }
    const q = query(collection(db, 'meetings'), where('founderId', '==', user.uid), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setMeetings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [user]);

  // Handlers
  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = generateMockDashboard(idea, selectedCity);
      const finalResult = { ...data, groundingSources: [], city: selectedCity };
      setResult(finalResult);
      if (user) {
        await addDoc(collection(db, `users/${user.uid}/kits`), {
          idea,
          city: selectedCity,
          result: finalResult,
          createdAt: serverTimestamp()
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailTo || !emailSubject || !emailBody) return;
    const mailtoLink = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    setEmailSent(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  const handleGeneratePPT = async () => {
    if (!pptPrompt.trim()) return;
    setIsGeneratingPPT(true);
    setPptLoadingStep(0);
    setPptProgress(0);
    const progressInterval = setInterval(() => {
      setPptProgress(prev => (prev >= 100 ? 100 : prev + 10));
    }, 200);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = generatePresentationContent(pptPrompt, pptSlidesCount, pptTheme, pptLanguage, "Investor Pitch");
      setPptData(data);
      if (user) {
        await addDoc(collection(db, 'pitchDecks'), {
          ...data,
          userId: user.uid,
          prompt: pptPrompt,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("PPT Generation failed", error);
    } finally {
      clearInterval(progressInterval);
      setIsGeneratingPPT(false);
      setPptProgress(100);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/vc/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, context: chatMessages })
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.data.response }]);
      } else {
        throw new Error(data.message || "Failed to process chat");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I am currently unavailable." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleTTS = async (text) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    
    try {
      const response = await fetch('/api/vc/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      
      if (data.status === 'success' && data.data.useBrowserTTS) {
        const utterance = new SpeechSynthesisUtterance(data.data.textToSpeak);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Voice Error:", error);
      setIsSpeaking(false);
    }
  };

  const handleScheduleMeeting = async (meetingData) => {
    if (!user) return;
    setIsScheduling(true);
    try {
      await addDoc(collection(db, 'meetings'), {
        ...meetingData,
        founderId: user.uid,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });
      setSchedulingSuccess(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } catch (error) {
      console.error("Scheduling Error:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDownloadPPTX = () => {
    if (!pptData) return;
    const pptx = new PptxGenJS();
    pptData.slides.forEach(s => {
      const slide = pptx.addSlide();
      slide.addText(s.title, { x: 0.5, y: 0.5, fontSize: 24, bold: true });
      slide.addText(s.content, { x: 0.5, y: 1.5, fontSize: 14 });
    });
    pptx.writeFile({ fileName: `${pptData.presentationTitle}.pptx` });
  };

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
              <button onClick={() => setIsChatOpen(true)} className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white">AI Assistant</button>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              {user ? (
                <div className="flex items-center gap-3">
                  <img src={user.photoURL} alt="" className="w-10 h-10 rounded-xl border border-white/10" />
                  <button onClick={logout} className="text-gray-400 hover:text-white"><X size={20} /></button>
                </div>
              ) : (
                <button onClick={signInWithGoogle} className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium shadow-lg">Login</button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-28 p-4 md:p-8 overflow-x-hidden">
        {isLoading && <LoadingOverlay step={loadingStep} />}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <Home
                idea={idea} setIdea={setIdea}
                cities={cities} selectedCity={selectedCity} setSelectedCity={setSelectedCity}
                handleGenerate={handleGenerate} isLoading={isLoading}
              />
            } />
            <Route path="/dashboard" element={
              <Dashboard
                result={result} idea={idea} selectedCity={selectedCity}
                additionalSlidesCount={3} setAdditionalSlidesCount={() => {}}
                handleGenerateMoreSlides={() => {}} isGeneratingSlides={false}
                handleDownloadPPTX={handleDownloadPPTX} setActiveTab={navigate}
                setSelectedInvestorForMeeting={setSelectedInvestorForMeeting}
                setShowAnalysisModal={setShowAnalysisModal}
              />
            } />
            <Route path="/map" element={
              <InvestorMap
                selectedCity={selectedCity} setSelectedCity={setSelectedCity}
                cities={cities} cityCoords={cityCoords}
                mapType="roadmap" setMapType={() => {}}
                result={result} setSelectedInvestorForModal={() => {}}
                setSelectedInvestor={setSelectedInvestor} selectedInvestor={selectedInvestor}
                setSelectedInvestorForMeeting={setSelectedInvestorForMeeting}
                setActiveTab={navigate}
              />
            } />
            <Route path="/email" element={
              <EmailSender
                emailSent={emailSent} setEmailSent={setEmailSent}
                setActiveTab={navigate} selectedInvestor={selectedInvestor}
                emailSubject={emailSubject} setEmailSubject={setEmailSubject}
                emailTo={emailTo} setEmailTo={setEmailTo}
                emailBody={emailBody} setEmailBody={setEmailBody}
                handleSendEmail={handleSendEmail} isSendingEmail={isSendingEmail}
              />
            } />
            <Route path="/history" element={
              <History
                user={user} history={history}
                signInWithGoogle={signInWithGoogle}
                setActiveTab={navigate} setResult={setResult}
                setIdea={setIdea} setSelectedCity={setSelectedCity}
              />
            } />
            <Route path="/ppt-maker" element={
              <PPTMaker
                pptData={pptData} onGenerate={handleGeneratePPT}
                isGenerating={isGeneratingPPT} loadingStep={pptLoadingStep}
                progress={pptProgress} prompt={pptPrompt} setPrompt={setPptPrompt}
                slidesCount={pptSlidesCount} setSlidesCount={setPptSlidesCount}
                theme={pptTheme} setTheme={setPptTheme}
                language={pptLanguage} setLanguage={setPptLanguage}
                currentSlideIndex={currentSlideIndex} setCurrentSlideIndex={setCurrentSlideIndex}
                showSpeakerNotes={showSpeakerNotes} setShowSpeakerNotes={setShowSpeakerNotes}
                onDownload={handleDownloadPPTX} onTTS={handleTTS}
                isSpeaking={isSpeaking} onRegenerate={handleGeneratePPT}
                onEditPrompt={() => setPptData(null)}
                transition={pptTransition} setTransition={setPptTransition}
              />
            } />
            <Route path="/scheduler" element={
              <MeetingScheduler
                investor={selectedInvestorForMeeting} user={user}
                onSchedule={handleScheduleMeeting} isScheduling={isScheduling}
                success={schedulingSuccess} onBack={() => navigate('/dashboard')}
              />
            } />
            <Route path="/meetings" element={
              <MyMeetings meetings={meetings} onCancel={() => {}} />
            } />
          </Routes>
        </AnimatePresence>
      </main>

      <ChatPanel
        isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}
        messages={chatMessages} input={chatInput} setInput={setChatInput}
        onSend={handleChat} isLoading={isChatLoading}
        onTTS={handleTTS} isSpeaking={isSpeaking}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

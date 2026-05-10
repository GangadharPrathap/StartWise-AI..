import { useState, useCallback } from 'react';
import PptxGenJS from 'pptxgenjs';
import { pitchDeckService } from '../services/pitchDeckService';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export function usePitchDeck() {
  const { user } = useAuth();
  
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

  const handleGeneratePPT = useCallback(async () => {
    if (!pptPrompt.trim()) return;
    setIsGeneratingPPT(true);
    setPptLoadingStep(0);
    setPptProgress(0);
    const progressInterval = setInterval(() => {
      setPptProgress(prev => (prev >= 100 ? 100 : prev + 10));
    }, 200);

    try {
      const data = await pitchDeckService.generatePitchDeck(pptPrompt, pptSlidesCount, pptTheme, pptLanguage, "Investor Pitch");
      setPptData(data);
      if (user && db) {
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
  }, [pptPrompt, pptSlidesCount, pptTheme, pptLanguage, user]);

  const handleDownloadPPTX = useCallback(() => {
    if (!pptData) return;
    const pptx = new PptxGenJS();
    pptData.slides.forEach(s => {
      const slide = pptx.addSlide();
      slide.addText(s.title, { x: 0.5, y: 0.5, fontSize: 24, bold: true });
      slide.addText(s.content, { x: 0.5, y: 1.5, fontSize: 14 });
    });
    pptx.writeFile({ fileName: `${pptData.presentationTitle || 'PitchDeck'}.pptx` });
  }, [pptData]);

  return {
    pptData, setPptData,
    isGeneratingPPT,
    pptLoadingStep,
    pptProgress,
    pptPrompt, setPptPrompt,
    pptSlidesCount, setPptSlidesCount,
    pptTheme, setPptTheme,
    pptLanguage, setPptLanguage,
    currentSlideIndex, setCurrentSlideIndex,
    showSpeakerNotes, setShowSpeakerNotes,
    pptTransition, setPptTransition,
    handleGeneratePPT,
    handleDownloadPPTX
  };
}

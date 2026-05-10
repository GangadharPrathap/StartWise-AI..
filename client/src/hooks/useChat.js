import { useCallback, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useVCStore } from '../store/useVCStore';
import { apiClient } from '../utils/apiClient';

/**
 * Hook for managing structured AI VC Simulator conversation
 */
export function useChat() {
  const { 
    messages, 
    setMessages,
    addMessage, 
    setTyping, 
    setSpeaking, 
    setListening,
    isTyping,
    isSpeaking,
    isListening 
  } = useChatStore();

  const { setScore, setEvaluating, setStatus } = useVCStore();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  /**
   * Start Session
   */
  const startSession = useCallback(async (persona = 'yc') => {
    setTyping(true);
    setStatus('pitching');
    try {
      const response = await apiClient.post('/vc/start-session', { persona });
      const data = response.data;
      
      setMessages([{ role: 'assistant', content: data.response, tone: data.tone }]);
      
      // Auto-TTS for introduction
      handleTTS(data.response, persona);
    } catch (err) {
      console.error("Start Session Error:", err);
    } finally {
      setTyping(false);
    }
  }, [setMessages, setTyping, setStatus]);

  /**
   * Send Message
   */
  const sendMessage = useCallback(async (text, persona = 'yc') => {
    if (!text.trim()) return;

    addMessage({ role: 'user', content: text });
    setTyping(true);

    try {
      const response = await apiClient.post('/vc/chat', { 
        message: text, 
        history: messages,
        persona: persona
      });
      
      const data = response.data;
      addMessage({ 
        role: 'assistant', 
        content: data.response, 
        tone: data.tone,
        confidence: data.confidence,
        metrics: data.metrics 
      });

      // Sync partial metrics to store if available
      if (data.metrics) {
        setScore({ breakdown: data.metrics, overallScore: data.confidence / 10 });
      }

      handleTTS(data.response, persona);
      return data.response;
    } catch (err) {
      console.error("Chat error:", err);
      addMessage({ role: 'assistant', content: "Sorry, I'm losing connection. Can you repeat that?" });
    } finally {
      setTyping(false);
    }
  }, [messages, addMessage, setTyping, setScore]);

  /**
   * Final Evaluation
   */
  const evaluatePitch = useCallback(async (persona = 'yc') => {
    setEvaluating(true);
    setStatus('evaluating');
    try {
      const response = await apiClient.post('/vc/evaluate', { 
        history: messages,
        persona: persona
      });
      setScore(response.data);
      setStatus('finished');
      return response.data;
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setEvaluating(false);
    }
  }, [messages, setScore, setEvaluating, setStatus]);

  /**
   * TTS using Sarvam
   */
  const handleTTS = useCallback(async (text, persona = 'yc') => {
    if (isSpeaking) return;
    setSpeaking(true);
    try {
      const response = await apiClient.post('/vc/text-to-speech', { text, persona });
      const audioUrl = `data:audio/mp3;base64,${response.data.audioContent}`;
      const audio = new Audio(audioUrl);
      audio.onend = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      audio.play();
    } catch (err) {
      console.error("TTS Error:", err);
      setSpeaking(false);
    }
  }, [isSpeaking, setSpeaking]);

  /**
   * Voice STT
   */
  const startRecording = useCallback(async (persona = 'yc') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice.wav');
        setTyping(true);
        setListening(false);
        try {
          const sttRes = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/vc/speech-to-text`, { method: 'POST', body: formData });
          const sttData = await sttRes.json();
          if (sttData.data?.transcript) await sendMessage(sttData.data.transcript, persona);
        } catch (err) {
          console.error("STT error:", err);
        } finally {
          setTyping(false);
        }
      };
      mediaRecorderRef.current.start();
      setListening(true);
    } catch (err) {
      console.error("Recording error:", err);
    }
  }, [sendMessage, setListening, setTyping]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
  }, []);

  return {
    messages,
    isTyping,
    isSpeaking,
    isListening,
    startSession,
    sendMessage,
    evaluatePitch,
    handleTTS,
    startRecording,
    stopRecording
  };
}

import { create } from 'zustand';

/**
 * Chat Store for VC Simulator and Assistant
 */
export const useChatStore = create((set) => ({
  messages: [
    { role: 'assistant', content: "Hello Founder. I am the StartWise AI VC. I've invested in over 50 unicorns. Pitch me your idea, or ask for a critical evaluation of your business model." }
  ],
  isTyping: false,
  isSpeaking: false,
  isListening: false,
  voiceProvider: 'browser', // or 'sarvam'

  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setTyping: (isTyping) => set({ isTyping }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setListening: (isListening) => set({ isListening }),
  clearChat: () => set({ 
    messages: [{ role: 'assistant', content: "Hello Founder. How can I help you today?" }] 
  }),
}));

import { create } from 'zustand';

/**
 * VC Store for Session specific states (scoring, evaluation)
 */
export const useVCStore = create((set) => ({
  sessionScore: null,
  isEvaluating: false,
  feedback: '',
  sessionStatus: 'idle', // 'idle', 'pitching', 'evaluating', 'finished'

  setScore: (score) => set({ sessionScore: score }),
  setEvaluating: (isEvaluating) => set({ isEvaluating }),
  setFeedback: (feedback) => set({ feedback }),
  setStatus: (status) => set({ sessionStatus: status }),
  resetSession: () => set({ 
    sessionScore: null, 
    isEvaluating: false, 
    feedback: '', 
    sessionStatus: 'idle' 
  }),
}));

import { create } from 'zustand';

/**
 * Roadmap Store for Execution Plans and Progress Tracking
 */
export const useRoadmapStore = create((set) => ({
  roadmapData: null,
  activeTab: 'roadmap',
  isGenerating: false,
  completionStatus: {}, // { taskId: boolean }

  setRoadmapData: (data) => set({ roadmapData: data }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  updateTaskStatus: (taskId, completed) => set((state) => ({
    completionStatus: { ...state.completionStatus, [taskId]: completed }
  })),
  resetRoadmap: () => set({ 
    roadmapData: null, 
    activeTab: 'roadmap', 
    completionStatus: {} 
  }),
}));

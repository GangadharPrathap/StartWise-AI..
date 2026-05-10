import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useRoadmapStore } from '../store/useRoadmapStore';
import { useAuth } from '../contexts/AuthContext';
import { aiService } from '../services/aiService';

/**
 * Hook for managing startup idea analysis logic
 */
export function useIdeaAnalysis() {
  const { user } = useAuth();
  const store = useAppStore();
  const roadmapStore = useRoadmapStore();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyzeIdea = useCallback(async () => {
    if (!store.idea.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Parallel execution for better performance
      const [analysisData, roadmapData] = await Promise.all([
        aiService.analyzeIdea(store.idea, store.selectedCity),
        aiService.generateRoadmap({
          idea_text: store.idea,
          student_year: "Founding Team",
          existing_skills: ["Product Strategy", "Market Analysis"],
          timeline_preference: "Aggressive",
          idea_type: "Tech Startup"
        })
      ]);

      const finalResult = { 
        ...analysisData, 
        groundingSources: [], 
        city: store.selectedCity 
      };
      
      // Update Analysis Store
      store.setResult(finalResult);
      
      // Update Roadmap Store
      const formattedRoadmap = { roadmap: roadmapData, domain_analysis: null };
      roadmapStore.setRoadmapData(formattedRoadmap);
      sessionStorage.setItem('startwise_roadmap_data', JSON.stringify(formattedRoadmap));

      await store.addHistoryItem(user, { 
        idea: store.idea, 
        city: store.selectedCity, 
        result: finalResult 
      });
      
      navigate('/roadmap');
    } catch (err) {
      console.error("Generation failed:", err);
      setError(err.message || "Failed to analyze idea. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [store.idea, store.selectedCity, store.setResult, store.addHistoryItem, navigate, user, roadmapStore]);

  return {
    analyzeIdea,
    isAnalyzing,
    error,
    idea: store.idea,
    setIdea: store.setIdea,
    selectedCity: store.selectedCity,
    setSelectedCity: store.setSelectedCity,
    result: store.result
  };
}

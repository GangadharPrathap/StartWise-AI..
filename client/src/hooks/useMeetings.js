import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useAuth } from '../contexts/AuthContext';
import confetti from 'canvas-confetti';

/**
 * Hook for managing meeting scheduling and sessions
 */
export function useMeetings() {
  const { user } = useAuth();
  const store = useAppStore();
  const [isScheduling, setIsScheduling] = useState(false);
  const [schedulingSuccess, setSchedulingSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleScheduleMeeting = useCallback(async (meetingData) => {
    setIsScheduling(true);
    setError(null);
    setSchedulingSuccess(false);
    
    try {
      await store.addMeeting(user, meetingData);
      setSchedulingSuccess(true);
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 } 
      });
    } catch (err) {
      console.error("Scheduling Error:", err);
      setError(err.message || "Failed to schedule meeting.");
    } finally {
      setIsScheduling(false);
    }
  }, [store.addMeeting]);

  const resetStatus = useCallback(() => {
    setSchedulingSuccess(false);
    setError(null);
  }, []);

  return {
    handleScheduleMeeting,
    isScheduling,
    schedulingSuccess,
    error,
    resetStatus,
    meetings: store.meetings,
    selectedInvestorForMeeting: store.selectedInvestorForMeeting
  };
}

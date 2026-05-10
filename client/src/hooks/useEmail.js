import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

/**
 * Hook for managing investor email drafting and sending
 */
export function useEmail() {
  const [emailSent, setEmailSent] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleSendEmail = useCallback(async () => {
    if (!emailTo || !emailSubject || !emailBody) return;
    
    // In a real SaaS, this would use a backend API or a client-side mailto
    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    setEmailSent(true);
    confetti({ 
      particleCount: 150, 
      spread: 70, 
      origin: { y: 0.6 } 
    });
  }, [emailTo, emailSubject, emailBody]);

  return {
    emailTo,
    setEmailTo,
    emailSubject,
    setEmailSubject,
    emailBody,
    setEmailBody,
    emailSent,
    setEmailSent,
    handleSendEmail
  };
}

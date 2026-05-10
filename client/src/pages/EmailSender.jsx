import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, X, Copy, Send } from 'lucide-react';
import { cn } from '../utils/helpers';

const EmailSender = ({
  emailSent,
  setEmailSent,
  setActiveTab,
  selectedInvestor,
  emailSubject,
  setEmailSubject,
  emailTo,
  setEmailTo,
  emailBody,
  setEmailBody,
  handleSendEmail,
  isSendingEmail
}) => {
  return (
    <motion.div
      key="email"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-8">✉️ Send Investor Email</h2>

      {emailSent ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 border border-border rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-3xl font-bold text-white mb-2">Email bhej diya! ✅</h3>
          <p className="text-muted-text mb-8">{selectedInvestor?.name || "Investor"} ko email send ho gaya</p>
          <button
            onClick={() => {
              setEmailSent(false);
              setActiveTab('dashboard');
            }}
            className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all"
          >
            Back to Dashboard
          </button>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-800 z-0" />
            {[
              { step: 1, label: 'Choose Investor', status: 'completed' },
              { step: 2, label: 'Edit Email', status: 'active' },
              { step: 3, label: 'Send', status: 'upcoming' }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                  s.status === 'completed' ? "bg-accent text-white" :
                    s.status === 'active' ? "bg-accent text-white ring-4 ring-accent/20" : "bg-gray-800 text-gray-500"
                )}>
                  {s.status === 'completed' ? <CheckCircle2 size={16} /> : s.step}
                </div>
                <span className={cn("text-[10px] font-medium", s.status === 'upcoming' ? "text-gray-500" : "text-white")}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-2xl border border-border overflow-hidden">
            <div className="p-4 bg-gray-800/30 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-muted-text text-xs">Sending to:</span>
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: selectedInvestor?.color || '#3B82F6' }}>
                    {selectedInvestor?.initials || 'AM'}
                  </div>
                  <span className="text-xs text-white font-medium">{selectedInvestor?.name || "Anupam Mittal"}</span>
                </div>
              </div>
              <button onClick={() => setActiveTab('map')} className="text-accent text-xs font-medium hover:underline">Change Investor</button>
            </div>

            <div className="p-0">
              <div className="flex items-center gap-4 p-4 border-b border-border">
                <span className="text-gray-500 text-xs w-16">Subject</span>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="bg-transparent text-white text-sm flex-1 outline-none"
                />
              </div>
              <div className="flex items-center gap-4 p-4 border-b border-border">
                <span className="text-gray-500 text-xs w-16">To</span>
                <input
                  type="text"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="bg-transparent text-white text-sm flex-1 outline-none"
                />
              </div>
              <div className="p-4">
                <textarea
                  rows={12}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-transparent text-gray-300 text-sm outline-none resize-none leading-relaxed"
                />
              </div>
              <div className="p-3 border-t border-border bg-gray-800/20 flex items-center justify-between">
                <span className="text-gray-600 text-[10px] italic">— Sent via StartWise AI</span>
                <span className="text-gray-600 text-[10px]">{emailBody.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button className="flex-1 border border-gray-700 text-gray-300 hover:bg-white/5 rounded-xl py-4 font-medium transition-all flex items-center justify-center gap-2">
              <Copy size={18} /> Save Draft
            </button>
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="flex-[2] bg-accent text-white hover:bg-blue-500 rounded-xl py-4 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50"
            >
              {isSendingEmail ? "Sending..." : "Send Now 🚀"}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default EmailSender;

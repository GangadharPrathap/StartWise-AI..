import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Monitor, MapPin, Clock, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { investors } from '../data';
import confetti from 'canvas-confetti';

const MyMeetings = ({
  meetings,
  onCancel
}) => {
  const [reminders, setReminders] = useState({});

  const handleSetReminder = (id) => {
    setReminders(prev => ({ ...prev, [id]: true }));
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#4ade80', '#3b82f6']
    });
  };

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-6">
          <Calendar className="w-10 h-10 text-muted-text" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Meetings Scheduled</h3>
        <p className="text-muted-text max-w-xs">
          Aapne abhi tak koi meeting schedule nahi ki hai. Investors se connect karne ke liye "Book Meeting" par click karein.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">My Meetings</h2>
          <p className="text-sm text-muted-text">Track your upcoming and past investor sessions</p>
        </div>
        <div className="px-4 py-2 glass3d animate-pulse-glow border border-accent/20 rounded-lg text-accent text-xs font-medium">
          <span>{meetings.length} Total Sessions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map((meeting) => {
          const investor = investors.find(i => i.id === meeting.investorId);
          const isCancelled = meeting.status === 'cancelled';

          return (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-gray-900/50 border rounded-2xl overflow-hidden flex flex-col",
                isCancelled ? "border-gray-800 opacity-60" : "border-gray-800"
              )}
            >
              {/* Top Bar */}
              <div className={cn(
                "h-1.5 w-full",
                meeting.meetingType === 'online' ? "bg-blue-500" : "bg-green-500"
              )} />

              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ backgroundColor: investor?.color || '#333' }}>
                      {investor?.initials || '??'}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{investor?.name || 'Unknown Investor'}</h4>
                      <p className="text-[10px] text-muted-text">{investor?.fund || 'Venture Capital'}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider glass3d tag-shimmer",
                    isCancelled ? "text-red-400" : "text-green-400"
                  )}>
                    <span>{meeting.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-text uppercase font-medium">Date & Time</div>
                    <div className="flex items-center gap-2 text-xs text-white">
                      <Calendar className="w-3 h-3 text-accent" />
                      {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {meeting.time}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-text uppercase font-medium">Type</div>
                    <div className="flex items-center gap-2 text-xs text-white">
                      {meeting.meetingType === 'online' ? (
                        <Monitor className="w-3 h-3 text-blue-400" />
                      ) : (
                        <MapPin className="w-3 h-3 text-green-400" />
                      )}
                      {meeting.meetingType === 'online' ? 'Virtual' : 'In-Person'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-[10px] text-muted-text uppercase font-medium">Agenda</div>
                  <p className="text-[11px] text-gray-300 line-clamp-2 italic">
                    "{meeting.agenda}"
                  </p>
                </div>

                {meeting.meetLink && !isCancelled && (
                  <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-xl flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] text-blue-300 font-medium">Google Meet Link Ready</span>
                    </div>
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Join Now
                    </a>
                  </div>
                )}

                {meeting.meetingType === 'offline' && !isCancelled && (
                  <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="text-[10px] text-green-300 font-medium">Office Location</span>
                    </div>
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(investor?.officeAddress || '')}`, '_blank')}
                      className="text-[10px] bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Directions
                    </button>
                  </div>
                )}
              </div>

              {!isCancelled && (
                <div className="px-6 py-4 bg-black/20 border-t border-gray-800 flex justify-between items-center">
                  <button
                    onClick={() => handleSetReminder(meeting.id)}
                    disabled={reminders[meeting.id]}
                    className={cn(
                      "text-[10px] flex items-center gap-1 transition-all px-3 py-1.5 rounded-lg",
                      reminders[meeting.id]
                        ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                        : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 cursor-pointer"
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    {reminders[meeting.id] ? "Reminder Set ✓" : "Set Reminder"}
                  </button>
                  <button
                    onClick={() => onCancel(meeting.id)}
                    className="text-[10px] text-red-400 hover:bg-red-500/10 flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyMeetings;

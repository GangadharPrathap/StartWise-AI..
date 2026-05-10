import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const MeetingScheduler = ({
  investor,
  user,
  onSchedule,
  isScheduling,
  success,
  onBack
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    meetingType: 'online',
    agenda: '',
    startupName: '',
    founderName: user?.displayName || '',
    founderEmail: user?.email || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule({
      ...formData,
      investorId: investor.id,
      investorName: investor.name,
      investorEmail: investor.email
    });
  };

  if (success) {
    return (
      <div className="bg-gray-900 border border-border rounded-2xl p-12 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-3xl font-bold text-white mb-2">Meeting Scheduled! ✅</h3>
        <p className="text-muted-text mb-8">Aapki meeting {investor.name} ke saath confirm ho gayi hai. Check your email for details.</p>
        <button
          onClick={onBack}
          className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-text hover:text-white mb-8 transition-colors"
      >
        <ChevronLeft size={20} /> Back
      </button>

      <div className="bg-gray-900 border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-border bg-gradient-to-r from-accent/10 to-transparent">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-3xl font-bold text-white">
              {investor.name?.substring(0, 2).toUpperCase() || investor.initials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Book a meeting with {investor.name}</h2>
              <p className="text-muted-text">{investor.fund} • {investor.city}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-black/40 border border-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-black/40 border border-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-accent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Meeting Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, meetingType: 'online' })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border transition-all",
                  formData.meetingType === 'online' ? "border-accent bg-accent/10 text-white" : "border-border bg-black/20 text-gray-500 hover:border-gray-700"
                )}
              >
                <Video size={18} /> Online
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, meetingType: 'offline' })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border transition-all",
                  formData.meetingType === 'offline' ? "border-accent bg-accent/10 text-white" : "border-border bg-black/20 text-gray-500 hover:border-gray-700"
                )}
              >
                <MapPin size={18} /> In-Person
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Startup Name</label>
            <input
              type="text"
              required
              value={formData.startupName}
              onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
              className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
              placeholder="Your startup name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Agenda</label>
            <textarea
              required
              rows={4}
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              className="w-full bg-black/40 border border-border rounded-xl px-4 py-3 text-white focus:border-accent outline-none resize-none"
              placeholder="What would you like to discuss?"
            />
          </div>

          <button
            type="submit"
            disabled={isScheduling}
            className="w-full bg-accent hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            {isScheduling ? "Scheduling..." : "Confirm Meeting Request 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MeetingScheduler;

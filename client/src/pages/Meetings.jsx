import { motion } from 'framer-motion'
import { Calendar, Users, Clock, CheckCircle, Plus, MapPin } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { pageVariants, childVariants, cardVariants } from '../animations/pageTransitions'
import { Card, Badge } from '../components/ui/index.jsx'

export default function Meetings() {
  const { meetings } = useAppStore()

  const statusColors = {
    confirmed: 'success',
    pending: 'warning',
    cancelled: 'danger',
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto space-y-10"
    >
      <motion.div variants={childVariants} className="flex items-center justify-between">
        <div>
          <Badge>Investor Calendar</Badge>
          <h1 className="text-4xl font-black text-white mt-4 tracking-tight uppercase italic">
            Meeting <span className="text-accent">Hub.</span>
          </h1>
          <p className="text-gray-500 mt-2">Manage your investor engagements and sessions.</p>
        </div>
      </motion.div>

      {meetings.length === 0 ? (
        <motion.div variants={childVariants}>
          <Card className="p-16 text-center">
            <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <h3 className="text-xl font-black text-white mb-2">No Meetings Scheduled</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Use the Investor Scout to find investors and book your first meeting.
            </p>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting, i) => (
            <motion.div key={meeting.id || i} variants={cardVariants}>
              <Card className="p-6 flex items-center gap-6 hover:border-white/10">
                <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Users className="text-accent" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{meeting.investorName || 'Investor Meeting'}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      <Clock size={10} /> {meeting.scheduledAt ? new Date(meeting.scheduledAt?.seconds * 1000).toLocaleString() : 'TBD'}
                    </span>
                    {meeting.city && (
                      <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <MapPin size={10} /> {meeting.city}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={statusColors[meeting.status] || 'primary'}>
                  {meeting.status || 'confirmed'}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

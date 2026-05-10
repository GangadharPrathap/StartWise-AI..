import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, CheckCircle2, Search, BrainCircuit } from 'lucide-react'
import { roadmapService } from '../services/roadmapService'

const SKILLS = [
  'Python','JavaScript','React','Node.js','Machine Learning',
  'Deep Learning','Flutter','Android','iOS','SQL','MongoDB',
  'Arduino','Raspberry Pi','SolidWorks','AutoCAD','MATLAB',
  'Circuit Design','3D Printing','Business Planning','UI/UX Design',
]

const IDEA_TYPES = [
  { value: 'software',  label: 'Software / App',     icon: '⚡' },
  { value: 'hardware',  label: 'Hardware / Physical', icon: '⚙️' },
  { value: 'hybrid',    label: 'Hardware + Software', icon: '🔗' },
  { value: 'service',   label: 'Service / Platform',  icon: '🌐' },
]

const TIMELINES = [
  { value: 'fast',     label: 'Fast Track', weeks: '12–16 wks' },
  { value: 'standard', label: 'Standard',   weeks: '20–28 wks' },
  { value: 'thorough', label: 'Deep Dive',  weeks: '32–40 wks' },
]

const PRIORITY_COLOR = {
  primary:        { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)', text: '#a78bfa' },
  secondary:      { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)',  text: '#34d399' },
  'cross-domain': { bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.25)',  text: '#fbbf24' },
}

const CATEGORY_COLOR = {
  technical:  '#60a5fa',
  business:   '#34d399',
  scientific: '#f472b6',
  legal:      '#fca5a5',
  design:     '#fb923c',
  social:     '#22d3ee',
}

function DomainCard({ domain, index }) {
  const pc = PRIORITY_COLOR[domain.priority] || PRIORITY_COLOR.secondary
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-900/50 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors">
          {domain.name}
        </h4>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full border" 
          style={{ borderColor: pc.border, backgroundColor: pc.bg, color: pc.text }}>
          {domain.priority}
        </span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-6">
        {domain.reason}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: CATEGORY_COLOR[domain.category] || '#9ca3af' }}>
          {domain.category}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: `${domain.confidence * 100}%` }} />
          </div>
          <span className="text-[10px] text-gray-500">{Math.round(domain.confidence * 100)}%</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function IdeaAnalyzer() {
  const navigate = useNavigate()
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [idea, setIdea] = useState('')
  const [year, setYear] = useState(3)
  const [skills, setSkills] = useState([])
  const [timeline, setTimeline] = useState('standard')
  const [ideaType, setIdeaType] = useState('software')
  const [results, setResults] = useState(null)

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const data = await roadmapService.suggestDomains(idea)
      setResults(data)
      setStep('domains')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateRoadmap = async () => {
    setLoading(true)
    try {
      const data = await roadmapService.generateRoadmap({
        idea_text: idea,
        student_year: year,
        existing_skills: skills,
        timeline_preference: timeline,
        idea_type: ideaType
      })
      const payload = {
        status: 'success',
        roadmap: data,
        domain_analysis: results
      }
      sessionStorage.setItem('startwise_roadmap_data', JSON.stringify(payload))
      navigate('/roadmap')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Idea <span className="text-orange-500">Analyzer</span>
        </h1>
        <p className="text-gray-400">Deep domain analysis and strategic roadmap generation for your startup idea.</p>
      </div>

      {step === 'form' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-glow rounded-3xl p-8 border border-white/10"
        >
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Startup Idea</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your idea in detail..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-orange-500 outline-none transition-all h-32"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Your Year</label>
                <select 
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Idea Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {IDEA_TYPES.map(t => (
                    <button 
                      key={t.value}
                      onClick={() => setIdeaType(t.value)}
                      className={`px-3 py-2 rounded-xl border text-[10px] font-bold transition-all ${ideaType === t.value ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${skills.includes(s) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || idea.length < 20}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <BrainCircuit className="animate-spin" /> : <Search size={18} />}
              Analyze Idea Domains
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-6 flex gap-4">
            <div className="w-1 bg-orange-500 rounded-full" />
            <div>
              <h3 className="text-orange-400 font-bold mb-1 uppercase tracking-widest text-xs">Domain Analysis Result</h3>
              <p className="text-gray-300 text-sm">{results.reasoning_summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.domains.map((d, i) => <DomainCard key={i} domain={d} index={i} />)}
          </div>

          <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-3xl border border-white/10">
            <div>
              <p className="text-white font-bold">Ready for the Roadmap?</p>
              <p className="text-xs text-gray-500">Generate a step-by-step execution plan based on these domains.</p>
            </div>
            <button
              onClick={handleGenerateRoadmap}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              {loading ? "Generating..." : "Generate Roadmap"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
